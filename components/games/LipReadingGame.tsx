"use client";
import React, { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────
type Phase       = "intro" | "loading" | "lesson" | "p1" | "p2" | "final" | "done";
type Letter      = "B" | "E" | "A" | "T";
type LessonStage = "teach" | "try" | "confirmed";

const LETTERS: readonly Letter[] = ["B", "E", "A", "T"];

const LESSON_DATA: Record<Letter, { name: string; cue: string; detail: string }> = {
  B: {
    name:   "B — Press",
    cue:    "Press both lips firmly together",
    detail: "Zero gap. Lips sealed completely. Like the moment just before saying 'B'.",
  },
  E: {
    name:   "E — Spread",
    cue:    "Spread lips wide, show your teeth",
    detail: "Pull corners sideways into a wide grin. Upper and lower teeth visible.",
  },
  A: {
    name:   "A — Open",
    cue:    "Drop jaw wide open — say 'Ahh'",
    detail: "Maximum opening. Tongue flat. Like a doctor checking your throat.",
  },
  T: {
    name:   "T — Tiny gap",
    cue:    "Small gap, tongue near upper teeth",
    detail: "Just a sliver of space — not smiling, not open. Neutral and slight.",
  },
};

// Practice 1: quick-fire sequence
const P1_SEQ: Letter[] = ["B", "E", "A", "T", "A", "B", "T", "E"];

// Practice 2: spell this word
const P2_WORD = "BET";

// Final: type these words
const FINAL_WORDS = ["BEAT", "TAB"];

// How long the user must hold the correct shape (ms)
const HOLD_MS = 900;

// Thresholds (ratios relative to face size — tune if needed)
const TH = {
  B_maxOpen: 0.045,  // pressed: tiny/no gap
  A_minOpen: 0.155,  // wide open
  E_minWide: 0.58,   // spread smile
  T_maxOpen: 0.110,  // slight gap (between B and A)
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MediaPipe globals
// ─────────────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    FaceMesh: any;
    Camera:   any;
  }
}

