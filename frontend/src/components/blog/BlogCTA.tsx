import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal';

export function BlogCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-cream-50" aria-label="Blog CTA">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-cream mask-fade-y opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coffee/10 blur-[130px]" />
      </div>
      <div className="container-bt relative text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-coffee/30 bg-coffee/10 px-4 py-1.5 text-xs font-medium text-coffee">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to grow?
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold leading-tight text-espresso-950 sm:text-4xl lg:text-5xl">
            Ready to grow your business <span className="text-gradient">digitally?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-espresso-600">
            Let's build a smarter digital strategy for your business — from marketing and websites to AI
            automation.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-espresso-950 px-8 py-4 font-display text-sm font-semibold text-cream-50 shadow-card-light transition-all hover:shadow-card-light-hover hover:bg-espresso-900"
            >
              Let's Talk <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-full border border-espresso-950/10 bg-white px-8 py-4 font-display text-sm font-semibold text-espresso-800 backdrop-blur transition-colors hover:border-coffee/40 hover:bg-cream-100 hover:text-espresso-950"
            >
              <MessageCircle className="h-4 w-4 text-coffee" />
              Explore Services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}