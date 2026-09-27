import { Router } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { ok, created, fail, paginated } from '../../utils/response';

const router = Router();

// Stricter upload rate limiter - 10 requests per 15 minutes
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// ── Recommended service card background image spec ────────────────────
// Width: 1600 px  Height: 1200 px  Aspect ratio: 4:3
// Formats: WebP / AVIF preferred, JPEG/PNG as fallback
// Max recommended file size: 500 KB (soft warning); hard limit 2 MB
export const SERVICE_IMAGE = {
  RECOMMENDED_WIDTH: 1600,
  RECOMMENDED_HEIGHT: 1200,
  RECOMMENDED_RATIO: 4 / 3,
  RECOMMINED_MAX_BYTES: 500 * 1024,
  HARD_MAX_BYTES: 2 * 1024 * 1024,
  FORMATS: ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
} as const;

// ── Recommended service section banner image spec ─────────────────────
// Width: 1200 px  Height: 400 px  Aspect ratio: 16:9
// Formats: WebP / AVIF preferred, JPEG/PNG as fallback
// Max recommended file size: 500 KB (soft warning); hard limit 2 MB
export const SERVICE_BANNER_IMAGE = {
  RECOMMENDED_WIDTH: 1200,
  RECOMMENDED_HEIGHT: 400,
  RECOMMENDED_RATIO: 16 / 9,
  RECOMMINED_MAX_BYTES: 500 * 1024,
  HARD_MAX_BYTES: 2 * 1024 * 1024,
  FORMATS: ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
} as const;

const includeFull = {
  features: { orderBy: { sortOrder: 'asc' as const } },
  processes: { orderBy: { sortOrder: 'asc' as const } },
  faqs: { orderBy: { sortOrder: 'asc' as const } },
};

// ── Public — Home + Services page consume the same source ──────────
router.get('/public', async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    include: includeFull,
    orderBy: { sortOrder: 'asc' },
  });
  return ok(res, services);
});

router.get('/public/:slug', async (req, res) => {
  const s = await prisma.service.findUnique({
    where: { slug: req.params.slug },
    include: includeFull,
  });
  if (!s || !s.isPublished) return fail(res, 404, 'Not found');
  return ok(res, s);
});

// ── Admin (protected) ──────────────────────────────────────────────
router.use(requireAuth);

/**
 * Shared schema for create/update.
 * - `number` is derived from sortOrder (01, 02…) on the frontend; not stored separately.
 * - benefits/deliverables/extra are string[] → stored as JSON string on Service.
 * - features: { groupTitle, items: string[], sortOrder? }[]
 * - processes: { step, detail, sortOrder? }[]
 * - faqs: { question, answer, sortOrder? }[]
 */
const featureSchema = z.object({
  groupTitle: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
  sortOrder: z.number().int().optional(),
});
const processSchema = z.object({
  step: z.string().min(1),
  detail: z.string().min(1),
  sortOrder: z.number().int().optional(),
});
const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric + hyphens'),
  shortDesc: z.string().nullable().optional().or(z.literal('')),
  description: z.string().nullable().optional().or(z.literal('')),
  icon: z.string().nullable().optional().or(z.literal('')),
  imageUrl: z.string().nullable().optional().or(z.literal('')),
  backgroundImage: z.string().nullable().optional().or(z.literal('')),
  backgroundImageAlt: z.string().nullable().optional().or(z.literal('')),
  imageWidth: z.number().int().nullable().optional(),
  imageHeight: z.number().int().nullable().optional(),
  bannerImage: z.string().nullable().optional().or(z.literal('')),
  bannerImageAlt: z.string().nullable().optional().or(z.literal('')),
  bannerImageWidth: z.number().int().nullable().optional(),
  bannerImageHeight: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  seoTitle: z.string().nullable().optional().or(z.literal('')),
  seoDescription: z.string().nullable().optional().or(z.literal('')),
  benefits: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  extra: z.array(z.string()).optional(),
  features: z.array(featureSchema).optional(),
  processes: z.array(processSchema).optional(),
  faqs: z.array(faqSchema).optional(),
});

function toJsonArray(arr: string[] | undefined): string | undefined {
  if (arr === undefined) return undefined;
  return JSON.stringify(arr);
}

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.service.findMany({ include: includeFull, orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.service.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/:id', async (req, res) => {
  const s = await prisma.service.findUnique({ where: { id: req.params.id }, include: includeFull });
  if (!s) return fail(res, 404, 'Not found');
  return ok(res, s);
});

