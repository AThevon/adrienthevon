# Work Page Timeline Rework - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the /work page with a Canvas 2D horizontal timeline + DOM takeover panel, add 5 new projects, clean up skills/data.

**Architecture:** Hybrid Canvas + DOM. The Canvas handles the interactive timeline (nodes, effects, constellation lines), while a DOM panel slides up for project details (iframe, description, badges). Mobile gets a vertical DOM timeline with accordion expand.

**Tech Stack:** Canvas 2D, motion/react (useScroll, useTransform, useSpring, AnimatePresence), next-intl, existing hooks (useDeviceDetect, usePerformance).

**Spec:** `docs/superpowers/specs/2026-04-08-work-page-timeline-design.md`

---

## File Structure

### New files
- `src/components/sections/ProjectTimeline.tsx` - Canvas 2D horizontal timeline (desktop)
- `src/components/sections/ProjectTakeover.tsx` - DOM detail panel with iframe (desktop)
- `src/components/sections/ProjectTimelineMobile.tsx` - Vertical timeline with accordion (mobile)

### Modified files
- `src/data/projects.ts` - Remove depense-man, rename wt→worktigre, add 5 new projects, fix dates/links/colors
- `src/data/skills.ts` - Add shell/swift/nix, remove 10 orphan skills, update connections
- `src/lib/skillLogos.ts` - Update logo URLs for new/removed skills
- `src/app/work/page.tsx` - Full rewrite: desktop=ProjectTimeline+ProjectTakeover, mobile=ProjectTimelineMobile
- `src/components/ui/MagneticButton.tsx` - Fix magnetic "flee" effect (cap displacement)
- `messages/fr.json` - Remove depenseMan, rename wt→worktigre, add 5 new project translations
- `messages/en.json` - Same in English

### Deleted routes (no longer routed, keep files for reference)
- `src/app/work/[slug]/page.tsx` - No longer linked
- `src/app/work/[slug]/immersive/page.tsx` - No longer linked

---

## Task 1: Update project data (projects.ts)

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Remove Dépense Man**

Delete the entire `depense-man` project object from the `allProjects` array (lines 69-110 approximately, the object with `id: "depense-man"`).

- [ ] **Step 2: Rename wt → worktigre and update fields**

Replace the `wt` project entry with:

```typescript
{
  id: "worktigre",
  title: "WORKTIGRE",
  category: "CLI TOOL",
  year: "2026",
  date: "2026-01",
  color: "#EE982B",
  description: "Git worktree manager interactif avec intégration GitHub CLI, fzf et Claude AI.",
  longDescription: `WorkTigre simplifie radicalement la gestion des branches Git via les worktrees. Un seul outil pour naviguer, créer, supprimer et switcher entre tes worktrees.

