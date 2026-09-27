import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { useCaseStudies } from '../../hooks/useCaseStudies';
import { CaseStudyCard } from '../ui/CaseStudyCard';

export function CaseStudiesSection() {
  const { data: caseStudies } = useCaseStudies();

  return (
    <section className="section-pad relative bg-cream-50" aria-label="Case studies">
      <div className="container-bt">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Case studies"
            title={
              <>
                Work that <span className="text-gradient">moves metrics</span>.
              </>
            }
            description="Real problems, practical solutions, measurable outcomes."
          />
          <Reveal delay={0.15}>
            <Button to="/services" variant="ghost" withArrow>
              See how we work
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {caseStudies?.map((cs) => (
            <Reveal key={cs.id} delay={0.05} className="">
              <CaseStudyCard caseStudy={cs} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}