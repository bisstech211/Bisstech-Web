import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, fail } from '../../utils/response';

const router = Router();

// ── Public: site config needed by frontend (no secrets)
router.get('/public', async (_req, res) => {
  const [site, socials, nav, footer, tracking, seo] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'site' } }),
    prisma.socialLinks.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.navigationMenu.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.footerSettings.findUnique({ where: { id: 'footer' } }),
    prisma.trackingSettings.findUnique({ where: { id: 'tracking' } }),
    prisma.seoSettings.findUnique({ where: { id: 'seo' } }),
  ]);
  // Only expose safe tracking IDs (not secrets)
  const safeTracking = tracking ? {
    gaMeasurementId: tracking.gaEnabled ? tracking.gaMeasurementId : null,
    gaEnabled: tracking.gaEnabled,
    gtmContainerId: tracking.gtmEnabled ? tracking.gtmContainerId : null,
    gtmEnabled: tracking.gtmEnabled,
    metaPixelId: tracking.metaPixelEnabled ? tracking.metaPixelId : null,
    metaPixelEnabled: tracking.metaPixelEnabled,
    clarityId: tracking.clarityEnabled ? tracking.clarityId : null,
    clarityEnabled: tracking.clarityEnabled,
    gscVerification: tracking.gscVerification,
  } : null;
  return ok(res, { site, socials, nav, footer, tracking: safeTracking, seo });
});

// Public pages
router.get('/pages/public', async (_req, res) => {
  const pages = await prisma.page.findMany({ where: { isPublished: true }, include: { sections: { where: { isVisible: true }, orderBy: { sortOrder: 'asc' } } } });
  return ok(res, pages);
});
router.get('/pages/public/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug }, include: { sections: { orderBy: { sortOrder: 'asc' } } } });
  if (!page) return fail(res, 404, 'Page not found');
  return ok(res, page);
});

// ── Admin (protected)
router.use(requireAuth);

// Site settings
router.get('/site', async (_req, res) => {
  let site = await prisma.siteSettings.findUnique({ where: { id: 'site' } });
  if (!site) site = await prisma.siteSettings.create({ data: { id: 'site' } });
  return ok(res, site);
});
router.put('/site', async (req: AuthRequest, res) => {
  const schema = z.object({
    siteName: z.string().optional(), tagline: z.string().optional(), description: z.string().optional(),
    logoUrl: z.string().optional().nullable(), faviconUrl: z.string().optional().nullable(),
    contactEmail: z.string().email().optional(), contactPhone: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(), whatsappDisplay: z.string().optional().nullable(),
    address: z.string().optional().nullable(), businessHours: z.string().optional().nullable(),
    mapEmbedUrl: z.string().optional().nullable(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const site = await prisma.siteSettings.upsert({ where: { id: 'site' }, create: { id: 'site', ...parsed.data }, update: parsed.data });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'update', resource: 'siteSettings', ip: req.ip } }).catch(() => {});
  return ok(res, site);
});

// Social links
router.get('/socials', async (_req, res) => ok(res, await prisma.socialLinks.findMany({ orderBy: { sortOrder: 'asc' } })));
router.post('/socials', async (req: AuthRequest, res) => {
  const { platform, url, sortOrder } = req.body as { platform: string; url: string; sortOrder?: number };
  if (!platform || !url) return fail(res, 400, 'platform and url required');
  const s = await prisma.socialLinks.create({ data: { platform, url, sortOrder: sortOrder ?? 0 } });
  return ok(res, s);
});
router.put('/socials/:id', async (req, res) => {
  const s = await prisma.socialLinks.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, s);
});
router.delete('/socials/:id', async (req, res) => {
  await prisma.socialLinks.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Navigation
router.get('/navigation', async (_req, res) => ok(res, await prisma.navigationMenu.findMany({ orderBy: { sortOrder: 'asc' } })));
router.post('/navigation', async (req, res) => {
  const { label, path, sortOrder, parentId, isActive } = req.body as { label: string; path: string; sortOrder?: number; parentId?: string; isActive?: boolean };
  if (!label || !path) return fail(res, 400, 'label and path required');
  const m = await prisma.navigationMenu.create({ data: { label, path, sortOrder: sortOrder ?? 0, parentId: parentId || null, isActive: isActive ?? true } });
  return ok(res, m);
});
router.put('/navigation/:id', async (req, res) => {
  const m = await prisma.navigationMenu.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, m);
});
router.delete('/navigation/:id', async (req, res) => {
  await prisma.navigationMenu.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Footer
router.get('/footer', async (_req, res) => {
  let f = await prisma.footerSettings.findUnique({ where: { id: 'footer' } });
  if (!f) f = await prisma.footerSettings.create({ data: { id: 'footer' } });
  return ok(res, f);
});
router.put('/footer', async (req: AuthRequest, res) => {
  const { description, copyright } = req.body as { description?: string; copyright?: string };
  const f = await prisma.footerSettings.upsert({ where: { id: 'footer' }, create: { id: 'footer', description: description ?? '', copyright: copyright ?? '' }, update: { description, copyright } });
  return ok(res, f);
});

// SEO settings
router.get('/seo', async (_req, res) => {
  let s = await prisma.seoSettings.findUnique({ where: { id: 'seo' } });
  if (!s) s = await prisma.seoSettings.create({ data: { id: 'seo' } });
  return ok(res, s);
});
router.put('/seo', async (req: AuthRequest, res) => {
  const { defaultTitle, defaultDescription, defaultOgImage, robotsTxt, faviconUrl } = req.body as Record<string, string>;
  const s = await prisma.seoSettings.upsert({ where: { id: 'seo' }, create: { id: 'seo', defaultTitle, defaultDescription, defaultOgImage, robotsTxt, faviconUrl }, update: { defaultTitle, defaultDescription, defaultOgImage, robotsTxt, faviconUrl } });
  return ok(res, s);
});

// Tracking
router.get('/tracking', async (_req, res) => {
  let t = await prisma.trackingSettings.findUnique({ where: { id: 'tracking' } });
  if (!t) t = await prisma.trackingSettings.create({ data: { id: 'tracking' } });
  return ok(res, t);
});
router.put('/tracking', async (req: AuthRequest, res) => {
  const data = req.body as Record<string, unknown>;
  const t = await prisma.trackingSettings.upsert({ where: { id: 'tracking' }, create: { id: 'tracking', ...data } as never, update: data as never });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'update', resource: 'trackingSettings', ip: req.ip } }).catch(() => {});
  return ok(res, t);
});

