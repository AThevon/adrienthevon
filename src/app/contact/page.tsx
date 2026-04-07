"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useDeviceDetect } from "@/hooks";

const ParticleNetwork = dynamic(
  () => import("@/components/effects/ParticleNetwork"),
  { ssr: false }
);

// Email split to avoid scraping from source
const E_USER = "athevon.pro";
const E_DOMAIN = "gmail.com";
function getEmail() { return `${E_USER}@${E_DOMAIN}`; }

// --- Canvas-rendered email (never in DOM, anti-scraping) ---
function CanvasEmail({ onClick, isHovered }: { onClick: () => void; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const email = getEmail();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Measure text to size canvas
    const fontSize = window.innerWidth < 768 ? 24 : window.innerWidth < 1024 ? 36 : 44;
    ctx.font = `700 ${fontSize}px var(--font-display), Georgia, serif`;
    const metrics = ctx.measureText(email);
    const textW = Math.ceil(metrics.width) + 8;
    const textH = fontSize * 1.4;

    canvas.width = textW * dpr;
    canvas.height = textH * dpr;
    canvas.style.width = `${textW}px`;
    canvas.style.height = `${textH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Draw
    ctx.clearRect(0, 0, textW, textH);
    ctx.font = `700 ${fontSize}px var(--font-display), Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = isHovered ? "#ffaa00" : "#e8e8e8";
    ctx.fillText(email, textW / 2, textH / 2);
    drawnRef.current = true;
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      data-cursor="hover"
      className="cursor-pointer transition-opacity"
      style={{ maxWidth: "90vw" }}
      aria-label="Email address - click to copy"
    />
  );
}

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/AThevon",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/adrien-thevon-74b134100",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// --- Bouncing Toast ---
function BouncingToast({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = 220;
    const h = 48;

    // Start from center-top, launch in random direction
    const angle = -Math.PI / 4 + Math.random() * -Math.PI / 2; // upward-ish
    const speed = 12 + Math.random() * 6;
    posRef.current = {
      x: vw / 2 - w / 2,
      y: vh / 2 - h / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
    startRef.current = performance.now();

    const GRAVITY = 0.15;
    const DAMPING = 0.75;
    const FRICTION = 0.995;
    const SETTLE_THRESHOLD = 0.8;
    const DURATION = 3000;

    function tick(now: number) {
      const p = posRef.current;
      const elapsed = now - startRef.current;

      if (elapsed > DURATION) {
        onDone();
        return;
      }

      // Physics
      p.vy += GRAVITY;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * DAMPING; }
      if (p.x + w > vw) { p.x = vw - w; p.vx = -Math.abs(p.vx) * DAMPING; }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * DAMPING; }
      if (p.y + h > vh) { p.y = vh - h; p.vy = -Math.abs(p.vy) * DAMPING; }

      // Check if settled
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < SETTLE_THRESHOLD && elapsed > 800) {
        // Settled - stay for remaining time
        p.vx = 0;
        p.vy = 0;
      }

      if (el) {
        el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        // Fade out in last 500ms
        const fadeStart = DURATION - 500;
        if (elapsed > fadeStart) {
          el.style.opacity = String(1 - (elapsed - fadeStart) / 500);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onDone]);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-[100] pointer-events-none"
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0a0a0a] border border-[#ffaa00] font-mono text-sm">
        {/* Checkmark */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#ffaa00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[#ffaa00] tracking-wider text-xs uppercase">Copied</span>
        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffaa00] origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </div>
    </div>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const { isMobile, isHydrated } = useDeviceDetect();
  const [copied, setCopied] = useState(false);

  const [emailHovered, setEmailHovered] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getEmail());
      setCopied(true);
    } catch {
      // Fallback
    }
  }, []);

  const handleToastDone = useCallback(() => {
    setCopied(false);
  }, []);

  return (
    <main
      data-cursor-mode="contact"
      className="relative h-dvh overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Particle background - desktop only */}
      {isHydrated && !isMobile && <ParticleNetwork />}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-2xl w-full">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="w-8 h-px bg-[#ffaa00]" />
          <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase">
            06 - {t("title")}
          </span>
          <span className="w-8 h-px bg-[#ffaa00]" />
        </motion.div>

        {/* Email - canvas rendered (anti-scraping) */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
        >
          <CanvasEmail onClick={handleCopy} isHovered={emailHovered} />
          <span className={`font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-150 ${emailHovered ? "text-[#666]" : "text-[#444]"}`}>
            Click to copy
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="w-16 h-px bg-[#222]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />

        {/* Social links */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group flex items-center gap-2 px-4 py-2 border border-[#222] font-mono text-xs text-[#888] uppercase tracking-[0.15em] transition-all duration-150 hover:border-[#ffaa00] hover:text-[#ffaa00]"
            >
              <span className="transition-colors duration-150 text-[#666] group-hover:text-[#ffaa00]">
                {link.icon}
              </span>
              {link.name}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bouncing toast */}
      <AnimatePresence>
        {copied && <BouncingToast onDone={handleToastDone} />}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-[#333] tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span>ADRIEN THEVON</span>
        <span>{new Date().getFullYear()}</span>
      </motion.div>
    </main>
  );
}
