"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={pathname}
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Static noise layers */}
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              style={{ originY: 0 }}
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

              {/* Glitch bars */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-accent"
                animate={{
                  y: ["10%", "90%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute left-0 right-0 h-1 bg-accent"
                animate={{
                  y: ["90%", "10%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                {/* Dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-accent"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
