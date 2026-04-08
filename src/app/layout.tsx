import type { Metadata } from "next";
import { Dela_Gothic_One, Space_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import MainNav from "@/components/navigation/MainNav";
import PageTransition from "@/components/navigation/PageTransition";
import CursorWrapper from "@/components/effects/CursorWrapper";
import { PageTransitionProvider } from "@/hooks/usePageTransition";

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    ),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    keywords: [
      "creative developer",
      "développeur créatif",
      "web developer",
      "portfolio",
      "three.js",
      "webgl",
      "react",
      "next.js",
      "creative coding",
      "interactive design",
      "motion design",
    ],
    authors: [{ name: "Adrien Thevon" }],
    creator: "Adrien Thevon",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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
