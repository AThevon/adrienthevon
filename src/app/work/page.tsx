"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";
import { CanvasLoader, ProjectLoader } from "@/components/ui/WorkLoader";

const ProjectTimeline = dynamic(
  () => import("@/components/sections/ProjectTimeline"),
  { ssr: false, loading: () => <CanvasLoader /> }
);
const ProjectBadgeBar = dynamic(
  () => import("@/components/sections/ProjectBadgeBar"),
  { ssr: false }
);
const ProjectTakeover = dynamic(
  () => import("@/components/sections/ProjectTakeover"),
  { ssr: false, loading: () => <ProjectLoader /> }
);
const ProjectTimelineMobile = dynamic(
  () => import("@/components/sections/ProjectTimelineMobile"),
  { ssr: false }
);
const ProceduralGround = dynamic(
  () => import("@/components/effects/ProceduralGround"),
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

  if (isOpen) {
    // Single view: badge bar (fixed top) + scrollable detail panel
    return (
      <main className="h-dvh flex flex-col">
        {/* Badge bar - fixed height */}
        <div className="shrink-0 h-[15vh]">
          <ProjectBadgeBar
            activeProjectId={activeProjectId}
            onProjectClick={handleProjectClick}
            onClose={handleClose}
          />
        </div>

        {/* Scrollable detail area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ minHeight: 0 }}
        >
          <ProjectTakeover
            projectId={activeProjectId}
            onClose={handleClose}
          />
        </div>
      </main>
    );
  }

  // Full canvas timeline view
  return (
    <main className="h-dvh relative overflow-hidden">
      <ProceduralGround />
      <div className="relative z-10 w-full h-full">
        <ProjectTimeline
          scrollProgress={0}
          activeProjectId={hoveredProjectId}
          onProjectClick={handleProjectClick}
          onProjectHover={handleHover}
          compressed={false}
        />
      </div>
    </main>
  );
}
