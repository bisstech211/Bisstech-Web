import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SEO, SITE } from '../lib/seo';
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, formatDate, type BlogPost } from '../data/blog';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogShare } from '../components/blog/BlogShare';
import { BlogTOC } from '../components/blog/BlogTOC';
import { BlogCTA } from '../components/blog/BlogCTA';
import { fetchBlogPosts, fetchBlogBySlug } from '../lib/api';

type ApiPost = {
  id: string; slug: string; title: string; excerpt?: string | null; content: string;
  featuredImage?: string | null; author?: string | null; publishedAt?: string | null;
  createdAt?: string; readingTime?: string | null; featured?: boolean;
  category?: { name: string } | null; tags?: Array<{ name: string }>;
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const staticPost = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug]);
  const [remotePost, setRemotePost] = useState<BlogPost | null>(null);
  const [remoteError, setRemoteError] = useState(false);
  const [relatedRemote, setRelatedRemote] = useState<BlogPost[] | null>(null);

  const post = remotePost ?? staticPost;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    // Prefer backend when available; silently fall back to static.
    fetchBlogBySlug(slug)
      .then((json) => {
        if (cancelled) return;
        setRemotePost(mapApiPost(json.data as unknown as ApiPost));
        setRemoteError(false);
      })
      .catch(() => {
        if (!cancelled) setRemoteError(true);
      });
    return () => { cancelled = true; };
  }, [slug]);

  // Try to fetch related from API when we have a remote post — otherwise use static helper.
  useEffect(() => {
    if (!post || remotePost) {
      // For remote we could fetch all published and pick related client-side when API has no dedicated endpoint
      if (remotePost) {
        fetchBlogPosts({ limit: 12 })
          .then((json) => {
            const all = ((json.data as unknown as ApiPost[]) || []).map(mapApiPost);
            const rel = all.filter((p) => p.id !== remotePost.id && (p.category === remotePost.category || p.tags.some((t) => remotePost.tags.includes(t)))).slice(0, 3);
            setRelatedRemote(rel.length ? rel : all.filter((p) => p.id !== remotePost.id).slice(0, 3));
          })
          .catch(() => setRelatedRemote(null));
      }
      return;
    }
    setRelatedRemote(null);
  }, [post, remotePost]);

  useEffect(() => {
    if (!post) return;
    const id = 'blog-article-schema';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.publishedAt,
      mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    });
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [post]);

  if (!post) {
    // While remote is still loading and static also misses, show lightweight skeleton instead of immediate 404
    if (!remoteError && !staticPost && slug) {
      // If neither static nor remote resolved yet, check if we're still waiting on remote
      // For static miss + remote pending, don't flash 404
      const stillLoadingRemote = remotePost === null && !remoteError;
      if (stillLoadingRemote) {
        return (
          <main className="container-bt flex min-h-[50vh] items-center justify-center py-24">
            <p className="text-sm text-espresso-500">Loading article...</p>
          </main>
        );
      }
    }
    return (
      <>
        <SEO title="Article Not Found" description="This article does not exist or may have been moved." path="/blog" />
        <main className="container-bt flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <Reveal>
            <p className="eyebrow justify-center">404</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-espresso-950 sm:text-5xl">Article Not Found</h1>
            <p className="mx-auto mt-4 max-w-md text-espresso-600">
              Looks like this article doesn't exist or may have been moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/blog" withArrow>Back to Blog</Button>
              <Button to="/" variant="ghost">Go Home</Button>
            </div>
          </Reveal>
        </main>
      </>
    );
  }

  const staticRelated = getRelatedPosts(post, 3);
  const relatedFallback = staticRelated.length ? staticRelated : BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  const relatedToShow = relatedRemote ?? relatedFallback;
  const url = `${SITE.url}/blog/${post.slug}`;

  return (
    <>
      <SEO title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />
      <main>
        <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36 bg-cream-50" aria-label="Blog post hero">
          <div aria-hidden className="absolute inset-0 bg-grid-cream mask-fade-y opacity-40" />
          <div className="container-bt relative">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-espresso-500 transition-colors hover:text-espresso-950">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <div className="mt-8 max-w-3xl">
              <Badge tone="coffee">{post.category}</Badge>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-espresso-950 sm:text-4xl lg:text-[2.6rem]">
                {post.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-espresso-600 sm:text-lg">{post.excerpt}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-espresso-500">
                <span className="font-medium text-espresso-700">{post.author}</span>
                <span className="h-1 w-1 rounded-full bg-espresso-950/10" />
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(post.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-espresso-950/10" />
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readingTime}</span>
              </div>

              <div className="mt-6"><BlogShare title={post.title} url={url} /></div>
            </div>
          </div>
        </section>

        <div className="container-bt">
          <div className="overflow-hidden rounded-2xl border border-espresso-950/06 bg-white">
            <img src={post.featuredImage} alt={post.title} className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]" loading="eager" />
          </div>
        </div>

        <section className="container-bt grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <div
              className="prose-blog max-w-none text-[15px] leading-7 text-espresso-700
                [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-espresso-950 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-28
                [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-espresso-950 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28
                [&_p]:mb-5 [&_p]:leading-7
                [&_a]:text-coffee [&_a]:underline [&_a]:decoration-coffee/30 [&_a]:underline-offset-4 hover:[&_a]:text-espresso-950
                [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                [&_li]:text-espresso-700
                [&_blockquote]:border-l-2 [&_blockquote]:border-coffee/40 [&_blockquote]:bg-cream-100 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:rounded-r-xl [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-espresso-800
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-sm
                [&_th]:border [&_th]:border-espresso-950/10 [&_th]:bg-cream-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-espresso-950
                [&_td]:border [&_td]:border-espresso-950/10 [&_td]:px-3 [&_td]:py-2
                [&_code]:rounded [&_code]:bg-cream-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-coffee
                [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-espresso-950/10 [&_pre]:bg-espresso-950/05 [&_pre]:p-4 [&_pre]:my-6
                [&_img]:rounded-xl [&_img]:my-6
                [&_strong]:font-semibold [&_strong]:text-espresso-950"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10 lg:hidden"><BlogShare title={post.title} url={url} /></div>

            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-espresso-950/06 pt-6">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-espresso-950/10 bg-cream-100 px-3 py-1 text-xs text-espresso-600">#{t}</span>
                ))}
              </div>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <BlogTOC content={post.content} />
              <div className="rounded-2xl border border-espresso-950/06 bg-white p-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-400">Share this article</p>
                <div className="mt-4"><BlogShare title={post.title} url={url} /></div>
              </div>
              <div className="rounded-2xl border border-coffee/20 bg-coffee/10 p-5">
                <p className="font-display text-sm font-semibold text-espresso-950">Need help growing?</p>
                <p className="mt-2 text-sm leading-relaxed text-espresso-600">Let's build a smarter strategy for your business.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link to="/contact" className="rounded-full bg-espresso-950 px-5 py-2.5 text-center text-sm font-semibold text-cream-50 transition-colors hover:bg-espresso-900">Let's Talk</Link>
                  <Link to="/services" className="rounded-full border border-espresso-950/10 bg-white px-5 py-2.5 text-center text-sm font-semibold text-espresso-800 transition-colors hover:border-coffee/40 hover:bg-cream-100 hover:text-espresso-950">Explore Services</Link>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {relatedToShow.length > 0 && (
          <section className="border-t border-espresso-950/06 py-14">
            <div className="container-bt">
              <Reveal>
                <h2 className="font-display text-2xl font-semibold text-espresso-950">Related Articles</h2>
                <p className="mt-2 text-sm text-espresso-600">More insights you might find useful.</p>
              </Reveal>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedToShow.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.06}><BlogCard post={p} /></Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <BlogCTA />
      </main>
    </>
  );
}