# GPU Probe & Fallback Design

> Detect si le device peut faire tourner les effets Canvas 2D correctement, et afficher un fallback SVG animé sinon.

## Problème

Sur certains Chrome/Windows, les effets Canvas 2D (ParticleText, SectionEffects) ne rendent rien — canvas vide, aucune erreur, aucun fallback. Le système actuel (`usePerformance`) ne détecte que mobile/tablet/reduced-motion, pas les GPUs cassés ou le software rendering.

## Solution : GPU Probe (micro-benchmark Canvas 2D)

### Nouveau hook : `useGPUProbe`

**Fichier :** `src/hooks/useGPUProbe.ts`

Un micro-benchmark qui teste la capacité réelle du navigateur à rendre sur Canvas 2D :

1. Crée un canvas offscreen 200x200 (caché)
2. Rend 10 frames d'opérations similaires aux effets réels : `arc()`, `fill()`, `createRadialGradient()`, `clearRect()`
3. Vérifie deux choses :
   - **Pixel check** : `getImageData()` après rendu — si tous les pixels sont transparents → `canRender: false`
   - **FPS check** : temps total des 10 frames — si < 30 FPS estimés → `tier: "low"`
4. Cache le résultat dans `sessionStorage` (clé `gpu-probe-result`)
5. Durée : ~50-80ms, invisible pendant le preloader

```typescript
interface GPUProbeResult {
  canRender: boolean;   // le GPU rend vraiment des pixels
  tier: "high" | "low"; // capable de tenir 30+ FPS
  isProbing: boolean;   // le test est en cours
}
```

### Intégration dans `usePerformance`

Ordre de priorité mis à jour :

1. `reducedMotion` → tout désactivé (inchangé)
2. `mobile` → tout désactivé (inchangé)
3. **`canRender === false`** → même config que mobile (pas de particles, pas de 3D)
4. **`tier === "low"`** → même config que tablet (particles réduites, multiplier 0.5)
5. `tablet / lowPowerMode` → config réduite (inchangé)
6. `desktop + GPU ok` → full effects (inchangé)

Le probe a priorité sur la détection device. Pendant le probing (`isProbing: true`), on retourne la config desktop par défaut (le preloader masque tout).

### Fix `ParticleText.onReady`

Le callback `onReady` est actuellement appelé dès que les particules existent en mémoire, même si rien ne s'affiche. Fix : après le premier `requestAnimationFrame`, vérifier avec `getImageData()` que des pixels non-transparents existent sur le canvas. Si oui → `onReady()`. Sinon → ne jamais appeler `onReady()`, le timeout de 2s dans Hero déclenche le fallback. Double sécurité.

## Fallback : Stroke + Fill Reveal (SVG)

Quand les effets Canvas sont désactivés (GPU probe fail OU timeout ParticleText), le titre "ADRIEN THEVON" est rendu avec une animation SVG :

### Séquence d'animation

1. **Phase 1 — Stroke draw** (~1.2s) : Chaque lettre est un `<text>` SVG avec `stroke-dasharray` + `stroke-dashoffset` animés par Motion. Couleur accent (#ff4d00), stroke-width fin. Stagger ~0.08s entre lettres.

2. **Phase 2 — Fill reveal** (~0.6s) : Le `fill` passe de transparent à accent. Le stroke fade out progressivement.

3. **Phase 3 — Glow pulse** (loop) : Léger `text-shadow` en accent qui pulse (opacity 0.3→0.6→0.3).

### Bonus

- Gradient animé subtil en arrière-plan (lumière qui passe)
- Les floating shapes CSS/Motion existantes dans Hero restent actives
- Zero Canvas, zero WebGL — SVG `<text>` + `stroke-dasharray` animés par framer-motion

## Fichiers impactés

| Fichier | Action |
|---------|--------|
| `src/hooks/useGPUProbe.ts` | **Nouveau** — micro-benchmark Canvas 2D |
| `src/hooks/usePerformance.ts` | **Modifié** — intègre le résultat du probe |
| `src/hooks/index.ts` | **Modifié** — export du nouveau hook |
| `src/components/experiments/ParticleText.tsx` | **Modifié** — fix `onReady` avec visual check |
| `src/components/sections/Hero.tsx` | **Modifié** — nouveau fallback SVG stroke+fill |
