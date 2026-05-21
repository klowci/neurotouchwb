"use client";
import GazeSimulator from "@/components/games/GazeSimulator";
import LipReadingGame from "@/components/games/LipReadingGame";

const VIDEOS = [
  { id: "ahZk_9u6pAc", title: "NeuroTouch Pitch" },
  { id: "QtStLBMlyig", title: "Technical Execution" },
];

const TAG_STYLE = "px-3 py-1 bg-[#FF7124]/15 border border-[#FF7124]/35 text-[#FF7124]/80 text-xs rounded-full";

export default function FeaturesSection() {
  return (
    <div className="flex flex-col gap-14">

      {/* Header */}
      <div>
        <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-2">Section 04</p>
        <h2 className="text-[#F4F1EC] text-3xl md:text-4xl font-black leading-tight">Our execution</h2>
        <p className="text-[#F4F1EC]/45 text-sm mt-2">Features and the technology behind them.</p>
      </div>

      {/* Eye tracking */}
      <div className="bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl p-10 md:p-12 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-shrink-0 flex gap-3 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/screens/eye-calibration-start.jpeg" alt="Eye calibration"
               className="rounded-xl shadow-xl object-cover" style={{ height: 260, width: "auto" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/screens/eye-calibration.jpeg" alt="Eye direction"
               className="rounded-xl shadow-xl object-cover" style={{ height: 260, width: "auto" }} />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF7124" strokeWidth="2" strokeLinecap="round">
                <ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3" fill="#FF7124" stroke="none"/>
              </svg>
            </div>
            <h3 className="text-[#F4F1EC] text-xl font-bold">Eye Tracking Cursor</h3>
          </div>
          <p className="text-[#F4F1EC]/65 text-sm leading-relaxed">
            Uses <strong className="text-[#F4F1EC]">MediaPipe Face Landmarker</strong> to identify facial key-points and
            calculate pupil displacement relative to a 45-frame baseline. A <strong className="text-[#F4F1EC]">Kalman filter</strong> reduces
            noise from lighting changes and low camera quality. An <strong className="text-[#F4F1EC]">exponential moving average</strong> enables
            continuous learning — adapting to each user individually, fully on-device.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Scroll","Tap","Click","Dwell","Notifications","Speed control"].map(f => (
              <span key={f} className={TAG_STYLE}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Gaze maze game */}
      <div className="border border-[#FF7124]/18 rounded-2xl p-8 bg-[#0a121d]">
        <GazeSimulator />
      </div>

      {/* Lip reading */}
      <div className="bg-[#111c2e] border border-[#F4F1EC]/8 rounded-2xl p-10 md:p-12 flex flex-col md:flex-row-reverse gap-10 items-center">
        <div className="flex-shrink-0 flex gap-3 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/screens/lip-calibration.jpeg" alt="Lip calibration"
               className="rounded-xl shadow-xl object-cover" style={{ height: 260, width: "auto" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/screens/lip-detect.png" alt="Lip detect"
               className="rounded-xl shadow-xl object-cover" style={{ height: 260, width: "auto" }} />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FF7124]/15 border border-[#FF7124]/40 flex items-center justify-center">
              <svg width="16" height="14" viewBox="0 0 20 14" fill="none" stroke="#FF7124" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 7 C5 2 15 2 18 7 C15 12 5 12 2 7Z"/>
                <path d="M6 7 C8 9.5 12 9.5 14 7"/>
              </svg>
            </div>
            <h3 className="text-[#F4F1EC] text-xl font-bold">Lip Reading · Visual Speech Recognition</h3>
          </div>
          <p className="text-[#F4F1EC]/65 text-sm leading-relaxed">
            A <strong className="text-[#F4F1EC]">lightweight TFLite classifier</strong> trained on lip landmark data gathered
            with MediaPipe. Users mouth letters to type — no speaking required. Designed for speech-impaired users and anyone
            who values privacy. Recalibratable at any time.
          </p>
          <div className="flex flex-wrap gap-2">
            {["12 lip shapes","Private typing","No internet","A–Z + Space","Recalibration"].map(f => (
              <span key={f} className={TAG_STYLE}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Lip reading game */}
      <div className="border border-[#FF7124]/18 rounded-2xl p-8 bg-[#0a121d]">
        <LipReadingGame />
      </div>

      {/* YouTube videos */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[#FF7124] text-xs uppercase tracking-[0.2em] font-semibold mb-1">Watch us</p>
          <h3 className="text-[#F4F1EC] text-xl font-bold">On YouTube</h3>
          <p className="text-[#F4F1EC]/40 text-xs mt-1">
            <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
               className="hover:text-[#FF7124] transition-colors">@sonichub_nt</a>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VIDEOS.map((v, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-[#F4F1EC]/8 bg-[#0a121d]">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="px-4 py-3 text-[#F4F1EC]/60 text-xs font-medium">{v.title}</p>
            </div>
          ))}
        </div>
        <a href="https://www.youtube.com/@sonichub_nt" target="_blank" rel="noopener noreferrer"
           className="self-start flex items-center gap-2 text-[#F4F1EC]/40 hover:text-[#FF7124] text-xs transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z"/>
          </svg>
          View all videos on YouTube
        </a>
      </div>
    </div>
  );
}
