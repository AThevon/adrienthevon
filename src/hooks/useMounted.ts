"use client";

import { useEffect, useState } from "react";

/**
 * Hook to check if component is mounted on client side
 * Useful to avoid hydration mismatches
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
