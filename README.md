# Portfolio Creative - Adrien Thevon

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

- Curseur custom avec effets contextuels par section
- Timeline 3D interactive
- Skills Matrix 3D avec matrix rain
- Horizontal Gallery avec parallax
- Case studies avec mode immersif (scroll storytelling)
- Internationalisation FR/EN
- Optimisations mobile/reduced-motion

## Commandes

```bash
npm run dev      # Serveur de dev
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linting
```

## Projets présentés

- **Under The Flow** - Plateforme de sessions live hip-hop
- **Victor Denay** - Portfolio vidéaste/photographe
- **Dépense Man** - App de gestion de finances (PWA)
- **Linekut** - Convertisseur d'images en patrons découpables
