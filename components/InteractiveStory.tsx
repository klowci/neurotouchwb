"use client";
import { useEffect, useRef, useState } from "react";
import TeamSection     from "@/components/sections/TeamSection";
import AboutSection    from "@/components/sections/AboutSection";
import StorySection    from "@/components/sections/StorySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ValueSection    from "@/components/sections/ValueSection";
import FeedbackSection from "@/components/sections/FeedbackSection";
import ThankYouSection from "@/components/sections/ThankYouSection";

interface Props { onSkip: () => void; onFinish: () => void; onGoToGames: () => void }

const STEPS = [
  { label: "Team",      short: "01" },
  { label: "About",     short: "02" },
  { label: "Story",     short: "03" },
  { label: "Features",  short: "04" },
  { label: "Value",     short: "05" },
  { label: "Feedback",  short: "06" },
  { label: "Thank you", short: "07" },
];

const SECTION_IDS = ["sec-team","sec-about","sec-story","sec-features","sec-value","sec-feedback","sec-thanks"];

function sectionOpacity(i: number, activeIdx: number): number {
  const dist = Math.abs(i - activeIdx);
  if (dist === 0) return 1;
  if (dist === 1) return 0.55;
  return 0.2;
}

export default function InteractiveStory({ onSkip, onFinish, onGoToGames }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainRef     = useRef<HTMLElement | null>(null);

  // Scroll-based spy — reliable inside overflow-y-auto containers
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const trigger = el.scrollTop + el.clientHeight * 0.38;
      let best = 0;
      sectionRefs.current.forEach((sec, i) => {
        if (sec && sec.offsetTop <= trigger) best = i;
      });
      setActiveIdx(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(i: number) {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const sections = [
    <TeamSection key="team" />,
    <AboutSection key="about" />,
    <StorySection key="story" />,
    <FeaturesSection key="features" />,
    <ValueSection key="value" />,
    <FeedbackSection key="feedback" />,
    <ThankYouSection key="thanks" onFinish={onFinish} onGoToGames={onGoToGames} />,
  ];

  return (
    <div className="min-h-screen bg-[#0E1621] flex flex-col">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-[#0E1621]/92 backdrop-blur-md border-b border-[#F4F1EC]/8">
        <div className="flex items-center justify-between px-8 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="NeuroTouch" width={40} height={40} className="rounded-xl shadow-lg flex-shrink-0" />
            <div>
              <p className="text-[#F4F1EC] text-sm font-bold leading-none tracking-wide">NeuroTouch</p>
              <p className="text-[#F4F1EC]/30 text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">by SonicHub</p>
            </div>
          </div>

          {/* Step pills */}
          <div className="hidden md:flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => scrollTo(i)}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300
                  ${i === activeIdx
                    ? "bg-[#FF7124] text-white shadow-[0_0_18px_rgba(255,113,36,0.45)]"
                    : i < activeIdx
                      ? "bg-[#FF7124]/18 text-[#FF7124]/65"
                      : "bg-[#162035] text-[#F4F1EC]/28 hover:text-[#F4F1EC]/60 hover:bg-[#1e2d45]"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <button onClick={onSkip}
            className="text-[#F4F1EC]/30 hover:text-[#F4F1EC]/70 text-xs tracking-widest uppercase transition-colors flex items-center gap-1.5">
            Skip <span>→</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-[#F4F1EC]/5">
          <div className="h-full bg-[#FF7124] transition-all duration-500"
               style={{ width: `${((activeIdx + 1) / STEPS.length) * 100}%` }}/>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="flex flex-1">

        {/* Vertical sidebar */}
        <aside className="hidden lg:flex w-22 flex-col items-center py-10 sticky top-[68px] self-start h-[calc(100vh-68px)] bg-[#0E1621] border-r border-[#F4F1EC]/6"
               style={{ width: 88 }}>
          <div className="relative flex flex-col items-center flex-1 py-4 w-full">
            {/* track line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-px bg-[#F4F1EC]/8"/>
            {/* filled progress */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 w-px bg-[#FF7124]/55 transition-all duration-500"
                 style={{ height: `${(activeIdx / (STEPS.length - 1)) * 88}%` }}/>

            {STEPS.map((s, i) => (
              <button key={i} onClick={() => scrollTo(i)}
                className="relative z-10 flex flex-col items-center gap-1.5 py-5 group flex-1 justify-center w-full">
                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300
                  ${i === activeIdx
                    ? "border-[#FF7124] bg-[#FF7124] shadow-[0_0_16px_rgba(255,113,36,0.7)] scale-[1.35]"
                    : i < activeIdx
                      ? "border-[#FF7124]/50 bg-[#FF7124]/30"
                      : "border-[#F4F1EC]/18 bg-transparent group-hover:border-[#FF7124]/40"}`}/>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors
                  ${i === activeIdx ? "text-[#FF7124]" : i < activeIdx ? "text-[#FF7124]/38" : "text-[#F4F1EC]/18"}`}>
                  {s.short}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {sections.map((sec, i) => {
            const isActive = i === activeIdx;
            return (
              <div key={i} id={SECTION_IDS[i]}
                ref={el => { sectionRefs.current[i] = el; }}
                className="min-h-screen pl-20 pr-10 md:pl-24 md:pr-16 lg:pl-28 lg:pr-20 py-20 flex flex-col justify-center
                           border-b border-[#F4F1EC]/6 last:border-0 relative
                           transition-all duration-500"
                style={{ opacity: sectionOpacity(i, activeIdx) }}>

                {/* Active-section left accent bar */}
                <div className={`absolute left-0 top-8 bottom-8 w-[3px] rounded-full transition-all duration-500
                  ${isActive ? "bg-[#FF7124] opacity-100" : "opacity-0"}`}/>

                {/* Active-section subtle glow overlay */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none rounded-r-xl"
                    style={{ background: "linear-gradient(to right, rgba(255,113,36,0.04) 0%, transparent 40%)" }}/>
                )}

                {/* Section number label */}
                <div className={`absolute top-8 right-10 transition-all duration-300 ${isActive ? "opacity-60" : "opacity-0"}`}>
                  <span className="text-[#FF7124] text-[10px] font-bold tracking-[0.3em] uppercase">{STEPS[i]?.short}</span>
                </div>

                {sec}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
