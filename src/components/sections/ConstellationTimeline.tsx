"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { timelineEvents } from "@/data/timeline";

const AuroraShaderBackground = dynamic(
  () => import("@/components/effects/AuroraShaderBackground"),
  { ssr: false }
);

interface ConstellationNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  year: string;
  color: string;
  key: string;
  title: string;
  description: string;
}

export default function ConstellationTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<ConstellationNode[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0); // Start at 2022
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const t = useTranslations("timeline");
  const tEvents = useTranslations("timeline.events");

  // Initialize constellation nodes
  const initNodes = useCallback(
    (width: number, height: number) => {
      const nodes: ConstellationNode[] = [];
      // Shift center down by 100px to give more space for modal
      const centerY = height / 2 + 100;
      const spacing = width / (timelineEvents.length + 1);

      timelineEvents.forEach((event, index) => {
        const baseX = spacing * (index + 1);
        // Create a gentle wave pattern
        const waveOffset = Math.sin((index / timelineEvents.length) * Math.PI * 2) * 80;
        const baseY = centerY + waveOffset;

        nodes.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          year: event.year,
          color: event.color,
          key: event.key,
          title: tEvents(`${event.key}.title`),
          description: tEvents(`${event.key}.description`),
        });
      });

      return nodes;
    },
    [tEvents]
  );

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { innerWidth: width, innerHeight: height } = window;
        const dpr = Math.min(window.devicePixelRatio, 2);

        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }

        setDimensions({ width, height });
        nodesRef.current = initNodes(width, height);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [initNodes]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(timelineEvents.length - 1, prev + 1));
  }, [timelineEvents.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.016;
      const { width, height } = dimensions;

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas (transparent — shader background shows through)
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;

      // Update node positions (gentle floating + mouse repulsion)
      nodes.forEach((node, index) => {
        const isActive = index === activeIndex;

        // Floating animation
        const floatX = Math.sin(time * 0.8 + index) * 5;
        const floatY = Math.cos(time * 0.6 + index * 0.5) * 8;

        // Mouse repulsion
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = isActive ? 180 : 120;

        if (distance < repulsionRadius) {
          const force = (1 - distance / repulsionRadius) * (isActive ? 0.3 : 0.2);
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Spring back to base position
        const springForce = 0.05;
        node.vx += (node.baseX + floatX - node.x) * springForce;
        node.vy += (node.baseY + floatY - node.y) * springForce;
      });

      // Draw constellation lines between nodes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
        ctx.stroke();

        // Draw progress line up to active node
        if (i < activeIndex) {
          const gradient = ctx.createLinearGradient(
            nodes[i].x,
            nodes[i].y,
            nodes[i + 1].x,
            nodes[i + 1].y
          );
          gradient.addColorStop(0, nodes[i].color);
          gradient.addColorStop(1, nodes[i + 1].color);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach((node, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;
        const isFuture = index > activeIndex;

        // Node glow
        if (isActive) {
          // Multiple glow layers for active node
          [60, 40, 25].forEach((radius, i) => {
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
            const opacity = [0.15, 0.25, 0.4][i];
            gradient.addColorStop(0, node.color + Math.floor(opacity * 255).toString(16).padStart(2, "0"));
            gradient.addColorStop(1, node.color + "00");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
          });

          // Rotating rings
          const numRings = 3;
          for (let i = 0; i < numRings; i++) {
            const radius = 30 + i * 10;
            const rotation = time * (0.5 + i * 0.3) + (i * Math.PI) / 3;
            const segments = 40;
            const dashLength = (Math.PI * 2 * radius) / segments;

            ctx.strokeStyle = node.color + Math.floor((0.6 - i * 0.15) * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 2;

            for (let j = 0; j < segments; j += 2) {
              const startAngle = (j / segments) * Math.PI * 2 + rotation;
              const endAngle = ((j + 0.8) / segments) * Math.PI * 2 + rotation;

              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, startAngle, endAngle);
              ctx.stroke();
            }
          }

          // Orbiting particles
          const particleCount = 20;
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time * 2;
            const radius = 45 + Math.sin(time * 3 + i) * 5;
            const px = node.x + Math.cos(angle) * radius;
            const py = node.y + Math.sin(angle) * radius;
            const size = 2 + Math.sin(time * 4 + i) * 1;

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
          }
        }

        // Draw node core
        const coreRadius = isActive ? 12 : isPast ? 8 : 6;
        const pulseSize = isActive ? Math.sin(time * 3) * 2 : 0;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          coreRadius + pulseSize + 8
        );
        glowGradient.addColorStop(0, node.color + (isFuture ? "40" : "80"));
        glowGradient.addColorStop(1, node.color + "00");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, coreRadius + pulseSize + 8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, coreRadius + pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = isFuture ? "#2a2a2a" : node.color;
        ctx.fill();

        // Core border
        ctx.strokeStyle = isFuture ? "#4a4a4a" : "#ffffff";
        ctx.lineWidth = isFuture ? 1 : 2;
        ctx.stroke();

        // Year label
        ctx.font = isActive ? "bold 24px monospace" : "16px monospace";
        ctx.fillStyle = isActive ? node.color : isFuture ? "#4a4a4a" : "#999999";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.year, node.x, node.y + (isActive ? -70 : -40));
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, activeIndex]);

  // Handle node click
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodesRef.current.forEach((node, index) => {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 40) {
          setActiveIndex(index);
        }
      });
    },
    []
  );

  // Get active node from timelineEvents data instead of ref
  const activeNode = timelineEvents[activeIndex]
    ? {
        ...timelineEvents[activeIndex],
        title: tEvents(`${timelineEvents[activeIndex].key}.title`),
        description: tEvents(`${timelineEvents[activeIndex].key}.description`)
      }
    : null;

  return (
    <section
      data-cursor-mode="timeline"
      className="fixed inset-0 w-full h-dvh overflow-hidden bg-[#0a0a0a]"
    >
      {/* Shader aurora background — color synced with active event */}
      <AuroraShaderBackground color={timelineEvents[activeIndex]?.color ?? "#ffaa00"} />

      {/* Canvas overlay for constellation nodes */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-8 z-30 pointer-events-none"
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="font-mono text-xs text-muted/60">{t("sectionNumber")}</span>
          <span className="w-12 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-muted/60">{t("title")}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
          {t("subtitle").split(" ")[0]}{" "}
          <span className="text-accent">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>
      </motion.div>

      {/* Event info card */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 30, filter: "blur(8px)" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute top-24 right-8 z-30 w-[380px] pointer-events-auto"
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-px rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 0deg, ${activeNode.color}50, transparent 40%, transparent 60%, ${activeNode.color}30, transparent)`,
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Main container */}
            <div className="relative bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Header with gradient wash */}
              <div className="relative px-6 pt-5 pb-4">
                <div
                  className="absolute inset-0 opacity-[0.08] rounded-t-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 30% 0%, ${activeNode.color}, transparent 70%)`,
                  }}
                />

                {/* Step indicator + year */}
                <motion.div
                  className="relative flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  {/* Step dots */}
                  <div className="flex items-center gap-1.5">
                    {timelineEvents.map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{
                          backgroundColor: i <= activeIndex ? activeNode.color : "rgba(255,255,255,0.1)",
                          scale: i === activeIndex ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>

                  <div className="w-px h-3 bg-white/10" />

                  {/* Year */}
                  <motion.span
                    className="font-mono text-[11px] font-bold tracking-[0.15em]"
                    style={{ color: activeNode.color }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 }}
                  >
                    {activeNode.year}
                  </motion.span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="relative text-xl font-bold tracking-tight leading-snug"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {activeNode.title}
                </motion.h3>

                {/* Divider */}
                <motion.div
                  className="mt-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${activeNode.color}35, transparent)`,
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                />
              </div>

              {/* Description */}
              <div className="px-6 pb-5">
                <motion.p
                  className="text-sm text-white/50 leading-relaxed"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {activeNode.description}
                </motion.p>

                {/* Bottom decorative */}
                <motion.div
                  className="flex items-center gap-3 mt-5 font-mono text-[10px] text-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span>{String(timelineEvents.length).padStart(2, "0")}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        {/* Container with backdrop */}
        <div className="relative">
          {/* Glow effect */}
          {activeNode && (
            <div
              className="absolute inset-0 blur-2xl opacity-20 rounded-full"
              style={{ backgroundColor: activeNode.color }}
            />
          )}

          {/* Navigation card */}
          <div className="relative bg-background/90 backdrop-blur-xl border border-foreground/10 rounded-full px-8 py-4 flex items-center gap-6">
            {/* Previous button */}
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="group flex items-center gap-2 disabled:opacity-20 transition-all"
              data-cursor="hover"
            >
              <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all group-disabled:border-foreground/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:text-accent transition-colors">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-mono text-xs text-muted/60 group-hover:text-muted transition-colors uppercase tracking-wider">
                {t("prev")}
              </span>
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-3 px-4">
              {timelineEvents.map((event, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="group relative"
                  data-cursor="hover"
                >
                  {/* Glow when active */}
                  {i === activeIndex && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 blur-md opacity-50"
                      style={{ backgroundColor: event.color }}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className="relative w-4 h-4 rounded-full transition-all duration-300 border-2"
                    style={{
                      backgroundColor: i === activeIndex ? event.color : "transparent",
                      borderColor: i === activeIndex ? event.color : "rgba(255,255,255,0.2)",
                      transform: i === activeIndex ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {/* Year tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-background/95 backdrop-blur-sm border border-foreground/10 rounded-lg px-3 py-1.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold" style={{ color: event.color }}>
                          {event.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={activeIndex === timelineEvents.length - 1}
              className="group flex items-center gap-2 disabled:opacity-20 transition-all"
              data-cursor="hover"
            >
              <span className="font-mono text-xs text-muted/60 group-hover:text-muted transition-colors uppercase tracking-wider">
                {t("next")}
              </span>
              <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all group-disabled:border-foreground/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:text-accent transition-colors">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          {/* Hint text below */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs text-muted/30 uppercase tracking-wider whitespace-nowrap"
          >
            Click nodes • Use arrows • Keyboard ← →
          </motion.div>
        </div>
      </motion.div>

      {/* Year indicator (background) */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={`year-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.08, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-bold tracking-tighter pointer-events-none select-none"
            style={{
              color: activeNode.color
            }}
          >
            {activeNode.year}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
