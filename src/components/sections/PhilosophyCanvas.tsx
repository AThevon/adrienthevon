"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { principles, type EffectType } from "@/data/philosophy";
import { motion, useScroll, useTransform } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

export default function PhilosophyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations("philosophy");
  const [activeEffect, setActiveEffect] = useState<EffectType | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animation state
  const particlesRef = useRef<Particle[]>([]);
  const nodesRef = useRef<NetworkNode[]>([]);
  const matrixDropsRef = useRef<MatrixDrop[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Determine which effect to show based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) {
        setActiveEffect("liquid");
      } else if (latest < 0.5) {
        setActiveEffect("matrix");
      } else if (latest < 0.75) {
        setActiveEffect("pulse");
      } else {
        setActiveEffect("network");
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize effects
    initializeNetworkNodes();
    initializeMatrixDrops();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeEffect) {
        const principle = principles.find((p) => p.effect === activeEffect);
        if (principle) {
          drawZoneEffect(ctx, principle.key, principle.effect, principle.color);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeEffect]);

  const initializeNetworkNodes = () => {
    nodesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
  };

  const initializeMatrixDrops = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/\\|";
    matrixDropsRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -500,
      speed: Math.random() * 3 + 2,
      chars: Array.from({ length: 15 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
    }));
  };

  const drawZoneEffect = (
    ctx: CanvasRenderingContext2D,
    key: string,
    effect: EffectType,
    color: string
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouse = mouseRef.current;

    switch (effect) {
      case "liquid":
        drawLiquidEffect(ctx, mouse.x, mouse.y, color);
        break;
      case "matrix":
        drawMatrixEffect(ctx, rect.width, rect.height, color);
        break;
      case "pulse":
        drawPulseEffect(ctx, mouse.x, mouse.y, color);
        break;
      case "network":
        drawNetworkEffect(ctx, rect.width, rect.height, color);
        break;
    }
  };

  const drawLiquidEffect = (
    ctx: CanvasRenderingContext2D,
    mx: number,
    my: number,
    color: string
  ) => {
    const mouse = mouseRef.current;

    // Spawn particles around mouse
    if (Math.random() < 0.6) {
      particlesRef.current.push({
        x: mouse.x + (Math.random() - 0.5) * 150,
        y: mouse.y + (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 40 + 20,
        color,
        life: 1,
      });
    }

    // Update and draw particles with gradient
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.life -= 0.006;

      if (p.life <= 0) return false;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}00`);

      ctx.globalAlpha = p.life * 0.7;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    ctx.globalAlpha = 1;
  };

  const drawMatrixEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string
  ) => {
    ctx.font = "14px monospace";
    ctx.fillStyle = color;

    matrixDropsRef.current.forEach((drop) => {
      drop.y += drop.speed;

      drop.chars.forEach((char, i) => {
        const y = drop.y - i * 20;
        if (y > 0 && y < height) {
          ctx.globalAlpha = 1 - (i / drop.chars.length);
          ctx.fillText(char, drop.x, y);
        }
      });

      if (drop.y > height + 100) {
        drop.y = -100;
        drop.x = Math.random() * width;
      }
    });

    ctx.globalAlpha = 1;
  };

  const drawPulseEffect = (
    ctx: CanvasRenderingContext2D,
    mx: number,
    my: number,
    color: string
  ) => {
    const mouse = mouseRef.current;
    const time = Date.now() * 0.002;
    const pulseCount = 12;

    for (let i = 0; i < pulseCount; i++) {
      const offset = (i / pulseCount) * Math.PI * 2;
      const baseRadius = 50 + i * 35;
      const radius = baseRadius + Math.sin(time + offset) * 25;

      ctx.globalAlpha = 0.6 - (i / pulseCount) * 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.15 - (i / pulseCount) * 0.12;
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Central heartbeat glow
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 40);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}00`);

    ctx.globalAlpha = 0.9 + Math.sin(time * 3) * 0.1;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  const drawNetworkEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string
  ) => {
    const nodes = nodesRef.current;

    // Update node positions
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });

    // Draw connections
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((otherNode) => {
        const dx = otherNode.x - node.x;
        const dy = otherNode.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.globalAlpha = 1 - distance / 150;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.stroke();
        }
      });

      // Draw node
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  };

  return (
    <div ref={containerRef} className="relative w-full bg-background" style={{ height: "600vh" }}>
      {/* Fixed Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-dvh pointer-events-none"
      />

      {/* Section 1: MAGIC IN MOTION - Liquid */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl text-center"
            style={{
              y: useTransform(scrollYProgress, [0, 0.25], [0, -100]),
              opacity: useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]),
            }}
          >
            <motion.div
              className="font-mono text-xs md:text-sm text-accent mb-8 tracking-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              [ 01 ]
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8"
              style={{ color: principles[0].color }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("magic.title")}
            </motion.h2>

            <motion.p
              className="text-base md:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("magic.description")}
            </motion.p>

            <motion.div
              className="mt-12 flex gap-4 justify-center items-center font-mono text-sm text-muted"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span>INTERACTIVE</span>
              <span className="w-px h-4 bg-muted" />
              <span>FLUID</span>
              <span className="w-px h-4 bg-muted" />
              <span>ORGANIC</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: FULL STACK SOUL - Matrix */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl"
            style={{
              y: useTransform(scrollYProgress, [0.25, 0.5], [100, -100]),
              opacity: useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0]),
            }}
          >
            <motion.div
              className="font-mono text-xs md:text-sm text-accent mb-8 tracking-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              [ 02 ]
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8"
              style={{ color: principles[1].color }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("fullstack.title")}
            </motion.h2>

            <motion.p
              className="text-base md:text-xl lg:text-2xl text-muted max-w-3xl leading-relaxed mb-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("fullstack.description")}
            </motion.p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {["BACKEND", "FRONTEND", "DEVOPS", "AUTOMATION"].map((tech, i) => (
                <motion.div
                  key={tech}
                  className="border border-foreground/10 p-4 text-center font-mono text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ borderColor: principles[1].color, scale: 1.05 }}
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: OBSESSED, NOT OBLIGATED - Pulse */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl text-center"
            style={{
              y: useTransform(scrollYProgress, [0.5, 0.75], [100, -100]),
              opacity: useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0]),
            }}
          >
            <motion.div
              className="font-mono text-xs md:text-sm text-accent mb-8 tracking-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              [ 03 ]
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8"
              style={{ color: principles[2].color }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("obsessed.title")}
            </motion.h2>

            <motion.p
              className="text-base md:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("obsessed.description")}
            </motion.p>

            <motion.div
              className="mt-12 inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative">
                <motion.div
                  className="text-9xl md:text-[12rem] font-bold opacity-10"
                  style={{ color: principles[2].color }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ❤️
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: HUMAN > PROTOCOL - Network */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl"
            style={{
              y: useTransform(scrollYProgress, [0.75, 1], [100, 0]),
              opacity: useTransform(scrollYProgress, [0.75, 0.8], [0, 1]),
            }}
          >
            <motion.div
              className="font-mono text-xs md:text-sm text-accent mb-8 tracking-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              [ 04 ]
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8"
              style={{ color: principles[3].color }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("human.title")}
            </motion.h2>

            <motion.p
              className="text-base md:text-xl lg:text-2xl text-muted max-w-3xl leading-relaxed mb-12"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("human.description")}
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { label: "COMMUNICATION", value: "100%" },
                { label: "EMPATHY", value: "100%" },
                { label: "COLLABORATION", value: "100%" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="border border-foreground/10 p-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2 font-mono text-sm">
                    <span>{item.label}</span>
                    <span style={{ color: principles[3].color }}>{item.value}</span>
                  </div>
                  <motion.div
                    className="h-1 bg-foreground/10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                    style={{ originX: 0 }}
                  >
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: principles[3].color, originX: 0 }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 1 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
