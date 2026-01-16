"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";
import RollingText from "@/components/ui/RollingText";

const roles = ["CREATIVE CODER", "UI ENGINEER", "PIXEL PUSHER", "GRID BREAKER"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[200vh] flex flex-col items-center justify-start pt-[30vh]"
    >
      {/* Sticky hero content */}
      <motion.div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-8"
        style={{ opacity, scale }}
      >
        {/* Small intro text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-mono text-sm text-muted mb-8 tracking-widest"
        >
          PORTFOLIO — 2025
        </motion.p>

        {/* Main name / title */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.33, 1, 0.68, 1] }}
            className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-[0.85] text-center"
          >
            <span className="block">YOUR</span>
            <span className="block text-accent">NAME</span>
          </motion.h1>

          {/* Decorative elements */}
          <motion.div
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Rolling roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex items-center gap-4 font-mono text-sm"
        >
          <span className="text-muted">CURRENTLY:</span>
          <div className="h-6 overflow-hidden">
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
                <div key={i} className="h-6 flex items-center">
                  {role}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16 flex gap-6"
        >
          <MagneticButton>
            <a
              href="#work"
              className="px-8 py-4 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              <RollingText>VIEW WORK</RollingText>
            </a>
          </MagneticButton>

          <MagneticButton>
            <a
              href="#contact"
              className="px-8 py-4 bg-accent text-background hover:bg-foreground transition-colors duration-300"
            >
              <RollingText>GET IN TOUCH</RollingText>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-muted">SCROLL</span>
          <motion.div
            className="w-[1px] h-16 bg-gradient-to-b from-foreground to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Background decorative grid - enhanced visibility */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Large rotating square with glow */}
          <motion.div
            className="absolute top-1/4 left-[10%] w-[300px] h-[300px]"
            style={{ y: springY }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full border border-accent/30 shadow-[0_0_30px_rgba(255,77,0,0.15)]" />
          </motion.div>

          {/* Pulsing square */}
          <motion.div
            className="absolute bottom-1/4 right-[15%] w-[200px] h-[200px] rotate-45"
            style={{ y: springY }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full border-2 border-foreground/20 bg-gradient-to-br from-accent/5 to-transparent" />
          </motion.div>

          {/* Small accent dot */}
          <motion.div
            className="absolute top-[60%] left-[25%] w-3 h-3 bg-accent rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Floating line */}
          <motion.div
            className="absolute top-[40%] right-[25%] w-[100px] h-[1px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
            animate={{ x: [0, 50, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corner brackets */}
          <motion.div
            className="absolute top-[20%] right-[10%] w-16 h-16 border-t-2 border-r-2 border-accent/40"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[30%] left-[5%] w-12 h-12 border-b-2 border-l-2 border-foreground/30"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>

      {/* Spacer for scroll effect */}
      <div className="h-[100vh]" />
    </section>
  );
}
