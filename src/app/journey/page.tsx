"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance, useReducedMotion } from "@/hooks";
import { timelineEvents } from "@/data/timeline";

const ConstellationTimeline = dynamic(
  () => import("@/components/sections/ConstellationTimeline"),
  { ssr: false }
);

// Fallback component for reduced performance mode or reduced motion
function TimelineFallback() {
  const t = useTranslations("timeline");
  const tEvents = useTranslations("timeline.events");

  return (
    <section className="py-32 px-8 md:px-16 bg-background" data-cursor-mode="timeline">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">{t("title")}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16">
          {t("subtitle").split(" ")[0]}{" "}
          <span className="text-accent">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>

        <div className="relative space-y-12">
          {timelineEvents.map((event) => {
            const title = tEvents(`${event.key}.title`);
            const description = tEvents(`${event.key}.description`);

            return (
              <div
                key={event.year}
                className="flex items-start gap-8 border-l-2 pl-8 py-4"
                style={{ borderColor: event.color }}
              >
                <div className="flex-shrink-0">
                  <span className="font-mono text-3xl font-bold" style={{ color: event.color }}>
                    {event.year}
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: event.color }}>
                    {title}
                  </h3>
                  <p className="text-muted leading-relaxed">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function JourneyPage() {
  const { enable3D } = usePerformance();
  const prefersReducedMotion = useReducedMotion();

  // Show fallback if performance is low or user prefers reduced motion
  const showConstellation = enable3D && !prefersReducedMotion;

  return (
    <main className="relative">
      {showConstellation ? <ConstellationTimeline /> : <TimelineFallback />}
    </main>
  );
}
