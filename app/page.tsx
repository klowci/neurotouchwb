"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import Quiz from "@/components/Quiz";
import InteractiveStory from "@/components/InteractiveStory";
import StaticSite from "@/components/StaticSite";
import RotatePrompt from "@/components/RotatePrompt";

type Mode = "hero" | "quiz" | "interactive" | "static";

export default function Home() {
  const [mode, setMode] = useState<Mode>("hero");

  return (
    <main className="overflow-x-hidden">
      <RotatePrompt />
      {mode === "hero"        && <Hero        onGetIntroduced={() => setMode("quiz")} />}
      {mode === "quiz"        && <Quiz        onComplete={() => setMode("interactive")} onSkip={() => setMode("interactive")} />}
      {mode === "interactive" && <InteractiveStory onSkip={() => setMode("static")} onFinish={() => setMode("static")} onGoToGames={() => { history.replaceState(null,"","#games"); setMode("static"); }} />}
      {mode === "static"      && <StaticSite />}
    </main>
  );
}
