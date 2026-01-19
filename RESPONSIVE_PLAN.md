# Responsive Design Implementation Plan

## Overview
Transform the portfolio from desktop-focused to fully responsive, with optimized mobile experiences across all pages. The site has excellent performance infrastructure (usePerformance/useDeviceDetect hooks) that is currently underutilized. This plan leverages existing patterns and creates mobile-optimized alternatives for heavy 3D/canvas components.

---

## Strategy: Hybrid Approach

**Component Architecture:**
- Heavy 3D/Canvas components → Separate mobile alternatives (simplified versions)
- Layout components → Adaptive styling with conditional rendering
- Interactive elements → Touch-aware variants in same component file

**Why this approach:**
- Existing performance hooks (usePerformance, useDeviceDetect) are well-designed but only used in 3/20+ components
- Mobile devices can't handle O(n²) physics calculations and 200+ particle animations
- Better UX to show simplified but polished alternatives than janky/broken desktop versions
- Tailwind breakpoints already used extensively (90% coverage) - build on this foundation

---

## Implementation Phases

### PHASE 1: Critical Path (Week 1 - 24 hours)

#### 1.1 Homepage Navigation Dock (8h) - BLOCKER
**Problem:** Navigation dock has 6 horizontal `aspect-video` cards (lines 416-680 in Hero.tsx) that break on mobile - cards become too small or force awkward single-column grid.

**Solution:** Create mobile drawer menu
- New component: `src/components/ui/NavigationDock.mobile.tsx`
- Hamburger button (fixed position, 44px tap target)
- Slide-out drawer with vertical menu items (text-2xl, min-h-16 each)
- Conditional render in Hero.tsx based on `useDeviceDetect().isMobile`

**Files:**
- NEW: `src/components/ui/NavigationDock.mobile.tsx`
- MODIFY: `src/components/sections/Hero.tsx` (add mobile detection, conditional render)

#### 1.2 Work Page Interactions (6h) - HIGH IMPACT
**Problem:**
- HoverReveal.tsx: Hover-only interaction doesn't work on touch devices
- HorizontalGallery.tsx: Parallax scroll physics feel janky on mobile

**Solution:**
- HoverReveal: Add long-press detection (500ms threshold) for touch devices
  - Use `onTouchStart` with setTimeout, `onTouchEnd` to clear
  - Fixed preview size (320x220px) → responsive: `w-[80vw] max-w-[320px] h-auto aspect-[320/220]`
- HorizontalGallery: Detect mobile, use CSS `scroll-snap-type: x mandatory` instead of physics
  - Reduce parallax intensity: 2x desktop → 1x mobile

**Files:**
- MODIFY: `src/components/ui/HoverReveal.tsx`
- MODIFY: `src/components/sections/HorizontalGallery.tsx`

#### 1.3 Cursor Disabling (1h) - QUICK WIN
**Problem:** GlitchCursor and LiquidCursor run on mobile despite touch devices not needing custom cursors.

**Solution:** Add early return check at component top:
```typescript
const { isMobile } = useDeviceDetect();
if (isMobile) return null;
```

**Files:**
- MODIFY: `src/components/effects/GlitchCursor.tsx`
- MODIFY: `src/components/effects/LiquidCursor.tsx`

#### 1.4 Performance Hook Integration (4h) - FOUNDATION
**Problem:** Only 3 components use usePerformance hook; remaining heavy components ignore performance flags.

**Solution:** Integrate hook into all particle/canvas components:
- SectionEffects: Check `enableParticles` and respect `particleMultiplier`
- AsciiEffect (About): Scale resolution based on device (30x30 → 15x15 mobile)
- Add DPR capping globally: `Math.min(window.devicePixelRatio, 2)`

**Files:**
- MODIFY: `src/components/effects/SectionEffects.tsx`
- MODIFY: `src/components/experiments/AsciiEffect.tsx`

#### 1.5 Global Layout Adjustments (5h) - POLISH
**Problem:** Typography too large on mobile, padding inconsistent.

**Solution:** Add mobile-first scaling:
- Hero titles: `text-4xl md:text-6xl lg:text-[10vw]`
- Section headings: `text-2xl md:text-4xl lg:text-6xl`
- Body text: `text-sm md:text-base lg:text-lg`
- Padding: Already good pattern (`px-8 md:px-16`), ensure consistent

**Files:**
- MODIFY: `src/components/sections/Hero.tsx`
- MODIFY: `src/app/about/page.tsx`
- MODIFY: `src/app/skills/page.tsx`
- MODIFY: `src/app/philosophy/page.tsx`

