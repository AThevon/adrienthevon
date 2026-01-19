"use client";

import dynamic from "next/dynamic";
import { useDeviceDetect, usePerformance, useReducedMotion } from "@/hooks";

const ConstellationTimeline = dynamic(
  () => import("@/components/sections/ConstellationTimeline"),
  { ssr: false }
);

const SimpleTimeline = dynamic(
  () => import("@/components/effects/mobile/SimpleTimeline"),
  { ssr: false }
);

export default function JourneyPage() {
  const { isMobile } = useDeviceDetect();
  const { enable3D } = usePerformance();
  const prefersReducedMotion = useReducedMotion();

  // Mobile: always show SimpleTimeline
  // Desktop: show ConstellationTimeline if 3D is enabled and no reduced motion preference
  const showConstellation = !isMobile && enable3D && !prefersReducedMotion;

  return (
    <main className="relative">
      {showConstellation ? <ConstellationTimeline /> : <SimpleTimeline />}
    </main>
  );
}
