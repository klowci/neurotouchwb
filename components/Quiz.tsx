"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onComplete: () => void; onSkip: () => void }

type Part = string | { em: string; isKeyword?: boolean };

const questions: { parts: Part[]; options: string[]; keyword: string }[] = [
  {
    parts: [
      "Imagine someone you love wakes up tomorrow ",
      { em: "unable to move their hands" },
      " or ",
      { em: "speak" },
      ". What happens to their ",
      { em: "independence", isKeyword: true },
      "?",
    ],
    options: [
      "They miss the call",
      "Someone else answers for them",
      "They struggle through it",
      "I hadn't thought about this",
    ],
    keyword: "independence",
  },
  {
    parts: [
      { em: "1 in 4 people" },
      " with motor disabilities ",
      { em: "cannot independently" },
      " use key smartphone apps — a crisis of ",
      { em: "accessibility", isKeyword: true },
      ". What do you think they miss most?",
    ],
    options: [
      "Calling family freely",
      "Personal privacy",
      "Asking for emergency help",
      "Staying connected",
    ],
    keyword: "accessibility",
  },
  {
    parts: [
      "What if your phone responded to your ",
      { em: "gaze" },
      ", and you could type by ",
      { em: "silently mouthing letters" },
      " — completely ",
      { em: "hands-free", isKeyword: true },
      "?",
    ],
    options: [
      "That sounds impossible",
      "I know someone who needs this",
      "This could change lives",
      "Tell me more",
    ],
    keyword: "hands-free",
  },
];

function QText({ parts, keywordRef }: { parts: Part[]; keywordRef: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : p.isKeyword ? (
          <strong
            key={i}
            ref={keywordRef as React.RefObject<HTMLElement>}
            className="text-[#FFE566] font-bold underline decoration-[#FFE566]/40 underline-offset-4 cursor-default"
          >
            {p.em}
          </strong>
        ) : (
          <strong key={i} className="text-[#FF7124] font-bold">{p.em}</strong>
        )
      )}
    </>
  );
}

