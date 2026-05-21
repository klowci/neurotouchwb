"use client";

const COMPARE = [
  { crit:"No head movement needed",   iphone:false, jabb:false, smart:true,  nt:true  },
  { crit:"Works for speech-impaired", iphone:false, jabb:true,  smart:true,  nt:true  },
  { crit:"Smooth eye-gaze control",   iphone:false, jabb:false, smart:true,  nt:true  },
  { crit:"Fast private typing",       iphone:false, jabb:true,  smart:false, nt:true  },
  { crit:"Affordable / no hardware",  iphone:true,  jabb:true,  smart:false, nt:true  },
  { crit:"Available in Kazakhstan",   iphone:true,  jabb:true,  smart:false, nt:true  },
];

const PRICING = [
  { label:"Free Trial", price:"3 days",    desc:"Full access · no card required", highlight:false },
  { label:"Monthly",    price:"$4.99/mo",  desc:"Cancel any time",                highlight:true  },
  { label:"Yearly",     price:"$39.99/yr", desc:"Save 33% vs monthly",            highlight:false },
  { label:"Lifetime",   price:"$89.99",    desc:"Pays off in ~18 months",         highlight:false },
];

const Check = ({ v }: { v: boolean }) => (
  <span className={v ? "text-[#FF7124] font-bold text-base" : "text-[#F4F1EC]/18 text-sm"}>
    {v ? "✓" : "✗"}
  </span>
);

export default function ValueSection() {
  return (
    <div className="flex flex-col gap-14">

      {/* Header */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-2">Section 05</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">Our product &amp; its value</h2>
        <p className="text-[#F4F1EC]/45 text-sm mt-2">Where we stand in the assistive technology landscape.</p>
      </div>

      {/* App screens */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["/screens/logged-in.jpeg","/screens/eye-cursor.png","/screens/eye-action.png","/screens/lip-detect.png"].map((s, i) => (
          <div key={i} className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt={`App screen ${i+1}`}
                 className="rounded-2xl shadow-xl object-cover border border-[#F4F1EC]/8"
                 style={{ height: 260, width: "auto" }} />
          </div>
        ))}
      </div>

      {/* Competitor table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#F4F1EC]/10">
              <th className="text-left text-[#F4F1EC]/35 text-[10px] uppercase tracking-[0.2em] py-4 pr-6 font-normal">
                Criteria
              </th>
              {["iPhone","Jabberwocky","Smartbox"].map(col => (
                <th key={col} className="text-center text-[#F4F1EC]/35 text-[10px] uppercase tracking-[0.2em] py-4 px-4 font-normal">
                  {col}
                </th>
              ))}
              {/* NeuroTouch column — highlighted header */}
              <th className="text-center py-4 px-4 relative">
                <div className="absolute inset-x-1 inset-y-0 rounded-t-xl bg-[#FF7124]/8 border-x border-t border-[#FF7124]/20" />
                <span className="relative text-[#FF7124] text-[11px] uppercase tracking-[0.2em] font-bold">
                  NeuroTouch
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r, i) => (
              <tr key={i}
                className={`border-b border-[#F4F1EC]/5 hover:bg-[#162035]/30 transition-colors
                            ${i === COMPARE.length - 1 ? "last-row" : ""}`}>
                <td className="text-[#F4F1EC]/65 py-4 pr-6 text-xs">{r.crit}</td>
                <td className="text-center py-4 px-4"><Check v={r.iphone}/></td>
                <td className="text-center py-4 px-4"><Check v={r.jabb}/></td>
                <td className="text-center py-4 px-4"><Check v={r.smart}/></td>
                {/* NeuroTouch column with persistent highlight bg */}
                <td className="text-center py-4 px-4 relative">
                  <div className={`absolute inset-x-1 inset-y-0 bg-[#FF7124]/8 border-x border-[#FF7124]/20
                    ${i === COMPARE.length - 1 ? "rounded-b-xl border-b" : ""}`} />
                  <span className="relative"><Check v={r.nt}/></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing */}
      <div className="flex flex-col gap-5">
        <p className="text-[#F4F1EC]/35 text-xs uppercase tracking-[0.22em] font-normal">Pricing</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING.map((p, i) => (
            <div key={i}
              className={`rounded-2xl p-8 border flex flex-col gap-3 transition-all
                ${p.highlight
                  ? "border-[#FF7124] bg-[#FF7124]/10 shadow-[0_0_35px_rgba(255,113,36,0.18)]"
                  : "border-[#F4F1EC]/8 bg-[#111c2e]"}`}>
              <p className="text-[#F4F1EC]/45 text-[10px] uppercase tracking-[0.22em]">{p.label}</p>
              <p className={`text-3xl font-black ${p.highlight ? "text-[#FF7124]" : "text-[#F4F1EC]"}`}>{p.price}</p>
              <p className="text-[#F4F1EC]/38 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
