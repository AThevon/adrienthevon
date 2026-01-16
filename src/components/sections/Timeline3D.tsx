"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

const timelineEvents = [
  {
    year: "2019",
    title: "THE BEGINNING",
    description: "Started coding journey. First HTML page.",
    color: "#ff4d00",
  },
  {
    year: "2020",
    title: "DEEP DIVE",
    description: "Mastered JavaScript. Built first React app.",
    color: "#00ff88",
  },
  {
    year: "2021",
    title: "CREATIVE SPARK",
    description: "Discovered Three.js. Mind = blown.",
    color: "#8844ff",
  },
  {
    year: "2022",
    title: "PROFESSIONAL",
    description: "First creative developer role. Shipped 20+ projects.",
    color: "#00ccff",
  },
  {
    year: "2023",
    title: "LEVELING UP",
    description: "WebGL, shaders, creative coding mastery.",
    color: "#ff0088",
  },
  {
    year: "2024",
    title: "NOW",
    description: "Building the future of web experiences.",
    color: "#ffcc00",
  },
];

interface TimelineNodeProps {
  event: typeof timelineEvents[0];
  position: [number, number, number];
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

function TimelineNode({
  event,
  position,
  index,
  activeIndex,
  setActiveIndex,
}: TimelineNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isActive = activeIndex === index;
  const isPast = index < activeIndex;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse when active
    if (isActive) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      );
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh
        ref={meshRef}
        onClick={() => setActiveIndex(index)}
        onPointerEnter={() => setActiveIndex(index)}
      >
        <sphereGeometry args={[isActive ? 0.3 : 0.2, 32, 32]} />
        <meshStandardMaterial
          color={event.color}
          emissive={event.color}
          emissiveIntensity={isActive ? 1 : isPast ? 0.3 : 0.1}
          transparent
          opacity={isPast ? 0.5 : 1}
        />
      </mesh>

      {/* Glow ring when active */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial
            color={event.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Year label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color={isActive ? event.color : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        {event.year}
      </Text>

      {/* Info popup when active */}
      {isActive && (
        <Html position={[0, 1, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/90 backdrop-blur-sm border border-foreground/20 p-4 min-w-[200px] text-center"
          >
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: event.color }}
            >
              {event.title}
            </h3>
            <p className="text-sm text-muted">{event.description}</p>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

function TimelinePath({ activeIndex }: { activeIndex: number }) {
  const points = useMemo(() => {
    return timelineEvents.map((_, i) => {
      const progress = i / (timelineEvents.length - 1);
      const x = (progress - 0.5) * 10;
      const y = Math.sin(progress * Math.PI) * 1;
      const z = 0;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  // Create curved path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const curvePoints = useMemo(() => {
    return curve.getPoints(100);
  }, [curve]);

  return (
    <>
      {/* Main path line */}
      <Line
        points={curvePoints}
        color="#333333"
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {/* Progress line */}
      <Line
        points={curvePoints.slice(0, Math.floor((activeIndex / (timelineEvents.length - 1)) * 100) + 1)}
        color="#ff4d00"
        lineWidth={3}
      />

      {/* Particles along the path */}
      <PathParticles curve={curve} activeIndex={activeIndex} />
    </>
  );
}

function PathParticles({
  curve,
}: {
  curve: THREE.CatmullRomCurve3;
  activeIndex: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const point = curve.getPoint(t);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [curve]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const t = ((i / count) + state.clock.elapsedTime * 0.05) % 1;
      const point = curve.getPoint(t);

      // Add some randomness
      positions[i * 3] = point.x + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.1;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ff4d00"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const { camera } = useThree();

  // Camera follows active node
  useFrame(() => {
    const targetX = ((activeIndex / (timelineEvents.length - 1)) - 0.5) * 10;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
  });

  const nodePositions = useMemo(() => {
    return timelineEvents.map((_, i) => {
      const progress = i / (timelineEvents.length - 1);
      const x = (progress - 0.5) * 10;
      const y = Math.sin(progress * Math.PI) * 1;
      const z = 0;
      return [x, y, z] as [number, number, number];
    });
  }, []);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4d00" />

      {/* Timeline path */}
      <TimelinePath activeIndex={activeIndex} />

      {/* Timeline nodes */}
      {timelineEvents.map((event, index) => (
        <TimelineNode
          key={event.year}
          event={event}
          position={nodePositions[index]}
          index={index}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </>
  );
}

export default function Timeline3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(timelineEvents.length - 1, prev + 1));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Section header */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-muted">004</span>
          <span className="w-16 h-[1px] bg-foreground/20" />
          <span className="font-mono text-sm text-muted">JOURNEY</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
          MY <span className="text-accent">PATH</span>
        </h2>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-8">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="font-mono text-sm disabled:opacity-30 hover:text-accent transition-colors"
          data-cursor="hover"
        >
          ← PREV
        </button>

        <div className="flex gap-2">
          {timelineEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-accent" : "bg-foreground/30"
              }`}
              data-cursor="hover"
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex === timelineEvents.length - 1}
          className="font-mono text-sm disabled:opacity-30 hover:text-accent transition-colors"
          data-cursor="hover"
        >
          NEXT →
        </button>
      </div>

      {/* Year indicator */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold tracking-tighter pointer-events-none z-0"
        style={{ color: timelineEvents[activeIndex].color }}
      >
        {timelineEvents[activeIndex].year}
      </motion.div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        onCreated={() => setIsLoaded(true)}
        style={{ background: "transparent" }}
      >
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </Canvas>

      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <span className="font-mono text-sm text-muted animate-pulse">
            LOADING TIMELINE...
          </span>
        </div>
      )}
    </section>
  );
}
