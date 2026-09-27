import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Linkedin, Facebook, Twitter, Youtube, Github, Mail } from 'lucide-react';
import { CONTACT } from '../../data/site';
import { Logo } from './Logo';
import { useWebsiteSettings } from '../../hooks/useWebsiteSettings';

// Icon mapping for social platforms
const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram />,
  linkedin: <Linkedin />,
  facebook: <Facebook />,
  twitter: <Twitter />,
  youtube: <Youtube />,
  github: <Github />,
  mail: <Mail />,
};

export function Footer() {
  const year = new Date().getFullYear();
  const watermarkRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useWebsiteSettings();

  // Get dynamic data from settings
  const footerAppearance = settings?.footerAppearance;
  const socialSettings = settings?.socialSettings || [];

  // Use dynamic nav links from settings or fallback
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  // Use dynamic social icons from settings
  const socialIconsData = socialSettings
    .filter(s => s.isEnabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(s => ({
      platform: s.platform,
      label: s.platform.charAt(0).toUpperCase() + s.platform.slice(1),
      href: s.url,
      icon: socialIcons[s.platform.toLowerCase()] || null,
      iconSize: s.iconSize || 20,
      color: s.color,
      hoverColor: s.hoverColor,
      background: s.background,
      hoverBackground: s.hoverBackground,
      borderRadius: s.borderRadius,
      hoverScale: s.hoverScale,
      hoverRotation: s.hoverRotation,
      hoverShadow: s.hoverShadow,
      transition: s.transitionDuration || 0.3,
    }));

  // Footer description from settings or fallback
  const footerDescription = footerAppearance?.description ||
    'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.';

  // Copyright text from settings or fallback
  const copyrightText = footerAppearance?.copyrightText || `© ${year} bisstech. All rights reserved.`;

  // CTA text/link from settings or fallback
  const ctaText = footerAppearance?.ctaText || 'Start a Project';
  const ctaLink = footerAppearance?.ctaLink || '/contact';

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const element = watermarkRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        backgroundColor: 'var(--footer-bg, #fafafa)',
        borderColor: 'var(--footer-border-color, rgba(61, 43, 31, 0.1))',
        borderWidth: 'var(--footer-border-width, 1px)',
      }}
    >
      {/* Subtle animated glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-coffee/10 blur-[120px] animate-pulse-soft" />

      <div className="container-bt relative">
        {/* Top CTA strip */}
        <div className="flex flex-col items-start justify-between gap-8 border-b py-14 md:flex-row md:items-center"
          style={{
            borderColor: 'var(--footer-border-color, rgba(61, 43, 31, 0.1))',
          }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--footer-text, #4a4a4a)' }}>Have a project in mind?</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-coffee-900 sm:text-4xl" style={{ color: 'var(--footer-heading, #1a1a1a)' }}>
              Let's build. Grow. Automate.
            </h2>
          </div>
          <Link
            to={ctaLink}
            className="group inline-flex items-center gap-3 rounded-full font-display text-sm font-semibold text-white transition-all"
            style={{
              backgroundColor: 'var(--footer-cta-bg)',
              padding: '16px 28px',
              boxShadow: 'var(--footer-cta-shadow)',
              transitionDuration: `var(--footer-cta-transition)`,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              const target = e.currentTarget as HTMLElement;
              target.style.backgroundColor = 'var(--footer-cta-hover-bg)';
              target.style.boxShadow = 'var(--footer-cta-hover-shadow)';
              target.style.transform = `scale(var(--footer-cta-scale))`;
              const arrow = target.querySelector('svg');
              if (arrow) {
                arrow.style.transform = `translateX(var(--footer-cta-arrow-translate-x)) translateY(var(--footer-cta-arrow-translate-y))`;
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              const target = e.currentTarget as HTMLElement;
              target.style.backgroundColor = 'var(--footer-cta-bg)';
              target.style.boxShadow = 'var(--footer-cta-shadow)';
              target.style.transform = 'scale(1)';
              const arrow = target.querySelector('svg');
              if (arrow) {
                arrow.style.transform = 'translateX(0) translateY(0)';
              }
            }}
          >
            {ctaText}
            <ArrowUpRight
              className="h-4 w-4 transition-transform"
              style={{
                transform: 'translateX(0) translateY(0)',
                transitionDuration: `var(--footer-cta-transition)`,
              }}
            />
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo
              style={{
                transition: `opacity var(--footer-logo-transition) ease-out, transform var(--footer-logo-transition) ease-out`,
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.opacity = 'var(--footer-logo-hover-opacity)';
                target.style.transform = `scale(var(--footer-logo-hover-scale))`;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.opacity = '1';
                target.style.transform = 'scale(1)';
              }}
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--footer-text, #4a4a4a)' }}>
              {footerDescription}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-6 inline-block font-display text-sm font-medium transition-all"
              style={{
                color: 'var(--footer-email-color)',
                textDecoration: 'var(--footer-email-underline) ? underline : none',
                textDecorationThickness: 'var(--footer-email-underline-thickness)',
                transitionDuration: `var(--footer-email-transition)`,
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--footer-email-hover-color)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--footer-email-color)';
              }}
            >
              {CONTACT.email}
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--footer-heading, #1a1a1a)' }}>
              Navigate
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm transition-all"
                    style={{
                      color: 'var(--footer-nav-link-color)',
                      textDecoration: 'var(--footer-nav-link-underline) ? underline : none',
                      textDecorationThickness: 'var(--footer-nav-link-underline-thickness)',
                      textUnderlineOffset: 'var(--footer-nav-link-underline-offset)',
                      transitionDuration: `var(--footer-nav-link-transition)`,
                      transitionTimingFunction: 'var(--footer-nav-link-easing)',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = 'var(--footer-nav-link-hover-color)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = 'var(--footer-nav-link-color)';
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--footer-heading, #1a1a1a)' }}>
              Services
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Digital Marketing',
                'Website Development',
                'App Development',
                'Software Development',
                'AI Automation',
                'E-commerce Management',
                'Graphic Design',
              ].map((title) => (
                <li key={title}>
                  <Link
                    to="/services"
                    className="text-sm transition-all"
                    style={{
                      color: 'var(--footer-service-link-color)',
                      textDecoration: 'var(--footer-service-link-underline) ? underline : none',
                      textDecorationThickness: 'var(--footer-service-link-underline-thickness)',
                      textUnderlineOffset: 'var(--footer-service-link-underline-offset)',
                      transitionDuration: `var(--footer-service-link-transition)`,
                      transitionTimingFunction: 'var(--footer-service-link-easing)',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = 'var(--footer-service-link-hover-color)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = 'var(--footer-service-link-color)';
                    }}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--footer-heading, #1a1a1a)' }}>
              Connect
            </p>
            <ul className="mt-5 space-y-3">
              {socialIconsData.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2.5 text-sm transition-all"
                    style={{
                      color: s.color || 'var(--footer-social-icon-color)',
                      transitionDuration: `var(--footer-social-icon-transition)`,
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = s.hoverColor || 'var(--footer-social-icon-hover-color)';
                      const icon = target.querySelector('svg');
                      if (icon) {
                        icon.style.transform = `scale(${s.hoverScale || 1.1}) rotate(${s.hoverRotation || 0}deg)`;
                        icon.style.color = s.hoverColor || 'var(--footer-social-icon-hover-color)';
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.color = s.color || 'var(--footer-social-icon-color)';
                      const icon = target.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                        icon.style.color = s.color || 'var(--footer-social-icon-color)';
                      }
                    }}
                  >
                    {s.icon && (
                      <span
                        className="h-4 w-4 transition-all"
                        style={{
                          color: s.color || 'var(--footer-social-icon-color)',
                          width: `${s.iconSize}px`,
                          height: `${s.iconSize}px`,
                          borderRadius: `${s.borderRadius || 12}px`,
                          backgroundColor: s.background || 'var(--footer-social-icon-bg)',
                          transitionDuration: `var(--footer-social-icon-transition)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {s.icon}
                      </span>
                    )}
                    <span
                      style={{
                        color: s.color || 'var(--footer-social-icon-color)',
                        transitionDuration: `var(--footer-social-icon-transition)`,
                      }}
                    >
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t py-8 sm:flex-row"
          style={{
            borderColor: 'var(--footer-border-color, rgba(61, 43, 31, 0.1))',
          }}>
          <p className="text-xs" style={{ color: 'var(--footer-text, #4a4a4a)' }}>{copyrightText}</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs transition-all"
              style={{
                color: 'var(--copyright-link-color)',
                textDecoration: 'var(--copyright-link-underline) ? underline : none',
                textDecorationThickness: 'var(--copyright-link-underline-thickness)',
                textUnderlineOffset: 'var(--copyright-link-underline-offset)',
                transitionDuration: `var(--copyright-link-transition)`,
                transitionTimingFunction: 'var(--copyright-link-easing)',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--copyright-link-hover-color)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--copyright-link-color)';
              }}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-xs transition-all"
              style={{
                color: 'var(--copyright-link-color)',
                textDecoration: 'var(--copyright-link-underline) ? underline : none',
                textDecorationThickness: 'var(--copyright-link-underline-thickness)',
                textUnderlineOffset: 'var(--copyright-link-underline-offset)',
                transitionDuration: `var(--copyright-link-transition)`,
                transitionTimingFunction: 'var(--copyright-link-easing)',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--copyright-link-hover-color)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = 'var(--copyright-link-color)';
              }}
            >
              Terms & Conditions
            </a>
            <span className="hidden text-xs sm:inline" style={{ color: 'var(--footer-text, #4a4a4a)' }}>
              7 core capabilities
            </span>
          </div>
        </div>

      </div>

      {/* Minimal footer watermark - bisstech */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 w-full flex items-center justify-center pointer-events-none select-none">
        <p
          ref={watermarkRef}
          className={`text-center font-display text-9xl sm:text-10xl lg:text-12xl font-light leading-none tracking-wide ${isVisible ? 'animate-footer-watermark-reveal' : ''}`}
          style={{
            color: 'var(--watermark-color, #6f4e37)',
            opacity: 'var(--watermark-opacity, 0.07)',
            transition: `opacity var(--watermark-transition, 0.5s) ease-out, color var(--watermark-transition, 0.5s) ease-out`,
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLParagraphElement>) => {
            const target = e.currentTarget as HTMLElement;
            target.style.color = 'var(--watermark-hover-color, #3d2b1f)';
            target.style.opacity = 'var(--watermark-opacity, 0.3)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLParagraphElement>) => {
            const target = e.currentTarget as HTMLElement;
            target.style.color = 'var(--watermark-color, #6f4e37)';
            target.style.opacity = 'var(--watermark-opacity, 0.07)';
          }}
        >
          bisstech
        </p>
      </div>
    </footer>
  );
}