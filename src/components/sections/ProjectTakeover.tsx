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
}: ProjectTakeoverProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const project = projectId ? getProjectById(projectId) : null;

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
  }, [projectId]);

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "1";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  }, []);

  if (!project) return null;

  const isGithub = project.link.includes("github.com");
  const iframeSrc = project.link.startsWith("https://")
    ? project.link
    : `https://${project.link}`;
  const ctaText = isGithub ? "VIEW GITHUB →" : "VIEW SITE →";

  return (
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

      <div className="h-8" />
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
