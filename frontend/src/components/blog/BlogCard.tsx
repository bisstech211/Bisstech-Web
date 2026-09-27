import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, type BlogPost } from '../../data/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-espresso-950/06 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-coffee/20 hover:shadow-card-light-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-espresso-900">
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
        />
        <div className="absolute left-3 top-3">
          <Badge tone="default" className="backdrop-blur-md text-[11px]">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[17px] font-semibold leading-snug text-espresso-950 line-clamp-2 transition-colors group-hover:text-coffee">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-espresso-600">{post.excerpt}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-espresso-400">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-espresso-950/10" />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-espresso-950/06 pt-4">
          <span className="text-xs font-medium text-espresso-400">{post.author}</span>
          <span className="text-xs font-semibold tracking-widest text-coffee transition-colors group-hover:text-espresso-950">
            READ →
          </span>
        </div>
      </div>
    </Link>
  );
}