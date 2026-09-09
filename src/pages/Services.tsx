import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SERVICES, type Service } from '../data/services';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { CTASection } from '../components/home/CTASection';
import { EASE } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * Services page — detailed, interactive service cards.
 * Supports hash deep-links (e.g. /services#ai-automation) and URL state.
 */
export default function Services() {
  const [open, setOpen] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && SERVICES.some((s) => s.id === hash)) return hash;
    }
    return SERVICES[0].id;
  });

  const toggle = useCallback((id: string) => {
    setOpen((cur) => (cur === id ? '' : id));
  }, []);

  // Keep URL hash in sync
  useEffect(() => {
    if (open) history.replaceState(null, '', `#${open}`);
  }, [open]);

  // On load, if a hash is present, scroll the card into view smoothly.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, []);

  return (
    <>
      <SEO
        title="Services — Digital Marketing, Web, E-commerce, AI & Design"
        description="Explore BISSTECH's services: digital marketing, website development, e-commerce & quick commerce management, AI automation and graphic design."
        path="/services"
      />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-40 pb-20" aria-label="Services overview">
          <div aria-hidden className="absolute inset-0 bg-grid mask-fade-y opacity-50" />
          <div aria-hidden className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-electric/[0.12] blur-[120px]" />
          <div className="container-bt relative">
            <SectionHeading
              align="center"
              eyebrow="Our services"
              title={
                <>
                  Five capabilities. <span className="text-gradient">One growth engine.</span>
                </>
              }
              description="Open each service to explore everything we deliver — and what it does for your business."
            />
          </div>
        </section>

        {/* Sticky anchor nav */}
        <div className="sticky top-[72px] z-30 border-y border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
          <nav aria-label="Jump to service" className="container-bt flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggle(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(
                  'whitespace-nowrap rounded-full border px-4 py-1.5 font-display text-xs font-medium transition-colors',
                  open === s.id
                    ? 'border-electric/40 bg-electric/10 text-electric-200'
                    : 'border-white/10 text-cloud-400 hover:text-white',
                )}
              >
                {s.number} · {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Service cards */}
        <div className="container-bt space-y-5 py-16 sm:py-20">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} isOpen={open === service.id} onToggle={() => toggle(service.id)} />
          ))}

          <div className="mt-12 text-center">
            <Reveal>
              <h3 className="font-display text-2xl font-semibold text-white">Not sure which service fits?</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-cloud-400">
                Tell us what you’re trying to achieve — we’ll recommend the right mix.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button to="/contact" size="lg" withArrow>
                  Book a consultation
                </Button>
                <Button to="/" variant="ghost" size="lg">
                  Back to home
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
}

function ServiceCard({
  service,
  isOpen,
  onToggle,
}: {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div id={service.id} className="scroll-mt-40">
      <div
        className={cn(
          'overflow-hidden rounded-2xl border transition-all duration-500',
          isOpen ? 'border-electric/30 bg-white/[0.03] shadow-glow' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15',
        )}
      >
        {/* Card header */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${service.id}-panel`}
          className="group flex w-full items-center justify-between gap-6 p-6 text-left sm:p-8"
        >
          <div className="flex items-center gap-5 sm:gap-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-electric">
              <service.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-xs font-bold tracking-[0.2em] text-cloud-600">
                  {service.number}
                </span>
                <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{service.title}</h2>
              </div>
              <p className="mt-1 text-sm text-cloud-400">{service.short}</p>
            </div>
          </div>
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-cloud-400 transition-all duration-300',
              isOpen ? 'rotate-180 border-electric bg-electric text-white' : 'group-hover:border-white/30',
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>

        {/* Expandable panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`${service.id}-panel`}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="grid gap-10 border-t border-white/[0.06] p-6 sm:p-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]">
                {/* Sub-services */}
                <div>
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-electric">
                    What’s included
                  </p>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    {service.groups.map((g) => (
                      <div key={g.title}>
                        <h3 className="font-display text-sm font-semibold text-white">{g.title}</h3>
                        <ul className="mt-3 grid gap-2">
                          {g.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-cloud-300">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric/70" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {service.extra && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.extra.map((e) => (
                        <span
                          key={e}
                          className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] text-cloud-400"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar: benefits, deliverables, process */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/[0.07] bg-ink-950/60 p-5">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                      Why it matters
                    </p>
                    <ul className="mt-3 space-y-2">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-cloud-300">
                          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-ink-950/60 p-5">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                      Deliverables
                    </p>
                    <ul className="mt-3 space-y-2">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-cloud-300">
                          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-ink-950/60 p-5">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                      Our process
                    </p>
                    <ol className="mt-3 space-y-3">
                      {service.process.map((p) => (
                        <li key={p.step} className="flex gap-3">
                          <span className="font-display text-xs font-bold text-electric">{p.step}</span>
                          <span className="text-sm leading-snug text-cloud-300">{p.detail}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}