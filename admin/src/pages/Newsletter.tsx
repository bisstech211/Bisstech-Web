import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Sub = { id: string; email: string; status: string; createdAt: string };

export default function Newsletter() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/leads/newsletter/subscribers'); setSubs(data.data); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const exportCsv = () => {
    const csv = ['email,status,createdAt', ...subs.map(s => `${s.email},${s.status},${s.createdAt}`)].join('\n');
    const b = new Blob([csv], { type: 'text/csv' }); const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = 'newsletter.csv'; a.click(); URL.revokeObjectURL(u);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Newsletter</h1><button onClick={exportCsv} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5">Export CSV</button></div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={3} className="px-4 py-8 text-center text-white/40">Loading…</td></tr> : subs.length===0 ? <tr><td colSpan={3} className="px-4 py-8 text-center text-white/40">No subscribers</td></tr> : subs.map(s=>(
              <tr key={s.id} className="border-t border-white/5"><td className="px-4 py-3">{s.email}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${s.status==='active'?'bg-emerald-500/20 text-emerald-300':'bg-white/10 text-white/50'}`}>{s.status}</span></td><td className="px-4 py-3 text-xs text-white/50">{new Date(s.createdAt).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/40">Public subscribe: POST /api/v1/newsletter/subscribe — ready for Mailchimp/Brevo webhook.</p>
    </div>
  );
}
