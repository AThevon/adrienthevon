"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { projects, Project } from "@/data/projects";
import { ANIMATION } from "@/lib/constants";

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

interface ProjectRowProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}

function ProjectRow({ project, expanded, onToggle, index }: ProjectRowProps) {
  const tProject = useTranslations(`projectsData.${toCamelCase(project.id)}`);

  const ctaLabel = project.link.includes("github.com") ? "GITHUB →" : "VIEW SITE →";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ANIMATION.duration.normal,
        delay: index * 0.05,
        ease: ANIMATION.ease.out as [number, number, number, number],
      }}
      className="relative pl-6"
    >
      {/* Colored dot on axis */}
      <span
        className="absolute left-0 top-4 -translate-x-[3.5px] w-2 h-2 rounded-full z-10"
        style={{ backgroundColor: project.color }}
      />

      {/* Row button */}
      <button
        onClick={onToggle}
        className="w-full text-left py-3 flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-bold text-foreground leading-tight">
            {project.title}
          </span>
          <span className="font-mono text-[10px] text-muted tracking-widest">
            {project.category}
          </span>
        </div>

        {/* Expand indicator */}
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: ANIMATION.duration.fast }}
          className="shrink-0 mt-0.5 text-muted/50 font-mono text-sm leading-none"
        >
          +
        </motion.span>
      </button>

      {/* Accordion content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: ANIMATION.duration.normal,
              ease: ANIMATION.ease.inOut as [number, number, number, number],
            }}
            className="overflow-hidden"
          >
            <div className="pb-4 flex flex-col gap-3">
              {/* Description */}
              <p className="font-mono text-xs text-muted leading-relaxed">
                {tProject("description")}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] border border-foreground/20 px-2 py-0.5 text-muted/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline active:opacity-70 transition-opacity w-fit"
              >
                {ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectTimelineMobile() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) =>
    b.localeCompare(a)
  );

  let globalIndex = 0;

  return (
    <div className="relative px-6 pt-28 pb-8">
      {/* Vertical axis line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-foreground/10" />

      {years.map((year) => {
        const yearProjects = projects.filter((p) => p.year === year);

        return (
          <div key={year} className="relative mb-6">
            {/* Year marker */}
            <div className="relative pl-6 mb-3 flex items-center gap-3">
              {/* Accent dot for year */}
              <span className="absolute left-0 -translate-x-[4px] w-2.5 h-2.5 rounded-full bg-accent z-10" />
              <span className="font-mono text-[10px] text-accent tracking-widest">
                {year}
              </span>
            </div>

            {/* Projects for this year */}
            <div className="flex flex-col">
              {yearProjects.map((project) => {
                const idx = globalIndex++;
                return (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    expanded={expandedId === project.id}
                    onToggle={() =>
                      setExpandedId(
                        expandedId === project.id ? null : project.id
                      )
                    }
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
