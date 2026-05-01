/**
 * Helper to get Simple Icons URLs for tech logos
 * https://simpleicons.org/
 */

// Mapping of skill IDs to Simple Icons slugs
const iconMapping: Record<string, string> = {
  // Frontend
  react: "react",
  nextjs: "nextdotjs",
  vue: "vuedotjs",
  nuxt: "nuxt",
  typescript: "typescript",
  tailwind: "tailwindcss",
  html: "html5",
  css: "css",
  swift: "swift",

  // Creative
  threejs: "threedotjs",
  canvas: "javascript", // Canvas API uses JavaScript
  motion: "framer",
  gsap: "greensock",

  // Backend
  nodejs: "nodedotjs",
  postgresql: "postgresql",
  drizzle: "drizzle",
  supabase: "supabase",

  // Tools
  git: "git",
  github: "github",
  vercel: "vercel",
  vite: "vite",
  shell: "gnubash",
  nix: "nixos",
  claude: "claude",

  // Design
  figma: "figma",
};

// Colors for logos (official brand colors from Simple Icons)
const logoColors: Record<string, string> = {
  react: "#61DAFB",
  nextjs: "#000000",
  vue: "#4FC08D",
  nuxt: "#00DC82",
  typescript: "#3178C6",
  tailwind: "#06B6D4",
  html: "#E34F26",
  css: "#1572B6",
  swift: "#F05138",
  threejs: "#000000",
  motion: "#0055FF",
  gsap: "#88CE02",
  nodejs: "#339933",
  postgresql: "#4169E1",
  supabase: "#3ECF8E",
  git: "#F05032",
  github: "#181717",
  vercel: "#000000",
  vite: "#646CFF",
  shell: "#4EAA25",
  nix: "#5277C3",
  claude: "#D97757",
  figma: "#F24E1E",
};

/**
 * Get Simple Icons CDN URL for a skill
 * Returns SVG URL with white color by default (for dark theme)
 */
export function getSkillLogoUrl(skillId: string, color: string = "white"): string {
  const slug = iconMapping[skillId];
  if (!slug) {
    console.warn(`No icon mapping found for skill: ${skillId}`);
    return "";
  }

  // Simple Icons CDN: https://cdn.simpleicons.org/{slug}/{color}
  // Remove # from hex color
  const cleanColor = color.replace("#", "");
  return `https://cdn.simpleicons.org/${slug}/${cleanColor}`;
}

/**
 * Get brand color for a skill
 */
export function getSkillLogoColor(skillId: string): string {
  return logoColors[skillId] || "#FFFFFF";
}

/**
 * Preload all skill logos
 */
export function preloadSkillLogos(skillIds: string[]): Promise<void[]> {
  const promises = skillIds.map((skillId) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to load logo for ${skillId}`);
        resolve(); // Don't block on errors
      };
      img.src = getSkillLogoUrl(skillId);
    });
  });

  return Promise.all(promises);
}
