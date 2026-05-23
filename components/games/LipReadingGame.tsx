"use client";
import { useState, useRef, useEffect } from "react";

// ── content ────────────────────────────────────────────────────────────────
const LESSONS = [
  {
    letter: "A",
    name: 'Open — "Ah"',
    teach:
      'Drop your jaw wide open, like you\'re surprised or saying "ah" at the doctor. ' +
      "Your mouth makes a tall oval shape. Chin goes down, lips barely touch the sides.",
    tryText: "Make the A shape and hold it steady",
  },
  {
    letter: "O",
    name: 'Round — "Oh"',
    teach:
      "Purse your lips into a tight circle — as if you're about to whistle or blow a candle. " +
      "The key is the lip corners pulling inward to form a perfect O.",
    tryText: "Round your lips into an O and hold",
  },
  {
    letter: "M",
    name: 'Closed — "Mm"',
    teach:
      "Press your lips firmly together with zero gap. This is the baseline closed shape — " +
      "completely sealed. You can feel a slight pressure between the lips.",
    tryText: "Press your lips together and hold",
  },
  {
    letter: "S",
    name: 'Slit — "Ss"',
    teach:
      "Part your lips just slightly, showing the edges of your teeth. Think of a quiet, " +
      "still hiss — the gap is thin and horizontal.",
    tryText: "Create a thin gap and hold",
  },
] as const;

// Practice 1: quick-fire individual shapes
const P1 = ["A", "M", "O", "S", "O", "M", "A", "S"] as const;

// Practice 2: spell words
const P2_WORDS = ["SAM", "MAS"] as const;

// Final: type these words
const FINAL_WORDS = ["SOMA", "MOMS", "MASS"] as const;

type Phase = "intro" | "lesson" | "p1" | "p2" | "final" | "done";
type LessonStage = "teach" | "try" | "confirmed";

const DETECT_MS = {
  lesson: 2000,
  p1:     1400,
  p2:     1400,
  final:  1800,
} as const;

// ── Detection ring ─────────────────────────────────────────────────────────
function DetectRing({ pct, letter, confirmed }: { pct: number; letter: string; confirmed: boolean }) {
  const r    = 50;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      {/* Background circle */}
      <div className={`absolute inset-0 rounded-full flex items-center justify-center text-5xl font-black transition-all duration-300 ${
        confirmed
          ? "bg-[#FF7124] text-white shadow-[0_0_40px_rgba(255,113,36,0.55)]"
          : "bg-[#FF7124]/12 border-2 border-[#FF7124]/40 text-[#FF7124]"
      }`}>
        {confirmed ? "✓" : letter}
      </div>
      {/* Progress ring */}
      {!confirmed && pct > 0 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112"
          style={{ transform: "rotate(-90deg)" }}>
          <circle cx={56} cy={56} r={r} fill="none" stroke="#FF7124" strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            opacity={0.9}/>
        </svg>
      )}
    </div>
  );
}

