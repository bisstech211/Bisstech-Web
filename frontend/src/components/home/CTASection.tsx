import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT } from '../../data/site';
import { Reveal } from '../ui/Reveal';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36 bg-cream-50" aria-label="Call to action">
      {/* Background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-cream mask-fade-y opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coffee/10 blur-[130px] animate-pulse-soft" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-espresso-950/10 to-transparent" />
      </div>

      <div className="container-bt relative text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-coffee/30 bg-coffee/10 px-4 py-1.5 text-xs font-medium text-coffee">
            <Sparkles className="h-3.5 w-3.5" />
            Ready when you are
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-8 max-w-4xl font-display text-display-lg font-bold text-espresso-950">
            Let's turn your ideas into{' '}
            <span className="text-gradient">growth</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-espresso-600 sm:text-lg">
            Tell us where you want to go. We'll bring the strategy, technology, creative and AI to
            get you there — on time, on budget, on brand.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full font-display text-sm font-semibold transition-all"
              style={{
                backgroundColor: 'var(--cta-section-primary-bg)',
                color: 'var(--cta-section-primary-text)',
                padding: '16px 32px',
                boxShadow: 'var(--cta-section-primary-shadow)',
                transition: `all var(--cta-section-primary-transition) ease-out`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'var(--cta-section-primary-hover-bg)';
                target.style.color = 'var(--cta-section-primary-hover-text)';
                target.style.boxShadow = 'var(--cta-section-primary-hover-shadow)';
                target.style.transform = `scale(var(--cta-section-primary-scale))`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'var(--cta-section-primary-bg)';
                target.style.color = 'var(--cta-section-primary-text)';
                target.style.boxShadow = 'var(--cta-section-primary-shadow)';
                target.style.transform = 'scale(1)';
              }}
            >
              Start a Project
              <ArrowRight
                className="h-4 w-4 transition-transform"
                style={{
                  transform: 'translateX(0)',
                  transition: `transform var(--cta-section-primary-transition) ease-out`,
                }}
              />
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-3 rounded-full font-display text-sm font-semibold transition-all"
              style={{
                backgroundColor: 'var(--cta-section-secondary-bg)',
                color: 'var(--cta-section-secondary-text)',
                borderColor: 'var(--cta-section-secondary-border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '16px 32px',
                boxShadow: 'var(--cta-section-secondary-shadow)',
                transition: `all var(--cta-section-secondary-transition) ease-out`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'var(--cta-section-secondary-hover-bg)';
                target.style.color = 'var(--cta-section-secondary-hover-text)';
                target.style.borderColor = 'var(--cta-section-secondary-hover-border)';
                target.style.boxShadow = 'var(--cta-section-secondary-hover-shadow)';
                target.style.transform = `scale(var(--cta-section-secondary-scale))`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'var(--cta-section-secondary-bg)';
                target.style.color = 'var(--cta-section-secondary-text)';
                target.style.borderColor = 'var(--cta-section-secondary-border)';
                target.style.boxShadow = 'var(--cta-section-secondary-shadow)';
                target.style.transform = 'scale(1)';
              }}
            >
              <MessageCircle className="h-4 w-4 text-coffee" />
              Talk to Us
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-espresso-400">
            Build · Grow · Automate · Scale
          </p>
        </Reveal>
      </div>
    </section>
  );
}