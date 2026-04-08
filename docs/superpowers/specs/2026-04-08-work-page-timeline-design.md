# Work Page Rework - Timeline Horizontale Canvas

## Résumé

Reworker la page /work du portfolio en une timeline horizontale Canvas 2D interactive avec détails en takeover DOM. Remplace l'ancien système dual (liste + galerie horizontale) par une expérience unifiée inspirée de la page Journey (ConstellationTimeline).

10 projets au total (5 existants mis à jour + 5 nouveaux depuis GitHub). Plus de page single /work/[slug] - tous les détails sont inline via le mode takeover.

---

## Architecture

### Approche hybride Canvas + DOM

- **Canvas 2D** : timeline interactive (axe, nodes, effets visuels, constellation lines, mouse repulsion, spring physics)
- **DOM overlay** : panneau takeover avec détails projet (description, iframe, skills badges, CTA)

Le canvas gère l'exploration visuelle (la partie fun), le DOM gère le contenu utile (la partie info).

### Composants principaux

```
src/app/work/
├── page.tsx                     # Page /work reworkée
└── [slug]/                      # SUPPRIMÉ (plus de single page)

src/components/sections/
├── ProjectTimeline.tsx          # Canvas 2D timeline (desktop)
├── ProjectTakeover.tsx          # Panneau détails DOM (desktop)
└── ProjectTimelineMobile.tsx    # Timeline verticale (mobile)
```

### Composants supprimés / obsolètes

- `src/app/work/[slug]/page.tsx` - plus de single page projet
- `src/app/work/[slug]/immersive/page.tsx` - idem
- `src/components/sections/HorizontalGallery.tsx` - remplacé par ProjectTimeline
- `src/components/ui/HoverReveal.tsx` - plus utilisé sur /work (peut rester si utilisé ailleurs)
- Le toggle list/gallery dans work/page.tsx - supprimé

---

## Desktop - Canvas Timeline (état browse)

### Layout

Canvas plein écran (100vw x 100vh). Scroll vertical capturé et converti en déplacement horizontal des nodes (pattern identique à HorizontalGallery existant).

Container scrollable dont la hauteur = `nombre de projets * Xvh` (à calibrer). Le canvas est en `position: sticky; height: 100vh`. Le scroll progress est mappé sur la position horizontale via `useScroll` + `useTransform`.

### Axe central

