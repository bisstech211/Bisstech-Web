import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { EASE, viewportOnce } from '../../lib/motion';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

/** Fade + rise reveal on scroll into view. */
export function Reveal({ children, className, delay = 0, y = 28, once = true, amount = 0.2 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal for headings. */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={cn('block overflow-hidden', className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export type { Variants };
