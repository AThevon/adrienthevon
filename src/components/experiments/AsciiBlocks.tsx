"use client";

import { useEffect, useRef, useCallback, forwardRef } from "react";
import { COLORS } from "@/lib/constants";

// --- Block physics ---
const ENTRANCE_SCATTER = 80;
const ENTRANCE_SPRING = 0.035;
const ENTRANCE_DAMPING = 0.88;
const DELAY_PER_COL = 0.012;
const POST_SPRING = 0.025;
const POST_DAMPING = 0.92;

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
  onBoundsComputed?: (bounds: { left: number; top: number; right: number; bottom: number }) => void;
}

const AsciiBlocks = forwardRef<HTMLDivElement, AsciiBlocksProps>(function AsciiBlocks({
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
  onBoundsComputed,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunksRef = useRef<ColChunk[]>([]);
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

      onBoundsComputed?.({ left: offsetX, top: offsetY, right: offsetX + gridW, bottom: offsetY + gridH });

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
    },
    [ascii, blockSize, gap, align, verticalAlign, padding, onBoundsComputed]
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

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      if (!hasStartedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const chunks = chunksRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const elapsed = (now - startTimeRef.current) / 1000;
      const entranceEnd = (chunks.length > 0 ? chunks[chunks.length - 1].delay : 0) + 1.5;
      const entranceDone = elapsed > entranceEnd;
      const spring = entranceDone ? POST_SPRING : ENTRANCE_SPRING;
      const damping = entranceDone ? POST_DAMPING : ENTRANCE_DAMPING;
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

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initBlocks, blockSize, mouseRadius, mouseRadiusSq, color, displacedColor]);

  return (
    <div ref={ref} className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent", cursor: "none" }}
        aria-hidden="true"
      />
    </div>
  );
});

export default AsciiBlocks;
