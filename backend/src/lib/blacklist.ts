import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  const entry = await prisma.tokenBlacklist.findUnique({ where: { jti } });
  return !!entry;
}

export async function blacklistToken(payload: { jti?: string | number; exp?: number; userId?: string }, reason: string): Promise<void> {
  if (!payload.jti) return;
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
  if (!exp) return;
  const expiresAt = new Date(exp * 1000);
  await prisma.tokenBlacklist.create({
    data: { jti: String(payload.jti), userId: String(payload.userId ?? ''), reason, expiresAt },
  }).catch(() => { /* ignore duplicates */ });
}

export async function blacklistAllUserTokens(userId: string, reason: string): Promise<void> {
  await prisma.tokenBlacklist.deleteMany({ where: { userId, reason: 'password_change' } }).catch(() => {});
}