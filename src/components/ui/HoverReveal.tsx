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
      {/* Floating image preview */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              x: "-50%",
              y: "-50%",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <motion.div
              className="relative w-[300px] h-[200px] overflow-hidden"
              animate={{
                background: `linear-gradient(135deg, ${projects[hoveredIndex].color}40 0%, ${projects[hoveredIndex].color}10 100%)`,
              }}
              transition={{ duration: 0.15 }}
            >
              {projects[hoveredIndex].image && (
                <Image
                  src={projects[hoveredIndex].image}
                  alt={projects[hoveredIndex].title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 border border-foreground/10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      <div className="divide-y divide-foreground/10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group py-8 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onProjectClick?.(project)}
            data-cursor="hover"
          >
            <div className="flex items-center justify-between">
              {/* Left side - number and title */}
              <div className="flex items-center gap-8">
                <span className="font-mono text-sm text-muted w-8">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="overflow-hidden">
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
