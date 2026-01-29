"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { principles } from "@/data/philosophy";

export default function PhilosophyStatic() {
  const t = useTranslations("philosophy");

  return (
    <div className="relative w-full bg-background min-h-dvh">
      {/* Simple background - no expensive animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background" />

        {/* Static gradient orbs - no animation */}
        {principles.slice(0, 2).map((principle) => (
          <div
            key={principle.key}
            className="absolute w-[50vw] h-[50vw] rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${principle.color}40 0%, transparent 70%)`,
              left: `${principle.position.x * 100 - 25}%`,
              top: `${principle.position.y * 100 - 25}%`,
              filter: "blur(30px)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative px-6 py-20 space-y-24">
        {/* Header */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em]">
            [ 004 ]
          </span>
          <h1 className="text-3xl font-bold mt-4">{t("title")}</h1>
        </motion.div>

        {/* Section 1: MAGIC IN MOTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="font-mono text-xs text-accent mb-4 tracking-[0.2em]">
            [ 01 ]
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: principles[0].color }}
          >
            {t("magic.title")}
          </h2>
          <p className="text-base text-muted leading-relaxed">
            {t("magic.description")}
          </p>
          <div className="mt-6 flex gap-3 font-mono text-xs text-muted flex-wrap">
            <span className="border border-foreground/10 px-3 py-1">INTERACTIVE</span>
            <span className="border border-foreground/10 px-3 py-1">FLUID</span>
            <span className="border border-foreground/10 px-3 py-1">ORGANIC</span>
          </div>
        </motion.section>

        {/* Section 2: FULL STACK SOUL */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="font-mono text-xs text-accent mb-4 tracking-[0.2em]">
            [ 02 ]
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: principles[1].color }}
          >
            {t("fullstack.title")}
          </h2>
          <p className="text-base text-muted leading-relaxed mb-6">
            {t("fullstack.description")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["BACKEND", "FRONTEND", "DEVOPS", "AUTOMATION"].map((tech) => (
              <div
                key={tech}
                className="border border-foreground/10 p-3 text-center font-mono text-xs"
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: OBSESSED, NOT OBLIGATED */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <div className="font-mono text-xs text-accent mb-4 tracking-[0.2em]">
            [ 03 ]
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: principles[2].color }}
          >
            {t("obsessed.title")}
          </h2>
          <p className="text-base text-muted leading-relaxed">
            {t("obsessed.description")}
          </p>
          {/* Stylized icon instead of emoji */}
          <div className="mt-8 flex justify-center">
            <div
              className="w-16 h-16 border-2 rotate-45"
              style={{ borderColor: principles[2].color }}
            >
              <div
                className="w-full h-full border-2 scale-75"
                style={{ borderColor: `${principles[2].color}60` }}
              />
            </div>
          </div>
        </motion.section>

        {/* Section 4: HUMAN > PROTOCOL */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative pb-12"
        >
          <div className="font-mono text-xs text-accent mb-4 tracking-[0.2em]">
            [ 04 ]
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: principles[3].color }}
          >
            {t("human.title")}
          </h2>
          <p className="text-base text-muted leading-relaxed mb-6">
            {t("human.description")}
          </p>
          <div className="space-y-4">
            {[
              { label: "COMMUNICATION", value: 100 },
              { label: "EMPATHY", value: 100 },
              { label: "COLLABORATION", value: 100 },
            ].map((item) => (
              <div key={item.label} className="border border-foreground/10 p-4">
                <div className="flex justify-between items-center mb-2 font-mono text-xs">
                  <span>{item.label}</span>
                  <span style={{ color: principles[3].color }}>{item.value}%</span>
                </div>
                <div className="h-1 bg-foreground/10">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: principles[3].color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
