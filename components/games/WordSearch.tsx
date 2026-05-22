"use client";
import { useState, useCallback, useRef } from "react";

/* ── Words to find ───────────────────────────────────────────── */
const WORDS = [
  "NEUROTOUCH","APPLICATION","DETECTION","ASSISTIVE",
  "CURSOR","SCROLL","SIGNAL","EYES","SWIPE","BLINK","LIPS","HELP","DWELL",
];

const GRID_SIZE = 13;

/* ── Pre-built 13×13 grid ────────────────────────────────────── */
// Words placed:
//  NEUROTOUCH   row 0  cols 0-9   horizontal
//  APPLICATION  row 1  cols 0-10  horizontal
//  DETECTION    row 2  cols 3-11  horizontal
//  CURSOR       row 3  cols 3-8   horizontal
//  SCROLL       row 4  cols 1-6   horizontal
//  SIGNAL       row 5  cols 3-8   horizontal  (starts at col 3, col 2 is 'P' to avoid ambiguity)
//  EYES         row 6  cols 5-8   horizontal
//  SWIPE        row 7  cols 4-8   horizontal
//  BLINK        row 8  cols 7-11  horizontal
//  LIPS         row 9  cols 9-12  horizontal
//  ASSISTIVE    row10  cols 0-8   horizontal
//  HELP         row11  cols 1-4   horizontal
//  DWELL        row12  cols 8-12  horizontal
const RAW_GRID: string[][] = [
  ["N","E","U","R","O","T","O","U","C","H","B","R","Z"],
  ["A","P","P","L","I","C","A","T","I","O","N","Q","X"],
  ["Z","K","M","D","E","T","E","C","T","I","O","N","W"],
  ["Z","Q","F","C","U","R","S","O","R","H","J","K","L"],
  ["M","S","C","R","O","L","L","T","X","V","Z","B","W"],
  ["X","Y","P","S","I","G","N","A","L","K","R","Q","M"],
  ["T","R","W","B","V","E","Y","E","S","P","Z","F","K"],
  ["B","K","H","J","S","W","I","P","E","X","L","M","Q"],
  ["P","X","V","Z","R","M","Q","B","L","I","N","K","W"],
  ["K","M","F","R","Q","B","C","Z","W","L","I","P","S"],
  ["A","S","S","I","S","T","I","V","E","T","B","F","H"],
  ["R","H","E","L","P","K","Q","Z","E","X","M","W","V"],
  ["Q","Z","F","K","M","X","B","W","D","W","E","L","L"],
];

/* ── Word cell positions ─────────────────────────────────────── */
type Cell = [number, number];
const WORD_LOCS: Record<string, Cell[]> = {
  NEUROTOUCH:  [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]],
  APPLICATION: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10]],
  DETECTION:   [[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],[2,11]],
  CURSOR:      [[3,3],[3,4],[3,5],[3,6],[3,7],[3,8]],
  SCROLL:      [[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]],
  SIGNAL:      [[5,3],[5,4],[5,5],[5,6],[5,7],[5,8]],
  EYES:        [[6,5],[6,6],[6,7],[6,8]],
  SWIPE:       [[7,4],[7,5],[7,6],[7,7],[7,8]],
  BLINK:       [[8,7],[8,8],[8,9],[8,10],[8,11]],
  LIPS:        [[9,9],[9,10],[9,11],[9,12]],
  ASSISTIVE:   [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8]],
  HELP:        [[11,1],[11,2],[11,3],[11,4]],
  DWELL:       [[12,8],[12,9],[12,10],[12,11],[12,12]],
};

/* ── Layout constants ────────────────────────────────────────── */
const CELL = 32;   // px, cell size
const GAP  = 3;    // px, gap between cells
const STEP = CELL + GAP;

function cellKey(r: number, c: number) { return `${r}-${c}`; }
function cx(c: number) { return c * STEP + CELL / 2; }
function cy(r: number) { return r * STEP + CELL / 2; }

