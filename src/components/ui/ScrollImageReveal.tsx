"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

interface ScrollImageRevealProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  direction?: "left" | "right" | "up" | "down";
}

export default function ScrollImageReveal({
  src,
  alt,
  title,
  subtitle,
  direction = "up",
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Clip path animation based on direction
  const clipPathStart = {
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
  };

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [clipPathStart[direction], clipPathStart[direction], "inset(0 0 0 0)"]
  );

  const scale = useTransform(scrollYProgress, [0.3, 0.7], [1.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full aspect-[16/10] overflow-hidden"
      style={{ opacity }}
    >
      {/* Image container with clip animation */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale, y }}
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5" />
          )}
        </motion.div>
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

      {/* Text overlay */}
      {(title || subtitle) && (
        <motion.div
          className="absolute bottom-8 left-8 right-8"
          style={{ opacity: textOpacity }}
        >
          {subtitle && (
            <span className="font-mono text-sm text-accent mb-2 block">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter">
              {title}
            </h3>
          )}
        </motion.div>
      )}

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-foreground/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-foreground/30" />
    </motion.div>
  );
}
