import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsMobile, useReducedMotionGate } from '../../lib/hooks';

/**
 * A soft electric glow that trails the cursor.
 * Desktop-only, pointer-fine only, disabled under reduced motion.
 */
export function CursorGlow() {
  const reduced = useReducedMotionGate();
  const isMobile = useIsMobile();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 25, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 25, mass: 0.6 });
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || isMobile) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, isMobile, x, y]);

  if (reduced || isMobile) return null;

  return (
    <motion.div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        background:
          'radial-gradient(circle at center, rgba(229,9,20,0.10) 0%, rgba(229,9,20,0.04) 40%, transparent 70%)',
      }}
    />
  );
}
