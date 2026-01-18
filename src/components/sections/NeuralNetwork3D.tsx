"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getSkillsUsedInProjects, getSkillById, skillCategories, type Skill } from "@/data/skills";
import { getProjectById } from "@/data/projects";

// Electric signal traveling through connections
function ElectricSignal({
  start,
  end,
  color,
  speed = 1,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Move along the path
    const newProgress = (progress + delta * speed) % 1;
    setProgress(newProgress);

    // Interpolate position
    const position = new THREE.Vector3().lerpVectors(start, end, newProgress);
    meshRef.current.position.copy(position);

    // Pulse effect
    const scale = 0.08 + Math.sin(newProgress * Math.PI) * 0.04;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
      <pointLight color={color} intensity={2} distance={2} />
    </mesh>
  );
}

// Connection line between two nodes
function Connection({
  start,
  end,
  color,
  active = false,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  active?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return [start, end];
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as THREE.LineBasicMaterial;

    if (active) {
      // Pulse when active
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    } else {
      material.opacity = 0.15;
    }
  });

  return (
    <>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          linewidth={1}
        />
      </line>
      {active && (
        <ElectricSignal
          start={start}
          end={end}
          color={color}
          speed={0.5 + Math.random() * 0.5}
        />
      )}
    </>
  );
}

// Skill icon/logo mapping
const skillLogos: Record<string, string> = {
  react: "⚛️",
  nextjs: "▲",
  vue: "V",
  nuxt: "N",
  typescript: "TS",
  tailwind: "TW",
  html: "H",
  css: "C",
  threejs: "3D",
  r3f: "R3F",
  drei: "D",
  webgl: "GL",
  glsl: "SH",
  canvas: "CV",
  motion: "M",
  gsap: "GS",
  nodejs: "N",
  express: "E",
  postgresql: "PG",
  prisma: "PR",
  firebase: "FB",
  git: "G",
  github: "GH",
  vercel: "V",
  vite: "VT",
  webpack: "WP",
  figma: "F",
  photoshop: "PS",
  illustrator: "AI",
};

