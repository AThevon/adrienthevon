"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { useDeviceDetect } from "@/hooks";

interface CursorState {
  isHovering: boolean;
  isVisible: boolean;
  cursorType: "default" | "hover" | "drag" | "text";
}

export default function CustomCursor() {
  // All hooks must be called before any conditional returns
  const { isMobile } = useDeviceDetect();

  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    isVisible: false,
    cursorType: "default",
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const trailConfig = { damping: 20, stiffness: 200, mass: 0.8 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setState(prev => prev.isVisible ? prev : { ...prev, isVisible: true });
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") ||
      target.closest("button") ||
      target.dataset.cursor === "hover" ||
      target.closest("[data-cursor='hover']")
    ) {
      setState(prev => ({ ...prev, isHovering: true, cursorType: "hover" }));
      return;
    }

    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      setState(prev => ({ ...prev, cursorType: "text" }));
      return;
    }

    setState(prev => ({ ...prev, isHovering: false, cursorType: "default" }));
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

  // Disable on mobile devices (no cursor needed on touch devices)
  if (isMobile) return null;

  const { isHovering, isVisible, cursorType } = state;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            width: isHovering ? 60 : 12,
            height: isHovering ? 60 : 12,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Trailing cursor ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: trailXSpring,
          y: trailYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            opacity: isVisible ? 0.5 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      {/* Hover label */}
      <AnimatePresence>
        {isHovering && isVisible && (
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
            <div className="relative -translate-x-1/2 translate-y-8 font-mono text-[10px] text-white/60 whitespace-nowrap">
              CLICK
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
