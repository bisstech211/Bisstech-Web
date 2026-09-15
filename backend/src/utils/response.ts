import type { Response } from 'express';

export function ok(res: Response, data: unknown, message?: string) {
  return res.json({ success: true, data, message });
}
export function created(res: Response, data: unknown, message = 'Created') {
  return res.status(201).json({ success: true, data, message });
}
export function fail(res: Response, status: number, error: string, details?: unknown) {
  return res.status(status).json({ success: false, error, details });
}
export function paginated(res: Response, data: unknown[], total: number, page: number, limit: number) {
  return res.json({ success: true, data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
}
