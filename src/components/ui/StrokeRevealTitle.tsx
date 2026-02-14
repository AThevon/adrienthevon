"use client";

import { motion } from "motion/react";

interface StrokeRevealTitleProps {
  delay?: number;
}

const lines = ["ADRIEN", "THEVON"];

function AnimatedLetter({
  letter,
  index,
  baseDelay,
  y,
}: {
  letter: string;
  index: number;
  baseDelay: number;
  y: number;
}) {
  const letterDelay = baseDelay + index * 0.08;

  return (
    <motion.text
      x={`${index * 1.05}em`}
      y={y}
      fontSize="inherit"
      fontWeight="bold"
      fontFamily="inherit"
      textAnchor="start"
      stroke="#ff4d00"
      strokeWidth={1.5}
      fill="transparent"
      strokeDasharray={1000}
      initial={{
        strokeDashoffset: 1000,
        fill: "transparent",
        strokeOpacity: 1,
      }}
      animate={{
        strokeDashoffset: 0,
        fill: "#ff4d00",
        strokeOpacity: 0,
      }}
      transition={{
        strokeDashoffset: {
          duration: 1.2,
          delay: letterDelay,
          ease: [0.4, 0, 0.2, 1],
        },
        fill: {
          duration: 0.6,
          delay: letterDelay + 1.0,
          ease: "easeOut",
        },
        strokeOpacity: {
          duration: 0.4,
          delay: letterDelay + 1.4,
          ease: "easeOut",
        },
      }}
    >
      {letter}
    </motion.text>
  );
}

function AnimatedLine({
  text,
  lineIndex,
  baseDelay,
  yPosition,
}: {
  text: string;
  lineIndex: number;
  baseDelay: number;
  yPosition: number;
}) {
  const letters = text.split("");
  const lineDelay = baseDelay + lineIndex * letters.length * 0.08;

  return (
    <g>
      {letters.map((letter, i) => (
        <AnimatedLetter
          key={`${lineIndex}-${i}`}
          letter={letter}
          index={i}
          baseDelay={lineDelay}
          y={yPosition}
        />
      ))}
    </g>
  );
}

export default function StrokeRevealTitle({
  delay = 0,
}: StrokeRevealTitleProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Animated gradient sweep behind text */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 1 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 77, 0, 0.03) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["-100% 0%", "200% 0%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
        />
      </motion.div>

      {/* SVG title */}
      <svg
        viewBox="0 0 700 220"
        className="h-auto w-full max-w-[80vw]"
        style={{
          fontSize: "120px",
          fontFamily: "system-ui, sans-serif",
          overflow: "visible",
        }}
      >
        {lines.map((line, lineIndex) => (
          <AnimatedLine
            key={lineIndex}
            text={line}
            lineIndex={lineIndex}
            baseDelay={delay}
            yPosition={100 + lineIndex * 110}
          />
        ))}
      </svg>

      {/* Glow pulse overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay + 2.5,
          ease: "easeInOut",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 77, 0, 0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}
