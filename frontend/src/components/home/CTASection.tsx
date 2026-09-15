import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT } from '../../data/site';
import { Reveal } from '../ui/Reveal';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36" aria-label="Call to action">
      {/* Background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.14] blur-[130px] animate-pulse-soft" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="container-bt relative text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs font-medium text-electric-200">
            <Sparkles className="h-3.5 w-3.5" />
            Ready when you are
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-8 max-w-4xl font-display text-display-lg font-bold text-white">
            Let’s turn your ideas into{' '}
            <span className="text-gradient">growth</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cloud-400 sm:text-lg">
            Tell us where you want to go. We’ll bring the strategy, technology, creative and AI to
            get you there — on time, on budget, on brand.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-electric px-8 py-4 font-display text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:shadow-glow-lg"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.02] px-8 py-4 font-display text-sm font-semibold text-cloud-100 transition-all duration-300 hover:border-electric/50 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-electric" />
              Talk to Us
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cloud-600">
            Build · Grow · Automate · Scale
          </p>
        </Reveal>
      </div>
    </section>
  );
}
