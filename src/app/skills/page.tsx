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

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

export default function SkillsPage() {
  const { isMobile } = useDeviceDetect();

  return (
    <>
      {!isMobile && <CustomCursor />}
      <main className="relative min-h-screen">
        {isMobile ? <StaticNetwork /> : <NeuralNetwork2D />}
      </main>
    </>
  );
}
