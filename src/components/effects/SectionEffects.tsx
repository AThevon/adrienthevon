"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { COLORS } from "@/lib/constants";
import { usePerformance } from "@/hooks";

type SectionType = "hero" | "projects" | "about" | "noise" | "contact" | "timeline" | "skills" | "default";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "orb" | "line" | "ring" | "star" | "dot";
  angle: number;
  angleSpeed: number;
  trail: { x: number; y: number }[];
}

interface SectionEffectsProps {
  enabled?: boolean;
}

const sectionConfig: Record<SectionType, {
  color: string;
  secondaryColor: string;
  maxAge: number;
  intensity: number;
  particleCount: number;
  effect: "constellation" | "magnetic" | "vortex" | "electric" | "ripple" | "none";
  gravity: number;
  friction: number;
}> = {
  hero: {
    color: COLORS.accent,
    secondaryColor: "#ff8844",
    maxAge: 80,
    intensity: 0.6,
    particleCount: 60,
    effect: "constellation",
    gravity: 0,
    friction: 0.98,
  },
  projects: {
    color: COLORS.foreground,
    secondaryColor: "#888888",
    maxAge: 50,
    intensity: 0.3,
    particleCount: 30,
    effect: "magnetic",
    gravity: 0.05,
    friction: 0.96,
  },
  about: {
    color: COLORS.accent,
    secondaryColor: "#ffaa66",
    maxAge: 60,
    intensity: 0.4,
    particleCount: 40,
    effect: "vortex",
    gravity: 0,
    friction: 0.97,
  },
  noise: {
    color: COLORS.secondary.cyan,
    secondaryColor: "#00ff88",
    maxAge: 70,
    intensity: 0.5,
    particleCount: 50,
    effect: "electric",
    gravity: -0.02,
    friction: 0.99,
  },
  contact: {
    color: COLORS.accent,
    secondaryColor: "#ff6644",
    maxAge: 40,
    intensity: 0.25,
    particleCount: 25,
    effect: "ripple",
    gravity: 0,
    friction: 0.95,
  },
  timeline: {
    color: COLORS.accent,
    secondaryColor: "#ff8866",
    maxAge: 55,
    intensity: 0.35,
    particleCount: 35,
    effect: "vortex",
    gravity: 0,
    friction: 0.97,
  },
  skills: {
    color: COLORS.secondary.green,
    secondaryColor: "#44ff88",
    maxAge: 45,
    intensity: 0.3,
    particleCount: 30,
    effect: "magnetic",
    gravity: 0.03,
    friction: 0.96,
  },
  default: {
    color: COLORS.foreground,
    secondaryColor: "#666666",
    maxAge: 30,
    intensity: 0.15,
    particleCount: 15,
    effect: "none",
    gravity: 0.05,
    friction: 0.95,
  },
};