---

### PHASE 2: Heavy Pages (Week 2 - 28 hours)

#### 2.1 Skills Page - Static Network (10h) - BLOCKER
**Problem:** NeuralNetwork2D uses force-directed graph with O(n²) calculations - will crash on mobile.

**Solution:** Create `StaticNetwork.tsx` - SVG-based network with pre-calculated positions
- Show 20 nodes (vs 50+ desktop) in fixed grid layout
- CSS pulse animations instead of physics
- Connections drawn as static SVG paths
- Conditional render: `{enable3D && !isMobile ? <NeuralNetwork2D /> : <StaticNetwork />}`

**Files:**
- NEW: `src/components/effects/mobile/StaticNetwork.tsx`
- MODIFY: `src/app/skills/page.tsx`

#### 2.2 Journey Page - Simple Timeline (12h) - BLOCKER
**Problem:** ConstellationTimeline has continuous physics with 200+ particles.

**Solution:** Create `SimpleTimeline.tsx` - Vertical CSS timeline with scroll-triggered animations
- Replace constellation with gradient background
- Use Intersection Observer for progressive reveal
- Timeline dots + connecting line (vertical)
- Framer Motion for enter animations

**Files:**
- NEW: `src/components/effects/mobile/SimpleTimeline.tsx`
- MODIFY: `src/app/journey/page.tsx`

#### 2.3 Philosophy Page - Static Canvas (6h) - HIGH VALUE
**Problem:** PhilosophyCanvas runs 4 concurrent effects with 50+ particles.

**Solution:** Create `PhilosophyStatic.tsx` - CSS gradients with subtle animations
- Static gradient background: `bg-gradient-to-br from-purple-900/20 via-blue-900/20`
- Animated overlay with opacity/scale (`motion.div` with Framer Motion)
- CSS `mix-blend-mode` for color interactions
- No canvas, pure CSS

**Files:**
- NEW: `src/components/effects/mobile/PhilosophyStatic.tsx`
- MODIFY: `src/app/philosophy/page.tsx`

---

### PHASE 3: Polish (Week 3 - 8 hours)

#### 3.1 About Page - Stack Layout (4h)
**Problem:** Split screen (lg:w-1/2) breaks on mobile; ASCII portrait takes 50vh.

**Solution:**
- Change layout: `flex flex-col md:flex-row`
- ASCII portrait: `h-[30vh] md:h-screen` (reduce mobile height)
- Scale ASCII resolution: 30x30 → 15x15 on mobile (already hooked in 1.4)
- Stack order: Portrait → Content (natural flow)

**Files:**
- MODIFY: `src/components/sections/About.tsx`

#### 3.2 Contact Page - Minor Tweaks (2h)
**Problem:** Social card aspect ratios suboptimal on narrow screens.

**Solution:**
- Card heights: `h-48 md:h-56 lg:h-64` (more progression)
- Email CTA: Ensure button text wraps gracefully on small screens
- Headline sizing already good: `text-6xl md:text-8xl lg:text-[12rem]`

**Files:**
- MODIFY: `src/app/contact/page.tsx`

#### 3.3 Testing & Bug Fixes (2h)
- Test on real devices (iPhone SE 375px, iPhone 14 Pro 393px, iPad Mini 768px)
- Verify touch interactions work (long-press on HoverReveal, drawer menu)
- Check performance (smooth 60fps scrolling, no jank)
- Test both FR and EN translations

---

## Critical Files Summary