Ligne horizontale fine (#333) au centre vertical du canvas. Marqueurs d'années aux positions correspondantes :
- 2024
- 2025
- 2026

Chaque marqueur : cercle 10px #ffaa00 + label année en monospace.

### Nodes projet

Positionnés en zigzag alternés dessus/dessous l'axe, espacés proportionnellement aux dates réelles (GitHub creation dates).

Chaque node :
- Cercle principal : #333 idle, #ffaa00 hover/actif
- Ligne verticale fine (#222) connectant le node à l'axe
- Label titre : monospace, #e8e8e8
- Label catégorie : monospace petit, #666
- Label date : monospace, #444

### Effets Canvas (portés de ConstellationTimeline)

- **Mouse repulsion** : les nodes se repoussent quand le curseur approche (~120px radius)
- **Floating** : légère oscillation sine/cosine sur chaque node (amplitude faible)
- **Spring return** : les nodes reviennent à leur position de base (spring + damping)
- **Glow** : le node sous le curseur a un halo #ffaa00 multi-couches
- **Lignes de constellation** : lignes fines (#1a1a1a) entre projets qui partagent des skills. Au hover sur un node, ses lignes s'illuminent (#ffaa00, opacity fade)
- **Particules** : quelques particules lentes le long de l'axe, couleur accent

### Scroll

Vertical → horizontal, identique au pattern de HorizontalGallery :
- `useScroll` sur le container scrollable
- `useTransform` pour mapper scrollYProgress → position X des nodes
- `useSpring` pour lisser le mouvement
- Canvas en `position: sticky; height: 100vh`

### Navigation clavier

Flèches gauche/droite pour sélectionner le projet suivant/précédent (déplace le focus et scroll automatiquement).

---

## Desktop - Takeover (état détails)

### Transition d'entrée

Au clic sur un node, animation ~300ms ease-out :
1. Le canvas shrink de 100vh → ~25vh (les nodes se resserrent sur l'axe, timeline reste visible mais compressée)
2. Le node sélectionné reste highlighted (#ffaa00, glow, particules orbitales)
3. Un panneau DOM slide depuis le bas, prend ~75vh

### Structure du panneau

```
┌─────────────────────────────────────────────────┐
│ CANVAS COMPRESSÉ (~25vh)                        │
│  ···○···○···●···○···○···○···○···○···○···○···     │
├─────────────────────────────────────────────────┤
│                                                 │
│  CATÉGORIE · ANNÉE                    [CTA btn] │
│  TITRE DU PROJET (Dela Gothic One, grand)       │
│                                                 │
│  Description longue (Space Mono, #888)          │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ IFRAME (site officiel) ou IMAGE/SVG     │    │
│  │ loading shimmer → site live             │    │
│  │ ~50vh                                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  STACK                                          │
│  [Shell] [Git] [GitHub] [Nix]                   │
│                                                 │
│  ROLE · CLIENT                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Iframe / Preview

- **Projets avec site web** : iframe lazy-load (chargé uniquement quand le takeover s'ouvre). Un seul iframe actif à la fois (détruit quand on switch).
- **Loading state** : skeleton shimmer monochrome pendant le chargement
- **Envora** (pas de site) : affiche le logo SVG du repo (`assets/logo.svg`) à la place
- Bordure 1px #222, pas de border-radius

Sites disponibles :
| Projet | URL iframe |
|---|---|
| BlenkDev | blenkdev.vercel.app |
| Victor Denay | victordenay.vercel.app |
| Under The Flow | undertheflow.com |
| Linekut | linekut.vercel.app |
| WorkTigre | worktigre.vercel.app |
| TokenEater | tokeneater.vercel.app |
| Pix2Paint | pix2paint.vercel.app |
| YeetBg | yeetbg.vercel.app |
| NixDash | nixdash.vercel.app |
| Envora | - (logo SVG fallback) |

### Skills badges

- Monospace, uppercase, letter-spacing 2px
- Bordure 1px #333, fond transparent, texte #888
- Au hover : bordure #ffaa00, texte #ffaa00
- Non cliquables (décoratifs)

### CTA

- Bouton en haut à droite : "VIEW SITE →" ou "VIEW GITHUB →"
- Style MagneticButton existant, mais avec rayon magnétique réduit et déplacement max cappé pour éviter l'effet "fuite"
- Logique : `project.link` (site officiel) si dispo, sinon `github.com/AThevon/{id}`

### Scroll dans le takeover

Quand le takeover est ouvert, le panneau DOM est scrollable verticalement (contenu potentiellement long : description + iframe + badges). Le scroll vertical ne déplace plus la timeline horizontale - il est capturé par le panneau.

Pour fermer : scroll au-delà du top du panneau (overscroll vers le haut) déclenche la fermeture.

### Fermeture du takeover

3 méthodes :
1. **Overscroll up** en haut du panneau → le panneau slide down (~300ms ease-out inverse), le canvas reprend 100vh
2. **Clic sur un autre node** dans le canvas compressé → switch direct (crossfade du contenu, pas de fermeture/réouverture)
3. **Re-clic sur le node actif** → toggle, ferme le panneau (~300ms ease-out inverse)

### Canvas en mode compressé

Quand le takeover est ouvert et le canvas réduit à ~25vh :
- Les nodes se repositionnent sur une seule ligne horizontale (plus de zigzag, pas assez de place)
- Les lignes de constellation sont masquées (trop dense)
- Les effets mouse repulsion et floating sont désactivés
- Seul le glow sur le node actif reste visible
- Les nodes restent cliquables pour switcher de projet

---

## Mobile - Timeline verticale

### Layout

Scroll vertical natif, pleine page.

### Structure

- Axe vertical fin (#222) à gauche
- Marqueurs d'années (#ffaa00) sur l'axe
- Chaque projet = une row avec :
  - Dot coloré (couleur projet) sur l'axe
  - Titre + catégorie + date à droite

### Interaction

- Tap sur un projet = expand inline (accordion)
- Contenu expand : description, skills badges, CTA
- Pas d'iframe sur mobile (perf + viewport trop petit)
- Animation : `AnimatePresence` pour l'expand, stagger sur les rows au mount initial

### Cohérence

Même style que la nav mobile existante (liste verticale monochrome) et les bottom sheets du site.

---

## Données projet

### 10 projets (triés chronologiquement)

| # | id | Titre | Catégorie | Date | Couleur | Site | GitHub |
|---|---|---|---|---|---|---|---|
| 01 | blenkdev | BLENKDEV | WEB AGENCY | 2024-04 | #FE1832 | blenkdev.vercel.app | - |
| 02 | victor-denay | VICTOR DENAY | PORTFOLIO | 2024-08 | #08C566 | victordenay.vercel.app | - |
| 03 | under-the-flow | UNDER THE FLOW | WEB PLATFORM | 2025-03 | #2BBADC | undertheflow.com | - |
| 04 | linekut | LINEKUT | CREATIVE TOOL | 2025-12 | #EE4E83 | linekut.vercel.app | AThevon/linekut |
| 05 | worktigre | WORKTIGRE | CLI TOOL | 2026-01 | #EE982B | worktigre.vercel.app | AThevon/worktigre |
| 06 | tokeneater | TOKENEATER | MACOS APP | 2026-02 | #FFAF40 | tokeneater.vercel.app | AThevon/tokeneater |
| 07 | pix2paint | PIX2PAINT | IMAGE PROCESSING | 2026-03 | #6C5CE7 | pix2paint.vercel.app | AThevon/pix2paint |
| 08 | yeetbg | YEETBG | IMAGE PROCESSING | 2026-03 | #E8E8E8 | yeetbg.vercel.app | AThevon/yeetbg |
| 09 | nixdash | NIXDASH | CLI / TUI | 2026-03 | #8055E3 | nixdash.vercel.app | AThevon/nixdash |
| 10 | envora | ENVORA | SECURITY TOOL | 2026-04 | #10B981 | AThevon/envora | AThevon/envora |

### Corrections sur les projets existants

- **"wt"** → renommé en **"worktigre"** (id, titre, traductions, refs partout)
- **Victor Denay** : lien `victordenay.com` → `victordenay.vercel.app`
- **Dates** corrigées depuis GitHub (Victor Denay 2024-08, Under The Flow 2025-03, BlenkDev 2024-04)
- **Dépense Man** : supprimé de la liste des projets
- **Linekut** : skills "html" et "css" retirés

### Nouveaux projets - Descriptions FR

**PIX2PAINT**
Description : "Transforme n'importe quelle image en grille paint-by-numbers. Deux modes, quantification de couleurs, export PNG. 100% navigateur, zéro backend."
Role : CRÉATEUR & DÉVELOPPEUR
Client : OPEN SOURCE
Tags : ["VITE", "CANVAS", "WEB WORKERS", "TYPESCRIPT"]
Skills : ["typescript", "vite", "canvas"]

**TOKENEATER**
Description : "App native macOS pour surveiller ta consommation Claude AI en temps réel. Menu bar, widgets natifs, floating overlay sur les sessions actives."
Role : CRÉATEUR & DÉVELOPPEUR
Client : OPEN SOURCE
Tags : ["SWIFT", "SWIFTUI", "WIDGETKIT", "MACOS"]
Skills : ["swift"]

**NIXDASH**
Description : "Interface terminal interactive pour gérer tes packages Nix. Browse, recherche fuzzy dans 177k+ packages, install/remove avec preview, shells temporaires."
Role : CRÉATEUR & DÉVELOPPEUR
Client : OPEN SOURCE
Tags : ["SHELL", "NIX", "TUI", "FZF"]
Skills : ["shell", "nix"]

**ENVORA**
Description : "Vault chiffré pour tes .env. Push/pull entre machines via un repo git privé, chiffrement age. Une clé, tous tes secrets."
Role : CRÉATEUR & DÉVELOPPEUR
Client : OPEN SOURCE
Tags : ["SHELL", "AGE", "GIT", "NIX"]
Skills : ["shell", "git", "nix"]

**YEETBG**
Description : "Background removal par IA + éditeur de couleurs interactif. ONNX dans un Web Worker, zéro serveur, zéro upload. Drop, remove, recolor, export."
Role : CRÉATEUR & DÉVELOPPEUR
Client : OPEN SOURCE
Tags : ["VITE", "CANVAS", "AI/ONNX", "WEB WORKERS"]
Skills : ["typescript", "vite", "canvas"]

### Skills mapping complet par projet

| Projet | Skills |
|---|---|
| blenkdev | nextjs, react, typescript, tailwind, motion, git, vercel, figma |
| victor-denay | typescript, nuxt, vue, tailwind, motion, threejs, postgresql, figma, git, vercel |
| under-the-flow | nextjs, react, typescript, tailwind, motion, postgresql, vercel, git, figma |
| linekut | nextjs, react, typescript, tailwind, canvas, git, vercel, figma |
| worktigre | shell, git, github, nix |
| tokeneater | swift |
| pix2paint | typescript, vite, canvas |
| yeetbg | typescript, vite, canvas |
| nixdash | shell, nix |
| envora | shell, git, nix |

---

## Skills (src/data/skills.ts)

### Nouvelles skills

| id | name | category | connections |
|---|---|---|---|
| shell | Shell | tools | ["git", "github", "nix"] |
| swift | Swift | frontend | [] |
| nix | Nix | tools | ["shell", "git"] |

### Skills supprimées (orphelines)

- firebase, prisma, express, webpack
- r3f, drei, glsl, webgl
- photoshop, illustrator

### Skills restantes (22 total)

**Frontend** : react, nextjs, vue, nuxt, typescript, tailwind, html, css, swift
**Creative** : threejs, canvas, motion, gsap
**Backend** : nodejs, postgresql, supabase
**Tools** : git, github, vercel, vite, shell, nix
**Design** : figma

---

## Traductions (i18n)

### Fichiers impactés

- `messages/fr.json` : supprimer `projectsData.depenseMan`, renommer `projectsData.wt` → `projectsData.worktigre`, ajouter 5 nouveaux projets
- `messages/en.json` : idem en anglais
- Sections traduites pour chaque nouveau projet : category, description, longDescription, role, client, sections (intro/challenge/process/result)

### Clés à renommer

- `projectsData.wt.*` → `projectsData.worktigre.*`

### Clés à supprimer

- `projectsData.depenseMan.*`

---

## MagneticButton fix

Le MagneticButton actuel a un effet de "fuite" (le bouton s'éloigne au lieu d'attirer). Fix à inclure :
- Réduire le rayon magnétique
- Capper le déplacement maximum pour que le bouton reste dans sa zone
- Valeurs exactes à calibrer à l'implémentation

---

## Pages / routes supprimées

- `/work/[slug]` - plus de page single projet
- `/work/[slug]/immersive` - idem
- Les composants restent dans le code au cas où mais ne sont plus routés

---

## Ce qui reste inchangé

- Homepage (AsciiBlocks + ClipPathGrid + FloatingSocialIcons)
- Page Skills (NeuralNetwork2D) - mais bénéficie des skills mises à jour
- Page Journey (ConstellationTimeline)
- Navigation mobile existante
- Curseur custom, effets globaux
- Design system (Dela Gothic One + Space Mono, monochrome + accent #ffaa00)

---

## Dépendances

Aucune nouvelle dépendance requise. Tout est faisable avec :
- `motion/react` (déjà installé) - animations, AnimatePresence, layout
- Canvas 2D natif - timeline
- Hooks existants : useScroll, useTransform, useSpring, useDeviceDetect, usePerformance