/* ── Component ───────────────────────────────────────────────── */
export default function WordSearch() {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting,  setSelecting]  = useState<Cell[]>([]);
  const [dragging,   setDragging]   = useState(false);
  const [flash,      setFlash]      = useState<{text: string; ok: boolean} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const allFound = foundWords.size === WORDS.length;

  /* cells that belong to already-found words */
  const foundCells = new Set<string>();
  foundWords.forEach(w => WORD_LOCS[w]?.forEach(([r,c]) => foundCells.add(cellKey(r,c))));

  /* cells currently being selected */
  const selectingSet = new Set(selecting.map(([r,c]) => cellKey(r,c)));

  function showFlash(text: string, ok: boolean) {
    setFlash({ text, ok });
    setTimeout(() => setFlash(null), 1400);
  }

  function buildLine(start: Cell, end: Cell): Cell[] {
    const [r0, c0] = start;
    const [r1, c1] = end;
    const dr = r1 - r0;
    const dc = c1 - c0;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return [start];
    const stepR = dr / steps;
    const stepC = dc / steps;
    // only allow 8-directional
    if (Math.abs(stepR) > 1 || Math.abs(stepC) > 1) return [start];
    const cells: Cell[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push([Math.round(r0 + i * stepR), Math.round(c0 + i * stepC)]);
    }
    return cells;
  }

  function checkAndCommit(cells: Cell[]) {
    if (cells.length < 2) return;
    const str = cells.map(([r,c]) => RAW_GRID[r][c]).join("");
    const rev = [...str].reverse().join("");
    const hit = WORDS.find(w => (w === str || w === rev) && !foundWords.has(w));
    if (hit) {
      setFoundWords(prev => new Set([...prev, hit]));
      showFlash(hit, true);
    }
  }

  const onCellEnter = useCallback((r: number, c: number) => {
    if (!dragging || allFound) return;
    setSelecting(prev => {
      if (prev.length === 0) return prev;
      return buildLine(prev[0], [r, c]);
    });
  }, [dragging, allFound]);

  function onMouseDown(r: number, c: number) {
    if (allFound) return;
    setDragging(true);
    setSelecting([[r,c]]);
  }

  function onMouseUp() {
    if (dragging) {
      checkAndCommit(selecting);
      setDragging(false);
      setSelecting([]);
    }
  }

  const totalW = GRID_SIZE * STEP - GAP;

  return (
    <div className="flex flex-col items-center gap-5 py-2 select-none">
      <div className="text-center">
        <h3 className="text-[#F4F1EC] text-lg font-bold mb-0.5">Word Search</h3>
        <p className="text-[#F4F1EC]/45 text-xs">Find all NeuroTouch keywords hidden in the grid</p>
      </div>

      {/* Flash message */}
      <div className="h-7 flex items-center justify-center">
        {flash && (
          <div className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all
            ${flash.ok
              ? "bg-[#FF7124]/20 border-[#FF7124]/50 text-[#FF7124]"
              : "bg-[#F4F1EC]/8 border-[#F4F1EC]/15 text-[#F4F1EC]/50"}`}>
            {flash.ok ? `Found: ${flash.text}` : flash.text}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">

        {/* Grid */}
        <div className="relative"
          style={{ width: totalW, height: totalW }}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
          ref={gridRef}>

          {/* SVG selection + found lines */}
          <svg className="absolute inset-0 pointer-events-none z-10"
               width={totalW} height={totalW}>

            {/* Found word lines */}
            {Array.from(foundWords).map(w => {
              const cells = WORD_LOCS[w];
              if (!cells || cells.length < 2) return null;
              const x1 = cx(cells[0][1]);
              const y1 = cy(cells[0][0]);
              const x2 = cx(cells[cells.length-1][1]);
              const y2 = cy(cells[cells.length-1][0]);
              return (
                <line key={w} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#FF7124" strokeWidth={CELL * 0.72} strokeLinecap="round"
                  opacity="0.22" />
              );
            })}

            {/* Live selection line */}
            {selecting.length >= 2 && (
              <line
                x1={cx(selecting[0][1])} y1={cy(selecting[0][0])}
                x2={cx(selecting[selecting.length-1][1])} y2={cy(selecting[selecting.length-1][0])}
                stroke="#FF7124" strokeWidth={CELL * 0.72} strokeLinecap="round" opacity="0.35" />
            )}
          </svg>

          {/* Cells */}
          <div className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
              gap: GAP,
              cursor: allFound ? "default" : "crosshair",
            }}>
            {RAW_GRID.map((row, r) =>
              row.map((letter, c) => {
                const key = cellKey(r,c);
                const isFound     = foundCells.has(key);
                const isSelecting = selectingSet.has(key);
                return (
                  <div key={key}
                    style={{ width: CELL, height: CELL }}
                    className={`rounded-full flex items-center justify-center text-[11px] font-bold relative z-20
                      transition-all duration-150
                      ${isFound
                        ? "text-white"
                        : isSelecting
                          ? "text-[#FF7124] scale-110"
                          : "text-[#F4F1EC]/55 hover:text-[#F4F1EC]/90"
                      }`}
                    onMouseDown={() => onMouseDown(r, c)}
                    onMouseEnter={() => onCellEnter(r, c)}
                  >
                    {/* Subtle circle bg on hover/select */}
                    {isSelecting && !isFound && (
                      <div className="absolute inset-0 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40" />
                    )}
                    <span className="relative z-10">{letter}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Word list */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[#F4F1EC]/55 text-xs uppercase tracking-widest font-semibold">Words</p>
            <p className="text-[#FF7124] text-xs font-bold">{foundWords.size}/{WORDS.length}</p>
          </div>
          {WORDS.map(w => (
            <div key={w}
              className={`flex items-center gap-2 text-xs font-mono font-semibold transition-all duration-300
                ${foundWords.has(w) ? "text-[#FF7124]" : "text-[#F4F1EC]/38"}`}>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] flex-shrink-0 transition-all
                ${foundWords.has(w) ? "border-[#FF7124] bg-[#FF7124]/20 text-[#FF7124]" : "border-[#F4F1EC]/15"}`}>
                {foundWords.has(w) && "✓"}
              </span>
              <span className={foundWords.has(w) ? "line-through opacity-60" : ""}>{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion message */}
      {allFound && (
        <div className="mt-2 text-center">
          <p className="text-[#FF7124] font-bold text-base">All words found!</p>
          <p className="text-[#F4F1EC]/40 text-xs mt-1">These are the building blocks of NeuroTouch.</p>
        </div>
      )}
    </div>
  );
}
