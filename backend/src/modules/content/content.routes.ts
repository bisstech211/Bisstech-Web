import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

export const contentRouter = Router();

// ── Public ───────────────────────────────────────────────────
contentRouter.get('/projects/public', async (_req, res) => {
  const data = await prisma.project.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
  return ok(res, data);
});
contentRouter.get('/testimonials/public', async (_req, res) => {
  const data = await prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
  return ok(res, data);
});
contentRouter.get('/team/public', async (_req, res) => {
  const data = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  return ok(res, data);
});
contentRouter.get('/faqs/public', async (_req, res) => {
  const data = await prisma.faq.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
  return ok(res, data);
});

// ── Admin ────────────────────────────────────────────────────
contentRouter.use(requireAuth);

// Projects
const projectSchema = z.object({ title: z.string().min(2), slug: z.string().regex(/^[a-z0-9-]+$/), description: z.string().optional(), imageUrl: z.string().optional(), link: z.string().optional(), category: z.string().optional(), sortOrder: z.number().optional(), isPublished: z.boolean().optional() });
contentRouter.get('/projects', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.project.findMany({ orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.project.count(),
  ]);
  return paginated(res, data, total, page, limit);
});
contentRouter.post('/projects', async (req: AuthRequest, res) => {
  const p = projectSchema.safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const proj = await prisma.project.create({ data: p.data });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'create', resource: 'project', resourceId: proj.id, ip: req.ip } }).catch(() => {});
  return created(res, proj);
});
contentRouter.put('/projects/:id', async (req, res) => {
  const p = projectSchema.partial().safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const proj = await prisma.project.update({ where: { id: req.params.id }, data: p.data });
  return ok(res, proj);
});
contentRouter.delete('/projects/:id', async (req: AuthRequest, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'delete', resource: 'project', resourceId: req.params.id, ip: req.ip } }).catch(() => {});
  return ok(res, null, 'Deleted');
});

// Testimonials
const testiSchema = z.object({ name: z.string().min(2), role: z.string().optional(), company: z.string().optional(), content: z.string().min(5), avatarUrl: z.string().optional(), rating: z.number().min(1).max(5).optional(), sortOrder: z.number().optional(), isPublished: z.boolean().optional() });
contentRouter.get('/testimonials', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.testimonial.count(),
  ]);
  return paginated(res, data, total, page, limit);
});
contentRouter.post('/testimonials', async (req: AuthRequest, res) => {
  const p = testiSchema.safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const t = await prisma.testimonial.create({ data: p.data as never });
  return created(res, t);
});
contentRouter.put('/testimonials/:id', async (req, res) => {
  const p = testiSchema.partial().safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: p.data as never });
  return ok(res, t);
});
contentRouter.delete('/testimonials/:id', async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// Team
const teamSchema = z.object({ name: z.string().min(2), role: z.string().min(2), bio: z.string().optional(), avatarUrl: z.string().optional(), sortOrder: z.number().optional(), isActive: z.boolean().optional() });
contentRouter.get('/team', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.teamMember.count(),
  ]);
  return paginated(res, data, total, page, limit);
});
contentRouter.post('/team', async (req, res) => {
  const p = teamSchema.safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const m = await prisma.teamMember.create({ data: p.data });
  return created(res, m);
});
contentRouter.put('/team/:id', async (req, res) => {
  const p = teamSchema.partial().safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const m = await prisma.teamMember.update({ where: { id: req.params.id }, data: p.data });
  return ok(res, m);
});
contentRouter.delete('/team/:id', async (req, res) => {
  await prisma.teamMember.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

// FAQs
const faqSchema = z.object({ question: z.string().min(5), answer: z.string().min(5), sortOrder: z.number().optional(), isPublished: z.boolean().optional() });
contentRouter.get('/faqs', async (req, res) => {
  const [data, total] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.faq.count(),
  ]);
  return paginated(res, data, total, 1, 100);
});
contentRouter.post('/faqs', async (req, res) => {
  const p = faqSchema.safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const f = await prisma.faq.create({ data: p.data });
  return created(res, f);
});
contentRouter.put('/faqs/:id', async (req, res) => {
  const p = faqSchema.partial().safeParse(req.body);
  if (!p.success) return fail(res, 400, 'Validation error', p.error.flatten());
  const f = await prisma.faq.update({ where: { id: req.params.id }, data: p.data });
  return ok(res, f);
});
contentRouter.delete('/faqs/:id', async (req, res) => {
  await prisma.faq.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

export default contentRouter;
