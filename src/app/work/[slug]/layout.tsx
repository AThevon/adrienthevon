import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getProjectById } from "@/data/projects";
import ProjectBadgeNav from "./badge-nav";

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tProject = await getTranslations({
    locale,
    namespace: `projectsData.${kebabToCamel(slug)}`,
  });

  const project = getProjectById(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: tProject("longDescription"),
    openGraph: {
      title: project.title,
      description: tProject("longDescription"),
      type: "website",
      images: [
        {
          url: `/work/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: tProject("longDescription"),
      images: [`/work/${slug}/twitter-image`],
    },
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProjectBadgeNav />
      {children}
    </>
  );
}
