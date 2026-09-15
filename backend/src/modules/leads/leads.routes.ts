import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();

// ── Public: submit lead
const submitSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  landingPage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
  // honeypot
  website: z.string().optional(),
});

router.post('/submit', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  if (parsed.data.website) return ok(res, null, 'Received'); // honeypot filled → silently accept
  const d = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      name: d.name, email: d.email.toLowerCase(), phone: d.phone, company: d.company,
      service: d.service, budget: d.budget, message: d.message,
      source: d.source, landingPage: d.landingPage,
      utmSource: d.utmSource, utmMedium: d.utmMedium, utmCampaign: d.utmCampaign,
      utmTerm: d.utmTerm, utmContent: d.utmContent, referrer: d.referrer,
    },
  });

  // Fire webhooks async (best effort)
  prisma.webhook.findMany({ where: { event: 'lead.created', isActive: true } }).then((hooks) => {
    for (const h of hooks) {
      fetch(h.url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(h.secret ? { 'X-Webhook-Secret': h.secret } : {}) }, body: JSON.stringify({ event: 'lead.created', lead }) })
        .then(async (r) => {
          const text = await r.text().catch(() => '');
          prisma.webhookLog.create({ data: { webhookId: h.id, event: 'lead.created', payload: JSON.stringify(lead), statusCode: r.status, response: text.slice(0, 2000), success: r.ok } }).catch(() => {});
        })
        .catch(() => {
          prisma.webhookLog.create({ data: { webhookId: h.id, event: 'lead.created', payload: JSON.stringify(lead), success: false } }).catch(() => {});
        });
    }
  }).catch(() => {});

  return created(res, { id: lead.id }, 'Lead received');
});

// ── Admin ──
router.use(requireAuth);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const search = (req.query.search as string)?.trim();
  const status = req.query.status as string;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { company: { contains: search } }];
  const [data, total] = await Promise.all([
    prisma.lead.findMany({ where: where as never, include: { assignedTo: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.lead.count({ where: where as never }),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/:id', async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id }, include: { assignedTo: true } });
  if (!lead) return fail(res, 404, 'Not found');
  return ok(res, lead);
});

router.patch('/:id', async (req: AuthRequest, res) => {
  const schema = z.object({ status: z.enum(['NEW','CONTACTED','QUALIFIED','PROPOSAL','WON','LOST','SPAM']).optional(), notes: z.string().optional(), assignedToId: z.string().optional().nullable(), followUpAt: z.string().optional().nullable() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const data: Record<string, unknown> = {};
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
  if (parsed.data.assignedToId !== undefined) data.assignedToId = parsed.data.assignedToId || null;
  if (parsed.data.followUpAt !== undefined) data.followUpAt = parsed.data.followUpAt ? new Date(parsed.data.followUpAt) : null;
  const lead = await prisma.lead.update({ where: { id: req.params.id }, data: data as never });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'update', resource: 'lead', resourceId: lead.id, metadata: JSON.stringify({ status: data.status }), ip: req.ip } }).catch(() => {});
  return ok(res, lead);
});

router.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: req.user!.userId, action: 'delete', resource: 'lead', resourceId: req.params.id, ip: req.ip } }).catch(() => {});
  return ok(res, null, 'Deleted');
});

// Newsletter
router.get('/newsletter/subscribers', async (req, res) => {
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  return ok(res, subs);
});

export default router;

// Public newsletter subscribe (no auth) — mounted separately
export const newsletterRouter = Router();
newsletterRouter.post('/subscribe', async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'Valid email required');
  try {
    const sub = await prisma.newsletterSubscriber.create({ data: { email: email.toLowerCase() } });
    // webhook
    prisma.webhook.findMany({ where: { event: 'subscriber.created', isActive: true } }).then((hooks) => {
      for (const h of hooks) fetch(h.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'subscriber.created', email: sub.email }) }).catch(() => {});
    }).catch(() => {});
    return created(res, sub, 'Subscribed');
  } catch {
    return fail(res, 409, 'Already subscribed');
  }
});
newsletterRouter.post('/unsubscribe', async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return fail(res, 400, 'Email required');
  await prisma.newsletterSubscriber.update({ where: { email: email.toLowerCase() }, data: { status: 'unsubscribed' } }).catch(() => {});
  return ok(res, null, 'Unsubscribed');
});
