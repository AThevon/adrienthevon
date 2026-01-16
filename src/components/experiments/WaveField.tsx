"use client";

import { useEffect, useRef } from "react";

interface WaveFieldProps {
  color?: string;
  backgroundColor?: string;
  waveCount?: number;
  amplitude?: number;
}

export default function WaveField({
  color = "#ff4d00",
  backgroundColor = "transparent",
  waveCount = 20,
  amplitude = 50,
}: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Draw waves
      for (let i = 0; i < waveCount; i++) {
        const progress = i / waveCount;
        const baseY = height * 0.3 + progress * height * 0.5;
        const waveAmplitude = amplitude * (1 - progress * 0.5);
        const frequency = 0.01 + progress * 0.005;
        const speed = 1 + progress * 0.5;

        ctx.beginPath();

        for (let x = 0; x <= width; x += 5) {
          // Distance from mouse
          const dx = x - mouseX;
          const dy = baseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 300);

          // Wave calculation
          const wave = Math.sin(x * frequency + time * speed) * waveAmplitude;
          const mouseWave = Math.sin(dist * 0.02 - time * 3) * 30 * mouseInfluence;

          const y = baseY + wave + mouseWave;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Gradient stroke
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const alpha = 0.1 + progress * 0.3;
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(0.2, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(0.8, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, `${color}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fill below the wave
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const fillGradient = ctx.createLinearGradient(0, baseY, 0, height);
        fillGradient.addColorStop(0, `${color}${Math.floor(alpha * 50).toString(16).padStart(2, "0")}`);
        fillGradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = fillGradient;
        ctx.fill();
      }

      // Draw mouse glow
      const glowGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        150
      );
      glowGradient.addColorStop(0, `${color}30`);
      glowGradient.addColorStop(1, `${color}00`);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      time += 0.02;
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
  }, [color, backgroundColor, waveCount, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-none"
      style={{ background: backgroundColor }}
    />
  );
}
