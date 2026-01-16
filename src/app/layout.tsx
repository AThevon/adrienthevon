import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grain`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
