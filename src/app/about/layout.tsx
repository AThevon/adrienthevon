import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.pages.about" });

  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/about",
    locale,
    type: "profile",
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
