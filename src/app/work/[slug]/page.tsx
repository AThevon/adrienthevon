"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { projects, getProjectById } from "@/data/projects";
import MagneticButton from "@/components/ui/MagneticButton";

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const project = getProjectById(slug);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "1";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  }, []);

  // Reset iframe on slug change
  useEffect(() => {
    if (iframeRef.current) iframeRef.current.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
  }, [slug]);

  if (!project) {
    return (
      <div className="h-dvh flex items-center justify-center font-mono text-muted">
        Project not found
      </div>
    );
  }

  const isGithub = project.link.includes("github.com");
  const iframeSrc = project.link.startsWith("https://") ? project.link : `https://${project.link}`;
  const ctaLabel = isGithub ? "VIEW ON GITHUB" : "VIEW WEBSITE";

  // Sorted chronologically (oldest first) for badge bar
  const sorted = [...projects].reverse();

  return (
    <main className="min-h-dvh">
      {/* Badge bar - sticky top */}
      <div className="sticky top-0 z-30 bg-background border-b border-foreground/5">
        <div className="flex items-center justify-center gap-3 px-8 py-4 overflow-x-auto scrollbar-hide max-w-full">
          {sorted.map((p, i) => {
            const isActive = p.id === slug;
            return (
              <button
                key={p.id}
                data-cursor="hover"
                onClick={() => router.push(`/work/${p.id}`)}
                className="shrink-0 sidebar-slide"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className="relative overflow-hidden transition-all duration-200"
                  style={{
                    width: isActive ? 44 : 32,
                    height: isActive ? 44 : 32,
                    borderRadius: isActive ? 12 : 8,
                    border: `${isActive ? 2 : 1}px solid ${isActive ? p.color : "#2a2a2a"}`,
                    boxShadow: isActive ? `0 0 20px ${p.color}30` : "none",
                    background: p.id === "yeetbg" ? "#ffffff" : undefined,
                  }}
                >
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-mono text-[10px] font-bold"
                      style={{ color: p.color, background: "#141414" }}
                    >
                      {p.title.slice(0, 2)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Back to timeline */}
        <div className="flex justify-center -mt-1 pb-2">
          <button
            onClick={() => router.push("/work")}
            data-cursor="hover"
            className="w-7 h-7 flex items-center justify-center border border-foreground/10 hover:border-accent hover:text-accent transition-colors text-muted"
            aria-label="Retour timeline"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project content */}
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
        {!isGithub ? (
          <div
            className="relative border border-foreground/10 overflow-hidden"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div
              ref={shimmerRef}
              className="absolute inset-0 bg-foreground/5"
              style={{ transition: "opacity 500ms ease-out", pointerEvents: "none" }}
            />
            {/* Scale trick: iframe renders at 1.5x width then scaled down for higher res */}
            <iframe
              ref={iframeRef}
              key={slug}
              src={iframeSrc}
              sandbox="allow-scripts allow-same-origin"
              style={{
                width: "150%",
                height: "150%",
                transform: "scale(0.6667)",
                transformOrigin: "top left",
                opacity: 0,
                transition: "opacity 500ms ease-out",
                border: "none",
              }}
              onLoad={handleIframeLoad}
              title={project.title}
            />
          </div>
        ) : (
          <GithubPreview project={project} />
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
        <ProjectFooter slug={slug} client={project.client} />

        <div className="h-16" />
      </div>
    </main>
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
      <span className="opacity-40">-</span>
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
