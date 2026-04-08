"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";
import { CanvasLoader } from "@/components/ui/WorkLoader";

const ProjectTimeline = dynamic(
  () => import("@/components/sections/ProjectTimeline"),
  { ssr: false, loading: () => <CanvasLoader /> }
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
  const router = useRouter();
  const { isMobile, isHydrated } = useDeviceDetect();

  const handleProjectClick = useCallback(
    (projectId: string) => {
      router.push(`/work/${projectId}`);
    },
    [router]
  );

  const handleHover = useCallback(() => {}, []);

  if (isHydrated && isMobile) {
    return (
      <main className="min-h-dvh">
        <ProjectTimelineMobile />
      </main>
    );
  }

  return (
    <main className="h-dvh relative overflow-hidden">
      <ProceduralGround />
      <div className="relative z-10 w-full h-full">
        <ProjectTimeline
          scrollProgress={0}
          activeProjectId={null}
          onProjectClick={handleProjectClick}
          onProjectHover={handleHover}
          compressed={false}
        />
      </div>
    </main>
  );
}
