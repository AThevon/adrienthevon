import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

/**
 * Nettoie une description pour un usage meta :
 * - supprime les retours à la ligne (interdits dans une meta description)
 * - collapse les espaces multiples
 * - tronque proprement sur une frontière de mot
 */
export function clampDescription(input: string, max = 165): string {
  const flat = input.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;

  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(
    /[\s.,;:!?-]+$/,
    ""
  );
  return `${base}...`;
}

export type OgImage = { url: string; alt: string };

const OG_DIMENSIONS = { width: 1200, height: 630 } as const;

/** Image de partage par défaut : l'OG généré à la racine */
const DEFAULT_OG_IMAGE: OgImage = {
  url: absoluteUrl("/opengraph-image"),
  alt: `${SITE.name} - ${SITE.role.en}, ${SITE.location.label}`,
};

type BuildMetadataArgs = {
  /** Titre de la page, sans le suffixe du site */
  title: string;
  description: string;
  /** Chemin absolu du site, ex: "/work" */
  path: string;
  locale: string;
  /** "website" par défaut */
  type?: "website" | "article" | "profile";
  /** Métadonnées article (pages projet) */
  publishedTime?: string;
  /**
   * Image de partage :
   * - omis  -> image OG racine
   * - null  -> aucune image déclarée, on laisse la convention de fichier
   *            du segment (opengraph-image.tsx) prendre le relais
   */
  image?: OgImage | null;
};

/**
 * Construit un objet Metadata COMPLET.
 *
 * Important : Next.js merge les metadata de façon *shallow*. Si un layout enfant
 * redéfinit `openGraph` ou `twitter` partiellement, il écrase intégralement
 * l'objet du parent : on perd siteName, locale, `card: summary_large_image`,
 * et surtout l'image OG héritée de la racine (page partagée sans visuel).
 * D'où ce helper : chaque page émet un objet complet et cohérent.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  type = "website",
  publishedTime,
  image,
}: BuildMetadataArgs): Metadata {
  const cleanDescription = clampDescription(description);
  const url = absoluteUrl(path);
  const isFr = locale === "fr";
  const isRoot = path === "/";
  const fullTitle = isRoot ? title : `${title} | ${SITE.name}`;
  const ogImage = image === null ? null : (image ?? DEFAULT_OG_IMAGE);

  return {
    // `absolute` plutôt qu'une string : le `title.template` de la racine n'est pas
    // propagé au-delà du premier niveau, les pages projet perdaient le suffixe.
    title: isRoot ? title : { absolute: fullTitle },
    description: cleanDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title: fullTitle,
      description: cleanDescription,
      locale: isFr ? "fr_FR" : "en_US",
      alternateLocale: isFr ? ["en_US"] : ["fr_FR"],
      ...(publishedTime ? { publishedTime } : {}),
      ...(ogImage
        ? { images: [{ ...OG_DIMENSIONS, url: ogImage.url, alt: ogImage.alt }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: fullTitle,
      description: cleanDescription,
      ...(ogImage
        ? { images: [{ url: ogImage.url, alt: ogImage.alt }] }
        : {}),
    },
  };
}
