import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const RESEND_COOLDOWN = 60;

function isStrongPassword(pw: string): string | null {
  if (pw.length < 8) return 'At least 8 characters';
  if (!/[A-Z]/.test(pw)) return 'Need an uppercase letter';
  if (!/[a-z]/.test(pw)) return 'Need a lowercase letter';
  if (!/[0-9]/.test(pw)) return 'Need a number';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Need a special character';
  return null;
}

export function ForgotPassword() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<number | null>(null);

  // countdown for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cooldown]);

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(''); setInfo('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/v1/auth/forgot-password`, { email: email.trim().toLowerCase() });
      setInfo('OTP sent to your email. It expires in 10 minutes.');
      setStep(2);
      setCooldown(RESEND_COOLDOWN);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setError(data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!/^\d{6}$/.test(otp)) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/v1/auth/verify-otp`, { email: email.trim().toLowerCase(), otp });
      setInfo('Code verified. Set your new password.');
      setStep(3);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setError(data?.error || 'Invalid code');
    } finally { setLoading(false); }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    const pwErr = isStrongPassword(newPassword);
    if (pwErr) { setError(pwErr); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/v1/auth/reset-password`, {
        email: email.trim().toLowerCase(),
        otp,
        newPassword,
        confirmPassword,
      });
      setInfo('Password reset successfully! Redirecting to login…');
      setTimeout(() => nav('/login'), 1600);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setError(data?.error || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <h1 className="text-xl font-bold text-white">Reset password</h1>
        <p className="mt-1 text-sm text-white/60">
          {step === 1 && 'Enter your admin email to receive a code'}
          {step === 2 && `Code sent to ${email}`}
          {step === 3 && 'Choose a strong new password'}
        </p>

        {/* stepper */}
        <div className="mt-5 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= n ? 'bg-electric text-white' : 'bg-white/10 text-white/40'}`}>{n}</div>
              {n < 3 && <div className={`h-px flex-1 ${step > n ? 'bg-electric' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">{error}</p>}
        {info && <p className="mt-4 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">{info}</p>}

        {step === 1 && (
          <form onSubmit={sendOtp} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">Email</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="info.bisstech@gmail.com" autoFocus
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none"
            />
            <button disabled={loading} className="mt-6 w-full rounded-full bg-electric py-3 text-sm font-semibold text-white hover:bg-electric-600 disabled:opacity-50">
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">6-digit code</label>
            <input
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-lg tracking-[0.4em] text-white placeholder:text-white/20 focus:border-electric focus:outline-none"
            />
            <p className="mt-2 text-center text-xs text-white/50">
              {cooldown > 0 ? (
                <>Resend available in <span className="font-semibold text-white">{cooldown}s</span></>
              ) : (
                <button type="button" onClick={() => sendOtp()} className="font-semibold text-electric hover:underline">Resend code</button>
              )}
            </p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => { setStep(1); setError(''); setInfo(''); }} className="flex-1 rounded-full border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5">Back</button>
              <button disabled={loading || otp.length !== 6} className="flex-1 rounded-full bg-electric py-3 text-sm font-semibold text-white hover:bg-electric-600 disabled:opacity-50">Verify</button>
            </div>
            <p className="mt-3 text-center text-xs text-white/40">Code expires in 10 minutes.</p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">New password</label>
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-electric focus:outline-none" />
            <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-white/60">Confirm password</label>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-electric focus:outline-none" />
            <p className="mt-2 text-xs text-white/40">Min 8 chars, uppercase, lowercase, number &amp; special character.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5">Back</button>
              <button disabled={loading} className="flex-1 rounded-full bg-electric py-3 text-sm font-semibold text-white hover:bg-electric-600 disabled:opacity-50">
                {loading ? 'Saving…' : 'Reset password'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs">
          <Link to="/login" className="font-semibold text-white/60 hover:text-white">← Back to Sign in</Link>
        </p>
      </div>
    </div>
  );
}
