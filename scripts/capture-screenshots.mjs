/**
 * Recapture les screenshots des projets (placeholders affichés avant l'iframe).
 *
 * Parse src/data/projects.ts pour récupérer id / link / image de chaque projet,
 * capture chaque site live avec Playwright (1920x1080), redimensionne en 1200px
 * de large et écrit le fichier au chemin exact référencé par `image` (png ou webp).
 *
 * Les projets GitHub-only (link vers github.com) sont ignorés : leur image
 * n'est pas utilisée par la vue projet.
 *
 * Usage : node scripts/capture-screenshots.mjs [slug ...]
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_FILE = path.join(ROOT, "src/data/projects.ts");

const VIEWPORT = { width: 1920, height: 1080 };
const TARGET_WIDTH = 1200;

// Délai après networkidle pour laisser passer preloaders et animations d'entrée.
const DEFAULT_SETTLE_MS = 5000;
const SETTLE_OVERRIDES = {
  // slug: ms
};

async function parseProjects() {
  const source = await readFile(PROJECTS_FILE, "utf8");
  const projects = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?link:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
  for (const [, id, link, image] of source.matchAll(re)) {
    projects.push({ id, link, image });
  }
  return projects;
}

async function capture(browser, project) {
  const url = project.link.startsWith("https://") ? project.link : `https://${project.link}`;
  const outPath = path.join(ROOT, "public", project.image);
  const format = path.extname(outPath).toLowerCase() === ".webp" ? "webp" : "png";

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: "fr-FR",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  } catch {
    // networkidle peut ne jamais arriver (websockets, polling) : on continue
    // si le DOM est chargé, le settle ci-dessous laisse le temps au rendu.
  }
  await page.waitForTimeout(SETTLE_OVERRIDES[project.id] ?? DEFAULT_SETTLE_MS);

  // Ferme un éventuel bandeau cookies avant la capture.
  try {
    await page
      .getByText(/^(tout accepter|accept all|j'accepte|accepter|accept)$/i)
      .first()
      .click({ timeout: 1500 });
    await page.waitForTimeout(800);
  } catch {
    // pas de bandeau : rien à faire
  }

  await page.mouse.move(0, 0);

  const raw = await page.screenshot({ type: "png" });
  await context.close();

  const image = sharp(raw).resize({ width: TARGET_WIDTH });
  const buffer =
    format === "webp"
      ? await image.webp({ quality: 88 }).toBuffer()
      : await image.png().toBuffer();

  // Garde-fou : une page blanche/unie (erreur, écran de garde) ne doit pas
  // écraser une capture correcte existante.
  const stats = await sharp(buffer).stats();
  const uniform = stats.channels.every((c) => c.stdev < 3);
  if (uniform) {
    throw new Error("capture quasi uniforme (page vide ou bloquée ?)");
  }

  await writeFile(outPath, buffer);
  const { size } = await stat(outPath);
  return { outPath, size };
}

const only = process.argv.slice(2);
const projects = (await parseProjects()).filter(
  (p) => !p.link.includes("github.com") && (only.length === 0 || only.includes(p.id))
);

if (projects.length === 0) {
  console.error("Aucun projet à capturer.");
  process.exit(1);
}

const browser = await chromium.launch();
let failures = 0;

for (const project of projects) {
  try {
    const { outPath, size } = await capture(browser, project);
    console.log(`ok  ${project.id} -> ${path.relative(ROOT, outPath)} (${Math.round(size / 1024)} KB)`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${project.id} (${project.link}): ${error.message}`);
  }
}

await browser.close();

// Les échecs laissent l'ancienne image en place : on ne fait échouer le job
// que si aucune capture n'a abouti.
if (failures === projects.length) process.exit(1);