// Skill node - OPTIMIZED VERSION with logo
function SkillNode({
  skill,
  position,
  onClick,
  isSelected,
  isConnected,
}: {
  skill: Skill;
  position: THREE.Vector3;
  onClick: () => void;
  isSelected: boolean;
  isConnected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const color = skillCategories[skill.category].color;
  const baseSize = 0.6;
  const isActive = isSelected || isConnected || hovered;
  const logo = skillLogos[skill.id] || skill.name.charAt(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle floating
    groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime + position.x) * 0.1;

    // Slow rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;

    // Scale on hover/select
    const targetScale = isActive ? baseSize * 1.2 : baseSize;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.15
    );
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Background circle */}
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.9 : 0.6}
        />
      </mesh>

      {/* Glow ring when active */}
      {isActive && (
        <mesh>
          <ringGeometry args={[1, 1.2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Logo text */}
      <Suspense fallback={null}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/geist-mono.woff"
        >
          {logo}
        </Text>

        {/* Skill name on hover/select */}
        {isActive && (
          <>
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="black"
              font="/fonts/geist-mono.woff"
            >
              {skill.name}
            </Text>
            {/* Project count */}
            {skill.projectIds && skill.projectIds.length > 0 && (
              <Text
                position={[0, -1.5, 0]}
                fontSize={0.18}
                color="#ffaa00"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="black"
              >
                {skill.projectIds.length} project{skill.projectIds.length > 1 ? 's' : ''}
              </Text>
            )}
          </>
        )}
      </Suspense>

      {/* Subtle point light */}
      {isActive && (
        <pointLight
          color={color}
          intensity={1}
          distance={3}
        />
      )}
    </group>
  );
}

// Main 3D scene
function NetworkScene({
  onSkillSelect,
  selectedSkillId,
}: {
  onSkillSelect: (skillId: string | null) => void;
  selectedSkillId: string | null;
}) {
  const { camera } = useThree();

  // Get only skills that are used in projects
  const skillsWithProjects = useMemo(() => getSkillsUsedInProjects(), []);

  // Position skills in 3D space using spherical layout
  const skillPositions = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    const radius = 8;

    skillsWithProjects.forEach((skill, index) => {
      // Use golden angle for even distribution
      const phi = Math.acos(1 - 2 * (index + 0.5) / skillsWithProjects.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.set(skill.id, new THREE.Vector3(x, y, z));
    });

    return positions;
  }, [skillsWithProjects]);

  // Get all connections to render
  const connections = useMemo(() => {
    const conns: Array<{
      start: THREE.Vector3;
      end: THREE.Vector3;
      color: string;
      skillId: string;
      targetId: string;
    }> = [];

    skillsWithProjects.forEach((skill) => {
      const startPos = skillPositions.get(skill.id);
      if (!startPos) return;

      skill.connections.forEach((targetId) => {
        const endPos = skillPositions.get(targetId);
        if (!endPos) return;

        conns.push({
          start: startPos.clone(),
          end: endPos.clone(),
          color: skillCategories[skill.category].color,
          skillId: skill.id,
          targetId,
        });
      });
    });

    return conns;
  }, [skillPositions, skillsWithProjects]);

  const selectedSkillData = selectedSkillId ? getSkillById(selectedSkillId) : null;
  const connectedSkillIds = selectedSkillData?.connections || [];

  useEffect(() => {
    camera.position.set(0, 0, 20);
  }, [camera]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Connections */}
      {connections.map((conn, i) => {
        const isActive =
          selectedSkillId &&
          (conn.skillId === selectedSkillId || conn.targetId === selectedSkillId);

        return (
          <Connection
            key={`${conn.skillId}-${conn.targetId}-${i}`}
            start={conn.start}
            end={conn.end}
            color={conn.color}
            active={!!isActive}
          />
        );
      })}

      {/* Skill nodes */}
      {skillsWithProjects.map((skill) => {
        const position = skillPositions.get(skill.id);
        if (!position) return null;

        return (
          <SkillNode
            key={skill.id}
            skill={skill}
            position={position}
            onClick={() =>
              onSkillSelect(selectedSkillId === skill.id ? null : skill.id)
            }
            isSelected={selectedSkillId === skill.id}
            isConnected={
              selectedSkillId !== null &&
              selectedSkillId !== skill.id &&
              connectedSkillIds.includes(skill.id)
            }
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={10}
        maxDistance={30}
        autoRotate={!selectedSkillId}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function NeuralNetwork3D() {
  const t = useTranslations("skills");
  const router = useRouter();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Get skills with projects to find the selected one
  const skillsWithProjects = useMemo(() => getSkillsUsedInProjects(), []);
  const selectedSkill = selectedSkillId
    ? skillsWithProjects.find((s) => s.id === selectedSkillId)
    : null;
  const relatedProjects = selectedSkill?.projectIds
    ?.map((id) => getProjectById(id))
    .filter(Boolean) || [];

  return (
    <section className="fixed inset-0 w-full h-screen overflow-hidden">
      {/* 3D Canvas - Full screen */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <NetworkScene
              onSkillSelect={setSelectedSkillId}
              selectedSkillId={selectedSkillId}
            />
          </Suspense>
        </Canvas>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.3) 60%, rgba(10, 10, 10, 0.8) 100%)",
          }}
        />
      </div>

      {/* Header - Minimal overlay */}
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-muted/60">{t("sectionNumber")}</span>
          <span className="w-8 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-muted/60">{t("title")}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
          {t("subtitle").split(" ")[0]}{" "}
          <span className="text-accent/80">{t("subtitle").split(" ").slice(1).join(" ")}</span>
        </h2>
      </div>

      {/* Instructions - Bottom right */}
      <div className="absolute bottom-8 right-8 pointer-events-none z-10">
        <p className="font-mono text-xs text-muted/50 text-right">
          Click • Drag • Zoom
        </p>
      </div>

      {/* Projects panel - Overlay on top */}
      <AnimatePresence>
        {selectedSkill && relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute right-8 top-8 w-80 bg-background/95 backdrop-blur-md border border-foreground/10 p-6 pointer-events-auto z-20"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedSkillId(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              data-cursor="hover"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div
                className="w-8 h-8 rounded-full mb-3"
                style={{ backgroundColor: skillCategories[selectedSkill.category].color }}
              />
              <h3 className="text-2xl font-bold mb-2">{selectedSkill.name}</h3>
              <p className="text-xs font-mono text-muted">
                {relatedProjects.length} PROJECT{relatedProjects.length > 1 ? "S" : ""}
              </p>
            </div>

            {/* Projects list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {relatedProjects.map((project) => (
                <motion.button
                  key={project.id}
                  onClick={() => router.push(`/work/${project.id}`)}
                  className="w-full text-left p-3 border border-foreground/10 hover:border-foreground/30 transition-colors group"
                  whileHover={{ x: 4 }}
                  data-cursor="hover"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-mono text-sm font-bold mb-1 group-hover:text-accent transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <path
                        d="M4 12L12 4M12 4H6M12 4V10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend - Minimal bottom left */}
      <div className="absolute bottom-8 left-8 pointer-events-none z-10">
        <div className="flex flex-wrap gap-3 opacity-60 hover:opacity-100 transition-opacity">
          {Object.entries(skillCategories).map(([key, { name, color }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-xs text-muted/70">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
