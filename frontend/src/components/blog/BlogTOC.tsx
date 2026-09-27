import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; level: number };

export function BlogTOC({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const els = Array.from(div.querySelectorAll('h2, h3')) as HTMLElement[];
    setHeadings(
      els.map((el) => ({
        id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      })),
    );
  }, [content]);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-100px 0px -70% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-espresso-950/08 bg-cream-50 p-5">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-500">
        On this page
      </p>
      <ul className="mt-4 space-y-2">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block text-sm leading-snug transition-colors ${active === h.id ? 'font-medium text-coffee' : 'text-espresso-600 hover:text-espresso-950'}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
