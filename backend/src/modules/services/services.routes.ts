import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();

// Public
router.get('/public', async (_req, res) => {
  const services = await prisma.service.findMany({ where: { isPublished: true }, include: { features: { orderBy: { sortOrder: 'asc' } }, faqs: { orderBy: { sortOrder: 'asc' } } }, orderBy: { sortOrder: 'asc' } });
  return ok(res, services);
});
router.get('/public/:slug', async (req, res) => {
  const s = await prisma.service.findUnique({ where: { slug: req.params.slug }, include: { features: true, faqs: true } });
  if (!s || !s.isPublished) return fail(res, 404, 'Not found');
  return ok(res, s);
});

// Admin
router.use(requireAuth);

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  features: z.array(z.object({ groupTitle: z.string(), items: z.array(z.string()), sortOrder: z.number().optional() })).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string(), sortOrder: z.number().optional() })).optional(),
});

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.service.findMany({ include: { features: true, faqs: true }, orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.service.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/:id', async (req, res) => {
  const s = await prisma.service.findUnique({ where: { id: req.params.id }, include: { features: true, faqs: true } });
  if (!s) return fail(res, 404, 'Not found');
  return ok(res, s);
});

router.post('/', async (req, res) => {
  const p = schema.safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const { features, faqs, ...rest } = p.data;
  const service = await prisma.service.create({
    data: {
      ...rest,
      features: features ? { create: features.map((f) => ({ groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: f.sortOrder ?? 0 })) } : undefined,
      faqs: faqs ? { create: faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 })) } : undefined,
    },
    include: { features: true, faqs: true },
  });
  return created(res, service);
});

router.put('/:id', async (req, res) => {
  const p = schema.partial().safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const { features, faqs, ...rest } = p.data;
  // Replace features/faqs if provided
  if (features) {
    await prisma.serviceFeature.deleteMany({ where: { serviceId: req.params.id } });
  }
  if (faqs) {
    await prisma.serviceFaq.deleteMany({ where: { serviceId: req.params.id } });
  }
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(features ? { features: { create: features.map((f) => ({ groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: f.sortOrder ?? 0 })) } } : {}),
      ...(faqs ? { faqs: { create: faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 })) } } : {}),
    },
    include: { features: true, faqs: true },
  });
  return ok(res, service);
});

router.delete('/:id', async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

export default router;
