"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

interface TerminalLine {
  type: "comment" | "code" | "output" | "blank";
  content: string;
  delay?: number;
}

export default function TerminalAbout() {
  const t = useTranslations("about.terminal");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const lines: TerminalLine[] = [
    { type: "comment", content: "// who am i" },
    { type: "blank", content: "" },
    { type: "code", content: `const adrien = {` },
    { type: "code", content: `  location: "Toulouse, FR",` },
    { type: "code", content: `  role: "Creative Developer",` },
    { type: "code", content: `  obsession: "pixels & interactions",` },
    { type: "code", content: `};` },
    { type: "blank", content: "" },
    { type: "comment", content: "// journey.map()" },
    { type: "blank", content: "" },
    { type: "output", content: "2022 → " + t("journey.2022") },
    { type: "output", content: "2023 → " + t("journey.2023") },
    { type: "output", content: "2024 → " + t("journey.2024") },
    { type: "output", content: "2025 → " + t("journey.2025") },
    { type: "output", content: "2026 → " + t("journey.2026") },
    { type: "blank", content: "" },
    { type: "comment", content: "// current.status()" },
    { type: "blank", content: "" },
    { type: "code", content: `while (true) {` },
    { type: "code", content: `  learn();` },
    { type: "code", content: `  build();` },
    { type: "code", content: `  ship();` },
    { type: "code", content: `}` },
  ];

  useEffect(() => {
    if (visibleLines >= lines.length) {
      setIsTyping(false);
      return;
    }

    const timeout = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, 120);

    return () => clearTimeout(timeout);
  }, [visibleLines, lines.length]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "comment":
        return "text-foreground/40";
      case "code":
        return "text-accent";
      case "output":
        return "text-foreground/70";
      default:
        return "text-foreground";
    }
  };

  const formatCode = (content: string) => {
    // Simple syntax highlighting
    return content
      .replace(/(const|while|true)/g, '<span class="text-purple-400">$1</span>')
      .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
      .replace(/(location|role|obsession|adrien):/g, '<span class="text-blue-400">$1</span>:')
      .replace(/(learn|build|ship)\(\)/g, '<span class="text-yellow-400">$1</span>()')
      .replace(/(\{|\}|;)/g, '<span class="text-foreground/50">$1</span>');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center p-4 md:p-6"
    >
      {/* Terminal window */}
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-foreground/10 rounded-lg overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-foreground/5 border-b border-foreground/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 font-mono text-xs text-foreground/40">
            adrien@portfolio ~ /about
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 md:p-5 font-mono text-xs md:text-sm leading-relaxed">
          <AnimatePresence>
            {lines.slice(0, visibleLines).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${getLineColor(line.type)} ${
                  line.type === "blank" ? "h-4" : ""
                }`}
              >
                {line.type === "code" ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: formatCode(line.content) }}
                  />
                ) : line.type === "output" ? (
                  <span className="flex">
                    <span className="text-accent mr-2">→</span>
                    {line.content.replace("→ ", "")}
                  </span>
                ) : (
                  line.content
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cursor */}
          {isTyping && (
            <motion.span
              className="inline-block w-2 h-4 bg-accent ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}

          {/* Blinking cursor at end */}
          {!isTyping && (
            <div className="mt-4 flex items-center">
              <span className="text-foreground/40 mr-2">$</span>
              <motion.span
                className="inline-block w-2 h-4 bg-accent"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-px bg-gradient-to-b from-accent/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-8 right-8 w-32 h-32 border border-accent/10 rotate-45 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border border-foreground/5 pointer-events-none" />
    </div>
  );
}
