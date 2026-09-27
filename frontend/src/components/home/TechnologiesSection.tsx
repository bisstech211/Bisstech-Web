import { useTechnologies, type TechnologyCategory } from '../../hooks/useTechnologies';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ExternalLink } from 'lucide-react';

export function TechnologiesSection() {
  const { data, loading } = useTechnologies();

  if (loading) {
    return (
      <section className="section-pad relative overflow-hidden bg-cream-50" aria-label="Technologies and tools">
        <div aria-hidden className="absolute left-0 top-1/4 h-[360px] w-[360px] rounded-full bg-coffee/10 blur-[120px]" />
        <div className="container-bt relative">
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-full rounded-2xl border border-espresso-950/06 bg-white p-6 animate-pulse">
                <div className="h-4 w-24 bg-coffee-100 rounded mb-5" />
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-4 w-full bg-coffee-100 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Transform categories to match the expected structure
  const techCategories: { category: string; items: { name: string; description?: string; logoUrl?: string; websiteUrl?: string }[] }[] = data.categories
    .filter((cat: TechnologyCategory) => cat.isActive && cat.items.length > 0)
    .map((cat: TechnologyCategory) => ({
      category: cat.name,
      items: cat.items
        .filter((item) => item.isActive)
        .map((item) => ({
          name: item.name,
          description: item.description || undefined,
          logoUrl: item.logoUrl || undefined,
          websiteUrl: item.websiteUrl || undefined,
        })),
    }));

  return (
    <section className="section-pad relative overflow-hidden bg-cream-50" aria-label="Technologies and tools">
      <div aria-hidden className="absolute left-0 top-1/4 h-[360px] w-[360px] rounded-full bg-coffee/10 blur-[120px]" />

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
          {techCategories.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-6 transition-colors duration-500 hover:border-coffee/30 hover:shadow-card-light-hover">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-coffee">
                  {cat.category}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {cat.items.map((item, idx) => (
                    <li key={`${cat.category}-${item.name}-${idx}`} className="flex items-center gap-2.5 text-sm text-espresso-700">
                      {item.logoUrl && (
                        <img
                          src={item.logoUrl}
                          alt={item.logoUrl}
                          className="h-4 w-4 object-contain"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      {!item.logoUrl && <span aria-hidden className="h-1 w-1 rounded-full bg-coffee/70" />}
                      {item.websiteUrl ? (
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-coffee transition-colors"
                          title={item.description}
                        >
                          <span>{item.name}</span>
                          <ExternalLink className="h-3 w-3 text-coffee/50" />
                        </a>
                      ) : (
                        <span title={item.description}>{item.name}</span>
                      )}
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