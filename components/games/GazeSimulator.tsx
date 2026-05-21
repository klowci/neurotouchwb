"use client";
import { useState, useRef, useEffect } from "react";

// ── constants ──────────────────────────────────────────────────────────────
const VW = 480, VH = 300;
const DWELL_MS = 1400;
const HIT_R    = 32;   // SVG-unit hit radius per waypoint

// Z-shaped maze walls (just border lines)
const WALLS = [
  { x1: 0,   y1: 110, x2: 360, y2: 110 },   // top↔middle divider, gap on right
  { x1: 120, y1: 190, x2: 480, y2: 190 },   // middle↔bottom divider, gap on left
] as const;

// Waypoints the player must dwell on, in order
const WPS = [
  { x: 350, y:  54 },   // ① end of top corridor
  { x: 440, y: 150 },   // ② right connector
  { x: 130, y: 150 },   // ③ end of middle corridor
  { x:  50, y: 246 },   // ④ left connector
  { x: 440, y: 246 },   // ⑤ finish
] as const;

const START_POS = { x: 28, y: 54 };
const CIRC = 2 * Math.PI * 26;

function StarShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI / 5) - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill="#FFE566" />;
}

export default function GazeSimulator() {
  const [phase,    setPhase]    = useState<"intro"|"playing"|"done">("intro");
  const [curX,     setCurX]     = useState(START_POS.x);
  const [curY,     setCurY]     = useState(START_POS.y);
  const [wpIdx,    setWpIdx]    = useState(0);
  const [cleared,  setCleared]  = useState(0);
  const [dwellPct, setDwellPct] = useState(0);
  const [score,    setScore]    = useState(0);

  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mutable refs keep interval closure fresh without stale state
  const wpIdxRef   = useRef(0);
  const clearedRef = useRef(0);
  const phaseRef   = useRef<"intro"|"playing"|"done">("intro");

  // ── helpers ────────────────────────────────────────────────────────────
  function stopDwell() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setDwellPct(0);
  }

  function clientToSVG(cx: number, cy: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const r  = svg.getBoundingClientRect();
    const s  = Math.min(r.width / VW, r.height / VH); // xMidYMid meet scale
    const ox = (r.width  - VW * s) / 2;
    const oy = (r.height - VH * s) / 2;
    return {
      x: Math.max(0, Math.min(VW, (cx - r.left - ox) / s)),
      y: Math.max(0, Math.min(VH, (cy - r.top  - oy) / s)),
    };
  }

  // Keep moveCursor fresh in the touch useEffect via ref
  const moveCursorRef = useRef<(cx: number, cy: number) => void>(() => {});
  moveCursorRef.current = (cx, cy) => {
    if (phaseRef.current !== "playing") return;
    const pos = clientToSVG(cx, cy);
    if (!pos) return;
    setCurX(pos.x);
    setCurY(pos.y);

    if (clearedRef.current >= WPS.length) return;
    const wp   = WPS[wpIdxRef.current];
    const dist = Math.hypot(pos.x - wp.x, pos.y - wp.y);

    if (dist <= HIT_R) {
      if (!timerRef.current) {
        let p = 0;
        timerRef.current = setInterval(() => {
          p += 100 / (DWELL_MS / 40);
          setDwellPct(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setDwellPct(0);

            const nc = clearedRef.current + 1;
            clearedRef.current = nc;
            setCleared(nc);
            setScore(s => s + 2);

            if (nc >= WPS.length) {
              phaseRef.current = "done";
              setPhase("done");
            } else {
              wpIdxRef.current = nc;
              setWpIdx(nc);
            }
          }
        }, 40);
      }
    } else {
      if (timerRef.current) stopDwell();
    }
  };

  // Touch events with passive:false to prevent scroll-during-drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      moveCursorRef.current(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTS = (e: TouchEvent) => {
      moveCursorRef.current(e.touches[0].clientX, e.touches[0].clientY);
    };
    el.addEventListener("touchmove",  onTM, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: true  });
    return () => {
      el.removeEventListener("touchmove",  onTM);
      el.removeEventListener("touchstart", onTS);
    };
  }, []);

  useEffect(() => () => stopDwell(), []);

  function startGame() {
    setCurX(START_POS.x); setCurY(START_POS.y);
    setWpIdx(0);   wpIdxRef.current   = 0;
    setCleared(0); clearedRef.current = 0;
    setScore(0);
    stopDwell();
    phaseRef.current = "playing";
    setPhase("playing");
  }

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="w-14 h-14 rounded-full border-2 border-[#FF7124] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7124" strokeWidth="2" strokeLinecap="round">
          <ellipse cx="12" cy="12" rx="10" ry="6"/>
          <circle cx="12" cy="12" r="3" fill="#FF7124" stroke="none"/>
        </svg>
      </div>
      <div>
        <h3 className="text-[#F4F1EC] text-xl font-bold">Gaze Maze</h3>
        <p className="text-[#F4F1EC]/55 text-sm max-w-sm leading-relaxed mt-2">
          Navigate the maze and <strong className="text-[#FF7124]">hold on each target</strong> for 1.4 s —
          no click needed. On mobile, drag the cursor with your finger.
          This mirrors how NeuroTouch users navigate their phones.
        </p>
      </div>
      <button onClick={startGame}
        className="px-16 py-4 bg-[#FF7124] text-white font-semibold rounded-full hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,113,36,0.35)]">
        Start maze
      </button>
    </div>
  );

  // ── DONE ───────────────────────────────────────────────────────────────
  if (phase === "done") return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF7124" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div>
        <h3 className="text-[#FF7124] text-2xl font-bold">Maze complete!</h3>
        <p className="text-[#F4F1EC]/60 text-sm max-w-sm leading-relaxed mt-2">
          You navigated using <strong className="text-[#F4F1EC]">dwell selection only</strong> — no clicks.<br/>
          NeuroTouch users do this with their actual eyes.
        </p>
      </div>
      <button onClick={startGame}
        className="px-14 py-3 border border-[#FF7124]/50 text-[#FF7124] rounded-full text-sm hover:bg-[#FF7124]/10 transition-colors">
        Try again
      </button>
    </div>
  );

  // ── PLAYING ────────────────────────────────────────────────────────────
  const wp   = WPS[wpIdx];
  const DASH = (dwellPct / 100) * CIRC;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <h3 className="text-[#F4F1EC] font-bold text-base">Gaze Maze</h3>
        <p className="text-[#F4F1EC]/40 text-xs mt-0.5">
          Hold cursor on each <span className="text-[#FF7124]">●</span> for 1.4 s · mobile: drag with finger
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {WPS.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < cleared  ? "bg-[#FF7124]"
              : i === wpIdx ? "bg-[#FF7124] scale-125 ring-2 ring-[#FF7124]/30"
                            : "bg-[#F4F1EC]/12"
            }`}/>
          ))}
        </div>
        <span className="text-[#FF7124] font-bold text-xs">{cleared}/{WPS.length}</span>
      </div>

      {/* Game area */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden bg-[#040c15] border border-[#F4F1EC]/8 select-none"
        style={{ maxWidth: 520, aspectRatio: "16/10", cursor: "none", touchAction: "none" }}
        onMouseMove={e => moveCursorRef.current(e.clientX, e.clientY)}
        onMouseEnter={e => moveCursorRef.current(e.clientX, e.clientY)}
      >
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer border */}
          <rect x={2} y={2} width={VW-4} height={VH-4} rx={5}
            fill="none" stroke="#F4F1EC" strokeWidth={1.8} strokeOpacity={0.14}/>

          {/* Maze walls */}
          {WALLS.map((w, i) => (
            <line key={i} x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
              stroke="#F4F1EC" strokeWidth={2} strokeOpacity={0.22} strokeLinecap="square"/>
          ))}

          {/* Start arrow */}
          <text x={START_POS.x + 2} y={START_POS.y + 6} fill="#FF7124" fontSize={20}
            fontFamily="system-ui" textAnchor="middle" opacity={0.7}>→</text>

          {/* Future waypoints (dim) */}
          {WPS.map((w, i) => i > cleared ? (
            <circle key={i} cx={w.x} cy={w.y} r={5} fill="#FF7124" opacity={0.12}/>
          ) : null)}

          {/* Cleared waypoints */}
          {WPS.slice(0, cleared).map((w, i) => (
            <g key={i}>
              <circle cx={w.x} cy={w.y} r={10} fill="#FF7124" opacity={0.3}/>
              <path d={`M${w.x-5},${w.y+1} l4,4 l7,-8`}
                stroke="#FF7124" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.9}/>
            </g>
          ))}

          {/* Current target */}
          {cleared < WPS.length && (
            <g>
              <circle cx={wp.x} cy={wp.y} r={30} fill="none"
                stroke="#FF7124" strokeWidth={1} strokeOpacity={0.2}/>
              {dwellPct > 0 && (
                <circle cx={wp.x} cy={wp.y} r={26} fill="none"
                  stroke="#FF7124" strokeWidth={3.5} strokeLinecap="round"
                  strokeDasharray={`${DASH} ${CIRC}`}
                  style={{ transform:`rotate(-90deg)`, transformOrigin:`${wp.x}px ${wp.y}px` }}/>
              )}
              {wpIdx === WPS.length - 1
                ? <StarShape cx={wp.x} cy={wp.y} r={14}/>
                : <circle cx={wp.x} cy={wp.y} r={8} fill="#FF7124"/>
              }
            </g>
          )}

          {/* Cursor — crosshair style */}
          <g>
            <circle cx={curX} cy={curY} r={16} fill="none" stroke="#FF7124" strokeWidth={1.5} opacity={0.5}/>
            <circle cx={curX} cy={curY} r={4.5} fill="#FF7124" opacity={0.95}/>
            <line x1={curX-23} y1={curY} x2={curX-18} y2={curY} stroke="#FF7124" strokeWidth={1.5} opacity={0.5}/>
            <line x1={curX+18} y1={curY} x2={curX+23} y2={curY} stroke="#FF7124" strokeWidth={1.5} opacity={0.5}/>
            <line x1={curX} y1={curY-23} x2={curX} y2={curY-18} stroke="#FF7124" strokeWidth={1.5} opacity={0.5}/>
            <line x1={curX} y1={curY+18} x2={curX} y2={curY+23} stroke="#FF7124" strokeWidth={1.5} opacity={0.5}/>
          </g>

          {/* Score counter (bottom-left) */}
          <text x={12} y={VH-10} fill="#FF7124" fontSize={13}
            fontFamily="monospace" fontWeight="700" opacity={0.65}>
            {String(score).padStart(2, "0")}
          </text>
        </svg>
      </div>

      <p className="text-[#F4F1EC]/22 text-[10px] text-center">
        Desktop: move your mouse · Mobile: drag the cursor with your finger
      </p>
    </div>
  );
}
