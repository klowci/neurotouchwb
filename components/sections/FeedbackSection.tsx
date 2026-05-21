"use client";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1fAk4mNGrUMWNWNYdNu62b11Tp6TPX1tmBLbFzdEjPgU/viewform";

const QUOTES = [
  {
    text: "If refined, NeuroTouch would solve the problem our members face every day — accessing their phones independently.",
    source: "Early adopter, Astana Social Technologies",
    role: "Rehabilitation community for musculoskeletal disorders",
  },
  {
    text: "High-precision tasks like typing could cause eye strain over time. You need to detect fatigue and adapt to each user.",
    source: "Chief Physician, Infinity Life Clinic",
    role: "Medical professional and business advisor",
  },
  {
    text: "A subscription model is the right approach — it keeps the entry barrier low for our patients.",
    source: "Chief Physician, Infinity Life Clinic",
    role: "Astana, Kazakhstan",
  },
];

const STATS = [
  { n: "12+", label: "clinics\ncontacted" },
  { n: "OPVL", label: "validation\nframework" },
  { n: "v2", label: "improved\nbased on feedback" },
];

export default function FeedbackSection() {
  return (
    <div className="flex flex-col gap-20">

      {/* Header */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-3">Section 06</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">What people said</h2>
        <p className="text-[#F4F1EC]/45 text-sm mt-3">Real feedback from clinics, communities, and early adopters.</p>
      </div>

      {/* Quotes */}
      <div className="flex flex-col gap-8">
        {QUOTES.map((q, i) => (
          <div key={i} className="bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl px-12 py-12 relative overflow-hidden
                                  hover:border-[#F4F1EC]/14 transition-colors">
            {/* Decorative quote mark — right side, large, non-overlapping */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] font-serif leading-none
                            text-[#FF7124]/10 pointer-events-none select-none">
              &rdquo;
            </div>

            <p className="text-[#F4F1EC]/90 text-base md:text-lg font-medium leading-relaxed relative z-10 max-w-[85%]">
              {q.text}
            </p>
            <div className="mt-8 border-l-2 border-[#FF7124]/35 pl-5 relative z-10">
              <p className="text-[#FF7124] text-sm font-semibold">{q.source}</p>
              <p className="text-[#F4F1EC]/35 text-xs mt-1">{q.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Research stats */}
      <div className="grid grid-cols-3 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="bg-[#0a121d] border border-[#F4F1EC]/8 rounded-2xl py-10 px-6 text-center">
            <p className="text-[#FF7124] text-3xl font-black">{s.n}</p>
            <p className="text-[#F4F1EC]/35 text-[10px] uppercase tracking-widest mt-2 leading-relaxed whitespace-pre-line">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* How we gathered feedback */}
      <div className="bg-[#0a121d] border border-[#223382]/35 rounded-2xl px-10 py-12">
        <p className="text-[#F4F1EC]/35 text-[10px] uppercase tracking-[0.22em] mb-8">How we gathered feedback</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-[#F4F1EC]/55 leading-relaxed">
          <div>
            <strong className="text-[#F4F1EC] block mb-2">12+ clinics contacted</strong>
            Medical expertise and patient interviews across Astana
          </div>
          <div>
            <strong className="text-[#F4F1EC] block mb-2">Astana Social Technologies</strong>
            Real users with musculoskeletal disorders tested the app
          </div>
          <div>
            <strong className="text-[#F4F1EC] block mb-2">OPVL framework</strong>
            Every source validated before publishing findings
          </div>
        </div>
      </div>

      {/* Google Form CTA */}
      <div className="flex flex-col items-center gap-7 py-16 px-10 border border-[#F4F1EC]/8 rounded-2xl bg-[#0a121d]">
        <p className="text-[#F4F1EC]/50 text-base text-center max-w-sm leading-relaxed">
          Tried NeuroTouch or have a suggestion? We read every response.
        </p>
        <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2.5 px-20 py-5 bg-[#FF7124] text-white font-semibold rounded-full
                      hover:bg-[#ff8c47] active:scale-95 transition-all shadow-[0_0_25px_rgba(255,113,36,0.3)]
                      text-base tracking-wide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
          </svg>
          Leave feedback
        </a>
      </div>
    </div>
  );
}
