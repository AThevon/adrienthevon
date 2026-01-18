"use client";

import { useEffect, useRef, useMemo } from "react";
import { createNoise3D } from "simplex-noise";

interface NoiseTerrainProps {
  color?: string;
  backgroundColor?: string;
  gridSize?: number;
  scale?: number;
  interactive?: boolean;
  mouseInfluenceRadius?: number;
  mouseInfluenceStrength?: number;
}

export default function NoiseTerrain({
  color = "#00ff88",
  backgroundColor = "transparent",
  gridSize = 40,
  scale = 0.03,
  interactive = true,
  mouseInfluenceRadius = 250,
  mouseInfluenceStrength = 80,
}: NoiseTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef(0);

  // Memoize noise function to avoid recreating on each render
  const noise3D = useMemo(() => createNoise3D(), []);

  // Pre-compute alpha values
  const alphaCache = useMemo(() => {
    const cache: string[] = [];
    for (let i = 0; i <= 100; i++) {
      cache.push(Math.floor((i / 100) * 255).toString(16).padStart(2, "0"));
    }
    return cache;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Pre-allocate height map array
    let heights: Float32Array;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / gridSize) + 1;
      rows = Math.ceil(height / gridSize) + 1;
      heights = new Float32Array(cols * rows);
    };

    resize();

    // Debounced resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking - use document level for better coverage
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse is within or near canvas bounds
      if (x >= -100 && x <= rect.width + 100 && y >= -100 && y <= rect.height + 100) {
        targetMouseRef.current = { x, y };
      }
    };

    if (interactive) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    let time = 0;
    const bgColor = backgroundColor === "transparent" ? "#0a0a0a" : backgroundColor;
    const mouseRadiusSq = mouseInfluenceRadius * mouseInfluenceRadius;

    const animate = (timestamp: number) => {
      // Target ~45fps for better responsiveness
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < 22) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      // Faster mouse following for snappier response
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.35;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.35;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Generate height map with exaggerated mouse influence
      for (let y = 0; y < rows; y++) {
        const rowOffset = y * cols;
        const worldY = y * gridSize;

        for (let x = 0; x < cols; x++) {
          const worldX = x * gridSize;

          // Distance from mouse
          const dx = worldX - mouseX;
          const dy = worldY - mouseY;
          const distSq = dx * dx + dy * dy;

          let mouseEffect = 0;
          if (interactive && distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const influence = 1 - dist / mouseInfluenceRadius;
            // Exaggerated wave effect - multiple sine waves for dramatic effect
            const wave1 = Math.sin(time * 4 + dist * 0.03) * influence;
            const wave2 = Math.sin(time * 2.5 - dist * 0.05) * influence * 0.5;
            const ripple = Math.sin(dist * 0.1 - time * 5) * influence * 0.3;
            mouseEffect = (wave1 + wave2 + ripple) * mouseInfluenceStrength * influence;
          }

          const noiseVal = noise3D(x * scale, y * scale, time * 0.5);
          heights[rowOffset + x] = noiseVal * 50 + mouseEffect;
        }
      }

      // Draw horizontal lines
      ctx.lineWidth = 1;

      for (let y = 0; y < rows - 1; y++) {
        const rowOffset = y * cols;
        const alpha = Math.floor((20 + (y / rows) * 30));
        ctx.strokeStyle = `${color}${alphaCache[alpha]}`;
        ctx.beginPath();

        for (let x = 0; x < cols; x++) {
          const screenX = x * gridSize;
          const screenY = y * gridSize - heights[rowOffset + x];

          if (x === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
      }

      // Draw vertical lines
      for (let x = 0; x < cols; x++) {
        const alpha = Math.floor((10 + (x / cols) * 20));
        ctx.strokeStyle = `${color}${alphaCache[alpha]}`;
        ctx.beginPath();

        for (let y = 0; y < rows; y++) {
          const screenX = x * gridSize;
          const screenY = y * gridSize - heights[y * cols + x];

          if (y === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
      }

      // Draw dots near mouse only - with exaggerated effect
      if (interactive && mouseX > 0 && mouseY > 0) {
        const dotRadius = mouseInfluenceRadius * 0.6;
        const dotRadiusSq = dotRadius * dotRadius;

        for (let y = 0; y < rows; y++) {
          const rowOffset = y * cols;
          for (let x = 0; x < cols; x++) {
            const screenX = x * gridSize;
            const screenY = y * gridSize - heights[rowOffset + x];

            const dx = screenX - mouseX;
            const dy = screenY - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < dotRadiusSq) {
              const dist = Math.sqrt(distSq);
              const influence = 1 - dist / dotRadius;
              // Pulsing dots based on distance and time
              const pulse = 0.5 + 0.5 * Math.sin(time * 6 - dist * 0.05);
              const size = (4 + pulse * 3) * influence;

              // Color varies with distance
              const hue = (dist * 0.5 + time * 50) % 60; // Cyan to green range
              ctx.fillStyle = `hsl(${180 + hue}, 100%, ${50 + influence * 30}%)`;
              ctx.beginPath();
              ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Multiple layered glows for dramatic effect
        const glowRadius = mouseInfluenceRadius * 0.8;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
        outerGlow.addColorStop(0, `${color}60`);
        outerGlow.addColorStop(0.5, `${color}20`);
        outerGlow.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner bright glow
        const innerGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius * 0.3);
        innerGlow.addColorStop(0, `${color}90`);
        innerGlow.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();
      }

      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        document.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [color, backgroundColor, gridSize, scale, noise3D, alphaCache, interactive, mouseInfluenceRadius, mouseInfluenceStrength]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: backgroundColor }}
      />
    </div>
  );
}
