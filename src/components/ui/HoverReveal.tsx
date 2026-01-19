"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface HoverRevealProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export default function HoverReveal({ projects, onProjectClick }: HoverRevealProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Floating image preview with tech frame */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="fixed pointer-events-none z-10000 project-preview-visible"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              x: "-50%",
              y: "-50%",
              mixBlendMode: "normal", // Override the cursor blend mode
            }}
            data-project-preview-active="true"
            initial={{ opacity: 0, scale: 0, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute -inset-8 blur-2xl opacity-30"
              style={{
                backgroundColor: projects[hoveredIndex].color,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main container with tech frame */}
            <div className="relative w-[320px] h-[220px]">
              {/* Corner brackets - static */}
              <div className="absolute inset-0 pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-6 h-6"
                    style={{
                      top: i < 2 ? "-2px" : "auto",
                      bottom: i >= 2 ? "-2px" : "auto",
                      left: i % 2 === 0 ? "-2px" : "auto",
                      right: i % 2 === 1 ? "-2px" : "auto",
                      borderTop: i < 2 ? `2px solid ${projects[hoveredIndex].color}` : "none",
                      borderBottom: i >= 2 ? `2px solid ${projects[hoveredIndex].color}` : "none",
                      borderLeft: i % 2 === 0 ? `2px solid ${projects[hoveredIndex].color}` : "none",
                      borderRight: i % 2 === 1 ? `2px solid ${projects[hoveredIndex].color}` : "none",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  />
                ))}
              </div>

              {/* Pulsing border effect - no rotation */}
              <motion.div
                className="absolute -inset-px"
                style={{
                  background: `linear-gradient(135deg, ${projects[hoveredIndex].color}80, transparent 30%, ${projects[hoveredIndex].color}60)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Inner frame */}
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

              {/* Image content */}
              <motion.div
                className="relative w-full h-full overflow-hidden"
                style={{
                  clipPath: "inset(4px)",
                }}
              >
                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 z-10"
                  style={{
                    background: `linear-gradient(135deg, ${projects[hoveredIndex].color}20 0%, transparent 50%, ${projects[hoveredIndex].color}30 100%)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {projects[hoveredIndex].image && (
                  <Image
                    src={projects[hoveredIndex].image}
                    alt={projects[hoveredIndex].title}
                    fill
                    className="object-cover"
                  />
                )}

                {/* Subtle vignette effect */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, transparent 40%, ${projects[hoveredIndex].color}20 100%)`,
                  }}
                />

                {/* Corner accents - small squares */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={`accent-${i}`}
                    className="absolute w-2 h-2 z-30"
                    style={{
                      top: i < 2 ? "8px" : "auto",
                      bottom: i >= 2 ? "8px" : "auto",
                      left: i % 2 === 0 ? "8px" : "auto",
                      right: i % 2 === 1 ? "8px" : "auto",
                      backgroundColor: projects[hoveredIndex].color,
                    }}
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 400,
                    }}
                  />
                ))}
              </motion.div>

              {/* Tech lines - animated */}
              <motion.div
                className="absolute top-2 left-2 right-2 h-px opacity-50"
                style={{ backgroundColor: projects[hoveredIndex].color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute bottom-2 left-2 right-2 h-px opacity-50"
                style={{ backgroundColor: projects[hoveredIndex].color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              />

              {/* Data readout effect - top right */}
              <motion.div
                className="absolute top-3 right-3 font-mono text-[8px] z-30 opacity-60"
                style={{ color: projects[hoveredIndex].color }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                [{String(hoveredIndex + 1).padStart(2, "0")}]
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      <div className="divide-y divide-foreground/10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group py-8 cursor-pointer project-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onProjectClick?.(project)}
            data-cursor="hover"
            data-project-preview="true"
          >
            <div className="flex items-center justify-between">
              {/* Left side - number and title */}
              <div className="flex items-center gap-8">
                <span className="font-mono text-sm text-muted w-8">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="overflow-hidden flex items-baseline gap-3">
                  <motion.h3
                    className="text-4xl md:text-6xl font-bold tracking-tighter"
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      color: hoveredIndex === index ? project.color : "inherit",
                    }}
                  >
                    {project.title}
                  </motion.h3>
                  <span className="font-mono text-sm text-muted">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Right side - category and arrow */}
              <div className="flex items-center gap-8">
                <span className="font-mono text-sm text-muted hidden md:block">
                  {project.category}
                </span>

                <motion.div
                  className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center"
                  whileHover={{
                    backgroundColor: project.color,
                    borderColor: project.color,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    animate={{
                      x: hoveredIndex === index ? 3 : 0,
                      y: hoveredIndex === index ? -3 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      d="M5 15L15 5M15 5H8M15 5V12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </motion.svg>
                </motion.div>
              </div>
            </div>

            {/* Hover line effect */}
            <motion.div
              className="h-[2px] mt-4 origin-left"
              style={{ backgroundColor: project.color }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
