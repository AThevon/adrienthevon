"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import DualText from "@/components/ui/DualText";

const socials = [
  { name: "GITHUB", url: "#" },
  { name: "TWITTER", url: "#" },
  { name: "LINKEDIN", url: "#" },
  { name: "DRIBBBLE", url: "#" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("contact");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-cursor-mode="contact"
      className="min-h-screen flex flex-col justify-center py-32 px-8 md:px-16 relative overflow-hidden"
    >
      {/* Background accent */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(255, 77, 0, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Section header */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-sm text-muted">{t("sectionNumber")}</span>
          <span className="w-16 h-px bg-foreground/20" />
          <span className="font-mono text-sm text-muted">{t("title")}</span>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto w-full"
        style={{ y, opacity }}
      >
        {/* Main CTA */}
        <div className="mb-24">
          <TextReveal className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8">
            {t("headline")}
          </TextReveal>

          <motion.p
            className="text-xl text-muted max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t("intro")}
          </motion.p>
        </div>

        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <MagneticButton strength={0.2}>
            <a
              href="mailto:hello@adrienthevon.com"
              className="group inline-flex items-center gap-6 text-4xl md:text-6xl font-bold tracking-tighter hover:text-accent transition-colors duration-300"
              data-cursor="hover"
            >
              <span>{t("cta")}</span>
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="group-hover:rotate-45 transition-transform duration-300"
              >
                <path
                  d="M12 36L36 12M36 12H16M36 12V32"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </motion.svg>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Footer */}
        <div className="grid grid-cols-12 gap-8 pt-16 border-t border-foreground/10">
          {/* Socials */}
          <div className="col-span-12 md:col-span-6">
            <h4 className="font-mono text-sm text-muted mb-6">{t("connect")}</h4>
            <div className="flex flex-wrap gap-6">
              {socials.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="font-mono text-sm hover:text-accent transition-colors"
                  data-cursor="hover"
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="col-span-12 md:col-span-3">
            <h4 className="font-mono text-sm text-muted mb-6">{t("location")}</h4>
            <p className="text-sm">{t("locationValue")}</p>
            <p className="text-sm text-muted">{t("availability")}</p>
          </div>

          {/* Copyright */}
          <div className="col-span-12 md:col-span-3 md:text-right">
            <p className="font-mono text-sm text-muted">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="font-mono text-sm text-muted">{t("rights")}</p>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-8 left-8 w-32 h-32 border border-foreground/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </section>
  );
}
