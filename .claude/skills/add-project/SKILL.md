---
name: add-project
description: Use when the user wants to add a new project to this portfolio (adrienthevon). The user provides a GitHub repo URL, a live site URL, or both — this skill deduces all the metadata, fetches/generates the assets, writes FR + EN translations, and updates `src/data/projects.ts` and the i18n files. Trigger when the user says things like "ajoute un projet", "add this project", or invokes /add-project with a URL. Always trigger when the user provides a GitHub or website URL with intent to add it as a portfolio entry.
---

# Add Project

Adds a new project entry to this portfolio (Adrien Thevon's site) from a GitHub repo URL and/or a live site URL. Deduces metadata, fetches assets, generates image variants, writes FR + EN translations, and updates the data files.

## Inputs

The user invokes the skill with at least one of:
- A GitHub repo URL (e.g. `https://github.com/AThevon/foo`)
- A live site URL (e.g. `https://foo.athevon.dev`)

Both is ideal. If only one is provided, do your best — and ask the user to fill the rest if necessary.

## High-level workflow

1. **Locate the repo** — check `~/projects/<name>` first (the user keeps repos there). If absent, clone with `gh repo clone <url> /tmp/add-project-<slug>`.
2. **Extract metadata** — parse README, `package.json`, theme files, etc.
3. **Fetch assets** — logo + main image (live site OG / README banner / etc.). Generate `-small`, `-medium`, full variants.
4. **Map skills** — match detected techs against `src/data/skills.ts`. Propose adding new skills if needed.
5. **Pick a color** — auto-detect from theme files; if none, ask the user.
6. **Draft FR + EN content** — description, longDescription, sections (intro / challenge / process / result), category, role, client.
7. **Show the plan to the user** — full preview of what will be written, with the chance to tweak any field.
8. **Write to files** — `src/data/projects.ts`, `messages/fr.json`, `messages/en.json`, plus image files.
9. **Cleanup** — remove the temp clone if any. Print a recap.

Do not commit. The user reviews the diff manually.

## Phase 1 — Locate the repo

Derive the repo name from the GitHub URL (last path segment, stripped of `.git`). Then:

```bash
# Check user's projects dir first
REPO_DIR="$HOME/projects/$REPO_NAME"
if [ -d "$REPO_DIR" ]; then
  echo "Found local repo at $REPO_DIR"
else
  REPO_DIR="/tmp/add-project-$REPO_NAME"
  rm -rf "$REPO_DIR"
  gh repo clone "$REPO_URL" "$REPO_DIR" -- --depth=1
fi
```

If only a live URL is provided, ask the user for the repo URL — most metadata comes from there. If the project is not open-source, ask whether to proceed with site-only data.

## Phase 2 — Extract metadata

Read these files (in order of preference) using Read/Grep/Glob (NOT raw `cat`):

- `README.md` / `README.fr.md` — project description, screenshots, banner image
- `package.json` — name, dependencies (for skill detection)
- `pyproject.toml`, `Cargo.toml`, `go.mod`, `flake.nix` — for non-JS projects
- `tailwind.config.{ts,js}`, `theme.{ts,json}`, `src/lib/colors*`, CSS files — for primary color

Derive these fields:

| Field | How to derive |
|---|---|
| `id` | kebab-case slug from repo name (e.g. `under-the-flow`) |
| `title` | UPPERCASE of the slug, hyphens to spaces (e.g. `UNDER THE FLOW`) |
| `category` | Short uppercase label inferred from project type. See category examples below |
| `year` | Year of most recent commit on the default branch (`git log -1 --format=%cd --date=format:%Y`) |
| `date` | `YYYY-MM` of the most recent meaningful commit (initial release if available, else last commit) |
| `description` | One sentence (~120 chars), pulled or summarized from README intro |
| `longDescription` | 2-3 short paragraphs, joined with `\n\n`. Tone: punchy, first-person, slightly informal — match existing entries in `projects.ts` |
| `tags` | 3-5 visible tech tags, UPPERCASE (e.g. `["NEXT.JS", "TAILWIND", "MOTION"]`) |
| `skills` | See Phase 4 |
| `role` | Inferred or asked. Common values: `DÉVELOPPEUR FULL-STACK`, `DÉVELOPPEUR FRONT-END`, `CRÉATEUR & DÉVELOPPEUR` |
| `client` | `OPEN SOURCE` for open repos, `PROJET PERSONNEL` for personal closed projects, otherwise client name UPPERCASE |
| `link` | Live URL if provided, else the GitHub URL |
| `image` | `/images/projects/<slug>-medium.png` |
| `logo` | `/images/logos/<slug>.<ext>` (extension follows source — png/svg/webp) |

**Category examples** (see existing projects for tone):
- `WEB PLATFORM` / `PLATEFORME WEB`
- `PORTFOLIO`
- `WEB AGENCY` / `AGENCE WEB`
- `CREATIVE TOOL` / `OUTIL CRÉATIF`
- `CLI TOOL` / `OUTIL CLI`
- `MACOS APP` / `APP MACOS`
- `IMAGE PROCESSING` (same in FR)
- `SECURITY TOOL` / `OUTIL SÉCURITÉ`
- `CLI / TUI` (same in FR)

For full data shapes including `ProjectSection`, see `references/data-shapes.md`.

## Phase 3 — Fetch and generate assets

### Logo

Search the repo for a logo file. Try these globs in order:
- `**/logo.{png,svg,webp,jpg}`
- `**/icon.{png,svg,webp}`
- `**/{assets,public,docs,.github}/**/*.{png,svg}` and grep filenames matching `logo|icon|brand`
- `favicon.{ico,png,svg}` (last resort)

Copy the chosen file to `public/images/logos/<slug>.<ext>`. Keep the original extension. Don't resize logos — they're displayed at multiple sizes.

If no logo is found, ask the user for a path or URL, or whether to skip the `logo` field (it's optional).

### Main image

The main image is a hero/screenshot of the project. Existing dimensions:
- Full: ~3006x1718 (16:9-ish, but keep source ratio)
- `-medium`: 1200px wide, height proportional
- `-small`: 600px wide, height proportional

Source priority:
1. Live site `og:image` (highest quality usually). Use WebFetch on the live URL and look for `<meta property="og:image" content="...">`.
2. README banner — first image in README that's wider than tall, or in a `## Screenshot`/`## Demo` section.
3. Files matching `**/{banner,hero,screenshot,demo,cover}.{png,jpg,webp}` in the repo.
4. If still nothing, ask the user.

Save the source as `public/images/projects/<slug>.png`, then generate the variants:

```bash
SRC="public/images/projects/<slug>.png"
magick "$SRC" -resize 1200x "public/images/projects/<slug>-medium.png"
magick "$SRC" -resize 600x  "public/images/projects/<slug>-small.png"
```

If the source isn't already PNG, convert it first with `magick <source> public/images/projects/<slug>.png`.

If the source is much smaller than 1200px wide, warn the user and ask whether to upscale (not recommended) or use a smaller image.

## Phase 4 — Skills mapping

Read `src/data/skills.ts` to see existing skill IDs (currently: react, nextjs, vue, nuxt, typescript, tailwind, html, css, swift, threejs, canvas, motion, gsap, nodejs, postgresql, drizzle, supabase, git, github, vercel, vite, shell, nix, figma, plus any added since).

Detect techs from:
- `package.json` deps + devDeps → JS frameworks/libs
- `pyproject.toml` / `Cargo.toml` / `go.mod` / `flake.nix` → other languages
- File extensions in the repo
- README mentions

For each detected tech:
- If it matches an existing skill ID → add to the `skills` array.
- If no match → propose to the user: "Detected `elixir` (or similar). Existing skills don't cover this. Add it as a new skill, or skip?"

When adding a new skill, you must update three things:

1. `src/data/skills.ts` — add a new entry to the `skills` array with `id`, `name`, `category` (frontend/backend/creative/tools/design), `connections` (pick 1-3 related existing skills), and `description`.
2. `src/lib/skillLogos.ts` — add the Simple Icons slug (browse https://simpleicons.org/ to find it; the slug is the filename without extension, lowercased) and a brand color hex.
3. After both edits, the new skill ID can be used in the project's `skills` array.

If the tech has no Simple Icon, propose using a generic icon (e.g. `nodedotjs` for Node-related, or ask the user for a URL).

Generally include 4-8 skills per project. Don't dump every dep — pick the ones that are core to the project's identity, matching how existing projects do it.

## Phase 5 — Color

Auto-detect priority:
1. Tailwind config: search for `primary`, `accent`, `brand` keys in `tailwind.config.{ts,js}` or theme files.
2. CSS custom properties: grep for `--primary`, `--accent`, `--color-primary` in `**/*.css`.
3. Theme files: `theme.{ts,json}`, `colors.{ts,json}`, `tokens.{ts,json}`.
4. README: hex codes near words like "color", "brand", "palette".
5. Logo dominant color: extract using `magick logo.png -resize 1x1 txt:` and parse the hex (last resort, can be unreliable).

If a candidate is found, propose it: "Detected `#10B981` from tailwind.config.ts. Use it?"

If nothing convincing is found, ask the user: "What accent color should the project use? (hex)"

Don't reuse a color that already exists in `projects.ts` unless the user insists — colors visually distinguish projects in the gallery.

## Phase 6 — Draft FR + EN content

Write everything in French first (the user's primary language), then translate to English. The translation must preserve the punchy, slightly informal tone — not a literal word-for-word translation.

Sections always follow the pattern: `intro`, `challenge`, `process`, `result`. Each has a `title` (short, uppercase, evocative) and `content` (1-2 sentences).

Look at how existing projects vary the section titles for inspiration:
- intro: `L'IDÉE`, `LE BRIEF`, `LA VISION`, `LE BESOIN`, `LE PROBLÈME`, `LA MISSION`
- challenge: `LE DÉFI` (most common)
- process: `LE PROCESS` (most common)
- result: `LE RÉSULTAT` (most common)

Pick titles that fit the project. EN equivalents: `THE IDEA`, `THE BRIEF`, `THE CHALLENGE`, `THE PROCESS`, `THE RESULT`, `THE NEED`, etc.

**Important typography rule from the user's global instructions:** never use the em dash (—). Use a regular hyphen (-) or rephrase. This applies to all generated content (FR and EN).

## Phase 7 — Show the plan and get user approval

Before writing anything, present the full project entry to the user as a structured preview. Include:
- Slug, title, category, year, date, color
- `tags`, `skills` (and any new skills you'll add)
- role, client, link
- description, longDescription (FR + EN)
- All 4 sections (FR + EN)
- Image source(s) used and where they'll be saved
- Skills additions (if any)

Ask: "Ok comme ça ? Dis-moi ce qu'il faut changer, ou go pour écrire les fichiers."

Iterate as needed. Only proceed to Phase 8 when the user explicitly approves.

## Phase 8 — Write the files

Make these edits, in this order:

1. **`src/data/skills.ts`** (only if new skills were added). Add the new entries to the `skills` array. Be careful to also add new entries to the `connections` arrays of related existing skills if it makes sense (the graph is bidirectional).

2. **`src/lib/skillLogos.ts`** (only if new skills were added). Add to `iconMapping` and `logoColors`.

3. **`src/data/projects.ts`**. Insert the new `Project` object into the `allProjects` array. Insertion order doesn't matter for display (the array is sorted by `date`), but for readability put it near projects with similar dates.

4. **`messages/fr.json`** and **`messages/en.json`**. Add the new project under the `projectsData` key. The key in the JSON is the slug in **camelCase** (not kebab-case): `under-the-flow` → `underTheFlow`. See `references/data-shapes.md` for the exact i18n shape.

5. **Image files**. Copy the logo to `public/images/logos/<slug>.<ext>` and the three image variants to `public/images/projects/`.

After every write, verify the file is valid (TypeScript compiles, JSON parses). For JSON, run `node -e "JSON.parse(require('fs').readFileSync('messages/fr.json'))"` (and same for en). Don't run the build — the user will do that.

## Phase 9 — Cleanup and recap

If you cloned to `/tmp/add-project-<slug>`, remove it: `rm -rf /tmp/add-project-<slug>`.

Print a short recap:
- What was added (slug, title)
- Files modified
- New skills (if any)
- Image variants generated
- Suggest the user run `npm run lint` or check the dev server to validate

Do not git commit. The user reviews the diff manually.

## Edge cases and tips

- **Repo is private and not local**: ask the user. `gh repo clone` works on private repos with auth, but warn before pulling lots of data.
- **No live site, no images in repo**: ask the user for an image path/URL.
- **Slug collision**: if `getProjectById(slug)` would already match, ask whether to overwrite or pick a different slug.
- **Multi-language repo (e.g. README.md + README.fr.md)**: prefer the FR README for description tone, but cross-reference both.
- **Repo uses non-standard structure**: don't get stuck. Ask the user once, then proceed with what they say.
- **User pushes back on a draft**: take their direction literally. Don't argue. Re-present after editing.
