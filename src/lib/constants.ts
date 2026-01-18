// ============================================
// THEME CONSTANTS
// ============================================
// Change these values to update colors across the entire app

export const COLORS = {
  // Primary accent color - Yellow-Orange
  accent: "#ffaa00",

  // Background colors
  background: "#0a0a0a",
  foreground: "#fafafa",

  // Muted/secondary text
  muted: "#888888",

  // Secondary accent colors for variety
  secondary: {
    cyan: "#00ccff",
    green: "#00ff88",
    purple: "#8844ff",
    pink: "#ff0088",
    yellow: "#ffcc00",
  },
} as const;

// ============================================
// ANIMATION CONSTANTS
// ============================================

export const ANIMATION = {
  // Spring configs
  spring: {
    default: { damping: 25, stiffness: 400, mass: 0.5 },
    smooth: { damping: 30, stiffness: 200, mass: 0.8 },
    bouncy: { damping: 15, stiffness: 300, mass: 0.5 },
  },

  // Durations (in seconds)
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
  },

  // Easing functions
  ease: {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    expo: [0.33, 1, 0.68, 1],
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  fonts: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
    display: "var(--font-display)",
  },
} as const;

// Type exports for TypeScript
export type AccentColor = typeof COLORS.accent;
export type SecondaryColor = (typeof COLORS.secondary)[keyof typeof COLORS.secondary];
