import { motion } from 'framer-motion';
import { STORY_ARC } from '../../data/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { EASE } from '../../lib/motion';

/**
 * "What BISSTECH does" — the visual storytelling arc:
 * IDEA → BUILD → GROW → AUTOMATE → SCALE
 */
export function WhatWeDo() {
  return (
    <section className="section-pad relative bg-cream-50" aria-label="What BISSTECH does">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-espresso-950/10 to-transparent" />

      <div className="container-bt grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="What BISSTECH does"
            title={
              <>
                From first <span className="text-gradient">idea</span> to full{' '}
                <span className="text-gradient">scale</span>.
              </>
            }
            description="One team for strategy, technology, creativity, AI and performance — so nothing gets lost between agencies. We take you through the entire growth journey."
          />
          <Reveal delay={0.2} className="mt-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {['Strategy', 'Design', 'Build', 'Marketing', 'AI', 'Scale'].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-espresso-950/10 bg-white px-4 py-3 text-center font-display text-sm font-semibold text-espresso-800 transition-colors hover:border-coffee/40 hover:bg-cream-200"
                >
                  {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Story arc */}
        <div className="flex flex-col">
          {STORY_ARC.map((s, i) => (
            <motion.div
              key={s.word}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="group relative border-b border-espresso-950/06 py-10 first:border-t"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="font-display text-xs font-semibold tracking-[0.3em] text-coffee/70">
                    PHASE 0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-4xl font-bold text-espresso-950/90 transition-colors duration-300 group-hover:text-coffee sm:text-5xl">
                    {s.word}
                  </h3>
                </div>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-espresso-600">{s.note}</p>
              </div>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-coffee to-transparent transition-all duration-700 group-hover:w-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}