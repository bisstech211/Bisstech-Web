import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal';

export function BlogCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" aria-label="Blog CTA">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.12] blur-[130px]" />
      </div>
      <div className="container-bt relative text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs font-medium text-electric-200">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to grow?
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready to grow your business <span className="text-gradient">digitally?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cloud-400">
            Let's build a smarter digital strategy for your business — from marketing and websites to AI
            automation.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-electric px-8 py-4 font-display text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg"
            >
              Let's Talk <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.02] px-8 py-4 font-display text-sm font-semibold text-cloud-100 backdrop-blur transition-colors hover:border-electric/50 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-electric" />
              Explore Services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
