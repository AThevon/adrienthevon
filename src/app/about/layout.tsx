import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: `${t("title")} - Adrien Thevon`,
    description: t("headline"),
    openGraph: {
      title: `${t("title")} - Adrien Thevon`,
      description: t("headline"),
    },
    twitter: {
      title: `${t("title")} - Adrien Thevon`,
      description: t("headline"),
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
