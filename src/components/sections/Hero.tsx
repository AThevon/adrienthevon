"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePerformance } from "@/hooks";
import { COLORS } from "@/lib/constants";
import DualText from "@/components/ui/DualText";

const ParticleText = dynamic(
  () => import("@/components/experiments/ParticleText"),
  { ssr: false }
);

// Navigation items configuration
const navigationItems = [
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
  const [particleKey, setParticleKey] = useState(0);
  const { enable3D } = usePerformance();
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");

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

  // CTAs and cards appear together when scrolling
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

  return (
    <section
      ref={containerRef}
      data-cursor-mode="hero"
      className="relative min-h-[120vh] flex flex-col items-center justify-start pt-[30vh]"
    >
      {/* Sticky hero content */}
      <motion.div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity }}
      >
        {/* Particle Text Background - Upper portion only */}
        {enable3D && isReady && (
          <div key={particleKey} className="absolute top-0 left-0 right-0 h-[65vh] z-0 pointer-events-none">
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
        <div className="relative z-10 w-full flex flex-col items-center justify-end h-full pb-16 overflow-hidden">
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

          {/* CTA Buttons - Scroll-driven: starts below view, slides up */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
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
              href="/contact"
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

          {/* Navigation Dock - appears from below CTAs like macOS dock */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="mt-8 w-screen px-4 flex items-end justify-center gap-2"
          >
            {navigationItems.map((item, index) => {
              // Unique 3D artifact for each page
              const renderArtifact = (isHovered: boolean) => {
                switch(item.key) {
                  case 'work':
                    // Rotating hexagonal grid
                    return (
                      <motion.div className="relative w-16 h-16">
                        {[0, 1, 2].map((ring) => (
                          <motion.div
                            key={ring}
                            className="absolute inset-0"
                            style={{
                              border: `1px solid ${item.color}`,
                              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                              scale: 1 - ring * 0.25
                            }}
                            animate={isHovered ? {
                              rotate: [0, 360],
                              opacity: [0.2, 0.6, 0.2]
                            } : {}}
                            transition={{
                              rotate: { duration: 8 + ring * 2, repeat: Infinity, ease: "linear" },
                              opacity: { duration: 2, repeat: Infinity, delay: ring * 0.3 }
                            }}
                          />
                        ))}
                      </motion.div>
                    );

                  case 'skills':
                    // Matrix cube
                    return (
                      <motion.div className="relative w-16 h-16" style={{ perspective: '200px' }}>
                        <motion.div
                          className="w-full h-full border"
                          style={{
                            borderColor: item.color,
                            transformStyle: 'preserve-3d'
                          }}
                          animate={isHovered ? {
                            rotateX: [0, 360],
                            rotateY: [0, 360]
                          } : {}}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {/* Cube faces */}
                          {[0, 90, 180, 270].map((deg, i) => (
                            <div
                              key={i}
                              className="absolute inset-0"
                              style={{
                                border: `1px solid ${item.color}40`,
                                transform: `rotateY(${deg}deg) translateZ(32px)`
                              }}
                            />
                          ))}
                        </motion.div>
                      </motion.div>
                    );

                  case 'journey':
                    // Orbital rings
                    return (
                      <motion.div className="relative w-16 h-16">
                        {[0, 45, 90].map((angle, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-2 rounded-full"
                            style={{
                              border: `1px solid ${item.color}`,
                              rotate: `${angle}deg`
                            }}
                            animate={isHovered ? {
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.8, 0.3]
                            } : {}}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.4
                            }}
                          />
                        ))}
                        <motion.div
                          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color, x: '-50%', y: '-50%' }}
                          animate={isHovered ? {
                            scale: [1, 1.5, 1],
                            boxShadow: [`0 0 10px ${item.color}`, `0 0 20px ${item.color}`, `0 0 10px ${item.color}`]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        />
                      </motion.div>
                    );

                  case 'philosophy':
                    // Fractal triangle
                    return (
                      <motion.div className="relative w-16 h-16">
                        {[0, 1, 2, 3].map((level) => (
                          <motion.div
                            key={level}
                            className="absolute inset-0"
                            style={{
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              border: `1px solid ${item.color}`,
                              scale: 1 - level * 0.2
                            }}
                            animate={isHovered ? {
                              rotate: [0, -360],
                              opacity: [0.2, 0.7, 0.2]
                            } : {}}
                            transition={{
                              rotate: { duration: 12 - level * 2, repeat: Infinity, ease: "linear" },
                              opacity: { duration: 3, repeat: Infinity, delay: level * 0.2 }
                            }}
                          />
                        ))}
                      </motion.div>
                    );

                  case 'about':
                    // DNA helix
                    return (
                      <motion.div className="relative w-16 h-16">
                        {[0, 1].map((strand) => (
                          <motion.div
                            key={strand}
                            className="absolute w-full h-full"
                            animate={isHovered ? {
                              rotate: [0, 360]
                            } : {}}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "linear",
                              delay: strand * 3
                            }}
                          >
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                              <motion.div
                                key={angle}
                                className="absolute w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: item.color,
                                  left: '50%',
                                  top: '50%',
                                  transform: `rotate(${angle}deg) translateX(24px)`
                                }}
                                animate={isHovered ? {
                                  scale: [0.5, 1, 0.5],
                                  opacity: [0.3, 1, 0.3]
                                } : {}}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: angle / 360
                                }}
                              />
                            ))}
                          </motion.div>
                        ))}
                      </motion.div>
                    );

                  case 'contact':
                    // Ripple waves
                    return (
                      <motion.div className="relative w-16 h-16">
                        {[0, 1, 2, 3].map((wave) => (
                          <motion.div
                            key={wave}
                            className="absolute inset-0 rounded-full"
                            style={{
                              border: `1px solid ${item.color}`
                            }}
                            animate={isHovered ? {
                              scale: [0, 2],
                              opacity: [0.8, 0]
                            } : {}}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: wave * 0.75,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    );

                  default:
                    return null;
                }
              };

              const [isHovered, setIsHovered] = useState(false);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group relative flex-1"
                  data-cursor="hover"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    className="relative origin-bottom"
                    whileHover={{ scale: 1.2, y: -16 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                  >
                    {/* Card container - landscape ratio */}
                    <div className="relative w-full aspect-video overflow-visible">
                      {/* Glow on hover */}
                      <motion.div
                        className="absolute -inset-8 rounded-3xl opacity-0 group-hover:opacity-40 blur-3xl"
                        style={{ backgroundColor: item.color }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Content */}
                      <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                        {/* 3D Artifact - only animates on hover */}
                        <motion.div
                          className="opacity-60 group-hover:opacity-100"
                        >
                          {renderArtifact(isHovered)}
                        </motion.div>

                        {/* Label */}
                        <motion.span
                          className="font-mono text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100"
                          style={{
                            color: item.color,
                            textShadow: `0 0 10px ${item.color}60`
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {tNav(item.key).toUpperCase()}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
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
      <div className="h-[20vh]" />
    </section>
  );
}
