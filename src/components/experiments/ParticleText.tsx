"use client";

import { useEffect, useRef, useCallback } from "react";
import { COLORS } from "@/lib/constants";

// --- Entrance animation config ---
const ENTRANCE_SCATTER = 60; // close to destination — no clipping
const ENTRANCE_SPRING = 0.04;
const ENTRANCE_DAMPING = 0.87;
const DELAY_PER_CHAR = 0.06; // seconds between each letter

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
  onReady?: () => void;
}

export default function ParticleText({
  text = "HOVER ME",
  fontSize = 120,
  particleSize = 1.2,
  particleGap = 2,
  color = COLORS.accent,
  mouseRadius = 100,
  onReady,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontProbeRef = useRef<HTMLSpanElement>(null);
  const chunksRef = useRef<LetterChunk[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const mouseRadiusSq = mouseRadius * mouseRadius;

  const initParticles = useCallback(
    (width: number, height: number, fontFamily: string) => {
      const offCtx = document.createElement("canvas").getContext("2d");
      if (!offCtx) return;

      const font = `700 ${fontSize}px ${fontFamily}`;
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
      if (!scanCtx) return;

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
          if (data[i + 3] > 128) {
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

      for (const key of sortedKeys) {
        const particles = letterParticles.get(key)!;
        chunks.push({
          particles,
          delay: key * DELAY_PER_CHAR,
          active: false,
        });
      }

      chunksRef.current = chunks;
      startTimeRef.current = performance.now();
    },
    [text, fontSize, particleGap, particleSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const fontProbe = fontProbeRef.current;
    if (!canvas || !fontProbe) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;

    const getResolvedFont = () => {
      const computed = getComputedStyle(fontProbe).fontFamily;
      return computed || "sans-serif";
    };

    const resize = () => {
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
      initParticles(w, h, getResolvedFont());
    };

    document.fonts.ready.then(() => {
      resize();
      if (onReady) requestAnimationFrame(() => onReady());
    });

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
  }, [initParticles, mouseRadius, mouseRadiusSq, color, onReady]);

  return (
    <>
      <span
        ref={fontProbeRef}
        style={{
          fontFamily: "var(--font-particle), sans-serif",
          fontWeight: 900,
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        A
      </span>
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        style={{ background: "transparent" }}
      />
    </>
  );
}
