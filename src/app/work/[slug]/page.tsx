"use client";

import { useParams } from "next/navigation";
import { useRef, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getProjectById } from "@/data/projects";

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

type PreviewStatus = "checking" | "ok" | "blocked";

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = getProjectById(slug);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>("checking");

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "1";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  }, []);

  const isGithub = project?.link.includes("github.com") ?? false;
  const iframeSrc = project ? (project.link.startsWith("https://") ? project.link : `https://${project.link}`) : "";

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";

    if (!iframeSrc || isGithub) return;

    setPreviewStatus("checking");
    const controller = new AbortController();

    fetch(iframeSrc, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      credentials: "omit",
      redirect: "follow",
      signal: controller.signal,
    })
      .then((res) => {
        setPreviewStatus(res.ok ? "ok" : "blocked");
      })
      .catch(() => {
        setPreviewStatus("blocked");
      });

    return () => controller.abort();
  }, [slug, iframeSrc, isGithub]);

  if (!project) {
    return (
      <div className="h-dvh flex items-center justify-center font-mono text-muted">
        Project not found
      </div>
    );
  }

  const ctaLabel = isGithub ? "VIEW ON GITHUB" : "VIEW WEBSITE";

  return (
    <div className="px-6 md:px-12 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <ProjectMeta slug={slug} year={project.year} />
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="project-cta"
          data-cursor="hover"
        >
          <span className="cta-label">{ctaLabel}</span>
          <svg className="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase leading-none">
        {project.title}
      </h1>

      {/* Description */}
      <ProjectDescription slug={slug} />

      {/* Preview */}
      <div>
        {!isGithub ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="relative block border border-foreground/10 overflow-hidden group"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div
              ref={shimmerRef}
              className="absolute inset-0"
              style={{
                transition: "opacity 500ms ease-out",
                pointerEvents: "none",
                backgroundImage: `url(${project.image})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            />
            {previewStatus === "ok" && (
              <iframe
                ref={iframeRef}
                key={slug}
                src={iframeSrc}
                sandbox="allow-scripts allow-same-origin"
                scrolling="no"
                referrerPolicy="no-referrer"
                loading="lazy"
                style={{
                  width: "150%",
                  height: "150%",
                  transform: "scale(0.6667)",
                  transformOrigin: "top left",
                  opacity: 0,
                  transition: "opacity 500ms ease-out",
                  border: "none",
                  pointerEvents: "none",
                }}
                onLoad={handleIframeLoad}
                title={project.title}
              />
            )}
            {previewStatus === "blocked" && (
              <div className="absolute inset-0 flex items-end justify-start p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground/80">
                  CLICK TO OPEN <span aria-hidden>↗</span>
                </span>
              </div>
            )}
          </a>
        ) : (
          <GithubPreview project={project} />
        )}
      </div>

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
      <div>
        <ProjectFooter slug={slug} client={project.client} />
      </div>

      <div className="h-16" />
    </div>
  );
}

function GithubPreview({ project }: { project: NonNullable<ReturnType<typeof getProjectById>> }) {
  return (
    <div className="border border-foreground/10 p-8 md:p-12 flex items-center gap-8">
      <div className="shrink-0">
        {project.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.logo}
            alt={project.title}
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
            style={{ borderRadius: 16 }}
          />
        ) : (
          <div
            className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center font-display text-2xl"
            style={{ borderRadius: 16, background: "#141414", color: project.color }}
          >
            {project.title.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-muted tracking-widest uppercase mb-2">OPEN SOURCE</div>
        <div className="font-mono text-sm text-foreground/70 leading-relaxed mb-4">{project.description}</div>
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span className="font-mono text-xs text-muted tracking-wider">
            {project.link.replace("https://github.com/", "")}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectMeta({ slug, year }: { slug: string; year: string }) {
  const tProject = useTranslations(`projectsData.${toCamelCase(slug)}`);
  return (
    <div className="flex items-center gap-3 font-mono text-xs text-muted uppercase tracking-widest">
      <span>{tProject("category")}</span>
      <span className="text-foreground/30">-</span>
      <span>{year}</span>
    </div>
  );
}

function ProjectDescription({ slug }: { slug: string }) {
  const tProject = useTranslations(`projectsData.${toCamelCase(slug)}`);
  return (
    <p className="font-mono text-sm text-muted max-w-3xl leading-relaxed whitespace-pre-line">
      {tProject("longDescription")}
    </p>
  );
}

function ProjectFooter({ slug, client }: { slug: string; client: string }) {
  const tProject = useTranslations(`projectsData.${toCamelCase(slug)}`);
  const tPage = useTranslations("projectPage");
  return (
    <div className="grid grid-cols-2 gap-6 font-mono text-xs text-muted">
      <div className="space-y-1">
        <div className="uppercase tracking-widest opacity-50">{tPage("role")}</div>
        <div className="uppercase tracking-widest">{tProject("role")}</div>
      </div>
      <div className="space-y-1">
        <div className="uppercase tracking-widest opacity-50">{tPage("client")}</div>
        <div className="uppercase tracking-widest">{client}</div>
      </div>
    </div>
  );
}
