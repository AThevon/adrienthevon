"use client";

import { useReducedMotion } from "./useReducedMotion";
import { useDeviceDetect } from "./useDeviceDetect";

interface PerformanceConfig {
  // Should heavy 3D effects be enabled?
  enable3D: boolean;
  // Should particle effects be enabled?
  enableParticles: boolean;
  // Should shader effects be enabled?
  enableShaders: boolean;
  // Should smooth scroll be enabled?
  enableSmoothScroll: boolean;
  // Should cursor effects be enabled?
  enableCursorEffects: boolean;
  // Particle count multiplier (0-1)
  particleMultiplier: number;
  // Should animations be enabled?
  enableAnimations: boolean;
}

export function usePerformance(): PerformanceConfig {
  const reducedMotion = useReducedMotion();
  const { isMobile, isTablet, isLowPowerMode } = useDeviceDetect();

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
      enableCursorEffects: false, // No cursor on mobile
      particleMultiplier: 0,
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
      enableCursorEffects: false, // Usually touch devices
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
