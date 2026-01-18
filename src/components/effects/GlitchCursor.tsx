"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { COLORS } from "@/lib/constants";

type SectionType = "hero" | "projects" | "about" | "noise" | "contact" | "timeline" | "skills" | "default";

interface GlitchCursorProps {
  enabled?: boolean;
}

// Text fragments that glitch and morph - hero uses dot mode (no text)
const sectionTexts: Record<SectionType, string[]> = {
  hero: [], // Empty = dot mode
  projects: ["VIEW", "CLICK", "OPEN", "ENTER"],
  about: ["READ", "KNOW", "LEARN", "MEET"],
  noise: ["FEEL", "TOUCH", "PLAY", "SENSE"],
  contact: ["WRITE", "TALK", "SEND", "REACH"],
  timeline: ["SCROLL", "TIME", "PAST", "FUTURE"],
  skills: ["STACK", "TECH", "CODE", "TOOLS"],
  default: [], // Empty = dot mode
};

const sectionColors: Record<SectionType, string> = {
  hero: COLORS.accent,
  projects: COLORS.foreground,
  about: COLORS.accent,
  noise: COLORS.secondary.cyan,
  contact: COLORS.accent,
  timeline: COLORS.accent,
  skills: COLORS.secondary.green,
  default: COLORS.foreground,
};

// Glitch characters for random insertion
const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~▓▒░█▄▀■□▪▫●○◐◑◒◓◔◕◖◗";

