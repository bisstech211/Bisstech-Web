import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'coffee' | 'outline';
}) {
  const tones = {
    default: 'border-espresso-950/10 bg-cream-100 text-espresso-700',
    coffee: 'border-coffee/30 bg-coffee/10 text-coffee',
    outline: 'border-espresso-950/15 bg-transparent text-espresso-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}