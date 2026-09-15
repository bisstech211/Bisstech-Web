import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  const status = (err as { status?: number })?.status || 500;
  res.status(status).json({ success: false, error: message });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: 'Not found' });
}
