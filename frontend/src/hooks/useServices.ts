import { useEffect, useState } from 'react';
import { SERVICES, type Service, type SubServiceGroup } from '../data/services';
import { fetchServices } from '../lib/api';
import { TrendingUp, Code2, ShoppingBag, BrainCircuit, PenTool, Sparkles, Megaphone, BarChart3, Wrench, Palette, Smartphone, type LucideIcon } from 'lucide-react';

/**
 * Single source of truth: GET /api/v1/services/public.
 * Used by Home (ServicesSection + 3D), Services page, Footer, Contact.
 * Falls back to static SERVICES when backend is offline/empty so the site never breaks.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Code2, ShoppingBag, BrainCircuit, PenTool, Sparkles, Megaphone, BarChart3, Wrench, Palette, Smartphone,
  trendingup: TrendingUp, code2: Code2, shoppingbag: ShoppingBag, braincircuit: BrainCircuit, pentool: PenTool,
  sparkles: Sparkles, megaphone: Megaphone, barchart3: BarChart3, wrench: Wrench, palette: Palette, smartphone: Smartphone,
};

export type ApiService = {
  id: string;
  slug: string;
  title: string;
  shortDesc?: string | null;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  backgroundImage?: string | null;
  backgroundImageAlt?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  bannerImage?: string | null;
  bannerImageAlt?: string | null;
  bannerImageWidth?: number | null;
  bannerImageHeight?: number | null;
  sortOrder: number;
  isPublished: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  benefits?: string | null; // JSON string[]
  deliverables?: string | null;
  extra?: string | null;
  features: Array<{ id: string; groupTitle: string; items: string; sortOrder: number }>;
  processes: Array<{ id: string; step: string; detail: string; sortOrder: number }>;
  faqs: Array<{ id: string; question: string; answer: string; sortOrder: number }>;
};

function parseJsonArray(raw: string | null | undefined, fallback: string[]): string[] {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : fallback;
  } catch {
    return fallback;
  }
}

function parseFeatureItems(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [String(raw)];
  } catch {
    return raw ? [raw] : [];
  }
}

export function mapApiService(s: ApiService, idx: number): Service {
  const fallback = SERVICES[idx] ?? SERVICES[0];
  const iconKey = (s.icon || '').trim();
  const icon = ICON_MAP[iconKey] ?? ICON_MAP[iconKey.toLowerCase()] ?? fallback.icon;

  let groups: SubServiceGroup[] = fallback.groups;
  if (s.features.length) {
    groups = [...s.features]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((f) => ({ title: f.groupTitle, items: parseFeatureItems(f.items) }));
  }

  const benefits = s.benefits !== null && s.benefits !== undefined
    ? parseJsonArray(s.benefits, fallback.benefits)
    : fallback.benefits;
  const deliverables = s.deliverables !== null && s.deliverables !== undefined
    ? parseJsonArray(s.deliverables, fallback.deliverables)
    : fallback.deliverables;
  const extra = s.extra !== null && s.extra !== undefined
    ? parseJsonArray(s.extra, fallback.extra ?? [])
    : fallback.extra;
  const process = s.processes.length
    ? [...s.processes].sort((a, b) => a.sortOrder - b.sortOrder).map((p) => ({ step: p.step, detail: p.detail }))
    : fallback.process;

  return {
    id: s.slug,
    number: String(idx + 1).padStart(2, '0'),
    title: s.title,
    short: s.shortDesc || fallback.short,
    description: s.description || fallback.description,
    icon,
    groups,
    extra: extra?.length ? extra : undefined,
    benefits,
    deliverables,
    process,
    _api: s, // keep raw for detail pages that need slug/id/seo etc.
    backgroundImage: s.backgroundImage || fallback.backgroundImage,
    backgroundImageAlt: s.backgroundImageAlt || fallback.backgroundImageAlt,
    imageWidth: s.imageWidth ?? fallback.imageWidth,
    imageHeight: s.imageHeight ?? fallback.imageHeight,
    bannerImage: s.bannerImage || '',
    bannerImageAlt: s.bannerImageAlt || '',
    bannerImageWidth: s.bannerImageWidth ?? null,
    bannerImageHeight: s.bannerImageHeight ?? null,
  };
}

export function useServices() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchServices()
      .then((json) => {
        if (cancelled) return;
        const data = json.data as unknown as ApiService[] || [];
        if (data.length) setServices(data.map((s, i) => mapApiService(s, i)));
        else setServices(SERVICES);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setServices(SERVICES);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { services: services ?? SERVICES, loading, error, isFallback: services === null || services === SERVICES };
}
