import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/caseStudies';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function TestimonialsSection() {
  return (
    <section className="section-pad relative bg-ink-950/60" aria-label="Testimonials">
      <div className="container-bt">
        <SectionHeading
          align="center"
          eyebrow="What partners say"
          title={
            <>
              Trusted by people who <span className="text-gradient">care about growth</span>.
            </>
          }
          description="Real words from real partners. Placeholder quotes below — ready for your testimonials."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition-colors duration-500 hover:border-electric/30">
                <Quote className="h-6 w-6 text-electric/60" aria-hidden />
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-cloud-200">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/[0.06] pt-5">
                  <p className="font-display text-sm font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-xs text-cloud-600">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
