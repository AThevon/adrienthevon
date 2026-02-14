"use client";

import { motion } from "motion/react";

interface StrokeRevealTitleProps {
  delay?: number;
}

const easeSmooth = [0.4, 0, 0.2, 1] as const;

export default function StrokeRevealTitle({
  delay = 0,
}: StrokeRevealTitleProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-0">
        {/* ADRIEN */}
        <motion.div
          className="cinematic-gradient font-display font-[800] leading-[0.9] tracking-[-0.05em]"
          style={{
            fontSize: "clamp(4rem, 12vw, 11rem)",
            willChange: "filter, opacity, transform",
          }}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            delay: delay + 0.3,
            ease: easeSmooth,
          }}
        >
          ADRIEN
        </motion.div>

        {/* Decorative accent line */}
        <motion.div
          className="my-2 h-[2px] w-16 bg-accent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: delay + 1.0,
            ease: easeSmooth,
          }}
        />

        {/* THEVON */}
        <motion.div
          className="cinematic-gradient font-display font-[800] leading-[0.9] tracking-[-0.05em]"
          style={{
            fontSize: "clamp(4rem, 12vw, 11rem)",
            willChange: "filter, opacity, transform",
          }}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            delay: delay + 0.5,
            ease: easeSmooth,
          }}
        >
          THEVON
        </motion.div>
      </div>
    </div>
  );
}
