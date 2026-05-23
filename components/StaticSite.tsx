"use client";
import { useState, useEffect, useRef } from "react";
import TeamSection     from "@/components/sections/TeamSection";
import AboutSection    from "@/components/sections/AboutSection";
import StorySection    from "@/components/sections/StorySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ValueSection    from "@/components/sections/ValueSection";
import FeedbackSection from "@/components/sections/FeedbackSection";
import ThankYouSection from "@/components/sections/ThankYouSection";
import WordSearch      from "@/components/games/WordSearch";
import GazeSimulator   from "@/components/games/GazeSimulator";
import LipReadingGame  from "@/components/games/LipReadingGame";

type Tab = "home" | "games";

const NAV_SECTIONS = [
  { label: "Team",     id: "s-team",     num: "01" },
  { label: "About",    id: "s-about",    num: "02" },
  { label: "Story",    id: "s-story",    num: "03" },
  { label: "Features", id: "s-features", num: "04" },
  { label: "Value",    id: "s-value",    num: "05" },
  { label: "Feedback", id: "s-feedback", num: "06" },
  { label: "Outro",    id: "s-thankyou", num: "07" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StaticSite() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [tab,           setTab]           = useState<Tab>("home");
  const [activeSection, setActiveSection] = useState<string>("s-team");
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── URL hash routing: read on mount, listen for back/forward ── */
  useEffect(() => {
    const readHash = () => {
      const h = window.location.hash;
      if (h === "#games") setTab("games");
      else if (h === "#home" || h === "") setTab("home");
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  /* ── Scroll-spy: middle-band IntersectionObserver + bottom-of-page fallback ── */
  useEffect(() => {
    if (tab !== "home") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    NAV_SECTIONS.forEach(n => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });

    /* Fallback: activate 07 when user reaches the bottom */
    function onScroll() {
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (nearBottom) setActiveSection("s-thankyou");
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [tab]);

  /* ── Switch tab + update URL hash ── */
  function switchTab(next: Tab) {
    setTab(next);
    history.replaceState(null, "", next === "games" ? "#games" : "#home");
    window.scrollTo({ top: 0 });
  }

  /* ── Animated transition to Games tab ── */
  function goToGames() {
    if (transitionTimer.current) return; // prevent double-call
    setTransitioning(true);
    transitionTimer.current = setTimeout(() => {
      transitionTimer.current = null;
      setTransitioning(false);
      setTab("games");
      history.replaceState(null, "", "#games");
      window.scrollTo({ top: 0 });
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[#0E1621] relative">

      {/* ── Page-transition overlay ── */}
      <div
        className="fixed inset-0 bg-[#FF7124]/12 backdrop-blur-sm z-[200] pointer-events-none transition-opacity duration-500"
        style={{ opacity: transitioning ? 1 : 0 }}
      />

      {/* ── Fixed left scroll-spy nav (desktop only, home tab only) ── */}
      {tab === "home" && (
        <div
          className="hidden xl:flex fixed top-1/2 -translate-y-1/2 z-40 flex-col items-center"
          style={{ left: "calc(50vw - 660px)" }}
        >
          {/* Connecting line */}
          <div className="absolute top-4 bottom-4 left-[7px] w-px bg-[#FF7124]/15" />

          {NAV_SECTIONS.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="relative flex items-center gap-3 py-3 group"
              title={n.label}
            >
              {/* Dot */}
              <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all duration-300 relative z-10 ${
                activeSection === n.id
                  ? "bg-[#FF7124] border-[#FF7124] shadow-[0_0_10px_rgba(255,113,36,0.7)]"
                  : "bg-[#0E1621] border-[#F4F1EC]/20 group-hover:border-[#FF7124]/50"
              }`} />

              {/* Number label */}
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                activeSection === n.id
                  ? "text-[#FF7124] opacity-100"
                  : "text-[#F4F1EC]/20 opacity-0 group-hover:opacity-100 group-hover:text-[#F4F1EC]/50"
              }`}>
                {n.num}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0E1621]/95 backdrop-blur-md border-b border-[#F4F1EC]/8">
        <div className="max-w-6xl mx-auto px-8 md:px-10 py-5 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="NeuroTouch" width={40} height={40} className="rounded-xl shadow-md flex-shrink-0" />
            <div>
              <p className="text-[#F4F1EC] font-bold text-sm leading-none tracking-wide">NeuroTouch</p>
              <p className="text-[#F4F1EC]/30 text-[10px] uppercase tracking-[0.2em] leading-none mt-0.5">by SonicHub</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => switchTab("home")}
              className={`px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] rounded-full transition-all duration-200
                ${tab === "home"
                  ? "bg-[#FF7124] text-white shadow-[0_0_16px_rgba(255,113,36,0.35)]"
                  : "text-[#F4F1EC]/45 hover:text-[#F4F1EC]/80 hover:bg-[#162035]"}`}>
              Overview
            </button>
            <button
              onClick={() => switchTab("games")}
              className={`px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] rounded-full transition-all duration-200
                ${tab === "games"
                  ? "bg-[#FF7124] text-white shadow-[0_0_16px_rgba(255,113,36,0.35)]"
                  : "text-[#F4F1EC]/45 hover:text-[#F4F1EC]/80 hover:bg-[#162035]"}`}>
              Games
            </button>

            {tab === "home" && (
              <>
                <div className="w-px h-4 bg-[#F4F1EC]/15 mx-2" />
                {NAV_SECTIONS.slice(0, 6).map(n => (
                  <button key={n.id} onClick={() => scrollTo(n.id)}
                    className="px-7 py-3 text-[#F4F1EC]/45 hover:text-[#FF7124] text-xs uppercase tracking-[0.18em]
                               transition-colors rounded-full hover:bg-[#162035] font-medium">
                    {n.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Socials + mobile hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
                 className="text-[#F4F1EC]/35 hover:text-[#FF7124] transition-colors text-xs">YouTube</a>
              <a href="https://instagram.com/neurotouch.app" target="_blank" rel="noopener noreferrer"
                 className="text-[#F4F1EC]/35 hover:text-[#FF7124] transition-colors text-xs">Instagram</a>
            </div>
            <button className="md:hidden text-[#F4F1EC]/50 hover:text-[#FF7124] p-1" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#F4F1EC]/8 px-8 py-4 flex flex-col gap-1">
            {[
              { label: "Overview", action: () => { switchTab("home");  setMenuOpen(false); } },
              { label: "Games",    action: () => { switchTab("games"); setMenuOpen(false); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="text-left px-6 py-3 text-[#F4F1EC]/60 hover:text-[#FF7124] text-sm transition-colors rounded-lg hover:bg-[#162035]">
                {item.label}
              </button>
            ))}
            <div className="border-t border-[#F4F1EC]/8 mt-2 pt-2" />
            {tab === "home" && NAV_SECTIONS.slice(0, 6).map(n => (
              <button key={n.id} onClick={() => { scrollTo(n.id); setMenuOpen(false); }}
                className="text-left px-6 py-3 text-[#F4F1EC]/45 hover:text-[#FF7124] text-sm transition-colors rounded-lg hover:bg-[#162035]">
                {n.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero banner ── */}
      <div className="relative py-28 px-8 flex flex-col items-center text-center border-b border-[#F4F1EC]/6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#162035]/30 to-transparent pointer-events-none"/>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="NeuroTouch" width={88} height={88}
             className="rounded-2xl mb-5 relative shadow-2xl"
             style={{ animation: "floatY 4s ease-in-out infinite" }} />
        <h1 className="text-[#F4F1EC] text-4xl md:text-6xl font-black relative">
          Neuro<span className="text-[#FF7124]">Touch</span>
        </h1>
        <p className="text-[#F4F1EC]/45 text-sm mt-3 tracking-[0.25em] uppercase relative max-w-md">
          Hands-free phone control · Eye tracking · Lip reading
        </p>
        <div className="flex gap-3 mt-10 relative">
          <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 px-16 py-4 bg-[#FF7124] text-white font-semibold rounded-full text-sm
                        hover:bg-[#ff8c47] transition-colors shadow-[0_0_30px_rgba(255,113,36,0.35)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z"/>
            </svg>
            Watch demo
          </a>
          <a href="https://instagram.com/neurotouch.app" target="_blank" rel="noopener noreferrer"
             className="px-16 py-4 border border-[#F4F1EC]/15 text-[#F4F1EC]/65 rounded-full text-sm
                        hover:border-[#FF7124]/40 hover:text-[#FF7124] transition-all">
            Follow us
          </a>
        </div>
        <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto">

        {tab === "home" && (
          <>
            {[
              { id: "s-team",     comp: <TeamSection/>     },
              { id: "s-about",    comp: <AboutSection/>    },
              { id: "s-story",    comp: <StorySection/>    },
              { id: "s-features", comp: <FeaturesSection/> },
              { id: "s-value",    comp: <ValueSection/>    },
              { id: "s-feedback", comp: <FeedbackSection/> },
            ].map(({ id, comp }) => (
              <section key={id} id={id} className="px-8 sm:px-14 md:px-20 py-24 border-b border-[#F4F1EC]/6">
                {comp}
              </section>
            ))}
            <section id="s-thankyou" className="px-8 sm:px-14 md:px-20 pt-36 pb-24">
              <ThankYouSection
                onFinish={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                onGoToGames={goToGames}
              />
            </section>
          </>
        )}

        {tab === "games" && (
          <div className="px-8 sm:px-14 md:px-20 py-20 flex flex-col gap-16">
            <div>
              <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-3">Interactive</p>
              <h2 className="text-[#F4F1EC] text-3xl font-black">Games</h2>
              <p className="text-[#F4F1EC]/40 text-sm mt-2 leading-relaxed">
                Experience NeuroTouch concepts hands-on.
              </p>
            </div>

            <div className="border border-[#F4F1EC]/8 rounded-2xl p-10 md:p-14 bg-[#0a121d]">
              <h3 className="text-[#F4F1EC] font-bold text-base mb-8">Word Search</h3>
              <WordSearch />
            </div>

            <div className="border border-[#FF7124]/15 rounded-2xl p-10 md:p-14 bg-[#0a121d]">
              <GazeSimulator />
            </div>

            <div className="border border-[#FF7124]/15 rounded-2xl p-10 md:p-14 bg-[#0a121d]">
              <LipReadingGame />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
