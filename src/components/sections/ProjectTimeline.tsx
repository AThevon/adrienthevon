"use client";

import { useRef, useEffect, useCallback } from "react";
import { projects } from "@/data/projects";
import { COLORS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectTimelineProps {
  scrollProgress: number; // 0-1 from parent useScroll
  activeProjectId: string | null;
  onProjectClick: (projectId: string) => void;
  onProjectHover: (projectId: string | null) => void;
  compressed: boolean; // true when takeover panel is open
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
  above: boolean; // zigzag above/below axis
}

// ---------------------------------------------------------------------------
// Pre-compute shared-skill adjacency (outside component to run once)
// ---------------------------------------------------------------------------

type AdjacencyMap = Map<string, Map<string, number>>;

function buildAdjacency(): AdjacencyMap {
  const map: AdjacencyMap = new Map();
  for (let i = 0; i < projects.length; i++) {
    const a = projects[i];
    const inner = new Map<string, number>();
    for (let j = 0; j < projects.length; j++) {
      if (i === j) continue;
      const b = projects[j];
      const shared = a.skills.filter((s) => b.skills.includes(s)).length;
      if (shared > 0) inner.set(b.id, shared);
    }
    map.set(a.id, inner);
  }
  return map;
}

const adjacency = buildAdjacency();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse "YYYY-MM" into a timestamp for proportional positioning. */
function dateToTimestamp(dateStr: string): number {
  return new Date(dateStr + "-01").getTime();
}

/** Extract unique years from projects sorted chronologically. */
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

  // Keep refs in sync with props so the rAF loop always has fresh values.
  activeIdRef.current = activeProjectId;
  compressedRef.current = compressed;

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
      };
    });

    return nodes;
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

  // Re-init when compressed changes (height changes -> need new positions)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Small delay to let the style transition settle
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
  // Mouse tracking
  // -------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Hit-test for hover
      const hitRadius = compressedRef.current ? 20 : 30;
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
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      onProjectHover(null);
      canvas.style.cursor = "default";
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
      const hitRadius = compressedRef.current ? 20 : 30;

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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.016;
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

      // -- Compute compressed target positions (even spacing, single line) --
      const compPadX = width * 0.08;
      const compUsableW = width - compPadX * 2;

      if (isCompressed) {
        // ---------------------------------------------------------------
        // COMPRESSED MODE
        // ---------------------------------------------------------------

        nodes.forEach((node, index) => {
          const targetX = compPadX + (index / Math.max(nodes.length - 1, 1)) * compUsableW;
          const targetY = centerY;

          // Smooth interpolation toward target
          node.x += (targetX - node.x) * 0.1;
          node.y += (targetY - node.y) * 0.1;
          node.vx = 0;
          node.vy = 0;
        });

        // Draw axis line
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(compPadX, centerY);
        ctx.lineTo(width - compPadX, centerY);
        ctx.stroke();

        // Draw nodes (compressed)
        nodes.forEach((node) => {
          const isActive = node.projectId === activeId;

          // Active glow
          if (isActive) {
            [20, 14, 8].forEach((radius, i) => {
              const opacity = [0.1, 0.2, 0.35][i];
              const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius
              );
              gradient.addColorStop(0, COLORS.accent + Math.floor(opacity * 255).toString(16).padStart(2, "0"));
              gradient.addColorStop(1, COLORS.accent + "00");
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? COLORS.accent : "#333";
          ctx.fill();
        });
      } else {
        // ---------------------------------------------------------------
        // NORMAL MODE
        // ---------------------------------------------------------------

        // Update physics
        nodes.forEach((node, index) => {
          const isActive = node.projectId === activeId;

          // Floating
          const floatX = Math.sin(time * 0.8 + index) * 5;
          const floatY = Math.cos(time * 0.6 + index * 0.5) * 8;

          // Mouse repulsion
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = isActive ? 180 : 120;

          if (distance < repulsionRadius && distance > 0) {
            const force = (1 - distance / repulsionRadius) * (isActive ? 0.3 : 0.2);
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          }

          // Apply velocity with damping
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.9;
          node.vy *= 0.9;

          // Spring return
          const springForce = 0.05;
          node.vx += (node.baseX + floatX - node.x) * springForce;
          node.vy += (node.baseY + floatY - node.y) * springForce;
        });

        // Draw axis
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.08, centerY);
        ctx.lineTo(width * 0.92, centerY);
        ctx.stroke();

        // Draw year markers
        const padX = width * 0.08;
        const usableW = width - padX * 2;
        const timestamps = projects.map((p) => dateToTimestamp(p.date));
        const minT = Math.min(...timestamps);
        const maxT = Math.max(...timestamps);
        const range = maxT - minT || 1;

        yearMarkers.forEach(({ year, fraction }) => {
          // Clamp fraction to 0-1
          const clampedFraction = Math.max(0, Math.min(1, fraction));
          const markerX = padX + clampedFraction * usableW;

          // Dot
          ctx.beginPath();
          ctx.arc(markerX, centerY, 5, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.accent;
          ctx.fill();

          // Label
          ctx.font = "11px monospace";
          ctx.fillStyle = COLORS.accent;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(year, markerX, centerY + 20);
        });

        // Draw constellation lines (shared skills)
        for (let i = 0; i < nodes.length; i++) {
          const nodeA = nodes[i];
          const neighbors = adjacency.get(nodeA.projectId);
          if (!neighbors) continue;

          for (let j = i + 1; j < nodes.length; j++) {
            const nodeB = nodes[j];
            const sharedCount = neighbors.get(nodeB.projectId);
            if (!sharedCount) continue;

            const aIsActive = nodeA.projectId === activeId;
            const bIsActive = nodeB.projectId === activeId;
            const eitherActive = aIsActive || bIsActive;

            if (eitherActive) {
              // Illuminated line
              const opacity = Math.min(0.6, 0.15 + sharedCount * 0.08);
              ctx.strokeStyle =
                COLORS.accent +
                Math.floor(opacity * 255)
                  .toString(16)
                  .padStart(2, "0");
              ctx.lineWidth = 1;
            } else {
              // Faint background line
              ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
              ctx.lineWidth = 1;
            }

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }

        // Draw nodes (normal)
        nodes.forEach((node) => {
          const isActive = node.projectId === activeId;

          // Connecting line from node to axis
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.x, centerY);
          ctx.stroke();

          // Glow rings for active node
          if (isActive) {
            [30, 22, 14].forEach((radius, i) => {
              const opacity = [0.1, 0.2, 0.35][i];
              const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius
              );
              gradient.addColorStop(
                0,
                COLORS.accent +
                  Math.floor(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")
              );
              gradient.addColorStop(1, COLORS.accent + "00");
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? COLORS.accent : "#333";
          ctx.fill();

          // Title label
          ctx.font = isActive ? "bold 12px monospace" : "12px monospace";
          ctx.fillStyle = isActive ? COLORS.foreground : "#999";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const labelY = node.above ? node.y - 20 : node.y + 20;
          ctx.fillText(node.title, node.x, labelY);

          // Category label
          ctx.font = "9px monospace";
          ctx.fillStyle = "#555";
          ctx.fillText(node.category, node.x, node.above ? labelY - 14 : labelY + 14);
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
      style={{
        width: "100%",
        height: compressed ? "25vh" : "100vh",
        transition: "height 0.25s ease-out",
      }}
    />
  );
}
