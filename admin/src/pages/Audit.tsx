import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Log = { id: string; action: string; resource: string; resourceId?: string; ip?: string; createdAt: string; user?: { name: string; email: string } | null; metadata?: string };

export default function Audit() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    const { data } = await api.get('/audit', { params: { page, limit: 30 } });
    setLogs(data.data); setPages(data.pagination.pages);
  };
  const loadHealth = async () => {
    try { const { data } = await api.get('/audit/health'); setHealth(data.data); } catch {}
  };
  useEffect(() => { load(); loadHealth(); }, [page]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Audit Logs & Health</h1>
      {health && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
          <p className="font-semibold">System Health</p>
          <p className="mt-1 text-white/60">API: {String((health as Record<string,string>).api)} · DB: {String((health as Record<string,string>).database)} · Uptime: {Math.round(Number((health as Record<string,number>).uptime || 0))}s</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Resource</th><th className="px-4 py-3">IP</th></tr></thead>
          <tbody>
            {logs.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No logs</td></tr> : logs.map(l=>(
              <tr key={l.id} className="border-t border-white/5">
                <td className="px-4 py-2 text-xs text-white/50">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{l.user?.name || '—'}<span className="text-xs text-white/40"> {l.user?.email ? `· ${l.user.email}` : ''}</span></td>
                <td className="px-4 py-2"><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{l.action}</span></td>
                <td className="px-4 py-2 text-white/70">{l.resource}{l.resourceId ? ` · ${l.resourceId.slice(0,8)}` : ''}</td>
                <td className="px-4 py-2 text-xs text-white/40">{l.ip || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Prev</button>
        <span className="text-white/50">Page {page} / {pages||1}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
