// Central API client for frontend → backend communication.
// Falls back gracefully when the backend is unavailable (static data remains).

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4000';

export const API_BASE = `${BASE}/api/v1`;

type ApiOk<T> = { success: true; data: T; pagination?: { total: number; page: number; limit: number; pages: number } };
type ApiErr = { success: false; error: string };

async function request<T>(path: string, init?: RequestInit): Promise<ApiOk<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const json = (await res.json()) as ApiOk<T> & ApiErr;
  if (!res.ok || (json as ApiErr).success === false) {
    throw new Error((json as ApiErr).error || `Request failed: ${res.status}`);
  }
  return json as ApiOk<T>;
}

// Public blog
export function fetchBlogPosts(params: { page?: number; limit?: number; search?: string; category?: string } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.search) q.set('search', params.search);
  if (params.category) q.set('category', params.category);
  const suffix = q.toString() ? `?${q}` : '';
  return request<unknown[]>(`/blog/public${suffix}`);
}

export function fetchBlogBySlug(slug: string) {
  return request<unknown>(`/blog/public/${encodeURIComponent(slug)}`);
}

export function fetchBlogCategories() {
  return request<Array<{ id: string; name: string; slug: string }>>('/blog/public-categories');
}

// Public services
export function fetchServices() {
  return request<unknown[]>('/services/public');
}

// Public site settings (safe tracking only)
export function fetchSiteSettings() {
  return request<{
    site: Record<string, unknown> | null;
    socials: Array<{ platform: string; url: string }>;
    nav: Array<{ label: string; path: string; sortOrder: number }>;
    footer: { description: string; copyright: string } | null;
    tracking: { gaMeasurementId: string | null; gaEnabled: boolean; gtmContainerId: string | null; gtmEnabled: boolean; metaPixelId: string | null; metaPixelEnabled: boolean; clarityId: string | null; clarityEnabled: boolean; gscVerification: string | null } | null;
    seo: Record<string, unknown> | null;
  }>('/settings/public');
}

// Public content (portfolio etc.)
export function fetchProjects() { return request<unknown[]>('/content/projects/public'); }
export function fetchTestimonials() { return request<unknown[]>('/content/testimonials/public'); }
export function fetchTeam() { return request<unknown[]>('/content/team/public'); }
export function fetchFaqs() { return request<unknown[]>('/content/faqs/public'); }

// Leads / contact
export function submitLead(payload: Record<string, unknown>) {
  return request<{ id: string }>('/leads/submit', { method: 'POST', body: JSON.stringify(payload) });
}

export function subscribeNewsletter(email: string) {
  return request<unknown>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
}
