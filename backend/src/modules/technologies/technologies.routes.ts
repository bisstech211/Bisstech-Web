import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();

// ── Public endpoints ───────────────────────────────────────────────────
// Get all active technology categories with their items
router.get('/public', async (_req, res) => {
  const categories = await prisma.technologyCategory.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  return ok(res, categories);
});

// Get all featured technology items across categories
router.get('/public/featured', async (_req, res) => {
  const items = await prisma.technologyItem.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  return ok(res, items);
});

// Get single category by slug with items
router.get('/public/:slug', async (req, res) => {
  const category = await prisma.technologyCategory.findUnique({
    where: { slug: req.params.slug },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  if (!category || !category.isActive) return fail(res, 404, 'Category not found');
  return ok(res, category);
});

// ── Admin endpoints (protected) ───────────────────────────────────────
router.use(requireAuth);

// Technology Categories
router.get('/categories', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.technologyCategory.findMany({
      include: {
        items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.technologyCategory.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/categories/:id', async (req, res) => {
  const category = await prisma.technologyCategory.findUnique({
    where: { id: req.params.id },
    include: {
      items: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!category) return fail(res, 404, 'Category not found');
  return ok(res, category);
});

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric + hyphens'),
  description: z.string().optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

router.post('/categories', async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());

  const category = await prisma.technologyCategory.create({
    data: {
      ...parsed.data,
      sortOrder: parsed.data.sortOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
    },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });
  await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'create', resource: 'technologyCategory', resourceId: category.id, ip: req.ip } }).catch(() => {});
  return created(res, category);
});

router.put('/categories/:id', async (req, res) => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());

  try {
    const category = await prisma.technologyCategory.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'update', resource: 'technologyCategory', resourceId: category.id, ip: req.ip } }).catch(() => {});
    return ok(res, category);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Record to update does not exist')) return fail(res, 404, 'Category not found');
    throw e;
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.technologyCategory.delete({ where: { id: req.params.id } });
    await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'delete', resource: 'technologyCategory', resourceId: req.params.id, ip: req.ip } }).catch(() => {});
    return ok(res, null, 'Deleted');
  } catch {
    return fail(res, 404, 'Category not found');
  }
});

// Technology Items
router.get('/items', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const categoryId = req.query.categoryId as string | undefined;

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;

  const [data, total] = await Promise.all([
    prisma.technologyItem.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.technologyItem.count({ where }),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/items/:id', async (req, res) => {
  const item = await prisma.technologyItem.findUnique({
    where: { id: req.params.id },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  if (!item) return fail(res, 404, 'Item not found');
  return ok(res, item);
});

const itemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric + hyphens'),
  description: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')).nullable(),
  logoAlt: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')).nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

router.post('/items', async (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());

  // Verify category exists
  const category = await prisma.technologyCategory.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return fail(res, 400, 'Category not found');

  const item = await prisma.technologyItem.create({
    data: {
      ...parsed.data,
      sortOrder: parsed.data.sortOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
      isFeatured: parsed.data.isFeatured ?? false,
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'create', resource: 'technologyItem', resourceId: item.id, ip: req.ip } }).catch(() => {});
  return created(res, item);
});

router.put('/items/:id', async (req, res) => {
  const parsed = itemSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());

  // If categoryId is being changed, verify it exists
  if (parsed.data.categoryId) {
    const category = await prisma.technologyCategory.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) return fail(res, 400, 'Category not found');
  }

  try {
    const item = await prisma.technologyItem.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'update', resource: 'technologyItem', resourceId: item.id, ip: req.ip } }).catch(() => {});
    return ok(res, item);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Record to update does not exist')) return fail(res, 404, 'Item not found');
    throw e;
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    await prisma.technologyItem.delete({ where: { id: req.params.id } });
    await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'delete', resource: 'technologyItem', resourceId: req.params.id, ip: req.ip } }).catch(() => {});
    return ok(res, null, 'Deleted');
  } catch {
    return fail(res, 404, 'Item not found');
  }
});

// Reorder categories
router.put('/categories/reorder', async (req, res) => {
  const { orderedIds } = req.body as { orderedIds: string[] };
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return fail(res, 400, 'orderedIds array required');
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.technologyCategory.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'reorder', resource: 'technologyCategory', ip: req.ip } }).catch(() => {});
  return ok(res, { message: 'Categories reordered' });
});

// Reorder items within a category
router.put('/items/reorder', async (req, res) => {
  const { categoryId, orderedIds } = req.body as { categoryId: string; orderedIds: string[] };
  if (!categoryId || !Array.isArray(orderedIds) || orderedIds.length === 0) {
    return fail(res, 400, 'categoryId and orderedIds array required');
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.technologyItem.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  await prisma.auditLog.create({ data: { userId: (req as AuthRequest).user!.userId, action: 'reorder', resource: 'technologyItem', ip: req.ip } }).catch(() => {});
  return ok(res, { message: 'Items reordered' });
});

export default router;