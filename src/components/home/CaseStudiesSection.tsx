import { ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '../../data/caseStudies';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { Button } from '../ui/Button';

export function CaseStudiesSection() {
  return (
    <section className="section-pad relative" aria-label="Case studies">
      <div className="container-bt">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Case studies"
            title={
              <>
                Work that <span className="text-gradient">moves metrics</span>.
              </>
            }
            description="Real problems, practical solutions, measurable outcomes. Placeholder projects — ready to be replaced with your results."
          />
          <Reveal delay={0.15}>
            <Button to="/services" variant="ghost" withArrow>
              See how we work
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.06} className={i % 2 === 1 ? 'md:mt-12' : ''}>
              <TiltCard className="h-full" maxTilt={5}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-colors duration-500 hover:border-electric/30">
                  {/* Visual header */}
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${cs.accent}`}>
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-ink/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {cs.industry}
                    </span>
                    <span className="absolute bottom-4 left-6 font-display text-2xl font-bold text-white/90">
                      {cs.client}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2">
                      {cs.services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-cloud-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <dl className="mt-5 space-y-4 text-sm">
                      <div>
                        <dt className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-cloud-600">
                          Challenge
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-cloud-300">{cs.challenge}</dd>
                      </div>
                      <div>
                        <dt className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-cloud-600">
                          Solution
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-cloud-300">{cs.solution}</dd>
                      </div>
                      <div>
                        <dt className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-electric">
                          Result
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-cloud-200">{cs.result}</dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                      <span className="text-xs text-cloud-500">Placeholder case study</span>
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cloud-400 transition-all duration-300 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
