import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getProjectById } from "@/data/projects";
import { ProjectJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

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

  // `description` (une phrase) plutôt que `longDescription` : cette dernière fait
  // plusieurs paragraphes avec des retours à la ligne, illisible dans une carte de partage.
  const metadata = buildMetadata({
    title: project.title,
    description: tProject("description"),
    path: `/work/${slug}`,
    locale,
    type: "article",
    publishedTime: `${project.date}-01T00:00:00.000Z`,
    // Ce segment a son propre opengraph-image.tsx (visuel aux couleurs du projet)
    image: null,
  });

  return {
    ...metadata,
    keywords: [project.title, project.category, ...project.tags],
  };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) notFound();

  const locale = await getLocale();
  const tProject = await getTranslations({
    locale,
    namespace: `projectsData.${kebabToCamel(slug)}`,
  });

  return (
    <>
      <ProjectJsonLd
        name={project.title}
        description={tProject("description")}
        path={`/work/${slug}`}
        year={project.year}
        genre={project.category}
        keywords={project.tags}
        image={project.image}
      />
      {children}
    </>
  );
}
