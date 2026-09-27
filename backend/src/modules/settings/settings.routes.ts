import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, fail } from '../../utils/response';

const router = Router();

// Public: site config needed by frontend (no secrets)
router.get('/public', async (_req, res) => {
  const [site, socials, nav, footer, tracking, seo, branding, header, button, textHover, linkHover, cardHover, footerAppearance, footerHover, bottomSectionHover, socialSettings, colors, typography, animation] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'site' } }),
    prisma.socialLinks.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.navigationMenu.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.footerSettings.findUnique({ where: { id: 'footer' } }),
    prisma.trackingSettings.findUnique({ where: { id: 'tracking' } }),
    prisma.seoSettings.findUnique({ where: { id: 'seo' } }),
    prisma.brandingSettings.findUnique({ where: { id: 'branding' } }),
    prisma.headerSettings.findUnique({ where: { id: 'header' } }),
    prisma.buttonSettings.findUnique({ where: { id: 'button' } }),
    prisma.textHoverSettings.findUnique({ where: { id: 'textHover' } }),
    prisma.linkHoverSettings.findUnique({ where: { id: 'linkHover' } }),
    prisma.cardHoverSettings.findUnique({ where: { id: 'cardHover' } }),
    prisma.footerAppearanceSettings.findUnique({ where: { id: 'footerAppearance' } }),
    prisma.footerHoverSettings.findUnique({ where: { id: 'footerHover' } }),
    prisma.bottomSectionHoverSettings.findUnique({ where: { id: 'bottomSectionHover' } }),
    prisma.socialSettings.findMany({ orderBy: { order: 'asc' } }),
    prisma.colorSettings.findUnique({ where: { id: 'colors' } }),
    prisma.typographySettings.findUnique({ where: { id: 'typography' } }),
    prisma.animationSettings.findUnique({ where: { id: 'animation' } }),
  ]);
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
  return ok(res, { site, socials, nav, footer, tracking: safeTracking, seo, branding, header, button, textHover, linkHover, cardHover, footerAppearance, footerHover, bottomSectionHover, socialSettings, colors, typography, animation });
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

