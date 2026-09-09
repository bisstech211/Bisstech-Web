import { CLIENT_MARQUEE } from '../../data/caseStudies';
import { Marquee } from '../ui/Marquee';
import { Reveal } from '../ui/Reveal';

/**
 * Capability strip — a calm, confident marquee of what BISSTECH does.
 * (Deliberately no fake client logos.)
 */
export function TrustMarquee() {
  return (
    <section className="border-y border-white/[0.05] bg-ink-950/60 py-10" aria-label="Our capabilities">
      <Reveal y={14} amount={0.6}>
        <p className="mb-6 text-center text-[11px] uppercase tracking-[0.3em] text-cloud-600">
          One agency. Every growth lever.
        </p>
      </Reveal>
      <Marquee items={CLIENT_MARQUEE} />
    </section>
  );
}
