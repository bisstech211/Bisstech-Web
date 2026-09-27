import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Reveal } from '../ui/Reveal';
import { formatDate, type BlogPost } from '../../data/blog';

export function FeaturedBlog({ post }: { post: BlogPost }) {
  return (
    <Reveal>
      <Link
        to={`/blog/${post.slug}`}
        className="group relative grid overflow-hidden rounded-3xl border border-espresso-950/08 bg-white transition-all duration-500 hover:border-coffee/25 hover:shadow-card-light-hover lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-coffee/15 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {/* Image */}
        <div className="relative aspect-[16/11] overflow-hidden bg-espresso-900 lg:aspect-auto lg:min-h-[380px]">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge tone="coffee">Featured</Badge>
            <Badge tone="default" className="backdrop-blur">
              {post.category}
            </Badge>
          </div>
        </div>
        {/* Copy */}
        <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
          <h3 className="font-display text-2xl font-semibold leading-tight text-espresso-950 transition-colors group-hover:text-coffee sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-espresso-600 sm:text-[15px]">
            {post.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-espresso-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="h-1 w-1 rounded-full bg-espresso-950/10" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
            <span className="h-1 w-1 rounded-full bg-espresso-950/10" />
            <span>{post.author}</span>
          </div>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-semibold text-coffee transition-colors group-hover:text-espresso-950">
            Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}