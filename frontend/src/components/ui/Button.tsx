import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Magnetic } from './Magnetic';
import { useWebsiteSettings } from '../../hooks/useWebsiteSettings';

type Variant = 'primary' | 'ghost' | 'outline' | 'secondary';
type Size = 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { to?: undefined; href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { to: string; href?: undefined };

type ButtonAsAnchor = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { href: string; to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const baseClasses = 'btn group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-semibold tracking-wide transition-all duration-300 select-none';

/**
 * Button — renders a <button>, router <Link> or <a> depending on which
 * navigation prop is provided. Optionally wrapped in a magnetic hover effect.
 * Uses dynamic CSS variables from WebsiteSettings for all styling.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', withArrow = false, magnetic = true, children, className, style, onMouseEnter, onMouseLeave, ...rest },
  ref,
) {
  const { settings } = useWebsiteSettings();
  const btnSettings = settings?.button;

  // Dynamic styles from settings
  const bgColor = btnSettings?.bgColor || '#6f4e37';
  const textColor = btnSettings?.textColor || '#ffffff';
  const borderColor = btnSettings?.borderColor || '#6f4e37';
  const borderWidth = btnSettings?.borderWidth ?? 0;
  const borderRadius = `${btnSettings?.borderRadius ?? 9999}px`;
  const padding = btnSettings?.padding?.desktop || '16px 32px';
  const fontSize = `${btnSettings?.fontSize?.desktop ?? 14}px`;
  const fontWeight = btnSettings?.fontWeight || '600';
  const hoverBgColor = btnSettings?.hoverBgColor || '#3d2b1f';
  const hoverTextColor = btnSettings?.hoverTextColor || '#ffffff';
  const hoverBorderColor = btnSettings?.hoverBorderColor || '#3d2b1f';
  const hoverScale = btnSettings?.hoverScale ?? 1.02;
  const hoverShadow = btnSettings?.hoverShadow || '0 8px 25px rgba(111, 78, 55, 0.3)';
  const transitionDuration = `${btnSettings?.transitionDuration ?? 0.3}s`;

  // Variant-specific overrides (for ghost/outline variants)
  let variantStyles: React.CSSProperties = {};

  if (variant === 'ghost') {
    variantStyles = {
      backgroundColor: 'rgba(111, 78, 55, 0.05)',
      color: '#6f4e37',
      borderColor: 'rgba(111, 78, 55, 0.2)',
      borderWidth: '1px',
    };
  } else if (variant === 'outline') {
    variantStyles = {
      backgroundColor: 'transparent',
      color: '#6f4e37',
      borderColor: 'rgba(111, 78, 55, 0.4)',
      borderWidth: '1px',
    };
  } else if (variant === 'secondary') {
    variantStyles = {
      backgroundColor: '#ffffff',
      color: '#3d2b1f',
      borderColor: 'rgba(111, 78, 55, 0.1)',
      borderWidth: '1px',
    };
  } else {
    // Primary variant
    variantStyles = {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: borderColor,
      borderWidth: `${borderWidth}px`,
    };
  }

  const combinedStyle: React.CSSProperties = {
    ...variantStyles,
    borderRadius,
    padding,
    fontSize,
    fontWeight,
    transition: `all ${transitionDuration} ease-out`,
    ...style,
  };

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

  // Hover handlers
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget as HTMLElement;
    if (variant === 'ghost') {
      target.style.backgroundColor = 'rgba(111, 78, 55, 0.1)';
      target.style.borderColor = 'rgba(111, 78, 55, 0.5)';
    } else if (variant === 'outline') {
      target.style.backgroundColor = 'rgba(111, 78, 55, 0.1)';
    } else if (variant === 'secondary') {
      target.style.backgroundColor = '#f5f5f5';
      target.style.borderColor = '#6f4e37';
    } else {
      target.style.backgroundColor = hoverBgColor;
      target.style.color = hoverTextColor;
      target.style.borderColor = hoverBorderColor;
      target.style.boxShadow = hoverShadow;
      target.style.transform = `scale(${hoverScale})`;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const target = e.currentTarget as HTMLElement;
    if (variant === 'ghost') {
      target.style.backgroundColor = 'rgba(111, 78, 55, 0.05)';
      target.style.borderColor = 'rgba(111, 78, 55, 0.2)';
    } else if (variant === 'outline') {
      target.style.backgroundColor = 'transparent';
      target.style.borderColor = 'rgba(111, 78, 55, 0.4)';
    } else if (variant === 'secondary') {
      target.style.backgroundColor = '#ffffff';
      target.style.borderColor = 'rgba(111, 78, 55, 0.1)';
    } else {
      target.style.backgroundColor = bgColor;
      target.style.color = textColor;
      target.style.borderColor = borderColor;
      target.style.boxShadow = 'none';
      target.style.transform = 'scale(1)';
    }
    onMouseLeave?.(e);
  };

  let content: React.ReactNode;

  if ('to' in rest && rest.to) {
    content = (
      <Link
        to={rest.to}
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref as never}
        className={cn(baseClasses, className)}
      >
        {inner}
      </Link>
    );
  } else if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor;
    content = (
      <a
        href={href}
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...anchorRest}
        ref={ref as never}
        className={cn(baseClasses, className)}
      >
        {inner}
      </a>
    );
  } else {
    content = (
      <button
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(rest as ButtonAsButton)}
        ref={ref as never}
        className={cn(baseClasses, className)}
      >
        {inner}
      </button>
    );
  }

  return <Magnetic strength={magnetic ? 0.35 : 0}>{content}</Magnetic>;
});