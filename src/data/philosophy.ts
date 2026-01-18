export type EffectType = "liquid" | "matrix" | "pulse" | "network";

export interface Principle {
  key: string;
  effect: EffectType;
  color: string; // Hex color for the zone
  position: { x: number; y: number }; // Normalized position (0-1)
}

export const principles: Principle[] = [
  {
    key: "magic",
    effect: "liquid",
    color: "#ff4d00", // Orange accent
    position: { x: 0.25, y: 0.25 }, // Top-left quadrant
  },
  {
    key: "fullstack",
    effect: "matrix",
    color: "#00ff88", // Green matrix-style
    position: { x: 0.75, y: 0.25 }, // Top-right quadrant
  },
  {
    key: "obsessed",
    effect: "pulse",
    color: "#ff006e", // Magenta pulse
    position: { x: 0.25, y: 0.75 }, // Bottom-left quadrant
  },
  {
    key: "human",
    effect: "network",
    color: "#00d4ff", // Cyan connections
    position: { x: 0.75, y: 0.75 }, // Bottom-right quadrant
  },
];

export const getPhilosophyByKey = (key: string) => {
  return principles.find((p) => p.key === key);
};
