"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

interface NoiseTerrainProps {
  color?: string;
  backgroundColor?: string;
  gridSize?: number;
  scale?: number;
}

export default function NoiseTerrain({
  color = "#00ff88",
  backgroundColor = "transparent",
  gridSize = 40,
  scale = 0.03,
}: NoiseTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise3D = createNoise3D();

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear
      ctx.fillStyle = backgroundColor === "transparent" ? "#0a0a0a" : backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;

      // Generate height map
      const heights: number[][] = [];

      for (let y = 0; y < rows; y++) {
        heights[y] = [];
        for (let x = 0; x < cols; x++) {
          const worldX = x * gridSize;
          const worldY = y * gridSize;

          // Distance from mouse
          const dx = worldX - mouseX;
          const dy = worldY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 200);

          // Noise value
          const noiseVal = noise3D(x * scale, y * scale, time * 0.5);
          const height = noiseVal * 50 + mouseInfluence * 30 * Math.sin(time * 3);

          heights[y][x] = height;
        }
      }

      // Draw terrain as wireframe
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let y = 0; y < rows - 1; y++) {
        ctx.beginPath();

        for (let x = 0; x < cols; x++) {
          const worldX = x * gridSize;
          const worldY = y * gridSize;
          const h = heights[y][x];

          // Isometric projection
          const screenX = worldX;
          const screenY = worldY - h;

          if (x === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        const alpha = 0.2 + (y / rows) * 0.3;
        ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < cols; x++) {
        ctx.beginPath();

        for (let y = 0; y < rows; y++) {
          const worldX = x * gridSize;
          const worldY = y * gridSize;
          const h = heights[y][x];

          const screenX = worldX;
          const screenY = worldY - h;

          if (y === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        const alpha = 0.1 + (x / cols) * 0.2;
        ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.stroke();
      }

      // Draw dots at intersections
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const worldX = x * gridSize;
          const worldY = y * gridSize;
          const h = heights[y][x];

          const screenX = worldX;
          const screenY = worldY - h;

          // Distance from mouse
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const size = 3 * (1 - dist / 100);
            ctx.beginPath();
            ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }
        }
      }

      // Mouse glow
      const glowGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        100
      );
      glowGradient.addColorStop(0, `${color}40`);
      glowGradient.addColorStop(1, `${color}00`);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 100, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, backgroundColor, gridSize, scale]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-none"
      style={{ background: backgroundColor }}
    />
  );
}
