// ============================================
// SITE / SEO SINGLE SOURCE OF TRUTH
// ============================================

/**
 * Domaine canonique de production.
 * On ne se sert JAMAIS de VERCEL_URL en prod : cette variable pointe vers l'URL
 * unique du déploiement (adrienthevon-xxxx.vercel.app), pas vers le domaine.
 * Résultat sinon : canonical, og:url et og:image partent sur une URL jetable.
 */
const PRODUCTION_URL = "https://athevon.dev";

function resolveSiteUrl(): string {
  // Override explicite (test local en mode prod, domaine de staging, etc.)
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Prod Vercel -> toujours le domaine canonique
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;

  // Preview -> son propre déploiement, pour que la preview reste autonome
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** true uniquement sur le déploiement de production */
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export const SITE = {
  url: SITE_URL,
  domain: "athevon.dev",
  name: "Adrien Thevon",
  shortName: "A.THEVON",
  role: {
    fr: "Développeur créatif",
    en: "Creative Developer",
  },
  location: {
    label: "Toulouse, FR",
    city: "Toulouse",
    country: "FR",
  },
  email: "athevon.pro@gmail.com",
  twitterHandle: "@athevon_dev",
  colors: {
    background: "#0a0a0a",
    foreground: "#fafafa",
    accent: "#ffaa00",
    muted: "#8a8a8a",
  },
  social: [
    "https://github.com/AThevon",
    "https://linkedin.com/in/adrien-thevon",
    "https://x.com/athevon_dev",
  ],
} as const;

/** Pages statiques indexables, utilisées par le sitemap et la nav SEO */
export const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/skills", priority: 0.7, changeFrequency: "yearly" },
  { path: "/journey", priority: 0.7, changeFrequency: "yearly" },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
] as const;

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
