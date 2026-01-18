"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import TextReveal from "@/components/ui/TextReveal";
import DualText from "@/components/ui/DualText";
import { usePerformance } from "@/hooks";
import { COLORS } from "@/lib/constants";

const AsciiEffect = dynamic(
  () => import("@/components/experiments/AsciiEffect"),
  { ssr: false }
);

const stats = [
  { value: "5+", label: "YEARS EXPERIENCE", hiddenValue: "5+", hiddenLabel: "years googling errors" },
  { value: "50+", label: "PROJECTS SHIPPED", hiddenValue: "50+", hiddenLabel: "Stack Overflow tabs" },
  { value: "∞", label: "COFFEES DRUNK", hiddenValue: "∞", hiddenLabel: "still true" },
];

const skills = [
  { name: "REACT", hidden: "useEffect(🙏, [])" },
  { name: "NEXT.JS", hidden: "'use client'" },
  { name: "THREE.JS", hidden: "copy from examples" },
  { name: "WEBGL", hidden: "black screen 90%" },
  { name: "TYPESCRIPT", hidden: "as any" },
  { name: "GSAP", hidden: "timeline spaghetti" },
  { name: "SHADERS", hidden: "ctrl+c ctrl+v" },
  { name: "CANVAS", hidden: "ctx.clearRect()" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { enable3D } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const asciiScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const asciiOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-cursor-mode="about"
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/5 to-transparent" />

      {/* Section number - floating */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-8 md:left-16 z-30"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted">005</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">ABOUT</span>
        </div>
      </motion.div>

      {/* Main layout - Split screen */}
      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left side - ASCII Art (full height on desktop) */}
        <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0">
          {/* ASCII container with better visibility */}
          {enable3D && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ scale: asciiScale, opacity: asciiOpacity }}
            >
              {/* Glow effect behind ASCII */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[80%] bg-accent/10 blur-3xl rounded-full" />
              </div>

              {/* ASCII Effect */}
              <div className="relative w-full h-full">
                <AsciiEffect
                  text="DEV"
                  fontSize={18}
                  color={COLORS.accent}
                  interactive
                />
              </div>
            </motion.div>
          )}

          {/* Fallback pattern for non-3D */}
          {!enable3D && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[20vw] lg:text-[15vw] font-bold text-accent/10 tracking-tighter">
                DEV
              </div>
            </div>
          )}

          {/* Decorative frame */}
          <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-accent/30" />
          <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-accent/30" />
        </div>

        {/* Right side - Content */}
        <div className="relative w-full lg:w-1/2 flex items-center py-32 lg:py-0">
          <div className="w-full px-8 md:px-16 lg:px-20">
            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <TextReveal className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 leading-[0.95]">
                I CREATE EXPERIENCES THAT LIVE & BREATHE
              </TextReveal>
            </motion.div>

            {/* Description */}
            <div className="space-y-6 mb-12">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-muted leading-relaxed"
              >
                A <DualText visible="creative developer" hidden="professional googler" /> with a passion for unique web experiences.
                I blend code and design to create interfaces that <span className="text-accent">inspire</span>.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-muted leading-relaxed"
              >
                My work exists at the intersection of technology and art.
                Every pixel is <DualText visible="intentional" hidden="eventually..." />. Every interaction is <span className="text-accent">crafted</span>.
              </motion.p>
            </div>

            {/* Skills grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="font-mono text-xs text-muted mb-4 tracking-wider">
                TECH STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    viewport={{ once: true }}
                    className="px-3 py-1.5 bg-foreground/5 border border-foreground/10 font-mono text-xs text-foreground/70 hover:border-accent hover:text-accent transition-colors duration-300"
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
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-foreground/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 mb-2">
                    <DualText visible={stat.value} hidden={stat.hiddenValue} />
                  </div>
                  <div className="font-mono text-[10px] md:text-xs text-muted tracking-wider">
                    <DualText visible={stat.label} hidden={stat.hiddenLabel} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-4 font-mono text-sm text-accent hover:text-foreground transition-colors duration-300"
                data-cursor="hover"
              >
                <span>LET'S WORK TOGETHER</span>
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Large background text */}
      <motion.div
        className="absolute bottom-0 left-0 font-bold text-[25vw] leading-none text-foreground/2 pointer-events-none select-none overflow-hidden whitespace-nowrap"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]),
        }}
      >
        CREATIVE DEV
      </motion.div>
    </section>
  );
}
