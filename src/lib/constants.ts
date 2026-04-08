// ============================================
// THEME CONSTANTS
// ============================================

export const COLORS = {
  // Primary accent color
  accent: "#ffaa00",

  // Background colors
  background: "#0a0a0a",
  foreground: "#e8e8e8",

  // Muted/secondary text
  muted: "#666666",
} as const;

// ============================================
// ANIMATION CONSTANTS
// ============================================

export const ANIMATION = {
  // Durations (in seconds) - sec et rapide
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.5,
  },

  // Easing - ease-out sec, jamais de bounce
  ease: {
    out: [0.33, 1, 0.68, 1],
    inOut: [0.4, 0, 0.2, 1],
  },

  // Stagger delay between items (in seconds)
  stagger: 0.04,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  fonts: {
    mono: "var(--font-mono)",
    display: "var(--font-display)",
  },
} as const;

// Type exports for TypeScript
export type AccentColor = typeof COLORS.accent;
