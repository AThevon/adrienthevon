# GPU Probe & SVG Fallback — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Détecter si le navigateur peut rendre du Canvas 2D correctement via un micro-benchmark, et afficher un fallback SVG stroke+fill animé si ce n'est pas le cas.

**Architecture:** Nouveau hook `useGPUProbe` qui exécute un benchmark Canvas 2D au premier chargement (résultat caché en sessionStorage). Le hook `usePerformance` l'intègre dans sa logique de décision. Le fallback dans Hero est remplacé par une animation SVG stroke-draw + fill-reveal pilotée par framer-motion.

**Tech Stack:** React hooks, Canvas 2D API, SVG `<text>` + `stroke-dasharray`, motion/react (framer-motion), sessionStorage

---

### Task 1: Créer le hook `useGPUProbe`

**Files:**
- Create: `src/hooks/useGPUProbe.ts`

**Step 1: Créer le fichier avec le micro-benchmark**

```typescript
"use client";

import { useState, useEffect } from "react";

interface GPUProbeResult {
  canRender: boolean;
  tier: "high" | "low";
  isProbing: boolean;
}

const SESSION_KEY = "gpu-probe-result";

const SSR_DEFAULT: GPUProbeResult = {
  canRender: true,
  tier: "high",
  isProbing: true,
};

function runProbe(): Omit<GPUProbeResult, "isProbing"> {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return { canRender: false, tier: "low" };
  }

  const FRAMES = 10;
  const start = performance.now();

  for (let f = 0; f < FRAMES; f++) {
    ctx.clearRect(0, 0, 200, 200);

    // Arc + fill (comme les particules)
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 200,
        Math.random() * 200,
        5 + Math.random() * 15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${0.3 + Math.random() * 0.7})`;
      ctx.fill();
    }

    // Radial gradient (comme SectionEffects orbs)
    const grad = ctx.createRadialGradient(100, 100, 0, 100, 100, 80);
    grad.addColorStop(0, "rgba(255, 77, 0, 0.6)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  const elapsed = performance.now() - start;

  // Pixel check : vérifier qu'il y a des pixels non-transparents
  const imageData = ctx.getImageData(0, 0, 200, 200);
  const data = imageData.data;
  let hasPixels = false;

  // Sample tous les 40 pixels pour rester rapide
  for (let i = 3; i < data.length; i += 160) {
    if (data[i] > 0) {
      hasPixels = true;
      break;
    }
  }

  if (!hasPixels) {
    return { canRender: false, tier: "low" };
  }

  // FPS check : 10 frames en combien de ms ?
  // < 333ms = 30+ FPS équivalent, on considère "high"
  const tier = elapsed < 333 ? "high" : "low";

  return { canRender: true, tier };
}

export function useGPUProbe(): GPUProbeResult {
  const [result, setResult] = useState<GPUProbeResult>(SSR_DEFAULT);

  useEffect(() => {
    // Vérifier le cache sessionStorage
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Omit<GPUProbeResult, "isProbing">;
        setResult({ ...parsed, isProbing: false });
        return;
      }
    } catch {
      // sessionStorage indisponible, on continue
    }

    // Lancer le probe
    const probeResult = runProbe();

    // Cacher le résultat
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(probeResult));
    } catch {
      // Pas grave si ça échoue
    }

    setResult({ ...probeResult, isProbing: false });
  }, []);

  return result;
}
```

**Step 2: Vérifier que le build passe**

Run: `npm run build`
Expected: Build successful, pas d'erreurs TS

**Step 3: Commit**

```bash
git add src/hooks/useGPUProbe.ts
git commit -m "feat: ajout useGPUProbe — micro-benchmark Canvas 2D"
```

---

### Task 2: Exporter le hook et l'intégrer dans `usePerformance`

**Files:**
- Modify: `src/hooks/index.ts`
- Modify: `src/hooks/usePerformance.ts`

**Step 1: Ajouter l'export dans index.ts**

Dans `src/hooks/index.ts`, ajouter :
```typescript
export { useGPUProbe } from "./useGPUProbe";
```

**Step 2: Modifier `usePerformance` pour intégrer le probe**

Dans `src/hooks/usePerformance.ts`, le hook doit :
1. Appeler `useGPUProbe()`
2. Ajouter 2 nouveaux cas dans la logique de décision, entre mobile et tablet :
   - `canRender === false` → même config que mobile
   - `tier === "low"` → même config que tablet

```typescript
"use client";

import { useReducedMotion } from "./useReducedMotion";
import { useDeviceDetect } from "./useDeviceDetect";
import { useGPUProbe } from "./useGPUProbe";

interface PerformanceConfig {
  enable3D: boolean;
  enableParticles: boolean;
  enableShaders: boolean;
  enableSmoothScroll: boolean;
  enableCursorEffects: boolean;
  particleMultiplier: number;
  enableAnimations: boolean;
}

