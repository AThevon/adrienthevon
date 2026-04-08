"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";

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
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const { isMobile, isHydrated } = useDeviceDetect();

  const handleProjectClick = useCallback(
    (projectId: string) => {
      setActiveProjectId((prev) => (prev === projectId ? null : projectId));
    },
    []
  );

  const handleClose = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  const handleHover = useCallback((projectId: string | null) => {
    setHoveredProjectId(projectId);
  }, []);

  if (isHydrated && isMobile) {
    return (
      <main className="min-h-dvh">
        <ProjectTimelineMobile />
      </main>
    );
  }

  const isOpen = activeProjectId !== null;

  return (
    <main className="h-dvh overflow-hidden">
      {/* Canvas timeline - shrinks when takeover is open */}
      <ProjectTimeline
        scrollProgress={0}
        activeProjectId={hoveredProjectId || activeProjectId}
        onProjectClick={handleProjectClick}
        onProjectHover={handleHover}
        compressed={isOpen}
      />

      {/* Takeover panel - slides up via CSS transform */}
      <ProjectTakeover
        projectId={activeProjectId}
        onClose={handleClose}
      />
    </main>
  );
}
