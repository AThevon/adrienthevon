"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import { usePerformance } from "@/hooks";

const Preloader = dynamic(() => import("@/components/effects/Preloader"), {
  ssr: false,
});

const SectionEffects = dynamic(
  () => import("@/components/effects/SectionEffects"),
  { ssr: false }
);

export default function Home() {
  const { enableAnimations, enableCursorEffects } = usePerformance();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if preloader has already been shown this session
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (!hasSeenPreloader && enableAnimations) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
    }
  }, [enableAnimations]);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Mark preloader as seen for this session
    sessionStorage.setItem("hasSeenPreloader", "true");
  };

  return (
    <>
      {/* Preloader - only on first load of the session */}
      {enableAnimations && isLoading && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Geometry particles cursor - only on homepage */}
      {enableCursorEffects && <SectionEffects enabled={!isLoading} />}

      {/* Main content */}
      <main className="relative">
        <Hero />
      </main>
    </>
  );
}
