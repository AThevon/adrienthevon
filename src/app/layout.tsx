import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

// Primary sans-serif - Bold geometric font for headings
const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Monospace - Premium coding font for technical elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display font - Expressive font for special accents
const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Creative Developer",
    template: "%s | Creative Developer",
  },
  description:
    "Creative developer portfolio showcasing innovative web experiences, 3D interactions, and experimental creative coding projects.",
  keywords: [
    "creative developer",
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
  authors: [{ name: "Creative Developer" }],
  creator: "Creative Developer",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Creative Developer Portfolio",
    title: "Portfolio — Creative Developer",
    description:
      "Creative developer portfolio showcasing innovative web experiences, 3D interactions, and experimental creative coding projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Creative Developer",
    description:
      "Creative developer portfolio showcasing innovative web experiences, 3D interactions, and experimental creative coding projects.",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} antialiased grain`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Language Switcher - Fixed position */}
          <div className="fixed top-6 right-6 z-50">
            <LanguageSwitcher />
          </div>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
