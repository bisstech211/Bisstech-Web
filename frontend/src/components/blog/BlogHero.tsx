import { Search, Sparkles } from 'lucide-react';
import { Reveal, MaskReveal } from '../ui/Reveal';

type Props = {
  search: string;
  onSearch: (v: string) => void;
};

export function BlogHero({ search, onSearch }: Props) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20 bg-cream-50" aria-label="Blog hero">
      {/* Background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-cream mask-fade-y opacity-50" />
        <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-coffee/10 blur-[130px]" />
        <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-espresso-700/10 blur-[100px]" />
      </div>

      <div className="container-bt relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-coffee/10 px-4 py-1.5 text-xs font-medium text-coffee">
            <Sparkles className="h-3.5 w-3.5" />
            Insights & ideas
          </span>
        </Reveal>

        <div className="mt-6 max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-espresso-950 sm:text-5xl lg:text-6xl">
            <MaskReveal delay={0.05}>Insights, Ideas</MaskReveal>
            <MaskReveal delay={0.12}>
              <span className="text-gradient">& Digital Growth</span>
            </MaskReveal>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-600 sm:text-lg">
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
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-espresso-400 transition-colors group-focus-within:text-coffee" />
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search articles, topics, categories..."
              className="h-12 w-full rounded-full border border-espresso-950/10 bg-white py-3 pl-11 pr-4 text-sm text-espresso-950 placeholder:text-espresso-400 backdrop-blur transition-all duration-300 focus:border-coffee/40 focus:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-coffee/20"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-2 rounded-full bg-espresso-950/10 px-3 py-1 text-xs font-medium text-espresso-700 transition-colors hover:bg-espresso-950/20"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-espresso-400">Try "SEO", "AI", "Ecommerce" or "Design".</p>
        </Reveal>
      </div>
    </section>
  );
}