# Claude Code Context - Adrien Thevon

> Ce fichier fournit le contexte nécessaire pour que Claude Code comprenne rapidement ce projet.

---

## Résumé du Projet

Portfolio créatif pour Adrien Thevon avec des effets de creative coding avancés. Le style est **expérimental**, inspiré des meilleures références de creative coding mondial (Awwwards, Bruno Simon, Codrops).

**Domaine:** Dev / Creative Coder
**Vibe:** Expérimental, dark theme avec accents colorés
**Langues:** FR (principal) / EN

---

## Stack Technique

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (framer-motion), GSAP
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **i18n:** next-intl (cookie-based, FR/EN)
- **Smooth Scroll:** Lenis
- **Noise:** simplex-noise
- **Language:** TypeScript

---

## Structure du Projet

```
src/
├── app/
│   ├── globals.css           # Styles globaux, grain effect, glitch CSS
│   ├── layout.tsx            # Layout root avec SEO metadata + LanguageSwitcher
│   ├── page.tsx              # Homepage avec toutes les sections
│   └── work/
│       ├── layout.tsx        # SEO pour /work
│       ├── page.tsx          # Liste des projets (gallery/list toggle)
│       └── [slug]/
│           ├── page.tsx      # Case study standard
│           └── immersive/
│               └── page.tsx  # Case study immersif (scroll storytelling)
├── components/
│   ├── effects/
│   │   ├── GlitchCursor.tsx      # Curseur custom avec texte contextuel par section
│   │   ├── SectionEffects.tsx    # Particules par section (constellation, magnetic, etc.)
│   │   ├── CustomCursor.tsx      # Curseur custom simple
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
│   │   ├── Hero.tsx                  # Section hero avec floating shapes
│   │   ├── Projects.tsx              # Grille de projets
│   │   ├── NavigationGrid.tsx        # Grille de navigation homepage
│   │   ├── NavigationStrips.tsx      # Strips de navigation homepage
│   │   ├── HorizontalGallery.tsx     # Scroll horizontal avec parallax
│   │   ├── NeuralNetwork2D.tsx       # Réseau neuronal 2D Canvas (Skills)
│   │   └── ConstellationTimeline.tsx # Timeline constellation 2D Canvas (Journey)
│   └── ui/
│       ├── MagneticButton.tsx    # Bouton avec effet magnétique
│       ├── TextReveal.tsx        # Révélation de texte animée
│       ├── RollingText.tsx       # Texte qui roule au hover
│       ├── HoverReveal.tsx       # Révélation d'image au hover
│       ├── ScrollImageReveal.tsx # Image reveal au scroll
│       ├── DualText.tsx          # Texte avec message caché au hover
│       └── LanguageSwitcher.tsx  # Switch FR/EN avec persistance cookie
├── data/
│   ├── projects.ts           # Données des projets (structure + helpers)
│   ├── timeline.ts           # Événements de la timeline (avec clés i18n)
│   └── skills.ts             # Compétences et catégories (avec liens projets)
├── hooks/
│   ├── index.ts
│   ├── useReducedMotion.ts   # Détecte prefers-reduced-motion
│   ├── useDeviceDetect.ts    # Détecte mobile/tablet/desktop
│   ├── usePerformance.ts     # Config performance adaptative
│   └── useThrottle.ts        # Throttle pour events
├── i18n/
│   └── request.ts            # Config next-intl (cookie + Accept-Language fallback)
├── lib/
│   ├── constants.ts          # Couleurs et constantes globales
│   ├── site.ts               # SEO: domaine canonique, identité, routes du sitemap
│   ├── seo.ts                # SEO: buildMetadata() + clampDescription()
│   ├── og.ts                 # OG: chargement polices/logo, helpers de rendu
│   └── skillLogos.ts         # URLs des logos Simple Icons pour skills
└── providers/
    └── SmoothScrollProvider.tsx  # Provider Lenis
messages/
├── fr.json                   # Traductions françaises (principal)
└── en.json                   # Traductions anglaises
```

---

## Internationalisation (i18n)

Le site utilise **next-intl** avec :
- **FR** comme langue principale
- **EN** comme langue secondaire
- Persistance via cookie `NEXT_LOCALE`
- Fallback sur `Accept-Language` header
- Composant `LanguageSwitcher` en haut à droite

### Structure des traductions

```typescript
// Utilisation dans les composants
const t = useTranslations("section");
const tProject = useTranslations(`projectsData.${slug}`);

// Pour les données dynamiques (timeline)
const tEvents = useTranslations("timeline.events");
const title = tEvents(`${event.key}.title`);
```

### Fichiers de traduction

- `messages/fr.json` - Traductions FR complètes
- `messages/en.json` - Traductions EN complètes

Sections traduites : hero, projects, skills, timeline, philosophy, about, contact, projectPage, projectsData, cursor, nav, meta

---

## Conventions de Code

### Composants
- Tous les composants avec effets lourds utilisent `dynamic()` avec `{ ssr: false }`
- Les composants 3D ont des fallbacks pour mobile/reduced-motion
- Utiliser `data-cursor="hover"` sur les éléments interactifs
- Utiliser `data-cursor-mode="section"` pour définir le mode curseur par section

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

## Projets (vrais projets)

