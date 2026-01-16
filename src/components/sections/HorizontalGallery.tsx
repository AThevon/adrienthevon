"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  color: string;
  image?: string;
}

interface HorizontalGalleryProps {
  items: GalleryItem[];
  onItemClick?: (item: GalleryItem) => void;
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
              className="relative flex-shrink-0 w-[70vw] md:w-[50vw] h-[60vh] cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onItemClick?.(item)}
              data-cursor="hover"
            >
              {/* Image container */}
              <motion.div
                className="relative w-full h-full overflow-hidden"
                animate={{
                  scale: hoveredIndex === index ? 0.98 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Placeholder / Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}30 0%, ${item.color}10 100%)`,
                  }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* RGB Split effect on hover */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    x: hoveredIndex === index ? [-2, 2, -2] : 0,
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: hoveredIndex === index ? Infinity : 0,
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${item.color}20 0%, transparent 100%)`,
                    mixBlendMode: "screen",
                  }}
                />

                {/* Border */}
                <div className="absolute inset-0 border border-foreground/10" />

                {/* Corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20"
                  style={{
                    background: `linear-gradient(135deg, ${item.color} 50%, transparent 50%)`,
                  }}
                  animate={{
                    scale: hoveredIndex === index ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Number */}
                <div className="absolute top-6 left-6 font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </motion.div>

              {/* Text content */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.span
                  className="font-mono text-xs block mb-2"
                  style={{ color: item.color }}
                  animate={{
                    y: hoveredIndex === index ? 0 : 10,
                    opacity: hoveredIndex === index ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.category}
                </motion.span>

                <motion.h3
                  className="text-4xl md:text-5xl font-bold tracking-tighter"
                  animate={{
                    y: hoveredIndex === index ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.h3>

                {/* View indicator */}
                <motion.div
                  className="mt-4 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-mono text-sm">VIEW PROJECT</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 12L12 4M12 4H6M12 4V10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[20vw]" />
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">SCROLL</span>
            <div className="flex-1 h-[1px] bg-foreground/10 overflow-hidden">
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
