"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { skillCategories, getSkillsUsedInProjects, type Skill } from "@/data/skills";
import { getProjectById } from "@/data/projects";
import { getSkillLogoUrl } from "@/lib/skillLogos";

// Helper to convert kebab-case to camelCase for i18n keys
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

interface NodePosition {
  skill: Skill & { color: string; projectIds?: string[] };
  x: number;
  y: number;
}

export default function StaticNetwork() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const t = useTranslations("skills");
  const tProject = useTranslations("projectsData");

  const selectedSkill = selectedSkillId
    ? (() => {
        const skills = getSkillsUsedInProjects();
        const skill = skills.find((s) => s.id === selectedSkillId);
        return skill ? { ...skill, color: skillCategories[skill.category].color } : null;
      })()
    : null;

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

      {/* Projects Panel - Mobile Optimized */}
      <AnimatePresence>
        {selectedSkill && selectedSkill.projectIds && selectedSkill.projectIds.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[60vh] z-20 pointer-events-auto"
          >
            {/* Glowing backdrop */}
            <div
              className="absolute inset-0 blur-2xl opacity-20"
              style={{ backgroundColor: selectedSkill.color }}
            />

            {/* Main container */}
            <div className="relative h-full bg-background/95 backdrop-blur-xl rounded-t-3xl border-t-2 border-foreground/10 flex flex-col overflow-hidden">
              {/* Header with gradient accent */}
              <div
                className="relative flex items-center justify-between p-6 shrink-0 border-b border-foreground/10"
                style={{
                  background: `linear-gradient(135deg, ${selectedSkill.color}15 0%, transparent 70%)`
                }}
              >
                {/* Skill info */}
                <div className="flex items-center gap-3">
                  {/* Icon with color background */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedSkill.color}20` }}
                  >
                    <img
                      src={getSkillLogoUrl(selectedSkill.id, 'white')}
                      alt={selectedSkill.name}
                      className="w-7 h-7"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted/70 uppercase tracking-wider">
                      {t(`categories.${selectedSkill.category}`)}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{selectedSkill.name}</h3>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedSkillId(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Projects list - scrollable */}
              <div
                className="flex-1 min-h-0 overflow-y-auto p-4"
                style={{ overscrollBehavior: 'contain' }}
              >
                <div className="font-mono text-xs text-muted/60 uppercase tracking-wider mb-3 px-2">
                  {selectedSkill.projectIds.length > 1
                    ? t("projectCount_plural", { count: selectedSkill.projectIds.length })
                    : t("projectCount", { count: selectedSkill.projectIds.length })
                  }
                </div>

                <div className="space-y-2">
                  {selectedSkill.projectIds.map((projectId, index) => {
                    const project = getProjectById(projectId);
                    if (!project) return null;

                    return (
                      <motion.a
                        key={projectId}
                        href={`/work/${projectId}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group block relative p-4 rounded-xl hover:bg-foreground/5 transition-all cursor-pointer"
                      >
                        {/* Hover accent line */}
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl"
                          style={{ backgroundColor: project.color }}
                        />

                        {/* Project info */}
                        <div className="flex items-start justify-between gap-2 pl-3">
                          <div className="flex-1">
                            <div className="font-mono text-xs text-muted/50 mb-1">
                              {project.year}
                            </div>
                            <h5 className="font-bold text-base group-hover:translate-x-1 transition-transform mb-1">
                              {project.title}
                            </h5>
                            <div
                              className="font-mono text-xs opacity-70"
                              style={{ color: project.color }}
                            >
                              {tProject(`${kebabToCamel(projectId)}.category`)}
                            </div>
                          </div>

                          {/* Arrow icon */}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                          >
                            <path
                              d="M4 12L12 4M12 4H6M12 4V10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
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
