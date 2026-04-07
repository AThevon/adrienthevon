"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";
import { projects } from "@/data/projects";

const ProjectTimeline = dynamic(
  () => import("@/components/sections/ProjectTimeline"),
  { ssr: false }
);
const ProjectTakeover = dynamic(
  () => import("@/components/sections/ProjectTakeover"),
  { ssr: false }
);
const ProjectTimelineMobile = dynamic(
  () => import("@/components/sections/ProjectTimelineMobile"),
  { ssr: false }
);

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const { isMobile, isHydrated } = useDeviceDetect();

  const handleProjectClick = useCallback(
    (projectId: string) => {
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      } else {
        setActiveProjectId(projectId);
      }
    },
    [activeProjectId]
  );

  const handleClose = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  const handleHover = useCallback((projectId: string | null) => {
    setHoveredProjectId(projectId);
  }, []);

  // Mobile
  if (isHydrated && isMobile) {
    return (
      <main className="min-h-dvh">
        <ProjectTimelineMobile />
      </main>
    );
  }

  const isOpen = activeProjectId !== null;

  // Desktop
  return (
    <main
      ref={containerRef}
      style={{
        height: isOpen ? "auto" : `${projects.length * 60}vh`,
      }}
    >
      {/* Sticky canvas */}
      <div
        className="sticky top-0 z-10"
        style={{ height: isOpen ? "25vh" : "100vh" }}
      >
        <ProjectTimeline
          scrollProgress={0}
          activeProjectId={hoveredProjectId || activeProjectId}
          onProjectClick={handleProjectClick}
          onProjectHover={handleHover}
          compressed={isOpen}
        />
      </div>

      {/* Takeover panel */}
      {isOpen && (
        <ProjectTakeover
          projectId={activeProjectId}
          onClose={handleClose}
        />
      )}
    </main>
  );
}
