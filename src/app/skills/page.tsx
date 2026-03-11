"use client";

import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";

const NeuralNetwork2D = dynamic(
  () => import("@/components/sections/NeuralNetwork2D"),
  { ssr: false }
);

const StaticNetwork = dynamic(
  () => import("@/components/effects/mobile/StaticNetwork"),
  { ssr: false }
);

export default function SkillsPage() {
  const { isMobile, isHydrated } = useDeviceDetect();

  const isMobileReady = isHydrated && isMobile;

  return (
    <main className="relative min-h-dvh">
      {isMobileReady ? <StaticNetwork /> : <NeuralNetwork2D />}
    </main>
  );
}
