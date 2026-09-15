import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Stats = {
  leadsTotal: number; leadsNew: number; subsTotal: number; blogsPublished: number; blogsDraft: number;
  servicesTotal: number; recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: string }>;
  recentLogs: Array<{ id: string; action: string; resource: string; createdAt: string; user?: { name: string } }>;
  tracking?: { gaEnabled?: boolean; gtmEnabled?: boolean; metaPixelEnabled?: boolean } | null;
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data.data)).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!stats) return <p className="text-white/60">Loading…</p>;

  const cards = [
    { label: 'Total Leads', value: stats.leadsTotal },
    { label: 'New Leads', value: stats.leadsNew },
    { label: 'Subscribers', value: stats.subsTotal },
    { label: 'Published Blogs', value: stats.blogsPublished },
    { label: 'Draft Blogs', value: stats.blogsDraft },
    { label: 'Services', value: stats.servicesTotal },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/50">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="font-semibold">Recent Leads</h2>
          <div className="mt-4 space-y-3">
            {stats.recentLeads.length === 0 && <p className="text-sm text-white/40">No leads yet</p>}
            {stats.recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div><p className="text-sm font-medium">{l.name}</p><p className="text-xs text-white/50">{l.email}</p></div>
                <span className="rounded-full bg-electric/20 px-2.5 py-1 text-xs text-electric">{l.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {stats.recentLogs.length === 0 && <p className="text-sm text-white/40">No activity yet</p>}
            {stats.recentLogs.map((log) => (
              <div key={log.id} className="rounded-xl bg-white/5 px-4 py-3">
                <p className="text-sm">{log.user?.name || 'System'} — {log.action} <span className="text-white/50">{log.resource}</span></p>
                <p className="text-xs text-white/40">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.tracking && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="font-semibold">Tracking Status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge ok={!!stats.tracking.gaEnabled} label="GA4" />
            <Badge ok={!!stats.tracking.gtmEnabled} label="GTM" />
            <Badge ok={!!stats.tracking.metaPixelEnabled} label="Meta Pixel" />
          </div>
        </div>
      )}
    </div>
  );
}
function Badge({ ok, label }: { ok: boolean; label: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs ${ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{label} {ok ? '● enabled' : '○ disabled'}</span>;
}
