"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";
import { COLORS } from "@/lib/constants";

const HeroMobile = dynamic(() => import("./HeroMobile"), { ssr: false });

const AsciiBlocks = dynamic(
  () => import("@/components/experiments/AsciiBlocks"),
  { ssr: false }
);

const ClipPathGrid = dynamic(
  () => import("@/components/sections/ClipPathGrid"),
  { ssr: false }
);

const FloatingSocialIcons = dynamic(
  () => import("@/components/ui/FloatingSocialIcons"),
  { ssr: false }
);

const ASCII_NAME = ` ▄▄▄▄   ▄▄▄▄▄▄   ▄▄▄▄▄▄▄   ▄▄▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄    ▄▄▄
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
  const asciiRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  if (isHydrated && isMobile) {
    return <HeroMobile />;
  }

  return (
    <section
      data-cursor-mode="hero"
      className="relative h-dvh overflow-hidden"
    >
      {/* ASCII blocks - top left */}
      <AsciiBlocks
        ref={asciiRef}
        ascii={ASCII_NAME}
        blockSize={6}
        gap={1}
        color={COLORS.foreground}
        displacedColor={COLORS.accent}
        mouseRadius={100}
        paused={false}
        align="left"
        verticalAlign="top"
        padding={96}
      />

      {/* ClipPath nav grid - bottom right */}
      <ClipPathGrid ref={gridRef} />

      {/* Floating social icons */}
      <FloatingSocialIcons asciiRef={asciiRef} gridRef={gridRef} />

      {/* Accessible nav links (sr-only) */}
      <nav className="sr-only" aria-label="Navigation principale">
        <a href="/work">Work</a>
        <a href="/skills">Skills</a>
        <a href="/journey">Journey</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="https://github.com/AThevon" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/adrien-thevon-74b134100" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </section>
  );
}
