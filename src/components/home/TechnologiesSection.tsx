import { TECHNOLOGIES } from '../../data/technologies';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function TechnologiesSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-ink-950/60" aria-label="Technologies and tools">
      <div aria-hidden className="absolute left-0 top-1/4 h-[360px] w-[360px] rounded-full bg-electric/10 blur-[120px]" />

      <div className="container-bt relative">
        <SectionHeading
          align="center"
          eyebrow="Technology & tools"
          title={
            <>
              Powered by the <span className="text-gradient">modern stack</span>.
            </>
          }
          description="We choose proven, scalable technology — and pair it with the AI tools that make businesses faster."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECHNOLOGIES.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-electric/30">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-electric">
                  {cat.category}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-cloud-300">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-electric/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
