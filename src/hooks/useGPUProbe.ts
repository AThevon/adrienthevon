"use client";

import { useState, useEffect } from "react";

interface GPUProbeResult {
  canRender: boolean;
  tier: "high" | "low";
  isProbing: boolean;
}

const SESSION_KEY = "gpu-probe-result";

const SSR_DEFAULT: GPUProbeResult = {
  canRender: true,
  tier: "high",
  isProbing: true,
};

function runProbe(): Omit<GPUProbeResult, "isProbing"> {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return { canRender: false, tier: "low" };
  }

  const FRAMES = 10;
  const start = performance.now();

  for (let f = 0; f < FRAMES; f++) {
    ctx.clearRect(0, 0, 200, 200);

    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 200,
        Math.random() * 200,
        5 + Math.random() * 15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${0.3 + Math.random() * 0.7})`;
      ctx.fill();
    }

    const grad = ctx.createRadialGradient(100, 100, 0, 100, 100, 80);
    grad.addColorStop(0, "rgba(255, 77, 0, 0.6)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  const elapsed = performance.now() - start;

  const imageData = ctx.getImageData(0, 0, 200, 200);
  const data = imageData.data;
  let hasPixels = false;

  // Sample every 40th pixel's alpha channel for a quick check
  for (let i = 3; i < data.length; i += 160) {
    if (data[i] > 0) {
      hasPixels = true;
      break;
    }
  }

  if (!hasPixels) {
    return { canRender: false, tier: "low" };
  }

  // 10 frames in < 333ms ≈ 30+ FPS equivalent
  const tier = elapsed < 333 ? "high" : "low";

  return { canRender: true, tier };
}

export function useGPUProbe(): GPUProbeResult {
  const [result, setResult] = useState<GPUProbeResult>(SSR_DEFAULT);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Omit<GPUProbeResult, "isProbing">;
        setResult({ ...parsed, isProbing: false });
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const probeResult = runProbe();

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(probeResult));
    } catch {
      // Not critical
    }

    setResult({ ...probeResult, isProbing: false });
  }, []);

  return result;
}
