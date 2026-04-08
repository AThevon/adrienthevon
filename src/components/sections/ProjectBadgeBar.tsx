"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";

interface ProjectBadgeBarProps {
  activeProjectId: string | null;
  onProjectClick: (projectId: string) => void;
  onClose: () => void;
}

export default function ProjectBadgeBar({
  activeProjectId,
  onProjectClick,
  onClose,
}: ProjectBadgeBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active badge into view
  useEffect(() => {
    if (!activeProjectId || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-project="${activeProjectId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeProjectId]);

  // Reverse to chronological order (oldest first)
  const sorted = [...projects].reverse();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background border-b border-foreground/5">
      {/* Badge strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 px-8 overflow-x-auto scrollbar-hide max-w-full"
      >
        {sorted.map((project, i) => {
          const isActive = project.id === activeProjectId;
          return (
            <button
              key={project.id}
              data-project={project.id}
              data-cursor="hover"
              onClick={() => onProjectClick(project.id)}
              className="shrink-0 flex flex-col items-center gap-1.5 group sidebar-slide"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Badge */}
              <div
                className="relative overflow-hidden transition-all duration-200"
                style={{
                  width: isActive ? 44 : 36,
                  height: isActive ? 44 : 36,
                  borderRadius: isActive ? 12 : 8,
                  border: `${isActive ? 2 : 1}px solid ${isActive ? project.color : "#2a2a2a"}`,
                  boxShadow: isActive ? `0 0 20px ${project.color}30` : "none",
                  background: project.id === "yeetbg" ? "#ffffff" : undefined,
                }}
              >
                {project.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-mono text-xs font-bold"
                    style={{ color: project.color, background: "#141414" }}
                  >
                    {project.title.slice(0, 2)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Close button - arrow up to return to timeline */}
      <button
        onClick={onClose}
        data-cursor="hover"
        className="mt-3 w-8 h-8 flex items-center justify-center border border-foreground/10 hover:border-accent hover:text-accent transition-colors text-muted"
        aria-label="Retour timeline"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}
