"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import { usePerformance } from "@/hooks";

const SectionEffects = dynamic(
  () => import("@/components/effects/SectionEffects"),
  { ssr: false }
);

export default function Home() {
  const { enableCursorEffects } = usePerformance();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && enableCursorEffects && <SectionEffects enabled />}

      <main className="relative">
        <Hero />
      </main>
    </>
  );
}
