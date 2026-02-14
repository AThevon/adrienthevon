"use client";

import { useReducedMotion } from "./useReducedMotion";
import { useDeviceDetect } from "./useDeviceDetect";
import { useGPUProbe } from "./useGPUProbe";

interface PerformanceConfig {
  enable3D: boolean;
  enableParticles: boolean;
  enableShaders: boolean;
  enableSmoothScroll: boolean;
  enableCursorEffects: boolean;
  particleMultiplier: number;
  enableAnimations: boolean;
}

export function usePerformance(): PerformanceConfig {
  const reducedMotion = useReducedMotion();
  const { isMobile, isTablet, isLowPowerMode } = useDeviceDetect();
  const { canRender, tier } = useGPUProbe();

  // If user prefers reduced motion, disable most effects
  if (reducedMotion) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: false,
      enableCursorEffects: false,
      particleMultiplier: 0,
      enableAnimations: false,
    };
  }

  // Mobile devices: disable heavy effects
  if (isMobile) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: true,
      enableCursorEffects: false,
      particleMultiplier: 0,
      enableAnimations: true,
    };
  }

  // GPU probe: can't render canvas at all
  if (!canRender) {
    return {
      enable3D: false,
      enableParticles: false,
      enableShaders: false,
      enableSmoothScroll: true,
      enableCursorEffects: true,
      particleMultiplier: 0,
      enableAnimations: true,
    };
  }

  // GPU probe: low performance tier
  if (tier === "low") {
    return {
      enable3D: true,
      enableParticles: true,
      enableShaders: true,
      enableSmoothScroll: true,
      enableCursorEffects: true,
      particleMultiplier: 0.3,
      enableAnimations: true,
    };
  }

  // Tablets: reduced effects
  if (isTablet || isLowPowerMode) {
    return {
      enable3D: true,
      enableParticles: true,
      enableShaders: true,
      enableSmoothScroll: true,
      enableCursorEffects: false,
      particleMultiplier: 0.5,
      enableAnimations: true,
    };
  }

  // Desktop: full effects
  return {
    enable3D: true,
    enableParticles: true,
    enableShaders: true,
    enableSmoothScroll: true,
    enableCursorEffects: true,
    particleMultiplier: 1,
    enableAnimations: true,
  };
}
