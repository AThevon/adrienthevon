"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePageTransition } from "@/hooks/usePageTransition";
import { COLORS } from "@/lib/constants";

const NAV_ITEMS = [
  { key: "work", href: "/work", number: "01" },
  { key: "skills", href: "/skills", number: "02" },
  { key: "journey", href: "/journey", number: "03" },
  { key: "about", href: "/about", number: "04" },
  { key: "contact", href: "/contact", number: "05" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? COLORS.accent : "rgba(255,255,255,0.4)";
  const p = {
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    style: { transition: "stroke 0.3s ease, fill 0.3s ease, opacity 0.3s ease" },
  };

  switch (type) {
    case "work":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5" {...p} />
          <rect x="14" y="3" width="7" height="7" rx="1.5" {...p} opacity={active ? 1 : 0.5} />
          <rect x="3" y="14" width="7" height="7" rx="1.5" {...p} opacity={active ? 1 : 0.5} />
          <rect x="14" y="14" width="7" height="7" rx="1.5" {...p} opacity={active ? 1 : 0.35} />
        </svg>
      );
    case "skills":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path d="M12 7L5 17M12 7L19 17M7 19H17" {...p} opacity={active ? 0.5 : 0.2} />
          <circle cx="12" cy="5" r="2" {...p} />
          <circle cx="5" cy="19" r="2" {...p} />
          <circle cx="19" cy="19" r="2" {...p} />
        </svg>
      );
    case "journey":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path d="M4 20C4 20 8 4 12 12C16 20 20 4 20 4" {...p} />
          <circle cx="4" cy="20" r="1.5" fill={color} stroke="none" style={{ transition: "fill 0.3s ease" }} />
          <circle cx="20" cy="4" r="1.5" fill={color} stroke="none" style={{ transition: "fill 0.3s ease" }} />
        </svg>
      );
    case "about":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.5" {...p} />
          <path d="M5 22C5 17.6 8 14.5 12 14.5C16 14.5 19 17.6 19 22" {...p} />
        </svg>
      );
    case "contact":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path d="M22 2L11 13" {...p} />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" {...p} />
        </svg>
      );
    default:
      return null;
  }
}

function NavItem({
  item,
  index,
}: {
  item: (typeof NAV_ITEMS)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const t = useTranslations("nav");
  const { transitionToPage } = usePageTransition();

  return (
    <motion.button
      onClick={() => transitionToPage(item.href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex-1 min-w-0"
      data-cursor="hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.6 + index * 0.08 }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${COLORS.accent}, transparent 70%)`,
          opacity: hovered ? 0.08 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Card content — fixed height, pure CSS transitions */}
      <div
        className="relative px-4 py-5 lg:px-6 lg:py-6 rounded-xl border flex flex-col items-center gap-3"
        style={{
          borderColor: hovered ? `${COLORS.accent}20` : "rgba(255,255,255,0)",
          transform: hovered ? "translateY(-4px)" : "translateY(0px)",
          transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease",
        }}
      >
        {/* Number */}
        <span
          className="font-mono text-[10px] tracking-[0.2em] absolute top-2 right-3"
          style={{
            color: hovered ? COLORS.accent : "rgba(255,255,255,0.12)",
            transition: "color 0.3s ease",
          }}
        >
          {item.number}
        </span>

        {/* Icon */}
        <div
          className="mb-1"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <NavIcon type={item.key} active={hovered} />
        </div>

        {/* Label */}
        <span
          className="font-mono text-xs tracking-[0.15em] uppercase"
          style={{
            color: hovered ? COLORS.accent : "rgba(255,255,255,0.45)",
            transition: "color 0.3s ease",
          }}
        >
          {t(item.key)}
        </span>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
          style={{
            backgroundColor: COLORS.accent,
            width: hovered ? "60%" : "0%",
            opacity: hovered ? 1 : 0,
            transform: "translateX(-50%)",
            transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
          }}
        />
      </div>
    </motion.button>
  );
}

export default function NavigationDock() {
  return (
    <nav className="w-full max-w-4xl mx-auto">
      <div
        className="flex items-stretch rounded-2xl border border-white/[0.06] backdrop-blur-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      >
        {NAV_ITEMS.map((item, index) => (
          <div key={item.key} className="flex items-stretch flex-1 min-w-0">
            {index > 0 && (
              <div className="w-px self-center h-8 bg-white/[0.06]" />
            )}
            <NavItem item={item} index={index} />
          </div>
        ))}
      </div>
    </nav>
  );
}
