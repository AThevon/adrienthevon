"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Render at half resolution for performance
const RESOLUTION_SCALE = 0.5;

interface Props {
  /** Hex color string (e.g. "#ff4d00") */
  color?: string;
}

function hexToVec3(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ];
}

export default function AuroraShaderBackground({ color = "#ffaa00" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Update color uniform when prop changes
  useEffect(() => {
    if (materialRef.current) {
      const [r, g, b] = hexToVec3(color);
      materialRef.current.uniforms.uColor.value.set(r, g, b);
    }
  }, [color]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false });

    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(1);
    renderer.setSize(w * RESOLUTION_SCALE, h * RESOLUTION_SCALE);
    renderer.domElement.style.width = `${w}px`;
    renderer.domElement.style.height = `${h}px`;
    container.appendChild(renderer.domElement);

    const [r, g, b] = hexToVec3(color);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(w * RESOLUTION_SCALE, h * RESOLUTION_SCALE),
        },
        uColor: { value: new THREE.Vector3(r, g, b) },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec3 uColor;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u * u * (3.0 - 2.0 * u);
          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
            u.y
          );
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
          p = p * mat2(6.0, -4.0, 4.0, 6.0);

          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          for (float i = 0.0; i < 18.0; i++) {
            v = p
              + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5
              + vec2(
                  sin(iTime * 3.0 + i) * 0.003,
                  cos(iTime * 3.5 - i) * 0.003
                );

            // Dynamic aurora color based on uniform with subtle variation
            float variation = sin(i * 0.3 + iTime * 0.4) * 0.15;
            vec3 col = uColor + vec3(variation, variation * 0.5, -variation * 0.3);
            col = clamp(col, 0.0, 1.0);

            vec4 auroraColors = vec4(col, 1.0);

            vec4 currentContribution = auroraColors
              * exp(sin(i * i + iTime * 0.8))
              / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));

            float thinnessFactor = smoothstep(0.0, 1.0, i / 18.0) * 0.6;
            o += currentContribution * thinnessFactor;
          }

          o = tanh(pow(o / 55.0, vec4(1.6)));
          gl_FragColor = o * 1.5;
        }
      `,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = () => {
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw * RESOLUTION_SCALE, nh * RESOLUTION_SCALE);
      renderer.domElement.style.width = `${nw}px`;
      renderer.domElement.style.height = `${nh}px`;
      material.uniforms.iResolution.value.set(
        nw * RESOLUTION_SCALE,
        nh * RESOLUTION_SCALE
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