Intégration GitHub CLI pour les PRs et issues, fzf pour la navigation fuzzy, et Claude AI pour l'assistance intelligente. Fix CI, review PRs, résolution de problèmes - le tout depuis le terminal.`,
  tags: ["SHELL", "CLI", "GIT", "FZF", "CLAUDE AI"],
  skills: ["shell", "git", "github", "nix"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://worktigre.vercel.app",
  image: "/images/projects/wt-tiger-medium.png",
  sections: [
    {
      type: "intro",
      title: "L'IDÉE",
      content: "Rendre la gestion des worktrees Git aussi simple que de changer de branche. Un CLI puissant mais intuitif.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Créer une expérience utilisateur fluide en terminal. Intégrer plusieurs outils (git, gh, fzf, claude) de manière cohérente.",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "100% Shell/Bash pour la portabilité. Navigation fuzzy avec fzf. Intégration native GitHub CLI. Assistant Claude pour les tâches complexes.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "Un outil open source distribué via Homebrew, Nix et script universel. Utilisé au quotidien pour gérer des dizaines de worktrees.",
    },
  ],
},
```

- [ ] **Step 3: Fix existing project data**

In the `victor-denay` entry:
- Change `date: "2024-03"` → `date: "2024-08"`
- Change `link: "https://victordenay.com"` → `link: "https://victordenay.vercel.app"`
- Change `color: "#1890ff"` → `color: "#08C566"`

In the `under-the-flow` entry:
- Change `date: "2025-05"` → `date: "2025-03"`
- Change `color: "#60cbd7"` → `color: "#2BBADC"`

In the `blenkdev` entry:
- Change `date: "2024-05"` → `date: "2024-04"`
- Change `color: "#fdbb00"` → `color: "#FE1832"`

In the `linekut` entry:
- Change `color: "#F97316"` → `color: "#EE4E83"`
- Change `skills` array: remove `"html"` and `"css"` → `["nextjs", "react", "typescript", "tailwind", "canvas", "git", "vercel", "figma"]`

- [ ] **Step 4: Add 5 new projects**

Add these 5 project objects to the `allProjects` array:

```typescript
{
  id: "tokeneater",
  title: "TOKENEATER",
  category: "MACOS APP",
  year: "2026",
  date: "2026-02",
  color: "#FFAF40",
  description: "App native macOS pour surveiller ta consommation Claude AI en temps réel.",
  longDescription: `TokenEater vit dans ta menu bar et surveille ton utilisation de Claude AI. Pourcentages live, seuils colorés, widgets natifs WidgetKit, et un overlay flottant qui montre tes sessions Claude Code actives.

Smart pacing pour savoir si tu brûles tes tokens ou si tu cruises. Clic sur une session dans l'overlay pour sauter directement au bon terminal.`,
  tags: ["SWIFT", "SWIFTUI", "WIDGETKIT", "MACOS"],
  skills: ["swift"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://tokeneater.vercel.app",
  image: "/images/projects/tokeneater-medium.png",
  sections: [
    {
      type: "intro",
      title: "LE BESOIN",
      content: "Savoir en temps réel combien de tokens il me reste sur Claude. Sans ouvrir le navigateur, sans interrompre le flow.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Créer une app macOS native performante avec menu bar, widgets WidgetKit, et un overlay flottant. Le tout en Swift pur.",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "SwiftUI pour l'UI, WidgetKit pour les widgets desktop, scraping intelligent de l'API Claude. Distribution via DMG et Homebrew.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "Une app que j'utilise toute la journée. Menu bar discrète, widgets sur le bureau, overlay qui me montre mes sessions actives.",
    },
  ],
},
{
  id: "pix2paint",
  title: "PIX2PAINT",
  category: "IMAGE PROCESSING",
  year: "2026",
  date: "2026-03",
  color: "#6C5CE7",
  description: "Transforme n'importe quelle image en grille paint-by-numbers. 100% navigateur.",
  longDescription: `Drop ton image, ajuste les paramètres, récupère une grille numérotée prête à peindre. Deux modes : pixel classique et smooth avec contours organiques.

Quantification de couleurs (max 20), numérotation par région, export PNG. Tout le traitement tourne dans un Web Worker, zéro lag UI. Persistence IndexedDB pour reprendre où tu en étais.`,
  tags: ["VITE", "CANVAS", "WEB WORKERS", "TYPESCRIPT"],
  skills: ["typescript", "vite", "canvas"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://pix2paint.vercel.app",
  image: "/images/projects/pix2paint-medium.png",
  sections: [
    {
      type: "intro",
      title: "L'IDÉE",
      content: "Transformer une photo en grille paint-by-numbers en quelques clics. Gratuit, sans compte, 100% dans le navigateur.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Traitement d'image lourd côté client sans bloquer l'UI. Quantification de couleurs précise et contours organiques.",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "Vite + TypeScript vanilla, zéro framework. Web Worker pour le processing, Canvas 2D pour le rendu, IndexedDB pour la persistence.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "Un outil fluide qui transforme n'importe quelle image en grille prête à peindre. Export PNG haute résolution.",
    },
  ],
},
{
  id: "yeetbg",
  title: "YEETBG",
  category: "IMAGE PROCESSING",
  year: "2026",
  date: "2026-03",
  color: "#E8E8E8",
  description: "Background removal par IA + éditeur de couleurs interactif. Zéro serveur.",
  longDescription: `Drop une image, l'IA retire le fond, tu recolores ce que tu veux. Segmentation ONNX dans un Web Worker pour zéro lag. Clustering K-means++ en espace Lab pour regrouper les couleurs similaires.

Éditeur interactif : clique sur le canvas ou la palette pour supprimer des couleurs. Recolore individuellement. Export PNG, JPG ou WebP. Undo/redo complet.`,
  tags: ["VITE", "CANVAS", "AI/ONNX", "WEB WORKERS"],
  skills: ["typescript", "vite", "canvas"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://yeetbg.vercel.app",
  image: "/images/projects/yeetbg-medium.png",
  sections: [
    {
      type: "intro",
      title: "L'IDÉE",
      content: "Supprimer le fond d'une image et recolorer les zones restantes. Le tout dans le navigateur, sans upload.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Faire tourner un modèle IA (ONNX) côté client sans exploser les perfs. Clustering de couleurs précis en espace Lab.",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "Vite + TypeScript vanilla. @imgly/background-removal dans un Web Worker. K-means++ pour le clustering. Design brutaliste noir/blanc.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "Un outil rapide et privacy-first. Drop, remove, recolor, export. Rien ne quitte ton navigateur.",
    },
  ],
},
{
  id: "nixdash",
  title: "NIXDASH",
  category: "CLI / TUI",
  year: "2026",
  date: "2026-03",
  color: "#8055E3",
  description: "Interface terminal interactive pour gérer tes packages Nix.",
  longDescription: `NixDash donne une interface humaine à Nix. Browse tes packages installés, recherche fuzzy dans 177k+ nixpkgs, installe ou supprime avec preview de diff.

Shells temporaires pour tester un package avant de l'installer. Gestion de flakes externes. Raccourcis clavier pour tout. Compatible Home Manager, NixOS et tout setup Nix flake.`,
  tags: ["SHELL", "NIX", "TUI", "FZF"],
  skills: ["shell", "nix"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://nixdash.vercel.app",
  image: "/images/projects/nixdash-medium.png",
  sections: [
    {
      type: "intro",
      title: "L'IDÉE",
      content: "Rendre Nix accessible. Un TUI interactif qui remplace les commandes cryptiques par une expérience fluide.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Parser l'écosystème Nix (177k+ packages) et offrir une recherche fuzzy rapide. Gérer les différents setups (Home Manager, NixOS).",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "100% Shell avec fzf, gum et jq. Nix flake pour la distribution. Preview de diff avant chaque changement.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "Un hub interactif pour Nix. Browse, search, install, shell temporaire - tout en quelques touches.",
    },
  ],
},
{
  id: "envora",
  title: "ENVORA",
  category: "SECURITY TOOL",
  year: "2026",
  date: "2026-04",
  color: "#10B981",
  description: "Vault chiffré pour tes .env. Push/pull entre machines, chiffrement age.",
  longDescription: `Tes .env contiennent des secrets qui ne peuvent pas aller dans git. Mais ils doivent exister sur chaque machine. Envora les stocke dans un repo git privé, chiffrés avec age.

Une clé age, stockée dans ton password manager, déverrouille tout le vault. Push chiffre et stocke, pull déchiffre et restaure. Même si le repo est compromis, tes secrets restent safe.`,
  tags: ["SHELL", "AGE", "GIT", "NIX"],
  skills: ["shell", "git", "nix"],
  role: "CRÉATEUR & DÉVELOPPEUR",
  client: "OPEN SOURCE",
  link: "https://github.com/AThevon/envora",
  image: "/images/projects/envora-medium.png",
  sections: [
    {
      type: "intro",
      title: "LE PROBLÈME",
      content: "Les .env ne vont pas dans git. Mais tu bosses sur 3 machines. Envora résout ce dilemme avec du chiffrement.",
    },
    {
      type: "challenge",
      title: "LE DÉFI",
      content: "Chiffrement transparent, zéro friction. Une seule clé pour tout débloquer. Cross-platform (macOS, Linux, WSL).",
    },
    {
      type: "process",
      title: "LE PROCESS",
      content: "Shell + age encryption + git comme transport. Nix flake pour la distribution. Interface fzf/gum pour la sélection.",
    },
    {
      type: "result",
      title: "LE RÉSULTAT",
      content: "ev push, ev pull. Deux commandes. Tous tes secrets synchronisés et chiffrés. Simple et bulletproof.",
    },
  ],
},
```

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit`
Expected: No type errors related to projects.ts

```bash
git add src/data/projects.ts
git commit -m "data: update projects - remove depense-man, rename wt to worktigre, add 5 new projects, fix dates/colors/links"
```

---

## Task 2: Update skills data (skills.ts + skillLogos.ts)

**Files:**
- Modify: `src/data/skills.ts`
- Modify: `src/lib/skillLogos.ts`

- [ ] **Step 1: Remove orphan skills**

In `src/data/skills.ts`, delete these skill objects from the `skills` array:
- `firebase` (id: "firebase")
- `prisma` (id: "prisma")
- `express` (id: "express")
- `webpack` (id: "webpack")
- `r3f` (id: "r3f")
- `drei` (id: "drei")
- `glsl` (id: "glsl")
- `webgl` (id: "webgl")
- `photoshop` (id: "photoshop")
- `illustrator` (id: "illustrator")

- [ ] **Step 2: Clean up broken connections**

After removing those skills, update the `connections` arrays of remaining skills to remove references to deleted skill IDs:

- `react`: remove `"threejs"` from connections only if threejs was removed (it wasn't - keep it). Remove nothing.
- `html`: remove `"webgl"` → connections become `["css", "canvas"]`
- `canvas`: remove `"webgl"` → connections become `["html", "motion"]`
- `threejs`: remove `"webgl"`, `"glsl"`, `"r3f"` → connections become `["react", "nextjs", "nuxt"]`
- `nodejs`: remove `"express"` → connections become `["typescript", "nextjs", "postgresql"]`
- `postgresql`: remove `"prisma"` → connections become `["nodejs", "express"]` wait, express is also removed → `["nodejs"]`
- `figma`: remove `"photoshop"` → connections become `["css", "tailwind"]`
- `vite`: connections stay `["react", "typescript"]`

- [ ] **Step 3: Add new skills**

Add these 3 skill objects to the `skills` array:

```typescript
// In the Tools section
{
  id: "shell",
  name: "Shell",
  category: "tools",
  connections: ["git", "github", "nix"],
  description: "Bash/Zsh, scripts CLI, automation",
},
{
  id: "nix",
  name: "Nix",
  category: "tools",
  connections: ["shell", "git"],
  description: "Nix flakes, packages, reproducible builds",
},

// In the Frontend section
{
  id: "swift",
  name: "Swift",
  category: "frontend",
  connections: [],
  description: "SwiftUI, macOS natif, WidgetKit",
},
```

Also update existing skills to add reverse connections:
- `git`: add `"shell"` and `"nix"` to connections → `["github", "vercel", "shell", "nix"]`
- `github`: add `"shell"` to connections → `["git", "vercel", "shell"]`

- [ ] **Step 4: Update skillLogos.ts**

In `src/lib/skillLogos.ts`, add logo URLs for new skills and remove entries for deleted skills. Add:

```typescript
shell: "https://cdn.simpleicons.org/gnubash/white",
swift: "https://cdn.simpleicons.org/swift/white",
nix: "https://cdn.simpleicons.org/nixos/white",
```

Remove entries for: `firebase`, `prisma`, `express`, `webpack`, `r3f`, `drei`, `glsl`, `webgl`, `photoshop`, `illustrator`.

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit`
Expected: No type errors.

```bash
git add src/data/skills.ts src/lib/skillLogos.ts
git commit -m "data: clean up skills - add shell/swift/nix, remove 10 orphan skills"
```

---

## Task 3: Update translations (fr.json + en.json)

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Update fr.json - remove depenseMan, rename wt**

In `messages/fr.json`:
- Delete the entire `projectsData.depenseMan` object
- Rename `projectsData.wt` to `projectsData.worktigre` (change the key name, keep the content but update the description):

```json
"worktigre": {
  "category": "OUTIL CLI",
  "description": "Git worktree manager interactif avec intégration GitHub CLI, fzf et Claude AI.",
  "longDescription": "WorkTigre simplifie radicalement la gestion des branches Git via les worktrees. Un seul outil pour naviguer, créer, supprimer et switcher entre tes worktrees.\n\nIntégration GitHub CLI pour les PRs et issues, fzf pour la navigation fuzzy, et Claude AI pour l'assistance intelligente. Fix CI, review PRs, résolution de problèmes - le tout depuis le terminal.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "L'IDÉE", "content": "Rendre la gestion des worktrees Git aussi simple que de changer de branche. Un CLI puissant mais intuitif." },
    "challenge": { "title": "LE DÉFI", "content": "Créer une expérience utilisateur fluide en terminal. Intégrer plusieurs outils (git, gh, fzf, claude) de manière cohérente." },
    "process": { "title": "LE PROCESS", "content": "100% Shell/Bash pour la portabilité. Navigation fuzzy avec fzf. Intégration native GitHub CLI. Assistant Claude pour les tâches complexes." },
    "result": { "title": "LE RÉSULTAT", "content": "Un outil open source distribué via Homebrew, Nix et script universel. Utilisé au quotidien pour gérer des dizaines de worktrees." }
  }
}
```

- [ ] **Step 2: Add 5 new project translations to fr.json**

Add inside `projectsData`:

```json
"tokeneater": {
  "category": "APP MACOS",
  "description": "App native macOS pour surveiller ta consommation Claude AI en temps réel.",
  "longDescription": "TokenEater vit dans ta menu bar et surveille ton utilisation de Claude AI. Pourcentages live, seuils colorés, widgets natifs WidgetKit, et un overlay flottant qui montre tes sessions Claude Code actives.\n\nSmart pacing pour savoir si tu brûles tes tokens ou si tu cruises. Clic sur une session dans l'overlay pour sauter directement au bon terminal.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "LE BESOIN", "content": "Savoir en temps réel combien de tokens il me reste sur Claude. Sans ouvrir le navigateur, sans interrompre le flow." },
    "challenge": { "title": "LE DÉFI", "content": "Créer une app macOS native performante avec menu bar, widgets WidgetKit, et un overlay flottant. Le tout en Swift pur." },
    "process": { "title": "LE PROCESS", "content": "SwiftUI pour l'UI, WidgetKit pour les widgets desktop, scraping intelligent de l'API Claude. Distribution via DMG et Homebrew." },
    "result": { "title": "LE RÉSULTAT", "content": "Une app que j'utilise toute la journée. Menu bar discrète, widgets sur le bureau, overlay qui me montre mes sessions actives." }
  }
},
"pix2paint": {
  "category": "IMAGE PROCESSING",
  "description": "Transforme n'importe quelle image en grille paint-by-numbers. 100% navigateur.",
  "longDescription": "Drop ton image, ajuste les paramètres, récupère une grille numérotée prête à peindre. Deux modes : pixel classique et smooth avec contours organiques.\n\nQuantification de couleurs (max 20), numérotation par région, export PNG. Tout le traitement tourne dans un Web Worker, zéro lag UI. Persistence IndexedDB pour reprendre où tu en étais.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "L'IDÉE", "content": "Transformer une photo en grille paint-by-numbers en quelques clics. Gratuit, sans compte, 100% dans le navigateur." },
    "challenge": { "title": "LE DÉFI", "content": "Traitement d'image lourd côté client sans bloquer l'UI. Quantification de couleurs précise et contours organiques." },
    "process": { "title": "LE PROCESS", "content": "Vite + TypeScript vanilla, zéro framework. Web Worker pour le processing, Canvas 2D pour le rendu, IndexedDB pour la persistence." },
    "result": { "title": "LE RÉSULTAT", "content": "Un outil fluide qui transforme n'importe quelle image en grille prête à peindre. Export PNG haute résolution." }
  }
},
"yeetbg": {
  "category": "IMAGE PROCESSING",
  "description": "Background removal par IA + éditeur de couleurs interactif. Zéro serveur.",
  "longDescription": "Drop une image, l'IA retire le fond, tu recolores ce que tu veux. Segmentation ONNX dans un Web Worker pour zéro lag. Clustering K-means++ en espace Lab pour regrouper les couleurs similaires.\n\nÉditeur interactif : clique sur le canvas ou la palette pour supprimer des couleurs. Recolore individuellement. Export PNG, JPG ou WebP. Undo/redo complet.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "L'IDÉE", "content": "Supprimer le fond d'une image et recolorer les zones restantes. Le tout dans le navigateur, sans upload." },
    "challenge": { "title": "LE DÉFI", "content": "Faire tourner un modèle IA (ONNX) côté client sans exploser les perfs. Clustering de couleurs précis en espace Lab." },
    "process": { "title": "LE PROCESS", "content": "Vite + TypeScript vanilla. @imgly/background-removal dans un Web Worker. K-means++ pour le clustering. Design brutaliste noir/blanc." },
    "result": { "title": "LE RÉSULTAT", "content": "Un outil rapide et privacy-first. Drop, remove, recolor, export. Rien ne quitte ton navigateur." }
  }
},
"nixdash": {
  "category": "CLI / TUI",
  "description": "Interface terminal interactive pour gérer tes packages Nix.",
  "longDescription": "NixDash donne une interface humaine à Nix. Browse tes packages installés, recherche fuzzy dans 177k+ nixpkgs, installe ou supprime avec preview de diff.\n\nShells temporaires pour tester un package avant de l'installer. Gestion de flakes externes. Raccourcis clavier pour tout. Compatible Home Manager, NixOS et tout setup Nix flake.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "L'IDÉE", "content": "Rendre Nix accessible. Un TUI interactif qui remplace les commandes cryptiques par une expérience fluide." },
    "challenge": { "title": "LE DÉFI", "content": "Parser l'écosystème Nix (177k+ packages) et offrir une recherche fuzzy rapide. Gérer les différents setups (Home Manager, NixOS)." },
    "process": { "title": "LE PROCESS", "content": "100% Shell avec fzf, gum et jq. Nix flake pour la distribution. Preview de diff avant chaque changement." },
    "result": { "title": "LE RÉSULTAT", "content": "Un hub interactif pour Nix. Browse, search, install, shell temporaire - tout en quelques touches." }
  }
},
"envora": {
  "category": "OUTIL SÉCURITÉ",
  "description": "Vault chiffré pour tes .env. Push/pull entre machines, chiffrement age.",
  "longDescription": "Tes .env contiennent des secrets qui ne peuvent pas aller dans git. Mais ils doivent exister sur chaque machine. Envora les stocke dans un repo git privé, chiffrés avec age.\n\nUne clé age, stockée dans ton password manager, déverrouille tout le vault. Push chiffre et stocke, pull déchiffre et restaure. Même si le repo est compromis, tes secrets restent safe.",
  "role": "CRÉATEUR & DÉVELOPPEUR",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "LE PROBLÈME", "content": "Les .env ne vont pas dans git. Mais tu bosses sur 3 machines. Envora résout ce dilemme avec du chiffrement." },
    "challenge": { "title": "LE DÉFI", "content": "Chiffrement transparent, zéro friction. Une seule clé pour tout débloquer. Cross-platform (macOS, Linux, WSL)." },
    "process": { "title": "LE PROCESS", "content": "Shell + age encryption + git comme transport. Nix flake pour la distribution. Interface fzf/gum pour la sélection." },
    "result": { "title": "LE RÉSULTAT", "content": "ev push, ev pull. Deux commandes. Tous tes secrets synchronisés et chiffrés." }
  }
}
```

- [ ] **Step 3: Update en.json - same changes in English**

In `messages/en.json`:
- Delete `projectsData.depenseMan`
- Rename `projectsData.wt` → `projectsData.worktigre`:

```json
"worktigre": {
  "category": "CLI TOOL",
  "description": "Interactive git worktree manager with GitHub CLI, fzf and Claude AI integration.",
  "longDescription": "WorkTigre radically simplifies Git branch management through worktrees. One tool to navigate, create, delete and switch between worktrees.\n\nGitHub CLI integration for PRs and issues, fzf for fuzzy navigation, and Claude AI for intelligent assistance. Fix CI, review PRs, problem solving - all from the terminal.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE IDEA", "content": "Make Git worktree management as simple as switching branches. A powerful yet intuitive CLI." },
    "challenge": { "title": "THE CHALLENGE", "content": "Create a smooth terminal user experience. Integrate multiple tools (git, gh, fzf, claude) in a coherent way." },
    "process": { "title": "THE PROCESS", "content": "100% Shell/Bash for portability. Fuzzy navigation with fzf. Native GitHub CLI integration. Claude assistant for complex tasks." },
    "result": { "title": "THE RESULT", "content": "An open source tool distributed via Homebrew, Nix and universal script. Used daily to manage dozens of worktrees." }
  }
}
```

Add the 5 new projects in English:

```json
"tokeneater": {
  "category": "MACOS APP",
  "description": "Native macOS app to monitor your Claude AI usage in real-time.",
  "longDescription": "TokenEater lives in your menu bar and watches your Claude AI usage. Live percentages, color-coded thresholds, native WidgetKit widgets, and a floating overlay showing your active Claude Code sessions.\n\nSmart pacing to know if you're burning through tokens or cruising. Click a session in the overlay to jump to the right terminal.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE NEED", "content": "Know in real-time how many tokens I have left on Claude. Without opening the browser, without breaking the flow." },
    "challenge": { "title": "THE CHALLENGE", "content": "Create a performant native macOS app with menu bar, WidgetKit widgets, and a floating overlay. All in pure Swift." },
    "process": { "title": "THE PROCESS", "content": "SwiftUI for UI, WidgetKit for desktop widgets, smart Claude API scraping. Distribution via DMG and Homebrew." },
    "result": { "title": "THE RESULT", "content": "An app I use all day. Discreet menu bar, desktop widgets, overlay showing my active sessions." }
  }
},
"pix2paint": {
  "category": "IMAGE PROCESSING",
  "description": "Turn any image into a paint-by-numbers grid. 100% in your browser.",
  "longDescription": "Drop your image, adjust settings, get a numbered grid ready to paint. Two modes: classic pixel and smooth with organic contour lines.\n\nColor quantization (max 20), region numbering, PNG export. All processing runs in a Web Worker, zero UI lag. IndexedDB persistence to resume where you left off.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE IDEA", "content": "Turn a photo into a paint-by-numbers grid in a few clicks. Free, no sign-up, 100% in your browser." },
    "challenge": { "title": "THE CHALLENGE", "content": "Heavy client-side image processing without blocking the UI. Precise color quantization and organic contours." },
    "process": { "title": "THE PROCESS", "content": "Vite + vanilla TypeScript, zero framework. Web Worker for processing, Canvas 2D for rendering, IndexedDB for persistence." },
    "result": { "title": "THE RESULT", "content": "A smooth tool that turns any image into a ready-to-paint grid. High-res PNG export." }
  }
},
"yeetbg": {
  "category": "IMAGE PROCESSING",
  "description": "AI-powered background removal + interactive color editor. Zero server.",
  "longDescription": "Drop an image, AI removes the background, recolor whatever you want. ONNX segmentation in a Web Worker for zero lag. K-means++ clustering in Lab color space to group similar colors.\n\nInteractive editor: click on canvas or palette to remove colors. Recolor individually. Export PNG, JPG or WebP. Full undo/redo.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE IDEA", "content": "Remove image backgrounds and recolor remaining zones. All in the browser, no upload." },
    "challenge": { "title": "THE CHALLENGE", "content": "Run an AI model (ONNX) client-side without killing performance. Precise color clustering in Lab space." },
    "process": { "title": "THE PROCESS", "content": "Vite + vanilla TypeScript. @imgly/background-removal in a Web Worker. K-means++ for clustering. Brutalist black/white design." },
    "result": { "title": "THE RESULT", "content": "A fast, privacy-first tool. Drop, remove, recolor, export. Nothing leaves your browser." }
  }
},
"nixdash": {
  "category": "CLI / TUI",
  "description": "Interactive terminal interface for managing your Nix packages.",
  "longDescription": "NixDash gives Nix a human interface. Browse installed packages, fuzzy search through 177k+ nixpkgs, install or remove with diff preview.\n\nTemporary shells to test packages before installing. External flake management. Keyboard shortcuts for everything. Works with Home Manager, NixOS, and any Nix flake setup.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE IDEA", "content": "Make Nix accessible. An interactive TUI that replaces cryptic commands with a smooth experience." },
    "challenge": { "title": "THE CHALLENGE", "content": "Parse the Nix ecosystem (177k+ packages) and offer fast fuzzy search. Support different setups (Home Manager, NixOS)." },
    "process": { "title": "THE PROCESS", "content": "100% Shell with fzf, gum and jq. Nix flake for distribution. Diff preview before every change." },
    "result": { "title": "THE RESULT", "content": "An interactive hub for Nix. Browse, search, install, temporary shell - all in a few keystrokes." }
  }
},
"envora": {
  "category": "SECURITY TOOL",
  "description": "Encrypted .env vault. Push/pull between machines with age encryption.",
  "longDescription": "Your .env files contain secrets that can't go in git. But they need to exist on every machine. Envora stores them in a private git repo, encrypted with age.\n\nOne age key, stored in your password manager, unlocks the entire vault. Push encrypts and stores, pull decrypts and restores. Even if the repo is compromised, your secrets stay safe.",
  "role": "CREATOR & DEVELOPER",
  "client": "OPEN SOURCE",
  "sections": {
    "intro": { "title": "THE PROBLEM", "content": ".env files don't go in git. But you work on 3 machines. Envora solves this dilemma with encryption." },
    "challenge": { "title": "THE CHALLENGE", "content": "Transparent encryption, zero friction. One key to unlock everything. Cross-platform (macOS, Linux, WSL)." },
    "process": { "title": "THE PROCESS", "content": "Shell + age encryption + git as transport. Nix flake for distribution. fzf/gum interface for selection." },
    "result": { "title": "THE RESULT", "content": "ev push, ev pull. Two commands. All your secrets synced and encrypted." }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "i18n: update translations - remove depense-man, rename wt, add 5 new projects FR/EN"
```

---

## Task 4: Canvas Timeline component (ProjectTimeline.tsx)

**Files:**
- Create: `src/components/sections/ProjectTimeline.tsx`

This is the largest component. It renders the horizontal Canvas 2D timeline with all visual effects. Reference `src/components/sections/ConstellationTimeline.tsx` heavily for patterns (canvas setup, DPR, resize, animation loop, mouse repulsion, spring physics, node drawing).

- [ ] **Step 1: Create the component shell with canvas setup**

Create `src/components/sections/ProjectTimeline.tsx`:

```typescript
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import { COLORS, ANIMATION } from "@/lib/constants";

interface TimelineNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  projectId: string;
  title: string;
  category: string;
  date: string;
  color: string;
  above: boolean; // zigzag positioning
}

interface ProjectTimelineProps {
  scrollProgress: number; // 0-1 from parent useScroll
  activeProjectId: string | null;
  onProjectClick: (projectId: string) => void;
  onProjectHover: (projectId: string | null) => void;
  compressed: boolean; // true when takeover is open
}

export default function ProjectTimeline({
  scrollProgress,
  activeProjectId,
  onProjectClick,
  onProjectHover,
  compressed,
}: ProjectTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<TimelineNode[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // ... (steps below fill this in)

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ height: compressed ? "25vh" : "100vh" }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Add node initialization**

Add the `initNodes` callback inside the component. Nodes are positioned proportionally to their dates along the X axis, zigzagging above/below the center axis:

```typescript
const initNodes = useCallback(
  (width: number, height: number) => {
    const nodes: TimelineNode[] = [];
    const centerY = height / 2;
    const padding = width * 0.08;
    const usableWidth = width - padding * 2;

    // Get date range for proportional spacing
    const dates = projects.map((p) => new Date(p.date + "-01").getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRange = maxDate - minDate || 1;

    projects.forEach((project, index) => {
      const dateTime = new Date(project.date + "-01").getTime();
      const progress = (dateTime - minDate) / dateRange;
      const baseX = padding + progress * usableWidth;

      const above = index % 2 === 0;
      const zigzagOffset = above ? -80 : 80;
      const baseY = centerY + zigzagOffset;

      nodes.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: 0,
        vy: 0,
        projectId: project.id,
        title: project.title,
        category: project.category,
        date: project.date,
        color: project.color,
        above,
      });
    });

    return nodes;
  },
  []
);
```

- [ ] **Step 3: Add resize handler and mouse tracking**

Same pattern as ConstellationTimeline:

```typescript
// Resize
useEffect(() => {
  const updateDimensions = () => {
    if (!canvasRef.current) return;
    const { innerWidth: width } = window;
    const height = compressed
      ? window.innerHeight * 0.25
      : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    setDimensions({ width, height });
    nodesRef.current = initNodes(width, height);
  };

  updateDimensions();
  window.addEventListener("resize", updateDimensions);
  return () => window.removeEventListener("resize", updateDimensions);
}, [initNodes, compressed]);

// Mouse
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };
  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);
```

- [ ] **Step 4: Add the main animation loop**

The animation loop updates node positions (floating, repulsion, spring) and draws everything (axis, year markers, constellation lines, nodes, labels):

```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let time = 0;

  const animate = () => {
    time += 0.016;
    const { width, height } = dimensions;
    if (width === 0 || height === 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const nodes = nodesRef.current;
    const centerY = height / 2;

    // --- Update physics ---
    if (!compressed) {
      nodes.forEach((node, index) => {
        const isActive = node.projectId === activeProjectId;

        // Floating
        const floatX = Math.sin(time * 0.8 + index) * 5;
        const floatY = Math.cos(time * 0.6 + index * 0.5) * 8;

        // Mouse repulsion
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repRadius = isActive ? 180 : 120;

        if (dist < repRadius && dist > 0) {
          const force = (1 - dist / repRadius) * (isActive ? 0.3 : 0.2);
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Velocity + damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Spring return
        const spring = 0.05;
        node.vx += (node.baseX + floatX - node.x) * spring;
        node.vy += (node.baseY + floatY - node.y) * spring;
      });
    } else {
      // Compressed: nodes on single horizontal line, no physics
      nodes.forEach((node, index) => {
        const padding = width * 0.05;
        const spacing = (width - padding * 2) / (nodes.length - 1 || 1);
        const targetX = padding + index * spacing;
        const targetY = centerY;
        node.x += (targetX - node.x) * 0.1;
        node.y += (targetY - node.y) * 0.1;
      });
    }

    // --- Draw axis ---
    ctx.beginPath();
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // --- Draw year markers ---
    if (!compressed) {
      const years = ["2024", "2025", "2026"];
      const dates = projects.map((p) => new Date(p.date + "-01").getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const dateRange = maxDate - minDate || 1;
      const padding = width * 0.08;
      const usableWidth = width - padding * 2;

      years.forEach((year) => {
        const yearTime = new Date(`${year}-01-01`).getTime();
        const progress = (yearTime - minDate) / dateRange;
        const x = padding + progress * usableWidth;

        // Dot
        ctx.beginPath();
        ctx.arc(x, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.accent;
        ctx.fill();

        // Label
        ctx.font = "11px monospace";
        ctx.fillStyle = COLORS.accent;
        ctx.textAlign = "center";
        ctx.fillText(year, x, centerY + 20);
      });
    }

    // --- Draw constellation lines (shared skills) ---
    if (!compressed) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const projA = projects.find((p) => p.id === nodes[i].projectId);
          const projB = projects.find((p) => p.id === nodes[j].projectId);
          if (!projA || !projB) continue;

          const sharedSkills = projA.skills.filter((s) =>
            projB.skills.includes(s)
          );
          if (sharedSkills.length === 0) continue;

          const isHovered =
            nodes[i].projectId === activeProjectId ||
            nodes[j].projectId === activeProjectId;

          ctx.beginPath();
          ctx.strokeStyle = isHovered
            ? `rgba(255, 170, 0, ${Math.min(0.3, sharedSkills.length * 0.1)})`
            : "rgba(255, 255, 255, 0.03)";
          ctx.lineWidth = isHovered ? 1 : 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // --- Draw nodes ---
    nodes.forEach((node) => {
      const isActive = node.projectId === activeProjectId;
      const isHovered = isActive; // Will enhance with proper hover detection

      // Connecting line to axis
      if (!compressed) {
        ctx.beginPath();
        ctx.strokeStyle = "#222222";
        ctx.lineWidth = 1;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.x, centerY);
        ctx.stroke();
      }

      // Glow for active/hovered
      if (isActive) {
        [20, 14, 8].forEach((radius) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 170, 0, ${0.05 * (20 / radius)})`;
          ctx.fill();
        });
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, compressed ? 4 : 6, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? COLORS.accent : "#333333";
      ctx.fill();

      // Labels (only in non-compressed)
      if (!compressed) {
        const labelY = node.above ? node.y - 20 : node.y + 30;
        const catY = node.above ? node.y - 8 : node.y + 42;

        ctx.font = "bold 12px monospace";
        ctx.fillStyle = isActive ? "#e8e8e8" : "#999999";
        ctx.textAlign = "center";
        ctx.fillText(node.title, node.x, labelY);

        ctx.font = "9px monospace";
        ctx.fillStyle = "#555555";
        ctx.fillText(node.category, node.x, catY);
      }
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  animationFrameRef.current = requestAnimationFrame(animate);
  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [dimensions, compressed, activeProjectId]);