router.post('/', async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { features, processes, faqs, benefits, deliverables, extra, ...rest } = parsed.data;

  const service = await prisma.service.create({
    data: {
      ...rest,
      benefits: toJsonArray(benefits),
      deliverables: toJsonArray(deliverables),
      extra: toJsonArray(extra),
      features: features ? { create: features.map((f) => ({ groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: f.sortOrder ?? 0 })) } : undefined,
      processes: processes ? { create: processes.map((p) => ({ step: p.step, detail: p.detail, sortOrder: p.sortOrder ?? 0 })) } : undefined,
      faqs: faqs ? { create: faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 })) } : undefined,
    },
    include: includeFull,
  });
  return created(res, service);
});

router.put('/:id', async (req, res) => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { features, processes, faqs, benefits, deliverables, extra, ...rest } = parsed.data;

  try {
    const service = await prisma.$transaction(async (tx) => {
      if (features !== undefined) await tx.serviceFeature.deleteMany({ where: { serviceId: req.params.id } });
      if (processes !== undefined) await tx.serviceProcess.deleteMany({ where: { serviceId: req.params.id } });
      if (faqs !== undefined) await tx.serviceFaq.deleteMany({ where: { serviceId: req.params.id } });

      return tx.service.update({
        where: { id: req.params.id },
        data: {
          ...rest,
          ...(benefits !== undefined ? { benefits: toJsonArray(benefits) } : {}),
          ...(deliverables !== undefined ? { deliverables: toJsonArray(deliverables) } : {}),
          ...(extra !== undefined ? { extra: toJsonArray(extra) } : {}),
          ...(features !== undefined ? { features: { create: features.map((f) => ({ groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: f.sortOrder ?? 0 })) } } : {}),
          ...(processes !== undefined ? { processes: { create: processes.map((p) => ({ step: p.step, detail: p.detail, sortOrder: p.sortOrder ?? 0 })) } } : {}),
          ...(faqs !== undefined ? { faqs: { create: faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 })) } } : {}),
        },
        include: includeFull,
      });
    });
    return ok(res, service);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Record to update does not exist')) return fail(res, 404, 'Service not found');
    throw e;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
  } catch {
    return fail(res, 404, 'Service not found');
  }
  return ok(res, null, 'Deleted');
});

// ── Service background image upload (admin) ───────────────────────────
// Uses multer to upload directly to /uploads/services/, returns URL + metadata.
// Admin can then set backgroundImage, backgroundImageAlt, imageWidth, imageHeight on the service.
const serviceUploadDir = path.join(process.env.UPLOAD_DIR || './uploads', 'services');
if (!fs.existsSync(serviceUploadDir)) fs.mkdirSync(serviceUploadDir, { recursive: true });

const serviceStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, serviceUploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});
const serviceUpload = multer({
  storage: serviceStorage,
  limits: { fileSize: SERVICE_IMAGE.HARD_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const allowedFormats: string[] = [...SERVICE_IMAGE.FORMATS];
    if (allowedFormats.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed. Use WebP, AVIF, JPEG, PNG, GIF, or SVG.'));
  },
});

router.post('/:id/background-image', uploadLimiter, serviceUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return fail(res, 400, 'No file uploaded');

  // Use FRONTEND_URL from env for correct URL generation behind proxy
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/services/${file.filename}`;

  // Validate dimensions using image-size (if available)
  let width: number | undefined;
  let height: number | undefined;
  let dimensionWarning: string | undefined;

  try {
    const imageSize = await import('image-size');
    const dims = imageSize.default(fs.readFileSync(file.path));
    width = dims.width;
    height = dims.height;

    if (width && height) {
      const ratio = width / height;
      const targetRatio = SERVICE_IMAGE.RECOMMENDED_RATIO;
      if (Math.abs(ratio - targetRatio) > 0.02) {
        dimensionWarning = `Image aspect ratio is ${width}:${height} (${ratio.toFixed(2)}:1). Recommended is 4:3 (${SERVICE_IMAGE.RECOMMENDED_WIDTH}x${SERVICE_IMAGE.RECOMMENDED_HEIGHT}).`;
      }
      if (width < SERVICE_IMAGE.RECOMMENDED_WIDTH || height < SERVICE_IMAGE.RECOMMENDED_HEIGHT) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `Image is ${width}x${height}px. Recommended minimum is ${SERVICE_IMAGE.RECOMMENDED_WIDTH}x${SERVICE_IMAGE.RECOMMENDED_HEIGHT}px.`;
      }
      if (file.size > SERVICE_IMAGE.RECOMMINED_MAX_BYTES) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `File size is ${(file.size / 1024).toFixed(1)} KB. Recommended max is ${SERVICE_IMAGE.RECOMMINED_MAX_BYTES / 1024} KB.`;
      }
    }
  } catch {
    // image-size not installed or failed — skip dimension check
  }

  // Update the service record with image metadata
  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      backgroundImage: imageUrl,
      backgroundImageAlt: req.body.altText || file.originalname,
      imageWidth: width,
      imageHeight: height,
    },
    include: includeFull,
  });

  return ok(res, {
    ...updated,
    imageUpload: {
      url: imageUrl,
      width,
      height,
      size: file.size,
      format: file.mimetype,
      warning: dimensionWarning,
    },
  });
});

router.delete('/:id/background-image', async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return fail(res, 404, 'Service not found');

  if (service.backgroundImage) {
    const fileName = path.basename(service.backgroundImage);
    const filePath = path.join(serviceUploadDir, fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: { backgroundImage: null, backgroundImageAlt: null, imageWidth: null, imageHeight: null },
    include: includeFull,
  });
  return ok(res, updated);
});

// ── Service section banner image upload (admin) ──────────────────────────
// Upload banner image shown when service accordion is expanded (1200x400, 16:9)
const serviceBannerUploadDir = path.join(process.env.UPLOAD_DIR || './uploads', 'services', 'banners');
if (!fs.existsSync(serviceBannerUploadDir)) fs.mkdirSync(serviceBannerUploadDir, { recursive: true });

const serviceBannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, serviceBannerUploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});
const serviceBannerUpload = multer({
  storage: serviceBannerStorage,
  limits: { fileSize: SERVICE_BANNER_IMAGE.HARD_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const allowedFormats: string[] = [...SERVICE_BANNER_IMAGE.FORMATS];
    if (allowedFormats.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed. Use WebP, AVIF, JPEG, PNG, GIF, or SVG.'));
  },
});

router.post('/:id/banner-image', uploadLimiter, serviceBannerUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return fail(res, 400, 'No file uploaded');

  // Use FRONTEND_URL from env for correct URL generation behind proxy
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/services/banners/${file.filename}`;

  // Validate dimensions
  let width: number | undefined;
  let height: number | undefined;
  let dimensionWarning: string | undefined;

  try {
    const imageSize = await import('image-size');
    const dims = imageSize.default(fs.readFileSync(file.path));
    width = dims.width;
    height = dims.height;

    if (width && height) {
      const ratio = width / height;
      const targetRatio = SERVICE_BANNER_IMAGE.RECOMMENDED_RATIO;
      if (Math.abs(ratio - targetRatio) > 0.02) {
        dimensionWarning = `Image aspect ratio is ${width}:${height} (${ratio.toFixed(2)}:1). Recommended is 16:9 (${SERVICE_BANNER_IMAGE.RECOMMENDED_WIDTH}x${SERVICE_BANNER_IMAGE.RECOMMENDED_HEIGHT}).`;
      }
      if (width < SERVICE_BANNER_IMAGE.RECOMMENDED_WIDTH || height < SERVICE_BANNER_IMAGE.RECOMMENDED_HEIGHT) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `Image is ${width}x${height}px. Recommended minimum is ${SERVICE_BANNER_IMAGE.RECOMMENDED_WIDTH}x${SERVICE_BANNER_IMAGE.RECOMMENDED_HEIGHT}px.`;
      }
      if (file.size > SERVICE_BANNER_IMAGE.RECOMMINED_MAX_BYTES) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `File size is ${(file.size / 1024).toFixed(1)} KB. Recommended max is ${SERVICE_BANNER_IMAGE.RECOMMINED_MAX_BYTES / 1024} KB.`;
      }
    }
  } catch {
    // image-size not installed or failed — skip dimension check
  }

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      bannerImage: imageUrl,
      bannerImageAlt: req.body.altText || file.originalname,
      bannerImageWidth: width,
      bannerImageHeight: height,
    },
    include: includeFull,
  });

  return ok(res, {
    ...updated,
    imageUpload: {
      url: imageUrl,
      width,
      height,
      size: file.size,
      format: file.mimetype,
      warning: dimensionWarning,
    },
  });
});

router.delete('/:id/banner-image', async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return fail(res, 404, 'Service not found');

  if (service.bannerImage) {
    const fileName = path.basename(service.bannerImage);
    const filePath = path.join(serviceBannerUploadDir, fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: { bannerImage: null, bannerImageAlt: null, bannerImageWidth: null, bannerImageHeight: null },
    include: includeFull,
  });
  return ok(res, updated);
});

export default router;
