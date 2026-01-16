"use client";

import { useState, useEffect } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLowPowerMode: boolean;
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isLowPowerMode: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Check for low power mode indicators
      // This is a heuristic based on device memory and hardware concurrency
      const isLowPowerMode =
        (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory! < 4 ||
        navigator.hardwareConcurrency < 4;

      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isTouchDevice,
        isLowPowerMode,
      });
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceInfo;
}
