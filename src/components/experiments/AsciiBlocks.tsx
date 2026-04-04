"use client";

import { useEffect, useRef, useCallback } from "react";
import { COLORS } from "@/lib/constants";

// --- Block physics ---
const ENTRANCE_SCATTER = 80;
const ENTRANCE_SPRING = 0.035;
const ENTRANCE_DAMPING = 0.88;
const DELAY_PER_COL = 0.012;
const POST_SPRING = 0.025;
const POST_DAMPING = 0.92;

// --- Nav swarm physics ---
const SWARM_SIZE = 25;
const SWARM_SPREAD = 40; // resting spread radius
const SWARM_DOCKED_SPREAD = 12; // contracted when near cursor
const SWARM_BLOCK_SIZE = 4;
const SWARM_DRIFT = 0.15;
const SWARM_DAMPING = 0.985;
const SWARM_ATTRACT_RADIUS = 280; // cursor attraction zone
const SWARM_DOCK_RADIUS = 50; // "docked" distance
const SWARM_ATTRACT_FORCE = 0.008;
const SWARM_REPULSE_RADIUS = 90; // repulse ASCII blocks
const NAV_EDGE_MARGIN = 60;

interface Block {
  x: number; y: number;
  originX: number; originY: number;
  vx: number; vy: number;
  col: number;
}

interface ColChunk {
  blocks: Block[];
  delay: number;
  active: boolean;
}

interface SwarmParticle {
  x: number; y: number;
  vx: number; vy: number;
  offsetAngle: number;
  offsetRadius: number;
  phase: number; // for breathing
}

interface NavSwarm {
  key: string;
  label: string;
  number: string;
  href: string;
  // Center position
  cx: number; cy: number;
  vx: number; vy: number;
  rotation: number;
  rotationV: number;
  particles: SwarmParticle[];
  // State
  docked: boolean;
  attractT: number; // 0=idle, 1=fully attracted (smooth transition)
  labelWidth: number;
  labelHeight: number;
}

interface AsciiBlocksProps {
  ascii: string;
  blockSize?: number;
  gap?: number;
  color?: string;
  displacedColor?: string;
  mouseRadius?: number;
  paused?: boolean;
  align?: "center" | "left" | "right";
  verticalAlign?: "center" | "top" | "bottom";
  padding?: number;
  navItems?: Array<{ key: string; label: string; number: string; href: string }>;
  onNavClick?: (href: string) => void;
}

