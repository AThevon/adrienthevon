"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance, useDeviceDetect } from "@/hooks";
import { COLORS } from "@/lib/constants";
import DualText from "@/components/ui/DualText";
import NavigationDockButton from "@/components/ui/NavigationDockButton";

const HeroMobile = dynamic(() => import("./HeroMobile"), { ssr: false });

const ParticleText = dynamic(
  () => import("@/components/experiments/ParticleText"),
  { ssr: false }
);

const StrokeRevealTitle = dynamic(
  () => import("@/components/ui/StrokeRevealTitle"),
  { ssr: false }
);

// Navigation items configuration
export const navigationItems = [
  {
    key: "work",
    href: "/work",
    color: "#ffaa00",
    icon: "W",
  },
  {
    key: "skills",
    href: "/skills",
    color: "#00ccff",
    icon: "S",
  },
  {
    key: "journey",
    href: "/journey",
    color: "#8844ff",
    icon: "J",
  },
  {
    key: "philosophy",
    href: "/philosophy",
    color: "#00ff88",
    icon: "P",
  },
  {
    key: "about",
    href: "/about",
    color: "#ff0088",
    icon: "A",
  },
  {
    key: "contact",
    href: "/contact",
    color: "#ffcc00",
    icon: "C",
  },
];

// Floating shapes configuration
const floatingShapes = [
  { type: "square", size: 300, x: "10%", y: "20%", rotation: 45, delay: 0 },
  { type: "square", size: 200, x: "85%", y: "60%", rotation: 12, delay: 0.5 },
  { type: "square", size: 150, x: "75%", y: "15%", rotation: -30, delay: 1 },
  { type: "circle", size: 100, x: "15%", y: "70%", rotation: 0, delay: 0.3 },
  { type: "line", size: 200, x: "60%", y: "80%", rotation: 45, delay: 0.7 },
  { type: "cross", size: 60, x: "90%", y: "30%", rotation: 0, delay: 0.2 },
  { type: "dots", size: 80, x: "5%", y: "45%", rotation: 0, delay: 0.4 },
];

