import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotionGate } from '../../lib/hooks';

/**
 * Smooth scrolling via Lenis — buttery, fast, never sluggish.
 * Respects prefers-reduced-motion (disables smoothing entirely).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionGate();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // expose for ScrollToTop / hash navigation
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Anchor links
    const onClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      if ((window as unknown as Record<string, unknown>).__lenis === lenis) {
        delete (window as unknown as Record<string, unknown>).__lenis;
      }
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
