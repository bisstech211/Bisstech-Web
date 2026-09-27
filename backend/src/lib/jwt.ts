import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('[AUTH] JWT_SECRET and JWT_REFRESH_SECRET are required. Set them in .env before starting the server.');
  process.exit(1);
}

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export type JwtPayload = { userId: string; role: string; email: string; iat?: number; exp?: number };

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: EXPIRES_IN, algorithm: 'HS256' } as jwt.SignOptions);
}
export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_EXPIRES_IN, algorithm: 'HS256' } as jwt.SignOptions);
}
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET as string, { algorithms: ['HS256'] }) as JwtPayload;
}
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET as string, { algorithms: ['HS256'] }) as JwtPayload;
}