"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import TextReveal from "@/components/ui/TextReveal";

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

const LiquidCursor = dynamic(
  () => import("@/components/effects/LiquidCursor"),
  { ssr: false }
);

const AsciiEffect = dynamic(
  () => import("@/components/experiments/AsciiEffect"),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

const ParticleText = dynamic(
  () => import("@/components/experiments/ParticleText"),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

const WaveField = dynamic(
  () => import("@/components/experiments/WaveField"),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

const NoiseTerrain = dynamic(
  () => import("@/components/experiments/NoiseTerrain"),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

function LoadingPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="font-mono text-sm text-muted animate-pulse">LOADING...</span>
    </div>
  );
}

const experiments = [
  {
    id: "ascii",
    title: "ASCII PORTRAIT",
    description: "Real-time ASCII art generation with interactive cursor distortion",
    color: "#00ff88",
  },
  {
    id: "particles",
    title: "PARTICLE TEXT",
    description: "Thousands of particles forming text, dispersing on hover",
    color: "#ff4d00",
  },
  {
    id: "waves",
    title: "WAVE FIELD",
    description: "Interactive sine wave visualization responding to mouse movement",
    color: "#8844ff",
  },
  {
    id: "noise",
    title: "NOISE TERRAIN",
    description: "Procedural terrain generation using simplex noise",
    color: "#00ccff",
  },
];

export default function LabPage() {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderExperiment = (id: string) => {
    switch (id) {
      case "ascii":
        return <AsciiEffect text="CREATIVE\nCODER" fontSize={8} interactive />;
      case "particles":
        return (
          <ParticleText
            text="HOVER"
            fontSize={150}
            particleSize={2}
            particleGap={3}
            mouseRadius={120}
          />
        );
      case "waves":
        return <WaveField color="#8844ff" waveCount={25} amplitude={60} />;
      case "noise":
        return <NoiseTerrain color="#00ccff" gridSize={30} scale={0.04} />;
      default:
        return null;
    }
  };

  return (
    <>
      <CustomCursor />
      <LiquidCursor intensity={0.3} />

      <main className="min-h-screen">
        {/* Header */}
        <section className="pt-32 pb-16 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.a
              href="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-foreground transition-colors mb-12"
              data-cursor="hover"
            >
              ← BACK
            </motion.a>

            <TextReveal className="text-6xl md:text-8xl font-bold tracking-tighter">
              LAB
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl text-muted max-w-2xl"
            >
              A playground for creative experiments, shader explorations, and
              interactive experiences. Move your cursor to interact.
            </motion.p>
          </div>
        </section>

        {/* Experiments Grid */}
        <section className="px-8 md:px-16 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiments.map((experiment, index) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative group"
                >
                  <div
                    className="aspect-[4/3] relative overflow-hidden border border-foreground/10 cursor-pointer"
                    onClick={() => {
                      setActiveExperiment(experiment.id);
                      setIsFullscreen(true);
                    }}
                    data-cursor="hover"
                  >
                    {/* Preview */}
                    <div className="absolute inset-0 bg-background">
                      {renderExperiment(experiment.id)}
                    </div>

                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${experiment.color}40 0%, ${experiment.color}10 100%)`,
                      }}
                    >
                      <span className="font-mono text-sm bg-background/80 px-4 py-2">
                        CLICK TO EXPAND
                      </span>
                    </motion.div>

                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-12 h-12"
                      style={{
                        background: `linear-gradient(135deg, ${experiment.color} 50%, transparent 50%)`,
                      }}
                    />

                    {/* Number */}
                    <div className="absolute bottom-4 left-4 font-mono text-xs text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4">
                    <h3
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: experiment.color }}
                    >
                      {experiment.title}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {experiment.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fullscreen modal */}
        <AnimatePresence>
          {isFullscreen && activeExperiment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background"
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsFullscreen(false)}
                className="absolute top-8 right-8 z-10 font-mono text-sm hover:text-accent transition-colors"
                data-cursor="hover"
              >
                CLOSE ×
              </motion.button>

              {/* Experiment title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-8 left-8 z-10"
              >
                <span
                  className="font-mono text-sm"
                  style={{
                    color: experiments.find((e) => e.id === activeExperiment)?.color,
                  }}
                >
                  {experiments.find((e) => e.id === activeExperiment)?.title}
                </span>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-8 left-8 z-10 font-mono text-xs text-muted"
              >
                MOVE CURSOR TO INTERACT
              </motion.div>

              {/* Experiment content */}
              <div className="w-full h-full">
                {renderExperiment(activeExperiment)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
