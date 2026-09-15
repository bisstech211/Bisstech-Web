import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../../data/services';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { Button } from '../ui/Button';

/**
 * The five core services — premium numbered cards with hover depth.
 */
export function ServicesSection() {
  return (
    <section className="section-pad relative" aria-label="Services">
      <div aria-hidden className="absolute inset-0 bg-grid mask-fade-y opacity-40" />

      <div className="container-bt relative">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                Everything you need to <span className="text-gradient">grow</span>.
              </>
            }
            description="Five integrated capabilities — so your brand, website, marketing, commerce and AI systems all work as one growth machine."
          />
          <Reveal delay={0.15}>
            <Button to="/services" variant="ghost" withArrow>
              All services
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}>
              <TiltCard className="h-full">
                <Link
                  to={`/services#${s.id}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition-colors duration-500 hover:border-electric/30"
                >
                  {/* hover glow */}
                  <div
                    aria-hidden
                    className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-electric/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold tracking-[0.2em] text-cloud-600">
                        {s.number}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-electric transition-colors duration-500 group-hover:bg-electric group-hover:text-white">
                        <s.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-8 font-display text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cloud-400">{s.short}</p>
                  </div>

                  <div className="relative mt-8 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-cloud-500 transition-colors group-hover:text-electric">
                      Explore
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-cloud-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric" />
                  </div>

                  {/* hover fill line */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-electric to-violetglow transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Link>
              </TiltCard>
            </Reveal>
          ))}

          {/* CTA tile */}
          <Reveal delay={0.3}>
            <Link
              to="/contact"
              className="group relative flex h-full min-h-[220px] flex-col items-start justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-electric to-violetglow p-7 text-white shadow-glow transition-shadow duration-500 hover:shadow-glow-lg"
            >
              <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
              <p className="relative font-display text-xl font-semibold leading-snug">
                Not sure where to start?
              </p>
              <p className="relative mt-2 text-sm text-white/80">Tell us your goals — we’ll map the path.</p>
              <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold">
                Talk to us <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
