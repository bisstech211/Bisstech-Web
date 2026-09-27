import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Card component for a Case Study.
 * Expects a caseStudy object as returned from the API (including all new fields).
 */
export function CaseStudyCard({ caseStudy }: { caseStudy: any }) {
  const {
    slug,
    client,
    industry,
    category,
    imageUrl,
    services,
    challenge,
    solution,
    result,
    accent,
  } = caseStudy;

  // services may be a JSON string or an array
  const serviceList: string[] =
    typeof services === 'string'
      ? (() => {
          try {
            return JSON.parse(services);
          } catch {
            return [];
          }
        })()
      : Array.isArray(services)
      ? services
      : [];

  return (
    <Link to={`/case-studies/${slug}`} className="group block">
      <article className="relative flex flex-col overflow-hidden rounded-2xl border border-coffee-600 bg-white transition-shadow hover:shadow-lg hover:border-coffee-800">
        {/* Image header */}
        <div
          className={`relative h-48 overflow-hidden ${imageUrl ? 'bg-cover bg-center' : `bg-gradient-to-br ${accent}`}`}
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        >
          {imageUrl ? (
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 via-coffee-900/30 to-transparent" />
          ) : null}
          <span className="absolute left-4 top-4 rounded-full border border-beige-200 bg-coffee-900/50 px-2 py-0.5 text-xs font-medium text-beige-100">
            {category || industry}
          </span>
          <span className="absolute bottom-4 left-4 text-2xl font-bold text-beige-100">
            {client}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          {/* Services tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {serviceList.map((s) => (
              <span
                key={s}
                className="rounded-full border border-coffee-600 bg-beige-100 px-2 py-0.5 text-xs text-coffee-700"
              >
                {s}
              </span>
            ))}
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium uppercase text-xs text-coffee-600">Challenge</dt>
              <dd className="mt-0.5 text-gray-700">{challenge}</dd>
            </div>
            <div>
              <dt className="font-medium uppercase text-xs text-coffee-600">Solution</dt>
              <dd className="mt-0.5 text-gray-700">{solution}</dd>
            </div>
            <div>
              <dt className="font-medium uppercase text-xs text-coffee-600">Result</dt>
              <dd className="mt-0.5 text-gray-800 font-semibold">{result}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t pt-2 text-sm">
            <span className="text-gray-500">{client}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-coffee-600 text-beige-100 transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
