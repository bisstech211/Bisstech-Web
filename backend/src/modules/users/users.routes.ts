import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, requireRole, type AuthRequest } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();
router.use(requireAuth);
router.use(requireRole('SUPER_ADMIN', 'ADMIN'));

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.user.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

const createSchema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(2), role: z.enum(['SUPER_ADMIN','ADMIN','EDITOR','MARKETING','SUPPORT']).optional() });

router.post('/', async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { email, password, name, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return fail(res, 409, 'Email already exists');
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email: email.toLowerCase(), passwordHash: hash, name, role: role ?? 'EDITOR' }, select: { id: true, email: true, name: true, role: true, isActive: true } });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'create', resource: 'user', resourceId: user.id, ip: req.ip } }).catch(() => {});
  return created(res, user);
});

router.patch('/:id', async (req: AuthRequest, res) => {
  const { name, role, isActive } = req.body as { name?: string; role?: string; isActive?: boolean };
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { name, role: role as never, isActive }, select: { id: true, email: true, name: true, role: true, isActive: true } });
  return ok(res, user);
});

router.post('/:id/reset-password', async (req: AuthRequest, res) => {
  const { password } = req.body as { password?: string };
  if (!password || password.length < 8) return fail(res, 400, 'Password must be at least 8 chars');
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: hash } });
  return ok(res, null, 'Password reset');
});

router.delete('/:id', async (req: AuthRequest, res) => {
  if (req.params.id === req.user!.userId) return fail(res, 400, 'Cannot delete yourself');
  await prisma.user.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

export default router;
