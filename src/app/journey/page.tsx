"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance } from "@/hooks";

const Timeline3D = dynamic(
  () => import("@/components/sections/Timeline3D"),
  { ssr: false }
);

// Fallback component for reduced performance mode
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

export default function JourneyPage() {
  const { enable3D } = usePerformance();

  return (
    <main className="relative min-h-screen pt-24">
      {enable3D ? <Timeline3D /> : <TimelineFallback />}
    </main>
  );
}
