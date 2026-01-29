"use client";

import dynamic from "next/dynamic";

const About = dynamic(
  () => import("@/components/sections/About"),
  { ssr: false }
);

export default function AboutPage() {
  return (
    <main className="relative h-dvh overflow-hidden">
      <About />
    </main>
  );
}
