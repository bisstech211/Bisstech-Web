import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { cn } from '../../lib/utils';
import { useIsMobile, useReducedMotionGate } from '../../lib/hooks';
import { useServices } from '../../hooks/useServices';

const ServiceOrb = lazy(() => import('../three/ServiceOrb'));

/**
 * 3D interactive experience — same live services as ServicesSection.
 */
export function Service3DExperience() {
  const { services } = useServices();
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const reduced = useReducedMotionGate();
  const safeActive = Math.min(active, Math.max(0, services.length - 1));
  const service = services[safeActive] ?? services[0];

  return (
    <section className="section-pad relative overflow-hidden bg-cream-50" aria-label="Interactive services experience">
      <div aria-hidden className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-coffee/10 blur-[120px]" />

      <div className="container-bt relative">
        <SectionHeading
          align="center"
          eyebrow="Interactive experience"
          title={
            <>
              Touch the <span className="text-gradient">stack</span>, feel the craft.
            </>
          }
          description="Every capability we offer is a live system — pick one and watch it come alive."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="order-2 space-y-2 lg:order-1">
            {services.map((s, i) => {
              const isActive = i === safeActive;
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={cn(
                      'group flex w-full items-center justify-between gap-6 rounded-2xl border px-6 py-5 text-left transition-all duration-500',
                      isActive
                        ? 'border-coffee/40 bg-white shadow-card-light-hover'
                        : 'border-espresso-950/06 bg-white hover:border-coffee/20 hover:shadow-card-light',
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={cn(
                          'font-display text-lg font-bold transition-colors duration-300',
                          isActive ? 'text-coffee' : 'text-espresso-400',
                        )}
                      >
                        {s.number}
                      </span>
                      <div>
                        <h3
                          className={cn(
                            'font-display text-lg font-semibold transition-colors duration-300 sm:text-xl',
                            isActive ? 'text-espresso-950' : 'text-espresso-700',
                          )}
                        >
                          {s.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-espresso-500">{s.short}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-all duration-300',
                        isActive ? 'translate-x-0 text-coffee opacity-100' : '-translate-x-1 opacity-0',
                      )}
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <div aria-hidden className="absolute inset-8 rounded-full bg-coffee/10 blur-3xl" />
                {!reduced && (
                  <div className="absolute inset-0">
                    <Suspense fallback={<div className="h-full w-full rounded-full border border-espresso-950/10" />}>
                      <ServiceOrb active={safeActive} />
                    </Suspense>
                  </div>
                )}

                <div className="absolute inset-x-4 bottom-0 translate-y-10 rounded-2xl border border-espresso-950/08 bg-white/95 p-5 shadow-card-light backdrop-blur sm:inset-x-8">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-coffee">
                    {service.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-espresso-700">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.groups.slice(0, 3).map((g) => (
                      <span
                        key={g.title}
                        className="rounded-full border border-espresso-950/10 bg-cream-100 px-3 py-1 text-[11px] text-espresso-600"
                      >
                        {g.title}
                      </span>
                    ))}
                    <span className="rounded-full border border-coffee/30 bg-coffee/10 px-3 py-1 text-[11px] text-coffee">
                      + more
                    </span>
                  </div>
                  <Link
                    to={`/services/${service.id}`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-espresso-950 transition-colors hover:text-coffee"
                  >
                    Explore {service.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {isMobile && !reduced && (
          <p className="mt-4 text-center text-xs text-espresso-400">Tip: tap a service to see it react.</p>
        )}
      </div>
    </section>
  );
}