# Adrien Thevon

Portfolio créatif expérimental avec des effets de creative coding avancés. Dark theme, animations fluides, expériences 3D interactives.

## Stack Technique

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (framer-motion), GSAP
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **i18n:** next-intl (FR/EN)
- **Smooth Scroll:** Lenis
- **Language:** TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Homepage avec toutes les sections
│   └── work/              # Pages projets
├── components/
│   ├── effects/           # Curseurs, preloader, effets visuels
│   ├── experiments/       # ASCII, particules, waves, terrain
│   ├── sections/          # Hero, Projects, About, Contact, etc.
│   └── ui/                # Boutons, textes animés, composants réutilisables
├── data/                   # Projets et timeline
├── hooks/                  # usePerformance, useDeviceDetect, etc.
├── i18n/                   # Configuration next-intl
└── messages/               # Traductions FR/EN
```

## Features

- **Homepage** - NavigationGrid et NavigationStrips pour navigation immersive
- **Work** - Liste projets avec gallery/list toggle et case studies détaillés
- **Skills** - Réseau neuronal 2D interactif (Canvas force-directed graph)
- **Journey** - Timeline constellation 2D avec étoiles filantes et navigation
- Curseur custom avec effets contextuels par section
- Horizontal Gallery avec parallax
- Case studies avec mode immersif (scroll storytelling)
- Internationalisation FR/EN complète
- Optimisations mobile/reduced-motion
- Architecture data centralisée (projects, timeline, skills)

## Commandes

```bash
npm run dev      # Serveur de dev
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linting
```

## Projets présentés

- **Under The Flow** (2024) - Plateforme de sessions live hip-hop
- **Victor Denay** (2024) - Portfolio vidéaste/photographe
- **Dépense Man** (2024) - App de gestion de finances (PWA)
- **Linekut** (2024) - Convertisseur d'images en patrons découpables
- **BlenkDev** (2024) - Site vitrine agence freelance

## Status

- ✅ Pages complètes: Home, Work, Skills, Journey
- 🚧 Pages à retravailler: Philosophy, About, Contact
