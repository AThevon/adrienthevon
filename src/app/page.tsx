"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { usePerformance } from "@/hooks";

const SkillsMatrix3D = dynamic(
  () => import("@/components/sections/SkillsMatrix3D"),
  { ssr: false }
);

const Timeline3D = dynamic(
  () => import("@/components/sections/Timeline3D"),
  { ssr: false }
);

const NoiseSection = dynamic(
  () => import("@/components/sections/NoiseSection"),
  { ssr: false }
);

// Dynamic imports for heavy components
const GlitchCursor = dynamic(
  () => import("@/components/effects/GlitchCursor"),
  { ssr: false }
);

const SectionEffects = dynamic(
  () => import("@/components/effects/SectionEffects"),
  { ssr: false }
);

const Preloader = dynamic(() => import("@/components/effects/Preloader"), {
  ssr: false,
});

// Fallback components for reduced performance mode
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

function TimelineFallback() {
  const t = useTranslations("timeline");
  const tEvents = useTranslations("timeline.events");

  const events = [
    { year: "2019", key: "beginning" },
    { year: "2020", key: "deepDive" },
    { year: "2021", key: "creativeSpark" },
    { year: "2022", key: "professional" },
    { year: "2023", key: "levelUp" },
    { year: "2024", key: "now" },
  ];

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
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.year} className="flex items-center gap-8 border-l-2 border-accent pl-8">
              <span className="font-mono text-accent">{event.year}</span>
              <span className="text-xl font-bold">{tEvents(`${event.key}.title`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { enable3D, enableCursorEffects, enableAnimations } = usePerformance();
  const [isLoading, setIsLoading] = useState(enableAnimations);

  return (
    <>
      {/* Custom cursor - only on desktop */}
      {enableCursorEffects && <GlitchCursor />}

      {/* Section-based cursor effects - only on desktop */}
      {enableCursorEffects && <SectionEffects enabled={!isLoading} />}

      {/* Preloader - skip if animations disabled */}
      {enableAnimations && isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Main content */}
      <main className="relative">
        <Hero />
        <Projects />
        {enable3D ? <SkillsMatrix3D /> : <SkillsFallback />}
        <NoiseSection />
        {enable3D ? <Timeline3D /> : <TimelineFallback />}
        <About />
        <Contact />
      </main>
    </>
  );
}
