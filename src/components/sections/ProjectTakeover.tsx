"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { getProjectById } from "@/data/projects";
import MagneticButton from "@/components/ui/MagneticButton";
import { ANIMATION } from "@/lib/constants";

interface ProjectTakeoverProps {
  projectId: string | null;
  onClose: () => void;
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function ProjectTakeoverContent({
  projectId,
  onClose,
}: ProjectTakeoverProps & { projectId: string }) {
  const project = getProjectById(projectId);
  const tProject = useTranslations(`projectsData.${toCamelCase(projectId)}`);
  const tPage = useTranslations("projectPage");

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isGithub = project?.link?.includes("github.com");
  const iframeSrc = project?.link?.startsWith("https://")
    ? project.link
    : `https://${project?.link}`;

  // iframeLoaded resets naturally because AnimatePresence remounts
  // this component with a new key (projectId), so useState(false) re-inits.

  // Detect overscroll at top to trigger close
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < -50 && el.scrollTop <= 0) {
        onClose();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [onClose]);

  if (!project) return null;

  const ctaText = isGithub ? "VIEW GITHUB →" : "VIEW SITE →";

  return (
    <motion.div
      key={project.id}
      ref={scrollRef}
      className="fixed bottom-0 left-0 right-0 overflow-y-auto bg-background z-20"
      style={{ height: "75vh" }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{
        duration: ANIMATION.duration.normal,
        ease: ANIMATION.ease.out,
      }}
    >
      <div className="px-6 md:px-12 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-xs text-muted uppercase tracking-widest">
            <span>{tProject("category")}</span>
            <span className="opacity-40">—</span>
            <span>{project.year}</span>
          </div>
          <MagneticButton strength={0.15}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest border border-foreground/20 px-4 py-2 text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {ctaText}
            </a>
          </MagneticButton>
        </div>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-6xl uppercase leading-none">
          {project.title}
        </h2>

        {/* Description */}
        <p className="font-mono text-sm text-muted max-w-3xl leading-relaxed">
          {tProject("longDescription")}
        </p>

        {/* Iframe preview */}
        {!isGithub ? (
          <div
            className="relative border border-foreground/10 overflow-hidden"
            style={{ height: "50vh" }}
          >
            {!iframeLoaded && (
              <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
            )}
            <iframe
              src={iframeSrc}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full"
              onLoad={() => setIframeLoaded(true)}
              title={project.title}
            />
          </div>
        ) : (
          <div
            className="border border-foreground/10 flex items-center justify-center"
            style={{ height: "50vh" }}
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-muted hover:text-accent transition-colors uppercase tracking-widest"
            >
              VIEW ON GITHUB →
            </a>
          </div>
        )}

        {/* Tags / badges */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs uppercase tracking-widest border border-foreground/20 px-3 py-1 text-muted hover:border-accent hover:text-accent transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Role + Client */}
        <div className="grid grid-cols-2 gap-6 font-mono text-xs text-muted">
          <div className="space-y-1">
            <div className="uppercase tracking-widest opacity-50">
              {tPage("role")}
            </div>
            <div className="uppercase tracking-widest">
              {tProject("role")}
            </div>
          </div>
          <div className="space-y-1">
            <div className="uppercase tracking-widest opacity-50">
              {tPage("client")}
            </div>
            <div className="uppercase tracking-widest">
              {project.client}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectTakeover({
  projectId,
  onClose,
}: ProjectTakeoverProps) {
  return (
    <AnimatePresence>
      {projectId && (
        <ProjectTakeoverContent
          key={projectId}
          projectId={projectId}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
