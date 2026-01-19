"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import HoverReveal from "@/components/ui/HoverReveal";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import { projects } from "@/data/projects";

const LiquidCursor = dynamic(
  () => import("@/components/effects/LiquidCursor"),
  { ssr: false }
);

export default function WorkPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "gallery">("list");
  const t = useTranslations("projects");
  const tNav = useTranslations("nav");

  const handleProjectClick = (project: { id: string }) => {
    router.push(`/work/${project.id}`);
  };

  // Gallery view - immersive horizontal scroll
  if (viewMode === "gallery") {
    return (
      <main className="min-h-screen">
        {/* Page header - fixed like the global header */}
        <div className="fixed top-24 left-0 right-0 z-30 w-full px-8 py-1 flex items-center justify-between">
          {/* Back button */}
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2"
            data-cursor="hover"
          >
            ← {tNav("back")}
          </motion.a>

          {/* Title */}
          <span className="font-mono text-xs text-muted bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2">
            {t("subtitle")}
          </span>

          {/* Mode toggle */}
          <button
            onClick={() => setViewMode("list")}
            className="font-mono text-xs text-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2 flex items-center gap-2"
            data-cursor="hover"
          >
            {t("listView")}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        <HorizontalGallery items={projects} onItemClick={handleProjectClick} />
      </main>
    );
  }

  // List view - classic scrolling
  return (
    <main className="min-h-screen">
      {/* Page header - fixed like gallery view */}
      <div className="fixed top-24 left-0 right-0 z-30 w-full px-8 py-1 flex items-center justify-between">
        {/* Back button */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm text-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2"
          data-cursor="hover"
        >
          ← {tNav("back")}
        </motion.a>

        {/* Title */}
        <span className="font-mono text-xs text-muted bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2">
          {t("subtitle")}
        </span>

        {/* Mode toggle */}
        <button
          onClick={() => setViewMode("gallery")}
          className="font-mono text-xs text-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2 flex items-center gap-2"
          data-cursor="hover"
        >
          {t("galleryView")}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

        {/* Projects list with hover reveal */}
        <section className="pt-40 pb-32 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <HoverReveal
              projects={projects}
              onProjectClick={handleProjectClick}
            />
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
                  <div className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2" style={{ color: '#ffaa00' }}>
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}
