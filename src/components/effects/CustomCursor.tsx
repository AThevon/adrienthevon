"use client";

import { useEffect, useRef } from "react";
import { COLORS } from "@/lib/constants";

// --- Config ---
const DOT_RADIUS = 2.5;
const RING_RADIUS = 12;
const RING_HOVER_RADIUS = 20;
const RING_DASH = [3.5, 3.5];
const RING_WIDTH = 1;
const RING_ROTATION_SPEED = 0.012; // rad/frame idle
const RING_HOVER_SPEED = 0.04; // rad/frame hover
const LERP_SPEED = 0.15;
const COLOR = COLORS.foreground;
const ACCENT = COLORS.accent;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const ringRadius = useRef(RING_RADIUS);
  const rotation = useRef(0);
  const rafId = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering.current = !!el?.closest(
        'a, button, [data-cursor="hover"], input, textarea, select, label'
      );
    }

    let lastVx = 0;
    let lastVy = 0;

    function draw() {
      if (!ctx) return;

      // Smooth follow
      pos.current.x = lerp(pos.current.x, mouse.current.x, LERP_SPEED);
      pos.current.y = lerp(pos.current.y, mouse.current.y, LERP_SPEED);

      // Velocity for rotation boost
      const vx = mouse.current.x - pos.current.x;
      const vy = mouse.current.y - pos.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);
      lastVx = vx;
      lastVy = vy;

      // Ring radius lerp
      const targetR = hovering.current ? RING_HOVER_RADIUS : RING_RADIUS;
      ringRadius.current = lerp(ringRadius.current, targetR, 0.1);

      // Rotation - speed influenced by velocity + hover
      const baseSpeed = hovering.current ? RING_HOVER_SPEED : RING_ROTATION_SPEED;
      const velocityBoost = Math.min(speed * 0.003, 0.03);
      if (!reducedMotion.current) {
        rotation.current += baseSpeed + velocityBoost;
      }

      ctx.clearRect(0, 0, w, h);

      const x = pos.current.x;
      const y = pos.current.y;
      const r = ringRadius.current;
      const isHover = hovering.current;

      // --- Dash ring ---
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation.current);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = isHover ? `${ACCENT}88` : `${COLOR}44`;
      ctx.lineWidth = RING_WIDTH;
      ctx.setLineDash(RING_DASH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // --- Center dot ---
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? ACCENT : COLOR;
      ctx.fill();

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
