# Design System Rework - Tracking

## Direction validée

**Visual Thesis** : Design éditorial monochrome, dark, accent unique #ffaa00. Inspiration fabric.codebydennis.com.

**Interaction Thesis** : Transitions sèches (150-250ms ease-out), hover = opacity shift, scroll reveals en stagger. Aucun bounce/elastic/spring underdamped.

**Fonts** : Dela Gothic One (display/titres) + Space Mono (body/labels/tout le reste). 2 fonts max.

**Couleurs** : Foreground #e8e8e8, Muted #666666, Accent #ffaa00. Zéro couleur secondaire.

---

## Fait

### Design System (Phase 3)
- [x] Fonts : Space Grotesk, JetBrains Mono, Syne, Major Mono Display -> **Dela Gothic One + Space Mono**
- [x] CSS globals : body en mono 14px, h1/h2 en Dela Gothic uppercase, suppression font-sans/font-particle
- [x] Constants : couleurs secondaires supprimées, durées raccourcies, easing simplifié
- [x] Toutes les refs COLORS.secondary remplacées par COLORS.accent dans GlitchCursor, SectionEffects, SectionCursor, ParticleText

### Homepage Desktop
- [x] **AsciiBlocks** : nouveau composant canvas 2D qui parse l'ASCII art (demi-blocs Unicode ▄▀█)
- [x] Physique : spring/damping pour retour, repulsion au hover, jitter lent sur blocs déplacés
- [x] Scale dynamique : blocs déplacés grossissent proportionnellement à la distance
- [x] Auto-scale : taille des blocs s'adapte au viewport (55% largeur, 60% hauteur)
- [x] Alignement configurable (left/right/center, top/bottom/center + padding)
- [x] **Nav links en essaims** : 25 particules accent par navlink, attraction magnétique vers curseur
- [x] Physique Newtonienne : essaims repoussent les blocs ASCII, blocs repoussent les essaims
- [x] Dock : anneau + texte accent quand essaim est proche du curseur, clic = navigate
- [x] Accessibilité : liens sr-only dans le DOM, canvas aria-hidden
- [x] Preloader supprimé
- [x] Floating shapes, grid overlay, corner accents, side decorations supprimés
- [x] Homepage en 100vh, plus de scroll

### Homepage Mobile
- [x] Navigation en liste verticale monochrome (plus de cards multicolores)
- [x] Typo 12vw, role ticker avec AnimatePresence
- [x] prefers-reduced-motion respecté

### Skills Mobile
- [x] Bottom sheet avec drag handle, swipe-to-dismiss
- [x] 2 snap points (peek 45dvh, full 85dvh)
- [x] Scroll interne corrigé (onPointerDown stopPropagation)
- [x] Safe area iPhone

### Contact Mobile
- [x] FallingPattern désactivé sur mobile (zéro GPU)
- [x] Email en clair, tap-to-copy direct (plus de glitch/setInterval 100ms)
- [x] Social links en lignes compactes (plus de cards géantes multicolores)
- [x] Toast simplifié (inline "COPIED")

### Contact Desktop
- [x] Social cards monochrome accent (plus de vert/bleu par lien)

---

## En cours / A faire

### Homepage Desktop - Piste "previews flottantes"
- [ ] **Navlinks = visuels/screenshots de chaque page** qui flottent et interagissent avec les blocs ASCII
- [ ] Clic sur un preview -> zoom plein écran -> swap seamless vers la vraie page DOM
- [ ] Question ouverte : flat 2D (canvas drawImage) ou perspective 3D (R3F planes) ?
- [ ] Screenshots statiques dans `/public/images/previews/`
- [ ] Le design actuel des essaims (particules accent) sera remplacé par les previews

### Composant Boxy App Icons (21st.dev)
Composant SVG isométrique avec des icones 3D en hover. Pistes d'intégration :
- [ ] **Page Contact** : remplacer les liens sociaux actuels (GitHub, LinkedIn) par des versions isométriques custom dans le même style boxy. Les icones actuelles sont boring, ce composant apporterait du caractère
- [ ] **Page Projets** : variante avec les icones/logos de chaque projet au lieu d'icones d'apps. Chaque "boxy icon" représenterait un projet avec sa couleur accent, clic = navigation vers le case study
- [ ] **Réflexion en cours** : le style isométrique doit matcher le design system monochrome. Adapter les couleurs (gris/accent au lieu des couleurs rainbow) et potentiellement animer les hover avec le même feeling "sec" que le reste du site
- Le composant source est sauvegardé dans le plan mais PAS encore intégré - à adapter d'abord au design system

### Pages à passer au nouveau design system
- [ ] NavigationGrid desktop (encore des couleurs secondaires dans les data)
- [ ] Page Work (liste projets)
- [ ] Page Work/[slug] (case study)
- [ ] Page Journey (timeline)
- [ ] Page About
- [ ] Page Skills desktop (NeuralNetwork2D)
- [ ] Navigation principale (MainNav)

### Couleurs secondaires restantes dans le code
- `src/data/timeline.ts` : #8844ff, #00ff88
- `src/data/philosophy.ts` : #00ff88
- `src/components/sections/NoiseSection.tsx` : #00ccff
- `src/components/sections/NavigationGrid.tsx` : #00ccff, #8844ff, #ff0088, #ffcc00
- `src/components/experiments/NoiseTerrain.tsx` : #00ff88

---

## Pistes explorées puis abandonnées
- Nav links comme éléments DOM positionnés au-dessus du canvas (sync complexe, 2 systèmes)
- Nav links texte flottants simples sur canvas (boring, texte trop petit)
- Toute l'app en canvas 2D (SEO mort, accessibilité morte, formulaires impossibles, reconstruire un navigateur)
- Essaims de particules accent comme navlinks (visuellement pas assez impactant)

---

## Composant source : Boxy App Icons

Composant SVG isométrique récupéré de 21st.dev. Style "boxy 3D" avec hover translateY.
A adapter au design system (monochrome + accent) avant intégration.

Source : `boxy-app-icons.tsx` - SVG with 6 isometric app icons (PayPal, GitLab, Instagram, Telegram, Spotify, Discord).
Structure : viewBox 249x144, hover `-translate-y-5`, stroke/fill transitions `group-hover`.
Dépendances : aucune (SVG pur + Tailwind classes).

Le composant sera customisé : icones remplacées par GitHub/LinkedIn (contact) ou logos projets (work), couleurs adaptées au design system monochrome.
