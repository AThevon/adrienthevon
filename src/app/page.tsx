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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if preloader has already been shown this session
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (!hasSeenPreloader && enableAnimations) {
      setIsLoading(true);
    }
  }, [enableAnimations, isMounted]);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Mark preloader as seen for this session
    sessionStorage.setItem("hasSeenPreloader", "true");
  };

  return (
    <>
      {/* Preloader - only on first load of the session */}
      {isMounted && enableAnimations && isLoading && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Geometry particles cursor - only on homepage */}
      {isMounted && enableCursorEffects && <SectionEffects enabled={!isLoading} />}

      {/* Main content */}
      <main className="relative">
        <Hero preloaderActive={isLoading} />
      </main>
    </>
  );
}
