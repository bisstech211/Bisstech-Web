import { BLOG_CATEGORIES } from '../../data/blog';
import { cn } from '../../lib/utils';

export function BlogCategories({
  active,
  onChange,
  categories,
}: {
  active: string;
  onChange: (c: string) => void;
  categories?: string[];
}) {
  const list = categories && categories.length ? categories : (BLOG_CATEGORIES as unknown as string[]);
  return (
    <div className="sticky top-[72px] z-20 -mx-5 border-y border-espresso-950/08 bg-cream-50/90 px-5 backdrop-blur-xl sm:mx-0 sm:px-0">
      <nav
        aria-label="Blog categories"
        className="container-bt flex gap-2 overflow-x-auto py-3 no-scrollbar"
      >
        {list.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              aria-pressed={isActive}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-1.5 font-display text-xs font-medium transition-colors',
                isActive
                  ? 'border-coffee/40 bg-coffee text-cream-50 shadow-card-light-hover'
                  : 'border-espresso-950/10 bg-white text-espresso-500 hover:border-espresso-950/20 hover:text-espresso-950',
              )}
            >
              {cat}
            </button>
          );
        })}
      </nav>
    </div>
  );
}