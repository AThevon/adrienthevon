"use client";

import dynamic from "next/dynamic";
import { useDeviceDetect } from "@/hooks";

const CustomCursor = dynamic(
  () => import("@/components/effects/CustomCursor"),
  { ssr: false }
);

export default function CursorWrapper() {
  const { isMobile, isTouchDevice, isHydrated } = useDeviceDetect();

  // Don't render custom cursor on mobile or touch devices
  if (isHydrated && (isMobile || isTouchDevice)) {
    return null;
  }

  return <CustomCursor />;
}
