import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { ok, fail, paginated } from '../../utils/response';

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || './uploads'; // Allow optional folder query param for organized storage
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // Allow optional folder via query param (e.g., ?folder=logos)
    const allowed = ['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','application/pdf'];
    // Some clients may send generic application/octet-stream; fallback to extension check
    const ext = require('path').extname(file.originalname).toLowerCase();
    const extMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };
    const inferred = extMap[ext] || '';
    const mime = file.mimetype === 'application/octet-stream' ? inferred : file.mimetype;
    if (allowed.includes(mime)) cb(null, true);
    else cb(new Error('File type not allowed: ' + file.mimetype));
  },
});

// Public: get media list (optional)
router.get('/public', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 24);
  const [data, total] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.media.count(),
  ]);
  return paginated(res, data, total, page, limit);
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 24);
  const search = (req.query.search as string)?.trim();
  const where: Record<string, unknown> = {};
  if (search) where.originalName = { contains: search } as unknown;
  const [data, total] = await Promise.all([
    prisma.media.findMany({ where: where as never, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.media.count({ where: where as never }),
  ]);
  return paginated(res, data, total, page, limit);
});

router.post('/upload', upload.array('files', 10), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) return fail(res, 400, 'No files uploaded');
  // Use FRONTEND_URL from env for correct URL generation behind proxy
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  const records = await Promise.all(files.map((f) =>
    prisma.media.create({
      data: {
        filename: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        url: `${baseUrl}/uploads/${f.filename}`,
        folder: (req.body.folder as string) || 'general',
      },
    })
  ));
  return ok(res, records);
});

router.patch('/:id', async (req, res) => {
  const { altText, caption, folder } = req.body as { altText?: string; caption?: string; folder?: string };
  const m = await prisma.media.update({ where: { id: req.params.id }, data: { altText, caption, folder } });
  return ok(res, m);
});

router.delete('/:id', async (req, res) => {
  const m = await prisma.media.findUnique({ where: { id: req.params.id } });
  if (!m) return fail(res, 404, 'Not found');
  const filePath = path.join(uploadDir, m.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await prisma.media.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Deleted');
});

export default router;
