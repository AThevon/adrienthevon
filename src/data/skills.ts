// Skill categories with colors
export const skillCategories = {
  frontend: { name: "Frontend", color: "#ff4d4d" }, // Rouge
  backend: { name: "Backend", color: "#4d9fff" }, // Bleu
  creative: { name: "Creative", color: "#fdbb00" }, // Jaune
  tools: { name: "Tools", color: "#a855f7" }, // Violet
  design: { name: "Design", color: "#fdbb00" }, // Jaune
} as const;

export type SkillCategory = keyof typeof skillCategories;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  connections: string[]; // IDs of connected skills
  description?: string;
  projectIds?: string[]; // IDs of projects using this skill
}

// All skills with intelligent connections
export const skills: Skill[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "frontend",
    connections: ["nextjs", "typescript", "motion", "threejs"],
    description: "Expert en React, hooks, et patterns avancés",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    connections: ["react", "typescript", "nodejs", "vercel"],
    description: "SSR, SSG, App Router, optimisations",
  },
  {
    id: "vue",
    name: "Vue.js",
    category: "frontend",
    connections: ["nuxt", "typescript", "nodejs"],
    description: "Composition API, réactivité, SFC",
  },
  {
    id: "nuxt",
    name: "Nuxt.js",
    category: "frontend",
    connections: ["vue", "typescript", "nodejs", "vercel"],
    description: "SSR, SSG Vue framework, auto-imports",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    connections: ["react", "nextjs", "vue", "nuxt", "nodejs"],
    description: "Types avancés, génériques, inférence",
  },
  {
    id: "tailwind",
    name: "Tailwind",
    category: "frontend",
    connections: ["react", "nextjs", "figma"],
    description: "Utility-first CSS, design systems",
  },
  {
    id: "html",
    name: "HTML5",
    category: "frontend",
    connections: ["css", "canvas"],
    description: "Sémantique, accessibilité, SEO",
  },
  {
    id: "css",
    name: "CSS3",
    category: "frontend",
    connections: ["html", "tailwind", "figma"],
    description: "Animations, grids, flexbox, variables",
  },
  {
    id: "swift",
    name: "Swift",
    category: "frontend",
    connections: [],
    description: "SwiftUI, macOS natif, WidgetKit",
  },

  // Creative Coding
  {
    id: "threejs",
    name: "Three.js",
    category: "creative",
    connections: ["react", "nextjs", "nuxt"],
    description: "Scènes 3D, shaders, post-processing",
  },
  {
    id: "canvas",
    name: "Canvas",
    category: "creative",
    connections: ["html", "motion"],
    description: "API Canvas 2D, animations customisées",
  },
  {
    id: "motion",
    name: "Motion",
    category: "creative",
    connections: ["react", "gsap", "canvas"],
    description: "Framer Motion, animations déclaratives",
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "creative",
    connections: ["motion", "threejs"],
    description: "Animations complexes, timelines",
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    connections: ["typescript", "nextjs", "postgresql"],
    description: "APIs REST, microservices",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    connections: ["nodejs"],
    description: "Base de données relationnelle",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "backend",
    connections: ["postgresql", "typescript", "nextjs", "nuxt"],
    description: "BaaS, Auth, Database temps réel",
  },

  // Tools
  {
    id: "git",
    name: "Git",
    category: "tools",
    connections: ["github", "vercel", "shell", "nix"],
    description: "Versionning, branching, workflows",
  },
  {
    id: "github",
    name: "GitHub",
    category: "tools",
    connections: ["git", "vercel", "shell"],
    description: "CI/CD, Actions, collaboration",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "tools",
    connections: ["nextjs", "github"],
    description: "Déploiement, edge functions",
  },
  {
    id: "vite",
    name: "Vite",
    category: "tools",
    connections: ["react", "typescript"],
    description: "Build tool ultra-rapide",
  },
  {
    id: "shell",
    name: "Shell",
    category: "tools",
    connections: ["git", "github", "nix"],
    description: "Bash/Zsh, scripts CLI, automation",
  },
  {
    id: "nix",
    name: "Nix",
    category: "tools",
    connections: ["shell", "git"],
    description: "Nix flakes, packages, reproducible builds",
  },

  // Design
  {
    id: "figma",
    name: "Figma",
    category: "design",
    connections: ["css", "tailwind"],
    description: "Design UI/UX, prototyping",
  },
];

// Helper to get skills by category
export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return skills.filter((skill) => skill.category === category);
}

// Helper to get a skill by id
export function getSkillById(id: string): Skill | undefined {
  return skills.find((skill) => skill.id === id);
}

// Helper to get all connections for a skill
export function getSkillConnections(skillId: string): Skill[] {
  const skill = getSkillById(skillId);
  if (!skill) return [];
  return skill.connections
    .map((id) => getSkillById(id))
    .filter((s): s is Skill => s !== undefined);
}

// Helper to get projects using a specific skill
export function getProjectsForSkill(skillName: string) {
  // Import projects dynamically to avoid circular dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { projects } = require("./projects") as { projects: Array<{ tags: string[] }> };

  return projects.filter((project) =>
    project.tags.some((tag: string) =>
      tag.toLowerCase().replace(/[.\s]/g, "") === skillName.toLowerCase().replace(/[.\s]/g, "")
    )
  );
}

// Helper to get all skills with their associated projects
export function getSkillsWithProjects() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { projects } = require("./projects") as { projects: Array<{ id: string; skills?: string[] }> };

  return skills.map((skill) => {
    // Use the new skills field for precise mapping
    const relatedProjects = projects.filter((project) =>
      project.skills && project.skills.includes(skill.id)
    );

    return {
      ...skill,
      projectIds: relatedProjects.map((p) => p.id),
    };
  });
}

// Helper to get only skills that are used in projects
export function getSkillsUsedInProjects() {
  const skillsWithProjects = getSkillsWithProjects();
  return skillsWithProjects.filter((skill) => skill.projectIds && skill.projectIds.length > 0);
}
