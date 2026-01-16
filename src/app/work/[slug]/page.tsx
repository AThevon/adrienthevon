"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

const projects = [
  {
    id: "project-alpha",
    title: "PROJECT ALPHA",
    category: "WEB EXPERIENCE",
    year: "2024",
    color: "#ff4d00",
    description: "An immersive 3D web experience pushing the boundaries of WebGL and real-time graphics.",
    longDescription: `Project Alpha represents the pinnacle of creative web development.
    Built with cutting-edge technologies, it delivers an unforgettable user experience
    that blurs the line between website and art installation.

    The project features real-time 3D graphics, physics simulations, and
    audio-reactive elements that respond to user interaction.`,
    tags: ["THREE.JS", "WEBGL", "REACT", "GSAP"],
    role: "LEAD DEVELOPER",
    client: "CREATIVE AGENCY X",
    link: "#",
  },
  {
    id: "neural-canvas",
    title: "NEURAL CANVAS",
    category: "CREATIVE TOOL",
    year: "2024",
    color: "#00ff88",
    description: "AI-powered generative art platform for digital artists.",
    longDescription: `Neural Canvas empowers artists to create unique generative artwork
    using the latest in machine learning technology. The platform provides intuitive
    controls while hiding the complexity of AI models behind a beautiful interface.`,
    tags: ["AI/ML", "CANVAS", "REACT", "NODE.JS"],
    role: "FULL-STACK DEVELOPER",
    client: "STARTUP Y",
    link: "#",
  },
  {
    id: "void-studio",
    title: "VOID STUDIO",
    category: "DESIGN SYSTEM",
    year: "2023",
    color: "#8844ff",
    description: "A comprehensive design system for modern web applications.",
    longDescription: `Void Studio is a meticulously crafted design system that provides
    developers and designers with a unified language for building consistent,
    accessible, and beautiful user interfaces.`,
    tags: ["DESIGN SYSTEM", "REACT", "STORYBOOK", "FIGMA"],
    role: "DESIGN ENGINEER",
    client: "TECH COMPANY Z",
    link: "#",
  },
  {
    id: "particle-flow",
    title: "PARTICLE FLOW",
    category: "EXPERIMENT",
    year: "2023",
    color: "#ff0088",
    description: "Real-time particle simulation using GPU compute shaders.",
    longDescription: `Particle Flow is an experimental project exploring the capabilities
    of WebGPU for real-time particle simulations. Millions of particles dance across
    the screen, creating mesmerizing patterns driven by mathematical forces.`,
    tags: ["WEBGPU", "SHADERS", "CREATIVE CODING"],
    role: "CREATIVE DEVELOPER",
    client: "PERSONAL PROJECT",
    link: "#",
  },
  {
    id: "echo-space",
    title: "ECHO SPACE",
    category: "AUDIO VISUAL",
    year: "2023",
    color: "#00ccff",
    description: "Audio-reactive visual experience.",
    longDescription: `Echo Space transforms sound into stunning visuals in real-time.
    Using the Web Audio API and custom shaders, every beat and frequency becomes
    a visual element in an ever-evolving digital canvas.`,
    tags: ["WEB AUDIO", "CANVAS", "MOTION"],
    role: "CREATIVE DEVELOPER",
    client: "MUSIC LABEL",
    link: "#",
  },
];

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = projects.find((p) => p.id === params.slug);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === params.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <CustomCursor />

      <main ref={containerRef} className="min-h-screen">
        {/* Hero */}
        <motion.section
          className="h-screen flex flex-col justify-center px-8 md:px-16 relative overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          {/* Background color accent */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${project.color} 0%, transparent 50%)`,
            }}
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="flex items-center gap-6 mb-12">
              <motion.a
                href="/work"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-foreground transition-colors"
                data-cursor="hover"
              >
                ← BACK TO WORK
              </motion.a>
              <span className="w-[1px] h-4 bg-foreground/20" />
              <motion.a
                href={`/work/${params.slug}/immersive`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 font-mono text-sm hover:text-accent transition-colors"
                style={{ color: project.color }}
                data-cursor="hover"
              >
                IMMERSIVE VIEW →
              </motion.a>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span
                className="font-mono text-sm"
                style={{ color: project.color }}
              >
                {project.category}
              </span>
              <span className="w-12 h-[1px] bg-foreground/20" />
              <span className="font-mono text-sm text-muted">{project.year}</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-[10vw] font-bold tracking-tighter leading-[0.9]"
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-xl md:text-2xl text-muted max-w-2xl"
            >
              {project.description}
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-xs text-muted">SCROLL</span>
            <motion.div
              className="w-[1px] h-12 bg-gradient-to-b from-foreground to-transparent"
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Corner decoration */}
          <div
            className="absolute top-8 right-8 w-24 h-24"
            style={{
              background: `linear-gradient(135deg, ${project.color} 50%, transparent 50%)`,
              opacity: 0.3,
            }}
          />
        </motion.section>

        {/* Project image placeholder */}
        <section className="px-8 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="aspect-video relative overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.color}30 0%, ${project.color}10 100%)`,
                }}
              />
              <div className="absolute inset-0 border border-foreground/10" />

              {/* Placeholder text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm text-muted">
                  PROJECT VISUAL
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project details */}
        <section className="px-8 md:px-16 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-8">
              {/* Left column - meta */}
              <div className="col-span-12 md:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div>
                    <h4 className="font-mono text-xs text-muted mb-2">ROLE</h4>
                    <p className="text-lg">{project.role}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-2">CLIENT</h4>
                    <p className="text-lg">{project.client}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-2">YEAR</h4>
                    <p className="text-lg">{project.year}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-4">STACK</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-mono border border-foreground/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <MagneticButton>
                    <a
                      href={project.link}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background text-sm font-medium hover:bg-foreground transition-colors"
                      data-cursor="hover"
                    >
                      VIEW LIVE
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 12L12 4M12 4H6M12 4V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </a>
                  </MagneticButton>
                </div>
              </div>

              {/* Right column - description */}
              <div className="col-span-12 md:col-span-8">
                <TextReveal className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
                  ABOUT THE PROJECT
                </TextReveal>

                <div className="text-lg text-muted leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More images placeholder */}
        <section className="px-8 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-square relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${45 + i * 30}deg, ${project.color}20 0%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 border border-foreground/10" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Next project */}
        <section className="py-32 px-8 md:px-16 border-t border-foreground/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <span className="font-mono text-sm text-muted">NEXT PROJECT</span>

              <motion.a
                href={`/work/${nextProject.id}`}
                className="block mt-8 group"
                whileHover={{ scale: 0.98 }}
                data-cursor="hover"
              >
                <h2
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter group-hover:opacity-60 transition-opacity"
                  style={{ color: nextProject.color }}
                >
                  {nextProject.title}
                </h2>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
