"use client";

import { useEffect, useRef, useCallback } from "react";
import { COLORS } from "@/lib/constants";

interface Point {
  x: number;
  y: number;
  age: number;
  vx: number;
  vy: number;
}

interface LiquidCursorProps {
  enabled?: boolean;
  color?: string;
  maxAge?: number;
  intensity?: number;
}

export default function LiquidCursor({
  enabled = true,
  color = COLORS.accent,
  maxAge = 80,
  intensity = 0.3,
}: LiquidCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const addPoint = useCallback((x: number, y: number) => {
    const vx = x - lastMouseRef.current.x;
    const vy = y - lastMouseRef.current.y;

    pointsRef.current.push({
      x,
      y,
      age: 0,
      vx: vx * 0.5,
      vy: vy * 0.5,
    });

    // Limit points
    if (pointsRef.current.length > 100) {
      pointsRef.current.shift();
    }

    lastMouseRef.current = { x, y };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      addPoint(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      pointsRef.current = pointsRef.current.filter((point) => {
        point.age++;
        point.x += point.vx;
        point.y += point.vy;
        point.vx *= 0.95;
        point.vy *= 0.95;

        if (point.age > maxAge) return false;

        const lifeRatio = 1 - point.age / maxAge;
        const size = 30 * lifeRatio * intensity;
        const alpha = lifeRatio * 0.6;

        // Draw metaball-like shape
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          size
        );
        gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(0.5, `${color}${Math.floor(alpha * 128).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return true;
      });

      // Draw main cursor blob
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        40 * intensity
      );
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(0.5, `${color}20`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 40 * intensity, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, color, maxAge, intensity, addPoint]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
