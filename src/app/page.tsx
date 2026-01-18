"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(enableAnimations);

  return (
    <>
      {/* Preloader - skip if animations disabled */}
      {enableAnimations && isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
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
