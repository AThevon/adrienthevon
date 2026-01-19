"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";

const socialLinks = [
  {
    name: "GITHUB",
    url: "https://github.com/AThevon",
    color: "#00ff88",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LINKEDIN",
    url: "https://linkedin.com/in/adrien-thevon-74b134100",
    color: "#00d4ff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <main className="relative min-h-screen px-8 md:px-16 py-24 md:py-32">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-16 md:space-y-20">
        {/* Section number */}
        <motion.div
          className="font-mono text-xs md:text-sm text-accent mb-8 tracking-[0.3em]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          [ {t("sectionNumber")} ]
        </motion.div>

        {/* Main title with split animation */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-[12rem] font-bold leading-none"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {t("headline").split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.05,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -10,
                  color: "#ff4d00",
                  transition: { duration: 0.2 },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-xl lg:text-2xl text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t("intro")}
        </motion.p>

        {/* Email - Hero element with glow */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-4 bg-accent/10 blur-3xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="mb-6 font-mono text-sm text-accent tracking-[0.3em]">
            [ {t("emailTitle")} ]
          </div>
          <ObfuscatedEmail user="athevon.pro" domain="gmail.com" />
        </motion.div>

        {/* Divider with accent */}
        <motion.div
          className="relative h-px bg-foreground/10 max-w-md mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent" />
        </motion.div>

        {/* Social links - Creative cards */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="font-mono text-sm text-accent tracking-[0.3em] mb-8 text-center">
            [ {t("connect")} ]
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-56 md:h-56 lg:h-64 border-2 border-foreground/20 overflow-hidden"
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 1 + i * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.03,
                  borderColor: link.color,
                  transition: { duration: 0.3 },
                }}
                data-cursor="hover"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${link.color}20 0%, ${link.color}05 100%)`,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Rotating border effect */}
                <motion.div
                  className="absolute -inset-px opacity-0 group-hover:opacity-100"
                  style={{
                    background: `conic-gradient(from 0deg, ${link.color}, transparent, ${link.color})`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-[2px] bg-background" />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                  {/* Logo SVG */}
                  <motion.div
                    style={{ color: link.color }}
                    className="opacity-80 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {link.icon}
                  </motion.div>

                  {/* Name */}
                  <h3
                    className="text-2xl md:text-3xl font-bold group-hover:translate-y-[-2px] transition-transform"
                    style={{
                      color: link.color,
                    }}
                  >
                    {link.name}
                  </h3>

                  {/* Number indicator */}
                  <div
                    className="font-mono text-xs opacity-50"
                    style={{ color: link.color }}
                  >
                    [0{i + 1}]
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 absolute bottom-4 right-4"
                    style={{ color: link.color }}
                    initial={{ x: -10, y: 10 }}
                    whileHover={{ x: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↗
                  </motion.div>

                  {/* Particles effect on hover */}
                  {[...Array(4)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        backgroundColor: link.color,
                        left: `${25 + idx * 18}%`,
                        top: "30%",
                      }}
                      animate={{
                        y: [-10, -30, -50],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: idx * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: link.color }} />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: link.color }} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="pt-12 border-t border-foreground/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 font-mono text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent" />
              <span>{t("locationValue")}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-muted/30" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent animate-pulse" />
              <span>{t("availability")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
