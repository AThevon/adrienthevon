"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useDeviceDetect } from "@/hooks";

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
  const { isMobile } = useDeviceDetect();

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
  const springX = useSpring(x, { stiffness: 200, damping: 25 });

  // Parallax for background elements - reduce intensity on mobile
  const parallaxIntensity = isMobile ? 0.3 : 0.5;
  const bgX = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth * parallaxIntensity]);

  // Track mouse for hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Mobile: simple horizontal scroll with snap
  if (isMobile) {
    return (
      <section className="relative min-h-dvh py-24">
        <div className="w-full h-[calc(100dvh-12rem)] overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide">
          <div className="flex h-full gap-6 px-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="relative shrink-0 w-[85vw] h-full snap-center cursor-pointer"
                onClick={() => onItemClick?.(item)}
              >
                {/* Simple card for mobile */}
                <div className="relative w-full h-full bg-background border border-foreground/10 overflow-hidden rounded-lg">
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${item.color}, transparent 70%)`,
                    }}
                  />

                  {/* Image */}
                  <div className="relative w-full h-3/5 p-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="85vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-background to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {item.category}
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator for mobile */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-foreground/20"
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop: vertical scroll with horizontal transform
  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${items.length * 60}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-24 h-[calc(100dvh-6rem)] overflow-hidden">
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
              className="relative shrink-0 w-[75vw] md:w-[55vw] h-[70dvh] cursor-pointer"
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
                  className="absolute inset-y-8 inset-x-0 overflow-visible"
                  style={{ perspective: "1200px" }}
                >
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                      transformStyle: "preserve-3d",
                      padding: hoveredIndex === index ? "1rem 1rem 4rem 1rem" : "2rem 2rem 5rem 2rem"
                    }}
                    animate={{
                      rotateY: hoveredIndex === index ? 0 : -25,
                      rotateX: hoveredIndex === index ? 0 : 5,
                      scale: hoveredIndex === index ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {/* Shadow under the image */}
                    <motion.div
                      className="absolute inset-x-0 -bottom-6 h-12 blur-3xl"
                      style={{ background: item.color }}
                      animate={{
                        opacity: hoveredIndex === index ? 0.5 : 0.2,
                        scale: hoveredIndex === index ? 1.2 : 0.8,
                      }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Actual image - contained to show full image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 75vw, 55vw"
                        style={{
                          filter: hoveredIndex === index ? "none" : "brightness(0.9)",
                          objectPosition: "center center"
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Top bar with number - compact */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-sm border-b border-foreground/10 flex items-center justify-between px-3">
                  <span className="font-mono text-[10px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="font-mono text-[10px]"
                    style={{ color: item.color }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0.5,
                    }}
                  >
                    {item.category}
                  </motion.span>
                </div>

                {/* Bottom info bar - compact */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-foreground/10 p-4">
                  <motion.div
                    className="flex items-baseline gap-2 mb-1"
                    animate={{
                      x: hoveredIndex === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl md:text-2xl font-bold tracking-tighter">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-muted">
                      {item.year}
                    </span>
                  </motion.div>

                  {/* View indicator */}
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      x: hoveredIndex === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <span className="font-mono text-[10px] text-muted">
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
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
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
                  className="absolute top-8 right-0 w-1 h-16"
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
