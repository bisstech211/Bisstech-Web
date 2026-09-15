import { Resend } from 'resend';
import nodemailer from 'nodemailer';

let resend: Resend | null = null;
let smtpTransporter: nodemailer.Transporter | null = null;

// ── Providers ────────────────────────────────────────────────
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (resend) return resend;
  resend = new Resend(key);
  return resend;
}

function getSmtpTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;
  if (smtpTransporter) return smtpTransporter;
  smtpTransporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  });
  return smtpTransporter;
}

// ── Branded HTML ───────────────────────────────────────────
function otpHtml(otp: string): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:16px">
    <div style="text-align:center;margin-bottom:16px">
      <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#E50914;color:#fff;font-weight:800;letter-spacing:1px;font-size:12px">BISSTECH</span>
    </div>
    <h2 style="margin:0 0 8px;color:#fff;text-align:center">Password reset code</h2>
    <p style="color:#9ca3af;font-size:14px;text-align:center;margin:0">Use the code below to reset your BISSTECH Admin password.<br/>It expires in <b style="color:#fff">10 minutes</b>.</p>
    <div style="margin:20px 0;padding:16px 20px;background:#fff;color:#0a0a0a;border-radius:12px;text-align:center;letter-spacing:8px;font-size:28px;font-weight:800">${otp}</div>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0">If you didn't request this, you can safely ignore this email.</p>
    <p style="color:#6b7280;font-size:12px;text-align:center;margin:16px 0 0">— BISSTECH Admin</p>
  </div>`;
}

function otpText(otp: string): string {
  return `Your BISSTECH Admin password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, ignore this email.`;
}

// ── Main sender ────────────────────────────────────────────
export type SendResult = { success: true } | { success: false; error: string };

/**
 * Send OTP email via Resend (primary) → SMTP (fallback) → dev console (last resort).
 * Returns { success, error } — caller MUST check success before telling the user "OTP sent".
 * Never throws; all failures are returned as { success:false } with a safe message.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<SendResult> {
  const fromName = (process.env.RESEND_FROM_NAME || process.env.SMTP_FROM_NAME || 'BISSTECH').trim();
  // Resend requires a verified sender domain. gmail.com / free providers can never be verified —
  // use Resend's test sender in dev so delivery actually works. Verify your domain at
  // https://resend.com/domains then set RESEND_FROM_EMAIL to e.g. noreply@yourdomain.com.
  const rawFromEmail = (process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'noreply@bisstech.com').trim();
  const isUnverifiable = /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i.test(rawFromEmail);
  // onboarding@resend.dev is Resend's built-in test sender — works without domain verification (dev/test)
  const fromEmail = isUnverifiable ? 'onboarding@resend.dev' : rawFromEmail;
  const replyTo = isUnverifiable ? rawFromEmail : undefined;
  const from = `${fromName} <${fromEmail}>`;
  const subject = 'Your BISSTECH Admin password reset code';
  const html = otpHtml(otp);
  const text = otpText(otp);

  // 1) Try Resend (preferred — real delivery)
  const rs = getResend();
  if (rs) {
    try {
      const { data, error } = await rs.emails.send({
        from,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo ? { replyTo } : {}),
      } as Parameters<Resend['emails']['send']>[0]);
      if (error) {
        console.error('[MAIL][RESEND] API error:', error);
        // If Resend fails (e.g. domain not verified, key invalid), try SMTP before giving up
        const smtpFallback = await trySmtp(to, from, subject, html, text, otp);
        if (smtpFallback.success) return smtpFallback;
        return { success: false, error: mapResendError(error) };
      }
      console.log(`[MAIL][RESEND] sent to ${to} id=${(data as { id?: string })?.id || 'unknown'}`);
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[MAIL][RESEND] exception:', msg);
      const smtpFallback = await trySmtp(to, from, subject, html, text, otp);
      if (smtpFallback.success) return smtpFallback;
      return { success: false, error: `Email service error: ${msg}` };
    }
  }

  // 2) Try SMTP (Gmail SMTP fallback)
  const smtpResult = await trySmtp(to, from, subject, html, text, otp);
  if (smtpResult.success || smtpResult.error !== 'SMTP not configured') {
    return smtpResult; // either sent or SMTP was configured but failed → real error
  }

  // 3) No provider configured — dev-only console fallback (never "succeed" in production)
  if (process.env.NODE_ENV === 'production') {
    console.error('[MAIL] No email provider configured (RESEND_API_KEY and SMTP missing). OTP not delivered.');
    return { success: false, error: 'Email service is not configured. Contact the administrator.' };
  }
  console.log(`\n[MAIL DEV] ─────────────────────────────────`);
  console.log(`[MAIL DEV] To: ${to}`);
  console.log(`[MAIL DEV] OTP: ${otp} (valid 10 min)`);
  console.log(`[MAIL DEV] No provider configured — DEV fallback. Set RESEND_API_KEY to send real emails.`);
  console.log(`[MAIL DEV] ─────────────────────────────────\n`);
  return { success: true };
}

async function trySmtp(
  to: string,
  from: string,
  subject: string,
  html: string,
  text: string,
  otp: string,
): Promise<SendResult> {
  const tx = getSmtpTransporter();
  if (!tx) return { success: false, error: 'SMTP not configured' };
  try {
    await tx.sendMail({ from, to, subject, html, text });
    console.log(`[MAIL][SMTP] sent to ${to}`);
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[MAIL][SMTP] send failed:', msg);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MAIL FALLBACK][DEV] OTP for ${to}: ${otp}`);
      return { success: true };
    }
    return { success: false, error: 'Failed to send email via SMTP. Please try again later.' };
  }
}

function mapResendError(error: unknown): string {
  const msg = typeof error === 'object' && error !== null && 'message' in error
    ? String((error as { message: string }).message)
    : String(error);
  // Provide actionable, safe messages (never leak the API key)
  if (/domain.*not verified/i.test(msg) || /verify.*domain/i.test(msg)) {
    return 'Email domain is not verified in Resend. Verify your sender domain at resend.com/domains.';
  }
  if (/api key/i.test(msg) || /unauthorized|authenticate/i.test(msg)) {
    return 'Email service authentication failed. Check RESEND_API_KEY.';
  }
  if (/rate limit/i.test(msg)) {
    return 'Email rate limit exceeded. Please try again in a minute.';
  }
  return `Failed to send email: ${msg}`;
}
