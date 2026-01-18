"use client";

import dynamic from "next/dynamic";

const NeuralNetwork2D = dynamic(
  () => import("@/components/sections/NeuralNetwork2D"),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

export default function SkillsPage() {
  // Always use 2D Canvas version for better performance
  return (
    <>
      <CustomCursor />
      <main className="relative min-h-screen">
        <NeuralNetwork2D />
      </main>
    </>
  );
}
