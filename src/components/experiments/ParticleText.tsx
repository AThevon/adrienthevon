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
  onReady?: () => void;
}

export default function ParticleText({
  text = "HOVER ME",
  fontSize = 120,
  particleSize = 2,
  particleGap = 4,
  color = COLORS.accent,
  mouseRadius = 100,
  onReady,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const readyCalledRef = useRef(false);
  const lastFrameTime = useRef(0);
  const mouseRadiusSq = mouseRadius * mouseRadius;

  const initParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Use regular canvas as fallback for browsers that don't support OffscreenCanvas
      let offCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

      if (typeof OffscreenCanvas !== 'undefined') {
        try {
          const offscreen = new OffscreenCanvas(width, height);
          offCtx = offscreen.getContext("2d");
        } catch {
          // Fallback to regular canvas
        }
      }

      if (!offCtx) {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = width;
        fallbackCanvas.height = height;
        offCtx = fallbackCanvas.getContext("2d");
      }

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

      const particles: Particle[] = [];

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
      desynchronized: true,
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

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    let mouseMoveRAF: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveRAF) return;

      mouseMoveRAF = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          mouseRef.current = { x, y };
        } else {
          mouseRef.current = { x: -1000, y: -1000 };
        }
        mouseMoveRAF = null;
      });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const baseColor = color;

    const animate = (timestamp: number) => {
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

      // Update physics
      for (let i = 0; i < len; i++) {
        const p = particles[i];

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

        p.vx += (p.originX - p.x) * 0.08;
        p.vy += (p.originY - p.y) * 0.08;

        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw soft glow layer first (blurred effect to soften aliasing)
      ctx.fillStyle = `${baseColor}18`;
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.size * 2, p.y);
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      }
      ctx.fill();

      // Draw main particles
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();

      // Draw displaced particles with accent color
      ctx.fillStyle = COLORS.secondary.yellow;
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const dispX = p.x - p.originX;
        const dispY = p.y - p.originY;
        const dispSq = dispX * dispX + dispY * dispY;

        if (dispSq > 25) {
          ctx.moveTo(p.x + p.size * 1.2, p.y);
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Visual check: verify pixels were actually rendered
      if (!readyCalledRef.current && onReady && particles.length > 0) {
        const sampleX = Math.floor(width * 0.3);
        const sampleY = Math.floor(height * 0.3);
        const sampleW = Math.floor(width * 0.4);
        const sampleH = Math.floor(height * 0.4);

        try {
          const imageData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
          const data = imageData.data;
          let hasPixels = false;
          for (let i = 3; i < data.length; i += 160) {
            if (data[i] > 0) {
              hasPixels = true;
              break;
            }
          }
          if (hasPixels) {
            readyCalledRef.current = true;
            onReady();
          }
        } catch {
          // getImageData can fail (CORS, etc.) — call onReady as safety fallback
          readyCalledRef.current = true;
          onReady();
        }
      }

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
  }, [initParticles, mouseRadius, mouseRadiusSq, color, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
