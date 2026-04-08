"use client";

import { useRef, useEffect, useCallback } from "react";
import { projects } from "@/data/projects";
import { COLORS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectTimelineProps {
  scrollProgress: number;
  activeProjectId: string | null;
  onProjectClick: (projectId: string) => void;
  onProjectHover: (projectId: string | null) => void;
  compressed: boolean;
}

interface TimelineNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  projectId: string;
  title: string;
  category: string;
  date: string;
  color: string;
  above: boolean;
  logoImage: HTMLImageElement | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dateToTimestamp(dateStr: string): number {
  return new Date(dateStr + "-01").getTime();
}

function getYearMarkers(): { year: string; fraction: number }[] {
  const timestamps = projects.map((p) => dateToTimestamp(p.date));
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const range = maxT - minT || 1;

  const yearsSet = new Set<string>();
  projects.forEach((p) => yearsSet.add(p.date.slice(0, 4)));
  const years = Array.from(yearsSet).sort();

  return years.map((y) => {
    const t = new Date(`${y}-01-01`).getTime();
    return { year: y, fraction: (t - minT) / range };
  });
}

const yearMarkers = getYearMarkers();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectTimeline({
  activeProjectId,
  onProjectClick,
  onProjectHover,
  compressed,
}: ProjectTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<TimelineNode[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const activeIdRef = useRef<string | null>(activeProjectId);
  const compressedRef = useRef(compressed);

  useEffect(() => {
    activeIdRef.current = activeProjectId;
  }, [activeProjectId]);
  useEffect(() => {
    compressedRef.current = compressed;
  }, [compressed]);

  // -------------------------------------------------------------------
  // Node initialisation
  // -------------------------------------------------------------------

  const initNodes = useCallback((width: number, height: number) => {
    const timestamps = projects.map((p) => dateToTimestamp(p.date));
    const minT = Math.min(...timestamps);
    const maxT = Math.max(...timestamps);
    const range = maxT - minT || 1;

    const padX = width * 0.08;
    const usableW = width - padX * 2;
    const centerY = height / 2;

    // Preserve loaded logo images if nodes already exist
    const existingLogos = new Map<string, HTMLImageElement | null>();
    nodesRef.current.forEach((n) => existingLogos.set(n.projectId, n.logoImage));

    const nodes: TimelineNode[] = projects.map((p, i) => {
      const fraction = (dateToTimestamp(p.date) - minT) / range;
      const baseX = padX + fraction * usableW;
      const above = i % 2 === 0;
      const baseY = centerY + (above ? -80 : 80);

      return {
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: 0,
        vy: 0,
        projectId: p.id,
        title: p.title,
        category: p.category,
        date: p.date,
        color: p.color,
        above,
        logoImage: existingLogos.get(p.id) ?? null,
      };
    });

    return nodes;
  }, []);

  // -------------------------------------------------------------------
  // Load project logos
  // -------------------------------------------------------------------

  useEffect(() => {
    projects.forEach((p) => {
      if (!p.logo) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.logo;
      img.onload = () => {
        const node = nodesRef.current.find((n) => n.projectId === p.id);
        if (node) node.logoImage = img;
      };
    });
  }, []);

  // -------------------------------------------------------------------
  // Resize handler
  // -------------------------------------------------------------------

  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }

      dimensionsRef.current = { width, height };
      nodesRef.current = initNodes(width, height);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [initNodes]);

  // Re-init when compressed changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const timer = setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }

      dimensionsRef.current = { width, height };
      nodesRef.current = initNodes(width, height);
    }, 50);

    return () => clearTimeout(timer);
  }, [compressed, initNodes]);

  // -------------------------------------------------------------------
  // Mouse tracking + hover
  // -------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      const hitRadius = compressedRef.current ? 20 : 35;
      let found: string | null = null;
      for (const node of nodesRef.current) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
          found = node.projectId;
          break;
        }
      }
      onProjectHover(found);
      canvas.style.cursor = found ? "pointer" : "default";
      if (found) {
        canvas.setAttribute("data-cursor", "hover");
      } else {
        canvas.removeAttribute("data-cursor");
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      onProjectHover(null);
      canvas.style.cursor = "default";
      canvas.removeAttribute("data-cursor");
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [onProjectHover]);

  // -------------------------------------------------------------------
  // Click handler
  // -------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hitRadius = compressedRef.current ? 20 : 35;

      for (const node of nodesRef.current) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
          onProjectClick(node.projectId);
          break;
        }
      }
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [onProjectClick]);

  // -------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const currentIdx = nodesRef.current.findIndex(
        (n) => n.projectId === activeIdRef.current
      );
      let nextIdx: number;

      if (e.key === "ArrowLeft") {
        nextIdx = currentIdx <= 0 ? nodesRef.current.length - 1 : currentIdx - 1;
      } else {
        nextIdx = currentIdx >= nodesRef.current.length - 1 ? 0 : currentIdx + 1;
      }

      const next = nodesRef.current[nextIdx];
      if (next) onProjectClick(next.projectId);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onProjectClick]);

  // -------------------------------------------------------------------
  // Animation loop
  // -------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    const BADGE = 48; // iOS badge size normal
    const BADGE_SM = 28; // compressed
    const RADIUS = 12; // border-radius for iOS look
    const RADIUS_SM = 7;

    /** Draw a rounded rect path (iOS badge shape). */
    function roundedRect(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    /** Draw a badge (logo or text fallback) at node position. */
    function drawBadge(node: TimelineNode, size: number, r: number, isActive: boolean) {
      const half = size / 2;
      const bx = node.x - half;
      const by = node.y - half;

      // Glow
      if (isActive) {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 10);
        gradient.addColorStop(0, node.color + "25");
        gradient.addColorStop(1, node.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Background
      roundedRect(bx, by, size, size, r);
      ctx.fillStyle = "#141414";
      ctx.fill();

      // Logo image or text fallback
      if (node.logoImage) {
        ctx.save();
        roundedRect(bx, by, size, size, r);
        ctx.clip();
        ctx.drawImage(node.logoImage, bx, by, size, size);
        ctx.restore();
      } else {
        // Text initials fallback
        ctx.font = `bold ${Math.round(size * 0.35)}px monospace`;
        ctx.fillStyle = node.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const initials = node.title.slice(0, 2);
        ctx.fillText(initials, node.x, node.y);
      }

      // Border
      roundedRect(bx, by, size, size, r);
      ctx.strokeStyle = isActive ? node.color : "#2a2a2a";
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();
    }

    const animate = () => {
      const { width, height } = dimensionsRef.current;

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const isCompressed = compressedRef.current;
      const activeId = activeIdRef.current;
      const centerY = height / 2;
      const padX = width * 0.08;
      const usableW = width - padX * 2;

      if (isCompressed) {
        // ---------------------------------------------------------------
        // COMPRESSED MODE
        // ---------------------------------------------------------------

        nodes.forEach((node, index) => {
          const targetX = padX + (index / Math.max(nodes.length - 1, 1)) * usableW;
          const targetY = centerY;
          node.x += (targetX - node.x) * 0.12;
          node.y += (targetY - node.y) * 0.12;
        });

        // Axis
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX, centerY);
        ctx.lineTo(width - padX, centerY);
        ctx.stroke();

        nodes.forEach((node) => {
          drawBadge(node, BADGE_SM, RADIUS_SM, node.projectId === activeId);
        });
      } else {
        // ---------------------------------------------------------------
        // NORMAL MODE - gentle mouse repulsion + spring return
        // ---------------------------------------------------------------

        nodes.forEach((node) => {
          // Mouse repulsion (gentle, like Journey page)
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repRadius = 100;

          if (dist < repRadius && dist > 0) {
            const force = (1 - dist / repRadius) * 0.15;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }

          // Spring return to base
          node.vx += (node.baseX - node.x) * 0.06;
          node.vy += (node.baseY - node.y) * 0.06;

          // Damping
          node.vx *= 0.88;
          node.vy *= 0.88;

          node.x += node.vx;
          node.y += node.vy;
        });

        // Axis
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX, centerY);
        ctx.lineTo(width - padX, centerY);
        ctx.stroke();

        // Year markers
        yearMarkers.forEach(({ year, fraction }) => {
          const x = padX + Math.max(0, Math.min(1, fraction)) * usableW;
          ctx.beginPath();
          ctx.arc(x, centerY, 3, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.accent;
          ctx.fill();
          ctx.font = "11px monospace";
          ctx.fillStyle = COLORS.accent;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(year, x, centerY + 18);
        });

        // Nodes
        nodes.forEach((node) => {
          const isActive = node.projectId === activeId;

          // Connecting line to axis
          ctx.strokeStyle = isActive ? node.color + "30" : "#1a1a1a";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.x, centerY);
          ctx.stroke();

          const badgeSize = isActive ? BADGE + 6 : BADGE;
          const badgeRadius = isActive ? RADIUS + 2 : RADIUS;
          drawBadge(node, badgeSize, badgeRadius, isActive);

          // Title label
          const labelY = node.above ? node.y - badgeSize / 2 - 14 : node.y + badgeSize / 2 + 18;
          ctx.font = isActive ? "bold 13px monospace" : "13px monospace";
          ctx.fillStyle = isActive ? COLORS.foreground : "#888";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.title, node.x, labelY);

          // Category
          const catY = node.above ? labelY - 16 : labelY + 16;
          ctx.font = "10px monospace";
          ctx.fillStyle = "#444";
          ctx.fillText(node.category, node.x, catY);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
