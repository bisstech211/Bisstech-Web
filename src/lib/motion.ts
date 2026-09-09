import type { Variants } from 'framer-motion';

/**
 * Shared motion variants — one source of truth for the site's animation language.
 * Keep them subtle, fast and premium. All respect reduced-motion via MotionConfig.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.08 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const slideUp: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: EASE },
  },
};

/** For text that reveals line-by-line inside an overflow hidden wrapper. */
export const wordMask: Variants = {
  hidden: { y: '110%', opacity: 0.001 },
  visible: (i: number = 0) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.06 },
  }),
};

/** Viewport config used across the site. */
export const viewportOnce = { once: true, margin: '-80px' } as const;

/** Standard section-reveal component props. */
export const revealViewport = { once: true, amount: 0.25 } as const;
