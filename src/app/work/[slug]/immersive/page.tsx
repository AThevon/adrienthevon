"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getProjectById, getNextProject } from "@/data/projects";

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

// Helper to convert kebab-case to camelCase for i18n keys
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Letter by letter reveal component
function LetterReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const letters = text.split("");

  return (
    <span className={className}>
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

// Section transition shader effect
function SectionTransition({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 origin-bottom"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}

// Progress indicator
function ProgressIndicator({ progress, color }: { progress: import("motion/react").MotionValue<number>; color: string }) {
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });
  const displayProgress = useTransform(smoothProgress, (v) => Math.round(v * 100));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = displayProgress.on("change", (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [displayProgress]);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
      {/* Progress line */}
      <div className="relative h-32 w-[2px] bg-foreground/10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            backgroundColor: color,
            scaleY: smoothProgress,
            height: "100%",
          }}
        />
      </div>

      {/* Progress percentage */}
      <span
        className="font-mono text-xs"
        style={{ color }}
      >
        {displayValue}%
      </span>
    </div>
  );
}

// Parallax image component
function ParallaxImage({ color, index }: { color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-video overflow-hidden"
      style={{ scale }}
    >
      <motion.div
        className="absolute inset-0 w-full h-[120%]"
        style={{
          y,
          background: `linear-gradient(${135 + index * 45}deg, ${color}40 0%, ${color}10 50%, transparent 100%)`,
        }}
      />
      <div className="absolute inset-0 border border-foreground/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs text-muted">VISUAL {index + 1}</span>
      </div>
    </motion.div>
  );
}

export default function ImmersiveCaseStudy() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slug = params.slug as string;
  const t = useTranslations("projectPage");
  const tProject = useTranslations(`projectsData.${kebabToCamel(slug)}`);

  const project = getProjectById(slug);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Calculate current section based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (!project) return;
      const totalSections = project.sections.length + 2; // +2 for intro and outro
      const newSection = Math.min(
        Math.floor(value * totalSections),
        totalSections - 1
      );
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, currentSection, project]);

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

      {/* Progress indicator */}
      <ProgressIndicator
        progress={scrollYProgress}
        color={project.color}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-8 left-8 z-40 flex items-center gap-4"
      >
        <a
          href={`/work/${project.id}`}
          className="font-mono text-sm text-muted hover:text-foreground transition-colors"
          data-cursor="hover"
        >
          {t("standardView")}
        </a>
        <span className="w-[1px] h-4 bg-foreground/20" />
        <a
          href="/work"
          className="font-mono text-sm text-muted hover:text-foreground transition-colors"
          data-cursor="hover"
        >
          {t("allWork")}
        </a>
      </motion.nav>

      {/* Section transition */}
      <SectionTransition isActive={isTransitioning} color={project.color} />

      <main ref={containerRef}>
        {/* Hero section - full screen */}
        <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden snap-start">
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.color} 0%, transparent 70%)`,
            }}
          />

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
          <h1 className="text-6xl md:text-8xl lg:text-[12vw] font-bold tracking-tighter text-center">
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
            <span className="font-mono text-xs text-muted">{t("scrollToExplore")}</span>
            <motion.div
              className="w-6 h-10 border border-foreground/30 rounded-full flex justify-center pt-2"
              animate={{ borderColor: [project.color + "50", project.color, project.color + "50"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-2 rounded-full"
                style={{ backgroundColor: project.color }}
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Story sections */}
        {project.sections.map((section, index) => (
          <section
            key={index}
            className="min-h-screen flex flex-col justify-center items-center relative snap-start px-8"
          >
            {/* Section number */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 0.1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-[20vw] font-bold tracking-tighter pointer-events-none"
              style={{ color: project.color }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.div>

            {/* Content */}
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="font-mono text-sm mb-4 inline-block"
                style={{ color: project.color }}
              >
                {section.type.toUpperCase()}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
              >
                {tProject(`sections.${section.type}.title`)}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-xl md:text-2xl text-muted leading-relaxed"
              >
                {tProject(`sections.${section.type}.content`)}
              </motion.p>
            </div>

            {/* Parallax image after each section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full max-w-5xl mx-auto mt-24"
            >
              <ParallaxImage color={project.color} index={index} />
            </motion.div>
          </section>
        ))}

        {/* Tags section */}
        <section className="min-h-[50vh] flex flex-col justify-center items-center relative snap-start px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="font-mono text-sm text-muted mb-8 block">{t("technologies")}</span>
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="px-6 py-3 text-lg font-mono border"
                  style={{ borderColor: project.color + "50", color: project.color }}
                  whileHover={{ backgroundColor: project.color + "20" }}
                  data-cursor="hover"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Next project section */}
        <section className="h-screen flex flex-col justify-center items-center relative snap-start overflow-hidden">
          {/* Background */}
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${nextProject.color}30 0%, transparent 70%)`,
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center relative z-10"
          >
            <span className="font-mono text-sm text-muted mb-8 block">{t("nextProject")}</span>

            <motion.a
              href={`/work/${nextProject.id}/immersive`}
              className="block group"
              data-cursor="hover"
              whileHover={{ scale: 0.95 }}
            >
              <motion.h2
                className="text-6xl md:text-8xl lg:text-[10vw] font-bold tracking-tighter transition-colors"
                style={{ color: nextProject.color }}
              >
                {nextProject.title}
              </motion.h2>

              <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="font-mono text-sm mt-8 inline-block"
                style={{ color: nextProject.color }}
              >
                {t("viewProject")}
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 font-mono text-xs text-muted"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {nextProject.category} — {nextProject.year}
          </motion.div>
        </section>
      </main>
    </>
  );
}
