"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";

interface NavItem {
  key: string;
  href: string;
  color: string;
  icon: string;
}

interface NavigationDockMobileProps {
  items: NavItem[];
}

export function NavigationDockMobile({ items }: NavigationDockMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tNav = useTranslations("nav");
  const { transitionToPage } = usePageTransition();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      transitionToPage(href);
    }, 300); // Wait for drawer to close
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex flex-col items-center justify-center gap-1.5 bg-background border-2 border-foreground/20 rounded-full shadow-lg"
        data-cursor="hover"
        aria-label="Toggle menu"
      >
        <motion.span
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.nav
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-background border-r-2 border-foreground/10 z-50 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-foreground/10">
                <h2 className="font-mono text-xs text-muted tracking-[0.3em]">
                  [ NAVIGATION ]
                </h2>
              </div>

              {/* Menu items */}
              <div className="p-4 flex flex-col gap-2">
                {items.map((item, i) => (
                  <motion.button
                    key={item.key}
                    onClick={() => handleNavigation(item.href)}
                    className="group relative flex items-center gap-4 p-4 min-h-[68px] border-2 border-foreground/10 transition-colors"
                    style={{ borderColor: `${item.color}40` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background glow on active */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-active:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}10, transparent)`,
                      }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Icon */}
                    <div
                      className="relative w-12 h-12 flex items-center justify-center border-2 font-mono text-xl font-bold shrink-0"
                      style={{ borderColor: item.color, color: item.color }}
                    >
                      {item.icon}

                      {/* Corner accents */}
                      <div
                        className="absolute top-0 left-0 w-2 h-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-2 h-2"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-lg font-mono tracking-wider flex-1 text-left">
                      {tNav(item.key)}
                    </span>

                    {/* Arrow */}
                    <svg
                      className="w-5 h-5 opacity-50 group-active:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 10h10m0 0l-4-4m4 4l-4 4" />
                    </svg>

                    {/* Number indicator */}
                    <div
                      className="absolute top-2 right-2 font-mono text-[10px] opacity-30"
                      style={{ color: item.color }}
                    >
                      [{String(i + 1).padStart(2, "0")}]
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-foreground/10 bg-background">
                <p className="font-mono text-xs text-muted/50 text-center">
                  ADRIEN THEVON
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
