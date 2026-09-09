import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * BISSTECH wordmark logo (transparent PNG, black background removed).
 * Scales with the navbar height and stays responsive across breakpoints.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="BISSTECH — home"
      className={cn('group inline-flex items-center shrink-0', className)}
    >
      <img
        src="/images/bisstech-logo.png"
        alt="BISSTECH"
        width={136}
        height={48}
        className="h-8 max-h-full w-auto object-contain"
      />
      {!compact && (
        <span className="sr-only">
          BISSTECH
        </span>
      )}
    </Link>
  );
}