export default function AsciiBlocks({
  ascii,
  blockSize = 6,
  gap = 1,
  color = COLORS.foreground,
  displacedColor = COLORS.accent,
  mouseRadius = 120,
  paused = false,
  align = "center",
  verticalAlign = "center",
  padding = 0,
  navItems,
  onNavClick,
}: AsciiBlocksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunksRef = useRef<ColChunk[]>([]);
  const swarmsRef = useRef<NavSwarm[]>([]);
  const resolvedBlockSizeRef = useRef(blockSize);
  const resolvedSubHRef = useRef(Math.floor(blockSize / 2));
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const pausedRef = useRef(paused);
  const hasStartedRef = useRef(false);
  const mouseRadiusSq = mouseRadius * mouseRadius;

  useEffect(() => {
    const wasPaused = pausedRef.current;
    pausedRef.current = paused;
    if (wasPaused && !paused) {
      startTimeRef.current = performance.now();
      hasStartedRef.current = true;
      for (const chunk of chunksRef.current) chunk.active = false;
    }
    if (!paused && !wasPaused) hasStartedRef.current = true;
  }, [paused]);

  const initBlocks = useCallback(
    (canvasW: number, canvasH: number) => {
      const lines = ascii.split("\n");
      if (lines.length === 0) return;

      const maxCols = Math.max(...lines.map((l) => l.length));
      const totalRows = lines.length;

      const targetW = canvasW * 0.55;
      const targetH = canvasH * 0.6;
      const fitByWidth = Math.floor(targetW / maxCols) - gap;
      const fitByHeight = Math.floor(targetH / totalRows) - gap;
      const cellW = Math.max(blockSize, Math.min(fitByWidth, fitByHeight));
      const subH = Math.floor(cellW / 2);
      resolvedBlockSizeRef.current = cellW;
      resolvedSubHRef.current = subH;

      const fullCellH = subH * 2 + gap;
      const gridW = maxCols * (cellW + gap);
      const gridH = totalRows * fullCellH;

      const offsetX = align === "left" ? padding
        : align === "right" ? canvasW - gridW - padding
        : (canvasW - gridW) / 2;
      const offsetY = verticalAlign === "top" ? padding
        : verticalAlign === "bottom" ? canvasH - gridH - padding
        : (canvasH - gridH) / 2;

      const colMap = new Map<number, Block[]>();
      const addBlock = (x: number, y: number, col: number) => {
        const angle = Math.random() * Math.PI * 2;
        const scatter = ENTRANCE_SCATTER * (0.5 + Math.random());
        const block: Block = {
          x: x + Math.cos(angle) * scatter,
          y: y + Math.sin(angle) * scatter,
          originX: x, originY: y, vx: 0, vy: 0, col,
        };
        const arr = colMap.get(col);
        if (arr) arr.push(block); else colMap.set(col, [block]);
      };

      for (let row = 0; row < lines.length; row++) {
        const line = lines[row];
        for (let col = 0; col < line.length; col++) {
          const char = line[col];
          if (char === " ") continue;
          const x = offsetX + col * (cellW + gap);
          const yTop = offsetY + row * fullCellH;
          const yBot = yTop + subH + gap;
          if (char === "\u2584") addBlock(x, yBot, col);
          else if (char === "\u2580") addBlock(x, yTop, col);
          else { addBlock(x, yTop, col); addBlock(x, yBot, col); }
        }
      }

      const chunks: ColChunk[] = [];
      const sortedCols = [...colMap.keys()].sort((a, b) => a - b);
      for (const col of sortedCols) {
        chunks.push({ blocks: colMap.get(col)!, delay: col * DELAY_PER_COL, active: false });
      }
      chunksRef.current = chunks;
      startTimeRef.current = performance.now();

      // Init nav swarms
      if (navItems && navItems.length > 0) {
        const measureCtx = document.createElement("canvas").getContext("2d");
        const monoFont = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
        const fontSize = 16;
        const font = `700 ${fontSize}px ${monoFont}`;

        const swarms: NavSwarm[] = navItems.map((item, i) => {
          let textW = fontSize * item.label.length * 0.6;
          if (measureCtx) {
            measureCtx.font = font;
            textW = measureCtx.measureText(item.label.toUpperCase()).width;
          }

          // Spawn spread across the right portion
          const spawnX = canvasW * 0.5 + Math.random() * canvasW * 0.35;
          const spawnY = canvasH * 0.12 + (i / navItems.length) * canvasH * 0.65 + (Math.random() - 0.5) * 50;

          // Create swarm particles
          const particles: SwarmParticle[] = [];
          for (let p = 0; p < SWARM_SIZE; p++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * SWARM_SPREAD;
            particles.push({
              x: spawnX + Math.cos(angle) * radius,
              y: spawnY + Math.sin(angle) * radius,
              vx: 0, vy: 0,
              offsetAngle: angle,
              offsetRadius: radius,
              phase: Math.random() * Math.PI * 2,
            });
          }

          const driftAngle = Math.random() * Math.PI * 2;
          return {
            ...item,
            cx: spawnX, cy: spawnY,
            vx: Math.cos(driftAngle) * SWARM_DRIFT,
            vy: Math.sin(driftAngle) * SWARM_DRIFT,
            rotation: (Math.random() - 0.5) * 6,
            rotationV: (Math.random() - 0.5) * 0.05,
            particles,
            docked: false,
            attractT: 0,
            labelWidth: textW,
            labelHeight: fontSize,
          };
        });
        swarmsRef.current = swarms;
      }
    },
    [ascii, blockSize, gap, align, verticalAlign, padding, navItems]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0;

    const setupCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return false;
      dpr = Math.min(window.devicePixelRatio, 2);
      const rect = parent.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (w <= 0 || h <= 0) return false;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const resize = () => { if (setupCanvas()) initBlocks(w, h); };
    if (setupCanvas()) initBlocks(w, h);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(resize, 150); };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= w && y >= 0 && y <= h) {
        mouseRef.current.x = x; mouseRef.current.y = y;
      } else {
        mouseRef.current.x = -1000; mouseRef.current.y = -1000;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Check docked swarms first, then any swarm nearby
      const swarms = swarmsRef.current;
      for (const s of swarms) {
        if (!s.docked) continue;
        const dx = x - s.cx, dy = y - s.cy;
        if (Math.sqrt(dx * dx + dy * dy) < SWARM_DOCK_RADIUS + 20) {
          onNavClick?.(s.href);
          return;
        }
      }
      // Fallback: click near any swarm center
      for (const s of swarms) {
        const dx = x - s.cx, dy = y - s.cy;
        if (Math.sqrt(dx * dx + dy * dy) < 60) {
          onNavClick?.(s.href);
          return;
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("click", handleClick);

    const monoFont = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    const navFontSize = 16;
    const navFont = `700 ${navFontSize}px ${monoFont}`;
    const navNumFont = `400 ${navFontSize * 0.65}px ${monoFont}`;

    const animate = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      if (!hasStartedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const chunks = chunksRef.current;
      const swarms = swarmsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const elapsed = (now - startTimeRef.current) / 1000;
      const entranceEnd = (chunks.length > 0 ? chunks[chunks.length - 1].delay : 0) + 1.5;
      const entranceDone = elapsed > entranceEnd;
      const spring = entranceDone ? POST_SPRING : ENTRANCE_SPRING;
      const damping = entranceDone ? POST_DAMPING : ENTRANCE_DAMPING;
      const time = now * 0.001;

      // ============ SWARM PHYSICS ============
      for (let s = 0; s < swarms.length; s++) {
        const sw = swarms[s];

        // Distance to cursor
        const dcx = mx - sw.cx;
        const dcy = my - sw.cy;
        const cursorDist = Math.sqrt(dcx * dcx + dcy * dcy);

        // Magnetic attraction toward cursor
        if (cursorDist < SWARM_ATTRACT_RADIUS && cursorDist > 1) {
          const attractForce = SWARM_ATTRACT_FORCE * (1 - cursorDist / SWARM_ATTRACT_RADIUS);
          sw.vx += (dcx / cursorDist) * attractForce * cursorDist;
          sw.vy += (dcy / cursorDist) * attractForce * cursorDist;
        }

        // Dock state
        sw.docked = cursorDist < SWARM_DOCK_RADIUS;

        // Smooth attract transition
        const targetT = cursorDist < SWARM_ATTRACT_RADIUS ? Math.min(1, 1 - cursorDist / SWARM_ATTRACT_RADIUS + 0.2) : 0;
        sw.attractT += (targetT - sw.attractT) * 0.06;

        // Edge bounce
        if (sw.cx < NAV_EDGE_MARGIN) { sw.vx += 0.3; sw.cx = NAV_EDGE_MARGIN; }
        if (sw.cx > w - NAV_EDGE_MARGIN) { sw.vx -= 0.3; sw.cx = w - NAV_EDGE_MARGIN; }
        if (sw.cy < NAV_EDGE_MARGIN) { sw.vy += 0.3; sw.cy = NAV_EDGE_MARGIN; }
        if (sw.cy > h - NAV_EDGE_MARGIN) { sw.vy -= 0.3; sw.cy = h - NAV_EDGE_MARGIN; }

        // Swarm-swarm repulsion
        for (let o = s + 1; o < swarms.length; o++) {
          const other = swarms[o];
          const dx = other.cx - sw.cx;
          const dy = other.cy - sw.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 120;
          if (dist < minDist && dist > 0) {
            const f = (minDist - dist) / minDist * 0.3;
            sw.vx -= (dx / dist) * f;
            sw.vy -= (dy / dist) * f;
            other.vx += (dx / dist) * f;
            other.vy += (dy / dist) * f;
          }
        }

        // Random drift
        if (Math.random() < 0.004) {
          sw.vx += (Math.random() - 0.5) * SWARM_DRIFT * 3;
          sw.vy += (Math.random() - 0.5) * SWARM_DRIFT * 3;
        }

        sw.vx *= SWARM_DAMPING;
        sw.vy *= SWARM_DAMPING;
        sw.cx += sw.vx;
        sw.cy += sw.vy;

        // Rotation
        sw.rotationV *= 0.97;
        if (Math.random() < 0.003) sw.rotationV += (Math.random() - 0.5) * 0.04;
        sw.rotation += sw.rotationV;
        sw.rotation = Math.max(-10, Math.min(10, sw.rotation));

        // Particle physics - orbit around center
        const spread = SWARM_SPREAD + (SWARM_DOCKED_SPREAD - SWARM_SPREAD) * sw.attractT;
        for (let p = 0; p < sw.particles.length; p++) {
          const pt = sw.particles[p];
          // Target: orbit position around swarm center
          const breathe = Math.sin(time * 0.8 + pt.phase) * 0.15 + 1;
          const targetR = pt.offsetRadius / SWARM_SPREAD * spread * breathe;
          const orbitalSpeed = 0.1 + sw.attractT * 0.3;
          pt.offsetAngle += orbitalSpeed * 0.01;
          const targetX = sw.cx + Math.cos(pt.offsetAngle) * targetR;
          const targetY = sw.cy + Math.sin(pt.offsetAngle) * targetR;

          pt.vx += (targetX - pt.x) * 0.04;
          pt.vy += (targetY - pt.y) * 0.04;
          pt.vx *= 0.9;
          pt.vy *= 0.9;
          pt.x += pt.vx;
          pt.y += pt.vy;
        }
      }

      // ============ BLOCK PHYSICS ============
      for (let c = 0; c < chunks.length; c++) {
        const chunk = chunks[c];
        if (!chunk.active) {
          if (elapsed < chunk.delay) continue;
          chunk.active = true;
        }

        const blocks = chunk.blocks;
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];

          // Mouse repulsion
          const dx = mx - b.x;
          const dy = my - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (mouseRadius - dist) / mouseRadius;
            const invDist = 1 / (dist || 1);
            b.vx -= dx * invDist * force * 25;
            b.vy -= dy * invDist * force * 25;
          }

          // Swarm repulsion on blocks
          for (let s = 0; s < swarms.length; s++) {
            const sw = swarms[s];
            const sdx = sw.cx - b.x;
            const sdy = sw.cy - b.y;
            const sdSq = sdx * sdx + sdy * sdy;
            const repR = SWARM_REPULSE_RADIUS;
            if (sdSq < repR * repR) {
              const sdist = Math.sqrt(sdSq);
              const sforce = (repR - sdist) / repR;
              const sinv = 1 / (sdist || 1);
              b.vx -= sdx * sinv * sforce * 18;
              b.vy -= sdy * sinv * sforce * 18;
              // Reaction on swarm
              sw.vx += sdx * sinv * sforce * 0.15;
              sw.vy += sdy * sinv * sforce * 0.15;
            }
          }

          // Jitter
          const dispX = b.x - b.originX;
          const dispY = b.y - b.originY;
          const dispDist = Math.sqrt(dispX * dispX + dispY * dispY);
          if (dispDist > 3) {
            const jitterAmp = Math.min(dispDist * 0.12, 6);
            if (Math.random() < 0.008) {
              b.vx += (Math.random() - 0.5) * jitterAmp;
              b.vy += (Math.random() - 0.5) * jitterAmp;
            }
          }

          b.vx += (b.originX - b.x) * spring;
          b.vy += (b.originY - b.y) * spring;
          b.vx *= damping;
          b.vy *= damping;
          b.x += b.vx;
          b.y += b.vy;
        }
      }

      // ============ RENDER BLOCKS ============
      const bw = resolvedBlockSizeRef.current;
      const bh = resolvedSubHRef.current;

      ctx.fillStyle = color;
      for (let c = 0; c < chunks.length; c++) {
        if (!chunks[c].active) continue;
        const blocks = chunks[c].blocks;
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          const dx = b.x - b.originX;
          const dy = b.y - b.originY;
          if (dx * dx + dy * dy <= 25) ctx.fillRect(b.x, b.y, bw, bh);
        }
      }

      ctx.fillStyle = displacedColor;
      for (let c = 0; c < chunks.length; c++) {
        if (!chunks[c].active) continue;
        const blocks = chunks[c].blocks;
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          const dx = b.x - b.originX;
          const dy = b.y - b.originY;
          const dd = dx * dx + dy * dy;
          if (dd > 25) {
            const dist = Math.sqrt(dd);
            const sf = 1 + Math.min(dist / 80, 1.5);
            const sw2 = bw * sf;
            const sh = bh * sf;
            ctx.fillRect(b.x - (sw2 - bw) / 2, b.y - (sh - bh) / 2, sw2, sh);
          }
        }
      }

      // ============ RENDER SWARMS ============
      for (let s = 0; s < swarms.length; s++) {
        const sw = swarms[s];
        const t = sw.attractT;

        // Swarm particles
        const particleAlpha = 0.15 + t * 0.5;
        const pSize = SWARM_BLOCK_SIZE * (1 - t * 0.3);
        ctx.fillStyle = `rgba(255, 170, 0, ${particleAlpha})`;
        for (let p = 0; p < sw.particles.length; p++) {
          const pt = sw.particles[p];
          ctx.fillRect(pt.x - pSize / 2, pt.y - pSize / 2, pSize, pSize);
        }

        // Dock ring when close
        if (sw.docked) {
          ctx.strokeStyle = `rgba(255, 170, 0, ${0.3 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sw.cx, sw.cy, SWARM_DOCKED_SPREAD + 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label text
        ctx.save();
        ctx.translate(sw.cx, sw.cy);
        const labelRotation = sw.rotation * (1 - t * 0.8); // flatten rotation when attracted
        ctx.rotate((labelRotation * Math.PI) / 180);

        // Label opacity: dim when idle, bright when attracted
        const labelAlpha = 0.2 + t * 0.8;
        ctx.font = navFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = sw.docked
          ? COLORS.accent
          : `rgba(232, 232, 232, ${labelAlpha})`;
        ctx.fillText(sw.label.toUpperCase(), 0, 1);

        // Number
        const lw = ctx.measureText(sw.label.toUpperCase()).width;
        ctx.font = navNumFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(255, 170, 0, ${0.1 + t * 0.4})`;
        ctx.fillText(sw.number, lw / 2 + 5, -navFontSize / 2 - 3);

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      clearTimeout(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initBlocks, blockSize, mouseRadius, mouseRadiusSq, color, displacedColor, onNavClick]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent", cursor: "none" }}
      aria-hidden="true"
    />
  );
}
