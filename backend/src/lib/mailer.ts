import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  });
  return transporter;
}

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  const fromName = process.env.SMTP_FROM_NAME || 'BISSTECH';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@bisstech.com';
  const tx = getTransporter();
  if (!tx) {
    // Dev fallback: log OTP so flow is testable without SMTP credentials
    console.log(`\n[MAIL DEV] ─────────────────────────────────`);
    console.log(`[MAIL DEV] To: ${to}`);
    console.log(`[MAIL DEV] OTP: ${otp} (valid 10 min)`);
    console.log(`[MAIL DEV] ─────────────────────────────────\n`);
    return true;
  }
  try {
    await tx.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: 'Your BISSTECH Admin password reset code',
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:16px">
          <h2 style="margin:0 0 8px;color:#fff">Password reset code</h2>
          <p style="color:#9ca3af;font-size:14px">Use the code below to reset your BISSTECH Admin password. It expires in <b style="color:#fff">10 minutes</b>.</p>
          <div style="margin:20px 0;padding:16px 20px;background:#fff;color:#0a0a0a;border-radius:12px;text-align:center;letter-spacing:8px;font-size:28px;font-weight:800">${otp}</div>
          <p style="color:#9ca3af;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#6b7280;font-size:12px;margin-top:16px">— BISSTECH</p>
        </div>
      `,
      text: `Your BISSTECH password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, ignore this email.`,
    });
    return true;
  } catch (e) {
    console.error('[MAIL] send failed:', e);
    // Don't leak error to client; still log OTP in dev so admin can proceed
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MAIL FALLBACK] OTP for ${to}: ${otp}`);
      return true;
    }
    return false;
  }
}
