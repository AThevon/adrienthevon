"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePerformance } from "@/hooks";
import { COLORS } from "@/lib/constants";
import DualText from "@/components/ui/DualText";

const ParticleText = dynamic(
  () => import("@/components/experiments/ParticleText"),
  { ssr: false }
);

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
            className="bg-gradient-to-r from-accent/40 via-accent/20 to-transparent"
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
  const { enable3D } = usePerformance();
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

  // Scale starts immediately but opacity stays at 100% longer
  // Scale: 0 -> 0.5 (immediate)
  // Opacity: stays 100% until 0.35, then fades 0.35 -> 0.6
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.35, 0.6], [1, 0]);

  // CTAs fade even later
  const ctaOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);

  // CTAs slide up into view as we scroll (starts hidden below, appears as we scroll)
  const ctaY = useTransform(scrollYProgress, [0, 0.15], [60, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      data-cursor-mode="hero"
      className="relative min-h-[150vh] flex flex-col items-center justify-start pt-[30vh]"
    >
      {/* Sticky hero content */}
      <motion.div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        {/* Particle Text Background - Upper portion only */}
        {enable3D && isReady && (
          <div className="absolute top-0 left-0 right-0 h-[65vh] z-0 pointer-events-none">
            <ParticleText
              text={"ADRIEN\nTHEVON"}
              fontSize={160}
              particleSize={2.5}
              particleGap={4}
              color={COLORS.accent}
              mouseRadius={150}
            />
          </div>
        )}

        {/* Floating shapes layer */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {floatingShapes.map((shape, i) => (
            <FloatingShape
              key={i}
              {...shape}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Grid overlay for depth */}
        <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]">
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
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-32 overflow-hidden">
          {/* Top label - positioned at top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4"
          >
            <span className="w-12 h-px bg-accent" />
            <span className="font-mono text-xs text-muted tracking-[0.3em]">
              <DualText visible={t("portfolio")} hidden={t("portfolioHidden")} />
            </span>
            <span className="w-12 h-px bg-accent" />
          </motion.div>

          {/* Fallback title for non-3D */}
          {!enable3D && (
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.33, 1, 0.68, 1] }}
              className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-[0.85] text-center mb-8"
            >
              <span className="block">ADRIEN</span>
              <span className="block text-accent">THEVON</span>
            </motion.h1>
          )}

          {/* Rolling roles with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="relative mt-8"
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

          {/* CTA Buttons - Scroll-driven: starts below view, slides up, then fades out */}
          <motion.div
            style={{ y: ctaY, opacity: ctaOpacity }}
            className="mt-16 flex flex-col sm:flex-row gap-6 sm:gap-8"
          >
            {/* Primary button - Glitch Effect */}
            <a
              href="/work"
              className="group relative"
              data-cursor="hover"
            >
              {/* Glitch layers */}
              <span className="absolute inset-0 bg-accent translate-x-1 translate-y-1 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
              <span className="absolute inset-0 border-2 border-accent -translate-x-1 -translate-y-1 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2" />

              {/* Main button */}
              <span className="relative z-10 flex items-center gap-4 px-10 py-5 bg-background border-2 border-foreground font-mono text-sm tracking-[0.2em] transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                <span className="relative">
                  {t("cta.work")}
                  {/* Underline animation */}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <motion.path
                    d="M4 10H16M16 10L11 5M16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                  />
                </motion.svg>
              </span>
            </a>

            {/* Secondary button - Magnetic Reveal */}
            <a
              href="#contact"
              className="group relative overflow-hidden"
              data-cursor="hover"
            >
              {/* Background fill animation */}
              <motion.span
                className="absolute inset-0 bg-accent origin-left"
                initial={{ scaleX: 1 }}
                whileHover={{ scaleX: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="absolute inset-0 bg-foreground origin-right"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-4 px-10 py-5 font-mono text-sm tracking-[0.2em] text-background transition-colors duration-300">
                {/* Animated dots */}
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </span>
                <span>{t("cta.contact")}</span>
              </span>

              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-background/50 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-background" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-background/50 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-background" />
            </a>
          </motion.div>

          {/* Interaction hint */}
          {enable3D && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-12 flex items-center gap-3"
            >
              <motion.div
                className="w-6 h-6 border border-accent/50 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1.5 h-1.5 bg-accent rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
              <span className="font-mono text-xs text-muted/60">
                <DualText visible={t("hint")} hidden={t("hintHidden")} />
              </span>
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
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
            <span className="font-mono text-xs text-muted/50 [writing-mode:vertical-lr] rotate-180">
              {t("scroll")}
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          </div>
        </motion.div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <motion.div
            className="w-5 h-8 border border-foreground/30 rounded-full flex justify-center pt-2"
          >
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/30 z-20" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30 z-20" />
      </motion.div>

      {/* Spacer for scroll effect */}
      <div className="h-[50vh]" />
    </section>
  );
}
