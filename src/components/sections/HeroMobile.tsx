"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";
import DualText from "@/components/ui/DualText";

const navigationItems = [
  { key: "work", href: "/work", color: "#ffaa00" },
  { key: "skills", href: "/skills", color: "#00ccff" },
  { key: "journey", href: "/journey", color: "#8844ff" },
  { key: "about", href: "/about", color: "#ff0088" },
  { key: "contact", href: "/contact", color: "#ffcc00" },
];

export default function HeroMobile() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const { transitionToPage } = usePageTransition();
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    t("roles.creative"),
    t("roles.pixel"),
    t("roles.code"),
    t("roles.craft"),
  ];

  // Rotate roles automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative h-dvh flex flex-col bg-background overflow-hidden px-6 pt-16 pb-6">
      {/* Background accent - optimized for mobile performance */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/8 rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-32 left-0 w-48 h-48 bg-accent/5 rounded-full pointer-events-none opacity-40" />

      {/* Header label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center gap-3 mb-8"
      >
        <span className="w-8 h-px bg-accent" />
        <span className="font-mono text-[10px] text-muted tracking-[0.2em]">
          <DualText visible={t("portfolio")} hidden={t("portfolioHidden")} />
        </span>
      </motion.div>

      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-[13vw] font-bold tracking-tighter leading-[0.9]">
          <span className="block">ADRIEN</span>
          <span className="block text-accent">THEVON</span>
        </h1>
      </motion.div>

      {/* Role ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-auto"
      >
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-accent opacity-60">//</span>
          <span className="text-muted">{t("currently")}</span>
          <motion.span
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground"
          >
            {roles[activeRole]}
          </motion.span>
        </div>
      </motion.div>

      {/* Navigation grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <div className="grid grid-cols-2 gap-3">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.key}
              onClick={() => transitionToPage(item.href)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="group relative p-4 border border-foreground/10 bg-foreground/[0.02] active:bg-foreground/5 transition-colors"
              style={{
                borderColor: `${item.color}20`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 h-0.5 w-full opacity-60"
                style={{ backgroundColor: item.color }}
              />

              {/* Number */}
              <span className="absolute top-2 right-2 font-mono text-[10px] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="text-left">
                <span
                  className="font-bold text-base tracking-tight"
                  style={{ color: item.color }}
                >
                  {tNav(item.key).toUpperCase()}
                </span>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-2 right-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ color: item.color }}
                  className="opacity-40"
                >
                  <path
                    d="M4 10H16M16 10L11 5M16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-center"
      >
        <span className="font-mono text-[10px] text-muted/50 tracking-wider">
          TAP TO EXPLORE
        </span>
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-16 left-4 w-8 h-8 border-l border-t border-accent/20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-accent/20 pointer-events-none" />
    </section>
  );
}
