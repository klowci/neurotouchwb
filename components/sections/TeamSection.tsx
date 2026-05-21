"use client";

const TEAM = [
  {
    name: "Merey Kurmanova",
    role: "Developer · Business",
    focus: "Android · Backend · GitHub",
    about: "Leads the technical architecture and keeps the codebase running. Built the core Android infrastructure and manages the project repository.",
    facts: ["Always finding new hobbies", "Fan of thriller books", "Aspiring data scientist"],
    photo: "/team/merey.jpeg",
    initials: "MK",
  },
  {
    name: "Lyudmila Kucherenko",
    role: "Developer · Tester",
    focus: "Eye tracking · Motion algorithms",
    about: "Designs and implements the eye-tracking pipeline. Works on the Kalman filter smoothing and pupil displacement math that makes cursor control possible.",
    facts: ["Biggest math & Greek language fan", "Statistics department leader", "Varsity team in 2 sports"],
    photo: "/team/lyudmila.jpeg",
    initials: "LK",
  },
  {
    name: "Aisha Karimova",
    role: "Developer · Business",
    focus: "Lip reading · TFLite · ML pipeline",
    about: "Trains and maintains the lip-reading classifier. Built the MediaPipe landmark pipeline and TFLite model that recognises mouthed letters on-device.",
    facts: ["Owns a Nintendo DS", "Favourite animals are goats", "Wishes her pillow a good night"],
    photo: "/team/aisha.jpeg",
    initials: "AK",
  },
  {
    name: "Taniris Sarseken",
    role: "Outreach · Business",
    focus: "Community · Partnerships",
    about: "Drives community engagement and external partnerships. Connects the project with organisations and individuals who can benefit from NeuroTouch.",
    facts: ["Had 10 cats in my life", "Wants to visit the moon", "Has infinite luck"],
    photo: "/team/taniris.jpeg",
    initials: "TS",
  },
  {
    name: "Nelli Mazhitova",
    role: "Design · Business",
    focus: "UI/UX · Interface · Video",
    about: "Shapes the visual language of NeuroTouch — from the app interface to the brand identity and video content that tells the story.",
    facts: ["Addicted to reading manhwas", "Wants to create a vaccine", "Best Homescapes player"],
    photo: "/team/nelly.jpeg",
    initials: "NM",
  },
];

export default function TeamSection() {
  return (
    <div className="flex flex-col gap-14">

      {/* Header */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-2">Section 01</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">Meet the team</h2>
        <p className="text-[#F4F1EC]/45 text-sm mt-2 tracking-wide">5 students. 2 months. 1 mission.</p>
      </div>

      {/* Group photo */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/team.jpeg" alt="SonicHub team"
             className="w-full object-cover rounded-2xl max-h-72" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0E1621] to-transparent"/>
        <p className="absolute bottom-4 left-5 text-[#F4F1EC]/55 text-[10px] tracking-[0.28em] uppercase">
          Nazarbayev Intellectual School · Astana, Kazakhstan
        </p>
      </div>

      {/* Member cards — single horizontal scrollable row */}
      <div className="flex flex-row gap-5 overflow-x-auto pb-3 -mx-2 px-2"
           style={{ scrollbarWidth: "thin", scrollbarColor: "#FF7124 #162035" }}>
        {TEAM.map((m, i) => (
          <div key={i}
            className="flex-shrink-0 w-[290px] bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl p-7
                       flex flex-col gap-5 hover:border-[#FF7124]/25 transition-colors duration-300">

            {/* Avatar + name/role */}
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo} alt={m.name}
                   className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7124]/30 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#F4F1EC] font-semibold text-sm leading-snug">{m.name}</p>
                <p className="text-[#FF7124] text-xs mt-0.5 font-medium">{m.role}</p>
              </div>
            </div>

            {/* About */}
            <p className="text-[#F4F1EC]/55 text-xs leading-relaxed">{m.about}</p>

            {/* Fun facts */}
            <div className="flex flex-col gap-1.5 mt-auto">
              <p className="text-[#F4F1EC]/20 text-[9px] uppercase tracking-[0.25em] mb-0.5">Fun facts</p>
              {m.facts.map((f, fi) => (
                <div key={fi} className="flex items-start gap-2">
                  <span className="text-[#FF7124]/50 text-[10px] mt-0.5">·</span>
                  <span className="text-[#F4F1EC]/40 text-[11px] leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Focus tags */}
            <div className="flex flex-wrap gap-1.5">
              {m.focus.split(" · ").map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-[#0E1621] border border-[#F4F1EC]/10
                                           text-[#F4F1EC]/40 text-[10px] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* School tag */}
      <p className="text-[#F4F1EC]/18 text-[10px] uppercase tracking-[0.28em] text-center">
        Team SonicHub · Nazarbayev Intellectual School · Astana, Kazakhstan
      </p>
    </div>
  );
}
