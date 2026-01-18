"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance } from "@/hooks";

const NoiseTerrain = dynamic(
  () => import("@/components/experiments/NoiseTerrain"),
  { ssr: false }
);

export default function NoiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { enable3D } = usePerformance();
  const t = useTranslations("philosophy");

  const philosophyItems = [
    {
      number: "01",
      title: t("items.craft.title"),
      description: t("items.craft.description"),
    },
    {
      number: "02",
      title: t("items.pixels.title"),
      description: t("items.pixels.description"),
    },
    {
      number: "03",
      title: t("items.code.title"),
      description: t("items.code.description"),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const terrainOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

  return (
    <section ref={sectionRef} data-cursor-mode="noise" className="relative min-h-[150vh] overflow-hidden">
      {/* Noise Terrain Background */}
      {enable3D && (
        <motion.div
          className="sticky top-0 left-0 w-full h-screen z-0"
          style={{ opacity: terrainOpacity }}
        >
          <NoiseTerrain
            color="#00ccff"
            gridSize={40}
            scale={0.025}
            interactive={true}
            mouseInfluenceRadius={250}
            mouseInfluenceStrength={100}
          />
          {/* Dark gradient overlay for readability - pointer-events-none */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 pointer-events-none" />
        </motion.div>
      )}

      {/* Fallback background for non-3D */}
      {!enable3D && (
        <div className="sticky top-0 left-0 w-full h-screen z-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      )}

      {/* Content floating above */}
      <div className="relative z-10 -mt-[100vh]">
        {/* Section header */}
        <div className="h-screen flex items-center justify-center">
          <motion.div
            className="text-center"
            style={{ y: contentY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-mono text-sm text-accent mb-4 block"
            >
              {t("title")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
            >
              {t("subtitle")}
            </motion.h2>
          </motion.div>
        </div>

        {/* Philosophy items */}
        <div className="min-h-screen flex items-center py-32 px-8 md:px-16">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {philosophyItems.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group"
                >
                  <div className="bg-background/60 backdrop-blur-md border border-foreground/10 p-8 h-full hover:border-accent/50 transition-colors duration-500">
                    {/* Number */}
                    <span className="font-mono text-6xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                      {item.number}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight mt-4 mb-4 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Decorative line */}
                    <motion.div
                      className="w-0 h-px bg-accent mt-6 group-hover:w-full transition-all duration-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-24 text-center"
            >
              <blockquote className="text-2xl md:text-3xl font-light text-muted/60 italic">
                "{t("quote")}"
              </blockquote>
              <cite className="font-mono text-xs text-accent mt-4 block not-italic">
                {t("quoteAuthor")}
              </cite>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interaction hint */}
      {enable3D && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-muted/40 z-20"
        >
          {t("hint")}
        </motion.div>
      )}
    </section>
  );
}