function FloatingShape({
  type,
  size,
  x,
  y,
  rotation,
  delay,
  scrollProgress
}: {
  type: string;
  size: number;
  x: string;
  y: string;
  rotation: number;
  delay: number;
  scrollProgress: MotionValue<number>;
}) {
  const yOffset = useTransform(scrollProgress, [0, 1], [0, size * 0.5]);
  const springY = useSpring(yOffset, { stiffness: 50, damping: 20 });

  const shapeContent = () => {
    switch (type) {
      case "square":
        return (
          <motion.div
            className="border border-accent/20"
            style={{ width: size, height: size }}
            animate={{
              rotate: [rotation, rotation + 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 60 + delay * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        );
      case "circle":
        return (
          <motion.div
            className="rounded-full border border-foreground/10"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      case "line":
        return (
          <motion.div
            className="bg-linear-to-r from-accent/40 via-accent/20 to-transparent"
            style={{ width: size, height: 1, rotate: rotation }}
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      case "cross":
        return (
          <motion.div
            className="relative"
            style={{ width: size, height: size }}
            animate={{ rotate: [0, 90] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute top-1/2 left-0 w-full h-px bg-accent/30" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-accent/30" />
          </motion.div>
        );
      case "dots":
        return (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/20"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, y: springY }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 + delay, ease: "easeOut" }}
    >
      {shapeContent()}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const { enable3D } = usePerformance();
  const { isMobile, isHydrated } = useDeviceDetect();
  const t = useTranslations("hero");

  const roles = [
    t("roles.creative"),
    t("roles.pixel"),
    t("roles.code"),
    t("roles.craft"),
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Only fade out content, no scale down
  const opacity = useTransform(scrollYProgress, [0.35, 0.6], [1, 0]);

  // Navigation Dock appears when scrolling (slides up from bottom)
  const contentY = useTransform(scrollYProgress, [0, 0.15], [60, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      // Force particle effect remount
      setParticleKey((prev) => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show fallback after timeout if particles aren't ready
  useEffect(() => {
    if (particlesReady) {
      setShowFallback(false);
      return;
    }

    const fallbackTimer = setTimeout(() => {
      if (!particlesReady) {
        setShowFallback(true);
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [particlesReady]);

  // Use dedicated mobile component (only after hydration to avoid mismatch)
  if (isHydrated && isMobile) {
    return <HeroMobile />;
  }

  return (
    <section
      ref={containerRef}
      data-cursor-mode="hero"
      className="relative min-h-[120dvh] flex flex-col items-center justify-start pt-[30dvh]"
    >
      {/* Sticky hero content */}
      <motion.div
        className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity }}
      >
        {/* Particle Text Background - Upper portion only */}
        {enable3D && isReady && (
          <div key={particleKey} className="absolute top-0 left-0 right-0 h-[65dvh] z-0 pointer-events-none">
            <ParticleText
              text={"ADRIEN\nTHEVON"}
              fontSize={160}
              particleSize={2.5}
              particleGap={4}
              color={COLORS.accent}
              mouseRadius={150}
              onReady={() => setParticlesReady(true)}
            />
          </div>
        )}

        {/* Cinematic title fallback — shown when Canvas can't render or particles timeout */}
        {(!enable3D || showFallback) && (
          <div className="absolute top-0 left-0 right-0 h-[65dvh] z-1 flex items-center justify-center pointer-events-none">
            <StrokeRevealTitle delay={0.3} />
          </div>
        )}

        {/* Floating shapes layer */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          {floatingShapes.map((shape, i) => (
            <FloatingShape
              key={i}
              {...shape}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Grid overlay for depth */}
        <div className="absolute inset-0 z-2 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        {/* Main content - overflow-hidden clips CTAs when at y:30 (pre-animation) */}
        <div className="relative z-10 w-full flex flex-col items-center h-full pb-16 overflow-hidden">
          {/* Top label - positioned at top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap"
          >
            <span className="w-12 h-px bg-accent" />
            <span className="font-mono text-xs text-muted tracking-[0.3em]">
              <DualText visible={t("portfolio")} hidden={t("portfolioHidden")} />
            </span>
            <span className="w-12 h-px bg-accent" />
          </motion.div>

          {/* Spacer to push content to bottom but keep it visible */}
          <div className="flex-1" />

          {/* Rolling roles with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative mb-32"
          >
            <div className="flex items-center gap-6 font-mono text-sm">
              <motion.span
                className="text-accent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {"//"}
              </motion.span>
              <span className="text-muted">{t("currently")}</span>
              <div className="h-6 overflow-hidden min-w-[180px]">
                <motion.div
                  animate={{ y: [0, -24, -48, -72, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }}
                >
                  {roles.map((role, i) => (
                    <div key={i} className="h-6 flex items-center text-foreground">
                      {role}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Dock - desktop only, mobile uses drawer */}
          {!isMobile && (
            <motion.div
              style={{ y: contentY, opacity: contentOpacity }}
              className="mt-4 w-screen px-4 flex items-end justify-center gap-2"
            >
              {navigationItems.map((item) => (
                <NavigationDockButton key={item.key} item={item} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Side decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20"
        >
          {['01', '02', '03'].map((num, i) => (
            <motion.div
              key={num}
              className="font-mono text-xs text-muted/30"
              animate={{ opacity: i === 0 ? [0.3, 0.8, 0.3] : 0.3 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {num}
            </motion.div>
          ))}
        </motion.div>

        {/* Right side social/links hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block z-20"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-px h-16 bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
            <span className="font-mono text-xs text-muted/50 [writing-mode:vertical-lr] rotate-180">
              {t("scroll")}
            </span>
            <div className="w-px h-16 bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
          </div>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/30 z-20" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30 z-20" />
      </motion.div>

      {/* Spacer for scroll effect */}
      <div className="h-[20dvh]" />
    </section>
  );
}
