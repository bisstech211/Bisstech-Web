import { useRef, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotionGate } from '../../lib/hooks';

type MagneticProps = {
  children: ReactNode;
  /** How strongly the element is pulled toward the cursor. */
  strength?: number;
  className?: string;
};

/**
 * Magnetic — the child subtly follows the cursor and springs back on leave.
 * Disabled automatically under prefers-reduced-motion.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduced = useReducedMotionGate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
