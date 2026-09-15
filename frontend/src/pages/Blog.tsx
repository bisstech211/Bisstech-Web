import { useEffect, useMemo, useState } from 'react';
import { SEO } from '../lib/seo';
import { BLOG_POSTS, type BlogPost } from '../data/blog';
import { BlogHero } from '../components/blog/BlogHero';
import { FeaturedBlog } from '../components/blog/FeaturedBlog';
import { BlogCategories } from '../components/blog/BlogCategories';
import { BlogCard } from '../components/blog/BlogCard';
import { EmptyState } from '../components/blog/BlogGrid';
import { BlogCTA } from '../components/blog/BlogCTA';
import { Reveal } from '../components/ui/Reveal';
import { API_BASE } from '../lib/api';

type ApiPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  readingTime?: string | null;
  featured?: boolean;
  category?: { name: string } | null;
  tags?: Array<{ name: string }>;
};

function mapApiPost(p: ApiPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    content: p.content,
    category: p.category?.name || 'General',
    tags: (p.tags || []).map((t) => t.name),
    featuredImage: p.featuredImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
    author: p.author || 'BISSTECH Team',
    publishedAt: (p.publishedAt || p.createdAt || new Date().toISOString()).slice(0, 10),
    readingTime: p.readingTime || '5 min read',
    featured: !!p.featured,
  };
}

export default function Blog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [remotePosts, setRemotePosts] = useState<BlogPost[] | null>(null);
  const [remoteCategories, setRemoteCategories] = useState<string[] | null>(null);

  // Fetch from backend — falls back to static BLOG_POSTS when offline.
  useEffect(() => {
    let cancelled = false;
    const q = search.trim();
    const params = new URLSearchParams();
    params.set('limit', '100');
    if (q) params.set('search', q);
    if (category !== 'All') params.set('category', category);

    fetch(`${API_BASE}/blog/public?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: { data: ApiPost[] }) => {
        if (cancelled) return;
        const mapped = (json.data || []).map(mapApiPost);
        setRemotePosts(mapped);
      })
      .catch(() => {
        if (!cancelled) setRemotePosts(null);
      });

    // Categories (once)
    if (!remoteCategories) {
      fetch(`${API_BASE}/blog/public-categories`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json: { data: Array<{ name: string }> }) => {
          if (cancelled) return;
          const names = (json.data || []).map((c) => c.name);
          if (names.length) setRemoteCategories(['All', ...names]);
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [search, category]);

  // Use remote data when available; otherwise static filtering.
  const source: BlogPost[] = remotePosts ?? BLOG_POSTS;

  const filtered = useMemo(() => {
    // When using remote, backend already filtered — just return as-is.
    if (remotePosts !== null) return source;
    const q = search.trim().toLowerCase();
    return source.filter((p) => {
      const catMatch = category === 'All' || p.category === category;
      if (!q) return catMatch;
      const hay = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(' ')} ${p.content}`.toLowerCase();
      return catMatch && hay.includes(q);
    });
  }, [source, search, category, remotePosts]);

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);
  const showFeatured = featured.length > 0 && search.trim() === '' && category === 'All';

  const categoriesForUI = remoteCategories ?? undefined;

  return (
    <>
      <SEO
        title="Blog — Insights, Ideas & Digital Growth"
        description="Practical insights on digital marketing, web development, AI automation, ecommerce, technology and business growth from BISSTECH."
        path="/blog"
      />
      <main>
        <BlogHero search={search} onSearch={setSearch} />

        {showFeatured && (
          <section className="container-bt space-y-6 pb-8">
            {featured.map((p) => (
              <FeaturedBlog key={p.id} post={p} />
            ))}
          </section>
        )}

        <BlogCategories active={category} onChange={setCategory} categories={categoriesForUI} />

        <section className="container-bt py-10 sm:py-14">
          {filtered.length === 0 ? (
            <EmptyState
              message="No articles found"
              onClear={() => {
                setSearch('');
                setCategory('All');
              }}
            />
          ) : (
            <>
              {!showFeatured && filtered.length > 0 && search.trim() === '' && category === 'All' && (
                <p className="mb-6 text-sm text-cloud-500">
                  Showing <span className="font-semibold text-white">{filtered.length}</span> articles
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(showFeatured ? rest : filtered).map((post, i) => (
                  <Reveal key={post.id} delay={i * 0.05}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>

        <BlogCTA />
      </main>
    </>
  );
}