export default function GlitchCursor({ enabled = true }: GlitchCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const targetMouseRef = useRef({ x: -100, y: -100 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const textIndexRef = useRef(0);
  const glitchIntensityRef = useRef(0);
  const timeRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const textChangeTimeRef = useRef(0);

  // Trail particles with physics
  const particlesRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    char: string;
    life: number;
    maxLife: number;
    scale: number;
    rotation: number;
    rotationSpeed: number;
  }[]>([]);

  const [currentSection, setCurrentSection] = useState<SectionType>("default");

  const detectSection = useCallback((y: number): SectionType => {
    const sections = document.querySelectorAll("section[data-cursor-mode]");
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        const mode = section.getAttribute("data-cursor-mode") as string;
        return (mode && mode in sectionTexts) ? mode as SectionType : "default";
      }
    }
    return "default";
  }, []);

  const checkHovering = useCallback((x: number, y: number): boolean => {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    return !!(
      element.tagName === "A" ||
      element.tagName === "BUTTON" ||
      element.closest("a") ||
      element.closest("button") ||
      (element as HTMLElement).dataset?.cursor === "hover" ||
      element.closest("[data-cursor='hover']")
    );
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

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };

      // Calculate velocity for effects
      velocityRef.current = {
        x: e.clientX - lastMouseRef.current.x,
        y: e.clientY - lastMouseRef.current.y,
      };
      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      // Update glitch intensity based on speed
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
      glitchIntensityRef.current = Math.min(speed / 20, 1);

      // Track if mouse is moving
      if (speed > 2) {
        isMovingRef.current = true;
        lastMoveTimeRef.current = timeRef.current;
      }

      // Spawn trail particles on movement (reduced frequency)
      if (speed > 8 && Math.random() < 0.4) {
        const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x) + Math.PI + (Math.random() - 0.5) * 0.8;
        const force = speed * (0.3 + Math.random() * 0.4);

        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * force * 0.3,
          vy: Math.sin(angle) * force * 0.3,
          char: glitchChars[Math.floor(Math.random() * glitchChars.length)],
          life: 1,
          maxLife: 25 + Math.random() * 20,
          scale: 0.5 + Math.random() * 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
        });

        // Limit particles
        while (particlesRef.current.length > 20) {
          particlesRef.current.shift();
        }
      }

      const detectedSection = detectSection(e.clientY);
      if (detectedSection !== currentSection) {
        setCurrentSection(detectedSection);
        textIndexRef.current = 0; // Reset text on section change
      }

      isHoveringRef.current = checkHovering(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      timeRef.current += 0.016; // ~60fps time increment

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Smooth cursor following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.15;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const color = sectionColors[currentSection];
      const texts = sectionTexts[currentSection];
      const isHovering = isHoveringRef.current;
      const isDotMode = texts.length === 0;

      // Check if mouse stopped moving (0.3s timeout)
      if (timeRef.current - lastMoveTimeRef.current > 0.3) {
        isMovingRef.current = false;
      }

      // Only cycle through texts when moving (change every 0.5s while moving)
      if (isMovingRef.current && !isDotMode) {
        if (timeRef.current - textChangeTimeRef.current > 0.5) {
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          textChangeTimeRef.current = timeRef.current;
        }
      }

      // Draw trail particles first (behind cursor)
      ctx.save();
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy += 0.1; // Gravity
        p.rotation += p.rotationSpeed;

        if (p.life > p.maxLife) return false;

        const lifeRatio = 1 - p.life / p.maxLife;
        const alpha = lifeRatio * 0.8;
        const size = 10 * p.scale * lifeRatio;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${size}px "Geist Mono", monospace`;
        ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        return true;
      });
      ctx.restore();

      // Main cursor - dot mode or text mode
      if (mx > 0 && my > 0) {
        const glitchLevel = glitchIntensityRef.current;

        if (isDotMode) {
          // DOT MODE - simple elegant dot with effects
          const baseDotSize = isHovering ? 20 : 8;
          const pulse = Math.sin(timeRef.current * 4) * (isHovering ? 4 : 1);
          const dotSize = baseDotSize + pulse;

          // Draw multiple layers for glitch effect when moving fast
          const layers = glitchLevel > 0.3 ? 3 : 1;

          for (let i = 0; i < layers; i++) {
            ctx.save();

            const offsetX = i === 0 ? 0 : (Math.random() - 0.5) * glitchLevel * 8;
            const offsetY = i === 0 ? 0 : (Math.random() - 0.5) * glitchLevel * 8;

            let layerColor = color;
            if (i === 1) layerColor = "#ff0000";
            if (i === 2) layerColor = "#00ffff";

            const alpha = i === 0 ? 1 : 0.5;

            // Main dot
            ctx.beginPath();
            ctx.arc(mx + offsetX, my + offsetY, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `${layerColor}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
            ctx.fill();

            // Outer ring (subtle)
            if (i === 0) {
              ctx.beginPath();
              ctx.arc(mx, my, dotSize + 8 + pulse * 0.5, 0, Math.PI * 2);
              ctx.strokeStyle = `${color}30`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            ctx.restore();
          }
        } else {
          // TEXT MODE - glitchy text cursor
          let displayText = texts[textIndexRef.current] || texts[0] || "";

          // Apply glitch to text based on movement speed
          if (glitchLevel > 0.2 && displayText) {
            displayText = displayText.split("").map(char => {
              if (Math.random() < glitchLevel * 0.5) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              return char;
            }).join("");
          }

          // Size based on hover state
          const baseSize = isHovering ? 18 : 12;
          const size = baseSize + Math.sin(timeRef.current * 8) * (isHovering ? 3 : 1);

          // Draw multiple offset layers for glitch effect
          const layers = glitchLevel > 0.3 ? 3 : 1;

          for (let i = 0; i < layers; i++) {
            ctx.save();

            // Offset for glitch layers
            const offsetX = i === 0 ? 0 : (Math.random() - 0.5) * glitchLevel * 10;
            const offsetY = i === 0 ? 0 : (Math.random() - 0.5) * glitchLevel * 10;

            // Different colors for glitch layers (RGB split effect)
            let layerColor = color;
            if (i === 1) layerColor = "#ff0000";
            if (i === 2) layerColor = "#00ffff";

            const alpha = i === 0 ? 1 : 0.5;

            ctx.translate(mx + offsetX, my + offsetY);

            // Rotate slightly based on velocity
            const rotation = Math.atan2(velocityRef.current.y, velocityRef.current.x) * 0.1 * glitchLevel;
            ctx.rotate(rotation);

            ctx.font = `bold ${size}px "Geist Mono", monospace`;
            ctx.fillStyle = `${layerColor}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Draw text
            ctx.fillText(displayText, 0, 0);

            // Add scanlines effect on hover
            if (isHovering && i === 0) {
              ctx.fillStyle = `${color}10`;
              for (let line = -size; line < size; line += 3) {
                ctx.fillRect(-50, line, 100, 1);
              }
            }

            ctx.restore();
          }
        }

        // Draw outer ring/orbit when hovering
        if (isHovering) {
          const ringRadius = 35 + Math.sin(timeRef.current * 4) * 5;

          ctx.save();
          ctx.translate(mx, my);

          // Rotating dashed ring
          ctx.beginPath();
          ctx.setLineDash([8, 8]);
          ctx.lineDashOffset = -timeRef.current * 50;
          ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}60`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Corner brackets
          const bracketSize = 12;
          const bracketOffset = ringRadius + 8;
          ctx.setLineDash([]);
          ctx.strokeStyle = `${color}aa`;
          ctx.lineWidth = 2;

          // Top-left bracket
          ctx.beginPath();
          ctx.moveTo(-bracketOffset, -bracketOffset + bracketSize);
          ctx.lineTo(-bracketOffset, -bracketOffset);
          ctx.lineTo(-bracketOffset + bracketSize, -bracketOffset);
          ctx.stroke();

          // Top-right bracket
          ctx.beginPath();
          ctx.moveTo(bracketOffset - bracketSize, -bracketOffset);
          ctx.lineTo(bracketOffset, -bracketOffset);
          ctx.lineTo(bracketOffset, -bracketOffset + bracketSize);
          ctx.stroke();

          // Bottom-left bracket
          ctx.beginPath();
          ctx.moveTo(-bracketOffset, bracketOffset - bracketSize);
          ctx.lineTo(-bracketOffset, bracketOffset);
          ctx.lineTo(-bracketOffset + bracketSize, bracketOffset);
          ctx.stroke();

          // Bottom-right bracket
          ctx.beginPath();
          ctx.moveTo(bracketOffset - bracketSize, bracketOffset);
          ctx.lineTo(bracketOffset, bracketOffset);
          ctx.lineTo(bracketOffset, bracketOffset - bracketSize);
          ctx.stroke();

          ctx.restore();
        }

        // Crosshair/target lines (subtle) - only in text mode
        if (!isHovering && !isDotMode) {
          const lineLength = 15 + glitchLevel * 10;
          const gap = 8;

          ctx.strokeStyle = `${color}40`;
          ctx.lineWidth = 1;

          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(mx - lineLength, my);
          ctx.lineTo(mx - gap, my);
          ctx.moveTo(mx + gap, my);
          ctx.lineTo(mx + lineLength, my);
          ctx.stroke();

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(mx, my - lineLength);
          ctx.lineTo(mx, my - gap);
          ctx.moveTo(mx, my + gap);
          ctx.lineTo(mx, my + lineLength);
          ctx.stroke();
        }
      }

      // Decay glitch intensity
      glitchIntensityRef.current *= 0.95;

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
  }, [enabled, currentSection, detectSection, checkHovering]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
