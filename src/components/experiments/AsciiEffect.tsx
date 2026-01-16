"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AsciiEffectProps {
  text?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  interactive?: boolean;
}

// ASCII characters from dark to light
const ASCII_CHARS = " .:-=+*#%@";

export default function AsciiEffect({
  text = "CREATIVE\nCODER",
  fontSize = 10,
  color = "#fafafa",
  backgroundColor = "transparent",
  interactive = true,
}: AsciiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const generateAscii = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      mouseX: number,
      mouseY: number,
      time: number
    ) => {
      // Clear
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Setup text rendering
      ctx.font = `bold ${fontSize * 8}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Create offscreen canvas for text
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Draw text to offscreen
      offCtx.fillStyle = "#000";
      offCtx.fillRect(0, 0, width, height);
      offCtx.fillStyle = "#fff";
      offCtx.font = `bold ${fontSize * 8}px monospace`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const lines = text.split("\n");
      const lineHeight = fontSize * 10;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        offCtx.fillText(line, width / 2, startY + i * lineHeight);
      });

      // Get image data
      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Convert to ASCII
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;

      const cols = Math.floor(width / fontSize);
      const rows = Math.floor(height / (fontSize * 1.5));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const sampleX = Math.floor((x / cols) * width);
          const sampleY = Math.floor((y / rows) * height);
          const i = (sampleY * width + sampleX) * 4;

          const brightness = data[i]; // Red channel (grayscale)

          // Interactive distortion
          if (interactive) {
            const charX = x * fontSize;
            const charY = y * fontSize * 1.5;
            const dist = Math.sqrt(
              Math.pow(charX - mouseX, 2) + Math.pow(charY - mouseY, 2)
            );
            const maxDist = 150;

            if (dist < maxDist) {
              const influence = 1 - dist / maxDist;
              const wave = Math.sin(time * 3 + dist * 0.05) * influence;
              const offset = wave * 20;

              // Shift sample position based on mouse
              const newSampleX = Math.min(
                width - 1,
                Math.max(0, sampleX + offset * (charX - mouseX) * 0.01)
              );
              const newSampleY = Math.min(
                height - 1,
                Math.max(0, sampleY + offset * (charY - mouseY) * 0.01)
              );
              const newI =
                (Math.floor(newSampleY) * width + Math.floor(newSampleX)) * 4;

              const newBrightness = data[newI] || brightness;
              const charIndex = Math.floor(
                (newBrightness / 255) * (ASCII_CHARS.length - 1)
              );
              const char = ASCII_CHARS[charIndex];

              // Color variation near cursor
              const hue = (influence * 30 + time * 50) % 360;
              ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
              ctx.fillText(char, charX, charY);
              ctx.fillStyle = color;
              continue;
            }
          }

          // Normal ASCII rendering
          const charIndex = Math.floor(
            (brightness / 255) * (ASCII_CHARS.length - 1)
          );
          const char = ASCII_CHARS[charIndex];

          if (char !== " ") {
            ctx.fillText(char, x * fontSize, y * fontSize * 1.5);
          }
        }
      }
    },
    [text, fontSize, color, backgroundColor, interactive]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    let startTime = performance.now();

    const animate = () => {
      const time = (performance.now() - startTime) / 1000;

      // Smooth mouse following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      generateAscii(
        ctx,
        canvas.width,
        canvas.height,
        mouseRef.current.x,
        mouseRef.current.y,
        time
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateAscii, interactive, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