Les projets sont définis dans `src/data/projects.ts` :

```typescript
interface Project {
  id: string;           // slug URL (ex: "under-the-flow")
  title: string;        // Nom en majuscules
  category: string;     // Ex: "WEB PLATFORM"
  year: string;
  color: string;        // Couleur accent du projet (#hex)
  description: string;
  longDescription: string;
  tags: string[];
  role: string;
  client: string;
  link: string;
  image: string;
  sections: ProjectSection[];  // Pour le case study
}
```

**Projets actuels :**
- **Under The Flow** (2024) - Plateforme de sessions live hip-hop
- **Victor Denay** (2024) - Portfolio monteur/photographe
- **Dépense Man** (2024) - App de gestion de finances (PWA)
- **Linekut** (2024) - Convertisseur d'images en patrons découpables

Les textes des projets sont traduits via `projectsData.{slug}` dans les fichiers de traduction.

**Timeline réelle (2022-2026) :**
- **2022** - Découverte du code web, formation React
- **2023** - Premier diplôme, première app React pro
- **2024** - Second diplôme (concepteur), configurateur 3D chez Airbus
- **2025** - Entreprise US, image processing et frontend specialist
- **2026** - Multiplication d'outils et d'apps en mode créatif

---

## SEO / Metadata / Open Graph

Domaine canonique : **https://athevon.dev** (défini dans `src/lib/site.ts`).

### Règles

1. **Toute nouvelle page passe par `buildMetadata()`** (`src/lib/seo.ts`). Ne jamais
   écrire un objet `openGraph` ou `twitter` partiel : Next.js merge les metadata de
   façon *shallow*, un objet partiel dans un layout enfant écrase intégralement celui
   du parent (perte de `siteName`, `summary_large_image` et surtout de l'image OG).
2. **`metadataBase` ne doit jamais dépendre de `VERCEL_URL`** : cette variable pointe
   vers l'URL unique du déploiement, pas vers le domaine. `site.ts` gère la résolution
   (prod -> domaine canonique, preview -> URL du déploiement, local -> localhost).
3. **Image OG** : `image: null` sur un segment qui possède son propre
   `opengraph-image.tsx` (racine et `/work/[slug]`), sinon l'image racine par défaut.
4. **Descriptions** : `clampDescription()` supprime les retours à la ligne et tronque
   à 165 caractères. Ne jamais passer un `longDescription` multi-paragraphes.

### Fichiers

- `src/app/robots.ts` - bloque l'indexation hors production
- `src/app/sitemap.ts` - pages statiques + projets (pas les `/immersive`, canonical
  pointant vers le case study standard)
- `src/app/manifest.ts` - PWA, icônes dans `public/icons/`
- `src/components/seo/JsonLd.tsx` - schema Person + WebSite (global) et CreativeWork (projets)
- `assets/og/` - polices sous-ensemblées + logo pour le rendu des images OG.
  Déclaré dans `outputFileTracingIncludes` (next.config.ts), sinon ENOENT en prod.

---

## Points d'Attention

1. **Preloader** - Durée de 4.5s, ne pas raccourcir (feedback utilisateur)
2. **Curseur custom** - Désactivé sur mobile/touch devices
3. **Composants 3D** - Toujours vérifier `enable3D` du hook usePerformance
4. **LanguageSwitcher** - Positionné `top-6 right-6 z-50`, attention aux overlaps
5. **Images** - Actuellement des placeholders, pas de vraies images
6. **Contact** - Pas de formulaire ni d'envoi d'email. Le seul point de contact est
   l'adresse rendue en canvas sur `/contact` (anti-scraping, clic pour copier).
   L'ancienne route `/api/contact` et ses composants ont été supprimés : ils ne
   faisaient qu'un `console.log` et n'étaient importés nulle part.
7. **i18n et SEO** - La locale vient d'un cookie, pas de l'URL. Il n'existe donc pas
   d'URL distincte par langue : pas de `hreflang` possible, Google n'indexe que la
   version servie par défaut (FR).

---

## Fonctionnalités Implémentées

### Pages complètes
- ✅ **Homepage** - NavigationGrid + NavigationStrips pour navigation visuelle
- ✅ **Work** - Liste projets avec toggle gallery/list view
- ✅ **Work/[slug]** - Case studies avec vue standard et immersive
- ✅ **Skills** - NeuralNetwork2D Canvas avec système de nodes interactifs et liens projets
- ✅ **Journey** - ConstellationTimeline Canvas avec navigation entre événements

### Pages en cours de rework
- 🚧 **Philosophy** - À retravailler
- 🚧 **About** - À retravailler
- 🚧 **Contact** - À retravailler

### Effets et composants
- GlitchCursor avec texte contextuel par section
- CustomCursor pour pages spécifiques (Skills)
- NavigationGrid/Strips avec effets au hover
- NeuralNetwork2D (Canvas force-directed graph)
- ConstellationTimeline (Canvas avec étoiles et shooting stars)
- HorizontalGallery avec parallax
- DualText pour messages cachés au hover
- Internationalisation FR/EN complète
- Optimisations mobile/reduced-motion
- SEO meta tags

---

## Commandes

```bash
npm run dev      # Serveur de dev (port 3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linting
```

---

*Dernière mise à jour: Août 2026*
