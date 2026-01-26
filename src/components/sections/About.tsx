"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import DualText from "@/components/ui/DualText";
import { usePerformance } from "@/hooks";

const TerminalAbout = dynamic(
  () => import("@/components/experiments/TerminalAbout"),
  { ssr: false }
);

const skills = [
  { name: "REACT", hidden: "useEffect(🙏, [])" },
  { name: "NEXT.JS", hidden: "'use client'" },
  { name: "THREE.JS", hidden: "copy from examples" },
  { name: "WEBGL", hidden: "black screen 90%" },
  { name: "TYPESCRIPT", hidden: "as any" },
  { name: "GSAP", hidden: "timeline spaghetti" },
  { name: "SHADERS", hidden: "ctrl+c ctrl+v" },
  { name: "CANVAS", hidden: "ctx.clearRect()" },
  { name: "NODE.JS", hidden: "npm i everything" },
];

export default function About() {
  const { enableAnimations } = usePerformance();
  const t = useTranslations("about");

  // Disable scroll on this page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Store original styles
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    // Disable scroll
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      // Restore on unmount
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  const stats = [
    { value: "4+", label: t("stats.years"), hiddenValue: "∞", hiddenLabel: t("stats.yearsHidden") },
    { value: "20+", label: t("stats.projects"), hiddenValue: "20+", hiddenLabel: t("stats.projectsHidden") },
    { value: "∞", label: t("stats.coffees"), hiddenValue: "∞", hiddenLabel: t("stats.coffeesHidden") },
  ];

  return (
    <section
      id="about"
      data-cursor-mode="about"
      data-lenis-prevent
      className="relative h-dvh bg-background overflow-hidden pt-20 lg:pt-24"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="absolute top-24 lg:top-28 left-6 md:left-16 z-30"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs lg:text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-8 lg:w-16 h-px bg-foreground/20" />
          <span className="font-mono text-xs lg:text-sm text-muted">{t("title")}</span>
        </div>
      </motion.div>

      {/* Main layout - Split screen on desktop, stacked on mobile */}
      <div className="relative h-full flex flex-col lg:flex-row">
        {/* Left side - Terminal (hidden on mobile, show compact version) */}
        <div className="hidden lg:flex relative w-1/2 h-full items-center justify-center">
          {enableAnimations ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full h-full"
            >
              <TerminalAbout />
            </motion.div>
          ) : (
            <div className="text-[10vw] font-bold text-accent/10 tracking-tighter">
              DEV
            </div>
          )}

          {/* Corner accents - desktop only */}
          <div className="absolute top-12 left-12 w-20 h-20 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
          <div className="absolute bottom-12 right-12 w-20 h-20 border-r-2 border-b-2 border-accent/30 pointer-events-none" />
        </div>

        {/* Content - Full width on mobile, half on desktop */}
        <div className="relative w-full lg:w-1/2 h-full flex items-center py-4 lg:py-0">
          <div className="w-full px-6 md:px-12 lg:px-16">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 lg:mb-8"
            >
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-2 lg:mb-4">
                {t("tagline")}
              </h2>
              <p className="text-sm lg:text-base text-muted max-w-md">
                {t("oneliner")}
              </p>
            </motion.div>

            {/* Skills grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 lg:mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs text-muted tracking-wider">
                  {t("techStack")}
                </span>
                <span className="flex-1 h-px bg-foreground/10" />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    viewport={{ once: true }}
                    className="group px-3 py-1.5 bg-foreground/5 border border-foreground/10 font-mono text-xs text-foreground/70 hover:border-accent hover:text-accent transition-all duration-300 cursor-default"
                    data-cursor="hover"
                  >
                    <DualText visible={skill.name} hidden={skill.hidden} />
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 border-t border-foreground/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="group cursor-default"
                  data-cursor="hover"
                >
                  <div className="text-xl md:text-2xl lg:text-4xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 mb-0.5 lg:mb-1">
                    <DualText visible={stat.value} hidden={stat.hiddenValue} />
                  </div>
                  <div className="font-mono text-[9px] md:text-[10px] lg:text-xs text-muted tracking-wider">
                    <DualText visible={stat.label} hidden={stat.hiddenLabel} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 lg:mt-8 flex flex-wrap gap-4 lg:gap-6"
            >
              <a
                href="https://github.com/adrienthevon"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent transition-colors duration-300"
                data-cursor="hover"
              >
                <span>GITHUB</span>
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 3, y: -3 }}
                >
                  ↗
                </motion.span>
              </a>
              <a
                href="https://linkedin.com/in/adrienthevon"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent transition-colors duration-300"
                data-cursor="hover"
              >
                <span>LINKEDIN</span>
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 3, y: -3 }}
                >
                  ↗
                </motion.span>
              </a>
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-foreground transition-colors duration-300"
                data-cursor="hover"
              >
                <span>{t("cta")}</span>
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Large background text - fixed, hidden on mobile */}
      <div className="hidden lg:block absolute bottom-0 left-0 font-bold text-[15vw] leading-none text-foreground/[0.02] pointer-events-none select-none whitespace-nowrap">
        CREATIVE DEVELOPER
      </div>
    </section>
  );
}
