"use client";

import dynamic from "next/dynamic";

const About = dynamic(
  () => import("@/components/sections/About"),
  { ssr: false }
);

export default function AboutPage() {
  return (
    <main className="relative min-h-screen pt-24">
      <About />
    </main>
  );
}
