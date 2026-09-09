import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Bot,
  Workflow,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from './Button';
import { Logo } from '../layout/Logo';
import { NAV_LINKS } from '../../data/site';
import { cn } from '../../lib/utils';

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface ResponsiveHeroBannerProps {
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  showHeader?: boolean;
  badgeLabel?: string;
  badgeText?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  partnersTitle?: string;
  partners?: { label: string; icon: LucideIcon }[];
}

const DEFAULT_PARTNERS: { label: string; icon: LucideIcon }[] = [
  { label: 'NovaTech', icon: Zap },
  { label: 'Aurora', icon: Sparkles },
  { label: 'Hexlane', icon: Workflow },
  { label: 'Vertex', icon: TrendingUp },
  { label: 'Pureloop', icon: Bot },
];

const DEFAULT_NAV_LINKS: NavLink[] = NAV_LINKS.map((l) => ({
  label: l.label,
  href: l.path,
  isActive: l.path === '/',
}));

/**
 * ResponsiveHeroBanner — BISSTECH-branded, centered hero banner.
 * Deep-black + vibrant-red aesthetic matching the BISSTECH site (ink / electric
 * palette, Montserrat display headings). An internal header is optional
 * (`showHeader`) — it is disabled when the app's global Navbar is on the page.
 *
 * Entrance animations use `animate-fade-slide-in-1..4`
 * (see tailwind.config.js + @keyframes fadeSlideIn in src/index.css).
 */
const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  backgroundImageUrl,
  navLinks: navLinksProp,
  ctaButtonText = 'Start a Project',
  ctaButtonHref = '/contact',
  showHeader = true,
  badgeLabel = 'v2.0',
  badgeText = 'AI & PERFORMANCE AGENT',
  title = 'BUILD. GROW.',
  titleLine2 = 'AUTOMATE.',
  description =
    'BISSTECH scales ambitious businesses through high-performance engineering, growth strategy, and automated workflows — so you build once, grow continuously, and let the machine run the repeatable parts.',
  primaryButtonText = 'Start a Project',
  primaryButtonHref = '/contact',
  secondaryButtonText = 'Explore Services',
  secondaryButtonHref = '/services',
  partnersTitle = 'Trusted by teams building the future',
  partners = DEFAULT_PARTNERS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = navLinksProp ?? DEFAULT_NAV_LINKS;

  return (
    <section className="relative isolate flex min-h-[100svh] overflow-hidden bg-ink">
      {/* Background: subtle grid + radial electric glow (BISSTECH dark style) */}
      <div aria-hidden className="bg-grid mask-fade-y absolute inset-0 opacity-60" />
      {backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(52% 44% at 50% 40%, rgba(229,9,20,0.16), transparent 70%)',
          }}
        />
      )}

      {/* Optional internal header — hidden when the global Navbar is on the page */}
      {showHeader && (
        <header className="relative z-20">
          <div className="container-bt flex h-[72px] items-center justify-between">
            <Logo />
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={cn(
                      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      link.isActive ? 'text-white' : 'text-cloud-400 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button to={ctaButtonHref} size="md" className="ml-1">
                  {ctaButtonText}
                </Button>
              </div>
            </nav>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="container-bt border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b border-white/[0.06] py-3 text-sm text-cloud-400 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Centered content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-slide-in-1 mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
            </span>
            <span className="text-xs font-medium text-cloud-300">
              BISSTECH ENGINE {badgeLabel} — {badgeText}
            </span>
          </div>

          <h1 className="animate-fade-slide-in-2 font-display text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
            <span className="text-slate-600">.</span>
            <br className="hidden sm:block" />
            <span className="text-gradient">{titleLine2}</span>
          </h1>

          <p className="animate-fade-slide-in-3 mx-auto mt-6 max-w-2xl text-base text-cloud-300 sm:text-lg">
            {description}
          </p>

          <div className="animate-fade-slide-in-4 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button to={primaryButtonHref} size="lg" withArrow>
              {primaryButtonText}
            </Button>
            <Button to={secondaryButtonHref} size="lg" variant="ghost">
              {secondaryButtonText}
            </Button>
          </div>
        </div>

        {/* Trust / partner pills (illustrative) */}
        <div className="mx-auto mt-20 w-full max-w-5xl">
          <p className="animate-fade-slide-in-1 text-center text-sm text-cloud-500">
            {partnersTitle}
          </p>
          <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-5">
            {partners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <span
                  key={partner.label}
                  className="animate-fade-slide-in-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-cloud-400 backdrop-blur transition-colors hover:border-electric/30 hover:text-white"
                  style={{ animationDelay: `${0.3 + index * 0.08}s` }}
                >
                  <Icon className="h-3.5 w-3.5 text-electric" />
                  {partner.label}
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-cloud-600">
            Illustrative partner names
          </p>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
};

export default ResponsiveHeroBanner;