// Redirects
router.get('/redirects', async (_req, res) => ok(res, await prisma.redirect.findMany({ orderBy: { from: 'asc' } })));
router.post('/redirects', async (req, res) => {
  const { from, to, statusCode } = req.body as { from: string; to: string; statusCode?: number };
  if (!from || !to) return fail(res, 400, 'from and to required');
  const r = await prisma.redirect.create({ data: { from, to, statusCode: statusCode ?? 301 } });
  return ok(res, r);
});
router.delete('/redirects/:id', async (req, res) => {
  await prisma.redirect.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Pages & Sections
router.get('/pages', async (_req, res) => ok(res, await prisma.page.findMany({ include: { sections: { orderBy: { sortOrder: 'asc' } } }, orderBy: { slug: 'asc' } })));
router.get('/pages/:id', async (req, res) => {
  const p = await prisma.page.findUnique({ where: { id: req.params.id }, include: { sections: { orderBy: { sortOrder: 'asc' } } } });
  if (!p) return fail(res, 404, 'Not found');
  return ok(res, p);
});
router.post('/pages', async (req, res) => {
  const { slug, title, description, seoTitle, seoDescription, ogImage, canonicalUrl } = req.body as Record<string, string>;
  if (!slug || !title) return fail(res, 400, 'slug and title required');
  const p = await prisma.page.create({ data: { slug, title, description, seoTitle, seoDescription, ogImage, canonicalUrl } });
  return ok(res, p);
});
router.put('/pages/:id', async (req, res) => {
  const p = await prisma.page.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, p);
});
router.delete('/pages/:id', async (req, res) => {
  await prisma.page.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});
// Sections
router.post('/pages/:pageId/sections', async (req, res) => {
  const { key, title, subtitle, content, imageUrl, ctaLabel, ctaLink, sortOrder, isVisible } = req.body as Record<string, unknown>;
  if (!key) return fail(res, 400, 'key required');
  const s = await prisma.pageSection.create({ data: { pageId: req.params.pageId, key: key as string, title: title as string, subtitle: subtitle as string, content: content as string, imageUrl: imageUrl as string, ctaLabel: ctaLabel as string, ctaLink: ctaLink as string, sortOrder: (sortOrder as number) ?? 0, isVisible: (isVisible as boolean) ?? true } });
  return ok(res, s);
});
router.put('/sections/:id', async (req, res) => {
  const s = await prisma.pageSection.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, s);
});
router.delete('/sections/:id', async (req, res) => {
  await prisma.pageSection.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Integrations (generic key-value)
router.get('/integrations', async (_req, res) => ok(res, await prisma.integrationSettings.findMany()));
router.put('/integrations/:provider', async (req: AuthRequest, res) => {
  const { config, isEnabled } = req.body as { config: Record<string, unknown>; isEnabled?: boolean };
  const r = await prisma.integrationSettings.upsert({ where: { provider: req.params.provider }, create: { provider: req.params.provider, config: JSON.stringify(config ?? {}), isEnabled: isEnabled ?? false }, update: { config: JSON.stringify(config ?? {}), isEnabled } });
  return ok(res, r);
});

// Webhooks
router.get('/webhooks', async (_req, res) => ok(res, await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } })));
router.post('/webhooks', async (req, res) => {
  const { url, secret, event } = req.body as { url: string; secret?: string; event: string };
  if (!url || !event) return fail(res, 400, 'url and event required');
  const w = await prisma.webhook.create({ data: { url, secret, event } });
  return ok(res, w);
});
router.delete('/webhooks/:id', async (req, res) => {
  await prisma.webhook.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});
router.get('/webhooks/:id/logs', async (req, res) => {
  const logs = await prisma.webhookLog.findMany({ where: { webhookId: req.params.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  return ok(res, logs);
});

export default router;
