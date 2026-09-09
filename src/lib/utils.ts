import { clsx, type ClassValue } from 'clsx';

/** Merge class names safely. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Detect reduced-motion preference. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Guard for SSR-free browser checks. */
export const isBrowser = typeof window !== 'undefined';

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Ease a value toward a target (frame-rate independent-ish). */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}
