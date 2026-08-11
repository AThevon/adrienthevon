import { SITE, absoluteUrl } from "@/lib/site";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Contenu 100% statique généré côté serveur, aucune entrée utilisateur
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Graph global du site : Person + WebSite.
 * C'est ce qui permet à Google de rattacher le site à une identité
 * (nom, métier, réseaux) plutôt qu'à une page anonyme.
 */
export function SiteJsonLd({ locale }: { locale: string }) {
  const isFr = locale === "fr";

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": absoluteUrl("/#person"),
            name: SITE.name,
            url: SITE.url,
            image: absoluteUrl("/icons/icon-512.png"),
            jobTitle: isFr ? SITE.role.fr : SITE.role.en,
            description: isFr
              ? "Développeur créatif basé à Toulouse. Web, CLI et natif : React, Three.js, WebGL et motion design."
              : "Creative developer based in Toulouse. Web, CLI and native: React, Three.js, WebGL and motion design.",
            email: `mailto:${SITE.email}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: SITE.location.city,
              addressCountry: SITE.location.country,
            },
            sameAs: [...SITE.social],
            knowsAbout: [
              "Creative coding",
              "WebGL",
              "Three.js",
              "React",
              "Next.js",
              "TypeScript",
              "Motion design",
              "Frontend development",
            ],
          },
          {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: SITE.url,
            name: SITE.name,
            description: isFr
              ? "Portfolio d'Adrien Thevon, développeur créatif à Toulouse."
              : "Portfolio of Adrien Thevon, creative developer in Toulouse.",
            publisher: { "@id": absoluteUrl("/#person") },
            inLanguage: ["fr-FR", "en-US"],
          },
        ],
      }}
    />
  );
}

type ProjectJsonLdProps = {
  name: string;
  description: string;
  path: string;
  year: string;
  genre: string;
  keywords: string[];
  image: string;
};

/** Schema CreativeWork pour une page projet */
export function ProjectJsonLd({
  name,
  description,
  path,
  year,
  genre,
  keywords,
  image,
}: ProjectJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": absoluteUrl(`${path}#creativework`),
        name,
        description,
        url: absoluteUrl(path),
        genre,
        keywords: keywords.join(", "),
        dateCreated: year,
        image: absoluteUrl(image),
        inLanguage: "fr-FR",
        author: { "@id": absoluteUrl("/#person") },
        creator: { "@id": absoluteUrl("/#person") },
        isPartOf: { "@id": absoluteUrl("/#website") },
      }}
    />
  );
}
