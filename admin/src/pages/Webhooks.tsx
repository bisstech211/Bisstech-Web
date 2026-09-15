import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Hook = { id: string; url: string; event: string; isActive: boolean; createdAt: string };
type Log = { id: string; event: string; statusCode?: number; success: boolean; createdAt: string; response?: string };

export default function Webhooks() {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ url: '', event: 'lead.created', secret: '' });

  const load = async () => {
    const { data } = await api.get('/settings/webhooks');
    setHooks(data.data);
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/settings/webhooks', { url: form.url, event: form.event, secret: form.secret || undefined });
    setForm({ url: '', event: 'lead.created', secret: '' }); load();
  };
  const del = async (id: string) => { if (!confirm('Delete webhook?')) return; await api.delete(`/settings/webhooks/${id}`); load(); };
  const viewLogs = async (id: string) => {
    setSelected(id);
    const { data } = await api.get(`/settings/webhooks/${id}/logs`);
    setLogs(data.data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Webhooks</h1>
      <form onSubmit={create} className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <input placeholder="https://example.com/hook" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="min-w-[220px] flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm" required />
        <select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
          <option value="lead.created">lead.created</option>
          <option value="subscriber.created">subscriber.created</option>
          <option value="blog.published">blog.published</option>
        </select>
        <input placeholder="secret (optional)" value={form.secret} onChange={(e) => setForm({ ...form, secret: e.target.value })} className="min-w-[120px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white">Add</button>
      </form>

      <div className="space-y-2">
        {hooks.length === 0 && <p className="text-sm text-white/40">No webhooks yet</p>}
        {hooks.map((h) => (
          <div key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <div><p className="text-sm font-medium">{h.event}</p><p className="text-xs text-white/50 break-all">{h.url}</p></div>
            <div className="flex gap-2">
              <button onClick={() => viewLogs(h.id)} className="rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/5">Logs</button>
              <button onClick={() => del(h.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-sm">Logs for {selected.slice(0, 8)}…</h3><button onClick={() => setSelected(null)} className="text-xs text-white/50 hover:text-white">Close</button></div>
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {logs.length === 0 && <p className="text-xs text-white/40">No logs</p>}
            {logs.map((l) => (
              <div key={l.id} className={`rounded-lg px-3 py-2 text-xs ${l.success ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <p>{l.event} · {l.statusCode ?? '—'} · {l.success ? 'success' : 'failed'} · {new Date(l.createdAt).toLocaleString()}</p>
                {l.response && <p className="mt-1 break-all text-white/50">{l.response.slice(0, 300)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-white/30">Webhooks fire async on lead/subscriber creation. Retry/logs ready for future queue.</p>
    </div>
  );
}
