"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";

const ProjectTimeline = dynamic(
  () => import("@/components/sections/ProjectTimeline"),
  { ssr: false }
);
const ProjectBadgeBar = dynamic(
  () => import("@/components/sections/ProjectBadgeBar"),
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
    <main className="h-dvh overflow-hidden flex flex-col">
      {isOpen ? (
        <>
          {/* Badge bar replaces canvas when a project is open */}
          <div className="shrink-0" style={{ height: "15vh" }}>
            <ProjectBadgeBar
              activeProjectId={activeProjectId}
              onProjectClick={handleProjectClick}
              onClose={handleClose}
            />
          </div>

          {/* Detail panel fills the rest */}
          <div className="flex-1 overflow-y-auto">
            <ProjectTakeover
              projectId={activeProjectId}
              onClose={handleClose}
            />
          </div>
        </>
      ) : (
        /* Full canvas timeline */
        <div className="flex-1">
          <ProjectTimeline
            scrollProgress={0}
            activeProjectId={hoveredProjectId}
            onProjectClick={handleProjectClick}
            onProjectHover={handleHover}
            compressed={false}
          />
        </div>
      )}
    </main>
  );
}
