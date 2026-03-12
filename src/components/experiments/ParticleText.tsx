"use client";

import { useEffect, useRef, useCallback } from "react";
import { COLORS } from "@/lib/constants";

// --- Entrance animation config ---
const ENTRANCE_SCATTER = 60; // close to destination — no clipping
const ENTRANCE_SPRING = 0.04;
const ENTRANCE_DAMPING = 0.87;
const DELAY_PER_CHAR = 0.06; // seconds between each letter

// Alpha threshold for pixel detection — lowered for Chrome Windows
// where font anti-aliasing can produce softer edges
const ALPHA_THRESHOLD = 50;

// Fonts to try in order if the primary font produces no particles
const FALLBACK_FONTS = ["Arial Black", "Impact", "Arial", "sans-serif"];

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
}

interface LetterChunk {
  particles: Particle[];
  delay: number;
  active: boolean;
}

interface ParticleTextProps {
  text?: string;
  fontSize?: number;
  particleSize?: number;
  particleGap?: number;
  color?: string;
  mouseRadius?: number;
  paused?: boolean;
  onReady?: () => void;
}

export default function ParticleText({
  text = "HOVER ME",
  fontSize = 120,
  particleSize = 1.2,
  particleGap = 2,
  color = COLORS.accent,
  mouseRadius = 100,
  paused = false,
  onReady,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunksRef = useRef<LetterChunk[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const pausedRef = useRef(paused);
  const hasStartedRef = useRef(false);
  const mouseRadiusSq = mouseRadius * mouseRadius;

  // Reset entrance animation when paused goes from true → false
  useEffect(() => {
    const wasPaused = pausedRef.current;
    pausedRef.current = paused;

    if (wasPaused && !paused) {
      // Preloader just finished — reset stagger timing
      startTimeRef.current = performance.now();
      hasStartedRef.current = true;
      const chunks = chunksRef.current;
      for (let i = 0; i < chunks.length; i++) {
        chunks[i].active = false;
      }
    }

    if (!paused && !wasPaused) {
      // No preloader — start immediately
      hasStartedRef.current = true;
    }
  }, [paused]);

  // Returns the total number of particles generated
  const initParticles = useCallback(
    (width: number, height: number, fontFamily: string): number => {
      const offCtx = document.createElement("canvas").getContext("2d");
      if (!offCtx) return 0;

      const font = `400 ${fontSize}px ${fontFamily}`;
      offCtx.font = font;

      const lines = text.split("\n");
      const lineHeight = fontSize * 0.95;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      // Measure character boundaries per line
      interface CharBounds {
        lineIdx: number;
        charIdx: number;
        globalIdx: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
      }

      const charBounds: CharBounds[] = [];
      let globalCharIdx = 0;

      lines.forEach((line, lineIdx) => {
        const lineWidth = offCtx.measureText(line).width;
        const lineStartX = (width - lineWidth) / 2;
        const lineCenterY = startY + lineIdx * lineHeight;
        const lineTop = lineCenterY - fontSize * 0.6;
        const lineBottom = lineCenterY + fontSize * 0.6;

        let xCursor = lineStartX;
        for (let c = 0; c < line.length; c++) {
          const char = line[c];
          const charWidth = offCtx.measureText(char).width;
          charBounds.push({
            lineIdx,
            charIdx: c,
            globalIdx: globalCharIdx++,
            left: xCursor,
            right: xCursor + charWidth,
            top: lineTop,
            bottom: lineBottom,
          });
          xCursor += charWidth;
        }
      });

      // Render full text to scan pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const scanCtx = offscreen.getContext("2d");
      if (!scanCtx) return 0;

      scanCtx.fillStyle = "#fff";
      scanCtx.font = font;
      scanCtx.textAlign = "center";
      scanCtx.textBaseline = "middle";

      lines.forEach((line, i) => {
        scanCtx.fillText(line, width / 2, startY + i * lineHeight);
      });

      const imageData = scanCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Group particles by letter
      const letterParticles = new Map<number, Particle[]>();

      for (let y = 0; y < height; y += particleGap) {
        for (let x = 0; x < width; x += particleGap) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > ALPHA_THRESHOLD) {
            // Find which character this pixel belongs to
            let charGlobalIdx = -1;
            for (let b = 0; b < charBounds.length; b++) {
              const cb = charBounds[b];
              if (x >= cb.left && x < cb.right && y >= cb.top && y < cb.bottom) {
                charGlobalIdx = cb.globalIdx;
                break;
              }
            }
            if (charGlobalIdx === -1) {
              // Pixel outside measured bounds — assign to nearest char
              let minDist = Infinity;
              for (let b = 0; b < charBounds.length; b++) {
                const cb = charBounds[b];
                const cx = (cb.left + cb.right) / 2;
                const cy = (cb.top + cb.bottom) / 2;
                const d = (x - cx) ** 2 + (y - cy) ** 2;
                if (d < minDist) {
                  minDist = d;
                  charGlobalIdx = cb.globalIdx;
                }
              }
            }

            const angle = Math.random() * Math.PI * 2;
            const scatter = ENTRANCE_SCATTER * (0.5 + Math.random());

            const particle: Particle = {
              x: x + Math.cos(angle) * scatter,
              y: y + Math.sin(angle) * scatter,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: particleSize + Math.random() * 0.5,
            };

            const arr = letterParticles.get(charGlobalIdx);
            if (arr) arr.push(particle);
            else letterParticles.set(charGlobalIdx, [particle]);
          }
        }
      }

      // Build chunks ordered by character index
      const chunks: LetterChunk[] = [];
      const sortedKeys = [...letterParticles.keys()].sort((a, b) => a - b);

      let totalParticles = 0;
      for (const key of sortedKeys) {
        const particles = letterParticles.get(key)!;
        totalParticles += particles.length;
        chunks.push({
          particles,
          delay: key * DELAY_PER_CHAR,
          active: false,
        });
      }

      chunksRef.current = chunks;
      startTimeRef.current = performance.now();
      return totalParticles;
    },
    [text, fontSize, particleGap, particleSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;

    // Resolve the --font-particle CSS variable from the DOM
    const getResolvedFont = (): string => {
      const raw = getComputedStyle(document.body)
        .getPropertyValue("--font-particle")
        .trim();
      // Next.js font CSS variables may include quotes; keep as-is for Canvas
      return raw || "sans-serif";
    };

    const setupCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio, 2);
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initWithFontFallback = (fontFamily: string) => {
      // Try the primary font first
      let count = initParticles(w, h, fontFamily);

      if (count === 0) {
        // Primary font produced no particles — try fallback fonts
        // This can happen on Chrome Windows when the web font isn't
        // available for Canvas rendering despite document.fonts.ready
        for (const fallback of FALLBACK_FONTS) {
          count = initParticles(w, h, fallback);
          if (count > 0) break;
        }
      }
    };

    const resize = () => {
      setupCanvas();
      initWithFontFallback(getResolvedFont());
    };

    // Explicitly load the font for Canvas usage, then init
    const startInit = async () => {
      await document.fonts.ready;

      setupCanvas();

      const fontFamily = getResolvedFont();
      const cssFont = `400 ${fontSize}px ${fontFamily}`;

      // Explicitly request font load — on Chrome Windows, document.fonts.ready
      // can resolve before the font is actually usable in Canvas
      try {
        await document.fonts.load(cssFont);
      } catch {
        // Font load failed — will fall through to fallback
      }

      initWithFontFallback(fontFamily);

      if (onReady) requestAnimationFrame(() => onReady());
    };

    startInit();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= w && y >= 0 && y <= h) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const totalChars = chunksRef.current.length;
    const entranceEnd = totalChars * DELAY_PER_CHAR + 1.5;

    const animate = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // Don't activate anything while paused (preloader showing)
      if (!hasStartedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const chunks = chunksRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const elapsed = (now - startTimeRef.current) / 1000;
      const entranceDone = elapsed > entranceEnd;
      const spring = entranceDone ? 0.08 : ENTRANCE_SPRING;
      const damping = entranceDone ? 0.88 : ENTRANCE_DAMPING;

      // Physics
      for (let c = 0; c < chunks.length; c++) {
        const chunk = chunks[c];

        if (!chunk.active) {
          if (elapsed < chunk.delay) continue;
          chunk.active = true;
        }

        const particles = chunk.particles;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          const dx = mx - p.x;
          const dy = my - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (mouseRadius - dist) / mouseRadius;
            const invDist = 1 / (dist || 1);
            p.vx -= dx * invDist * force * 12;
            p.vy -= dy * invDist * force * 12;
          }

          p.vx += (p.originX - p.x) * spring;
          p.vy += (p.originY - p.y) * spring;
          p.vx *= damping;
          p.vy *= damping;
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // Batch draw — resting particles
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let c = 0; c < chunks.length; c++) {
        if (!chunks[c].active) continue;
        const particles = chunks[c].particles;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - p.originX;
          const dy = p.y - p.originY;
          if (dx * dx + dy * dy <= 25) {
            ctx.moveTo(p.x + p.size, p.y);
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      // Batch draw — displaced particles
      ctx.fillStyle = COLORS.secondary.yellow;
      ctx.beginPath();
      for (let c = 0; c < chunks.length; c++) {
        if (!chunks[c].active) continue;
        const particles = chunks[c].particles;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - p.originX;
          const dy = p.y - p.originY;
          if (dx * dx + dy * dy > 25) {
            const s = p.size * 1.2;
            ctx.moveTo(p.x + s, p.y);
            ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          }
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, fontSize, mouseRadius, mouseRadiusSq, color, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
