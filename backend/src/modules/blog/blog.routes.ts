import { Router } from 'express';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();

// Initialize DOMPurify with JSDOM for server-side sanitization
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// ── Public: list published posts
router.get('/public', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const search = (req.query.search as string)?.toLowerCase();
  const category = req.query.category as string;
  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (category && category !== 'All') {
    const cat = await prisma.blogCategory.findUnique({ where: { name: category } });
    if (cat) (where as Record<string, unknown>).categoryId = cat.id;
    else { return paginated(res, [], 0, page, limit); }
  }
  let posts = await prisma.blogPost.findMany({
    where: where as never,
    include: { category: true, tags: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    skip: (page - 1) * limit,
    take: limit,
  });
  let total = await prisma.blogPost.count({ where: where as never });
  if (search) {
    const q = search;
    posts = posts.filter((p) => `${p.title} ${p.excerpt ?? ''} ${p.category?.name ?? ''} ${p.tags.map((t) => t.name).join(' ')}`.toLowerCase().includes(q));
    total = posts.length;
  }
  return paginated(res, posts, total, page, limit);
});

router.get('/public/:slug', async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug }, include: { category: true, tags: true } });
  if (!post || post.status !== 'PUBLISHED') return fail(res, 404, 'Post not found');
  // increment view
  prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  return ok(res, post);
});

router.get('/public-categories', async (_req, res) => {
  const cats = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  return ok(res, cats);
});

// ── Admin: CRUD (protected)
const upsertSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().nullable().optional().or(z.literal('')),
  content: z.string().min(10),
  featuredImage: z.string().nullable().optional().or(z.literal('')),
  author: z.string().nullable().optional().or(z.literal('')),
  categoryId: z.string().nullable().optional().or(z.literal('')),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().nullable().optional().or(z.literal('')),
  seoDescription: z.string().nullable().optional().or(z.literal('')),
  ogImage: z.string().nullable().optional().or(z.literal('')),
  canonicalUrl: z.string().nullable().optional().or(z.literal('')),
  readingTime: z.string().nullable().optional().or(z.literal('')),
  publishedAt: z.string().nullable().optional().or(z.literal('')),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const search = (req.query.search as string)?.trim();
  const status = req.query.status as string;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) where.title = { contains: search } as unknown;
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({ where: where as never, include: { category: true, tags: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.blogPost.count({ where: where as never }),
  ]);
  return paginated(res, posts, total, page, limit);
});

router.get('/:id', async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id }, include: { category: true, tags: true } });
  if (!post) return fail(res, 404, 'Not found');
  return ok(res, post);
});

router.post('/', async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const d = parsed.data;
  // Sanitize HTML content to prevent XSS
  const sanitizedContent = purify.sanitize(d.content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel'],
    ALLOW_DATA_ATTR: true,
  });
  let parsedPublishedAt: Date | null = null;
  if (d.publishedAt && typeof d.publishedAt === 'string' && d.publishedAt.trim() !== '') {
    const dt = new Date(d.publishedAt);
    if (!isNaN(dt.getTime())) parsedPublishedAt = dt;
  } else if (d.status === 'PUBLISHED') {
    parsedPublishedAt = new Date();
  }

  const post = await prisma.blogPost.create({
    data: {
      title: d.title, slug: d.slug, excerpt: d.excerpt || null, content: sanitizedContent,
      featuredImage: d.featuredImage || null, author: d.author ?? 'BISSTECH Team',
      categoryId: d.categoryId || null,
      status: (d.status as never) ?? 'DRAFT',
      featured: d.featured ?? false,
      seoTitle: d.seoTitle || null, seoDescription: d.seoDescription || null, ogImage: d.ogImage || null,
      canonicalUrl: d.canonicalUrl || null, readingTime: d.readingTime || null,
      publishedAt: parsedPublishedAt,
      tags: d.tagIds?.length ? { connect: d.tagIds.map((id) => ({ id })) } : undefined,
    },
    include: { category: true, tags: true },
  });
  return created(res, post);
});

router.put('/:id', async (req, res) => {
  const parsed = upsertSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const d = parsed.data;
  const data: Record<string, unknown> = { ...d };
  // Sanitize HTML content if provided
  if (d.content !== undefined) {
    data.content = purify.sanitize(d.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel'],
      ALLOW_DATA_ATTR: true,
    });
  }
  if (d.tagIds) { (data as Record<string, unknown>).tags = { set: d.tagIds.map((id) => ({ id })) }; delete (data as Record<string, unknown>).tagIds; }
  if (d.publishedAt !== undefined) {
    if (d.publishedAt && typeof d.publishedAt === 'string' && d.publishedAt.trim() !== '') {
      const dt = new Date(d.publishedAt);
      data.publishedAt = isNaN(dt.getTime()) ? null : dt;
    } else {
      data.publishedAt = null;
    }
  }
  const post = await prisma.blogPost.update({ where: { id: req.params.id }, data: data as never, include: { category: true, tags: true } });
  return ok(res, post);
});

router.delete('/:id', async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Categories & Tags admin
router.get('/categories/all', async (_req, res) => {
  const cats = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  return ok(res, cats);
});
router.post('/categories', async (req, res) => {
  const { name, slug } = req.body as { name: string; slug: string };
  if (!name || !slug) return fail(res, 400, 'name and slug required');
  const cat = await prisma.blogCategory.create({ data: { name, slug } });
  return created(res, cat);
});
router.delete('/categories/:id', async (req, res) => {
  await prisma.blogCategory.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

router.get('/tags/all', async (_req, res) => {
  const tags = await prisma.blogTag.findMany({ orderBy: { name: 'asc' } });
  return ok(res, tags);
});
router.post('/tags', async (req, res) => {
  const { name, slug } = req.body as { name: string; slug: string };
  if (!name || !slug) return fail(res, 400, 'name and slug required');
  const tag = await prisma.blogTag.create({ data: { name, slug } });
  return created(res, tag);
});
router.delete('/tags/:id', async (req, res) => {
  await prisma.blogTag.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

export default router;
