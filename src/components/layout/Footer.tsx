import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CONTACT, FOOTER_SERVICES, NAV_LINKS, SOCIALS } from '../../data/site';
import { Logo } from './Logo';
import { SERVICES } from '../../data/services';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-950">
      {/* Subtle animated glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-electric/10 blur-[120px] animate-pulse-soft" />

      <div className="container-bt relative">
        {/* Top CTA strip */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/[0.06] py-14 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Have a project in mind?</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Let’s build. Grow. Automate.
            </h2>
          </div>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-electric px-7 py-4 font-display text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:shadow-glow-lg"
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cloud-400">
              Build. Grow. Automate. A global digital growth, technology, AI & creative agency for
              ambitious businesses.
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-6 inline-block font-display text-sm font-medium text-electric transition-colors hover:text-electric-300"
            >
              {CONTACT.email}
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Navigate
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-cloud-300 transition-colors duration-200 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Services
            </p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    className="text-sm text-cloud-300 transition-colors duration-200 hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Connect
            </p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2.5 text-sm text-cloud-300 transition-colors duration-200 hover:text-white"
                  >
                    <s.icon className="h-4 w-4 text-cloud-500 transition-colors group-hover:text-electric" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 sm:flex-row">
          <p className="text-xs text-cloud-500">© {year} BISSTECH. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-cloud-500">Privacy Policy</span>
            <span className="text-xs text-cloud-500">Terms &amp; Conditions</span>
            <span className="hidden text-xs text-cloud-600 sm:inline">{FOOTER_SERVICES.length} core capabilities</span>
          </div>
        </div>
      </div>

      {/* Giant watermark wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.25em] bg-gradient-to-b from-white/[0.05] to-transparent bg-clip-text text-center font-display text-[18vw] font-bold leading-none tracking-tight text-transparent">
          BISSTECH
        </p>
      </div>
    </footer>
  );
}
