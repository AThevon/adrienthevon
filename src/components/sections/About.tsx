"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";

const stats = [
  { value: "5+", label: "YEARS EXPERIENCE" },
  { value: "50+", label: "PROJECTS SHIPPED" },
  { value: "∞", label: "COFFEE CONSUMED" },
];

const skills = [
  "REACT",
  "NEXT.JS",
  "TYPESCRIPT",
  "THREE.JS",
  "WEBGL",
  "GSAP",
  "MOTION",
  "TAILWIND",
  "FIGMA",
  "CREATIVE CODING",
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} id="about" className="py-32 px-8 md:px-16">
      {/* Section header */}
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-sm text-muted">003</span>
          <span className="w-16 h-[1px] bg-foreground/20" />
          <span className="font-mono text-sm text-muted">ABOUT</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Image column */}
        <div className="col-span-12 md:col-span-5">
          <motion.div
            className="relative aspect-[3/4] overflow-hidden"
            style={{ y: imageY }}
          >
            {/* Placeholder for image */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
            <div className="absolute inset-0 border border-foreground/10" />

            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')]" />

            {/* Corner decoration */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 border-t border-l border-accent/30" />
          </motion.div>
        </div>

        {/* Content column */}
        <div className="col-span-12 md:col-span-7 md:pl-16">
          <TextReveal className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
            I BUILD DIGITAL EXPERIENCES THAT FEEL ALIVE
          </TextReveal>

          <div className="space-y-6 text-muted text-lg leading-relaxed mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Creative developer with a passion for crafting unique web
              experiences. I blend code and design to create interfaces that
              don&apos;t just work—they inspire.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              My work lives at the intersection of technology and art. Every
              pixel is intentional, every interaction is crafted, and every
              experience is memorable.
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-mono text-sm text-muted mb-6">TECHNOLOGIES</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 77, 0, 0.1)" }}
                  className="px-4 py-2 border border-foreground/20 text-sm font-mono cursor-default transition-colors"
                  data-cursor="hover"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
