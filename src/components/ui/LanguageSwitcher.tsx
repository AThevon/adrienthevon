"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

type Locale = "fr" | "en";

export default function LanguageSwitcher({ id = "default" }: { id?: string }) {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Set cookie and reload to apply new locale
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <div className="relative">
      {/* Container with background */}
      <div className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-4 py-3 flex items-center gap-3">
        {/* Globe icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-muted"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22M2 12H22M4 7H20M4 17H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Language buttons */}
        <div className="flex items-center gap-2 font-mono text-sm">
          <motion.button
            onClick={() => switchLocale("fr")}
            className="relative px-3 py-1 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPending}
            data-cursor="hover"
          >
            <span
              className={`relative z-10 ${
                locale === "fr" ? "text-background" : "text-muted hover:text-foreground"
              }`}
            >
              FR
            </span>
            {/* Active indicator */}
            <AnimatePresence>
              {locale === "fr" && (
                <motion.div
                  className="absolute inset-0 bg-accent"
                  layoutId={`language-indicator-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          <span className="text-muted/30">|</span>

          <motion.button
            onClick={() => switchLocale("en")}
            className="relative px-3 py-1 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPending}
            data-cursor="hover"
          >
            <span
              className={`relative z-10 ${
                locale === "en" ? "text-background" : "text-muted hover:text-foreground"
              }`}
            >
              EN
            </span>
            {/* Active indicator */}
            <AnimatePresence>
              {locale === "en" && (
                <motion.div
                  className="absolute inset-0 bg-accent"
                  layoutId={`language-indicator-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-accent/50" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-accent/50" />
    </div>
  );
}
