import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { Button } from '../ui/Button';
import { useServices } from '../../hooks/useServices';
import { useWebsiteSettings } from '../../hooks/useWebsiteSettings';

/**
 * Home preview — pulls from the same backend source as /services.
 * Any service added/updated in Admin instantly reflects here.
 */
export function ServicesSection() {
  const { services } = useServices();
  const { settings } = useWebsiteSettings();

  // Header button settings for consistent hover effect
  const headerBtnBg = settings.header?.buttonBgColor || '#6f4e37';
  const headerBtnHoverBg = settings.header?.buttonHoverBg || '#3d2b1f';

  return (
    <section className="section-pad relative bg-cream-50" aria-label="Services">
      <div aria-hidden className="absolute inset-0 bg-grid-cream mask-fade-y opacity-60" />

      <div className="container-bt relative">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                Everything you need to <span className="text-gradient">grow</span>.
              </>
            }
            description="Seven integrated capabilities — so your brand, website, marketing, commerce, AI systems, software and apps all work as one growth machine."
          />
          <Reveal delay={0.15}>
            <Button to="/services" variant="ghost" withArrow>
              All services
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}>
              <TiltCard className="h-full">
                <Link
                  to={`/services/${s.id}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7"
                  style={{
                    borderColor: 'var(--service-card-border-color)',
                    borderWidth: 'var(--service-card-border-width)',
                    borderStyle: 'solid',
                    backgroundColor: 'var(--service-card-bg)',
                    boxShadow: 'var(--service-card-shadow)',
                    transition: `all var(--service-card-bottom-bar-transition) ease-out, border-color var(--service-card-bottom-bar-transition) ease-out, box-shadow var(--service-card-bottom-bar-transition) ease-out, transform var(--service-card-bottom-bar-transition) ease-out`,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.borderColor = 'var(--service-card-hover-border-color)';
                    target.style.borderWidth = 'var(--service-card-hover-border-width)';
                    target.style.backgroundColor = 'var(--service-card-hover-bg)';
                    target.style.boxShadow = 'var(--service-card-hover-shadow)';
                    target.style.transform = `translateY(var(--service-card-translate-y)) scale(var(--service-card-scale))`;
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.borderColor = 'var(--service-card-border-color)';
                    target.style.borderWidth = 'var(--service-card-border-width)';
                    target.style.backgroundColor = 'var(--service-card-bg)';
                    target.style.boxShadow = 'var(--service-card-shadow)';
                    target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  {/* Background Image Layer */}
                  {s.backgroundImage && (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
                      >
                        <img
                          src={s.backgroundImage}
                          alt={s.backgroundImageAlt || s.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform"
                          style={{
                            transitionDuration: `var(--service-card-image-transition)`,
                            transform: 'scale(1)',
                          }}
                          loading="lazy"
                        />
                      </div>
                      {/* Gradient Overlay for readability */}
                      <div
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-t from-espresso-950/90 via-espresso-950/40 to-transparent"
                      />
                    </>
                  )}
                  <div
                    aria-hidden
                    className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-coffee/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold tracking-[0.2em] text-espresso-400">
                        {s.number}
                      </span>
                      <span
                        className="grid h-11 w-11 place-items-center rounded-xl border transition-all duration-500"
                        style={{
                          borderColor: 'var(--service-card-icon-bg)',
                          backgroundColor: 'var(--service-card-icon-bg)',
                          color: 'var(--service-card-icon-text)',
                          transform: 'scale(var(--service-card-icon-scale))',
                          transitionDuration: `var(--service-card-icon-transition)`,
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          target.style.backgroundColor = 'var(--service-card-icon-hover-bg)';
                          target.style.color = 'var(--service-card-icon-hover-text)';
                          target.style.borderColor = 'var(--service-card-icon-hover-bg)';
                          target.style.transform = `scale(var(--service-card-icon-scale))`;
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          target.style.backgroundColor = 'var(--service-card-icon-bg)';
                          target.style.color = 'var(--service-card-icon-text)';
                          target.style.borderColor = 'var(--service-card-icon-bg)';
                          target.style.transform = 'scale(1)';
                        }}
                      >
                        <s.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-8 font-display text-xl font-semibold text-espresso-950">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-espresso-600">{s.short}</p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-between">
                    <span
                      className="text-xs font-medium uppercase tracking-[0.2em] transition-all"
                      style={{
                        color: 'var(--service-card-explore-text-color)',
                        transitionDuration: `var(--service-card-arrow-transition)`,
                      }}
                    >
                      Explore
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-all"
                      style={{
                        color: 'var(--service-card-arrow-color)',
                        transform: 'translateX(0) translateY(0)',
                        transitionDuration: `var(--service-card-arrow-transition)`,
                      }}
                    />
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 origin-left scale-x-0 transition-transform"
                    style={{
                      height: 'var(--service-card-bottom-bar-height)',
                      background: 'var(--service-card-bottom-bar-color)',
                      transitionDuration: `var(--service-card-bottom-bar-transition)`,
                      transform: 'scaleX(0)',
                    }}
                  />
                </Link>
              </TiltCard>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <Link
              to="/contact"
              className="group relative flex h-full min-h-[220px] flex-col items-start justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-coffee to-espresso-800 p-7 shadow-card-light-hover transition-shadow duration-500 hover:shadow-card-light-hover"
            >
              <div aria-hidden className="absolute inset-0 bg-grid-cream opacity-20" />
              <p className="relative font-display text-xl font-semibold leading-snug text-white">
                Not sure where to start?
              </p>
              <p className="relative mt-2 text-sm text-white/80">Tell us your goals — we'll map the path.</p>
              <Button
                to="/contact"
                size="md"
                variant="primary"
                withArrow
                style={{
                  backgroundColor: headerBtnBg,
                  marginTop: '1.5rem',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = headerBtnHoverBg;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = headerBtnBg;
                }}
              >
                Talk to us
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}