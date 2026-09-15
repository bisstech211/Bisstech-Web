import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { ok, paginated } from '../../utils/response';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 30);
  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.auditLog.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/health', async (_req, res) => {
  let dbOk = true;
  try { await prisma.$queryRaw`SELECT 1`; } catch { dbOk = false; }
  return ok(res, {
    api: 'ok',
    database: dbOk ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
