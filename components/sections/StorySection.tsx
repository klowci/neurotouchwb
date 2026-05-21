"use client";
import WordSearch from "@/components/games/WordSearch";

const TIMELINE = [
  {
    phase: "Spark",
    label: "01",
    text: "A team member's relative suffered a serious injury. They could no longer use their phone independently. That moment set everything in motion.",
  },
  {
    phase: "Research",
    label: "02",
    text: "We interviewed neurologists, rehabilitation specialists, and mobility-disabled individuals at clinics across Astana. Every source was validated using the OPVL framework.",
  },
  {
    phase: "First build",
    label: "03",
    text: "Version 1: eye tracking only. No calibration. A quick-access button to swap actions. The cursor was uncontrollable — but it moved.",
  },
  {
    phase: "Iteration",
    label: "04",
    text: "The chief physician at Infinity Life Clinic told us high-precision tasks could cause eye strain. We added calibration, continuous learning, and tired-eye detection.",
  },
  {
    phase: "v2 launch",
    label: "05",
    text: "Lip reading joined the app. Widgets replaced the action button. Early adopters at Astana Social Technologies tested it — their feedback shaped what NeuroTouch is today.",
  },
];

export default function StorySection() {
  return (
    <div className="flex flex-col gap-12">

      {/* Header */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-2">Section 03</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">Our project story</h2>
        <p className="text-[#F4F1EC]/45 text-sm mt-2">From a personal moment to a working app.</p>
      </div>

      {/* Vertical timeline */}
      <div className="flex flex-col gap-0">
        {TIMELINE.map((t, i) => (
          <div key={i} className="flex gap-6 relative">

            {/* Left column — dot + line */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
              {/* Dot */}
              <div className="w-10 h-10 rounded-full bg-[#FF7124] border-[3px] border-[#0E1621]
                              shadow-[0_0_18px_rgba(255,113,36,0.5)] flex items-center justify-center z-10 flex-shrink-0">
                <span className="text-white text-[10px] font-black">{t.label}</span>
              </div>
              {/* Connector line */}
              {i < TIMELINE.length - 1 && (
                <div className="flex-1 w-px bg-gradient-to-b from-[#FF7124]/50 to-[#FF7124]/15 mt-1 mb-1" />
              )}
            </div>

            {/* Right column — card */}
            <div className={`flex-1 bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl px-9 py-8
                            hover:border-[#FF7124]/20 transition-colors duration-300
                            ${i < TIMELINE.length - 1 ? "mb-4" : ""}`}>
              <p className="text-[#FF7124] text-[10px] uppercase tracking-[0.3em] font-bold mb-3">{t.phase}</p>
              <p className="text-[#F4F1EC]/80 text-sm leading-relaxed">{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Word search game break */}
      <div className="border border-[#F4F1EC]/8 rounded-2xl p-10 bg-[#0d1520]">
        <p className="text-[#F4F1EC]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-8">
          game break
        </p>
        <WordSearch />
      </div>
    </div>
  );
}