```

- [ ] **Step 5: Add click/hover detection**

Add canvas click and mousemove handlers that detect which node is under the cursor:

```typescript
// Hit detection helper
const getNodeAtPosition = useCallback(
  (clientX: number, clientY: number): TimelineNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const hitRadius = compressed ? 20 : 30;

    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < hitRadius) return node;
    }
    return null;
  },
  [compressed]
);

// Click handler
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const handleClick = (e: MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) onProjectClick(node.projectId);
  };

  const handleMove = (e: MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    onProjectHover(node ? node.projectId : null);
    canvas.style.cursor = node ? "pointer" : "default";
  };

  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("mousemove", handleMove);
  return () => {
    canvas.removeEventListener("click", handleClick);
    canvas.removeEventListener("mousemove", handleMove);
  };
}, [getNodeAtPosition, onProjectClick, onProjectHover]);
```

- [ ] **Step 6: Verify TypeScript compiles and commit**

Run: `npx tsc --noEmit`

```bash
git add src/components/sections/ProjectTimeline.tsx
git commit -m "feat: add ProjectTimeline canvas component with physics and constellation lines"
```

---

## Task 5: Takeover panel component (ProjectTakeover.tsx)

**Files:**
- Create: `src/components/sections/ProjectTakeover.tsx`

- [ ] **Step 1: Create the component**

```typescript
"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { getProjectById } from "@/data/projects";
import MagneticButton from "@/components/ui/MagneticButton";
import { ANIMATION } from "@/lib/constants";

