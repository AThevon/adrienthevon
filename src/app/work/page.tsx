"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import HoverReveal from "@/components/ui/HoverReveal";
import TextReveal from "@/components/ui/TextReveal";
import ScrollImageReveal from "@/components/ui/ScrollImageReveal";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import { projects } from "@/data/projects";

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

const LiquidCursor = dynamic(
  () => import("@/components/effects/LiquidCursor"),
  { ssr: false }
);

export default function WorkPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");
  const t = useTranslations("projects");
  const tNav = useTranslations("nav");

  const handleProjectClick = (project: { id: string }) => {
    router.push(`/work/${project.id}`);
  };

  // Gallery view - immersive horizontal scroll
  if (viewMode === "gallery") {
    return (
      <>
        <CustomCursor />
        <LiquidCursor intensity={0.3} />

        {/* Mode toggle - positioned below language switcher */}
        <div className="fixed top-8 right-32 z-40 flex items-center gap-4">
          <button
            onClick={() => setViewMode("list")}
            className="font-mono text-xs text-muted hover:text-foreground transition-colors"
            data-cursor="hover"
          >
            {t("listView")}
          </button>
        </div>

        {/* Back button */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 left-8 z-40 font-mono text-sm text-muted hover:text-foreground transition-colors"
          data-cursor="hover"
        >
          ← {tNav("back")}
        </motion.a>

        {/* Title overlay */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40">
          <span className="font-mono text-xs text-muted">{t("subtitle")}</span>
        </div>

        <HorizontalGallery items={projects} onItemClick={handleProjectClick} />
      </>
    );
  }

  // List view - classic scrolling
  return (
    <>
      <CustomCursor />
      <LiquidCursor intensity={0.3} />

      <main className="min-h-screen">
        {/* Header */}
        <section className="pt-32 pb-16 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.a
                  href="/"
                  className="font-mono text-sm text-muted hover:text-foreground transition-colors"
                  whileHover={{ x: -5 }}
                  data-cursor="hover"
                >
                  ← {tNav("back")}
                </motion.a>
                <span className="w-16 h-[1px] bg-foreground/20" />
                <span className="font-mono text-sm text-muted">{t("subtitle")}</span>
              </div>

              {/* Mode toggle */}
              <button
                onClick={() => setViewMode("gallery")}
                className="font-mono text-xs text-muted hover:text-accent transition-colors mr-28"
                data-cursor="hover"
              >
                {t("galleryView")}
              </button>
            </motion.div>

            <TextReveal className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
              {t("title")}
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-xl text-muted max-w-2xl"
            >
              {t("intro")}
            </motion.p>
          </div>
        </section>

        {/* Projects list with hover reveal */}
        <section className="py-16 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <HoverReveal
              projects={projects}
              onProjectClick={handleProjectClick}
            />
          </div>
        </section>

        {/* Featured images with scroll reveal */}
        <section className="py-32 px-8 md:px-16">
          <div className="max-w-7xl mx-auto space-y-32">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-16">
                <span className="font-mono text-sm text-muted">{t("featured")}</span>
                <span className="flex-1 h-[1px] bg-foreground/10" />
              </div>
            </motion.div>

            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                className="cursor-pointer"
                onClick={() => handleProjectClick(project)}
                data-cursor="hover"
              >
                <ScrollImageReveal
                  src={project.image}
                  alt={project.title}
                  title={project.title}
                  subtitle={project.category}
                  direction={index % 2 === 0 ? "left" : "right"}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats section */}
        <section className="py-32 px-8 md:px-16 border-t border-foreground/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: `${projects.length}`, label: t("stats.projects") },
                { value: "15+", label: t("stats.technologies") },
                { value: "100%", label: t("stats.passion") },
                { value: "∞", label: t("stats.possibilities") },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-7xl font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
