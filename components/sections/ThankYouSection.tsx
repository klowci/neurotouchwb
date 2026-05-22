"use client";
import { useEffect, useState } from "react";

const CONFETTI_COLORS = ["#FF7124","#223382","#F4F1EC","#FF8C47","#2d4499","#ff6b00"];

interface Piece { id:number; x:number; delay:number; color:string; size:number; duration:number }

export default function ThankYouSection({ onFinish, onGoToGames }: { onFinish: () => void; onGoToGames: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      duration: 2.5 + Math.random() * 2,
    })));
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center gap-10 text-center py-12 overflow-hidden">

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {pieces.map(p => (
          <div key={p.id} className="absolute top-0 rounded-sm opacity-0"
            style={{
              left: `${p.x}%`,
              width: p.size, height: p.size,
              background: p.color,
              animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            }}/>
        ))}
        <style>{`
          @keyframes confettiFall {
            0%   { opacity:1; transform: translateY(-20px) rotate(0deg); }
            100% { opacity:0; transform: translateY(110vh) rotate(720deg); }
          }
        `}</style>
      </div>

      {/* Heading */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-3">Section 07</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-5xl font-black leading-tight">
          That&apos;s all, folks.
        </h2>
        <p className="text-[#F4F1EC]/45 text-base mt-4 max-w-md mx-auto leading-relaxed">
          Thank you for exploring NeuroTouch. We built this because we believe{" "}
          <strong className="text-[#F4F1EC]">technology should work for everyone</strong> — no exceptions.
        </p>
      </div>

      {/* Socials */}
      <div className="flex flex-col gap-3 items-center">
        <p className="text-[#F4F1EC]/25 text-[10px] uppercase tracking-[0.28em]">Follow the journey</p>
        <div className="flex gap-3">
          <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 px-7 py-3 bg-[#162035] border border-[#F4F1EC]/10 rounded-full
                        text-sm text-[#F4F1EC]/65 hover:text-[#FF7124] hover:border-[#FF7124]/40 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z"/>
            </svg>
            @sonichub_nt
          </a>
          <a href="https://instagram.com/neurotouch.app" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 px-7 py-3 bg-[#162035] border border-[#F4F1EC]/10 rounded-full
                        text-sm text-[#F4F1EC]/65 hover:text-[#FF7124] hover:border-[#FF7124]/40 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1C3.9 21.7 2.3 20.1 2.2 16.9 2.1 15.6 2.1 15.3 2.1 12s0-3.6.1-4.9C2.3 3.9 3.9 2.3 7.1 2.2 8.4 2.2 8.7 2.2 12 2.2Zm0-2.2c-3.3 0-3.7 0-5 .1C2.7.3.3 2.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.2 4.3 2.6 6.7 6.9 6.9 1.3.1 1.7.1 5 .1s3.7 0 5-.1c4.3-.2 6.7-2.6 6.9-6.9.1-1.3.1-1.7.1-5s0-3.7-.1-5C23.7 2.7 21.3.3 17 .1 15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>
            </svg>
            @neurotouch.app
          </a>
        </div>
      </div>

      {/* Footer note */}
      <div className="flex flex-col gap-1.5 items-center">
        <p className="text-[#F4F1EC]/18 text-[10px] tracking-[0.25em] uppercase">
          Nazarbayev Intellectual School · Astana, Kazakhstan
        </p>
        <p className="text-[#F4F1EC]/18 text-[10px] tracking-[0.25em] uppercase">
          Team SonicHub · Technovation Challenge
        </p>
      </div>

      {/* Games CTA */}
      <div className="flex flex-col items-center gap-3 mt-2">
        <button onClick={onGoToGames}
          className="px-20 py-5 bg-[#FF7124] text-white font-bold text-base rounded-full
                     hover:bg-[#ff8c47] active:scale-95 transition-all duration-200
                     shadow-[0_0_40px_rgba(255,113,36,0.35)] tracking-wide">
          Explore features &amp; <strong>Games</strong> →
        </button>
        <p className="text-[#F4F1EC]/25 text-xs text-center max-w-xs leading-relaxed">
          We&apos;re still developing them — more coming soon
        </p>
        <button onClick={onFinish}
          className="text-[#F4F1EC]/30 text-xs hover:text-[#F4F1EC]/55 transition-colors mt-1">
          ↑ Back to top
        </button>
      </div>
    </div>
  );
}
