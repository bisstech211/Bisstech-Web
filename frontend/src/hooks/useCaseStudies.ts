import { useEffect, useState } from 'react';
import { fetchCaseStudies, fetchCaseStudyBySlug } from '../lib/api';

type CaseStudyRaw = {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  category?: string;
  shortDescription?: string;
  services: string;
  challenge: string;
  solution: string;
  result: string;
  accent: string;
  imageUrl: string | null;
  imageAlt: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  sortOrder?: number;
  isPublished?: boolean;
  status?: string; // DRAFT / PUBLISHED
  featured?: boolean;
  projectDate?: string; // ISO string
  projectUrl?: string;
  metrics?: any;
  gallery?: any;
};

type CaseStudy = Omit<CaseStudyRaw, 'services'> & {
  services: string[];
};

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function parseJsonMeta(raw: any): any {
  if (!raw) return undefined;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return raw;
  }
}

let cached: CaseStudy[] | null = null;
let fetched = false;

export function useCaseStudies() {
  const [data, setData] = useState<CaseStudy[] | null>(cached);

  useEffect(() => {
    if (fetched) return;
    fetched = true;
    fetchCaseStudies()
      .then((res) => {
        const processed: CaseStudy[] = (res.data as CaseStudyRaw[]).map(cs => ({
          id: cs.id,
          slug: cs.slug,
          title: cs.title,
          client: cs.client,
          industry: cs.industry,
          category: cs.category,
          shortDescription: cs.shortDescription,
          services: parseJsonArray(cs.services),
          challenge: cs.challenge,
          solution: cs.solution,
          result: cs.result,
          accent: cs.accent,
          imageUrl: cs.imageUrl,
          imageAlt: cs.imageAlt,
          imageWidth: cs.imageWidth,
          imageHeight: cs.imageHeight,
          sortOrder: cs.sortOrder,
          isPublished: cs.isPublished,
          status: cs.status,
          featured: cs.featured,
          projectDate: cs.projectDate,
          projectUrl: cs.projectUrl,
          metrics: parseJsonMeta(cs.metrics),
          gallery: parseJsonMeta(cs.gallery),
        }));
        cached = processed;
        setData(processed);
      })
      .catch(() => {
        // backend unavailable — keep static defaults
      });
  }, []);

  return { data, fetchCaseStudyBySlug };
}