import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const lastArgs = useRef<unknown[] | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: unknown[]) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        // Store args for trailing call
        lastArgs.current = args;

        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (lastArgs.current) {
              lastCall.current = Date.now();
              callback(...lastArgs.current);
              lastArgs.current = null;
            }
            timeoutRef.current = null;
          }, delay - (now - lastCall.current));
        }
      }
    }) as T,
    [callback, delay]
  );
}

export function useRAFThrottle<T extends (...args: unknown[]) => void>(
  callback: T
): T {
  const rafRef = useRef<number | null>(null);
  const argsRef = useRef<unknown[] | null>(null);

  return useCallback(
    ((...args: unknown[]) => {
      argsRef.current = args;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (argsRef.current) {
            callback(...argsRef.current);
          }
          rafRef.current = null;
        });
      }
    }) as T,
    [callback]
  );
}
