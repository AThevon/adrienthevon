# Portfolio Creative - Plan d'Implémentation

> Plan des features "WOW Factor" inspirées des meilleures références de creative coding mondial.

---

## Stack Additionnelle

- [x] Installer `three.js` / `@react-three/fiber`
- [x] Installer `@react-three/drei`
- [x] Installer `simplex-noise`

---

## 1. Effets Globaux

### 1.1 Liquid Cursor
> Le curseur déforme l'espace autour de lui comme un liquide avec un effet de distortion WebGL.

- [x] Créer le composant `LiquidCursor.tsx`
- [x] Trail effect avec metaballs
- [x] Intégrer sur la page d'accueil
- [x] Option pour activer/désactiver l'effet

**Inspiration:** [Codrops Distortion Effects](https://tympanus.net/codrops/tag/distortion/)

---

### 1.2 Noise Takeover / Glitch Transitions
> Transitions avec du bruit TV/VHS entre sections, grain qui s'intensifie aux moments clés.

- [x] Créer le composant `NoiseTransition.tsx`
- [x] Effet de glitch/static TV
- [x] Variante "scanlines" CRT effect
- [x] Variante "RGB split"
- [x] Hook `useNoiseTransition` pour trigger

**Inspiration:** [Pixel Manipulation Effects](https://www.bomberbot.com/javascript/create-pixel-effects-with-javascript-and-html-canvas/)

---

## 2. Page: Lab / Experiments

> Page dédiée aux expérimentations créatives avec plusieurs mini-expériences interactives.

### 2.1 Structure de la page
- [x] Créer `/app/lab/page.tsx`
- [x] Navigation entre les expériences
- [x] Layout immersif full-screen

### 2.2 ASCII Portrait
> Photo qui se transforme en ASCII art en temps réel, les caractères réagissent au curseur.

- [x] Créer le composant `AsciiEffect.tsx`
- [x] Conversion texte → ASCII via canvas
- [x] Réactivité au mouvement du curseur
- [x] Animation de transition avec couleurs

**Inspiration:** [Zeke Studio Generative Typography](https://zeke.studio/gentype/)

### 2.3 Particle Playground
> Milliers de particules qui forment du texte/images, se dispersent et se reforment au survol.

- [x] Créer le composant `ParticleText.tsx`
- [x] Système de particules canvas
- [x] Morphing texte ↔ dispersion
- [x] Interaction au hover avec répulsion

**Inspiration:** [Made With GSAP](https://madewithgsap.com/)

### 2.4 Shader Gallery
> Collection de shaders expérimentaux interactifs.

- [ ] Shader "Waves" (ondulations)
- [ ] Shader "Metaballs" (blobs qui fusionnent)
- [ ] Shader "Fractal Noise"
- [ ] Interface de sélection

---

## 3. Section: Infinite Horizontal Gallery

> Scroll horizontal infini avec parallax multi-layers et effets de displacement shader.

- [x] Créer le composant `HorizontalGallery.tsx`
- [x] Scroll horizontal smooth avec spring physics
- [x] Parallax multi-couches background
- [x] RGB split effect au hover
- [x] Progress indicator animé
- [x] Intégrer dans la page Work avec toggle view
- [ ] Loop infini seamless (optionnel)

**Inspiration:** [PORSCHEvolution](https://www.framer.com/blog/parallax-scrolling-examples/), [Bertani](https://www.framer.com/blog/parallax-scrolling-examples/)

---

## 4. Page: Case Study Immersive

> Scroll storytelling vertical avec transitions shader et révélation progressive du contenu.

- [x] Créer le template `/app/work/[slug]/immersive/page.tsx`
- [x] Sections full-height avec snap scroll
- [x] Transitions shader entre sections
- [x] Texte qui se révèle lettre par lettre avec physics
- [x] Progress indicator créatif (ligne verticale animée)
- [x] Parallax sur les images
- [ ] Sound design optionnel

**Inspiration:** [The Boat](https://www.sbs.com.au/theboat/), [Firewatch](http://www.firewatchgame.com/)

---

## 5. Section: Skills Matrix 3D

> Grid 3D de compétences qui rotate dans l'espace avec effet "matrix rain" en background.

- [x] Créer le composant `SkillsMatrix.tsx`
- [x] Grid 3D avec Three.js
- [x] Rotation contrôlée par le scroll/curseur
- [x] Chaque skill = cellule interactive avec hover state
- [x] Connexions animées entre skills liés (lignes/particules)
- [x] Background "matrix rain" effect
- [x] Intégrer dans la section About ou page dédiée

**Inspiration:** [Bruno Simon Portfolio](https://bruno-simon.com/)

---

## 6. Section: Timeline 3D

> Parcours interactif de carrière, chaque étape est un "node" dans l'espace 3D.

- [x] Créer le composant `Timeline3D.tsx`
- [x] Path 3D avec nodes
- [x] Navigation par scroll
- [x] Navigation par click sur nodes
- [x] Camera qui suit le parcours
- [x] Contenu qui apparaît à chaque node
- [x] Particules/lignes de connexion animées

**Inspiration:** [Sébastien Lempens Portfolio](https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025)

---

## 7. Easter Eggs

### 7.1 Konami Code
> Séquence secrète ↑↑↓↓←→←→BA qui débloque un mode spécial.

- [ ] Créer le hook `useKonamiCode.ts`
- [ ] Mode "retro game" activé
- [ ] CRT shader effect
- [ ] Palette 8-bit
- [ ] Sound effects optionnels
- [ ] Persistance en localStorage

### 7.2 Console Messages
- [ ] Easter egg dans la console dev
- [ ] ASCII art signature
- [ ] Message de recrutement

---

## 8. Optimisations & Polish

- [x] Lazy loading des composants 3D
- [x] Fallback pour mobile (désactiver effets lourds)
- [x] Détection des préférences `prefers-reduced-motion`
- [x] Loading states pour les shaders
- [ ] Performance monitoring
- [x] SEO meta tags pour chaque page

---

## Ordre d'Implémentation Suggéré

1. **Stack** - Installer les dépendances
2. **Liquid Cursor** - Impact visuel immédiat
3. **ASCII Portrait** - Effet signature mémorable
4. **Horizontal Gallery** - Grosse section showcase
5. **Noise Transitions** - Polish entre sections
6. **Skills Matrix 3D** - Section interactive
7. **Particle Playground** - Expérimentation
8. **Timeline 3D** - Storytelling
9. **Case Study Immersive** - Template avancé
10. **Easter Eggs** - Fun final
11. **Optimisations** - Polish & performance

---

## Ressources & Inspiration

- [Awwwards Three.js Collection](https://www.awwwards.com/websites/three-js/)
- [Awwwards WebGL Collection](https://www.awwwards.com/websites/webgl/)
- [Bruno Simon Portfolio](https://bruno-simon.com/)
- [Codrops WebGL Tutorials](https://tympanus.net/codrops/tag/webgl/)
- [Made With GSAP](https://madewithgsap.com/)
- [Three.js Journey](https://threejs-journey.com/)
- [Shader Park](https://shaderpark.com/)

---

*Dernière mise à jour: Janvier 2026*
