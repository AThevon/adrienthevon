import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import WorkBadgeNav from "./badge-nav";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.pages.work" });

  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/work",
    locale,
  });
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WorkBadgeNav />
      {children}
    </>
  );
}
