"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimate, type PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import { skillCategories, getSkillsUsedInProjects, type Skill } from "@/data/skills";
import { getProjectById } from "@/data/projects";
import { getSkillLogoUrl } from "@/lib/skillLogos";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Helper to convert kebab-case to camelCase for i18n keys
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

interface NodePosition {
  skill: Skill & { color: string; projectIds?: string[] };
  x: number;
  y: number;
}

// Bottom sheet snap points (in dvh from bottom)
const SHEET_FULL = 85; // full expanded
const SHEET_PEEK = 45; // initial peek
// Threshold to decide snap direction
const SNAP_THRESHOLD = 0.15; // 15% of sheet height

export default function StaticNetwork() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<"peek" | "full">("peek");
  const t = useTranslations("skills");
  const tProject = useTranslations("projectsData");
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sheetScope, animateSheet] = useAnimate();

  // Motion value for drag - represents translateY offset from current snap
  const sheetY = useMotionValue(0);
  // Backdrop opacity driven by sheet position
  const backdropOpacity = useTransform(sheetY, [-100, 0, 300], [0.5, 0.4, 0]);

  const selectedSkill = selectedSkillId
    ? (() => {
        const skills = getSkillsUsedInProjects();
        const skill = skills.find((s) => s.id === selectedSkillId);
        return skill ? { ...skill, color: skillCategories[skill.category].color } : null;
      })()
    : null;

  const closeSheet = useCallback(() => {
    setSelectedSkillId(null);
    setSheetMode("peek");
    sheetY.set(0);
  }, [sheetY]);

  const handleDragEnd = useCallback((_: never, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const sheetHeightPx = window.innerHeight * (sheetMode === "full" ? SHEET_FULL : SHEET_PEEK) / 100;
    const threshold = sheetHeightPx * SNAP_THRESHOLD;

    // Fast swipe down -> dismiss or shrink
    if (velocity > 500) {
      if (sheetMode === "peek") {
        closeSheet();
      } else {
        setSheetMode("peek");
        animateSheet(sheetScope.current, { y: 0 }, { type: "spring", damping: 30, stiffness: 300 });
        sheetY.set(0);
      }
      return;
    }

    // Fast swipe up -> expand
    if (velocity < -500 && sheetMode === "peek") {
      setSheetMode("full");
      animateSheet(sheetScope.current, { y: 0 }, { type: "spring", damping: 30, stiffness: 300 });
      sheetY.set(0);
      return;
    }

    // Slow drag - use offset threshold
    if (offset > threshold) {
      if (sheetMode === "peek") {
        closeSheet();
      } else {
        setSheetMode("peek");
        animateSheet(sheetScope.current, { y: 0 }, { type: "spring", damping: 30, stiffness: 300 });
        sheetY.set(0);
      }
    } else if (offset < -threshold && sheetMode === "peek") {
      setSheetMode("full");
      animateSheet(sheetScope.current, { y: 0 }, { type: "spring", damping: 30, stiffness: 300 });
      sheetY.set(0);
    } else {
      // Snap back
      animateSheet(sheetScope.current, { y: 0 }, { type: "spring", damping: 30, stiffness: 300 });
      sheetY.set(0);
    }
  }, [sheetMode, closeSheet, animateSheet, sheetScope, sheetY]);

  // Pre-calculate positions for nodes in a circular layout
  const nodes = useMemo(() => {
    const skills = getSkillsUsedInProjects();
    const nodePositions: NodePosition[] = [];

    // Limit to 20 most important skills for mobile
    const limitedSkills = skills.slice(0, 20);

    // Circular layout
    limitedSkills.forEach((skill, index) => {
      const angle = (index / limitedSkills.length) * Math.PI * 2 - Math.PI / 2; // Start from top
      const radius = 35; // percentage
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      nodePositions.push({
        skill: {
          ...skill,
          color: skillCategories[skill.category].color,
        },
        x,
        y,
      });
    });

    return nodePositions;
  }, []);

  // Calculate connections between nodes
  const connections = useMemo(() => {
    const conns: Array<{ from: NodePosition; to: NodePosition; opacity: number }> = [];

    nodes.forEach((node) => {
      node.skill.connections.forEach((connectedId) => {
        const targetNode = nodes.find((n) => n.skill.id === connectedId);
        if (targetNode) {
          // Calculate distance to determine opacity
          const dx = targetNode.x - node.x;
          const dy = targetNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100; // Max distance for visible connections
          const opacity = Math.max(0, 1 - distance / maxDistance) * 0.3;

          if (opacity > 0.05) {
            conns.push({ from: node, to: targetNode, opacity });
          }
        }
      });
    });

    return conns;
  }, [nodes]);

  return (
    <section className="fixed top-20 left-0 right-0 bottom-0 w-full overflow-hidden bg-background">
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
        <p>{t("tapNode") || "Tap node → See projects"}</p>
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

      {/* SVG Network */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        <g className="connections">
          {connections.map((conn, i) => (
            <motion.line
              key={`${conn.from.skill.id}-${conn.to.skill.id}-${i}`}
              x1={`${conn.from.x}%`}
              y1={`${conn.from.y}%`}
              x2={`${conn.to.x}%`}
              y2={`${conn.to.y}%`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: selectedSkillId
                  ? (conn.from.skill.id === selectedSkillId || conn.to.skill.id === selectedSkillId ? 0.4 : 0.05)
                  : conn.opacity
              }}
              transition={{ duration: 0.8, delay: i * 0.01 }}
            />
          ))}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node, i) => {
            const isSelected = node.skill.id === selectedSkillId;
            const isConnected = selectedSkillId && node.skill.connections.includes(selectedSkillId);
            const isFaded = selectedSkillId && !isSelected && !isConnected;

            return (
              <g key={node.skill.id}>
                {/* Pulse ring animation */}
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="3"
                  fill="none"
                  stroke={node.skill.color}
                  strokeWidth="0.2"
                  opacity={isFaded ? 0 : 1}
                  animate={{
                    r: isSelected ? [3, 5, 3] : [3, 4.5, 3],
                    opacity: isSelected ? [0.5, 0, 0.5] : [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />

                {/* Node circle - clickable */}
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="2"
                  fill={node.skill.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isFaded ? 0.5 : isSelected ? 1.3 : 1,
                    opacity: isFaded ? 0.2 : 1
                  }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => setSelectedSkillId(prev => prev === node.skill.id ? null : node.skill.id)}
                  style={{ filter: isSelected ? `drop-shadow(0 0 2px ${node.skill.color})` : undefined }}
                />

                {/* Label - show on selected/connected only */}
                {(isSelected || isConnected) && !isFaded && (
                  <motion.text
                    x={`${node.x}%`}
                    y={`${node.y + 6}%`}
                    textAnchor="middle"
                    className="text-[1.2px] fill-current font-mono pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.2px' }}
                  >
                    {node.skill.name}
                  </motion.text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Backdrop - tap to close */}
      <AnimatePresence>
        {selectedSkill && selectedSkill.projectIds && selectedSkill.projectIds.length > 0 && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.01)", opacity: backdropOpacity }}
            onClick={closeSheet}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet - Drag + Snap */}
      <AnimatePresence>
        {selectedSkill && selectedSkill.projectIds && selectedSkill.projectIds.length > 0 && (
          <motion.aside
            ref={sheetScope}
            key={`sheet-${selectedSkillId}`}
            initial={{ y: "100%", height: `${SHEET_PEEK}dvh` }}
            animate={{ y: 0, height: `${sheetMode === "full" ? SHEET_FULL : SHEET_PEEK}dvh` }}
            exit={{ y: "100%" }}
            transition={reducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 32, stiffness: 300 }
            }
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            style={{
              y: sheetY,
              touchAction: "none",
            }}
            className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto will-change-transform"
          >
            {/* Glowing backdrop */}
            <div
              className="absolute inset-0 blur-2xl opacity-15 rounded-t-3xl"
              style={{ backgroundColor: selectedSkill.color }}
            />

            {/* Main container */}
            <div className="relative h-full bg-background/95 backdrop-blur-xl rounded-t-3xl border-t border-foreground/10 flex flex-col overflow-hidden">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 rounded-full bg-foreground/20" />
              </div>

              {/* Header with gradient accent */}
              <div
                className="relative flex items-center justify-between px-5 pb-4 pt-2 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${selectedSkill.color}12 0%, transparent 70%)`
                }}
              >
                {/* Skill info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon with color background */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${selectedSkill.color}20` }}
                  >
                    <img
                      src={getSkillLogoUrl(selectedSkill.id, 'white')}
                      alt={selectedSkill.name}
                      className="w-6 h-6"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-muted/60 uppercase tracking-wider">
                      {t(`categories.${selectedSkill.category}`)}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight truncate">{selectedSkill.name}</h3>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={closeSheet}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/5 active:bg-foreground/10 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Separator */}
              <div className="h-px bg-foreground/8 mx-5 shrink-0" />

              {/* Projects list - properly scrollable */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
                style={{
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="font-mono text-[10px] text-muted/50 uppercase tracking-wider mb-3">
                  {selectedSkill.projectIds.length > 1
                    ? t("projectCount_plural", { count: selectedSkill.projectIds.length })
                    : t("projectCount", { count: selectedSkill.projectIds.length })
                  }
                </div>

                <div className="space-y-1.5">
                  {selectedSkill.projectIds.map((projectId, index) => {
                    const project = getProjectById(projectId);
                    if (!project) return null;

                    return (
                      <motion.a
                        key={projectId}
                        href={`/work`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reducedMotion
                          ? { duration: 0 }
                          : { delay: index * 0.04, duration: 0.25, ease: "easeOut" }
                        }
                        className="group flex items-center gap-3 relative p-3.5 rounded-xl active:bg-foreground/5 transition-colors"
                      >
                        {/* Color accent dot */}
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />

                        {/* Project info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-[15px] truncate">
                            {project.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-muted/40">
                              {project.year}
                            </span>
                            <span className="text-foreground/10">·</span>
                            <span
                              className="font-mono text-[10px] truncate"
                              style={{ color: `${project.color}99` }}
                            >
                              {tProject(`${kebabToCamel(projectId)}.category`)}
                            </span>
                          </div>
                        </div>

                        {/* Arrow icon */}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="shrink-0 text-muted/30"
                        >
                          <path
                            d="M6 4L10 8L6 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.a>
                    );
                  })}
                </div>

                {/* Expand hint - only in peek mode */}
                {sheetMode === "peek" && selectedSkill.projectIds.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-4 pb-2"
                  >
                    <button
                      onClick={() => setSheetMode("full")}
                      className="font-mono text-[10px] text-muted/40 uppercase tracking-wider flex items-center gap-1.5 active:text-muted/60 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {t("expandSheet") || "Swipe up for more"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
