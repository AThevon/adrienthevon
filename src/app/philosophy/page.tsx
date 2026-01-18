"use client";

import dynamic from "next/dynamic";

const PhilosophyCanvas = dynamic(
  () => import("@/components/sections/PhilosophyCanvas"),
  { ssr: false }
);

export default function PhilosophyPage() {
  return (
    <main className="relative min-h-screen">
      <PhilosophyCanvas />
    </main>
  );
}
