"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";
import HoverReveal from "@/components/ui/HoverReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import RollingText from "@/components/ui/RollingText";

const projects = [
  {
    id: "project-alpha",
    title: "PROJECT ALPHA",
    category: "WEB EXPERIENCE",
    image: "",
    color: "#ff4d00",
  },
  {
    id: "neural-canvas",
    title: "NEURAL CANVAS",
    category: "CREATIVE TOOL",
    image: "",
    color: "#00ff88",
  },
  {
    id: "void-studio",
    title: "VOID STUDIO",
    category: "DESIGN SYSTEM",
    image: "",
    color: "#8844ff",
  },
  {
    id: "particle-flow",
    title: "PARTICLE FLOW",
    category: "EXPERIMENT",
    image: "",
    color: "#ff0088",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const handleProjectClick = (project: typeof projects[0]) => {
    router.push(`/work/${project.id}`);
  };

  return (
    <section ref={sectionRef} id="work" className="py-32 px-8 md:px-16 relative">
      {/* Subtle background effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-sm text-muted">002</span>
            <span className="w-16 h-[1px] bg-foreground/20" />
            <span className="font-mono text-sm text-muted">SELECTED WORK</span>
          </div>

          <TextReveal className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            PROJECTS THAT PUSH BOUNDARIES
          </TextReveal>
        </div>

        {/* Projects with hover reveal */}
        <HoverReveal
          projects={projects}
          onProjectClick={handleProjectClick}
        />

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          <MagneticButton>
            <a
              href="/work"
              className="group inline-flex items-center gap-4 px-8 py-4 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <RollingText>VIEW ALL PROJECTS</RollingText>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </motion.svg>
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
