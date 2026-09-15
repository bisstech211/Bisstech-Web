import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, type BlogPost } from '../../data/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-electric/20 hover:bg-white/[0.04] hover:shadow-glow"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
        />
        <div className="absolute left-3 top-3">
          <Badge tone="electric" className="backdrop-blur-md text-[11px]">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[17px] font-semibold leading-snug text-white line-clamp-2 transition-colors group-hover:text-electric-200">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cloud-400">{post.excerpt}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-cloud-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-xs font-medium text-cloud-400">{post.author}</span>
          <span className="text-xs font-semibold tracking-widest text-electric transition-colors group-hover:text-electric-300">
            READ →
          </span>
        </div>
      </div>
    </Link>
  );
}
