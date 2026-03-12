"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { COLORS } from "@/lib/constants";

// --- Config ---
const BLOB_POINTS = 32;
const BLOB_BASE_RADIUS = 20;
const BLOB_HOVER_RADIUS = 35;
const BLOB_LERP = 0.1;
const NOISE_SPEED = 0.003;
const NOISE_AMPLITUDE = 0.35;
const VELOCITY_STRETCH = 0.6;
const VELOCITY_DECAY = 0.88;
const DOT_RADIUS = 3;
const DOT_HOVER_RADIUS = 2;
const COLOR = COLORS.foreground;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const blob = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });
  const radius = useRef(BLOB_BASE_RADIUS);
  const hovering = useRef(false);
  const rafId = useRef(0);
  const time = useRef(0);
  const lastMouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const noise2D = createNoise2D();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas || !ctx) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Draw dot immediately on mousemove for zero-latency feel
    function drawDot(x: number, y: number) {
      if (!ctx) return;
      const r = hovering.current ? DOT_HOVER_RADIUS : DOT_RADIUS;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR;
      ctx.fill();
    }

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering.current = !!el?.closest(
        'a, button, [data-cursor="hover"], input, textarea, select, label'
      );

      // Immediate dot render — skip waiting for RAF
      drawDot(e.clientX, e.clientY);
    }

    function draw() {
      if (!ctx) return;
      time.current += 1;

      // Velocity from mouse delta
      velocity.current.x =
        velocity.current.x * VELOCITY_DECAY +
        (mouse.current.x - lastMouse.current.x) * 0.3;
      velocity.current.y =
        velocity.current.y * VELOCITY_DECAY +
        (mouse.current.y - lastMouse.current.y) * 0.3;
      lastMouse.current.x = mouse.current.x;
      lastMouse.current.y = mouse.current.y;

      // Blob position follows with lerp
      blob.current.x = lerp(blob.current.x, mouse.current.x, BLOB_LERP);
      blob.current.y = lerp(blob.current.y, mouse.current.y, BLOB_LERP);

      // Radius lerp
      const targetR = hovering.current ? BLOB_HOVER_RADIUS : BLOB_BASE_RADIUS;
      radius.current = lerp(radius.current, targetR, 0.12);

      ctx.clearRect(0, 0, w, h);

      // --- Blob ---
      const bx = blob.current.x;
      const by = blob.current.y;
      const r = radius.current;
      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      );
      const angle = Math.atan2(velocity.current.y, velocity.current.x);
      const stretch = Math.min(speed * VELOCITY_STRETCH, r * 0.6);
      const t = time.current * NOISE_SPEED;

      ctx.beginPath();
      for (let i = 0; i <= BLOB_POINTS; i++) {
        const theta = (i / BLOB_POINTS) * Math.PI * 2;

        // Noise-based organic deformation
        const n = noise2D(Math.cos(theta) * 1.5 + t, Math.sin(theta) * 1.5 + t);
        const noiseOffset = 1 + n * NOISE_AMPLITUDE;

        // Velocity-based directional stretch
        const angleDiff = theta - angle;
        const stretchFactor = 1 + Math.cos(angleDiff) * (stretch / r);

        const pr = r * noiseOffset * stretchFactor;
        const px = bx + Math.cos(theta) * pr;
        const py = by + Math.sin(theta) * pr;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Blob fill — subtle, translucent
      ctx.fillStyle = hovering.current
        ? `${COLOR}12`
        : `${COLOR}08`;
      ctx.fill();

      // Blob stroke
      ctx.strokeStyle = hovering.current
        ? `${COLOR}30`
        : `${COLOR}18`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Dot (redrawn on top for RAF frames) ---
      drawDot(mouse.current.x, mouse.current.y);

      rafId.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    rafId.current = requestAnimationFrame(draw);

    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden
    />
  );
}
