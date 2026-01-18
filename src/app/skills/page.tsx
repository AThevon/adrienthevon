"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance } from "@/hooks";

const SkillsMatrix3D = dynamic(
  () => import("@/components/sections/SkillsMatrix3D"),
  { ssr: false }
);

// Fallback component for reduced performance mode
function SkillsFallback() {
  const t = useTranslations("skills");
  return (
    <section className="py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">{t("title")}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">
          {t("subtitle").split(" ")[0]} <span className="text-accent">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["REACT", "NEXT.JS", "TYPESCRIPT", "THREE.JS", "WEBGL", "GSAP", "MOTION", "TAILWIND", "NODE.JS", "FIGMA", "GLSL", "CANVAS"].map((skill) => (
            <div key={skill} className="p-4 border border-foreground/10 font-mono text-sm">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SkillsPage() {
  const { enable3D } = usePerformance();

  return (
    <main className="relative min-h-screen pt-24">
      {enable3D ? <SkillsMatrix3D /> : <SkillsFallback />}
    </main>
  );
}
