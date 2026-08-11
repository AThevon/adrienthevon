import type { MetadataRoute } from "next";
import { absoluteUrl, STATIC_ROUTES } from "@/lib/site";
import { projects } from "@/data/projects";

/** "2026-05" -> Date au 1er du mois (les projets n'ont pas de jour) */
function parseProjectDate(date: string): Date {
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, 1));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Les pages /immersive ne sont pas listées : ce sont des variantes de présentation
  // du même contenu, leur canonical pointe vers le case study standard.
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/work/${project.id}`),
    lastModified: parseProjectDate(project.date),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticEntries, ...projectEntries];
}
