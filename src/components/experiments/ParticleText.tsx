"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
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
  color = "#ff4d00",
  mouseRadius = 100,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);

  const initParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Draw text to get pixel data
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = text.split("\n");
      const lineHeight = fontSize * 1.1;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Clear and create particles
      particlesRef.current = [];
      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y += particleGap) {
        for (let x = 0; x < width; x += particleGap) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > 128) {
            // Alpha > 128
            particlesRef.current.push({
              x: x + Math.random() * 2 - 1,
              y: y + Math.random() * 2 - 1,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              color: color,
              size: particleSize + Math.random() * 1,
            });
          }
        }
      }
    },
    [text, fontSize, particleGap, particleSize, color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles(ctx, canvas.width, canvas.height);
      }
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

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          // Repel from mouse
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 8;
          particle.vy -= Math.sin(angle) * force * 8;
        }

        // Return to origin
        const homeX = particle.originX - particle.x;
        const homeY = particle.originY - particle.y;
        particle.vx += homeX * 0.05;
        particle.vy += homeY * 0.05;

        // Apply friction
        particle.vx *= 0.9;
        particle.vy *= 0.9;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        const distFromOrigin = Math.sqrt(
          Math.pow(particle.x - particle.originX, 2) +
            Math.pow(particle.y - particle.originY, 2)
        );

        // Color based on displacement
        if (distFromOrigin > 5) {
          const hue = (distFromOrigin * 2) % 60;
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
        } else {
          ctx.fillStyle = particle.color;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-none"
      style={{ background: "transparent" }}
    />
  );
}