// Site & General settings
router.get(['/site', '/general'], async (_req, res) => {
  let site = await prisma.siteSettings.findUnique({ where: { id: 'site' } });
  if (!site) site = await prisma.siteSettings.create({ data: { id: 'site' } });
  return ok(res, site);
});
router.put(['/site', '/general'], async (req: AuthRequest, res) => {
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

// Footer (legacy)
router.get('/footer/legacy', async (_req, res) => {
  let f = await prisma.footerSettings.findUnique({ where: { id: 'footer' } });
  if (!f) f = await prisma.footerSettings.create({ data: { id: 'footer' } });
  return ok(res, f);
});
router.put('/footer/legacy', async (req: AuthRequest, res) => {
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

// ── New Website Appearance Settings (protected)
const categoryModelMap: Record<string, string> = {
  general: 'siteSettings',
  site: 'siteSettings',
  branding: 'brandingSettings',
  header: 'headerSettings',
  button: 'buttonSettings',
  textHover: 'textHoverSettings',
  linkHover: 'linkHoverSettings',
  cardHover: 'cardHoverSettings',
  footer: 'footerAppearanceSettings',
  footerAppearance: 'footerAppearanceSettings',
  footerHover: 'footerHoverSettings',
  bottomSectionHover: 'bottomSectionHoverSettings',
  social: 'socialSettings',
  colors: 'colorSettings',
  typography: 'typographySettings',
  animation: 'animationSettings',
};

const defaultSettings: Record<string, Record<string, unknown>> = {
  site: {
    id: 'site',
    siteName: 'BISSTECH',
    tagline: 'Build. Grow. Automate.',
    description: 'BISSTECH is a global digital growth, technology, AI & creative agency.',
    contactEmail: 'info.bisstech@gmail.com',
    whatsapp: 'https://wa.me/918597029133',
    whatsappDisplay: '+91 8597 029133',
    logoUrl: null,
    faviconUrl: null,
    contactPhone: null,
    address: null,
    businessHours: null,
    mapEmbedUrl: null,
  },
  general: {
    id: 'site',
    siteName: 'BISSTECH',
    tagline: 'Build. Grow. Automate.',
    description: 'BISSTECH is a global digital growth, technology, AI & creative agency.',
    contactEmail: 'info.bisstech@gmail.com',
    whatsapp: 'https://wa.me/918597029133',
    whatsappDisplay: '+91 8597 029133',
    logoUrl: null,
    faviconUrl: null,
    contactPhone: null,
    address: null,
    businessHours: null,
    mapEmbedUrl: null,
  },
  branding: {
    id: 'branding',
    logoUrl: null,
    mobileLogoUrl: null,
    darkLogoUrl: null,
    faviconUrl: null,
    logoWidth: JSON.stringify({ desktop: 140, tablet: 120, mobile: 100 }),
    logoHeight: JSON.stringify({ desktop: 36, tablet: 32, mobile: 28 }),
  },
  header: {
    id: 'header',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backgroundOpacity: 0.95,
    blur: 20,
    borderColor: 'rgba(61, 43, 31, 0.1)',
    borderWidth: 1,
    shadow: '0 4px 30px rgba(61, 43, 31, 0.08)',
    height: JSON.stringify({ desktop: 72, tablet: 68, mobile: 64 }),
    navFontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
    navFontWeight: '500',
    navSpacing: JSON.stringify({ desktop: 32, tablet: 24, mobile: 16 }),
    navHoverColor: '#6f4e37',
    navActiveColor: '#1a1a1a',
    navUnderline: true,
    navUnderlineThickness: 1,
    navUnderlineSpeed: 0.3,
    buttonText: 'Start a Project',
    buttonBgColor: '#6f4e37',
    buttonHoverBg: '#3d2b1f',
  },
  button: {
    id: 'button',
    variant: 'primary',
    bgColor: '#6f4e37',
    textColor: '#ffffff',
    borderColor: '#6f4e37',
    borderWidth: 0,
    borderRadius: 9999,
    padding: JSON.stringify({ desktop: '16px 32px', tablet: '14px 28px', mobile: '12px 24px' }),
    fontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
    fontWeight: '600',
    hoverBgColor: '#3d2b1f',
    hoverTextColor: '#ffffff',
    hoverBorderColor: '#3d2b1f',
    hoverScale: 1.02,
    hoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    transitionDuration: 0.3,
  },
  textHover: {
    id: 'textHover',
    effectType: 'color',
    color: '#6f4e37',
    opacity: 0.9,
    underline: false,
    underlineThickness: 2,
    underlineOffset: 4,
    letterSpacing: 0,
    transform: 'none',
    scale: 1,
    glow: 'none',
    shadow: 'none',
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  linkHover: {
    id: 'linkHover',
    effectType: 'color',
    color: '#1a1a1a',
    hoverColor: '#6f4e37',
    underline: true,
    underlineThickness: 2,
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  cardHover: {
    id: 'cardHover',
    effectType: 'lift',
    scale: 1.02,
    translateY: -8,
    shadow: '0 20px 40px rgba(61, 43, 31, 0.15)',
    borderColor: 'rgba(111, 78, 55, 0.2)',
    backgroundChange: 'rgba(111, 78, 55, 0.05)',
    glow: 'none',
    imageZoom: 1.05,
    overlayOpacity: 0.05,
    borderRadius: 16,
    transitionDuration: 0.4,
    easing: 'ease-out',
  },
  footerAppearance: {
    id: 'footerAppearance',
    logoUrl: null,
    description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.',
    backgroundColor: '#fafafa',
    textColor: '#4a4a4a',
    headingColor: '#1a1a1a',
    linkColor: '#4a4a4a',
    linkHoverColor: '#6f4e37',
    borderColor: 'rgba(61, 43, 31, 0.1)',
    borderWidth: 1,
    spacing: JSON.stringify({ desktop: 64, tablet: 48, mobile: 32 }),
    padding: JSON.stringify({ desktop: 80, tablet: 60, mobile: 40 }),
    columnSpacing: JSON.stringify({ desktop: 48, tablet: 32, mobile: 24 }),
    copyrightText: '© 2025 BISSTECH. All rights reserved.',
    ctaText: 'Start a Project',
    ctaLink: '/contact',
  },
  footer: {
    id: 'footerAppearance',
    logoUrl: null,
    description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.',
    backgroundColor: '#fafafa',
    textColor: '#4a4a4a',
    headingColor: '#1a1a1a',
    linkColor: '#4a4a4a',
    linkHoverColor: '#6f4e37',
    borderColor: 'rgba(61, 43, 31, 0.1)',
    borderWidth: 1,
    spacing: JSON.stringify({ desktop: 64, tablet: 48, mobile: 32 }),
    padding: JSON.stringify({ desktop: 80, tablet: 60, mobile: 40 }),
    columnSpacing: JSON.stringify({ desktop: 48, tablet: 32, mobile: 24 }),
    copyrightText: '© 2025 BISSTECH. All rights reserved.',
    ctaText: 'Start a Project',
    ctaLink: '/contact',
  },
  footerHover: {
    id: 'footerHover',
    effectType: 'color',
    hoverColor: '#6f4e37',
    underline: true,
    underlineThickness: 2,
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  social: {
    id: 'social',
    platform: 'instagram',
    url: 'https://instagram.com/bisstech',
    isEnabled: true,
    order: 0,
    iconSize: 20,
    color: '#4a4a4a',
    hoverColor: '#6f4e37',
    background: 'transparent',
    hoverBackground: 'rgba(111, 78, 55, 0.1)',
    borderRadius: 12,
    hoverScale: 1.1,
    hoverRotation: 0,
    hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)',
  },
  colors: {
    id: 'colors',
    primary: '#6f4e37',
    secondary: '#a08d7a',
    accent: '#c9a962',
    background: '#ffffff',
    surface: '#fafafa',
    heading: '#1a1a1a',
    body: '#3d2b1f',
    muted: '#8a7d6e',
    border: 'rgba(61, 43, 31, 0.1)',
    button: '#6f4e37',
    buttonHover: '#3d2b1f',
    buttonText: '#ffffff',
    buttonHoverText: '#ffffff',
    link: '#6f4e37',
    linkHover: '#a08d7a',
    footerBackground: '#fafafa',
    footerText: '#4a4a4a',
    footerHeading: '#1a1a1a',
    footerLink: '#4a4a4a',
    footerLinkHover: '#6f4e37',
    headerBackground: 'rgba(255, 255, 255, 0.95)',
    headerText: '#1a1a1a',
    headerLinkHover: '#6f4e37',
    bottomSectionBackground: '#f5f5f5',
  },
  typography: {
    id: 'typography',
    primaryFont: 'Inter, system-ui, sans-serif',
    headingFont: 'Montserrat, Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '700',
    bodyWeight: '400',
    baseSize: 16,
    h1Size: 48,
    h2Size: 36,
    h3Size: 24,
    paragraphSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  animation: {
    id: 'animation',
    enableHover: true,
    hoverSpeed: 0.3,
    intensity: 1,
    reducedMotion: false,
  },
  bottomSectionHover: {
    id: 'bottomSectionHover',

    // Hero CTA Buttons (woven-light-hero.tsx)
    heroCtaPrimaryBg: '#6f4e37',
    heroCtaPrimaryHoverBg: '#3d2b1f',
    heroCtaPrimaryText: '#ffffff',
    heroCtaPrimaryHoverText: '#ffffff',
    heroCtaPrimaryBorder: '#6f4e37',
    heroCtaPrimaryHoverBorder: '#3d2b1f',
    heroCtaPrimaryShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    heroCtaPrimaryHoverShadow: '0 12px 35px rgba(61, 43, 31, 0.4)',
    heroCtaPrimaryScale: 1.02,
    heroCtaPrimaryTransition: 0.3,

    heroCtaSecondaryBg: 'transparent',
    heroCtaSecondaryHoverBg: '#6f4e37',
    heroCtaSecondaryText: '#6f4e37',
    heroCtaSecondaryHoverText: '#ffffff',
    heroCtaSecondaryBorder: '#6f4e37',
    heroCtaSecondaryHoverBorder: '#6f4e37',
    heroCtaSecondaryShadow: 'none',
    heroCtaSecondaryHoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    heroCtaSecondaryScale: 1.02,
    heroCtaSecondaryTransition: 0.3,

    // CTA Section Buttons (CTASection.tsx)
    ctaSectionPrimaryBg: '#2b2118',
    ctaSectionPrimaryHoverBg: '#1a1611',
    ctaSectionPrimaryText: '#fafafa',
    ctaSectionPrimaryHoverText: '#fafafa',
    ctaSectionPrimaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    ctaSectionPrimaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    ctaSectionPrimaryScale: 1.0,
    ctaSectionPrimaryTransition: 0.3,
    ctaSectionPrimaryArrowTranslateX: 4,

    ctaSectionSecondaryBg: '#ffffff',
    ctaSectionSecondaryHoverBg: '#f5f5f5',
    ctaSectionSecondaryText: '#3d2b1f',
    ctaSectionSecondaryHoverText: '#1a1a1a',
    ctaSectionSecondaryBorder: 'rgba(111, 78, 55, 0.1)',
    ctaSectionSecondaryHoverBorder: '#6f4e37',
    ctaSectionSecondaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    ctaSectionSecondaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    ctaSectionSecondaryScale: 1.0,
    ctaSectionSecondaryTransition: 0.3,

    // Service Cards (ServicesSection.tsx)
    serviceCardBg: '#ffffff',
    serviceCardHoverBg: '#ffffff',
    serviceCardBorderColor: 'rgba(111, 78, 55, 0.06)',
    serviceCardHoverBorderColor: '#6f4e37',
    serviceCardShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    serviceCardHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    serviceCardTranslateY: -4,
    serviceCardScale: 1.0,
    serviceCardImageZoom: 1.05,
    serviceCardImageTransition: 0.7,
    serviceCardBorderWidth: 1,
    serviceCardHoverBorderWidth: 1,
    serviceCardBottomBarHeight: 2,
    serviceCardBottomBarColor: '#6f4e37',
    serviceCardBottomBarTransition: 0.5,
    serviceCardIconBg: 'rgba(111, 78, 55, 0.1)',
    serviceCardIconHoverBg: '#6f4e37',
    serviceCardIconText: '#6f4e37',
    serviceCardIconHoverText: '#fafafa',
    serviceCardIconScale: 1.0,
    serviceCardIconTransition: 0.5,
    serviceCardExploreTextColor: '#8a7d6e',
    serviceCardExploreHoverTextColor: '#6f4e37',
    serviceCardArrowColor: '#8a7d6e',
    serviceCardArrowHoverColor: '#6f4e37',
    serviceCardArrowTranslateX: 4,
    serviceCardArrowTranslateY: -4,
    serviceCardArrowTransition: 0.3,

    // Footer Branding (Footer.tsx)
    footerLogoHoverOpacity: 0.8,
    footerLogoHoverScale: 1.02,
    footerLogoTransition: 0.3,
    footerEmailColor: '#6f4e37',
    footerEmailHoverColor: '#3d2b1f',
    footerEmailUnderline: true,
    footerEmailUnderlineThickness: 1,
    footerEmailTransition: 0.2,

    // Footer Navigation Links
    footerNavLinkColor: '#4a4a4a',
    footerNavLinkHoverColor: '#6f4e37',
    footerNavLinkUnderline: false,
    footerNavLinkUnderlineThickness: 2,
    footerNavLinkUnderlineOffset: 4,
    footerNavLinkTransition: 0.2,
    footerNavLinkEasing: 'ease-out',

    // Footer Services Links
    footerServiceLinkColor: '#4a4a4a',
    footerServiceLinkHoverColor: '#6f4e37',
    footerServiceLinkUnderline: false,
    footerServiceLinkUnderlineThickness: 2,
    footerServiceLinkUnderlineOffset: 4,
    footerServiceLinkTransition: 0.2,
    footerServiceLinkEasing: 'ease-out',

    // Footer Social Icons
    footerSocialIconSize: 20,
    footerSocialIconColor: '#4a4a4a',
    footerSocialIconHoverColor: '#6f4e37',
    footerSocialIconBg: 'transparent',
    footerSocialIconHoverBg: 'rgba(111, 78, 55, 0.1)',
    footerSocialIconBorderRadius: 12,
    footerSocialIconScale: 1.1,
    footerSocialIconRotation: 0,
    footerSocialIconShadow: 'none',
    footerSocialIconHoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)',
    footerSocialIconTransition: 0.3,

    // Footer CTA Button
    footerCtaBg: '#6f4e37',
    footerCtaHoverBg: '#3d2b1f',
    footerCtaText: '#ffffff',
    footerCtaHoverText: '#ffffff',
    footerCtaShadow: '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)',
    footerCtaHoverShadow: '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)',
    footerCtaScale: 1.0,
    footerCtaArrowTranslateX: 4,
    footerCtaArrowTranslateY: -4,
    footerCtaTransition: 0.3,

    // Copyright Bar Links
    copyrightLinkColor: '#4a4a4a',
    copyrightLinkHoverColor: '#6f4e37',
    copyrightLinkUnderline: false,
    copyrightLinkUnderlineThickness: 1,
    copyrightLinkUnderlineOffset: 3,
    copyrightLinkTransition: 0.2,
    copyrightLinkEasing: 'ease-out',

    // Bottom Decorative Text (Watermark)
    watermarkColor: 'rgba(111, 78, 55, 0.05)',
    watermarkHoverColor: 'rgba(111, 78, 55, 0.15)',
    watermarkScale: 1.0,
    watermarkTransition: 0.5,
    watermarkOpacity: 1.0,
  },
};

function getModel(category: string) {
  const modelName = categoryModelMap[category];
  if (!modelName) return null;
  return (prisma as unknown as Record<string, unknown>)[modelName];
}

function getCategoryRecordId(category: string): string {
  if (category === 'general' || category === 'site') return 'site';
  if (category === 'footer' || category === 'footerAppearance') return 'footerAppearance';
  return category;
}

// Admin: POST social platform
router.post('/social', async (req: AuthRequest, res) => {
  const { platform, url, isEnabled, order, ...rest } = req.body;
  if (!platform) return fail(res, 400, 'platform required');
  const plat = String(platform).toLowerCase();
  const id = req.body.id || `social-${plat}`;
  const s = await prisma.socialSettings.upsert({
    where: { id },
    create: { id, platform: plat, url: url || '', isEnabled: isEnabled ?? true, order: Number(order) || 0, ...rest },
    update: { platform: plat, url: url || '', isEnabled: isEnabled ?? true, order: Number(order) || 0, ...rest },
  });
  return ok(res, s);
});

// Admin: GET single category
router.get('/:category', async (req, res) => {
  if (req.params.category === 'social') {
    const list = await prisma.socialSettings.findMany({ orderBy: { order: 'asc' } });
    return ok(res, list);
  }
  const model = getModel(req.params.category);
  if (!model) return fail(res, 404, 'Category not found');
  const recordId = getCategoryRecordId(req.params.category);
  let data = await (model as { findUnique: (args: { where: { id: string } }) => Promise<unknown> }).findUnique({ where: { id: recordId } });
  if (!data) {
    const defaults = defaultSettings[req.params.category] || defaultSettings[recordId] || { id: recordId };
    data = await (model as { create: (args: { data: Record<string, unknown> }) => Promise<unknown> }).create({ data: defaults });
  }
  return ok(res, data);
});

// Admin: PUT single category
router.put('/:category', async (req: AuthRequest, res) => {
  if (req.params.category === 'social') {
    if (Array.isArray(req.body)) {
      for (const item of req.body) {
        if (!item || !item.platform) continue;
        const plat = String(item.platform).toLowerCase();
        const id = item.id || `social-${plat}`;
        const { id: _ignore, ...itemData } = item;
        await prisma.socialSettings.upsert({
          where: { id },
          create: { id, ...itemData, platform: plat },
          update: { ...itemData, platform: plat },
        });
      }
      const all = await prisma.socialSettings.findMany({ orderBy: { order: 'asc' } });
      return ok(res, all);
    } else if (req.body && req.body.platform) {
      const plat = String(req.body.platform).toLowerCase();
      const id = req.body.id || `social-${plat}`;
      const { id: _ignore, ...itemData } = req.body;
      const item = await prisma.socialSettings.upsert({
        where: { id },
        create: { id, ...itemData, platform: plat },
        update: { ...itemData, platform: plat },
      });
      return ok(res, item);
    }
  }

  const model = getModel(req.params.category);
  if (!model) return fail(res, 404, 'Category not found');
  const recordId = getCategoryRecordId(req.params.category);
  const { id: _ignoreId, ...bodyData } = req.body;
  const data = await (model as { upsert: (args: { where: { id: string }; create: Record<string, unknown>; update: Record<string, unknown> }) => Promise<unknown> }).upsert({
    where: { id: recordId },
    create: { id: recordId, ...bodyData },
    update: bodyData,
  });

  // If footer appearance was updated, sync description and copyright to legacy footerSettings
  if (req.params.category === 'footer' || req.params.category === 'footerAppearance') {
    const desc = req.body.description;
    const cpr = req.body.copyrightText || req.body.copyright;
    if (desc !== undefined || cpr !== undefined) {
      await prisma.footerSettings.upsert({
        where: { id: 'footer' },
        create: { id: 'footer', description: desc || '', copyright: cpr || '' },
        update: { ...(desc !== undefined ? { description: desc } : {}), ...(cpr !== undefined ? { copyright: cpr } : {}) },
      }).catch(() => {});
    }
  }

  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'update', resource: req.params.category + 'Settings', ip: req.ip } }).catch(() => {});
  return ok(res, data);
});

// Admin: Reset single category to defaults
router.post('/:category/reset', async (req: AuthRequest, res) => {
  if (req.params.category === 'social') {
    await prisma.socialSettings.deleteMany({});
    const defaultSocials = [
      { id: 'social-instagram', platform: 'instagram', url: 'https://www.instagram.com/bisstech', isEnabled: true, order: 0, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
      { id: 'social-linkedin', platform: 'linkedin', url: 'https://www.linkedin.com/company/bisstech', isEnabled: true, order: 1, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
      { id: 'social-facebook', platform: 'facebook', url: 'https://www.facebook.com/bisstech', isEnabled: true, order: 2, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
      { id: 'social-youtube', platform: 'youtube', url: 'https://www.youtube.com/@bisstech', isEnabled: true, order: 3, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
      { id: 'social-twitter', platform: 'twitter', url: 'https://twitter.com/bisstech', isEnabled: true, order: 4, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
    ];
    for (const s of defaultSocials) {
      await prisma.socialSettings.create({ data: s });
    }
    const all = await prisma.socialSettings.findMany({ orderBy: { order: 'asc' } });
    return ok(res, all);
  }

  const model = getModel(req.params.category);
  if (!model) return fail(res, 404, 'Category not found');
  const recordId = getCategoryRecordId(req.params.category);
  const defaults = defaultSettings[req.params.category] || defaultSettings[recordId];
  if (!defaults) return fail(res, 404, 'No defaults defined for this category');
  const data = await (model as { upsert: (args: { where: { id: string }; create: Record<string, unknown>; update: Record<string, unknown> }) => Promise<unknown> }).upsert({
    where: { id: recordId },
    create: defaults,
    update: defaults,
  });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'reset', resource: req.params.category + 'Settings', ip: req.ip } }).catch(() => {});
  return ok(res, data);
});

export default router;
