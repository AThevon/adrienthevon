"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface HorizontalGalleryProps {
  items: Project[];
  onItemClick?: (item: Project) => void;
}

export default function HorizontalGallery({
  items,
  onItemClick,
}: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate scroll width
  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.scrollWidth - window.innerWidth;
      setScrollWidth(width);
    }
  }, [items]);

  // Transform vertical scroll to horizontal
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth]);
  const springX = useSpring(x, { stiffness: 100, damping: 30 });

  // Parallax for background elements
  const bgX = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth * 0.5]);

  // Track mouse for hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${items.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background parallax layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ x: bgX }}
        >
          {items.map((item, index) => (
            <div
              key={`bg-${item.id}`}
              className="absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px]"
              style={{
                left: `${index * 100 + 20}vw`,
                background: item.color,
              }}
            />
          ))}
        </motion.div>

        {/* Gallery items */}
        <motion.div
          ref={scrollRef}
          className="flex items-center h-full gap-8 px-[10vw]"
          style={{ x: springX }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative shrink-0 w-[70vw] md:w-[50vw] h-[60vh] cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onItemClick?.(item)}
              data-cursor="hover"
            >
              {/* Card container - classic flat */}
              <div className="relative w-full h-full bg-background border border-foreground/10 overflow-hidden">
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${item.color}, transparent 70%)`,
                  }}
                  animate={{
                    opacity: hoveredIndex === index ? 0.15 : 0.05,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Image with 3D perspective - view from side angle */}
                <div
                  className="absolute inset-0 overflow-visible"
                  style={{ perspective: "1200px" }}
                >
                  <motion.div
                    className="relative w-full h-full p-12"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      rotateY: hoveredIndex === index ? 0 : -25,
                      rotateX: hoveredIndex === index ? 0 : 5,
                      scale: hoveredIndex === index ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {/* Shadow under the image */}
                    <motion.div
                      className="absolute inset-x-12 -bottom-4 h-8 blur-2xl"
                      style={{ background: item.color }}
                      animate={{
                        opacity: hoveredIndex === index ? 0.4 : 0.2,
                        scale: hoveredIndex === index ? 1.1 : 0.9,
                      }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Actual image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 70vw, 50vw"
                      />
                    </div>

                    {/* Colored border around image on hover */}
                    <motion.div
                      className="absolute inset-0 border-2 pointer-events-none"
                      style={{ borderColor: item.color }}
                      animate={{
                        opacity: hoveredIndex === index ? 0.6 : 0,
                        scale: hoveredIndex === index ? 1.02 : 0.98,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>

                {/* Top bar with number */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-background/80 backdrop-blur-sm border-b border-foreground/10 flex items-center justify-between px-4">
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="font-mono text-xs"
                    style={{ color: item.color }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0.5,
                    }}
                  >
                    {item.category}
                  </motion.span>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-foreground/10 p-6">
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold tracking-tighter mb-2"
                    animate={{
                      x: hoveredIndex === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* View indicator */}
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      x: hoveredIndex === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <span className="font-mono text-xs text-muted">
                      VIEW PROJECT
                    </span>
                    <motion.div
                      animate={{
                        x: hoveredIndex === index ? [0, 5, 0] : 0,
                      }}
                      transition={{
                        duration: 1,
                        repeat: hoveredIndex === index ? Infinity : 0,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 12L12 4M12 4H6M12 4V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute top-12 right-0 w-1 h-24"
                  style={{ background: item.color }}
                  animate={{
                    scaleY: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          ))}

          {/* End spacer */}
          <div className="shrink-0 w-[20vw]" />
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">SCROLL</span>
            <div className="flex-1 h-px bg-foreground/10 overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                style={{ scaleX: scrollYProgress, originX: 0 }}
              />
            </div>
            <span className="font-mono text-xs text-muted">
              {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Navigation hint */}
        <motion.div
          className="absolute top-1/2 right-8 -translate-y-1/2"
          animate={{
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
