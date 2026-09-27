import type { ReactNode } from 'react';
import { Reveal } from '../ui/Reveal';

export function BlogGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export function EmptyState({
  message,
  onClear,
}: {
  message: string;
  onClear?: () => void;
}) {
  return (
    <Reveal className="col-span-full">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-espresso-950/08 bg-cream-50 px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold text-espresso-950">{message}</p>
        <p className="mt-2 max-w-sm text-sm text-espresso-600">
          Try a different search term or category to find what you are looking for.
        </p>
        {onClear && (
          <button
            onClick={onClear}
            className="mt-6 rounded-full bg-espresso-950 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-espresso-900"
          >
            Clear search
          </button>
        )}
      </div>
    </Reveal>
  );
}
