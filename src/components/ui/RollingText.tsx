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
    <div
      className={`relative overflow-hidden group ${className}`}
      data-cursor="hover"
    >
      {/* Original text */}
      <motion.span
        className="inline-block"
        initial={{ y: 0 }}
        whileHover={{ y: "-100%" }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>

      {/* Duplicate text for roll effect */}
      <motion.span
        className="absolute left-0 top-0 inline-block"
        initial={{ y: "100%" }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>
    </div>
  );
}