interface ProjectTakeoverProps {
  projectId: string | null;
  onClose: () => void;
}

export default function ProjectTakeover({
  projectId,
  onClose,
}: ProjectTakeoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const t = useTranslations("projectPage");
  const project = projectId ? getProjectById(projectId) : null;
  const tProject = useTranslations(
    `projectsData.${projectId ? toCamelCase(projectId) : "worktigre"}`
  );

  // Reset iframe state on project change
  useEffect(() => {
    setIframeLoaded(false);
  }, [projectId]);

  // Overscroll detection to close panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleScroll = () => {
      if (panel.scrollTop <= 0) {
        // At top of panel - next scroll up triggers close
        // Handled by wheel event below
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (panel.scrollTop <= 0 && e.deltaY < -50) {
        onClose();
      }
    };

    panel.addEventListener("scroll", handleScroll);
    panel.addEventListener("wheel", handleWheel, { passive: true });
    panel.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      panel.removeEventListener("scroll", handleScroll);
      panel.removeEventListener("wheel", handleWheel);
      panel.removeEventListener("touchstart", handleTouchStart);
    };
  }, [onClose]);

  if (!project) return null;

  const isGithubOnly = project.link.includes("github.com");
  const ctaLabel = isGithubOnly ? "VIEW GITHUB →" : "VIEW SITE →";
  const ctaUrl = project.link;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        ref={panelRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease.out,
        }}
        className="fixed bottom-0 left-0 right-0 overflow-y-auto bg-background"
        style={{ height: "75vh" }}
      >
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Header: category + year + CTA */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="font-mono text-xs text-muted tracking-widest">
                {tProject("category")} · {project.year}
              </span>
              <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">
                {project.title}
              </h1>
            </div>
            <MagneticButton strength={0.15}>
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-widest border border-foreground/20 px-6 py-3 hover:border-accent hover:text-accent transition-colors"
                data-cursor="hover"
              >
                {ctaLabel}
              </a>
            </MagneticButton>
          </div>

          {/* Description */}
          <p className="font-mono text-sm text-muted leading-relaxed max-w-3xl mb-12">
            {tProject("longDescription")}
          </p>

          {/* Iframe / Preview */}
          <div className="relative border border-foreground/10 mb-12" style={{ height: "50vh" }}>
            {!isGithubOnly ? (
              <>
                {!iframeLoaded && (
                  <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
                )}
                <iframe
                  src={`https://${project.link.replace("https://", "")}`}
                  className="w-full h-full"
                  style={{ opacity: iframeLoaded ? 1 : 0 }}
                  onLoad={() => setIframeLoaded(true)}
                  title={project.title}
                  sandbox="allow-scripts allow-same-origin"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                {/* For envora: show SVG logo, otherwise show GitHub link */}
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-muted hover:text-accent transition-colors"
                >
                  {project.title} on GitHub →
                </a>
              </div>
            )}
          </div>

          {/* Skills badges */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-widest border border-foreground/20 px-3 py-1 text-muted hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Role + Client */}
          <div className="flex gap-12 font-mono text-xs text-muted">
            <div>
              <span className="text-foreground/30 tracking-widest">{t("role")}</span>
              <div className="mt-1">{tProject("role")}</div>
            </div>
            <div>
              <span className="text-foreground/30 tracking-widest">{t("client")}</span>
              <div className="mt-1">{tProject.has("client") ? tProject("client") : project.client}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper: kebab-case to camelCase for translation keys
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
```

- [ ] **Step 2: Verify and commit**

Run: `npx tsc --noEmit`

```bash
git add src/components/sections/ProjectTakeover.tsx
git commit -m "feat: add ProjectTakeover detail panel with iframe and skill badges"
```

---

## Task 6: Mobile timeline component (ProjectTimelineMobile.tsx)

**Files:**
- Create: `src/components/sections/ProjectTimelineMobile.tsx`

- [ ] **Step 1: Create the component**

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { ANIMATION } from "@/lib/constants";

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export default function ProjectTimelineMobile() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = useTranslations("projectPage");

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Group by year for markers
  const years = [...new Set(projects.map((p) => p.year))];

  return (
    <div className="relative px-6 py-12 min-h-dvh">
      {/* Vertical axis */}
      <div className="absolute left-10 top-12 bottom-12 w-px bg-foreground/10" />

      {/* Year markers + projects */}
      {years.map((year) => {
        const yearProjects = projects.filter((p) => p.year === year);
        return (
          <div key={year} className="mb-8">
            {/* Year marker */}
            <div className="relative flex items-center mb-4 pl-4">
              <div
                className="absolute left-10 w-2.5 h-2.5 rounded-full -translate-x-1/2"
                style={{ backgroundColor: "#ffaa00" }}
              />
              <span className="font-mono text-xs text-accent tracking-widest ml-8">
                {year}
              </span>
            </div>

            {/* Projects for this year */}
            {yearProjects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                expanded={expandedId === project.id}
                onToggle={() => handleToggle(project.id)}
                index={index}
                t={t}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ProjectRow({
  project,
  expanded,
  onToggle,
  index,
  t,
}: {
  project: (typeof projects)[number];
  expanded: boolean;
  onToggle: () => void;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const tProject = useTranslations(`projectsData.${toCamelCase(project.id)}`);
  const isGithubOnly = project.link.includes("github.com");

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative ml-4 mb-3"
    >
      {/* Dot on axis */}
      <div
        className="absolute left-6 top-3 w-2 h-2 rounded-full -translate-x-1/2"
        style={{ backgroundColor: project.color }}
      />

      {/* Clickable row */}
      <button
        onClick={onToggle}
        className="w-full text-left ml-8 pl-4 py-2 border-l border-foreground/5 hover:border-foreground/20 transition-colors"
      >
        <div className="font-mono text-sm font-bold">{project.title}</div>
        <div className="font-mono text-[10px] text-muted tracking-widest">
          {tProject("category")}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION.duration.normal }}
            className="overflow-hidden ml-12 pl-4"
          >
            <div className="py-4 border-l border-foreground/10 pl-4">
              <p className="font-mono text-xs text-muted leading-relaxed mb-4">
                {tProject("description")}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-wider border border-foreground/20 px-2 py-0.5 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent tracking-widest"
              >
                {isGithubOnly ? "GITHUB →" : "VIEW SITE →"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify and commit**

Run: `npx tsc --noEmit`

```bash
git add src/components/sections/ProjectTimelineMobile.tsx
git commit -m "feat: add ProjectTimelineMobile vertical accordion timeline"
```

---

## Task 7: Rewrite work/page.tsx

**Files:**
- Modify: `src/app/work/page.tsx`

- [ ] **Step 1: Rewrite the page**

Replace the entire content of `src/app/work/page.tsx`:

```typescript
"use client";

