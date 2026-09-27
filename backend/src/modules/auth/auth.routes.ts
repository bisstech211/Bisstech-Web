import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../lib/jwt';
import { requireAuth, type AuthRequest } from '../../middleware/auth';
import { sendOtpEmail } from '../../lib/mailer';
import { blacklistToken, blacklistAllUserTokens, isTokenBlacklisted } from '../../lib/blacklist';
import { ok, fail } from '../../utils/response';

const router = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) return fail(res, 401, 'Invalid credentials');
  // Validate password length before bcrypt compare
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return fail(res, 401, 'Invalid credentials');

  const payload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  prisma.auditLog.create({ data: { userId: user.id, action: 'login', resource: 'auth', ip: req.ip } }).catch(() => {});

  return ok(res, {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      await blacklistToken(payload, 'logout');
    } catch {
      // if access token is expired/invalid, still succeed (logout is best-effort)
    }
  }
  // Also blacklist the refresh token if provided
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await blacklistToken(payload, 'logout');
    } catch { /* ignore */ }
  }
  return ok(res, null, 'Logged out');
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return fail(res, 400, 'Missing refresh token');
  try {
    const payload = verifyRefreshToken(refreshToken);
    // Check blacklist
    const jti = (payload as { jti?: string | number }).jti;
    if (jti && await isTokenBlacklisted(String(jti))) {
      return fail(res, 401, 'Refresh token revoked');
    }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) return fail(res, 401, 'User not found or inactive');
    const newPayload = { userId: user.id, role: user.role, email: user.email };
    return ok(res, { accessToken: signAccessToken(newPayload) });
  } catch {
    return fail(res, 401, 'Invalid refresh token');
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { id: true, email: true, name: true, role: true, isActive: true } });
  if (!user) return fail(res, 404, 'User not found');
  return ok(res, user);
});

router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ currentPassword: z.string(), newPassword: z.string().min(8) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return fail(res, 404, 'User not found');
  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return fail(res, 401, 'Current password incorrect');
  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  // Invalidate all tokens for this user — previous sessions are no longer valid
  await blacklistAllUserTokens(user.id, 'password_change');
  return ok(res, null, 'Password updated');
});

// ── Forgot Password — OTP flow ──────────────────────────────────
const OTP_TTL_MS = 10 * 60 * 1000; // 10 min
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60s
const OTP_MAX_ATTEMPTS = 5;

function isStrongPassword(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(pw)) return 'Password must contain a number';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain a special character';
  return null;
}

// POST /api/v1/auth/forgot-password  { email }
router.post('/forgot-password', async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Valid email required');
  const email = parsed.data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  // Generic response — do not reveal whether email exists (prevents enumeration)
  if (!user || !user.isActive) {
    return ok(res, null, 'If the account exists, an OTP has been sent.');
  }

  // Resend cooldown: block if last OTP was created < 60s ago
  const recent = await prisma.passwordResetOtp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
  if (recent && Date.now() - new Date(recent.createdAt).getTime() < OTP_RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((OTP_RESEND_COOLDOWN_MS - (Date.now() - new Date(recent.createdAt).getTime())) / 1000);
    return fail(res, 429, `Please wait ${wait}s before requesting a new code`);
  }

  // Invalidate old OTPs for this email
  await prisma.passwordResetOtp.deleteMany({ where: { email } });

  const otp = String(crypto.randomInt(100000, 1000000)); // 6-digit
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  const createdOtp = await prisma.passwordResetOtp.create({
    data: { email, otpHash, expiresAt },
  });

  const result = await sendOtpEmail(email, otp);

  if (!result.success) {
    // Roll back the OTP so the user can retry immediately (no 60s cooldown trap on failed delivery)
    await prisma.passwordResetOtp.delete({ where: { id: createdOtp.id } }).catch(() => {});
    console.error(`[AUTH] forgot-password email failed for ${email}: ${result.error}`);
    return fail(res, 500, result.error);
  }

  // Audit only on successful delivery (no OTP in log)
  prisma.auditLog.create({ data: { userId: user.id, action: 'forgot_password_otp_sent', resource: 'auth', ip: req.ip, metadata: JSON.stringify({ email }) } }).catch(() => {});

  return ok(res, { expiresAt: expiresAt.toISOString() }, 'If the account exists, an OTP has been sent.');
});

// POST /api/v1/auth/verify-otp  { email, otp }
router.post('/verify-otp', async (req, res) => {
  const parsed = z.object({ email: z.string().email(), otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits') }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Valid email and 6-digit OTP required');
  const email = parsed.data.email.toLowerCase().trim();
  const { otp } = parsed.data;

  const record = await prisma.passwordResetOtp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
  if (!record) return fail(res, 400, 'If the account exists, an OTP has been sent.');
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    await prisma.passwordResetOtp.delete({ where: { id: record.id } }).catch(() => {});
    return fail(res, 400, 'OTP has expired. Please request a new code.');
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.passwordResetOtp.delete({ where: { id: record.id } }).catch(() => {});
    return fail(res, 429, 'Too many invalid attempts. Please request a new code.');
  }
  if (record.verified) {
    return ok(res, { verified: true }, 'OTP already verified');
  }

  const valid = await bcrypt.compare(otp, record.otpHash);
  if (!valid) {
    await prisma.passwordResetOtp.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    const left = OTP_MAX_ATTEMPTS - (record.attempts + 1);
    return fail(res, 400, `Invalid OTP. ${left > 0 ? `${left} attempt(s) left.` : 'No attempts left.'}`);
  }

  await prisma.passwordResetOtp.update({ where: { id: record.id }, data: { verified: true } });
  return ok(res, { verified: true }, 'OTP verified');
});

// POST /api/v1/auth/reset-password  { email, otp, newPassword, confirmPassword }
router.post('/reset-password', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Validation error', parsed.error.flatten());
  const email = parsed.data.email.toLowerCase().trim();
  const { otp, newPassword, confirmPassword } = parsed.data;

  if (newPassword !== confirmPassword) return fail(res, 400, 'Passwords do not match');
  const pwError = isStrongPassword(newPassword);
  if (pwError) return fail(res, 400, pwError);

  const record = await prisma.passwordResetOtp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
  if (!record) return fail(res, 400, 'If the account exists, an OTP has been sent.');
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    await prisma.passwordResetOtp.delete({ where: { id: record.id } }).catch(() => {});
    return fail(res, 400, 'OTP has expired. Please request a new code.');
  }
  if (!record.verified) {
    // Allow reset to verify inline if user skipped verify step but supplies correct OTP
    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) {
      await prisma.passwordResetOtp.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      return fail(res, 400, 'Invalid OTP');
    }
  } else {
    // Still ensure OTP matches even if previously verified (prevents hijack with only email)
    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) return fail(res, 400, 'Invalid OTP');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return fail(res, 404, 'Account not found');

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  await prisma.passwordResetOtp.deleteMany({ where: { email } });

  // Invalidate all tokens for this user after password reset
  await blacklistAllUserTokens(user.id, 'password_change');

  prisma.auditLog.create({ data: { userId: user.id, action: 'password_reset', resource: 'auth', ip: req.ip } }).catch(() => {});

  return ok(res, null, 'Password has been reset successfully');
});

export default router;