export default function SectionEffects({ enabled = true }: SectionEffectsProps) {
  // All hooks must be called before any conditional returns
  const { enableParticles, particleMultiplier } = usePerformance();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionType>("default");
  const timeRef = useRef(0);

  // Adjust particle count based on performance multiplier
  const getAdjustedConfig = useCallback((section: SectionType) => {
    const config = sectionConfig[section];
    return {
      ...config,
      particleCount: Math.round(config.particleCount * particleMultiplier),
    };
  }, [particleMultiplier]);

  const detectSection = useCallback((y: number): SectionType => {
    const sections = document.querySelectorAll("section[data-cursor-mode]");
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        return (section.getAttribute("data-cursor-mode") as SectionType) || "default";
      }
    }
    return "default";
  }, []);

  const createParticle = useCallback((x: number, y: number, vx: number, vy: number, config: typeof sectionConfig["hero"]): Particle => {
    const types: Particle["type"][] = ["orb", "line", "ring", "star", "dot"];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: vx * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      vy: vy * (0.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 3,
      life: 0,
      maxLife: config.maxAge * (0.5 + Math.random() * 0.5),
      size: 3 + Math.random() * 8,
      color: Math.random() > 0.3 ? config.color : config.secondaryColor,
      type,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.2,
      trail: [],
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastMoveTime = 0;
    const throttleMs = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < throttleMs) return;
      lastMoveTime = now;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      const vx = e.clientX - lastMouseRef.current.x;
      const vy = e.clientY - lastMouseRef.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      const detectedSection = detectSection(e.clientY);
      const section = detectedSection in sectionConfig ? detectedSection : "default";

      if (section !== currentSection) {
        setCurrentSection(section as SectionType);
        particlesRef.current = [];
      }

      const config = getAdjustedConfig(section as SectionType);

      // Spawn particles based on movement
      if (speed > 3 && config.effect !== "none") {
        const count = Math.min(Math.floor(speed / 5), 4);
        for (let i = 0; i < count; i++) {
          particlesRef.current.push(createParticle(e.clientX, e.clientY, vx, vy, config));
        }

        while (particlesRef.current.length > config.particleCount) {
          particlesRef.current.shift();
        }
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const drawOrb = (ctx: CanvasRenderingContext2D, p: Particle, lifeRatio: number, config: typeof sectionConfig["hero"]) => {
      const size = p.size * lifeRatio * config.intensity * 2;
      const alpha = lifeRatio * 0.6;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
      gradient.addColorStop(0, `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(0.4, `${p.color}${Math.floor(alpha * 150).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawLine = (ctx: CanvasRenderingContext2D, p: Particle, lifeRatio: number) => {
      const length = p.size * 3 * lifeRatio;
      const alpha = lifeRatio * 0.8;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      ctx.beginPath();
      ctx.moveTo(-length, 0);
      ctx.lineTo(length, 0);
      ctx.strokeStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = 1.5 * lifeRatio;
      ctx.stroke();

      ctx.restore();
    };

    const drawRing = (ctx: CanvasRenderingContext2D, p: Particle, lifeRatio: number) => {
      const size = p.size * 2 * lifeRatio;
      const alpha = lifeRatio * 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.strokeStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = 1.5 * lifeRatio;
      ctx.stroke();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, p: Particle, lifeRatio: number) => {
      const size = p.size * lifeRatio;
      const alpha = lifeRatio * 0.9;
      const points = 4;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? size : size * 0.4;
        const angle = (i * Math.PI) / points;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
      ctx.fill();

      ctx.restore();
    };

    const drawDot = (ctx: CanvasRenderingContext2D, p: Particle, lifeRatio: number) => {
      const size = p.size * 0.5 * lifeRatio;
      const alpha = lifeRatio;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
      ctx.fill();
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[], config: typeof sectionConfig["hero"]) => {
      const maxDist = 80;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lifeRatioA = 1 - particles[i].life / particles[i].maxLife;
            const lifeRatioB = 1 - particles[j].life / particles[j].maxLife;
            const alpha = (1 - dist / maxDist) * 0.3 * lifeRatioA * lifeRatioB;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${config.color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const config = getAdjustedConfig(currentSection);

      if (config.effect === "none") {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        // Store trail
        if (config.effect === "constellation" || config.effect === "electric") {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
        }

        // Apply physics based on effect type
        switch (config.effect) {
          case "constellation":
            // Gentle drift with connection lines
            p.vx *= config.friction;
            p.vy *= config.friction;
            p.vy += config.gravity;
            break;

          case "magnetic":
            // Attracted to mouse
            if (mx > 0) {
              const dx = mx - p.x;
              const dy = my - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 200 && dist > 20) {
                const force = 0.5 / dist;
                p.vx += dx * force;
                p.vy += dy * force;
              }
            }
            p.vx *= config.friction;
            p.vy *= config.friction;
            p.vy += config.gravity;
            break;

          case "vortex":
            // Spiral around mouse
            if (mx > 0) {
              const dx = mx - p.x;
              const dy = my - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 200 && dist > 10) {
                const angle = Math.atan2(dy, dx);
                const tangent = angle + Math.PI / 2;
                const force = 0.8 / Math.sqrt(dist);
                p.vx += Math.cos(tangent) * force + dx * 0.001;
                p.vy += Math.sin(tangent) * force + dy * 0.001;
              }
            }
            p.vx *= config.friction;
            p.vy *= config.friction;
            break;

          case "electric":
            // Erratic movement with sudden direction changes
            if (Math.random() < 0.1) {
              p.vx += (Math.random() - 0.5) * 4;
              p.vy += (Math.random() - 0.5) * 4;
            }
            p.vx *= config.friction;
            p.vy *= config.friction;
            p.vy += config.gravity;
            break;

          case "ripple":
            // Expand outward in rings
            const dx = p.x - (lastMouseRef.current.x || mx);
            const dy = p.y - (lastMouseRef.current.y || my);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              const force = 0.1;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
            p.vx *= config.friction;
            p.vy *= config.friction;
            break;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angleSpeed;

        const lifeRatio = 1 - p.life / p.maxLife;

        // Draw trails for certain effects
        if (p.trail.length > 1 && (config.effect === "electric" || config.effect === "constellation")) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = `${p.color}${Math.floor(lifeRatio * 0.3 * 255).toString(16).padStart(2, "0")}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw particle based on type
        switch (p.type) {
          case "orb":
            drawOrb(ctx, p, lifeRatio, config);
            break;
          case "line":
            drawLine(ctx, p, lifeRatio);
            break;
          case "ring":
            drawRing(ctx, p, lifeRatio);
            break;
          case "star":
            drawStar(ctx, p, lifeRatio);
            break;
          case "dot":
            drawDot(ctx, p, lifeRatio);
            break;
        }

        return true;
      });

      // Draw connections for constellation effect
      if (config.effect === "constellation" && particlesRef.current.length > 1) {
        drawConnections(ctx, particlesRef.current, config);
      }

      // Draw mouse influence area (very subtle)
      if (mx > 0 && my > 0 && (config.effect === "magnetic" || config.effect === "vortex")) {
        const radius = 100 + Math.sin(timeRef.current * 2) * 10;
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${config.color}08`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

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
  }, [enabled, currentSection, detectSection, createParticle]);

  // Disable if particles are not enabled (mobile/reduced-motion) or if not enabled
  if (!enableParticles || !enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
