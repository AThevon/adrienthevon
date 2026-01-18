"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface NoiseTransitionProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
  variant?: "static" | "glitch" | "scanlines" | "rgb";
}

export default function NoiseTransition({
  isActive,
  duration = 800,
  onComplete,
  variant = "glitch",
}: NoiseTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startTime = performance.now();
    let frame = 0;

    const drawNoise = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      frame++;

      // Clear
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const intensity = Math.sin(progress * Math.PI); // Peak at middle

      switch (variant) {
        case "static":
          drawStaticNoise(ctx, canvas.width, canvas.height, intensity);
          break;
        case "glitch":
          drawGlitchEffect(ctx, canvas.width, canvas.height, intensity, frame);
          break;
        case "scanlines":
          drawScanlines(ctx, canvas.width, canvas.height, intensity, frame);
          break;
        case "rgb":
          drawRGBSplit(ctx, canvas.width, canvas.height, intensity, frame);
          break;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(drawNoise);
      } else {
        setIsVisible(false);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(drawNoise);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, duration, variant, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}

// Static TV noise
function drawStaticNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255 * intensity;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 255 * intensity;
  }

  ctx.putImageData(imageData, 0, 0);
}

// Glitch effect with horizontal displacement
function drawGlitchEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  frame: number
) {
  // Base noise
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 60 * intensity;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 100 * intensity;
  }

  ctx.putImageData(imageData, 0, 0);

  // Glitch lines
  const numLines = Math.floor(10 * intensity);
  for (let i = 0; i < numLines; i++) {
    const y = Math.random() * height;
    const lineHeight = Math.random() * 20 + 5;
    const offset = (Math.random() - 0.5) * 100 * intensity;

    ctx.fillStyle = `rgba(255, 77, 0, ${0.3 * intensity})`;
    ctx.fillRect(offset, y, width, lineHeight);

    // RGB split on some lines
    if (Math.random() > 0.5) {
      ctx.fillStyle = `rgba(0, 255, 136, ${0.2 * intensity})`;
      ctx.fillRect(offset + 5, y, width, lineHeight / 2);
      ctx.fillStyle = `rgba(136, 68, 255, ${0.2 * intensity})`;
      ctx.fillRect(offset - 5, y + lineHeight / 2, width, lineHeight / 2);
    }
  }

  // Occasional full-width flash
  if (Math.random() > 0.9) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * intensity})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Block glitches
  const numBlocks = Math.floor(5 * intensity);
  for (let i = 0; i < numBlocks; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = Math.random() * 200 + 50;
    const h = Math.random() * 30 + 10;

    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "255, 77, 0" : "0, 255, 136"}, ${0.3 * intensity})`;
    ctx.fillRect(x, y, w, h);
  }
}

// Scanlines effect
function drawScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  frame: number
) {
  // Moving scanline
  const scanY = (frame * 5) % height;

  ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * intensity})`;
  ctx.fillRect(0, scanY, width, 2);
  ctx.fillRect(0, scanY - 100, width, 1);

  // Static scanlines
  for (let y = 0; y < height; y += 3) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * intensity})`;
    ctx.fillRect(0, y, width, 1);
  }

  // Noise overlay
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 30 * intensity;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 50 * intensity;
  }

  ctx.putImageData(imageData, 0, 0);

  // CRT vignette
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width * 0.7
  );
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${0.5 * intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// RGB Split effect
function drawRGBSplit(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  frame: number
) {
  const offset = 10 * intensity;
  const time = frame * 0.1;

  // Red channel
  ctx.fillStyle = `rgba(255, 0, 0, ${0.3 * intensity})`;
  ctx.fillRect(Math.sin(time) * offset, 0, width, height);

  // Green channel
  ctx.fillStyle = `rgba(0, 255, 0, ${0.3 * intensity})`;
  ctx.fillRect(0, Math.cos(time) * offset, width, height);

  // Blue channel
  ctx.fillStyle = `rgba(0, 0, 255, ${0.3 * intensity})`;
  ctx.fillRect(-Math.sin(time) * offset, 0, width, height);

  // Noise
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() > 0.97) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 100 * intensity;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Horizontal lines
  for (let i = 0; i < 5; i++) {
    const y = Math.random() * height;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * intensity})`;
    ctx.fillRect(0, y, width, 1);
  }
}

// Hook for triggering transitions
export function useNoiseTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [variant, setVariant] = useState<NoiseTransitionProps["variant"]>("glitch");

  const trigger = (v: NoiseTransitionProps["variant"] = "glitch") => {
    setVariant(v);
    setIsTransitioning(true);
  };

  const onComplete = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    variant,
    trigger,
    onComplete,
  };
}
