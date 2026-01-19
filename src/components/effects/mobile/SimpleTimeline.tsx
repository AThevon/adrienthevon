"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { timelineEvents } from "@/data/timeline";

export default function SimpleTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("timeline");
  const tEvents = useTranslations("timeline.events");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background">
      {/* Header - Static on mobile, sticky on desktop */}
      <div className="relative md:sticky md:top-24 left-0 right-0 z-10 px-8 py-6 md:bg-background/80 md:backdrop-blur-sm md:border-b md:border-foreground/10">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-mono text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">{t("title")}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
          {t("subtitle").split(" ")[0]}{" "}
          <span className="text-accent">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative px-8 py-16">
        {/* Vertical connecting line - gradient based on scroll */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-foreground/10">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent via-accent to-transparent"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            }}
          />
        </div>

        {/* Timeline Events */}
        <div className="relative space-y-16 md:space-y-20">
          {timelineEvents.map((event, index) => {
            const title = tEvents(`${event.key}.title`);
            const description = tEvents(`${event.key}.description`);
            const isLast = index === timelineEvents.length - 1;

            return (
              <motion.div
                key={event.key}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-10 top-0 w-5 h-5 rounded-full border-2 bg-background z-10"
                  style={{ borderColor: event.color }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: event.color }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />

                  {/* Inner dot */}
                  <div
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                </motion.div>

                {/* Content card */}
                <motion.div
                  className="relative bg-background border border-foreground/10 p-6 rounded-lg overflow-hidden"
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Accent gradient background */}
                  <div
                    className="absolute top-0 left-0 w-2 h-full"
                    style={{
                      background: `linear-gradient(180deg, ${event.color} 0%, transparent 100%)`,
                    }}
                  />

                  {/* Year badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border"
                    style={{
                      borderColor: `${event.color}40`,
                      backgroundColor: `${event.color}10`,
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: event.color }}
                    >
                      {event.year}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-xl md:text-2xl font-bold mb-3"
                    style={{ color: event.color }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    {title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-base text-muted leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {description}
                  </motion.p>

                  {/* Corner accents */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 opacity-10"
                    style={{
                      background: `linear-gradient(225deg, ${event.color} 0%, transparent 70%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-20 h-20 opacity-5"
                    style={{
                      background: `linear-gradient(45deg, ${event.color} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Index number */}
                  <div
                    className="absolute top-4 right-4 font-mono text-4xl font-bold opacity-5"
                    style={{ color: event.color }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </motion.div>

                {/* "Current" badge for last item */}
                {isLast && (
                  <motion.div
                    className="mt-4 flex items-center gap-2 pl-1"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    <span
                      className="font-mono text-xs uppercase tracking-wider"
                      style={{ color: event.color }}
                    >
                      {t("current") || "Current"}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom spacer */}
        <div className="h-32" />
      </div>

      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={`bg-${event.key}`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + (index % 2 === 0 ? 30 : -30)}% ${20 + index * 15}%, ${event.color}05 0%, transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
          />
        ))}
      </div>
    </div>
  );
}
