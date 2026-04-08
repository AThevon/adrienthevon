"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getProjectById } from "@/data/projects";
import MagneticButton from "@/components/ui/MagneticButton";

interface ProjectTakeoverProps {
  projectId: string | null;
  onClose: () => void;
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export default function ProjectTakeover({
  projectId,
  onClose,
}: ProjectTakeoverProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const isOpen = projectId !== null;
  const project = projectId ? getProjectById(projectId) : null;

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
  }, [projectId]);

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "1";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  }, []);

  useEffect(() => {
    if (scrollRef.current && projectId) {
      scrollRef.current.scrollTop = 0;
    }
  }, [projectId]);

  if (!project) return null;

  const isGithub = project.link.includes("github.com");
  const iframeSrc = project.link.startsWith("https://")
    ? project.link
    : `https://${project.link}`;
  const ctaText = isGithub ? "VIEW GITHUB →" : "VIEW SITE →";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20"
      style={{
        top: "15vh",
        transform: isOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 250ms cubic-bezier(0.33, 1, 0.68, 1)",
      }}
    >
      {/* Close button - arrow up */}
      <div className="flex justify-center -mt-6 mb-0 relative z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border border-foreground/20 bg-background hover:border-accent hover:text-accent transition-colors"
          data-cursor="hover"
          aria-label="Fermer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="overflow-y-auto bg-background border-t border-foreground/10"
        style={{ height: "calc(100% + 1.5rem)" }}
      >
        <div className="px-6 md:px-12 py-8 space-y-8 max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4">
            <PanelMeta projectId={projectId!} year={project.year} />
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
          <PanelDescription projectId={projectId!} />

          {/* Iframe preview - 16:9 */}
          {!isGithub ? (
            <div
              className="relative border border-foreground/10 overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <div
                ref={shimmerRef}
                className="absolute inset-0 bg-foreground/5"
                style={{
                  transition: "opacity 500ms ease-out",
                  pointerEvents: "none",
                }}
              />
              <iframe
                ref={iframeRef}
                key={projectId}
                src={iframeSrc}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full"
                style={{ opacity: 0, transition: "opacity 500ms ease-out" }}
                onLoad={handleIframeLoad}
                title={project.title}
              />
            </div>
          ) : (
            <div
              className="border border-foreground/10 flex items-center justify-center"
              style={{ aspectRatio: "16 / 9" }}
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

          {/* Tags */}
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
          <PanelFooter projectId={projectId!} client={project.client} />

          {/* Bottom padding for scroll */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

function PanelMeta({ projectId, year }: { projectId: string; year: string }) {
  const tProject = useTranslations(`projectsData.${toCamelCase(projectId)}`);
  return (
    <div className="flex items-center gap-3 font-mono text-xs text-muted uppercase tracking-widest">
      <span>{tProject("category")}</span>
      <span className="opacity-40">-</span>
      <span>{year}</span>
    </div>
  );
}

function PanelDescription({ projectId }: { projectId: string }) {
  const tProject = useTranslations(`projectsData.${toCamelCase(projectId)}`);
  return (
    <p className="font-mono text-sm text-muted max-w-3xl leading-relaxed whitespace-pre-line">
      {tProject("longDescription")}
    </p>
  );
}

function PanelFooter({
  projectId,
  client,
}: {
  projectId: string;
  client: string;
}) {
  const tProject = useTranslations(`projectsData.${toCamelCase(projectId)}`);
  const tPage = useTranslations("projectPage");
  return (
    <div className="grid grid-cols-2 gap-6 font-mono text-xs text-muted">
      <div className="space-y-1">
        <div className="uppercase tracking-widest opacity-50">
          {tPage("role")}
        </div>
        <div className="uppercase tracking-widest">{tProject("role")}</div>
      </div>
      <div className="space-y-1">
        <div className="uppercase tracking-widest opacity-50">
          {tPage("client")}
        </div>
        <div className="uppercase tracking-widest">{client}</div>
      </div>
    </div>
  );
}
