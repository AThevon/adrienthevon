"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDeviceDetect } from "@/hooks";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { isMobile, isHydrated } = useDeviceDetect();

  const words = ["LOADING", "CREATIVE", "DEV"];

  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const randomBoost = Math.random() * 3;
        const next = prev + increment + randomBoost;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800);
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const currentWordIndex = Math.min(
    Math.floor(progress / 34),
    words.length - 1
  );

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background h-dvh"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background grid - smaller on mobile */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.06] lg:opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(to right, var(--foreground) 1px, transparent 1px),
                linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
              `,
                backgroundSize: (isHydrated && isMobile) ? "40px 40px" : "60px 60px",
              }}
            />
          </div>

          {/* Animated word */}
          <div className="relative h-16 md:h-32 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentWordIndex}
                initial={{ y: 80, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -80, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter"
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Progress bar - responsive margins */}
          <div className="absolute bottom-16 md:bottom-20 left-6 right-6 md:left-20 md:right-20">
            <div className="flex justify-between mb-3 md:mb-4 font-mono text-[10px] md:text-sm text-muted">
              <span>LOADING</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-[1px] bg-foreground/20 overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Corner decorations - adjusted for mobile */}
          <div className="absolute top-6 md:top-8 left-6 md:left-8 font-mono text-[10px] md:text-xs text-muted">
            <div>001</div>
            <div className="mt-1">PORTFOLIO—2026</div>
          </div>

          <div className="absolute top-6 md:top-8 right-6 md:right-8 font-mono text-[10px] md:text-xs text-muted text-right">
            <div>CREATIVE</div>
            <div className="mt-1">DEVELOPER</div>
          </div>

          {/* Animated blocks - simplified/static on mobile */}
          {(isHydrated && isMobile) ? (
            <>
              <div className="absolute bottom-6 left-6 w-10 h-10 border border-foreground/20" />
              <div className="absolute bottom-6 right-6 w-6 h-6 bg-accent" />
            </>
          ) : (
            <>
              <motion.div
                className="absolute bottom-8 left-8 w-16 h-16 border border-foreground/20"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-8 right-8 w-8 h-8 bg-accent"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </motion.div>
      ) : (
        /* Reveal animation - split screen wipe */
        <motion.div className="fixed inset-0 z-[10000] flex overflow-hidden h-dvh">
          <motion.div
            className="w-1/2 h-full bg-background origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
          <motion.div
            className="w-1/2 h-full bg-background origin-right"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
          {/* Center line accent */}
          <motion.div
            className="absolute left-1/2 top-0 w-[2px] h-full bg-accent -translate-x-1/2"
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            style={{ originY: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
