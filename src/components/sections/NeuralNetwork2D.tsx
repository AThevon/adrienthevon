"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { getSkillsUsedInProjects, skillCategories, type Skill } from "@/data/skills";
import { getProjectById, type Project } from "@/data/projects";
import { getSkillLogoUrl, getSkillLogoColor, preloadSkillLogos } from "@/lib/skillLogos";

// Helper to convert kebab-case to camelCase for i18n keys
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

interface SkillNode {
  skill: Skill;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  logoUrl: string;
  logoImage: HTMLImageElement | null;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

export default function NeuralNetwork2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Map<string, SkillNode>>(new Map());
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("skills");
  const tProject = useTranslations("projectsData");

  const selectedSkill = selectedSkillId
    ? (() => {
        const skill = getSkillsUsedInProjects().find((s) => s.id === selectedSkillId);
        return skill ? { ...skill, color: skillCategories[skill.category].color } : null;
      })()
    : null;

  // Initialize nodes and connections
  useEffect(() => {
    const skills = getSkillsUsedInProjects();
    const canvas = canvasRef.current;
    if (!canvas || skills.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create nodes with initial random positions in center area
    const nodes = new Map<string, SkillNode>();
    skills.forEach((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      const logoUrl = getSkillLogoUrl(skill.id);

      nodes.set(skill.id, {
        skill,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0,
        targetX: centerX,
        targetY: centerY,
        radius: 35,
        color: skillCategories[skill.category].color,
        logoUrl,
        logoImage: null,
      });
    });

    nodesRef.current = nodes;

    // Create connections based on skill relationships
    const connections: Connection[] = [];
    skills.forEach((skill) => {
      skill.connections.forEach((connectedId) => {
        if (nodes.has(connectedId)) {
          connections.push({
            from: skill.id,
            to: connectedId,
            strength: 0.5,
          });
        }
      });
    });

    connectionsRef.current = connections;

    // Preload all logos
    preloadSkillLogos(skills.map((s) => s.id)).then(() => {
      // Load images into nodes
      nodes.forEach((node) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = node.logoUrl;
        img.onload = () => {
          node.logoImage = img;
        };
      });
      setIsLoading(false);
    });
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleClick = () => {
      const hoveredId = hoveredNodeRef.current;
      if (hoveredId) {
        setSelectedSkillId((prev) => (prev === hoveredId ? null : hoveredId));
      } else {
        setSelectedSkillId(null);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const animate = () => {
      frame++;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const mouse = mouseRef.current;

      // Check hovered node
      let currentHovered: string | null = null;
      nodes.forEach((node, id) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius) {
          currentHovered = id;
        }
      });
      hoveredNodeRef.current = currentHovered;

      // Update node positions based on mode
      if (selectedSkillId) {
        // FOCUS MODE: Selected node in center, connected in orbit, others fade
        const selectedNode = nodes.get(selectedSkillId);
        if (selectedNode) {
          const connectedIds = new Set([
            ...selectedNode.skill.connections,
            ...connections
              .filter((c) => c.to === selectedSkillId)
              .map((c) => c.from),
          ]);

          nodes.forEach((node, id) => {
            if (id === selectedSkillId) {
              // Selected: move to center
              node.targetX = centerX;
              node.targetY = centerY;
            } else if (connectedIds.has(id)) {
              // Connected: orbit around selected (slow rotation)
              const orbitIndex = Array.from(connectedIds).indexOf(id);
              const orbitCount = connectedIds.size;
              const angle = (orbitIndex / orbitCount) * Math.PI * 2 + frame * 0.002;
              const orbitRadius = Math.min(width, height) * 0.25;
              node.targetX = centerX + Math.cos(angle) * orbitRadius;
              node.targetY = centerY + Math.sin(angle) * orbitRadius;
            } else {
              // Others: push away
              const angle = Math.atan2(node.y - centerY, node.x - centerX);
              node.targetX = centerX + Math.cos(angle) * width * 0.8;
              node.targetY = centerY + Math.sin(angle) * height * 0.8;
            }
          });
        }
      } else {
        // IDLE MODE: Force-directed layout
        nodes.forEach((node, id) => {
          let fx = 0;
          let fy = 0;

          // Check if node is too far from center (was pushed away)
          const distFromCenter = Math.sqrt(
            Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
          );
          const maxRadius = Math.min(width, height) * 0.4;

          if (distFromCenter > maxRadius) {
            // Strong pull back to center if too far
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            fx += (dx / dist) * 5;
            fy += (dy / dist) * 5;
          } else {
            // Normal force-directed behavior

            // Repulsion from other nodes
            nodes.forEach((other, otherId) => {
              if (id === otherId) return;
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 200) {
                const force = (200 - distance) / 200;
                fx += (dx / distance) * force * 2;
                fy += (dy / distance) * force * 2;
              }
            });

            // Attraction to connected nodes
            connections.forEach((conn) => {
              if (conn.from === id || conn.to === id) {
                const otherId = conn.from === id ? conn.to : conn.from;
                const other = nodes.get(otherId);
                if (!other) return;

                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = (distance - 150) / 150;
                fx += (dx / distance) * force * 0.5;
                fy += (dy / distance) * force * 0.5;
              }
            });

            // Attraction to center
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            fx += dx * 0.001;
            fy += dy * 0.001;
          }

          node.vx += fx;
          node.vy += fy;
          node.vx *= 0.8; // Damping
          node.vy *= 0.8;

          node.targetX = node.x + node.vx;
          node.targetY = node.y + node.vy;

          // Keep in bounds
          node.targetX = Math.max(node.radius, Math.min(width - node.radius, node.targetX));
          node.targetY = Math.max(node.radius, Math.min(height - node.radius, node.targetY));
        });
      }

      // Smooth interpolation to target positions
      nodes.forEach((node) => {
        node.x += (node.targetX - node.x) * 0.1;
        node.y += (node.targetY - node.y) * 0.1;
      });

      // Draw connections
      connections.forEach((conn) => {
        const from = nodes.get(conn.from);
        const to = nodes.get(conn.to);
        if (!from || !to) return;

        const isConnectedToSelected =
          selectedSkillId && (conn.from === selectedSkillId || conn.to === selectedSkillId);
        const isHoveredConnection =
          currentHovered && (conn.from === currentHovered || conn.to === currentHovered);

        let opacity = 0.1;
        let width = 1;
        if (selectedSkillId) {
          opacity = isConnectedToSelected ? 0.6 : 0.02;
          width = isConnectedToSelected ? 2 : 0.5;
        } else if (isHoveredConnection) {
          opacity = 0.4;
          width = 2;
        }

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = width;
        ctx.stroke();

        // Draw particle on connection if selected/hovered
        if ((isConnectedToSelected || isHoveredConnection) && opacity > 0.2) {
          const progress = (frame * 0.02) % 1;
          const px = from.x + (to.x - from.x) * progress;
          const py = from.y + (to.y - from.y) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = from.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = from.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw nodes
      nodes.forEach((node, id) => {
        const isSelected = id === selectedSkillId;
        const isConnected =
          selectedSkillId &&
          (node.skill.connections.includes(selectedSkillId) ||
            connections.some(
              (c) =>
                (c.from === selectedSkillId && c.to === id) ||
                (c.to === selectedSkillId && c.from === id)
            ));
        const isHovered = id === currentHovered;
        const isFaded = selectedSkillId && !isSelected && !isConnected;

        let opacity = 1;
        let scale = 1;

        if (isFaded) {
          opacity = 0.1;
          scale = 0.5;
        } else if (isSelected) {
          opacity = 1;
          scale = 1.3;
        } else if (isHovered) {
          opacity = 1;
          scale = 1.1;
        }

        const radius = node.radius * scale;

        // Draw glow
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 10, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            radius,
            node.x,
            node.y,
            radius + 10
          );
          gradient.addColorStop(0, `${node.color}40`);
          gradient.addColorStop(1, `${node.color}00`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw background circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 10, 10, ${opacity * 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `${node.color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw logo
        if (node.logoImage && node.logoImage.complete) {
          ctx.save();
          ctx.globalAlpha = opacity;
          const logoSize = radius * 1.2;
          ctx.drawImage(
            node.logoImage,
            node.x - logoSize / 2,
            node.y - logoSize / 2,
            logoSize,
            logoSize
          );
          ctx.restore();
        }

        // Draw label on hover/select
        if ((isHovered || isSelected) && !isFaded) {
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.font = "12px 'Geist Mono', monospace";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(node.skill.name, node.x, node.y + radius + 10);
          ctx.restore();
        }

        // Breathing animation in idle mode
        if (!selectedSkillId && !isHovered) {
          const breath = Math.sin(frame * 0.03 + id.charCodeAt(0)) * 0.05 + 1;
          ctx.save();
          ctx.globalAlpha = opacity * 0.3 * breath;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, selectedSkillId]);

  return (
    <section ref={containerRef} className="fixed top-20 left-0 right-0 bottom-0 w-full overflow-hidden bg-background">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ touchAction: "none" }}
      />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="font-mono text-sm text-muted animate-pulse">
            {t("loading") || "Loading neural network..."}
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 z-10 pointer-events-none"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">{t("title")}</span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
          {t("subtitle").split(" ")[0]}{" "}
          <span className="text-accent">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 right-8 z-10 font-mono text-xs text-muted/60 text-right pointer-events-none"
      >
        <p>{t("clickNode") || "Click node → See projects"}</p>
        <p>{t("hoverExplore") || "Hover → Explore connections"}</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 left-8 z-10 space-y-2 pointer-events-none"
      >
        {Object.entries(skillCategories).map(([key, { color }]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color, opacity: 0.6 }}
            />
            <span className="font-mono text-xs text-muted/60">
              {t(`categories.${key}`)}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Skill Detail Panel */}
      <AnimatePresence>
        {selectedSkill && selectedSkill.projectIds && selectedSkill.projectIds.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 30, filter: "blur(8px)" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-28 right-6 w-[340px] max-h-[calc(100dvh-140px)] z-20 pointer-events-auto"
          >
            {/* Main container */}
            <div
              className="relative h-full bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden"
              style={{
                border: '1px solid',
                borderImage: `linear-gradient(135deg, ${selectedSkill.color}33, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06)) 1`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, ${selectedSkill.color}55, transparent 60%)`,
                }}
              />

              {/* Header */}
              <div className="relative p-5 pb-4 shrink-0">

                {/* Close */}
                <button
                  onClick={() => setSelectedSkillId(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-all hover:rotate-90 duration-300"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Skill identity */}
                <div className="relative flex items-center gap-3.5">
                  <motion.div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${selectedSkill.color}12` }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.05 }}
                  >
                    {/* Breathing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border"
                      style={{ borderColor: `${selectedSkill.color}30` }}
                      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <img
                      src={getSkillLogoUrl(selectedSkill.id, getSkillLogoColor(selectedSkill.id))}
                      alt={selectedSkill.name}
                      className="w-6 h-6"
                      style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                    />
                  </motion.div>

                  <div className="min-w-0">
                    <motion.div
                      className="font-mono text-[10px] uppercase tracking-[0.15em] mb-0.5"
                      style={{ color: `${selectedSkill.color}99` }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {t(`categories.${selectedSkill.category}`)}
                    </motion.div>
                    <motion.h3
                      className="text-lg font-bold tracking-tight leading-tight"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 }}
                    >
                      {selectedSkill.name}
                    </motion.h3>
                  </div>
                </div>

                {/* Connections count */}
                {selectedSkill.connections && selectedSkill.connections.length > 0 && (
                  <motion.div
                    className="flex items-center gap-2 mt-3.5 font-mono text-[10px] text-white/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="3" cy="3" r="1.5" stroke="currentColor" strokeWidth="1" />
                      <circle cx="9" cy="9" r="1.5" stroke="currentColor" strokeWidth="1" />
                      <path d="M4.2 4.2L7.8 7.8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
                    </svg>
                    <span>{selectedSkill.connections.length} connections</span>
                  </motion.div>
                )}

                {/* Divider */}
                <motion.div
                  className="mt-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${selectedSkill.color}30, transparent)`,
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
              </div>

              {/* Projects list */}
              <div
                className="flex-1 min-h-0 overflow-y-auto px-5 pb-5"
                style={{ overscrollBehavior: 'contain' }}
                onWheel={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedSkill.projectIds.length > 1
                    ? t("projectCount_plural", { count: selectedSkill.projectIds.length })
                    : t("projectCount", { count: selectedSkill.projectIds.length })
                  }
                </motion.div>

                <div className="space-y-2">
                  {selectedSkill.projectIds.map((projectId, index) => {
                    const project = getProjectById(projectId);
                    if (!project) return null;

                    return (
                      <motion.a
                        key={projectId}
                        href={`/work/${projectId}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.06, type: "spring", damping: 20, stiffness: 200 }}
                        className="group relative block p-4 rounded-xl border border-white/[0.04] hover:border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
                        data-cursor="hover"
                      >
                        {/* Hover shimmer */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, transparent 30%, ${project.color}08 50%, transparent 70%)`,
                          }}
                        />

                        {/* Left accent */}
                        <motion.div
                          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                          style={{ backgroundColor: project.color }}
                          initial={{ scaleY: 0 }}
                          whileHover={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />

                        <div className="relative">
                          {/* Top row: year + arrow */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px] text-white/25 tracking-wider">
                              {project.year}
                            </span>
                            <motion.svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              className="text-white/20 group-hover:text-white/60 transition-colors"
                              initial={false}
                              animate={{ x: 0 }}
                              whileHover={{ x: 2 }}
                            >
                              <path
                                d="M3 11L11 3M11 3H5.5M11 3V8.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                            </motion.svg>
                          </div>

                          {/* Title */}
                          <h5 className="font-semibold text-sm tracking-tight text-white/90 group-hover:text-white transition-colors">
                            {project.title}
                          </h5>

                          {/* Category */}
                          <span
                            className="inline-block font-mono text-[10px] mt-1.5 tracking-wider opacity-60"
                            style={{ color: project.color }}
                          >
                            {tProject(`${kebabToCamel(projectId)}.category`)}
                          </span>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
