"use client";

const STATS = [
  { n: "15M+",  label: "People live with spinal cord injury globally" },
  { n: "40%",   label: "of disabled people can't use standard apps" },
  { n: "0",     label: "Extra hardware required" },
  { n: "100%",  label: "On-device — your data never leaves your phone" },
];

export default function AboutSection() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-2">Section 02</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">About NeuroTouch</h2>
      </div>

      <div className="bg-[#162035] rounded-2xl p-8 md:p-12 border border-[#F4F1EC]/8">
        <p className="text-[#F4F1EC] text-lg md:text-xl font-medium leading-relaxed">
          NeuroTouch is a <span className="text-[#FF7124] font-bold">self-sufficient piece of technology</span> —
          it gives people with mobility disabilities full control of their phone using only their eyes and lips.
          No hands. No voice. No extra device. Just you.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-[#0E1621] border border-[#223382]/50 rounded-2xl p-8 flex flex-col gap-2">
            <p className="text-[#FF7124] text-4xl font-black">{s.n}</p>
            <p className="text-[#F4F1EC]/55 text-xs leading-relaxed mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-[#162035] border border-[#F4F1EC]/8 rounded-2xl p-8">
          <p className="text-[#FF7124] font-bold text-sm mb-3">Mission</p>
          <p className="text-[#F4F1EC]/70 text-sm leading-relaxed">
            To ensure that people with mobility disabilities have an opportunity to use mobile devices
            in a comfortable and <strong className="text-[#F4F1EC]">inclusive</strong> way.
          </p>
        </div>
        <div className="flex-1 bg-[#162035] border border-[#F4F1EC]/8 rounded-2xl p-8">
          <p className="text-[#FF7124] font-bold text-sm mb-3">The gap we fill</p>
          <p className="text-[#F4F1EC]/70 text-sm leading-relaxed">
            iPhone eye tracking is inaccurate. Jabberwocky needs head movement. Smartbox requires expensive hardware.
            NeuroTouch works for <strong className="text-[#F4F1EC]">everyone</strong> — including those with speech impairments.
          </p>
        </div>
      </div>
    </div>
  );
}
