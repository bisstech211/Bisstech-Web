import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { MaskReveal, Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center', className)} id={id}>
      {eyebrow && (
        <Reveal y={16} amount={0.5}>
          <span className={cn('eyebrow', centered && 'justify-center')}>{eyebrow}</span>
        </Reveal>
      )}
      <h2 className="mt-5 font-display text-display-md font-semibold text-espresso-950">
        {title}
      </h2>
      {description && (
        <Reveal delay={0.12} amount={0.5}>
          <p className="mt-6 text-base leading-relaxed text-espresso-600 sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

export { MaskReveal };