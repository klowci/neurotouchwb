"use client";
import { useEffect, useState } from "react";

export default function RotatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(window.innerWidth < 768 && window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => { window.removeEventListener("resize", check); window.removeEventListener("orientationchange", check); };
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0E1621] flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="text-6xl" style={{ animation: "floatY 3s ease-in-out infinite" }}>📱</div>
      <h2 className="text-[#FF7124] text-2xl font-bold">Rotate your device</h2>
      <p className="text-[#F4F1EC]/65 text-sm leading-relaxed max-w-xs">
        This site is designed for <strong className="text-[#F4F1EC]">landscape view</strong>.
        Rotate your phone horizontal or open on a computer for the full experience.
      </p>
    </div>
  );
}
