"use client";

import { useRef, useState, useMemo, Suspense, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { timelineEvents, type TimelineEvent } from "@/data/timeline";
import { COLORS } from "@/lib/constants";

// Error boundary for 3D canvas
class Canvas3DErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface TimelineNodeProps {
  event: TimelineEvent;
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
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const electricFieldRef = useRef<THREE.Points>(null);
  const isActive = activeIndex === index;
  const isPast = index < activeIndex;
  const isFuture = index > activeIndex;

  // Generate orbiting particles
  const particleData = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.5;
      const height = (Math.random() - 0.5) * 0.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      sizes[i] = 0.02 + Math.random() * 0.03;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, sizes, speeds, count };
  }, []);

  // Electric field particles (chaotic movement)
  const electricData = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.8 + Math.random() * 0.4;

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

      velocities.push(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
    }
    return { positions, velocities, count };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Core breathing effect (smooth, not filling)
    if (coreRef.current) {
      const baseScale = isActive ? 0.4 : isPast ? 0.2 : 0.12;
      // Smooth sine wave, no sudden changes
      const breath = Math.sin(time * 2) * (isActive ? 0.05 : 0.015);
      coreRef.current.scale.setScalar(baseScale + breath);
    }

    // Active state: crazy spinning rings at different speeds/angles
    if (isActive) {
      if (ring1Ref.current) {
        ring1Ref.current.rotation.x = time * 1.2;
        ring1Ref.current.rotation.y = time * 0.4;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.x = time * 0.6 + Math.PI / 4;
        ring2Ref.current.rotation.z = time * 1.5;
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.y = time * 2;
        ring3Ref.current.rotation.z = time * 0.8 + Math.PI / 3;
      }

      // Animate orbiting particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleData.count; i++) {
          const speed = particleData.speeds[i];
          const angle = time * speed + (i / particleData.count) * Math.PI * 2;
          const radius = 0.5 + Math.sin(time * 2 + i) * 0.15;
          const wobble = Math.sin(time * 3 + i * 0.5) * 0.1;

          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = wobble + Math.sin(angle * 2) * 0.15;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = time * 0.2;
      }

      // Electric field - chaotic particles
      if (electricFieldRef.current) {
        const positions = electricFieldRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < electricData.count; i++) {
          // Random jitter
          positions[i * 3] += (Math.random() - 0.5) * 0.02;
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;

          // Pull back towards sphere surface
          const x = positions[i * 3];
          const y = positions[i * 3 + 1];
          const z = positions[i * 3 + 2];
          const dist = Math.sqrt(x * x + y * y + z * z);
          const targetDist = 0.9 + Math.sin(time * 4 + i) * 0.2;

          if (dist > 0) {
            const factor = targetDist / dist;
            positions[i * 3] = x * factor * 0.95 + x * 0.05;
            positions[i * 3 + 1] = y * factor * 0.95 + y * 0.05;
            positions[i * 3 + 2] = z * factor * 0.95 + z * 0.05;
          }
        }
        electricFieldRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  // Colors based on state
  const coreColor = isFuture ? "#2a2a2a" : event.color;
  const emissiveColor = isFuture ? "#1a1a1a" : event.color;
  const emissiveIntensity = isActive ? 2 : isPast ? 0.6 : 0.1;

  return (
    <group ref={groupRef} position={position}>
      {/* Interaction hitbox */}
      <mesh
        onClick={() => setActiveIndex(index)}
        onPointerEnter={() => setActiveIndex(index)}
      >
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Core sphere - ALWAYS visible */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={isFuture ? 0.4 : 1}
          toneMapped={false}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Future nodes: subtle dashed ring hint */}
      {isFuture && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.008, 8, 32]} />
            <meshBasicMaterial color="#3a3a3a" transparent opacity={0.6} />
          </mesh>
          {/* Tiny glow to show it's interactive */}
          <mesh scale={1.5}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#333333" transparent opacity={0.2} />
          </mesh>
        </>
      )}

      {/* Past nodes: colored ring showing completion */}
      {isPast && !isActive && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.012, 16, 32]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.5} />
          </mesh>
          <mesh scale={1.3}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.1} />
          </mesh>
        </>
      )}

      {/* ACTIVE NODE: Full glory */}
      {isActive && (
        <>
          {/* Multi-layer glow */}
          <mesh scale={1.1}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.25} />
          </mesh>
          <mesh scale={1.6}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.1} />
          </mesh>
          <mesh scale={2.2}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.03} />
          </mesh>

          {/* Ring 1 - Fast horizontal spin */}
          <mesh ref={ring1Ref}>
            <torusGeometry args={[0.65, 0.018, 16, 80]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.9} />
          </mesh>

          {/* Ring 2 - Tilted, medium speed */}
          <mesh ref={ring2Ref}>
            <torusGeometry args={[0.8, 0.012, 16, 80]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.6} />
          </mesh>

          {/* Ring 3 - Opposite tilt, slow */}
          <mesh ref={ring3Ref}>
            <torusGeometry args={[0.95, 0.008, 16, 80]} />
            <meshBasicMaterial color={event.color} transparent opacity={0.4} />
          </mesh>

          {/* Orbiting particle swarm */}
          <points ref={particlesRef}>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[particleData.positions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={event.color}
              size={0.035}
              transparent
              opacity={0.9}
              sizeAttenuation
            />
          </points>

          {/* Electric field - chaotic energy */}
          <points ref={electricFieldRef}>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[electricData.positions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color="#ffffff"
              size={0.02}
              transparent
              opacity={0.7}
              sizeAttenuation
            />
          </points>

          {/* Energy wisps - arcs of light */}
          <Line
            points={[
              new THREE.Vector3(-0.6, 0.3, 0),
              new THREE.Vector3(-0.3, 0.5, 0.2),
              new THREE.Vector3(0, 0.4, 0.3),
              new THREE.Vector3(0.3, 0.6, 0.1),
              new THREE.Vector3(0.6, 0.3, 0),
            ]}
            color={event.color}
            lineWidth={1.5}
            transparent
            opacity={0.5}
          />
          <Line
            points={[
              new THREE.Vector3(0.5, -0.2, -0.3),
              new THREE.Vector3(0.2, -0.4, -0.1),
              new THREE.Vector3(-0.2, -0.5, 0.2),
              new THREE.Vector3(-0.5, -0.3, 0.4),
            ]}
            color={event.color}
            lineWidth={1.5}
            transparent
            opacity={0.4}
          />
        </>
      )}

      {/* Year label */}
      <Text
        position={[0, isActive ? -1 : -0.5, 0]}
        fontSize={isActive ? 0.28 : 0.16}
        color={isActive ? event.color : isFuture ? "#4a4a4a" : "#777777"}
        anchorX="center"
        anchorY="middle"
      >
        {event.year}
      </Text>
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

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const curvePoints = useMemo(() => {
    return curve.getPoints(100);
  }, [curve]);

  return (
    <>
      <Line points={curvePoints} color="#333333" lineWidth={2} transparent opacity={0.5} />
      <Line
        points={curvePoints.slice(
          0,
          Math.floor((activeIndex / (timelineEvents.length - 1)) * 100) + 1
        )}
        color={COLORS.accent}
        lineWidth={3}
      />
    </>
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

  useFrame(() => {
    const targetX = (activeIndex / (timelineEvents.length - 1) - 0.5) * 10;
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.accent} />

      <TimelinePath activeIndex={activeIndex} />

      {timelineEvents.map((event, index) => (
        <TimelineNode
          key={index}
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
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering Canvas
  useEffect(() => {
    setIsClient(true);

    // Check if WebGL is available
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    }
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(timelineEvents.length - 1, prev + 1));
  };

  // Show loading state while checking WebGL
  if (!isClient) {
    return (
      <section
        data-cursor-mode="timeline"
        className="relative h-screen w-full overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm text-muted animate-pulse">
            LOADING TIMELINE...
          </span>
        </div>
      </section>
    );
  }

  // Fallback UI if WebGL fails
  if (hasError) {
    return (
      <section
        data-cursor-mode="timeline"
        className="relative min-h-screen bg-background py-32 px-8 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-sm text-muted">004</span>
            <span className="w-16 h-[1px] bg-foreground/20" />
            <span className="font-mono text-sm text-muted">JOURNEY</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16">
            MY <span className="text-accent">PATH</span>
          </h2>
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-8 border-l-2 pl-8"
                style={{ borderColor: event.color }}
              >
                <span className="font-mono text-2xl" style={{ color: event.color }}>
                  {event.year}
                </span>
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-muted">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-cursor-mode="timeline"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Section header */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-muted">004</span>
          <span className="w-16 h-[1px] bg-foreground/20" />
          <span className="font-mono text-sm text-muted">JOURNEY</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
          MY <span className="text-accent">PATH</span>
        </h2>
      </div>

      {/* Event info card */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 right-8 z-20 bg-background/80 backdrop-blur-sm border border-foreground/10 p-6 max-w-xs"
      >
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: timelineEvents[activeIndex].color }}
        >
          {timelineEvents[activeIndex].title}
        </h3>
        <p className="text-sm text-muted">
          {timelineEvents[activeIndex].description}
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="font-mono text-sm disabled:opacity-30 hover:text-accent transition-colors"
          data-cursor="hover"
        >
          ← PREV
        </button>

        <div className="flex gap-2">
          {timelineEvents.map((event, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIndex ? event.color : "rgba(255,255,255,0.2)",
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
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
        key={`year-${activeIndex}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-bold tracking-tighter pointer-events-none select-none"
        style={{ color: timelineEvents[activeIndex].color }}
      >
        {timelineEvents[activeIndex].year}
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas3DErrorBoundary onError={() => setHasError(true)}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor("#0a0a0a", 1);
            }}
          >
            <color attach="background" args={["#0a0a0a"]} />
            <Suspense fallback={null}>
              <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            </Suspense>
          </Canvas>
        </Canvas3DErrorBoundary>
      </div>
    </section>
  );
}
