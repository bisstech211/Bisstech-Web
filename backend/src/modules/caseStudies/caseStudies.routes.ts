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

// ── Recommended case study image spec ─────────────────────────────
// Width: 800 px  Height: 450 px  Aspect ratio: 16:9
// Formats: WebP / AVIF preferred, JPEG/PNG as fallback
// Max recommended file size: 500 KB (soft warning); hard limit 2 MB
export const CASE_STUDY_IMAGE = {
  RECOMMENDED_WIDTH: 800,
  RECOMMENDED_HEIGHT: 450,
  RECOMMENDED_RATIO: 16 / 9,
  RECOMMINED_MAX_BYTES: 500 * 1024,
  HARD_MAX_BYTES: 2 * 1024 * 1024,
  FORMATS: ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
} as const;

// ── Public — Home page consumes this ──────────────────────────────
router.get('/public', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const search = (req.query.search as string)?.toLowerCase();
  const where: Record<string, unknown> = { isPublished: true, status: 'PUBLISHED' };
  if (search) {
    // SQLite doesn't support mode: 'insensitive', use contains with toLowerCase
    where.OR = [
      { title: { contains: search } },
      { client: { contains: search } },
      { industry: { contains: search } },
    ];
  }
  const [data, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where: where as never,
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.caseStudy.count({ where: where as never }),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/public/:slug', async (req, res) => {
  const cs = await prisma.caseStudy.findUnique({
    where: { slug: req.params.slug },
  });
  if (!cs || !cs.isPublished || cs.status !== 'PUBLISHED') return fail(res, 404, 'Not found');
  return ok(res, cs);
});

// ── Admin (protected) ─────────────────────────────────────────────
router.use(requireAuth);

const caseStudySchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric + hyphens'),
  client: z.string().min(2),
  industry: z.string().min(2),
  category: z.string().nullable().optional().or(z.literal('')),
  shortDescription: z.string().nullable().optional().or(z.literal('')),
  services: z.array(z.string()).optional().default([]),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  result: z.string().min(10),
  accent: z.string().optional().default('from-coffee/60 to-espresso-700/40'),
  imageUrl: z.string().nullable().optional().or(z.literal('')),
  imageAlt: z.string().nullable().optional().or(z.literal('')),
  imageWidth: z.number().int().nullable().optional(),
  imageHeight: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
  featured: z.boolean().optional().default(false),
  projectDate: z.string().nullable().optional().or(z.literal('')),
  projectUrl: z.string().url().nullable().optional().or(z.literal('')),
  metrics: z.any().optional().nullable(),
  gallery: z.any().optional().nullable(),
});

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const [data, total] = await Promise.all([
    prisma.caseStudy.findMany({ orderBy: { sortOrder: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.caseStudy.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.get('/:id', async (req, res) => {
  const cs = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
  if (!cs) return fail(res, 404, 'Not found');
  return ok(res, cs);
});

function parseDateSafely(val: unknown): Date | null {
  if (!val || typeof val !== 'string' || val.trim() === '') return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function toJsonStringSafely(val: unknown): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return null;
  }
}

router.post('/', async (req, res) => {
  const parsed = caseStudySchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { services, metrics, gallery, projectDate, projectUrl, category, shortDescription, imageUrl, imageAlt, ...rest } = parsed.data;

  const createData = {
    ...rest,
    category: category && category.trim() !== '' ? category.trim() : null,
    shortDescription: shortDescription && shortDescription.trim() !== '' ? shortDescription.trim() : null,
    imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : null,
    imageAlt: imageAlt && imageAlt.trim() !== '' ? imageAlt.trim() : null,
    projectUrl: projectUrl && projectUrl.trim() !== '' ? projectUrl.trim() : null,
    services: JSON.stringify(services || []),
    metrics: toJsonStringSafely(metrics),
    gallery: toJsonStringSafely(gallery),
    projectDate: parseDateSafely(projectDate),
  };
  const cs = await prisma.caseStudy.create({ data: createData });
  return created(res, cs);
});

router.put('/:id', async (req, res) => {
  const parsed = caseStudySchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const updateData: Record<string, unknown> = { ...parsed.data };

  if (updateData.services !== undefined && Array.isArray(updateData.services)) {
    updateData.services = JSON.stringify(updateData.services);
  }
  if (updateData.metrics !== undefined) {
    updateData.metrics = toJsonStringSafely(updateData.metrics);
  }
  if (updateData.gallery !== undefined) {
    updateData.gallery = toJsonStringSafely(updateData.gallery);
  }
  if (updateData.projectDate !== undefined) {
    updateData.projectDate = parseDateSafely(updateData.projectDate);
  }
  if (updateData.projectUrl !== undefined) {
    updateData.projectUrl = typeof updateData.projectUrl === 'string' && updateData.projectUrl.trim() !== '' ? updateData.projectUrl.trim() : null;
  }
  if (updateData.category !== undefined) {
    updateData.category = typeof updateData.category === 'string' && updateData.category.trim() !== '' ? updateData.category.trim() : null;
  }
  if (updateData.shortDescription !== undefined) {
    updateData.shortDescription = typeof updateData.shortDescription === 'string' && updateData.shortDescription.trim() !== '' ? updateData.shortDescription.trim() : null;
  }
  if (updateData.imageUrl !== undefined) {
    updateData.imageUrl = typeof updateData.imageUrl === 'string' && updateData.imageUrl.trim() !== '' ? updateData.imageUrl.trim() : null;
  }
  if (updateData.imageAlt !== undefined) {
    updateData.imageAlt = typeof updateData.imageAlt === 'string' && updateData.imageAlt.trim() !== '' ? updateData.imageAlt.trim() : null;
  }

  try {
    const cs = await prisma.caseStudy.update({
      where: { id: req.params.id },
      data: updateData as never,
    });
    return ok(res, cs);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Record to update does not exist')) return fail(res, 404, 'Case study not found');
    throw e;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.caseStudy.delete({ where: { id: req.params.id } });
  } catch {
    return fail(res, 404, 'Case study not found');
  }
  return ok(res, null, 'Deleted');
});

// ── Case Study image upload (admin) ───────────────────────────────
const csUploadDir = path.join(process.env.UPLOAD_DIR || './uploads', 'case-studies');
if (!fs.existsSync(csUploadDir)) fs.mkdirSync(csUploadDir, { recursive: true });

const csStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, csUploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});
const csUpload = multer({
  storage: csStorage,
  limits: { fileSize: CASE_STUDY_IMAGE.HARD_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const allowedFormats: string[] = [...CASE_STUDY_IMAGE.FORMATS];
    if (allowedFormats.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed. Use WebP, AVIF, JPEG, PNG, GIF, or SVG.'));
  },
});

router.post('/:id/image', uploadLimiter, csUpload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return fail(res, 400, 'No file uploaded');

  // Use FRONTEND_URL from env for correct URL generation behind proxy
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/case-studies/${file.filename}`;

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
      const targetRatio = CASE_STUDY_IMAGE.RECOMMENDED_RATIO;
      if (Math.abs(ratio - targetRatio) > 0.02) {
        dimensionWarning = `Image aspect ratio is ${width}:${height} (${ratio.toFixed(2)}:1). Recommended is 16:9 (${CASE_STUDY_IMAGE.RECOMMENDED_WIDTH}x${CASE_STUDY_IMAGE.RECOMMENDED_HEIGHT}).`;
      }
      if (width < CASE_STUDY_IMAGE.RECOMMENDED_WIDTH || height < CASE_STUDY_IMAGE.RECOMMENDED_HEIGHT) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `Image is ${width}x${height}px. Recommended minimum is ${CASE_STUDY_IMAGE.RECOMMENDED_WIDTH}x${CASE_STUDY_IMAGE.RECOMMENDED_HEIGHT}px.`;
      }
      if (file.size > CASE_STUDY_IMAGE.RECOMMINED_MAX_BYTES) {
        dimensionWarning = (dimensionWarning ? dimensionWarning + ' ' : '') +
          `File size is ${(file.size / 1024).toFixed(1)} KB. Recommended max is ${CASE_STUDY_IMAGE.RECOMMINED_MAX_BYTES / 1024} KB.`;
      }
    }
  } catch {
    // image-size not installed or failed — skip dimension check
  }

  // Update the case study record with image metadata
  const updated = await prisma.caseStudy.update({
    where: { id: req.params.id },
    data: {
      imageUrl,
      imageAlt: req.body.altText || file.originalname,
      imageWidth: width,
      imageHeight: height,
    },
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

// ── Gallery multi‑image upload (admin) ───────────────────────────────
router.post('/:id/gallery', uploadLimiter, csUpload.array('files', 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return fail(res, 400, 'No files uploaded');
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  const galleryItems = [] as any[];
  for (const file of files) {
    const imageUrl = `${baseUrl}/uploads/case-studies/${file.filename}`;
    let width: number | undefined;
    let height: number | undefined;
    try {
      const imageSize = await import('image-size');
      const dims = imageSize.default(fs.readFileSync(file.path));
      width = dims.width;
      height = dims.height;
    } catch {}
    galleryItems.push({ url: imageUrl, alt: file.originalname, width, height });
  }
  // Merge with existing gallery if any
  const cs = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
  const existing = cs?.gallery ? JSON.parse(cs.gallery as any) : [];
  const newGallery = existing.concat(galleryItems);
  const updated = await prisma.caseStudy.update({
    where: { id: req.params.id },
    data: { gallery: JSON.stringify(newGallery) },
  });
  return ok(res, updated);
});

router.delete('/:id/image', async (req, res) => {
  const cs = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
  if (!cs) return fail(res, 404, 'Case study not found');

  if (cs.imageUrl) {
    const fileName = path.basename(cs.imageUrl);
    const filePath = path.join(csUploadDir, fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  const updated = await prisma.caseStudy.update({
    where: { id: req.params.id },
    data: { imageUrl: null, imageAlt: null, imageWidth: null, imageHeight: null },
  });
  return ok(res, updated);
});

export default router;
