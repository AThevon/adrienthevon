"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const PARTICLE_COUNT = 55;
const LINK_DISTANCE = 140;
const LINK_OPACITY = 0.12;
const PARTICLE_SPEED = 0.3;
const GRAB_DISTANCE = 180;
const GRAB_OPACITY = 0.35;
const PARTICLE_COLOR = "232, 232, 232"; // #e8e8e8 as RGB
const LINK_COLOR = "232, 232, 232";

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * PARTICLE_SPEED * (0.5 + Math.random()),
          vy: Math.sin(angle) * PARTICLE_SPEED * (0.5 + Math.random()),
          radius: 1 + Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    }

    function draw() {
      if (disposed || !ctx) return;

      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.opacity})`;
        ctx.fill();
      }

      // Draw links between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const opacity = LINK_OPACITY * (1 - dist / LINK_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${LINK_COLOR}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Grab interaction - draw lines from mouse to nearby particles
      if (mx > 0 && my > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mx - particles[i].x;
          const dy = my - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GRAB_DISTANCE) {
            const opacity = GRAB_OPACITY * (1 - dist / GRAB_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(255, 170, 0, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    initParticles();

    window.addEventListener("resize", () => { resize(); initParticles(); });
    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
