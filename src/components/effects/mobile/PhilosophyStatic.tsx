"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { principles } from "@/data/philosophy";

export default function PhilosophyStatic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("philosophy");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative w-full bg-background" style={{ height: "600vh" }}>
      {/* Static animated background - CSS only */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background" />

        {/* Animated gradient orbs */}
        {principles.map((principle, index) => (
          <motion.div
            key={principle.key}
            className="absolute w-[80vw] h-[80vw] rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${principle.color}40 0%, transparent 70%)`,
              left: `${principle.position.x * 100 - 40}%`,
              top: `${principle.position.y * 100 - 40}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          />
        ))}

        {/* Overlay texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Section 1: MAGIC IN MOTION */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl text-center relative"
            style={{
              y: useTransform(scrollYProgress, [0, 0.25], [0, -100]),
              opacity: useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]),
            }}
          >
            {/* Decorative gradient blob */}
            <motion.div
              className="absolute -inset-32 rounded-full blur-3xl -z-10"
              style={{
                background: `radial-gradient(circle, ${principles[0].color}20 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

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
              className="mt-12 flex gap-4 justify-center items-center font-mono text-sm text-muted flex-wrap"
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

      {/* Section 2: FULL STACK SOUL */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl relative"
            style={{
              y: useTransform(scrollYProgress, [0.25, 0.5], [100, -100]),
              opacity: useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0]),
            }}
          >
            {/* Decorative gradient blob */}
            <motion.div
              className="absolute -inset-32 rounded-full blur-3xl -z-10"
              style={{
                background: `radial-gradient(circle, ${principles[1].color}20 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

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
                  className="border border-foreground/10 p-4 text-center font-mono text-sm relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {/* Hover gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${principles[1].color}20 0%, transparent 70%)`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{tech}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: OBSESSED, NOT OBLIGATED */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl text-center relative"
            style={{
              y: useTransform(scrollYProgress, [0.5, 0.75], [100, -100]),
              opacity: useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0]),
            }}
          >
            {/* Decorative gradient blob with pulse */}
            <motion.div
              className="absolute -inset-32 rounded-full blur-3xl -z-10"
              style={{
                background: `radial-gradient(circle, ${principles[2].color}30 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

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
                  className="text-9xl md:text-[12rem] opacity-10"
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

      {/* Section 4: HUMAN > PROTOCOL */}
      <section className="relative h-[150dvh] flex items-center justify-center">
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-8 md:px-16">
          <motion.div
            className="max-w-5xl relative"
            style={{
              y: useTransform(scrollYProgress, [0.75, 1], [100, 0]),
              opacity: useTransform(scrollYProgress, [0.75, 0.8], [0, 1]),
            }}
          >
            {/* Decorative gradient blob */}
            <motion.div
              className="absolute -inset-32 rounded-full blur-3xl -z-10"
              style={{
                background: `radial-gradient(circle, ${principles[3].color}20 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

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
                  className="border border-foreground/10 p-6 relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(90deg, ${principles[3].color}10 0%, transparent 70%)`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
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
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