export function usePerformance(): PerformanceConfig {
  const reducedMotion = useReducedMotion();
  const { isMobile, isTablet, isLowPowerMode } = useDeviceDetect();
  const { canRender, tier } = useGPUProbe();

  // If user prefers reduced motion, disable most effects
  if (reducedMotion) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: false,
      enableCursorEffects: false,
      particleMultiplier: 0,
      enableAnimations: false,
    };
  }

  // Mobile devices: disable heavy effects
  if (isMobile) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: true,
      enableCursorEffects: false,
      particleMultiplier: 0,
      enableAnimations: true,
    };
  }

  // GPU probe: can't render canvas at all
  if (!canRender) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: true,
      enableCursorEffects: true,
      particleMultiplier: 0,
      enableAnimations: true,
    };
  }

  // GPU probe: low performance tier
  if (tier === "low") {
    return {
      enable3D: true,
      enableParticles: true,
      enableShaders: true,
      enableSmoothScroll: true,
      enableCursorEffects: true,
      particleMultiplier: 0.3,
      enableAnimations: true,
    };
  }

  // Tablets: reduced effects
  if (isTablet || isLowPowerMode) {
    return {
      enable3D: true,
      enableParticles: true,
      enableShaders: true,
      enableSmoothScroll: true,
      enableCursorEffects: false,
      particleMultiplier: 0.5,
      enableAnimations: true,
    };
  }

  // Desktop: full effects
  return {
    enable3D: true,
    enableParticles: true,
    enableShaders: true,
    enableSmoothScroll: true,
    enableCursorEffects: true,
    particleMultiplier: 1,
    enableAnimations: true,
  };
}
```

Note : quand `canRender` est false, on garde `enableCursorEffects: true` car le curseur custom n'utilise pas Canvas. Et `enableAnimations: true` car les animations Motion/CSS marchent toujours.

**Step 3: Vérifier que le build passe**

Run: `npm run build`
Expected: Build successful

**Step 4: Commit**

```bash
git add src/hooks/index.ts src/hooks/usePerformance.ts
git commit -m "feat: intégration GPU probe dans usePerformance"
```

---

### Task 3: Fix `ParticleText.onReady` — visual check

**Files:**
- Modify: `src/components/experiments/ParticleText.tsx`

**Step 1: Modifier le callback onReady pour vérifier le rendu visuel**

Le `onReady` est actuellement appelé dans `initParticles` dès que `particles.length > 0`. Il faut le déplacer : après la première frame de rendu, vérifier qu'il y a des pixels non-transparents sur le canvas.

Dans la fonction `animate`, après le premier appel complet (première frame rendue), ajouter un check :

```typescript
// Ajouter un ref pour tracker si onReady a été appelé
const readyCalledRef = useRef(false);

// Dans initParticles : RETIRER l'appel à onReady
// Supprimer ces lignes :
//   if (particles.length > 0 && onReady) {
//     onReady();
//   }

// Dans la boucle animate, après le draw complet, ajouter :
// Visual check: verify pixels were actually rendered
if (!readyCalledRef.current && onReady && particles.length > 0) {
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  // Sample center area
  const sampleX = Math.floor(width * 0.3);
  const sampleY = Math.floor(height * 0.3);
  const sampleW = Math.floor(width * 0.4);
  const sampleH = Math.floor(height * 0.4);

  try {
    const imageData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
    const data = imageData.data;
    let hasPixels = false;
    for (let i = 3; i < data.length; i += 160) {
      if (data[i] > 0) {
        hasPixels = true;
        break;
      }
    }
    if (hasPixels) {
      readyCalledRef.current = true;
      onReady();
    }
  } catch {
    // getImageData peut échouer (CORS, etc.) — on appelle onReady par sécurité
    readyCalledRef.current = true;
    onReady();
  }
}
```

**Step 2: Vérifier que le build passe**

Run: `npm run build`
Expected: Build successful

**Step 3: Commit**

```bash
git add src/components/experiments/ParticleText.tsx
git commit -m "fix: ParticleText.onReady vérifie le rendu visuel avant de signaler ready"
```

---

### Task 4: Créer le fallback SVG Stroke + Fill Reveal

**Files:**
- Create: `src/components/ui/StrokeRevealTitle.tsx`

**Step 1: Créer le composant SVG animé**

Ce composant rend "ADRIEN" / "THEVON" en SVG `<text>` avec une animation en 3 phases :
1. Stroke draw (lettres dessinées en outline, staggeré)
2. Fill reveal (remplissage progressif)
3. Glow pulse (subtle loop)

```typescript
"use client";

import { motion } from "motion/react";

interface StrokeRevealTitleProps {
  delay?: number;
}

const lines = ["ADRIEN", "THEVON"];

