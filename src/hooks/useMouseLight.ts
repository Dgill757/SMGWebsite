import { useEffect, useRef } from 'react';

/**
 * useMouseLight — tracks the cursor position normalized to [-1, 1].
 *
 * Returns a ref (not state) so it never causes re-renders.
 * Cards can read posRef.current.x / .y inside event handlers to apply
 * radial-gradient lighting that follows the cursor.
 *
 * Safe on SSR / touch devices — values stay at {0, 0} when no pointer.
 */
export function useMouseLight() {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = (e: MouseEvent) => {
      ref.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  return ref;
}
