"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";

const navigationItems = [
  {
    key: "work",
    href: "/work",
    color: "#ffaa00",
    description: "projectsExplore",
  },
  {
    key: "skills",
    href: "/skills",
    color: "#00ccff",
    description: "skillsExplore",
  },
  {
    key: "journey",
    href: "/journey",
    color: "#8844ff",
    description: "journeyExplore",
  },
  {
    key: "philosophy",
    href: "/philosophy",
    color: "#00ff88",
    description: "philosophyExplore",
  },
  {
    key: "about",
    href: "/about",
    color: "#ff0088",
    description: "aboutExplore",
  },
  {
    key: "contact",
    href: "/contact",
    color: "#ffcc00",
    description: "contactExplore",
  },
];

export default function NavigationGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");
  const tHome = useTranslations("home");
  const { transitionToPage } = usePageTransition();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 px-8 md:px-16"
    >
      <motion.div
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="w-12 h-px bg-accent" />
            <span className="font-mono text-xs text-muted tracking-[0.3em]">
              {tHome("explore")}
            </span>
            <span className="w-12 h-px bg-accent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            {tHome("discoverTitle")}
          </motion.h2>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  transitionToPage(item.href);
                }}
                className="group block w-full text-left"
                data-cursor="hover"
              >
                <div className="relative h-64 bg-background border border-foreground/10 overflow-hidden transition-all duration-500 hover:border-foreground/30">
                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${item.color}, transparent 70%)`,
                    }}
                  />

                  {/* Number */}
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    {/* Icon/Visual */}
                    <motion.div
                      className="mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="w-16 h-16 border-2 flex items-center justify-center font-mono text-2xl"
                        style={{ borderColor: item.color, color: item.color }}
                      >
                        {t(item.key).charAt(0)}
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 transition-colors duration-300"
                      style={{
                        color: undefined,
                      }}
                    >
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t(item.key).toUpperCase()}
                      </motion.span>
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted text-center">
                      {tHome(item.description)}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ color: item.color }}
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>

                  {/* Top accent line */}
                  <motion.div
                    className="absolute top-0 left-0 h-1"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="font-mono text-sm text-muted">
            {tHome("scrollHint")}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