### Phase 1 (Week 1):
1. `src/components/sections/Hero.tsx` - Navigation restructure (8h)
2. `src/components/ui/NavigationDock.mobile.tsx` - NEW mobile menu (included in #1)
3. `src/hooks/usePerformance.ts` - Already exists, no changes needed
4. `src/components/ui/HoverReveal.tsx` - Touch support (3h)
5. `src/components/sections/HorizontalGallery.tsx` - Mobile scroll (3h)
6. `src/components/effects/GlitchCursor.tsx` - Mobile disable (0.5h)
7. `src/components/effects/LiquidCursor.tsx` - Mobile disable (0.5h)
8. `src/components/effects/SectionEffects.tsx` - Performance integration (2h)
9. `src/components/experiments/AsciiEffect.tsx` - Resolution scaling (2h)

### Phase 2 (Week 2):
10. `src/components/effects/mobile/StaticNetwork.tsx` - NEW (10h)
11. `src/app/skills/page.tsx` - Integration (included in #10)
12. `src/components/effects/mobile/SimpleTimeline.tsx` - NEW (12h)
13. `src/app/journey/page.tsx` - Integration (included in #12)
14. `src/components/effects/mobile/PhilosophyStatic.tsx` - NEW (6h)
15. `src/app/philosophy/page.tsx` - Integration (included in #14)

### Phase 3 (Week 3):
16. `src/components/sections/About.tsx` - Stack layout (4h)
17. `src/app/contact/page.tsx` - Card tweaks (2h)

**Total:** 17 files (6 new, 11 modified) | 60 hours across 3 weeks

---

## Breakpoint Strategy

**Current Tailwind breakpoints (keep as-is):**
- `sm: 640px` - Large phones landscape, small tablets
- `md: 768px` - Tablets portrait, entry point for desktop layouts
- `lg: 1024px` - Desktop, enable full effects
- `xl: 1280px` - Large desktop (rarely used)

**Device Tiers:**
- **Mobile (< 768px):** Simplified components, no 3D/particles, native scroll
- **Tablet (768-1024px):** Desktop layouts, reduced effects (50% particles)
- **Desktop (≥ 1024px):** Full effects, all animations

---

## Performance Targets

| Device | FPS Target | 3D Effects | Particles | Canvas Quality |
|--------|-----------|-----------|-----------|----------------|
| Mobile | 30fps | Disabled | 0 | N/A (no canvas) |
| Tablet | 30fps | Enabled | 50% (via multiplier) | Medium |
| Desktop | 60fps | Enabled | 100% | High |

---

## Touch Interaction Patterns

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Hero Dock | Hover animations | Drawer menu (slide-out) |
| HoverReveal | Hover to reveal | Long-press 500ms |
| MagneticButton | Magnetic follow | Standard button |
| GlitchCursor | Custom cursor | Disabled (native cursor) |
| LiquidCursor | Metaball effect | Disabled |

---

## Verification Checklist

**Functional Testing:**
- [ ] Hero navigation dock: Desktop shows horizontal cards, mobile shows drawer menu
- [ ] Work page: HoverReveal responds to long-press on touch devices
- [ ] Skills page: Shows StaticNetwork on mobile, NeuralNetwork2D on desktop
- [ ] Journey page: Shows SimpleTimeline on mobile, ConstellationTimeline on desktop
- [ ] Philosophy page: Shows PhilosophyStatic on mobile, PhilosophyCanvas on desktop
- [ ] About page: Stacks vertically on mobile, side-by-side on desktop
- [ ] Cursors: GlitchCursor/LiquidCursor disabled on mobile

**Performance Testing:**
- [ ] Mobile: No canvas elements rendering (check DevTools)
- [ ] Mobile: Smooth 30fps+ scrolling (no jank)
- [ ] Tablet: Particle counts reduced (check SectionEffects particle count)
- [ ] Desktop: All effects enabled at full quality

**Device Testing:**
- [ ] iPhone SE (375px width) - smallest modern phone
- [ ] iPhone 14 Pro (393px width) - standard modern phone
- [ ] iPad Mini (768px width) - tablet breakpoint
- [ ] iPad Pro (1024px width) - desktop breakpoint
- [ ] Test both portrait and landscape orientations
- [ ] Test with reduced motion enabled (macOS/iOS accessibility)

**Translation Testing:**
- [ ] Test all pages in FR (primary language)
- [ ] Test all pages in EN (secondary language)
- [ ] Verify navigation labels translate correctly in mobile drawer

---

## Risk Mitigation

**Risk 1: Mobile performance still poor after Phase 1**
- Mitigation: Use Chrome DevTools mobile throttling (4x CPU slowdown) during development
- Fallback: Add loading states, skeleton screens for heavy pages

**Risk 2: Touch interactions feel awkward**
- Mitigation: Test on real devices early (don't rely on DevTools device emulation)
- Fallback: Simplify to tap-to-navigate, remove long-press requirement

**Risk 3: Design loses impact on mobile**
- Mitigation: Focus on one polished effect per page (gradient + typography can be premium)
- Fallback: Static gradients with good typography still look professional

**Risk 4: Timeline extends beyond 3 weeks**
- Mitigation: Phase 1 makes site fully usable on mobile; Phases 2-3 are enhancements
- Fallback: Ship after Phase 1, iterate with Phases 2-3 post-launch
