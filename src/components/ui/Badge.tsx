import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'electric' | 'outline';
}) {
  const tones = {
    default: 'border-white/10 bg-white/[0.03] text-cloud-300',
    electric: 'border-electric/30 bg-electric/10 text-electric-200',
    outline: 'border-white/15 bg-transparent text-cloud-200',
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
