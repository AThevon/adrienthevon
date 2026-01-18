"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { getProjectById, getNextProject } from "@/data/projects";

// Letter by letter reveal component
function LetterReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const letters = text.split("");

  return (
    <span>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.33, 1, 0.68, 1],
          }}
          style={{ display: "inline-block", transformOrigin: "bottom" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

// Helper to convert kebab-case to camelCase for i18n keys
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const slug = params.slug as string;
  const t = useTranslations("projectPage");
  const tProject = useTranslations(`projectsData.${kebabToCamel(slug)}`);

  const project = getProjectById(slug);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("notFound")}</p>
      </div>
    );
  }

  const nextProject = getNextProject(slug);

  return (
    <>
      <CustomCursor />

      <main ref={containerRef} className="min-h-screen">
        {/* Hero - Immersive style */}
        <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.color} 0%, transparent 70%)`,
            }}
          />

          {/* Back button */}
          <motion.a
            href="/work"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-24 left-8 z-40 font-mono text-sm text-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-2"
            data-cursor="hover"
          >
            ← {t("backToWork")}
          </motion.a>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-sm mb-8"
            style={{ color: project.color }}
          >
            {tProject("category")} — {project.year}
          </motion.div>

          {/* Title with letter reveal */}
          <h1 className="text-6xl md:text-8xl lg:text-[12vw] font-bold tracking-tighter text-center px-8">
            <LetterReveal text={project.title} delay={0.5} />
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-xl text-muted text-center max-w-xl px-8"
          >
            {tProject("description")}
          </motion.p>

          {/* Scroll prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-4"
          >
            <span className="font-mono text-xs text-muted">{t("scroll")}</span>
            <motion.div
              className="w-6 h-10 border border-foreground/30 rounded-full flex justify-center pt-2"
              animate={{ borderColor: [project.color + "50", project.color, project.color + "50"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Project image */}
        <section className="px-8 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={1920}
                height={1080}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              />
              <div className="absolute inset-0 border border-foreground/10 pointer-events-none" />
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
                    <h4 className="font-mono text-xs text-muted mb-2">{t("role")}</h4>
                    <p className="text-lg">{tProject("role")}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-2">{t("client")}</h4>
                    <p className="text-lg">{tProject.has("client") ? tProject("client") : project.client}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-2">{t("year")}</h4>
                    <p className="text-lg">{project.year}</p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-muted mb-4">{t("stack")}</h4>
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background text-sm font-medium hover:bg-foreground transition-colors"
                      data-cursor="hover"
                    >
                      {t("viewLive")}
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
                  {t("aboutProject")}
                </TextReveal>

                <div className="text-lg text-muted leading-relaxed whitespace-pre-line">
                  {tProject("longDescription")}
                </div>
              </div>
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
              <span className="font-mono text-sm text-muted">{t("nextProject")}</span>

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
