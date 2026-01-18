"use client";

import { useEffect, useRef, useCallback } from "react";
import { COLORS } from "@/lib/constants";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
}

interface ParticleTextProps {
  text?: string;
  fontSize?: number;
  particleSize?: number;
  particleGap?: number;
  color?: string;
  mouseRadius?: number;
}

export default function ParticleText({
  text = "HOVER ME",
  fontSize = 120,
  particleSize = 2,
  particleGap = 4,
  color = COLORS.accent,
  mouseRadius = 100,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const mouseRadiusSq = mouseRadius * mouseRadius; // Pre-compute squared radius

  const initParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Use offscreen canvas for text rendering
      const offscreen = new OffscreenCanvas(width, height);
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.fillStyle = "#fff";
      offCtx.font = `bold ${fontSize}px sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const lines = text.split("\n");
      const lineHeight = fontSize * 1.1;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        offCtx.fillText(line, width / 2, startY + i * lineHeight);
      });

      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Clear and create particles with typed array for better performance
      const particles: Particle[] = [];

      // Sample every particleGap pixels
      for (let y = 0; y < height; y += particleGap) {
        for (let x = 0; x < width; x += particleGap) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > 128) {
            particles.push({
              x: x + (Math.random() - 0.5) * 2,
              y: y + (Math.random() - 0.5) * 2,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: particleSize + Math.random(),
            });
          }
        }
      }

      particlesRef.current = particles;
    },
    [text, fontSize, particleGap, particleSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Reduces latency
    });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        dpr = Math.min(window.devicePixelRatio, 2);
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
        initParticles(ctx, rect.width, rect.height);
      }
    };

    resize();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    // Throttled mouse move with RAF - listen on document for pointer-events-none canvas
    let mouseMoveRAF: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveRAF) return;

      mouseMoveRAF = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if mouse is within canvas bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          mouseRef.current = { x, y };
        } else {
          mouseRef.current = { x: -1000, y: -1000 };
        }
        mouseMoveRAF = null;
      });
    };

    // Use document-level events so canvas can have pointer-events: none
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Pre-compute color values
    const baseColor = color;

    const animate = (timestamp: number) => {
      // Target 60fps, skip frames if needed
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const len = particles.length;

      // Batch similar operations
      ctx.fillStyle = baseColor;
      ctx.beginPath();

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Use squared distance to avoid sqrt
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (mouseRadius - dist) / mouseRadius;
          const invDist = 1 / (dist || 1);
          p.vx -= dx * invDist * force * 12;
          p.vy -= dy * invDist * force * 12;
        }

        // Return to origin with spring physics (stronger spring = faster return)
        p.vx += (p.originX - p.x) * 0.08;
        p.vy += (p.originY - p.y) * 0.08;

        // Friction (slightly less friction = more responsive)
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw - use arc for each particle
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }

      ctx.fill();

      // Draw displaced particles with slightly brighter accent color
      ctx.fillStyle = COLORS.secondary.yellow;
      ctx.beginPath();

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const dispX = p.x - p.originX;
        const dispY = p.y - p.originY;
        const dispSq = dispX * dispX + dispY * dispY;

        if (dispSq > 25) { // 5^2
          ctx.moveTo(p.x + p.size * 1.2, p.y);
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        }
      }

      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(resizeTimeout);
      if (mouseMoveRAF) cancelAnimationFrame(mouseMoveRAF);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, mouseRadius, mouseRadiusSq, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