function classifyLandmarks(lms: any[]): Letter | null {
  if (!lms || lms.length < 468) return null;

  const ul  = lms[13];   // inner upper lip
  const ll  = lms[14];   // inner lower lip
  const lc  = lms[61];   // left mouth corner
  const rc  = lms[291];  // right mouth corner
  const top = lms[10];   // forehead
  const bot = lms[152];  // chin
  const lt  = lms[234];  // left temple
  const rt  = lms[454];  // right temple

  const faceH = Math.abs(bot.y - top.y);
  const faceW = Math.abs(rt.x  - lt.x);
  if (faceH < 0.08 || faceW < 0.08) return null; // face too far / not found

  const openRatio = Math.abs(ll.y - ul.y) / faceH;
  const wideRatio = Math.abs(rc.x - lc.x) / faceW;

  if (openRatio < TH.B_maxOpen)                               return "B";
  if (openRatio > TH.A_minOpen)                              return "A";
  if (wideRatio > TH.E_minWide && openRatio < TH.A_minOpen)  return "E";
  if (openRatio < TH.T_maxOpen)                              return "T";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hold-progress ring
// ─────────────────────────────────────────────────────────────────────────────
function HoldRing({
  pct, target, confirmed, detected,
}: {
  pct: number; target: Letter | ""; confirmed: boolean; detected: Letter | null;
}) {
  const r    = 50;
  const circ = 2 * Math.PI * r;
  const isMatch = target !== "" && detected === target;

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <div className={`absolute inset-0 rounded-full flex items-center justify-center
                       text-5xl font-black transition-all duration-300 ${
        confirmed
          ? "bg-[#FF7124] text-white shadow-[0_0_40px_rgba(255,113,36,0.55)]"
          : isMatch
            ? "bg-[#FF7124]/20 border-2 border-[#FF7124] text-[#FF7124]"
            : "bg-[#FF7124]/10 border-2 border-[#FF7124]/25 text-[#FF7124]/50"
      }`}>
        {confirmed ? "✓" : target}
      </div>

      {!confirmed && pct > 0 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112"
          style={{ transform: "rotate(-90deg)" }}>
          <circle cx={56} cy={56} r={r} fill="none" stroke="#FF7124"
            strokeWidth={5} strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * circ} ${circ}`} opacity={0.9}/>
        </svg>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Camera pane
// ─────────────────────────────────────────────────────────────────────────────
function CamPane({
  videoRef, detected, target,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  detected: Letter | null;
  target:   Letter | "";
}) {
  const isMatch = target !== "" && detected === target;

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#0a121d] flex-shrink-0 transition-all duration-200"
      style={{
        width:  240,
        height: 180,
        border: `1.5px solid ${isMatch ? "rgba(255,113,36,0.65)" : "rgba(244,241,236,0.08)"}`,
        boxShadow: isMatch ? "0 0 20px rgba(255,113,36,0.15)" : "none",
      }}>

      <video ref={videoRef} autoPlay playsInline muted
        className="w-full h-full object-cover scale-x-[-1]"/>

      {/* Mouth-area guide oval */}
      <div className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none">
        <div className="w-[4.5rem] h-10 rounded-[50%] border transition-colors duration-300"
          style={{ borderColor: isMatch ? "rgba(255,113,36,0.75)" : "rgba(255,113,36,0.2)" }}/>
      </div>

      {/* Live detection label */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
          isMatch
            ? "bg-[#FF7124]/40 text-[#FF7124]"
            : detected
              ? "bg-[#F4F1EC]/10 text-[#F4F1EC]/55"
              : "bg-[#F4F1EC]/5 text-[#F4F1EC]/20"
        }`}>
          {detected ? `Sees: ${detected}` : "No face"}
        </span>
      </div>

      {/* Scanning line */}
      <div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg,transparent,rgba(255,113,36,0.45),transparent)",
          animation:  "scanLine 1.4s ease-in-out infinite",
        }}/>
      <style>{`@keyframes scanLine{0%,100%{top:20%}50%{top:75%}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function LipReadingGame() {
  const [phase,       setPhase]       = useState<Phase>("intro");
  const [lessonIdx,   setLessonIdx]   = useState(0);
  const [lessonStage, setLessonStage] = useState<LessonStage>("teach");
  const [p1Idx,       setP1Idx]       = useState(0);
  const [wordIdx,     setWordIdx]     = useState(0);
  const [letterIdx,   setLetterIdx]   = useState(0);
  const [holdPct,     setHoldPct]     = useState(0);
  const [detected,    setDetected]    = useState<Letter | null>(null);
  const [camError,    setCamError]    = useState<string | null>(null);
  const [loadMsg,     setLoadMsg]     = useState("Initialising…");

  const videoRef      = useRef<HTMLVideoElement>(null);
  const streamRef     = useRef<MediaStream | null>(null);
  const faceMeshRef   = useRef<any>(null);
  const cameraUtilRef = useRef<any>(null);

  // Mutable refs — callbacks always read fresh values without stale closures
  const targetRef    = useRef<Letter | null>(null);
  const onDoneRef    = useRef<(() => void) | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const phaseRef     = useRef<Phase>("intro");

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => () => stopCamera(), []);

  // ── Camera ────────────────────────────────────────────────────────────────
  async function startCamera(): Promise<boolean> {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return true;
    } catch {
      setCamError("Camera access denied — allow camera and try again.");
      return false;
    }
  }

  function stopCamera() {
    try { cameraUtilRef.current?.stop?.(); } catch { /* ignore */ }
    try { faceMeshRef.current?.close?.();  } catch { /* ignore */ }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current   = null;
    faceMeshRef.current = null;
  }

  // ── MediaPipe ────────────────────────────────────────────────────────────
  function loadScript(src: string): Promise<void> {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement("script");
      s.src = src; s.crossOrigin = "anonymous";
      s.onload = () => res(); s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function initFaceMesh() {
    const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619";
    const fm  = new window.FaceMesh({ locateFile: (f: string) => `${CDN}/${f}` });

    fm.setOptions({
      maxNumFaces:            1,
      refineLandmarks:        false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence:  0.5,
    });

    fm.onResults((results: any) => {
      const lms = results.multiFaceLandmarks?.[0] ?? null;
      const det = lms ? classifyLandmarks(lms) : null;
      setDetected(det);
      processDetection(det);
    });

    faceMeshRef.current = fm;

    const cam = new window.Camera(videoRef.current!, {
      onFrame: async () => {
        if (faceMeshRef.current && videoRef.current) {
          try { await faceMeshRef.current.send({ image: videoRef.current }); }
          catch { /* ignore */ }
        }
      },
      width: 320, height: 240,
    });
    cam.start();
    cameraUtilRef.current = cam;
  }

  // ── Detection engine ──────────────────────────────────────────────────────
  function processDetection(det: Letter | null) {
    const p = phaseRef.current;
    if (p === "intro" || p === "loading" || p === "done") return;

    const target = targetRef.current;
    const onDone = onDoneRef.current;
    if (!target || !onDone) return;

    if (det === target) {
      if (holdStartRef.current === null) holdStartRef.current = Date.now();
      const held = Date.now() - holdStartRef.current;
      setHoldPct(Math.min((held / HOLD_MS) * 100, 100));
      if (held >= HOLD_MS) {
        // Shape held long enough — clear and advance
        targetRef.current    = null;
        onDoneRef.current    = null;
        holdStartRef.current = null;
        setHoldPct(0);
        onDone();
      }
    } else {
      holdStartRef.current = null;
      setHoldPct(0);
    }
  }

  function awaitShape(letter: Letter, onDone: () => void) {
    targetRef.current    = letter;
    onDoneRef.current    = onDone;
    holdStartRef.current = null;
    setHoldPct(0);
  }

  function clearTarget() {
    targetRef.current    = null;
    onDoneRef.current    = null;
    holdStartRef.current = null;
    setHoldPct(0);
  }

  // ── Phase runners ──────────────────────────────────────────────────────────
  async function begin() {
    setPhase("loading");
    setLoadMsg("Requesting camera…");
    const ok = await startCamera();
    if (!ok) { setPhase("intro"); return; }

    setLoadMsg("Loading face detection…");
    try {
      const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe";
      await Promise.all([
        loadScript(`${CDN}/face_mesh@0.4.1633559619/face_mesh.js`),
        loadScript(`${CDN}/camera_utils@0.3.1632090989/camera_utils.js`),
      ]);
      initFaceMesh();
    } catch {
      setCamError("Failed to load face detection — check your internet.");
      stopCamera();
      setPhase("intro");
      return;
    }

    setPhase("lesson");
    setLessonIdx(0);
    setLessonStage("teach");
  }

  function tryLesson() {
    setLessonStage("try");
    awaitShape(LETTERS[lessonIdx], () => setLessonStage("confirmed"));
  }

  function nextLesson() {
    clearTarget();
    const next = lessonIdx + 1;
    if (next < LETTERS.length) {
      setLessonIdx(next);
      setLessonStage("teach");
    } else {
      setPhase("p1");
      runP1(0);
    }
  }

  function runP1(idx: number) {
    setP1Idx(idx);
    awaitShape(P1_SEQ[idx], () => {
      const next = idx + 1;
      if (next >= P1_SEQ.length) {
        clearTarget();
        setPhase("p2");
        runP2(0);
      } else {
        runP1(next);
      }
    });
  }

  function runP2(li: number) {
    setLetterIdx(li);
    awaitShape(P2_WORD[li] as Letter, () => {
      const next = li + 1;
      if (next >= P2_WORD.length) {
        clearTarget();
        setPhase("final");
        setWordIdx(0);
        runFinal(0, 0);
      } else {
        runP2(next);
      }
    });
  }

  function runFinal(wi: number, li: number) {
    setWordIdx(wi); setLetterIdx(li);
    const word = FINAL_WORDS[wi];
    awaitShape(word[li] as Letter, () => {
      const nli = li + 1;
      if (nli >= word.length) {
        const nwi = wi + 1;
        if (nwi >= FINAL_WORDS.length) {
          clearTarget();
          stopCamera();
          setPhase("done");
        } else {
          runFinal(nwi, 0);
        }
      } else {
        runFinal(wi, nli);
      }
    });
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentTarget: Letter | "" = (() => {
    if (phase === "lesson" && lessonStage !== "teach") return LETTERS[lessonIdx];
    if (phase === "p1")    return P1_SEQ[p1Idx];
    if (phase === "p2")    return P2_WORD[letterIdx] as Letter;
    if (phase === "final") return (FINAL_WORDS[wordIdx]?.[letterIdx] ?? "") as Letter | "";
    return "";
  })();

  const confirmed = phase === "lesson" && lessonStage === "confirmed";

  // Shared camera + ring layout used in all active phases
  function ActiveLayout({ label }: { label: string }) {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
        <CamPane videoRef={videoRef} detected={detected} target={currentTarget}/>
        <div className="flex flex-col items-center gap-4">
          <HoldRing pct={holdPct} target={currentTarget} confirmed={confirmed} detected={detected}/>
          <p className="text-[#F4F1EC]/45 text-xs text-center max-w-[150px] leading-relaxed">{label}</p>
          {holdPct > 0 && !confirmed && (
            <div className="w-32 bg-[#162035] rounded-full h-1">
              <div className="bg-[#FF7124] h-1 rounded-full transition-all"
                style={{ width: `${holdPct}%` }}/>
            </div>
          )}
          {confirmed && (
            <p className="text-[#FF7124] text-xs font-bold">✓ Shape locked in!</p>
          )}
        </div>
      </div>
    );
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[#FF7124]/12 border border-[#FF7124]/35 flex items-center justify-center">
        <svg width="22" height="18" viewBox="0 0 24 18" fill="none" stroke="#FF7124" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 9 C6 2 18 2 22 9 C18 16 6 16 2 9Z"/>
          <path d="M8 9 C10 12 14 12 16 9"/>
        </svg>
      </div>

      <div>
        <h3 className="text-[#F4F1EC] text-xl font-bold">Lip Reading — Learn & Type</h3>
        <p className="text-[#F4F1EC]/55 text-sm max-w-sm leading-relaxed mt-3">
          Learn <strong className="text-[#FF7124]">4 lip shapes</strong> detected by NeuroTouch.
          Your camera reads your lips in real time — then you type real words using only your mouth.
        </p>
        <div className="flex gap-3 justify-center mt-4">
          {(["B","E","A","T"] as Letter[]).map(l => (
            <div key={l} className="w-10 h-10 rounded-full bg-[#162035] border border-[#FF7124]/25
                                    flex items-center justify-center text-[#FF7124] font-black text-lg">
              {l}
            </div>
          ))}
        </div>
        <p className="text-[#F4F1EC]/30 text-xs mt-3">4 lessons · quick-fire practice · type BEAT & TAB</p>
      </div>

      {camError && <p className="text-red-400/70 text-xs max-w-xs">{camError}</p>}

      <button onClick={begin}
        className="flex items-center gap-2.5 px-16 py-4 bg-[#FF7124] text-white font-semibold rounded-full
                   hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,113,36,0.35)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        Enable camera &amp; start
      </button>
      <p className="text-[#F4F1EC]/20 text-[10px]">Camera stays on your device — nothing recorded or sent.</p>
    </div>
  );

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-[#FF7124]/30 border-t-[#FF7124] animate-spin"/>
      <p className="text-[#F4F1EC]/50 text-sm">{loadMsg}</p>
      <p className="text-[#F4F1EC]/20 text-xs">Loading face-detection model (~5 MB)…</p>
    </div>
  );

  // ── LESSON ────────────────────────────────────────────────────────────────
  if (phase === "lesson") {
    const L = LESSON_DATA[LETTERS[lessonIdx]];
    return (
      <div className="flex flex-col items-center gap-6 py-2">
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Lesson {lessonIdx + 1} of {LETTERS.length}
          </p>
          <h3 className="text-[#F4F1EC] font-bold text-base mt-1">{L.name}</h3>
        </div>

        <div className="flex gap-2">
          {LETTERS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              i < lessonIdx   ? "bg-[#FF7124]"
              : i === lessonIdx ? "bg-[#FF7124] scale-125"
                               : "bg-[#F4F1EC]/15"
            }`}/>
          ))}
        </div>

        {lessonStage === "teach" && (
          <>
            <div className="w-24 h-24 rounded-full bg-[#FF7124]/12 border-2 border-[#FF7124]/40
                            flex items-center justify-center text-5xl font-black text-[#FF7124]">
              {LETTERS[lessonIdx]}
            </div>
            <div className="max-w-xs text-center">
              <p className="text-[#F4F1EC] text-sm font-semibold">{L.cue}</p>
              <p className="text-[#F4F1EC]/45 text-xs mt-1.5 leading-relaxed">{L.detail}</p>
            </div>
            <button onClick={tryLesson}
              className="px-14 py-3.5 bg-[#FF7124] text-white font-semibold rounded-full
                         hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,113,36,0.3)]">
              Got it — let me try →
            </button>
          </>
        )}

        {(lessonStage === "try" || lessonStage === "confirmed") && (
          <>
            <p className="text-[#F4F1EC]/50 text-sm text-center">{L.cue}</p>
            <ActiveLayout label={confirmed ? "Shape detected!" : "Hold the shape until the ring fills…"}/>
            {confirmed && (
              <button onClick={nextLesson}
                className="px-14 py-3.5 bg-[#FF7124] text-white font-semibold rounded-full
                           hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,113,36,0.3)]">
                {lessonIdx < LETTERS.length - 1 ? "Next lesson →" : "Start practice →"}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // ── PRACTICE 1: Quick fire ─────────────────────────────────────────────────
  if (phase === "p1") return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="text-center">
        <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
          Practice 1 — Quick Fire
        </p>
        <h3 className="text-[#F4F1EC] font-bold text-lg mt-1">
          Make shape: <span className="text-[#FF7124]">{P1_SEQ[p1Idx]}</span>
        </h3>
        <p className="text-[#F4F1EC]/30 text-xs mt-0.5">{p1Idx + 1} / {P1_SEQ.length}</p>
      </div>

      <div className="w-full max-w-xs bg-[#162035] rounded-full h-1">
        <div className="bg-[#FF7124]/50 h-1 rounded-full transition-all"
          style={{ width: `${(p1Idx / P1_SEQ.length) * 100}%` }}/>
      </div>

      <ActiveLayout label="Hold the shape until the ring fills"/>
    </div>
  );

  // ── PRACTICE 2: Spell BET ──────────────────────────────────────────────────
  if (phase === "p2") return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="text-center">
        <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
          Practice 2 — Spell it
        </p>
        <p className="text-[#F4F1EC]/35 text-xs mt-0.5">
          Spell with your lips: <strong className="text-[#F4F1EC]">{P2_WORD}</strong>
        </p>
      </div>

      <div className="flex gap-2">
        {P2_WORD.split("").map((ch, i) => (
          <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center
                                    text-base font-black transition-all duration-200 ${
            i < letterIdx   ? "bg-[#FF7124] text-white"
            : i === letterIdx ? "bg-[#FF7124]/20 border-2 border-[#FF7124] text-[#FF7124] scale-110"
                             : "bg-[#162035] border border-[#F4F1EC]/10 text-[#F4F1EC]/25"
          }`}>
            {i <= letterIdx ? ch : "·"}
          </div>
        ))}
      </div>

      <ActiveLayout label={`Mouth the letter: ${P2_WORD[letterIdx]}`}/>
    </div>
  );

  // ── FINAL: Type the words ──────────────────────────────────────────────────
  if (phase === "final") {
    const word = FINAL_WORDS[wordIdx];
    return (
      <div className="flex flex-col items-center gap-6 py-2">
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Final — Type the words!
          </p>
          <p className="text-[#F4F1EC]/35 text-xs mt-0.5">
            Word {wordIdx + 1} of {FINAL_WORDS.length}:{" "}
            <strong className="text-[#F4F1EC]">{word}</strong>
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {FINAL_WORDS.map((w, wi) => (
            <div key={wi} className="flex gap-1.5">
              {w.split("").map((ch, li) => (
                <div key={li} className={`w-10 h-10 rounded-lg flex items-center justify-center
                                           text-sm font-black transition-all duration-200 ${
                  wi < wordIdx                         ? "bg-[#FF7124] text-white"
                  : wi === wordIdx && li < letterIdx   ? "bg-[#FF7124] text-white"
                  : wi === wordIdx && li === letterIdx  ? "bg-[#FF7124]/20 border-2 border-[#FF7124] text-[#FF7124] scale-110"
                                                       : "bg-[#162035] border border-[#F4F1EC]/10 text-[#F4F1EC]/20"
                }`}>
                  {(wi < wordIdx || (wi === wordIdx && li <= letterIdx)) ? ch : "·"}
                </div>
              ))}
            </div>
          ))}
        </div>

        <ActiveLayout label={`Mouth: ${word[letterIdx]}`}/>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (phase === "done") return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40
                      flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#FF7124" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>

      <div>
        <h3 className="text-[#FF7124] text-2xl font-bold">You learned the algorithm!</h3>
        <p className="text-[#F4F1EC]/50 text-sm mt-2 max-w-sm leading-relaxed">
          4 shapes · quick-fire practice · 2 words typed — all detected live from your camera.
          This is <strong className="text-[#F4F1EC]">exactly</strong> how the real NeuroTouch app works.
        </p>
      </div>

      <div className="flex gap-3">
        {FINAL_WORDS.map((w, i) => (
          <div key={i} className="px-6 py-3 bg-[#FF7124]/15 border border-[#FF7124]/40
                                  rounded-xl text-[#FF7124] text-base font-black tracking-widest">
            {w}
          </div>
        ))}
      </div>

      <div className="bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl px-8 py-6 max-w-sm text-left">
        <p className="text-[#FF7124] text-xs uppercase tracking-widest font-semibold mb-3">
          How the real app works
        </p>
        <p className="text-[#F4F1EC]/60 text-sm leading-relaxed">
          NeuroTouch trains a lightweight TFLite classifier on{" "}
          <strong className="text-[#F4F1EC]">your personal face landmarks</strong> — fully on-device,
          no cloud, no audio. It maps your unique lip geometry to commands, so even non-verbal
          users can type privately and independently.
        </p>
      </div>

      <button onClick={() => {
        clearTarget();
        setPhase("intro");
        setLessonIdx(0); setLessonStage("teach");
        setP1Idx(0); setWordIdx(0); setLetterIdx(0);
        setDetected(null); setHoldPct(0);
        setCamError(null);
      }}
        className="px-14 py-3.5 border border-[#FF7124]/50 text-[#FF7124] rounded-full text-sm
                   hover:bg-[#FF7124]/10 transition-colors">
        Try again from the start
      </button>
    </div>
  );

  return null;
}
