"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { COLORS } from "@/lib/constants";

type CursorMode = "default" | "hero" | "projects" | "about" | "contact" | "noise" | "timeline" | "skills";

interface CursorState {
  isHovering: boolean;
  isVisible: boolean;
  mode: CursorMode;
  label: string;
}

const modeConfig: Record<CursorMode, {
  size: number;
  hoverSize: number;
  color: string;
  mixBlend: boolean;
  showTrail: boolean;
  trailCount: number;
}> = {
  default: {
    size: 12,
    hoverSize: 60,
    color: COLORS.foreground,
    mixBlend: true,
    showTrail: true,
    trailCount: 1,
  },
  hero: {
    size: 16,
    hoverSize: 80,
    color: COLORS.accent,
    mixBlend: false,
    showTrail: true,
    trailCount: 3,
  },
  projects: {
    size: 10,
    hoverSize: 100,
    color: COLORS.foreground,
    mixBlend: true,
    showTrail: true,
    trailCount: 1,
  },
  about: {
    size: 14,
    hoverSize: 70,
    color: COLORS.accent,
    mixBlend: false,
    showTrail: true,
    trailCount: 2,
  },
  noise: {
    size: 8,
    hoverSize: 50,
    color: COLORS.secondary.cyan,
    mixBlend: false,
    showTrail: true,
    trailCount: 5,
  },
  contact: {
    size: 12,
    hoverSize: 60,
    color: COLORS.foreground,
    mixBlend: true,
    showTrail: true,
    trailCount: 1,
  },
  timeline: {
    size: 14,
    hoverSize: 70,
    color: COLORS.accent,
    mixBlend: false,
    showTrail: true,
    trailCount: 3,
  },
  skills: {
    size: 12,
    hoverSize: 60,
    color: COLORS.secondary.green,
    mixBlend: false,
    showTrail: true,
    trailCount: 2,
  },
};

export default function SectionCursor() {
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    isVisible: false,
    mode: "default",
    label: "",
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Trail positions for multi-trail effect
  const trailPositions = useRef<{ x: number; y: number }[]>([]);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const trailConfigs = [
    { damping: 20, stiffness: 200, mass: 0.8 },
    { damping: 15, stiffness: 150, mass: 1.0 },
    { damping: 12, stiffness: 100, mass: 1.2 },
    { damping: 10, stiffness: 80, mass: 1.4 },
    { damping: 8, stiffness: 60, mass: 1.6 },
  ];

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Create multiple trail springs
  const trail1X = useSpring(cursorX, trailConfigs[0]);
  const trail1Y = useSpring(cursorY, trailConfigs[0]);
  const trail2X = useSpring(cursorX, trailConfigs[1]);
  const trail2Y = useSpring(cursorY, trailConfigs[1]);
  const trail3X = useSpring(cursorX, trailConfigs[2]);
  const trail3Y = useSpring(cursorY, trailConfigs[2]);
  const trail4X = useSpring(cursorX, trailConfigs[3]);
  const trail4Y = useSpring(cursorY, trailConfigs[3]);
  const trail5X = useSpring(cursorX, trailConfigs[4]);
  const trail5Y = useSpring(cursorY, trailConfigs[4]);

  const trails = [
    { x: trail1X, y: trail1Y },
    { x: trail2X, y: trail2Y },
    { x: trail3X, y: trail3Y },
    { x: trail4X, y: trail4Y },
    { x: trail5X, y: trail5Y },
  ];

  const detectSection = useCallback((y: number): CursorMode => {
    const sections = document.querySelectorAll("section[data-cursor-mode]");
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        const mode = section.getAttribute("data-cursor-mode") as string;
        // Only return if mode exists in modeConfig, otherwise default
        return (mode && mode in modeConfig) ? mode as CursorMode : "default";
      }
    }
    return "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);

    const newMode = detectSection(e.clientY);

    setState(prev => {
      const updates: Partial<CursorState> = {};
      if (!prev.isVisible) updates.isVisible = true;
      if (prev.mode !== newMode) updates.mode = newMode;

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [cursorX, cursorY, detectSection]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check for hover elements
    if (
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") ||
      target.closest("button") ||
      target.dataset.cursor === "hover" ||
      target.closest("[data-cursor='hover']")
    ) {
      const label = target.dataset.cursorLabel ||
                    target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") ||
                    "";
      setState(prev => ({ ...prev, isHovering: true, label }));
      return;
    }

    setState(prev => ({ ...prev, isHovering: false, label: "" }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseLeave]);

  const { isHovering, isVisible, mode, label } = state;
  const config = modeConfig[mode];

  return (
    <>
      {/* Trails */}
      {config.showTrail && trails.slice(0, config.trailCount).map((trail, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none rounded-full"
          style={{
            x: trail.x,
            y: trail.y,
            zIndex: 9998 - i,
            mixBlendMode: config.mixBlend ? "difference" : "normal",
          }}
        >
          <motion.div
            className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              borderColor: `${config.color}${Math.floor((0.3 - i * 0.05) * 255).toString(16).padStart(2, "0")}`,
            }}
            animate={{
              width: isHovering ? config.hoverSize + i * 10 : 30 + i * 8,
              height: isHovering ? config.hoverSize + i * 10 : 30 + i * 8,
              opacity: isVisible ? 0.5 - i * 0.1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      ))}

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          mixBlendMode: config.mixBlend ? "difference" : "normal",
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: config.color }}
          animate={{
            width: isHovering ? config.hoverSize : config.size,
            height: isHovering ? config.hoverSize : config.size,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Label */}
      <AnimatePresence>
        {isHovering && isVisible && label && (
          <motion.div
            className="fixed top-0 left-0 z-[9997] pointer-events-none"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div
              className="relative -translate-x-1/2 translate-y-10 font-mono text-[10px] whitespace-nowrap px-2 py-1 bg-background/80 backdrop-blur-sm"
              style={{ color: config.color }}
            >
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode indicator (subtle) */}
      <motion.div
        className="fixed bottom-4 right-4 z-[9999] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.3 : 0 }}
      >
        <div className="font-mono text-[8px] text-muted/50 uppercase tracking-wider">
          {mode !== "default" && `// ${mode}`}
        </div>
      </motion.div>
    </>
  );
}
