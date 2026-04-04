"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import DualText from "@/components/ui/DualText";

const navigationItems = [
  { key: "work", href: "/work" },
  { key: "skills", href: "/skills" },
  { key: "journey", href: "/journey" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

// Stagger variants for nav list
const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.7,
    },
  },
};

const navItem = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] as const },
  },
};

export default function HeroMobile() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const { transitionToPage } = usePageTransition();
  const reducedMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    t("roles.creative"),
    t("roles.pixel"),
    t("roles.code"),
    t("roles.craft"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  const dur = reducedMotion ? 0 : undefined;

  return (
    <section className="relative h-dvh flex flex-col bg-background overflow-hidden px-6 pt-16 pb-8">
      {/* Subtle background glow - single accent color */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur ?? 0.5, delay: dur ?? 0.2 }}
        className="flex items-center gap-3 mb-10"
      >
        <span className="w-8 h-px bg-accent" />
        <span className="font-mono text-[10px] text-muted tracking-[0.2em]">
          <DualText visible={t("portfolio")} hidden={t("portfolioHidden")} />
        </span>
      </motion.div>

      {/* Main title - massive typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur ?? 0.7, delay: dur ?? 0.3 }}
        className="mb-4"
      >
        <h1 className="text-[12vw] font-bold tracking-[-0.04em] leading-[0.85]">
          <span className="block text-foreground">ADRIEN</span>
          <span className="block text-accent">THEVON</span>
        </h1>
      </motion.div>

      {/* Role ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: dur ?? 0.5, delay: dur ?? 0.5 }}
        className="mb-auto"
      >
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <span className="text-accent/50">//</span>
          <span className="text-muted/60">{t("currently")}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeRole}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="text-foreground/80"
            >
              {roles[activeRole]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation list - monochrome, minimal */}
      <motion.nav
        variants={reducedMotion ? undefined : navContainer}
        initial="hidden"
        animate="show"
        className="mt-6"
      >
        {navigationItems.map((item, index) => (
          <motion.div key={item.key} variants={reducedMotion ? undefined : navItem}>
            {/* Separator line */}
            {index === 0 && <div className="h-px bg-foreground/8" />}

            <button
              onClick={() => transitionToPage(item.href)}
              className="group flex items-center w-full py-4 active:bg-foreground/[0.03] transition-colors"
            >
              {/* Number */}
              <span className="font-mono text-[10px] text-muted/30 w-8 shrink-0 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Label */}
              <span className="text-[15px] font-semibold tracking-tight text-foreground/90 group-active:text-foreground transition-colors">
                {tNav(item.key).toUpperCase()}
              </span>

              {/* Spacer */}
              <span className="flex-1" />

              {/* Arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 text-accent/40 group-active:text-accent/70 transition-colors"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Separator line */}
            <div className="h-px bg-foreground/8" />
          </motion.div>
        ))}
      </motion.nav>

      {/* Bottom corner accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: dur ?? 1.2 }}
        className="absolute bottom-6 right-6 w-6 h-6 border-r border-b border-accent/15 pointer-events-none"
      />
    </section>
  );
}
