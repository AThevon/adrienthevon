"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { usePageTransition } from "@/hooks/usePageTransition";

const menuItems = [
  { key: "home", href: "/" },
  { key: "work", href: "/work" },
  { key: "skills", href: "/skills" },
  { key: "journey", href: "/journey" },
  { key: "philosophy", href: "/philosophy" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { transitionToPage } = usePageTransition();

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Check if current path matches menu item
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
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 md:px-16 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          {/* Logo - hidden on homepage */}
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side - Language Switcher + Menu Button */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Language Switcher - hidden on mobile, shown in menu instead */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-12 h-12 bg-background/80 backdrop-blur-sm border border-foreground/10 flex flex-col items-center justify-center gap-1.5 group transition-colors hover:bg-foreground/5"
              data-cursor="hover"
              aria-label={isOpen ? t("close") : t("menu")}
            >
              <motion.span
                className="w-6 h-px bg-foreground transition-colors"
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 4 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-px bg-foreground transition-colors"
                animate={{
                  opacity: isOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-6 h-px bg-foreground transition-colors"
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -4 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background noise effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-noise" />

            {/* Menu Content */}
            <div className="relative h-full flex items-center justify-center px-8 md:px-16">
              <nav className="w-full max-w-4xl">
                <motion.ul
                  className="space-y-4 md:space-y-6"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 },
                    },
                  }}
                >
                  {menuItems.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <motion.li
                        key={item.key}
                        variants={{
                          open: {
                            y: 0,
                            opacity: 1,
                            transition: {
                              y: { stiffness: 1000, velocity: -100 },
                            },
                          },
                          closed: {
                            y: 50,
                            opacity: 0,
                            transition: {
                              y: { stiffness: 1000 },
                            },
                          },
                        }}
                      >
                        <button
                          onClick={() => transitionToPage(item.href)}
                          className="group block w-full text-left"
                          data-cursor="hover"
                        >
                          <div className="flex items-center gap-4 md:gap-6">
                            {/* Number */}
                            <span className="font-mono text-xs md:text-sm text-muted">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Line */}
                            <motion.span
                              className="h-px bg-foreground/20"
                              initial={{ width: "2rem" }}
                              whileHover={{ width: "4rem" }}
                              transition={{ duration: 0.3 }}
                              style={{
                                backgroundColor: active ? "#ffaa00" : undefined,
                              }}
                            />

                            {/* Label */}
                            <motion.span
                              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
                              style={{
                                color: active ? "#ffaa00" : undefined,
                              }}
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {t(item.key)}
                            </motion.span>
                          </div>
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* Language Switcher - mobile only */}
                <motion.div
                  className="mt-12 md:hidden flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LanguageSwitcher />
                </motion.div>

                {/* Footer info */}
                <motion.div
                  className="absolute bottom-8 left-8 right-8 md:left-16 md:right-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between text-xs md:text-sm font-mono text-muted">
                    <span>ADRIEN THEVON</span>
                    <span>{new Date().getFullYear()}</span>
                  </div>
                </motion.div>
              </nav>
            </div>

            {/* Decorative corner */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48"
              style={{
                background: "linear-gradient(225deg, #ffaa00 50%, transparent 50%)",
                opacity: 0.1,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
