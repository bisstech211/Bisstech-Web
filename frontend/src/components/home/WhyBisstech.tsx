import { Check } from 'lucide-react';
import { WHY_BISSTECH } from '../../data/process';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function WhyBisstech() {
  return (
    <section className="section-pad relative bg-cream-50" aria-label="Why BISSTECH">
      <div className="container-bt">
        <SectionHeading
          align="center"
          eyebrow="Why BISSTECH"
          title={
            <>
              The partner serious brands <span className="text-gradient">choose</span>.
            </>
          }
          description="We operate like an in-house growth team with the firepower of an international agency."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_BISSTECH.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-espresso-950/06 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-coffee/30 hover:shadow-card-light-hover">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-coffee/30 bg-coffee/10 text-coffee">
                  <Check className="h-4 w-4" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-espresso-950">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-espresso-600">{w.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}