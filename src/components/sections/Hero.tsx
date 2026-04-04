"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useDeviceDetect } from "@/hooks";
import { COLORS } from "@/lib/constants";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useCallback } from "react";

const HeroMobile = dynamic(() => import("./HeroMobile"), { ssr: false });

const AsciiBlocks = dynamic(
  () => import("@/components/experiments/AsciiBlocks"),
  { ssr: false }
);

const ASCII_NAME = `      ▄▄▄▄   ▄▄▄▄▄▄   ▄▄▄▄▄▄▄   ▄▄▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄    ▄▄▄
    ▄██▀▀██▄ ███▀▀██▄ ███▀▀███▄  ███  ███▀▀▀▀▀ ████▄  ███
    ███  ███ ███  ███ ███▄▄███▀  ███  ███▄▄    ███▀██▄███
    ███▀▀███ ███  ███ ███▀▀██▄   ███  ███      ███  ▀████
    ███  ███ ██████▀  ███  ▀███ ▄███▄ ▀███████ ███    ███



▄▄▄▄▄▄▄▄▄ ▄▄▄   ▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄▄  ▄▄▄▄   ▄▄▄▄▄   ▄▄▄    ▄▄▄
▀▀▀███▀▀▀ ███   ███ ███▀▀▀▀▀ ▀███  ███▀ ▄███████▄ ████▄  ███
   ███    █████████ ███▄▄     ███  ███  ███   ███ ███▀██▄███
   ███    ███▀▀▀███ ███       ███▄▄███  ███▄▄▄███ ███  ▀████
   ███    ███   ███ ▀███████   ▀████▀    ▀█████▀  ███    ███`;

export default function Hero() {
  const { isMobile, isHydrated } = useDeviceDetect();
  const tNav = useTranslations("nav");
  const { transitionToPage } = usePageTransition();

  const navItems = [
    { key: "work", label: tNav("work"), number: "01", href: "/work" },
    { key: "skills", label: tNav("skills"), number: "02", href: "/skills" },
    { key: "journey", label: tNav("journey"), number: "03", href: "/journey" },
    { key: "about", label: tNav("about"), number: "04", href: "/about" },
    { key: "contact", label: tNav("contact"), number: "05", href: "/contact" },
  ];

  const handleNavClick = useCallback((href: string) => {
    transitionToPage(href);
  }, [transitionToPage]);

  if (isHydrated && isMobile) {
    return <HeroMobile />;
  }

  return (
    <section
      data-cursor-mode="hero"
      className="relative h-dvh overflow-hidden"
    >
      {/* Full-page canvas */}
      <AsciiBlocks
        ascii={ASCII_NAME}
        blockSize={6}
        gap={1}
        color={COLORS.foreground}
        displacedColor={COLORS.accent}
        mouseRadius={100}
        paused={false}
        align="left"
        verticalAlign="bottom"
        padding={48}
        navItems={navItems}
        onNavClick={handleNavClick}
      />

      {/* Accessible nav links (sr-only) */}
      <nav className="sr-only" aria-label="Navigation principale">
        {navItems.map((item) => (
          <a key={item.key} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