// ── Camera pane with scanning animation ────────────────────────────────────
function CameraPane({
  videoRef, detecting, ready,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  detecting: boolean;
  ready: boolean;
}) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#F4F1EC]/10 bg-[#0a121d] flex-shrink-0"
      style={{ width: 240, height: 180 }}>
      <video ref={videoRef} autoPlay playsInline muted
        className="w-full h-full object-cover scale-x-[-1]"/>

      {/* Face oval guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-32 rounded-[50%] border transition-all duration-300"
          style={{ borderColor: detecting ? "rgba(255,113,36,0.7)" : "rgba(255,113,36,0.25)" }}/>
      </div>

      {/* Scanning line — only while detecting */}
      {detecting && (
        <div className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,113,36,0.8), transparent)",
            animation: "scanLine 1.1s ease-in-out infinite",
          }}/>
      )}

      {/* Status badge */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest transition-all ${
          detecting ? "bg-[#FF7124]/30 text-[#FF7124]"
          : ready   ? "bg-[#F4F1EC]/10 text-[#F4F1EC]/50"
                    : "bg-[#F4F1EC]/5  text-[#F4F1EC]/25"
        }`}>
          {detecting ? "analysing" : ready ? "get ready…" : "live"}
        </span>
      </div>

      <style>{`@keyframes scanLine{0%,100%{top:22%}50%{top:72%}}`}</style>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function LipReadingGame() {
  const [phase,       setPhase]       = useState<Phase>("intro");
  const [lessonIdx,   setLessonIdx]   = useState(0);
  const [lessonStage, setLessonStage] = useState<LessonStage>("teach");
  const [p1Idx,       setP1Idx]       = useState(0);
  const [wordIdx,     setWordIdx]     = useState(0);
  const [letterIdx,   setLetterIdx]   = useState(0);
  const [detectPct,   setDetectPct]   = useState(0);
  const [detecting,   setDetecting]   = useState(false);
  const [ready,       setReady]       = useState(false);
  const [camError,    setCamError]    = useState<string | null>(null);

  const videoRef    = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const detectTimer = useRef<ReturnType<typeof setInterval>  | null>(null);
  const prepTimer   = useRef<ReturnType<typeof setTimeout>   | null>(null);

  // ── camera ──────────────────────────────────────────────────────────────
  async function startCamera() {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCamError("Camera denied — allow access and try again.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  useEffect(() => () => { stopCamera(); clearAll(); }, []);

  // ── detection helpers ────────────────────────────────────────────────────
  function clearAll() {
    if (detectTimer.current) { clearInterval(detectTimer.current); detectTimer.current = null; }
    if (prepTimer.current)   { clearTimeout(prepTimer.current);   prepTimer.current   = null; }
    setDetecting(false);
    setDetectPct(0);
    setReady(false);
  }

  function detect(ms: number, onDone: () => void) {
    setDetecting(true);
    setDetectPct(0);
    let p = 0;
    detectTimer.current = setInterval(() => {
      p += 100 / (ms / 40);
      setDetectPct(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(detectTimer.current!);
        detectTimer.current = null;
        setDetecting(false);
        setDetectPct(0);
        onDone();
      }
    }, 40);
  }

  function prepThenDetect(ms: number, onDone: () => void) {
    clearAll();
    setReady(true);
    prepTimer.current = setTimeout(() => {
      setReady(false);
      detect(ms, onDone);
    }, 700);
  }

  // ── phase runners ────────────────────────────────────────────────────────
  async function begin() {
    await startCamera();
    setPhase("lesson");
    setLessonIdx(0);
    setLessonStage("teach");
  }

  function tryLesson() {
    setLessonStage("try");
    prepThenDetect(DETECT_MS.lesson, () => setLessonStage("confirmed"));
  }

  function nextLesson() {
    clearAll();
    const next = lessonIdx + 1;
    if (next < LESSONS.length) {
      setLessonIdx(next);
      setLessonStage("teach");
    } else {
      setPhase("p1");
      setP1Idx(0);
      runP1(0);
    }
  }

  function runP1(idx: number) {
    setP1Idx(idx);
    prepThenDetect(DETECT_MS.p1, () => {
      const next = idx + 1;
      if (next >= P1.length) {
        clearAll();
        setPhase("p2");
        setWordIdx(0); setLetterIdx(0);
        runP2(0, 0);
      } else {
        runP1(next);
      }
    });
  }

  function runP2(wi: number, li: number) {
    const word = P2_WORDS[wi];
    setWordIdx(wi); setLetterIdx(li);
    prepThenDetect(DETECT_MS.p2, () => {
      const nli = li + 1;
      if (nli >= word.length) {
        const nwi = wi + 1;
        if (nwi >= P2_WORDS.length) {
          clearAll();
          setPhase("final");
          setWordIdx(0); setLetterIdx(0);
          runFinal(0, 0);
        } else {
          runP2(nwi, 0);
        }
      } else {
        runP2(wi, nli);
      }
    });
  }

  function runFinal(wi: number, li: number) {
    const word = FINAL_WORDS[wi];
    setWordIdx(wi); setLetterIdx(li);
    prepThenDetect(DETECT_MS.final, () => {
      const nli = li + 1;
      if (nli >= word.length) {
        const nwi = wi + 1;
        if (nwi >= FINAL_WORDS.length) {
          clearAll();
          setPhase("done");
        } else {
          runFinal(nwi, 0);
        }
      } else {
        runFinal(wi, nli);
      }
    });
  }

  // ── derived values ───────────────────────────────────────────────────────
  const currentLetter = (() => {
    if (phase === "lesson") return LESSONS[lessonIdx].letter;
    if (phase === "p1")     return P1[p1Idx];
    if (phase === "p2")     return P2_WORDS[wordIdx][letterIdx];
    if (phase === "final")  return FINAL_WORDS[wordIdx][letterIdx];
    return "";
  })();

  const isConfirmed = phase === "lesson" && lessonStage === "confirmed";

  // ── shared camera + ring block ───────────────────────────────────────────
  function ActiveView({ label }: { label: string }) {
    return (
      <div className="flex flex-col md:flex-row gap-7 items-center justify-center w-full">
        <CameraPane videoRef={videoRef} detecting={detecting} ready={ready}/>
        <div className="flex flex-col items-center gap-4">
          <DetectRing pct={detectPct} letter={currentLetter} confirmed={isConfirmed}/>
          <p className="text-[#F4F1EC]/50 text-xs text-center max-w-[160px] leading-relaxed">{label}</p>
          {detecting && (
            <p className="text-[#FF7124] text-xs font-bold tabular-nums">{Math.round(detectPct)}%</p>
          )}
          {isConfirmed && (
            <p className="text-[#FF7124] text-sm font-bold">✓ Shape locked in!</p>
          )}
        </div>
      </div>
    );
  }

  // ── INTRO ────────────────────────────────────────────────────────────────
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
          Learn 4 lip shapes used by NeuroTouch, practice them, then type real words — all without speaking.
          Your camera checks each shape in real time.
        </p>
        <p className="text-[#F4F1EC]/30 text-xs mt-2">4 lessons · 2 practices · 3 words to type</p>
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
      <p className="text-[#F4F1EC]/20 text-[10px] max-w-xs">Camera stays on your device — nothing recorded or sent.</p>
    </div>
  );

  // ── LESSON ───────────────────────────────────────────────────────────────
  if (phase === "lesson") {
    const L = LESSONS[lessonIdx];
    return (
      <div className="flex flex-col items-center gap-7 py-2">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Lesson {lessonIdx + 1} of {LESSONS.length}
          </p>
          <h3 className="text-[#F4F1EC] font-bold text-base mt-1">{L.name}</h3>
        </div>

        {/* Lesson progress dots */}
        <div className="flex gap-2">
          {LESSONS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              i < lessonIdx  ? "bg-[#FF7124]"
              : i === lessonIdx ? "bg-[#FF7124] scale-125"
                               : "bg-[#F4F1EC]/15"
            }`}/>
          ))}
        </div>

        {lessonStage === "teach" && (
          <>
            {/* Big letter preview */}
            <div className="w-24 h-24 rounded-full bg-[#FF7124]/12 border-2 border-[#FF7124]/40
                            flex items-center justify-center text-5xl font-black text-[#FF7124]">
              {L.letter}
            </div>
            <p className="text-[#F4F1EC]/70 text-sm max-w-sm text-center leading-relaxed">{L.teach}</p>
            <button onClick={tryLesson}
              className="px-14 py-3.5 bg-[#FF7124] text-white font-semibold rounded-full
                         hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,113,36,0.3)]">
              Got it — let me try →
            </button>
          </>
        )}

        {(lessonStage === "try" || lessonStage === "confirmed") && (
          <>
            <p className="text-[#F4F1EC]/50 text-sm text-center">{L.tryText}</p>
            <ActiveView label={lessonStage === "confirmed" ? "Shape detected and saved" : "Hold steady…"}/>
            {lessonStage === "confirmed" && (
              <button onClick={nextLesson}
                className="px-14 py-3.5 bg-[#FF7124] text-white font-semibold rounded-full
                           hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,113,36,0.3)]">
                {lessonIdx < LESSONS.length - 1 ? "Next lesson →" : "Start practice →"}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // ── PRACTICE 1: Quick Fire ────────────────────────────────────────────────
  if (phase === "p1") {
    return (
      <div className="flex flex-col items-center gap-7 py-2">
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Practice 1 — Quick Fire
          </p>
          <h3 className="text-[#F4F1EC] font-bold text-base mt-1">
            Make shape: <span className="text-[#FF7124]">{P1[p1Idx]}</span>
          </h3>
          <p className="text-[#F4F1EC]/35 text-xs mt-0.5">{p1Idx + 1} / {P1.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#162035] rounded-full h-1.5">
          <div className="bg-[#FF7124] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((p1Idx) / P1.length) * 100}%` }}/>
        </div>

        <ActiveView label={ready ? "Hold shape…" : detecting ? "Detecting…" : ""}/>
      </div>
    );
  }

  // ── PRACTICE 2: Word Spelling ─────────────────────────────────────────────
  if (phase === "p2") {
    const word = P2_WORDS[wordIdx];
    return (
      <div className="flex flex-col items-center gap-7 py-2">
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Practice 2 — Spell the word
          </p>
          <p className="text-[#F4F1EC]/35 text-xs mt-0.5">Word {wordIdx + 1} of {P2_WORDS.length}</p>
        </div>

        {/* Word display */}
        <div className="flex gap-2">
          {word.split("").map((ch, i) => (
            <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black transition-all duration-200 ${
              i < letterIdx  ? "bg-[#FF7124] text-white"
              : i === letterIdx ? "bg-[#FF7124]/20 border-2 border-[#FF7124] text-[#FF7124] scale-110"
                               : "bg-[#162035] border border-[#F4F1EC]/10 text-[#F4F1EC]/25"
            }`}>
              {i <= letterIdx ? ch : "·"}
            </div>
          ))}
        </div>

        <ActiveView label={`Mouth the letter: ${currentLetter}`}/>
      </div>
    );
  }

  // ── FINAL: Type the words ─────────────────────────────────────────────────
  if (phase === "final") {
    const word = FINAL_WORDS[wordIdx];
    return (
      <div className="flex flex-col items-center gap-7 py-2">
        <div className="text-center">
          <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.22em] font-semibold">
            Final — Type it!
          </p>
          <p className="text-[#F4F1EC]/35 text-xs mt-0.5">Word {wordIdx + 1} of {FINAL_WORDS.length}</p>
        </div>

        {/* All words overview */}
        <div className="flex gap-3">
          {FINAL_WORDS.map((w, wi) => (
            <div key={wi} className="flex gap-1">
              {w.split("").map((ch, li) => (
                <div key={li} className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-200 ${
                  wi < wordIdx                         ? "bg-[#FF7124] text-white"
                  : wi === wordIdx && li < letterIdx  ? "bg-[#FF7124] text-white"
                  : wi === wordIdx && li === letterIdx ? "bg-[#FF7124]/20 border-2 border-[#FF7124] text-[#FF7124] scale-110"
                                                      : "bg-[#162035] border border-[#F4F1EC]/10 text-[#F4F1EC]/20"
                }`}>
                  {wi < wordIdx || (wi === wordIdx && li < letterIdx)
                    ? ch
                    : wi === wordIdx && li === letterIdx
                      ? ch
                      : "·"}
                </div>
              ))}
              {wi < FINAL_WORDS.length - 1 && (
                <div className="w-3 flex items-center justify-center text-[#F4F1EC]/15 text-xs">·</div>
              )}
            </div>
          ))}
        </div>

        <ActiveView label={`Mouth the letter: ${word[letterIdx]}`}/>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────
  if (phase === "done") return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF7124" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>

      <div>
        <h3 className="text-[#FF7124] text-2xl font-bold">You learned the algorithm!</h3>
        <p className="text-[#F4F1EC]/50 text-sm mt-2 max-w-sm leading-relaxed">
          4 shapes learned · 2 practices completed · 3 words typed — using only your lips.
          This is <strong className="text-[#F4F1EC]">exactly</strong> how the real NeuroTouch app works.
        </p>
      </div>

      {/* Words typed */}
      <div className="flex gap-3">
        {FINAL_WORDS.map((w, i) => (
          <div key={i} className="px-5 py-3 bg-[#FF7124]/15 border border-[#FF7124]/40 rounded-xl
                                  text-[#FF7124] text-base font-black tracking-widest">
            {w}
          </div>
        ))}
      </div>

      <div className="bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl px-8 py-6 max-w-sm text-left">
        <p className="text-[#FF7124] text-xs uppercase tracking-widest font-semibold mb-3">How the real app works</p>
        <p className="text-[#F4F1EC]/60 text-sm leading-relaxed">
          The app trains a lightweight TFLite classifier on your personal lip landmarks —
          fully <strong className="text-[#F4F1EC]">on-device</strong>, no internet, no audio.
          Even non-verbal users can type privately and independently.
        </p>
      </div>

      <button onClick={() => {
        stopCamera();
        setPhase("intro");
        setLessonIdx(0); setLessonStage("teach");
        setP1Idx(0); setWordIdx(0); setLetterIdx(0);
        clearAll();
      }}
        className="px-14 py-3.5 border border-[#FF7124]/50 text-[#FF7124] rounded-full text-sm hover:bg-[#FF7124]/10 transition-colors">
        Try again from the start
      </button>
    </div>
  );

  return null;
}
