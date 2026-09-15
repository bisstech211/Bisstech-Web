import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Lead = { id: string; name: string; email: string; phone?: string; company?: string; service?: string; message?: string; status: string; createdAt: string; assignedTo?: { name: string } | null };

const STATUSES = ['NEW','CONTACTED','QUALIFIED','PROPOSAL','WON','LOST','SPAM'] as const;

export default function Leads() {
  const [items, setItems] = useState<Lead[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads', { params: { page, limit: 20, search: q || undefined, status: status || undefined } });
      setItems(data.data); setPages(data.pagination.pages);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [page, status]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); load(); }, 400); return () => clearTimeout(t); }, [q]);

  const updateStatus = async (id: string, newStatus: string) => {
    await api.patch(`/leads/${id}`, { status: newStatus });
    load();
  };
  const del = async (id: string) => { if (!confirm('Delete lead?')) return; await api.delete(`/leads/${id}`); load(); };
  const exportCsv = () => {
    const header = ['name','email','phone','company','service','status','createdAt'];
    const rows = items.map((l) => [l.name,l.email,l.phone||'',l.company||'',l.service||'',l.status,new Date(l.createdAt).toLocaleString()]);
    const csv = [header.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Leads</h1>
        <button onClick={exportCsv} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5">Export CSV</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / email / company…" className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm placeholder:text-white/40" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">Loading…</td></tr> : items.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No leads</td></tr> : items.map((l) => (
              <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3"><p className="font-medium">{l.name}</p><p className="text-xs text-white/50">{l.email} {l.phone ? `· ${l.phone}` : ''}</p>{l.company && <p className="text-xs text-white/40">{l.company}</p>}</td>
                <td className="px-4 py-3 text-white/60">{l.service || '—'}</td>
                <td className="px-4 py-3">
                  <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="rounded-full bg-white/10 px-2 py-1 text-xs">
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-[#141414]">{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-white/50">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(l.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <button disabled={page<=1} onClick={() => setPage(p=>p-1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Prev</button>
        <span className="text-white/50">Page {page} / {pages||1}</span>
        <button disabled={page>=pages} onClick={() => setPage(p=>p+1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
