import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const anyErr = err as { code?: string; status?: number; statusCode?: number; message?: string };
  // Prisma P2025: record not found -> 404
  if (anyErr?.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }
  if (anyErr?.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Duplicate entry' });
  }
  // Multer file type / size
  if (anyErr?.message === 'File type not allowed') {
    return res.status(400).json({ success: false, error: 'File type not allowed' });
  }
  if (anyErr?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'File too large (max 10MB)' });
  }
  if (anyErr?.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, error: 'Unexpected field — use "files" as the form field name' });
  }
  const status = anyErr?.status || anyErr?.statusCode || 500;
  const message = anyErr?.message || 'Internal server error';
  // Don't leak stack in production
  res.status(status).json({ success: false, error: message });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: 'Not found' });
}
