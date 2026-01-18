"use client";

import { motion } from "motion/react";

interface RollingTextProps {
  children: string;
  className?: string;
}

export default function RollingText({
  children,
  className = "",
}: RollingTextProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      data-cursor="hover"
      initial="idle"
      whileHover="hover"
    >
      {/* Original text */}
      <motion.span
        className="inline-block"
        variants={{
          idle: { y: 0 },
          hover: { y: "-100%" },
        }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>

      {/* Duplicate text for roll effect */}
      <motion.span
        className="absolute left-0 top-0 inline-block"
        variants={{
          idle: { y: "100%" },
          hover: { y: 0 },
        }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
