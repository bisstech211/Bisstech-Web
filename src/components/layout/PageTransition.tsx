import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '../../lib/motion';

/**
 * Elegant, fast page transition — a quick fade/slide-up on route change.
 * Deliberately lightweight (no loading screens).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
