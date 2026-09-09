import { cn } from '../../lib/utils';

type MarqueeProps = {
  items: string[];
  className?: string;
  reverse?: boolean;
};

/** Infinite horizontal marquee of words/items. */
export function Marquee({ items, className, reverse = false }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={cn('relative overflow-hidden mask-fade-x', className)}>
      <div className={cn('flex w-max gap-0', reverse ? 'animate-marquee-reverse' : 'animate-marquee')}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-sm font-medium uppercase tracking-[0.2em] text-cloud-500"
          >
            {item}
            <span className="text-electric/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
