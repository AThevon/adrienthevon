"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Calculate distance from mouse
    vec2 mouseNorm = uMouse / uResolution;
    vec2 prevMouseNorm = uPrevMouse / uResolution;

    // Mouse velocity for trail effect
    vec2 velocity = (mouseNorm - prevMouseNorm) * 10.0;

    float dist = distance(uv, mouseNorm);
    float radius = 0.15;

    // Smooth falloff
    float strength = smoothstep(radius, 0.0, dist) * uIntensity;

    // Displacement based on distance and velocity
    vec2 displacement = normalize(uv - mouseNorm) * strength * 0.05;
    displacement += velocity * strength * 0.3;

    // Add some swirl
    float angle = strength * 2.0;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    displacement = rotation * displacement;

    // Apply displacement
    vec2 distortedUv = uv - displacement;

    // Chromatic aberration based on displacement
    float aberration = length(displacement) * 2.0;
    vec4 colorR = texture2D(uTexture, distortedUv + vec2(aberration * 0.01, 0.0));
    vec4 colorG = texture2D(uTexture, distortedUv);
    vec4 colorB = texture2D(uTexture, distortedUv - vec2(aberration * 0.01, 0.0));

    gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
  }
`;

interface DistortionPlaneProps {
  texture: THREE.Texture;
}

function DistortionPlane({ texture }: DistortionPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPrevMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [texture, size]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX,
        y: size.height - e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size.height]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth mouse following
    const lerp = 1 - Math.pow(0.1, delta * 5);

    prevMouseRef.current = { ...mouseRef.current };

    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerp;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerp;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    material.uniforms.uPrevMouse.value.set(prevMouseRef.current.x, prevMouseRef.current.y);
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

interface LiquidDistortionProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
}

export default function LiquidDistortion({
  children,
  intensity = 1,
  enabled = true,
}: LiquidDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const captureContent = () => {
      // We'll use a simpler approach - overlay the effect
    };

    captureContent();
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative">
      {children}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <Canvas
          ref={canvasRef}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 1] }}
        >
          <DistortionOverlay intensity={intensity} />
        </Canvas>
      </div>
    </div>
  );
}

// Simpler approach: distortion overlay that affects everything underneath
function DistortionOverlay({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const mouseRef = useRef({ x: size.width / 2, y: size.height / 2 });
  const targetMouseRef = useRef({ x: size.width / 2, y: size.height / 2 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [intensity, size]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTarget = {
        x: e.clientX,
        y: size.height - e.clientY,
      };

      velocityRef.current = {
        x: newTarget.x - targetMouseRef.current.x,
        y: newTarget.y - targetMouseRef.current.y,
      };

      targetMouseRef.current = newTarget;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size.height]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth interpolation
    const lerp = 1 - Math.pow(0.05, delta * 3);

    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerp;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerp;

    // Decay velocity
    velocityRef.current.x *= 0.95;
    velocityRef.current.y *= 0.95;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uMouse.value.set(
      mouseRef.current.x / size.width,
      mouseRef.current.y / size.height
    );
    material.uniforms.uVelocity.value.set(
      velocityRef.current.x / size.width,
      velocityRef.current.y / size.height
    );
    material.uniforms.uTime.value += delta;
  });

  const overlayFragmentShader = `
    uniform vec2 uMouse;
    uniform vec2 uVelocity;
    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float dist = distance(uv, uMouse);
      float radius = 0.2;

      // Only show effect near cursor
      float strength = smoothstep(radius, 0.0, dist) * uIntensity;

      if (strength < 0.001) {
        discard;
      }

      // Create a subtle ripple/lens effect visualization
      float ripple = sin(dist * 30.0 - uTime * 3.0) * 0.5 + 0.5;
      ripple *= strength;

      // Velocity trail
      float velocityMag = length(uVelocity) * 50.0;

      // Glow effect
      vec3 color = vec3(1.0, 0.3, 0.0); // accent color
      float alpha = ripple * 0.1 + strength * 0.05;
      alpha *= min(1.0, velocityMag + 0.3);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={overlayFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
