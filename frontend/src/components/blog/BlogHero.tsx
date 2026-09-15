import { Search, Sparkles } from 'lucide-react';
import { Reveal, MaskReveal } from '../ui/Reveal';

type Props = {
  search: string;
  onSearch: (v: string) => void;
};

export function BlogHero({ search, onSearch }: Props) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20" aria-label="Blog hero">
      {/* Background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-40" />
        <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-electric/[0.10] blur-[130px]" />
        <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-violetglow/10 blur-[100px]" />
      </div>

      <div className="container-bt relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/10 px-4 py-1.5 text-xs font-medium text-electric-200">
            <Sparkles className="h-3.5 w-3.5" />
            Insights & ideas
          </span>
        </Reveal>

        <div className="mt-6 max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <MaskReveal delay={0.05}>Insights, Ideas</MaskReveal>
            <MaskReveal delay={0.12}>
              <span className="text-gradient">& Digital Growth</span>
            </MaskReveal>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cloud-400 sm:text-lg">
              Practical insights on digital marketing, web development, AI automation, ecommerce,
              technology and business growth — written for builders and decision makers.
            </p>
          </Reveal>
        </div>

        {/* Search */}
        <Reveal delay={0.28} className="mt-10 max-w-xl">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <div className="group relative flex items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-cloud-500 transition-colors group-focus-within:text-electric" />
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search articles, topics, categories…"
              className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-cloud-500 backdrop-blur transition-all duration-300 focus:border-electric/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-electric/20"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/15"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-cloud-500">Try “SEO”, “AI”, “Ecommerce” or “Design”.</p>
        </Reveal>
      </div>
    </section>
  );
}
