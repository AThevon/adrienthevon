"use client";

import { motion } from "motion/react";

interface DualTextProps {
  visible: string;
  hidden: string;
  className?: string;
}

/**
 * Text that reveals a "hidden truth" on hover via tooltip
 * Used for the "Face Cachée" concept - professional facade vs honest reality
 */
export default function DualText({
  visible,
  hidden,
  className = "",
}: DualTextProps) {
  return (
    <motion.span
      className={`relative inline-block cursor-help group ${className}`}
      initial="idle"
      whileHover="hover"
    >
      {/* Visible text with subtle underline hint */}
      <span className="relative">
        {visible}
        {/* Dotted underline hint */}
        <span className="absolute bottom-0 left-0 w-full h-px border-b border-dotted border-accent/40 group-hover:border-accent transition-colors" />
      </span>

      {/* Tooltip that appears above */}
      <motion.span
        className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-1.5 bg-accent text-background text-xs font-mono rounded whitespace-nowrap pointer-events-none z-50"
        variants={{
          idle: { opacity: 0, y: 8, scale: 0.9 },
          hover: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
      >
        {hidden}
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent" />
      </motion.span>
    </motion.span>
  );
}
