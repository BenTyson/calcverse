import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
}

export function useCountUp({ end, duration = 600 }: UseCountUpOptions): number {
  const [value, setValue] = useState(end);
  const prevEnd = useRef(end);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const start = prevEnd.current;
    prevEnd.current = end;

    // Skip if no change
    if (start === end) {
      setValue(end);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (end - start) * eased);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [end, duration]);

  return value;
}
