"use client";

interface Props { onGetIntroduced: () => void }

export default function Hero({ onGetIntroduced }: Props) {
  return (
    <div className="relative min-h-screen bg-[#0E1621] flex flex-col overflow-hidden">

      {/* Neural network background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none">
        {[["12%","18%","50%","8%"],["50%","8%","88%","18%"],["12%","18%","28%","48%"],
          ["88%","18%","72%","48%"],["28%","48%","72%","48%"],["28%","48%","44%","80%"],
          ["72%","48%","56%","80%"],["44%","80%","56%","80%"],["4%","50%","12%","18%"],
          ["96%","50%","88%","18%"]
        ].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i%2===0?"#FF7124":"#223382"} strokeWidth="0.8"/>
        ))}
        {[[12,18],[50,8],[88,18],[28,48],[72,48],[44,80],[56,80],[4,50],[96,50],[50,92]].map(([cx,cy],i)=>(
          <g key={i}>
            <circle cx={`${cx}%`} cy={`${cy}%`} r="4" fill="rgba(255,113,36,0.1)"/>
            <circle cx={`${cx}%`} cy={`${cy}%`} r="2" fill="#FF7124"
              style={{animation:`pulse 3s ease-in-out ${i*0.3}s infinite`}}/>
          </g>
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.9}}`}</style>
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"radial-gradient(ellipse at center, transparent 30%, rgba(14,22,33,0.95) 100%)"}}/>

      {/* Top-left label */}
      <div className="absolute top-7 left-8 z-10">
        <p className="text-[#F4F1EC]/45 text-[10px] uppercase tracking-[0.22em] leading-[2]">
          Assistive technology<br/>for mobility-disabled users
        </p>
      </div>

      {/* Top-right brand */}
      <div className="absolute top-7 right-8 z-10 text-right">
        <p className="text-[#F4F1EC] text-sm font-bold tracking-wide">NeuroTouch</p>
        <p className="text-[#F4F1EC]/30 text-[10px] tracking-[0.2em] uppercase">by SonicHub</p>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10 px-6 pt-20 pb-8">
        {/* Logo glow */}
        <div className="relative" style={{animation:"floatY 4s ease-in-out infinite"}}>
          <div className="absolute inset-0 rounded-3xl blur-3xl scale-[1.8] bg-[#FF7124]/20"/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="NeuroTouch" width={112} height={112} className="relative rounded-2xl shadow-2xl"/>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-[#F4F1EC] font-black leading-none tracking-tight"
              style={{fontSize:"clamp(3rem,8vw,6rem)"}}>
            Neuro<span className="text-[#FF7124]">Touch</span>
          </h1>
          <p className="text-[#F4F1EC]/35 text-[11px] mt-3 tracking-[0.28em] uppercase">
            App for Assistive Technology
          </p>
        </div>

        {/* CTA */}
        <button onClick={onGetIntroduced}
          className="group mt-3 px-20 py-6 bg-[#FF7124] text-white font-bold text-lg rounded-full
                     hover:bg-[#ff8c47] active:scale-95 transition-all duration-200
                     shadow-[0_0_60px_rgba(255,113,36,0.5)] tracking-wide">
          Get introduced
          <span className="ml-3 inline-block transition-transform group-hover:translate-x-1.5">→</span>
        </button>

        <p className="text-[#F4F1EC]/20 text-xs tracking-widest">
          our contacts below ↓
        </p>
      </div>

      {/* Contacts */}
      <div className="relative z-10 border-t border-[#F4F1EC]/8 px-8 py-10 flex flex-col items-center gap-5">
        <p className="text-[#F4F1EC]/25 text-[10px] uppercase tracking-[0.25em]">Find us</p>
        <div className="flex flex-wrap gap-8 justify-center">
          <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2.5 text-[#F4F1EC]/50 hover:text-[#FF7124] transition-colors text-sm font-medium">
            <YTIcon/> @sonichub_nt
          </a>
          <a href="https://instagram.com/neurotouch.app" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2.5 text-[#F4F1EC]/50 hover:text-[#FF7124] transition-colors text-sm font-medium">
            <IGIcon/> @neurotouch.app
          </a>
        </div>
        <p className="text-[#F4F1EC]/15 text-[10px] tracking-widest text-center">
          NAZARBAYEV INTELLECTUAL SCHOOL · ASTANA, KAZAKHSTAN · TEAM SONICHUB
        </p>
      </div>
      <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}

function YTIcon(){return<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z"/></svg>;}
function IGIcon(){return<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1C3.9 21.7 2.3 20.1 2.2 16.9 2.1 15.6 2.1 15.3 2.1 12s0-3.6.1-4.9C2.3 3.9 3.9 2.3 7.1 2.2 8.4 2.2 8.7 2.2 12 2.2Zm0-2.2c-3.3 0-3.7 0-5 .1C2.7.3.3 2.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.2 4.3 2.6 6.7 6.9 6.9 1.3.1 1.7.1 5 .1s3.7 0 5-.1c4.3-.2 6.7-2.6 6.9-6.9.1-1.3.1-1.7.1-5s0-3.7-.1-5C23.7 2.7 21.3.3 17 .1 15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>;}