export default function Quiz({ onComplete, onSkip }: Props) {
  const [step, setStep]           = useState(0);
  const [chosen, setChosen]       = useState<number | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [flyingWords, setFlyingWords] = useState<{ id: number; word: string; startX: number; startY: number }[]>([]);
  const [done, setDone]           = useState(false);

  const keywordRef = useRef<HTMLElement>(null);

  function pick(idx: number) {
    if (chosen !== null) return;
    setChosen(idx);
    const word = questions[step].keyword;
    const id = Date.now();

    /* Get keyword's screen position */
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight * 0.38;
    if (keywordRef.current) {
      const rect = keywordRef.current.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    /* Launch flying ghost from keyword position */
    setFlyingWords(fw => [...fw, { id, word, startX, startY }]);

    /* Add to bank once ghost arrives (~850 ms) */
    setTimeout(() => {
      setCollected(c => [...c, word]);
      setFlyingWords(fw => fw.filter(f => f.id !== id));
    }, 860);

    /* Advance question */
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(s => s + 1);
        setChosen(null);
      } else {
        setDone(true);
      }
    }, 1300);
  }

  if (done) return <TransitionScreen words={collected} onComplete={onComplete} />;

  const q = questions[step];

  return (
    <div className="min-h-screen bg-[#0E1621] flex flex-col items-center justify-center pb-36 px-6 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#223382]/20 blur-3xl pointer-events-none" />

      {/* Skip */}
      <button onClick={onSkip}
        className="absolute top-6 right-7 text-[#F4F1EC]/30 hover:text-[#F4F1EC]/70 text-xs tracking-widest uppercase transition-colors z-10">
        Skip →
      </button>

      {/* Progress pills */}
      <div className="flex gap-3 mb-14">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
            i === step   ? "w-8 bg-[#FF7124]" :
            i < step     ? "w-4 bg-[#FF7124]/50" :
                           "w-4 bg-[#F4F1EC]/15"
          }`} />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full text-center mb-12 z-10">
          <p className="text-[#F4F1EC]/40 text-xs uppercase tracking-[0.22em] mb-5">
            Question {step + 1} of {questions.length}
          </p>
          <h2 className="text-[#F4F1EC] text-xl md:text-2xl font-semibold leading-relaxed">
            <QText parts={q.parts} keywordRef={keywordRef} />
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Answer options */}
      <AnimatePresence mode="wait">
        <motion.div key={`opts-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl z-10">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)}
              className={`text-left px-14 py-6 rounded-2xl border text-sm md:text-base font-medium transition-all duration-200
                ${chosen === i
                  ? "border-[#FF7124] bg-[#FF7124]/15 text-[#FF7124] scale-[1.02]"
                  : chosen !== null
                    ? "border-[#F4F1EC]/8 bg-[#162035]/40 text-[#F4F1EC]/25 cursor-default"
                    : "border-[#F4F1EC]/12 bg-[#162035]/60 text-[#F4F1EC]/80 hover:border-[#FF7124]/50 hover:bg-[#162035] hover:scale-[1.01] active:scale-[0.99]"
                }`}>
              {opt}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Flying word ghosts — launch from keyword position */}
      {flyingWords.map(fw => {
        const travelY = window.innerHeight - 90 - fw.startY;
        return (
          <motion.div key={fw.id}
            style={{ position: "fixed", top: fw.startY, left: fw.startX, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 1, y: 0, scale: 1.4 }}
            animate={{ opacity: 0.9, y: travelY, scale: 1 }}
            transition={{ duration: 0.82, ease: [0.4, 0, 0.6, 1] }}
            className="z-50 pointer-events-none select-none">
            <span className="px-6 py-2.5 bg-[#FFE566]/20 border border-[#FFE566]/60 text-[#FFE566] text-sm font-bold rounded-full whitespace-nowrap shadow-[0_0_20px_rgba(255,229,102,0.4)]">
              {fw.word}
            </span>
          </motion.div>
        );
      })}

      {/* Discovered — floating card above bottom edge */}
      <div className="fixed bottom-10 left-0 right-0 flex flex-col items-center pointer-events-none z-20 px-6">
        <AnimatePresence>
          {collected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex flex-col items-center gap-3 px-8 py-5
                         bg-[#0a1220]/85 border border-[#F4F1EC]/10 rounded-2xl backdrop-blur-md
                         shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="text-[#F4F1EC]/25 text-[10px] uppercase tracking-[0.28em]">Discovered</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {collected.map((word) => (
                    <motion.span key={word}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="px-6 py-2.5 bg-[#FFE566]/15 border border-[#FFE566]/40 text-[#FFE566] text-xs font-bold rounded-full">
                      {word}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Transition screen ────────────────────────────────────────── */
function TransitionScreen({ words, onComplete }: { words: string[]; onComplete: () => void }) {
  const [phase, setPhase] = useState<"words" | "mission">("words");

  useEffect(() => {
    const t = setTimeout(() => setPhase("mission"), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
      className="min-h-screen bg-[#0E1621] flex flex-col items-center justify-center gap-8 px-6 text-center relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FF7124]/8 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">

        {phase === "words" && (
          <motion.div key="words"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.5 } }}
            className="flex flex-col items-center gap-7 z-10">
            <p className="text-[#F4F1EC]/35 text-xs uppercase tracking-[0.28em]">You identified</p>
            <div className="flex gap-5 flex-wrap justify-center">
              {words.map((word, i) => (
                <motion.span key={word}
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.35, type: "spring", stiffness: 260, damping: 18 }}
                  className="px-7 py-3 bg-[#FFE566]/15 border border-[#FFE566]/45 text-[#FFE566] font-bold text-base rounded-full">
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="text-[#F4F1EC]/25 text-xs mt-1">These are the gaps NeuroTouch was built to close.</motion.p>
          </motion.div>
        )}

        {phase === "mission" && (
          <motion.div key="mission"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-center gap-6 max-w-lg z-10">

            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-[#FF7124]/30 animate-ping" />
              <div className="w-16 h-16 rounded-full border-2 border-[#FF7124] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF7124" strokeWidth="2" strokeLinecap="round">
                  <ellipse cx="12" cy="12" rx="10" ry="6"/>
                  <circle cx="12" cy="12" r="3" fill="#FF7124" stroke="none"/>
                </svg>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-1">
              <p className="text-[#F4F1EC] text-2xl md:text-3xl font-bold leading-snug">
                An estimated{" "}
                <span className="text-[#FF7124]">15 million people</span>{" "}
                live with spinal cord injury worldwide.
              </p>
              <p className="text-[#F4F1EC]/30 text-xs mt-1 tracking-wide">
                WHO. (2023). <em>World report on disability.</em>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-[#F4F1EC]/60 text-sm md:text-base leading-relaxed">
              NeuroTouch was built for them — restoring{" "}
              <strong className="text-[#FF7124]">{words[0]}</strong>,{" "}
              <strong className="text-[#FF7124]">{words[1]}</strong>, and{" "}
              <strong className="text-[#FF7124]">{words[2]}</strong>{" "}
              through eye tracking and lip reading.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              onClick={onComplete}
              className="mt-2 px-12 py-5 bg-[#FF7124] text-white font-semibold rounded-full hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,113,36,0.4)] text-base tracking-wide">
              See how →
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
