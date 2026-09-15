import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, fail } from '../../utils/response';

const router = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) return fail(res, 401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return fail(res, 401, 'Invalid credentials');

  const payload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Audit
  prisma.auditLog.create({ data: { userId: user.id, action: 'login', resource: 'auth', ip: req.ip } }).catch(() => {});

  return ok(res, {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return fail(res, 400, 'Missing refresh token');
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) return fail(res, 401, 'User not found or inactive');
    const newPayload = { userId: user.id, role: user.role, email: user.email };
    return ok(res, { accessToken: signAccessToken(newPayload) });
  } catch {
    return fail(res, 401, 'Invalid refresh token');
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { id: true, email: true, name: true, role: true, isActive: true } });
  if (!user) return fail(res, 404, 'User not found');
  return ok(res, user);
});

router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ currentPassword: z.string(), newPassword: z.string().min(8) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return fail(res, 404, 'User not found');
  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return fail(res, 401, 'Current password incorrect');
  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  return ok(res, null, 'Password updated');
});

export default router;
