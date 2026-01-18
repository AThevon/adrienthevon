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
    connections: ["css", "canvas", "webgl"],
    description: "Sémantique, accessibilité, SEO",
  },
  {
    id: "css",
    name: "CSS3",
    category: "frontend",
    connections: ["html", "tailwind", "figma"],
    description: "Animations, grids, flexbox, variables",
  },

  // Creative Coding
  {
    id: "threejs",
    name: "Three.js",
    category: "creative",
    connections: ["react", "nextjs", "nuxt", "webgl", "glsl", "r3f"],
    description: "Scènes 3D, shaders, post-processing",
  },
  {
    id: "r3f",
    name: "R3F",
    category: "creative",
    connections: ["react", "threejs", "drei"],
    description: "@react-three/fiber pour React",
  },
  {
    id: "drei",
    name: "Drei",
    category: "creative",
    connections: ["r3f", "threejs"],
    description: "Helpers pour React Three Fiber",
  },
  {
    id: "webgl",
    name: "WebGL",
    category: "creative",
    connections: ["threejs", "glsl", "canvas"],
    description: "Rendu GPU, shaders customisés",
  },
  {
    id: "glsl",
    name: "GLSL",
    category: "creative",
    connections: ["webgl", "threejs"],
    description: "Vertex & fragment shaders",
  },
  {
    id: "canvas",
    name: "Canvas",
    category: "creative",
    connections: ["html", "webgl", "motion"],
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
    connections: ["typescript", "nextjs", "express", "postgresql"],
    description: "APIs REST, microservices",
  },
  {
    id: "express",
    name: "Express",
    category: "backend",
    connections: ["nodejs", "postgresql"],
    description: "Framework web minimaliste",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    connections: ["nodejs", "express", "prisma"],
    description: "Base de données relationnelle",
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "backend",
    connections: ["postgresql", "typescript", "nodejs"],
    description: "ORM type-safe pour Node.js",
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "backend",
    connections: ["react", "nextjs"],
    description: "Auth, Firestore, Hosting",
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
    connections: ["github", "vercel"],
    description: "Versionning, branching, workflows",
  },
  {
    id: "github",
    name: "GitHub",
    category: "tools",
    connections: ["git", "vercel"],
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
    id: "webpack",
    name: "Webpack",
    category: "tools",
    connections: ["vite", "nodejs"],
    description: "Module bundler",
  },

  // Design
  {
    id: "figma",
    name: "Figma",
    category: "design",
    connections: ["css", "tailwind", "photoshop"],
    description: "Design UI/UX, prototyping",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    category: "design",
    connections: ["figma", "illustrator"],
    description: "Retouche, compositing",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    category: "design",
    connections: ["photoshop", "figma"],
    description: "Illustrations vectorielles",
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
  const { projects } = require("./projects");

  return projects.filter((project: any) =>
    project.tags.some((tag: string) =>
      tag.toLowerCase().replace(/[.\s]/g, "") === skillName.toLowerCase().replace(/[.\s]/g, "")
    )
  );
}

// Helper to get all skills with their associated projects
export function getSkillsWithProjects() {
  const { projects } = require("./projects");

  return skills.map((skill) => {
    // Use the new skills field for precise mapping
    const relatedProjects = projects.filter((project: any) =>
      project.skills && project.skills.includes(skill.id)
    );

    return {
      ...skill,
      projectIds: relatedProjects.map((p: any) => p.id),
    };
  });
}

// Helper to get only skills that are used in projects
export function getSkillsUsedInProjects() {
  const skillsWithProjects = getSkillsWithProjects();
  return skillsWithProjects.filter((skill) => skill.projectIds && skill.projectIds.length > 0);
}
