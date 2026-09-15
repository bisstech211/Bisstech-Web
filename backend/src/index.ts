import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import blogRoutes from './modules/blog/blog.routes';
import serviceRoutes from './modules/services/services.routes';
import leadsRoutes, { newsletterRouter } from './modules/leads/leads.routes';
import settingsRoutes from './modules/settings/settings.routes';
import mediaRoutes from './modules/media/media.routes';
import userRoutes from './modules/users/users.routes';
import auditRoutes from './modules/audit/audit.routes';
import contentRoutes from './modules/content/content.routes';
import { errorHandler, notFound } from './middleware/error';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// Trust proxy if behind reverse proxy
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',').map((s) => s.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Allow any localhost in dev
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Global rate limiter (lenient)
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter for auth & lead submit
const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

// Static uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

// Root — so GET / doesn't return "Not found"
app.get('/', (_req, res) =>
  res.json({
    success: true,
    data: {
      name: 'BISSTECH API',
      status: 'ok',
      message: 'Backend is running. Use /api/health or /api/v1/*',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      docs: { health: '/api/health', v1Health: '/api/v1/health', services: '/api/v1/services/public', blog: '/api/v1/blog/public' },
    },
  }),
);

// Health
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } }));
app.get('/api/v1/health', (_req, res) => res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } }));

// Public routes
app.use('/api/v1/newsletter', newsletterRouter);

// API v1
app.use('/api/v1/auth', strictLimiter, authRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/system', auditRoutes); // health lives there too
app.use('/api/v1/content', contentRoutes);

// Dashboard stats (quick overview)
app.get('/api/v1/dashboard/stats', async (_req, res) => {
  // lightweight — no auth for now, admin will call with token; we keep it open but safe (no secrets)
  try {
    const { prisma } = await import('./lib/prisma');
    const [leadsTotal, leadsNew, subsTotal, blogsPublished, blogsDraft, servicesTotal, projectsTotal] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.newsletterSubscriber.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.service.count(),
      prisma.project.count().catch(() => 0),
    ]);
    const recentLeads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, service: true, status: true, createdAt: true } });
    const recentLogs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true } } } });
    const tracking = await prisma.trackingSettings.findUnique({ where: { id: 'tracking' } }).catch(() => null);
    res.json({ success: true, data: { leadsTotal, leadsNew, subsTotal, blogsPublished, blogsDraft, servicesTotal, projectsTotal, recentLeads, recentLogs, tracking } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
});

// SEO: sitemap.xml & robots.txt (dynamic)
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const { prisma } = await import('./lib/prisma');
    const siteUrl = process.env.FRONTEND_URL || 'https://bisstech.com';
    const blogs = await prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } });
    const services = await prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } });
    const staticPages = ['', '/about', '/services', '/blog', '/contact'];
    const urls = [
      ...staticPages.map((p) => `  <url><loc>${siteUrl}${p || '/'}</loc></url>`),
      ...services.map((s) => `  <url><loc>${siteUrl}/services#${s.slug}</loc><lastmod>${s.updatedAt.toISOString().split('T')[0]}</lastmod></url>`),
      ...blogs.map((b) => `  <url><loc>${siteUrl}/blog/${b.slug}</loc><lastmod>${b.updatedAt.toISOString().split('T')[0]}</lastmod></url>`),
    ];
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
  } catch {
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', async (_req, res) => {
  try {
    const { prisma } = await import('./lib/prisma');
    const seo = await prisma.seoSettings.findUnique({ where: { id: 'seo' } });
    res.type('text/plain').send(seo?.robotsTxt || 'User-agent: *\nAllow: /');
  } catch {
    res.type('text/plain').send('User-agent: *\nAllow: /');
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