import { useRef, useState, useCallback } from "react";
import { useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";
import { projects } from "@/data/projects";

const ProjectTimeline = dynamic(
  () => import("@/components/sections/ProjectTimeline"),
  { ssr: false }
);
const ProjectTakeover = dynamic(
  () => import("@/components/sections/ProjectTakeover"),
  { ssr: false }
);
const ProjectTimelineMobile = dynamic(
  () => import("@/components/sections/ProjectTimelineMobile"),
  { ssr: false }
);

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const { isMobile, isHydrated } = useDeviceDetect();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleProjectClick = useCallback(
    (projectId: string) => {
      if (activeProjectId === projectId) {
        // Toggle: re-click closes
        setActiveProjectId(null);
      } else {
        setActiveProjectId(projectId);
      }
    },
    [activeProjectId]
  );

  const handleClose = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  const handleHover = useCallback((projectId: string | null) => {
    setHoveredProjectId(projectId);
  }, []);

  // Mobile
  if (isHydrated && isMobile) {
    return (
      <main className="min-h-dvh">
        <ProjectTimelineMobile />
      </main>
    );
  }

  const isOpen = activeProjectId !== null;

  // Desktop
  return (
    <main
      ref={containerRef}
      style={{
        height: isOpen ? "auto" : `${projects.length * 60}vh`,
      }}
    >
      {/* Sticky canvas */}
      <div
        className="sticky top-0 z-10"
        style={{ height: isOpen ? "25vh" : "100vh" }}
      >
        <ProjectTimeline
          scrollProgress={scrollProgress.get()}
          activeProjectId={hoveredProjectId || activeProjectId}
          onProjectClick={handleProjectClick}
          onProjectHover={handleHover}
          compressed={isOpen}
        />
      </div>

      {/* Takeover panel */}
      {isOpen && (
        <ProjectTakeover
          projectId={activeProjectId}
          onClose={handleClose}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify and commit**

Run: `npx tsc --noEmit`

```bash
git add src/app/work/page.tsx
git commit -m "feat: rewrite work page with canvas timeline + takeover panel"
```

---

## Task 8: Fix MagneticButton

**Files:**
- Modify: `src/components/ui/MagneticButton.tsx`

- [ ] **Step 1: Cap the displacement**

In `src/components/ui/MagneticButton.tsx`, update `handleMouseMove` to cap the maximum displacement:

Replace:
```typescript
const x = (clientX - left - width / 2) * strength;
const y = (clientY - top - height / 2) * strength;

setPosition({ x, y });
```

With:
```typescript
const maxDisplacement = 12; // px max
const rawX = (clientX - left - width / 2) * strength;
const rawY = (clientY - top - height / 2) * strength;

const x = Math.max(-maxDisplacement, Math.min(maxDisplacement, rawX));
const y = Math.max(-maxDisplacement, Math.min(maxDisplacement, rawY));

setPosition({ x, y });
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/MagneticButton.tsx
git commit -m "fix: cap MagneticButton displacement to prevent flee effect"
```

---

## Task 9: Cleanup old references

**Files:**
- Modify: `src/components/sections/Projects.tsx` (if it references old project IDs)
- Check: any imports of HoverReveal or HorizontalGallery from work page

- [ ] **Step 1: Check for broken references to "wt" and "depense-man"**

Run: `grep -r '"wt"' src/ --include="*.ts" --include="*.tsx"` and `grep -r '"depense-man"' src/ --include="*.ts" --include="*.tsx"`

Fix any remaining references to old IDs.

- [ ] **Step 2: Check for imports of removed route**

Run: `grep -r 'work/\[slug\]' src/ --include="*.ts" --include="*.tsx"` and `grep -r '/work/' src/ --include="*.ts" --include="*.tsx"`

Update any links that still point to `/work/{id}` to just open the takeover (or remove them if they're in components that are no longer used).

- [ ] **Step 3: Update the homepage Projects section**

In `src/components/sections/Projects.tsx`, the "View All" button routes to `/work`. The `handleProjectClick` currently does `router.push(/work/${project.id})`. Update it to just route to `/work` since there are no more single project pages:

Change the `onProjectClick` handler to navigate to `/work` (the timeline will handle project selection).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "cleanup: fix broken references to old project IDs and removed routes"
```

---

## Task 10: Final verification

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: No new errors.

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Build succeeds. The `/work/[slug]` pages may still build (files exist) but won't be linked.

- [ ] **Step 4: Visual check**

Open `localhost:3000/work` in browser:
- Desktop: Canvas timeline renders, nodes are positioned chronologically, mouse repulsion works, clicking a node opens the takeover panel with iframe
- Mobile: Vertical timeline renders, tapping a project expands the accordion

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final adjustments from visual verification"
```
