import { SectionHeading } from '../ui/SectionHeading';
// import { Reveal } from '../ui/Reveal';
import { Testimonials3DMarquee } from '../ui/3d-testimonials';

export function TestimonialsSection() {
  console.log('[TestimonialsSection] Rendering');
  console.error('[TestimonialsSection] ERROR: This should appear in console if component renders');
  return (
    <section className="section-pad relative bg-cream-50" aria-label="Testimonials">
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

        {/* Removed Reveal wrapper to test visibility - it sets initial opacity: 0 */}
        <div className="mt-16">
          <Testimonials3DMarquee />
        </div>
      </div>
    </section>
  );
}