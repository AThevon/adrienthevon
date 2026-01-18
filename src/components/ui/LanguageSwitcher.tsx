"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { motion } from "motion/react";

type Locale = "fr" | "en";

export default function LanguageSwitcher() {
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
    <div className="flex items-center gap-1 font-mono text-xs">
      <motion.button
        onClick={() => switchLocale("fr")}
        className={`px-2 py-1 transition-colors duration-300 ${
          locale === "fr"
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isPending}
      >
        FR
      </motion.button>
      <span className="text-muted/30">/</span>
      <motion.button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 transition-colors duration-300 ${
          locale === "en"
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isPending}
      >
        EN
      </motion.button>
    </div>
  );
}
