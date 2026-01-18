"use client";

import dynamic from "next/dynamic";

const Contact = dynamic(
  () => import("@/components/sections/Contact"),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <main className="relative min-h-screen pt-24">
      <Contact />
    </main>
  );
}
