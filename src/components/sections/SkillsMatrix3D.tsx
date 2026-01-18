"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { COLORS } from "@/lib/constants";

const skills = [
  { name: "REACT", level: 95, color: "#61dafb", category: "frontend" },
  { name: "NEXT.JS", level: 90, color: "#ffffff", category: "frontend" },
  { name: "TYPESCRIPT", level: 90, color: "#3178c6", category: "frontend" },
  { name: "THREE.JS", level: 85, color: COLORS.accent, category: "creative" },
  { name: "WEBGL", level: 80, color: "#990000", category: "creative" },
  { name: "GSAP", level: 90, color: "#88ce02", category: "animation" },
  { name: "MOTION", level: 85, color: "#ff0055", category: "animation" },
  { name: "TAILWIND", level: 95, color: "#38bdf8", category: "frontend" },
  { name: "NODE.JS", level: 80, color: "#68a063", category: "backend" },
  { name: "FIGMA", level: 75, color: "#a259ff", category: "design" },
  { name: "GLSL", level: 70, color: "#5586a4", category: "creative" },
  { name: "CANVAS", level: 85, color: "#ff9900", category: "creative" },
];

interface SkillNodeProps {
  skill: typeof skills[0];
  position: [number, number, number];
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

function SkillNode({
  skill,
  position,
  index,
  hoveredIndex,
  setHoveredIndex,
}: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredIndex === index;
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Gentle floating animation
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;

    // Subtle rotation
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Skill box */}
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHoveredIndex(index)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <boxGeometry args={[1.5, 0.6, 0.1]} />
          <meshStandardMaterial
            color={isHovered ? skill.color : "#1a1a1a"}
            emissive={skill.color}
            emissiveIntensity={isHovered ? 0.5 : 0.1}
            transparent
            opacity={isOtherHovered ? 0.3 : 1}
          />
        </mesh>

        {/* Skill name */}
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.15}
          color={isHovered ? "#0a0a0a" : skill.color}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjOVGa.woff2"
        >
          {skill.name}
        </Text>

        {/* Level indicator */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[1.5 * (skill.level / 100), 0.05, 0.05]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={isHovered ? 1 : 0.3}
          />
        </mesh>

        {/* Connection lines to related skills */}
        {isHovered && (
          <ConnectionLines
            currentCategory={skill.category}
            currentIndex={index}
          />
        )}
      </group>
    </Float>
  );
}

function ConnectionLines({
  currentCategory,
  currentIndex,
}: {
  currentCategory: string;
  currentIndex: number;
}) {
  const linePoints = useMemo(() => {
    const relatedIndices = skills
      .map((s, i) => (s.category === currentCategory && i !== currentIndex ? i : -1))
      .filter((i) => i !== -1);

    return relatedIndices.map((i) => {
      const angle = (i / skills.length) * Math.PI * 2;
      const radius = 3;

      return [
        [0, 0, 0],
        [Math.cos(angle) * radius, (i % 3 - 1) * 1.5, Math.sin(angle) * radius],
      ] as [[number, number, number], [number, number, number]];
    });
  }, [currentCategory, currentIndex]);

  return (
    <>
      {linePoints.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={COLORS.accent}
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
}

function MatrixRain() {
  const rainRef = useRef<THREE.Points>(null);
  const count = 500;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (!rainRef.current) return;

    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= 0.05;

      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#00ff88"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    // Rotate based on mouse position
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.1,
      0.05
    );
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.accent} />

      {/* Matrix rain background */}
      <MatrixRain />

      {/* Skills nodes */}
      <group ref={groupRef}>
        {skills.map((skill, index) => {
          const angle = (index / skills.length) * Math.PI * 2;
          const radius = 3;
          const y = (index % 3 - 1) * 1.5;

          return (
            <SkillNode
              key={skill.name}
              skill={skill}
              position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          );
        })}
      </group>
    </>
  );
}

export default function SkillsMatrix3D() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Section header */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-muted">003</span>
          <span className="w-16 h-[1px] bg-foreground/20" />
          <span className="font-mono text-sm text-muted">SKILLS</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
          TECH <span className="text-accent">STACK</span>
        </h2>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8 z-10 font-mono text-xs text-muted"
      >
        <p>MOVE MOUSE TO ROTATE</p>
        <p>HOVER TO EXPLORE</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 right-8 z-10 font-mono text-xs text-right"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#61dafb]" />
          <span className="text-muted">FRONTEND</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <span className="text-muted">CREATIVE</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#88ce02]" />
          <span className="text-muted">ANIMATION</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#a259ff]" />
          <span className="text-muted">DESIGN</span>
        </div>
      </motion.div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        onCreated={() => setIsLoaded(true)}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <span className="font-mono text-sm text-muted animate-pulse">
            LOADING MATRIX...
          </span>
        </div>
      )}
    </section>
  );
}
