"use client";

import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";

const PhilosophyCanvas = dynamic(
  () => import("@/components/sections/PhilosophyCanvas"),
  { ssr: false }
);

const PhilosophyStatic = dynamic(
  () => import("@/components/effects/mobile/PhilosophyStatic"),
  { ssr: false }
);

export default function PhilosophyPage() {
  const { isMobile, isHydrated } = useDeviceDetect();

  const isMobileReady = isHydrated && isMobile;

  return (
    <main className="relative min-h-dvh">
      {isMobileReady ? <PhilosophyStatic /> : <PhilosophyCanvas />}
    </main>
  );
}
