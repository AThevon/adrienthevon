"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TerminalLine {
  type: "comment" | "code" | "output" | "blank";
  content: string;
}

const lines: TerminalLine[] = [
  { type: "comment", content: "// status.ts" },
  { type: "blank", content: "" },
  { type: "code", content: `const current = {` },
  { type: "code", content: `  role: "Creative Developer",` },
  { type: "code", content: `  company: "Pictarine",` },
  { type: "code", content: `  location: "Toulouse, FR",` },
  { type: "code", content: `  focus: ["image processing", "frontend"],` },
  { type: "code", content: `};` },
  { type: "blank", content: "" },
  { type: "code", content: `const stack = {` },
  { type: "code", content: `  daily: ["TypeScript", "React", "Next.js", "Tailwind"],` },
  { type: "code", content: `  creative: ["Three.js", "GSAP", "Canvas", "Shaders"],` },
  { type: "code", content: `  tools: ["Zed", "Wezterm", "Shell", "Claude"],` },
  { type: "code", content: `};` },
  { type: "blank", content: "" },
  { type: "code", content: `while (true) {` },
  { type: "code", content: `  learn();` },
  { type: "code", content: `  build();` },
  { type: "code", content: `  ship();` },
  { type: "code", content: `}` },
];

const formatCode = (content: string) => {
  return content
    .replace(/(const|while|true)/g, '<span class="text-purple-400">$1</span>')
    .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
    .replace(/(role|company|location|focus|daily|creative|tools|current|stack):/g, '<span class="text-blue-400">$1</span>:')
    .replace(/(learn|build|ship)\(\)/g, '<span class="text-yellow-400">$1</span>()')
    .replace(/(\{|\}|;|\[|\])/g, '<span class="text-foreground/50">$1</span>');
};

const getLineColor = (type: TerminalLine["type"]) => {
  switch (type) {
    case "comment": return "text-foreground/40";
    case "code": return "text-accent";
    case "output": return "text-foreground/70";
    default: return "text-foreground";
  }
};

export default function TerminalAbout() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      setIsTyping(false);
      return;
    }

    const timeout = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, 100);

    return () => clearTimeout(timeout);
  }, [visibleLines]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-6">
      {/* Terminal window - fixed height from the start */}
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

        {/* Terminal content - fixed height, all lines pre-reserved */}
        <div
          className="p-4 md:p-5 font-mono text-xs md:text-sm leading-relaxed"
          style={{ minHeight: `${lines.length * 1.65 + 3}em` }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${getLineColor(line.type)} ${line.type === "blank" ? "h-4" : ""}`}
              style={{ visibility: index < visibleLines ? "visible" : "hidden" }}
            >
              {index < visibleLines ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12 }}
                  className="inline-block"
                >
                  {line.type === "code" ? (
                    <span dangerouslySetInnerHTML={{ __html: formatCode(line.content) }} />
                  ) : (
                    line.content
                  )}
                </motion.span>
              ) : (
                // Invisible placeholder to maintain height
                <span className="invisible">
                  {line.type === "blank" ? "\u00A0" : line.content}
                </span>
              )}
            </div>
          ))}

          {/* Cursor */}
          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.span
                key="typing-cursor"
                className="inline-block w-2 h-4 bg-accent ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ) : (
              <motion.div
                key="done-cursor"
                className="mt-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-foreground/40 mr-2">$</span>
                <motion.span
                  className="inline-block w-2 h-4 bg-accent"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
