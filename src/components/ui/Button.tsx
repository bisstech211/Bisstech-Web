import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Magnetic } from './Magnetic';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { to?: undefined; href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { to: string; href?: undefined };

type ButtonAsAnchor = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { href: string; to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const styles: Record<Variant, string> = {
  primary: 'bg-electric text-white shadow-glow hover:bg-electric-600 hover:shadow-glow-lg',
  ghost:
    'border border-white/15 bg-white/[0.02] text-cloud-100 backdrop-blur hover:border-electric/50 hover:text-white',
  outline: 'border border-electric/40 text-electric hover:bg-electric/10',
};

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
};

/**
 * Button — renders a <button>, router <Link> or <a> depending on which
 * navigation prop is provided. Optionally wrapped in a magnetic hover effect.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', withArrow = false, magnetic = true, children, className, ...rest },
  ref,
) {
  const classes = cn(
    'btn group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-semibold tracking-wide transition-all duration-300 select-none',
    styles[variant],
    sizes[size],
    className,
  );

  const inner = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );

  let content: React.ReactNode;

  if ('to' in rest && rest.to) {
    content = (
      <Link to={rest.to} className={classes} ref={ref as never}>
        {inner}
      </Link>
    );
  } else if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor;
    content = (
      <a href={href} className={classes} {...anchorRest} ref={ref as never}>
        {inner}
      </a>
    );
  } else {
    content = (
      <button className={classes} {...(rest as ButtonAsButton)} ref={ref as never}>
        {inner}
      </button>
    );
  }

  return <Magnetic strength={magnetic ? 0.35 : 0}>{content}</Magnetic>;
});
