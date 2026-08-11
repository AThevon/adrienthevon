import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.pages.skills" });

  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/skills",
    locale,
  });
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
