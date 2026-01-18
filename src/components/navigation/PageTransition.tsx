"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePageTransition } from "@/hooks/usePageTransition";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { isTransitioning } = usePageTransition();

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            {/* Wipe curtain */}
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 1]
              }}
            >
              {/* Noise texture */}
              <div className="absolute inset-0 opacity-20 bg-noise" />

              {/* Scanlines */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
                animate={{
                  y: ["0%", "100%"],
                }}
                transition={{
                  duration: 0.8,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </motion.div>

            {/* Loading indicator - FIXED center, clipped by wipe position */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                clipPath: "inset(0 0 0 0)"
              }}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="relative w-24 h-24">
                {/* Outer rotating square */}
                <motion.div
                  className="absolute inset-0 border-2 border-accent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />

                {/* Inner rotating square - opposite direction */}
                <motion.div
                  className="absolute inset-3 border-2 border-foreground/30"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />

                {/* Corner accents */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent"
                    style={{
                      top: i === 0 || i === 1 ? -4 : "auto",
                      bottom: i === 2 || i === 3 ? -4 : "auto",
                      left: i === 0 || i === 2 ? -4 : "auto",
                      right: i === 1 || i === 3 ? -4 : "auto",
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}

                {/* Center pulsing cross */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-1 h-6 bg-accent"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute w-6 h-1 bg-accent"
                    animate={{ scaleX: [1, 0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </div>

                {/* Orbiting particles */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`orbit-${i}`}
                    className="absolute w-1 h-1 bg-foreground/50"
                    animate={{
                      x: [0, 40, 0, -40, 0],
                      y: [0, 40, 0, -40, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.66,
                    }}
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                  />
                ))}
              </div>

              {/* Loading text */}
              <div className="mt-8 font-mono text-xs tracking-[0.3em] text-center text-muted">
                LOADING
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      {children}
    </>
  );
}
