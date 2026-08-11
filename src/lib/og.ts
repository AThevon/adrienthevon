import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const ASSET_DIR = join(process.cwd(), "assets", "og");

type OgAssets = {
  fonts: {
    name: string;
    data: Buffer;
    weight: 400 | 700;
    style: "normal";
  }[];
  logo: string;
};

let cached: Promise<OgAssets> | null = null;

async function load(): Promise<OgAssets> {
  const [display, mono, monoBold, logo] = await Promise.all([
    readFile(join(ASSET_DIR, "DelaGothicOne-Regular.ttf")),
    readFile(join(ASSET_DIR, "SpaceMono-Regular.ttf")),
    readFile(join(ASSET_DIR, "SpaceMono-Bold.ttf")),
    readFile(join(ASSET_DIR, "logo.png")),
  ]);

  return {
    fonts: [
      { name: "Dela Gothic One", data: display, weight: 400, style: "normal" },
      { name: "Space Mono", data: mono, weight: 400, style: "normal" },
      { name: "Space Mono", data: monoBold, weight: 700, style: "normal" },
    ],
    logo: `data:image/png;base64,${logo.toString("base64")}`,
  };
}

/** Charge polices + logo une seule fois par instance de fonction (Fluid Compute réutilise l'instance) */
export function getOgAssets(): Promise<OgAssets> {
  cached ??= load();
  return cached;
}

/** Taille de titre adaptative : Dela Gothic One est très large, un titre long doit rétrécir */
export function fitDisplaySize(text: string): number {
  const len = text.length;
  if (len <= 7) return 132;
  if (len <= 10) return 116;
  if (len <= 14) return 96;
  if (len <= 20) return 78;
  return 64;
}

/** Convertit un hex en rgba, pour les halos et bordures teintés par projet */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Tronque une ligne de texte pour le rendu OG (pas de coupure au milieu d'un mot) */
export function ogClamp(input: string, max: number): string {
  const flat = input.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}...`;
}
