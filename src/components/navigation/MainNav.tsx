"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useDeviceDetect } from "@/hooks";

const menuItems = [
  { key: "home", href: "/", span: true },
  { key: "work", href: "/work", span: false },
  { key: "skills", href: "/skills", span: false },
  { key: "journey", href: "/journey", span: false },
  { key: "about", href: "/about", span: false },
  { key: "contact", href: "/contact", span: true },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const containerVariants: any = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

const cellVariants: any = {
  closed: { opacity: 0, scale: 0.95 },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
};

function MenuCell({
  label,
  num,
  active,
  span,
  onClick,
}: {
  label: string;
  num: string;
  active: boolean;
  span: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={cellVariants}
      onClick={onClick}
      data-cursor="hover"
      className={`group relative flex flex-col items-center justify-center gap-2 md:gap-3 border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden transition-colors duration-150 hover:bg-[#111] ${
        span ? "col-span-2" : ""
      }`}
      style={{ minHeight: span ? undefined : undefined }}
    >
      {/* Corner brackets - visible on hover */}
      <div className="absolute top-2 left-2 w-[10px] h-[10px] border-t border-l border-[#ffaa00] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="absolute top-2 right-2 w-[10px] h-[10px] border-t border-r border-[#ffaa00] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="absolute bottom-2 left-2 w-[10px] h-[10px] border-b border-l border-[#ffaa00] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="absolute bottom-2 right-2 w-[10px] h-[10px] border-b border-r border-[#ffaa00] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

      {/* Number */}
      <span
        className="absolute top-2 right-3 md:top-3 md:right-4 font-mono text-[9px] md:text-[10px] transition-colors duration-150"
        style={{ color: active ? "#ffaa0066" : "#333" }}
      >
        {num}
      </span>

      {/* Label */}
      <span
        className={`text-base md:text-4xl ${span ? "lg:text-5xl" : "lg:text-4xl"} tracking-tight transition-colors duration-150`}
        style={{
          fontFamily: "var(--font-display)",
          color: active ? "#ffaa00" : "#888",
        }}
      >
        <span className="group-hover:text-[#e8e8e8] transition-colors duration-150" style={{ color: active ? "#ffaa00" : undefined }}>
          {label}
        </span>
      </span>

      {/* Accent line */}
      <div
        className="h-[2px] w-0 transition-all duration-300 ease-out group-hover:w-10"
        style={{ backgroundColor: "#ffaa00" }}
      />
    </motion.button>
  );
}

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { transitionToPage } = usePageTransition();
  const { isMobile, isHydrated } = useDeviceDetect();

  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const isHomepage = pathname === "/";

  return (
    <>
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[70] px-6 py-5 md:px-12 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          {!isHomepage && (
            <button
              onClick={() => transitionToPage("/")}
              className="relative w-10 h-10 md:w-12 md:h-12 pointer-events-auto"
              data-cursor="hover"
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm border border-foreground/10 flex items-center justify-center">
                <Image
                  src="/images/icon.png"
                  alt="Adrien Thevon"
                  width={32}
                  height={32}
                  className="object-contain w-6 h-6 md:w-8 md:h-8"
                  priority
                />
              </div>
            </button>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="hidden md:block">
              <LanguageSwitcher id="header" />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-12 h-12 bg-background/80 backdrop-blur-sm border border-foreground/10 flex flex-col items-center justify-center gap-[5px] group transition-colors hover:bg-foreground/5"
              data-cursor="hover"
              aria-label={isOpen ? t("close") : t("menu")}
            >
              <motion.span
                className="block h-[1.5px] bg-foreground origin-center"
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 5 : 0,
                  width: isOpen ? 18 : 22,
                }}
                transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              />
              <motion.span
                className="block w-[22px] h-[1.5px] bg-foreground origin-center"
                animate={{
                  scaleX: isOpen ? 0 : 1,
                  width: isOpen ? 0 : 14,
                }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-[1.5px] bg-foreground origin-center"
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -5 : 0,
                  width: isOpen ? 18 : 22,
                }}
                transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu-overlay"
            className="fixed inset-0 z-[60] bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-noise" />

            {/* Grid Menu */}
            <div className="relative h-full flex flex-col">
              <motion.nav
                className="flex-1 grid grid-cols-2 p-6 pt-24 pb-20 md:p-12 md:pt-28 md:pb-24 lg:p-20 lg:pt-32 lg:pb-28 gap-2 md:gap-3"
                style={{ gridTemplateRows: "1.2fr 1fr 1fr 1.2fr" }}
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="exit"
              >
                {menuItems.map((item, index) => (
                  <MenuCell
                    key={item.key}
                    label={t(item.key)}
                    num={String(index + 1).padStart(2, "0")}
                    active={isActive(item.href)}
                    span={item.span}
                    onClick={() => { setIsOpen(false); transitionToPage(item.href); }}
                  />
                ))}
              </motion.nav>

              {/* Footer */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 px-6 pb-5 md:px-12 md:pb-8 lg:px-20 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <span className="font-mono text-[10px] md:text-xs text-[#333] tracking-widest">
                  ADRIEN THEVON
                </span>

                {/* Language Switcher - mobile */}
                <div className="md:hidden">
                  <LanguageSwitcher id="menu" />
                </div>

                <span className="font-mono text-[10px] md:text-xs text-[#333] tracking-widest hidden md:block">
                  {new Date().getFullYear()}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
