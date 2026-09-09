import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/services';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { cn } from '../../lib/utils';
import { useIsMobile, useReducedMotionGate } from '../../lib/hooks';

const ServiceOrb = lazy(() => import('../three/ServiceOrb'));

/**
 * "3D interactive services experience" — select a service on the left and the
 * 3D orb on the right reacts (color + motion). Premium, light, fun.
 */
export function Service3DExperience() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const reduced = useReducedMotionGate();
  const service = SERVICES[active];

  return (
    <section className="section-pad relative overflow-hidden" aria-label="Interactive services experience">
      <div aria-hidden className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-violetglow/10 blur-[120px]" />

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
          {/* Service list */}
          <div className="order-2 space-y-2 lg:order-1">
            {SERVICES.map((s, i) => {
              const isActive = i === active;
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
                        ? 'border-electric/40 bg-white/[0.04] shadow-glow'
                        : 'border-white/[0.06] bg-white/[0.01] hover:border-white/15',
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={cn(
                          'font-display text-lg font-bold transition-colors duration-300',
                          isActive ? 'text-electric' : 'text-cloud-600',
                        )}
                      >
                        {s.number}
                      </span>
                      <div>
                        <h3
                          className={cn(
                            'font-display text-lg font-semibold transition-colors duration-300 sm:text-xl',
                            isActive ? 'text-white' : 'text-cloud-300',
                          )}
                        >
                          {s.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-cloud-500">{s.short}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-all duration-300',
                        isActive ? 'translate-x-0 text-electric opacity-100' : '-translate-x-1 opacity-0',
                      )}
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* 3D orb + service detail */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <div aria-hidden className="absolute inset-8 rounded-full bg-electric/10 blur-3xl" />
                {!reduced && (
                  <div className="absolute inset-0">
                    <Suspense fallback={<div className="h-full w-full rounded-full border border-white/10" />}>
                      <ServiceOrb active={active} />
                    </Suspense>
                  </div>
                )}

                {/* Detail card */}
                <div className="absolute inset-x-4 bottom-0 translate-y-10 rounded-2xl border border-white/10 bg-ink-900/90 p-5 shadow-card backdrop-blur sm:inset-x-8">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-electric">
                    {service.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cloud-300">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.groups.slice(0, 3).map((g) => (
                      <span
                        key={g.title}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-cloud-400"
                      >
                        {g.title}
                      </span>
                    ))}
                    <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-[11px] text-electric-200">
                      + more
                    </span>
                  </div>
                  <Link
                    to={`/services#${service.id}`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-white transition-colors hover:text-electric"
                  >
                    Explore {service.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {isMobile && !reduced && (
          <p className="mt-4 text-center text-xs text-cloud-600">Tip: tap a service to see it react.</p>
        )}
      </div>
    </section>
  );
}
