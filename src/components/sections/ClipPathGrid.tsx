"use client";

import { forwardRef, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";
import NavigationArtifact from "@/components/ui/NavigationArtifact";
import { COLORS } from "@/lib/constants";

// Clip-path values
const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES: Record<string, string[]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<string, string[]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

function getNearestSide(e: React.MouseEvent<HTMLElement>) {
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const sides = [
    { proximity: Math.abs(box.left - e.clientX), side: "left" },
    { proximity: Math.abs(box.right - e.clientX), side: "right" },
    { proximity: Math.abs(box.top - e.clientY), side: "top" },
    { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" },
  ];
  sides.sort((a, b) => a.proximity - b.proximity);
  return sides[0].side;
}

interface ClipPathCellProps {
  navKey: string;
  href: string;
  num: string;
  label: string;
}

function ClipPathCell({ navKey, href, num, label }: ClipPathCellProps) {
  const { transitionToPage } = usePageTransition();
  const [overlayScope, animateOverlay] = useAnimate();
  const [isHovered, setIsHovered] = useState(false);
  const sideRef = useRef<string>("left");

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const side = getNearestSide(e);
    sideRef.current = side;
    setIsHovered(true);
    animateOverlay(
      overlayScope.current,
      { clipPath: ENTRANCE_KEYFRAMES[side] },
      { duration: 0.25, ease: [0.33, 1, 0.68, 1] }
    );
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const side = getNearestSide(e);
    setIsHovered(false);
    animateOverlay(
      overlayScope.current,
      { clipPath: EXIT_KEYFRAMES[side] },
      { duration: 0.25, ease: [0.33, 1, 0.68, 1] }
    );
  };

  const handleClick = () => {
    transitionToPage(href);
  };

  return (
    <div
      className="relative overflow-hidden border border-[#222] bg-[#0a0a0a] cursor-pointer flex flex-col items-center justify-center gap-3 p-4"
      data-cursor="hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Number - top right */}
      <span
        className="absolute top-2 right-3 text-[10px] text-[#333]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {num}
      </span>

      {/* Artifact */}
      <NavigationArtifact
        type={navKey}
        color={COLORS.accent}
        active={isHovered}
        className="w-16 h-16"
      />

      {/* Label */}
      <span
        className="text-[clamp(18px,2vw,28px)] text-[#888] uppercase tracking-[3px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>

      {/* Clip-path overlay */}
      <div
        ref={overlayScope}
        className="absolute inset-0 bg-[#e8e8e8] flex flex-col items-center justify-center gap-3 p-4 pointer-events-none"
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
      >
        {/* Number on overlay */}
        <span
          className="absolute top-2 right-3 text-[10px] text-[#0a0a0a44]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {num}
        </span>

        {/* Artifact on overlay - inverted */}
        <NavigationArtifact
          type={navKey}
          color="#0a0a0a"
          active={isHovered}
          className="w-16 h-16"
        />

        {/* Label on overlay */}
        <span
          className="text-[clamp(18px,2vw,28px)] text-[#0a0a0a] uppercase tracking-[3px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const ClipPathGrid = forwardRef<HTMLDivElement>((_, ref) => {
  const t = useTranslations("nav");

  const row1Cells = [
    { key: "work", href: "/work", num: "01" },
    { key: "skills", href: "/skills", num: "02" },
  ];

  const row2Cells = [
    { key: "journey", href: "/journey", num: "03" },
    { key: "about", href: "/about", num: "04" },
    { key: "contact", href: "/contact", num: "05" },
  ];

  return (
    <div
      ref={ref}
      className="absolute bottom-0 right-0 flex flex-col"
      style={{ width: "60vw", height: "55vh" }}
    >
      {/* Row 1 - 2 columns */}
      <div
        className="grid grid-cols-2"
        style={{ flex: 1 }}
      >
        {row1Cells.map((cell) => (
          <ClipPathCell
            key={cell.key}
            navKey={cell.key}
            href={cell.href}
            num={cell.num}
            label={t(cell.key)}
          />
        ))}
      </div>

      {/* Row 2 - 3 columns */}
      <div
        className="grid grid-cols-3"
        style={{ flex: 1 }}
      >
        {row2Cells.map((cell) => (
          <ClipPathCell
            key={cell.key}
            navKey={cell.key}
            href={cell.href}
            num={cell.num}
            label={t(cell.key)}
          />
        ))}
      </div>
    </div>
  );
});

ClipPathGrid.displayName = "ClipPathGrid";

export default ClipPathGrid;
