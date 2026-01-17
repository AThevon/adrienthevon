# Claude Code Context - Portfolio Creative

> Ce fichier fournit le contexte nécessaire pour que Claude Code comprenne rapidement ce projet.

---

## Résumé du Projet

Portfolio créatif expérimental avec des effets de creative coding avancés. Le style est **expérimental et chaotique**, inspiré des meilleures références de creative coding mondial (Awwwards, Bruno Simon, Codrops).

**Domaine:** Dev / Creative Coder
**Vibe:** Expérimental & chaotique, dark theme avec accents colorés

---

## Stack Technique

- **Framework:** Next.js 16.1.3 (App Router)
- **Styling:** Tailwind CSS 4.1.18
- **Animations:** Motion (framer-motion), GSAP
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **Smooth Scroll:** Lenis
- **Noise:** simplex-noise
- **Language:** TypeScript

---

## Structure du Projet

```
src/
├── app/
│   ├── globals.css          # Styles globaux, grain effect, glitch CSS
│   ├── layout.tsx            # Layout root avec SEO metadata
│   ├── page.tsx              # Page d'accueil avec toutes les sections
│   ├── lab/
│   │   ├── layout.tsx        # SEO pour /lab
│   │   └── page.tsx          # Page expériences créatives
│   └── work/
│       ├── layout.tsx        # SEO pour /work
│       ├── page.tsx          # Liste des projets (gallery/list toggle)
│       └── [slug]/
│           ├── page.tsx      # Case study standard
│           └── immersive/
│               └── page.tsx  # Case study immersif (scroll storytelling)
├── components/
│   ├── effects/
│   │   ├── CustomCursor.tsx      # Curseur custom avec trailing
│   │   ├── LiquidCursor.tsx      # Effet metaball WebGL
│   │   ├── Preloader.tsx         # Animation de chargement
│   │   ├── NoiseTransition.tsx   # Transitions glitch/static/scanlines
│   │   └── LiquidDistortion.tsx  # Distortion shader
│   ├── experiments/
│   │   ├── AsciiEffect.tsx       # Portrait ASCII interactif
│   │   ├── ParticleText.tsx      # Texte en particules
│   │   ├── WaveField.tsx         # Champ de vagues
│   │   └── NoiseTerrain.tsx      # Terrain procédural
│   ├── sections/
│   │   ├── Hero.tsx              # Section hero avec floating shapes
│   │   ├── Projects.tsx          # Grille de projets
│   │   ├── About.tsx             # Section about
│   │   ├── Contact.tsx           # Section contact
│   │   ├── HorizontalGallery.tsx # Scroll horizontal avec parallax
│   │   ├── SkillsMatrix3D.tsx    # Grille 3D des skills + matrix rain
│   │   └── Timeline3D.tsx        # Timeline carrière 3D
│   └── ui/
│       ├── MagneticButton.tsx    # Bouton avec effet magnétique
│       ├── TextReveal.tsx        # Révélation de texte animée
│       ├── RollingText.tsx       # Texte qui roule au hover
│       ├── HoverReveal.tsx       # Révélation d'image au hover
│       └── ScrollImageReveal.tsx # Image reveal au scroll
├── hooks/
│   ├── index.ts
│   ├── useReducedMotion.ts   # Détecte prefers-reduced-motion
│   ├── useDeviceDetect.ts    # Détecte mobile/tablet/desktop
│   └── usePerformance.ts     # Config performance adaptative
└── providers/
    └── SmoothScrollProvider.tsx  # Provider Lenis
```

---

## Conventions de Code

### Composants
- Tous les composants avec effets lourds utilisent `dynamic()` avec `{ ssr: false }`
- Les composants 3D ont des fallbacks pour mobile/reduced-motion
- Utiliser `data-cursor="hover"` sur les éléments interactifs

### Animations
- Préférer `motion/react` pour les animations simples
- GSAP pour les animations complexes avec timeline
- Three.js/R3F pour tout ce qui est 3D

### Performance
- Utiliser `usePerformance()` pour adapter les effets selon le device
- Les effets 3D sont désactivés sur mobile
- Respecter `prefers-reduced-motion`

### Style
- Dark theme par défaut (#0a0a0a background)
- Couleur accent: #ff4d00 (orange)
- Font mono pour les labels/UI: Geist Mono
- Grain effect global via CSS

---

## Projets (données mock)

Les projets sont définis dans plusieurs fichiers avec cette structure:
```typescript
{
  id: string;           // slug URL
  title: string;        // Nom en majuscules
  category: string;     // Ex: "WEB EXPERIENCE"
  year: string;
  color: string;        // Couleur accent du projet (#hex)
  description: string;
  tags: string[];
}
```

Projets actuels: PROJECT ALPHA, NEURAL CANVAS, VOID STUDIO, PARTICLE FLOW, ECHO SPACE

---

## Points d'Attention

1. **Preloader** - Durée de 4.5s, ne pas raccourcir (feedback utilisateur)
2. **Curseur custom** - Désactivé sur mobile/touch devices
3. **Composants 3D** - Toujours vérifier `enable3D` du hook usePerformance
4. **Images** - Actuellement des placeholders, pas de vraies images

---

## Fonctionnalités Implémentées

✅ Liquid Cursor (metaballs)
✅ Noise/Glitch Transitions
✅ Page Lab avec 4 expériences (ASCII, Particles, Waves, Noise)
✅ Horizontal Gallery avec parallax
✅ Skills Matrix 3D avec matrix rain
✅ Timeline 3D interactive
✅ Case Study Immersive (scroll storytelling)
✅ Optimisations mobile/reduced-motion
✅ SEO meta tags

---

## À Faire (voir PLAN.md)

- [ ] Shader Gallery (interface de sélection)
- [ ] Loop infini seamless pour Horizontal Gallery
- [ ] Easter Eggs (Konami code, console messages)
- [ ] Performance monitoring
- [ ] Sound design optionnel
- [ ] Vraies images pour les projets

---

## Commandes

```bash
npm run dev      # Serveur de dev (port 3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linting
```

---

## Ressources & Inspiration

- [Awwwards Three.js](https://www.awwwards.com/websites/three-js/)
- [Bruno Simon Portfolio](https://bruno-simon.com/)
- [Codrops WebGL](https://tympanus.net/codrops/tag/webgl/)
- [Made With GSAP](https://madewithgsap.com/)

---

*Dernière mise à jour: Janvier 2026*