// Each letter animated individually
function AnimatedLetter({
  letter,
  index,
  baseDelay,
  y,
}: {
  letter: string;
  index: number;
  baseDelay: number;
  y: number;
}) {
  const letterDelay = baseDelay + index * 0.08;

  return (
    <motion.text
      x={`${index * 1.05}em`}  // adjust based on monospace-ish sizing
      y={y}
      fontSize="inherit"
      fontWeight="bold"
      fontFamily="inherit"
      textAnchor="start"
      // Stroke animation
      stroke="#ff4d00"
      strokeWidth={1.5}
      fill="transparent"
      strokeDasharray={300}
      initial={{
        strokeDashoffset: 300,
        fill: "transparent",
        strokeOpacity: 1,
      }}
      animate={{
        strokeDashoffset: 0,
        fill: "#ff4d00",
        strokeOpacity: 0,
      }}
      transition={{
        strokeDashoffset: {
          duration: 1.2,
          delay: letterDelay,
          ease: [0.4, 0, 0.2, 1],
        },
        fill: {
          duration: 0.6,
          delay: letterDelay + 1.0,
          ease: "easeOut",
        },
        strokeOpacity: {
          duration: 0.4,
          delay: letterDelay + 1.4,
          ease: "easeOut",
        },
      }}
    >
      {letter}
    </motion.text>
  );
}

function AnimatedLine({
  text,
  lineIndex,
  baseDelay,
  yPosition,
}: {
  text: string;
  lineIndex: number;
  baseDelay: number;
  yPosition: number;
}) {
  const letters = text.split("");
  const lineDelay = baseDelay + lineIndex * letters.length * 0.08;

  return (
    <g>
      {letters.map((letter, i) => (
        <AnimatedLetter
          key={`${lineIndex}-${i}`}
          letter={letter}
          index={i}
          baseDelay={lineDelay}
          y={yPosition}
        />
      ))}
    </g>
  );
}

export default function StrokeRevealTitle({ delay = 0 }: StrokeRevealTitleProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated gradient sweep behind text */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 1 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 77, 0, 0.03) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["-100% 0%", "200% 0%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
        />
      </motion.div>

      {/* SVG title */}
      <svg
        viewBox="0 0 700 220"
        className="w-full max-w-[80vw] h-auto"
        style={{ fontSize: "120px", fontFamily: "system-ui, sans-serif", overflow: "visible" }}
      >
        {lines.map((line, lineIndex) => (
          <AnimatedLine
            key={lineIndex}
            text={line}
            lineIndex={lineIndex}
            baseDelay={delay}
            yPosition={100 + lineIndex * 110}
          />
        ))}
      </svg>

      {/* Glow pulse overlay (post-reveal) */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay + 2.5,
          ease: "easeInOut",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 77, 0, 0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}
```

Note : le viewBox, les positions x/y et fontSize devront probablement être affinés visuellement. Le code ci-dessus est la structure ; les valeurs exactes seront ajustées lors de l'implémentation en vérifiant visuellement dans le navigateur.

**Step 2: Vérifier le build**

Run: `npm run build`
Expected: Build successful

**Step 3: Commit**

```bash
git add src/components/ui/StrokeRevealTitle.tsx
git commit -m "feat: ajout StrokeRevealTitle — fallback SVG animé stroke+fill"
```

---

### Task 5: Intégrer le fallback dans Hero

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Step 1: Remplacer le fallback existant par StrokeRevealTitle**

Dans `Hero.tsx` :
1. Importer `StrokeRevealTitle` via dynamic import (pas SSR)
2. Remplacer le bloc fallback actuel (lignes ~253-266, le `{enable3D && showFallback && ...}`) ET le bloc non-3D (lignes ~310-320, le `{!enable3D && ...}`) par le nouveau composant
3. Le composant s'affiche quand : `!enable3D` OU `(enable3D && showFallback)`

```typescript
// Ajouter en haut :
const StrokeRevealTitle = dynamic(
  () => import("@/components/ui/StrokeRevealTitle"),
  { ssr: false }
);

// Remplacer les 2 blocs fallback par un seul :
{(!enable3D || showFallback) && (
  <div className="absolute top-0 left-0 right-0 h-[65dvh] z-1 flex items-center justify-center pointer-events-none">
    <StrokeRevealTitle delay={0.3} />
  </div>
)}
```

**Step 2: Vérifier le build**

Run: `npm run build`
Expected: Build successful

**Step 3: Vérification visuelle**

Ouvrir le site dans le navigateur et vérifier :
1. Sur machine normale → ParticleText s'affiche, pas de fallback
2. Simuler le fallback en modifiant temporairement `enable3D` à `false` dans usePerformance → StrokeRevealTitle apparaît avec l'animation stroke+fill

**Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: intégration du fallback SVG stroke+fill dans Hero"
```

---

### Task 6: Build final et vérification

**Files:** Aucun fichier à modifier

**Step 1: Build complet**

Run: `npm run build`
Expected: Build successful, 0 erreurs

**Step 2: Lint**

Run: `npm run lint`
Expected: Pas de nouvelles erreurs

**Step 3: Commit final si ajustements**

Si des ajustements ont été nécessaires pendant les vérifications, les committer ici.
