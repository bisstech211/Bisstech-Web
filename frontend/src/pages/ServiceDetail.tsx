import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../lib/seo';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { CTASection } from '../components/home/CTASection';
import { EASE } from '../lib/motion';
import { useServices } from '../hooks/useServices';

type FAQ = { question: string; answer: string };

export default function ServiceDetail() {
  const { services } = useServices();
  const [service, setService] = useState<typeof services[0] | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Extract slug from URL
  const pathParts = window.location.pathname.split('/');
  const slug = pathParts[pathParts.length - 1];

  useEffect(() => {
    // First try to find from local services (fallback)
    const local = services.find((s) => s.id === slug);
    if (local) {
      setService(local);
      // Also fetch full API data for FAQs if available
      fetchFullService(local.id);
    } else {
      // Fetch from API directly
      fetchFullService(slug);
    }
  }, [services, slug]);

  const fetchFullService = async (idOrSlug: string) => {
    try {
      const res = await fetch(`/api/v1/services/public/${idOrSlug}`);
      if (res.ok) {
        const json = await res.json() as { data: { faqs?: Array<{ question: string; answer: string }> } };
        if (json.data?.faqs?.length) {
          setFaqs(json.data.faqs);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch full service detail:', e);
    }
  };

  // Find related services (all except current)
  const relatedServices = services.filter((s) => s.id !== slug);

  if (!service) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="shimmer h-1 w-32 rounded-full" />
      </div>
    );
  }

  // Build SEO from service data
  const seoTitle = `${service.title} | BISSTECH Services`;
  const seoDescription = service.short || service.description;

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} path={`/services/${service.id}`} />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-40 pb-24 bg-cream-50" aria-labelledby="service-title">
          <div aria-hidden className="absolute inset-0 bg-grid-cream mask-fade-y opacity-60" />
          <div aria-hidden className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-coffee/10 blur-[120px]" />

          {/* Background Image */}
          {service.backgroundImage && (
            <div
              aria-hidden
              className="absolute inset-0 -z-10 overflow-hidden"
            >
              <img
                src={service.backgroundImage}
                alt={service.backgroundImageAlt || service.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-espresso-950/40 to-transparent" />
            </div>
          )}

          <div className="container-bt relative">
            <Reveal>
              <p className="eyebrow justify-start">Service Detail</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-display text-sm font-semibold tracking-[0.2em] text-coffee">
                  {service.number}
                </span>
                <h1 id="service-title" className="font-display text-display-lg font-bold text-espresso-950">
                  {service.title}
                </h1>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-espresso-600 sm:text-lg">
                {service.description}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-2">
                {service.groups.slice(0, 5).map((g) => (
                  <span
                    key={g.title}
                    className="rounded-full border border-espresso-950/10 bg-cream-100 px-3 py-1 text-[11px] text-espresso-600"
                  >
                    {g.title}
                  </span>
                ))}
                {service.groups.length > 5 && (
                  <span className="rounded-full border border-coffee/30 bg-coffee/10 px-3 py-1 text-[11px] text-coffee">
                    +{service.groups.length - 5} more
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* What We Build / What We Cover */}
        <section className="section-pad border-t border-espresso-950/06" aria-label="What we build and cover">
          <div className="container-bt">
            <Reveal>
              <SectionHeading
                eyebrow="Capabilities"
                title={
                  <>
                    What we <span className="text-gradient">build</span> and what we{' '}
                    <span className="text-gradient">cover</span>.
                  </>
                }
                description="Every service is a collection of focused capabilities — each one designed to move your business forward."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-16 grid gap-10 lg:grid-cols-2">
                {service.groups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-espresso-950/06 bg-white p-7">
                    <h3 className="font-display text-lg font-semibold text-espresso-950">{group.title}</h3>
                    <ul className="mt-5 grid gap-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-espresso-700">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-coffee/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            {service.extra && service.extra.length > 0 && (
              <Reveal delay={0.15}>
                <div className="mt-10 rounded-2xl border border-espresso-950/06 bg-white p-7">
                  <h3 className="font-display text-lg font-semibold text-espresso-950">Technology & Integration</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.extra.map((e) => (
                      <span
                        key={e}
                        className="rounded-full border border-espresso-950/10 bg-cream-100 px-4 py-1.5 font-display text-xs font-medium text-espresso-700 transition-colors hover:border-coffee hover:text-coffee"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* Development Process */}
        <section className="section-pad border-t border-espresso-950/06" aria-label="Our process">
          <div className="container-bt">
            <Reveal>
              <SectionHeading
                eyebrow="Process"
                title={<>How we <span className="text-gradient">deliver</span> {service.title.toLowerCase()}.</>}
                description="A structured, transparent process from discovery to launch — and beyond."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-16 grid gap-8 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {service.process.map((p, idx) => (
                  <div key={p.step} className="group relative flex gap-5">
                    <div className="flex flex-col items-start">
                      <span className="font-display text-5xl font-bold text-coffee/20 group-hover:text-coffee/40 transition-colors duration-300">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-400">
                        Step {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-espresso-950">{p.step}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-espresso-600">{p.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-pad border-t border-espresso-950/06" aria-label="Benefits">
          <div className="container-bt">
            <Reveal>
              <SectionHeading
                eyebrow="Benefits"
                title={<>Why <span className="text-gradient">{service.title}</span> matters.</>}
                description="Real outcomes, not buzzwords — this is what changes when you work with us."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="relative rounded-2xl border border-espresso-950/06 bg-white p-6">
                    <div className="absolute -top-3 left-6 z-10 rounded-full bg-cream-50/90 px-2 text-coffee font-display text-xs">
                      ✦
                    </div>
                    <p className="pt-4 text-sm leading-relaxed text-espresso-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Deliverables */}
        <section className="section-pad border-t border-espresso-950/06" aria-label="Deliverables">
          <div className="container-bt">
            <Reveal>
              <SectionHeading
                eyebrow="Deliverables"
                title={<>What you <span className="text-gradient">receive</span>.</>}
                description="Production-ready assets, documentation and handover — so your team can run with it from day one."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {service.deliverables.map((deliverable) => (
                  <div key={deliverable} className="flex items-start gap-4 rounded-xl border border-espresso-950/06 bg-white p-5">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-coffee" />
                    <p className="text-sm leading-relaxed text-espresso-700">{deliverable}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="section-pad border-t border-espresso-950/06" aria-label="Frequently asked questions">
            <div className="container-bt">
              <Reveal>
                <SectionHeading
                  eyebrow="FAQ"
                  title={<>Common questions about <span className="text-gradient">{service.title.toLowerCase()}</span>.</>}
                  description="Quick answers — but we're always happy to talk through the details."
                />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-12 space-y-4 max-w-3xl">
                  {faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-xl border border-espresso-950/06 bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                        aria-expanded={openFaq === faq.question}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                      >
                        <span className="font-display text-sm font-semibold text-espresso-950">{faq.question}</span>
                        {openFaq === faq.question ? (
                          <ChevronUp className="h-5 w-5 text-coffee transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-espresso-400 transition-transform duration-300" />
                        )}
                      </button>
                      <AnimatePresence>
                        {openFaq === faq.question && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden px-5 pb-5"
                          >
                            <p className="text-sm leading-relaxed text-espresso-600">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Section Banner Image (shown when expanded) */}
        {(service.bannerImage || service.bannerImageAlt) && (
          <section className="section-pad border-t border-espresso-950/06" aria-label="Section banner">
            <div className="container-bt">
              <Reveal>
                <SectionHeading
                  eyebrow="Visual"
                  title={<>Section <span className="text-gradient">banner</span>.</>}
                  description="Expanded view of the service banner image."
                />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8">
                  <div className="relative overflow-hidden rounded-2xl border border-espresso-950/06 bg-white">
                    <div className="aspect-video relative">
                      <img
                        src={service.bannerImage || '/placeholder-banner.svg'}
                        alt={service.bannerImageAlt || `${service.title} banner`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {!service.bannerImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-coffee/10 to-espresso/10">
                        <div className="text-center p-8">
                          <ImageIcon className="mx-auto h-16 w-16 text-coffee/30" />
                          <p className="mt-4 text-espresso-500">No banner image uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {service.bannerImageWidth && service.bannerImageHeight && (
                    <p className="mt-2 text-xs text-espresso-400 text-right">
                      {service.bannerImageWidth} × {service.bannerImageHeight} px
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* CTA */}
        <CTASection />

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="section-pad border-t border-espresso-950/06" aria-label="Related services">
            <div className="container-bt">
              <Reveal>
                <SectionHeading
                  eyebrow="Explore more"
                  title={<>Related <span className="text-gradient">services</span>.</>}
                  description="Our capabilities work together — combine them for maximum impact."
                />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedServices.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-espresso-950/06 bg-white p-6 transition-all duration-500 hover:border-coffee/30 hover:shadow-card-light-hover"
                    >
                      {s.backgroundImage && (
                        <>
                          <div
                            aria-hidden
                            className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
                          >
                            <img
                              src={s.backgroundImage}
                              alt={s.backgroundImageAlt || s.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <div
                            aria-hidden
                            className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-t from-espresso-950/80 via-espresso-950/40 to-transparent"
                          />
                        </>
                      )}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-semibold tracking-[0.2em] text-espresso-400">
                            {s.number}
                          </span>
                          <span className="grid h-11 w-11 place-items-center rounded-xl border border-espresso-950/10 bg-white text-coffee transition-colors duration-500 group-hover:bg-coffee group-hover:text-cream-50">
                            <s.icon className="h-5 w-5" />
                          </span>
                        </div>
                        <h3 className="mt-6 font-display text-lg font-semibold text-espresso-950">{s.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-espresso-600">{s.short}</p>
                      </div>
                      <div className="relative z-10 mt-6 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-espresso-400 transition-colors group-hover:text-coffee">
                          Explore
                        </span>
                        <ArrowRight className="h-4 w-4 text-espresso-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-coffee" />
                      </div>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-coffee to-espresso-700 transition-transform duration-500 group-hover:scale-x-100"
                      />
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </main>
    </>
  );
}