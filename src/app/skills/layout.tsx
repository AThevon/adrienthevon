import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "skills" });

  return {
    title: `${t("title")} - Adrien Thevon`,
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} - Adrien Thevon`,
      description: t("subtitle"),
    },
    twitter: {
      title: `${t("title")} - Adrien Thevon`,
      description: t("subtitle"),
    },
  };
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
