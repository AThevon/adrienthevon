import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getProjectById } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return { title: "Project Not Found", robots: { index: false } };
  }

  const locale = await getLocale();
  const tProject = await getTranslations({
    locale,
    namespace: `projectsData.${kebabToCamel(slug)}`,
  });

  const metadata = buildMetadata({
    title: `${project.title} - Immersive`,
    description: tProject("description"),
    path: `/work/${slug}/immersive`,
    locale,
    type: "article",
    // Ce segment n'a pas son propre opengraph-image : on pointe explicitement
    // vers celui du projet parent ("og" est l'id défini par generateImageMetadata).
    image: {
      url: absoluteUrl(`/work/${slug}/opengraph-image/og`),
      alt: `${project.title} - ${project.category} (${project.year}) par Adrien Thevon`,
    },
  });

  return {
    ...metadata,
    // Même contenu que le case study standard, présenté autrement.
    // Le canonical évite que Google traite les deux pages comme du duplicate content.
    alternates: { canonical: absoluteUrl(`/work/${slug}`) },
  };
}

export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
