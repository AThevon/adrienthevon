import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, Space_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import MainNav from "@/components/navigation/MainNav";
import PageTransition from "@/components/navigation/PageTransition";
import CursorWrapper from "@/components/effects/CursorWrapper";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { PageTransitionProvider } from "@/hooks/usePageTransition";
import { SITE, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

// Display - Thick Japanese/brutal style for titles
const delaGothicOne = Dela_Gothic_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Mono - Retro-futuristic monospace for body + labels + everything else
const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE.colors.background,
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta" });

  const base = buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale,
    type: "profile",
    // La racine a son propre opengraph-image.tsx : on laisse la convention
    // de fichier fournir l'image (avec son hash de cache).
    image: null,
  });

  return {
    ...base,
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${SITE.name}`,
    },
    applicationName: SITE.name,
    category: "technology",
    keywords: [
      "Adrien Thevon",
      "développeur créatif",
      "creative developer",
      "creative coding",
      "développeur freelance Toulouse",
      "portfolio développeur",
      "three.js",
      "webgl",
      "react",
      "next.js",
      "motion design",
      "interactive design",
    ],
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      title: SITE.shortName,
      statusBarStyle: "black-translucent",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${delaGothicOne.variable} ${spaceMono.variable} antialiased grain`}
      >
        <SiteJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <PageTransitionProvider>
            {/* Global Custom Cursor */}
            <CursorWrapper />

            {/* Main Navigation */}
            <MainNav />

            {/* Smooth Scroll + Page Transitions */}
            <SmoothScrollProvider>
              <PageTransition>{children}</PageTransition>
            </SmoothScrollProvider>
          </PageTransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
