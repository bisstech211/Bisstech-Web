import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * BISSTECH wordmark logo (transparent PNG, black background removed).
 * Scales with the navbar height and stays responsive across breakpoints.
 * Supports 'dark' (default, light logo for dark backgrounds) and 'light' (coffee logo for light backgrounds) variants.
 */
export function Logo({
  className,
  compact = false,
  variant = 'dark',
  style,
  onMouseEnter,
  onMouseLeave
}: { className?: string; compact?: boolean; variant?: 'dark' | 'light'; style?: React.CSSProperties; onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>; onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <Link
      to="/"
      aria-label="BISSTECH — home"
      className={cn('group inline-flex items-center shrink-0', className)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src="/images/bisstech-logo.png"
        alt="BISSTECH"
        width={136}
        height={48}
        className={cn(
          'h-8 max-h-full w-auto object-contain transition-filter duration-300',
          variant === 'light' && 'filter invert-0 sepia-100 saturate-5 hue-rotate-35deg brightness-0.4 contrast-2'
        )}
      />
      {!compact && (
        <span className="sr-only">
          BISSTECH
        </span>
      )}
    </Link>
  );
}