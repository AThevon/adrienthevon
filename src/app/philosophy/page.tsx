"use client";

import dynamic from "next/dynamic";

const NoiseSection = dynamic(
  () => import("@/components/sections/NoiseSection"),
  { ssr: false }
);

export default function PhilosophyPage() {
  return (
    <main className="relative min-h-screen pt-24">
      <NoiseSection />
    </main>
  );
}
