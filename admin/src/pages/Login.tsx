import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../lib/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function Login() {
  const [email, setEmail] = useState('admin@bisstech.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setUser } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/v1/auth/login`, { email, password });
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      nav('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <h1 className="text-xl font-bold text-white">BISSTECH Admin</h1>
        <p className="mt-1 text-sm text-white/60">Sign in to continue</p>
        {error && <p className="mt-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">{error}</p>}
        <label className="mt-6 block text-xs font-semibold uppercase tracking-widest text-white/60">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none" />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-white/60">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-electric focus:outline-none" />
        <button disabled={loading} className="mt-6 w-full rounded-full bg-electric py-3 text-sm font-semibold text-white hover:bg-electric-600 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">Default: admin@bisstech.com / Admin@123</p>
      </form>
    </div>
  );
}
