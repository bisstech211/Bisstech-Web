import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload } from '../lib/jwt';
import { isTokenBlacklisted } from '../lib/blacklist';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const payload = verifyAccessToken(token);
    // Check blacklist
    const jti = (payload as { jti?: string | number }).jti;
    if (jti) {
      isTokenBlacklisted(String(jti)).then(blacklisted => {
        if (blacklisted) {
          return res.status(401).json({ success: false, error: 'Token revoked' });
        }
        req.user = payload;
        next();
      }).catch(() => {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      });
    } else {
      req.user = payload;
      next();
    }
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  };
}
