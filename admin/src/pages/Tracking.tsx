import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Tracking = {
  gaMeasurementId?: string; gaEnabled: boolean;
  gtmContainerId?: string; gtmEnabled: boolean;
  metaPixelId?: string; metaPixelEnabled: boolean;
  clarityId?: string; clarityEnabled: boolean;
  gscVerification?: string;
};

export default function Tracking() {
  const [t, setT] = useState<Tracking | null>(null);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    const { data } = await api.get('/settings/tracking');
    setT(data.data);
  };
  useEffect(() => { load(); }, []);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!t) return;
    setSaving(true);
    try { await api.put('/settings/tracking', t); alert('Tracking saved'); } catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  };
  if (!t) return <p className="text-sm text-white/40">Loading…</p>;
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold">Tracking & Analytics</h1>
      <p className="text-xs text-white/40">IDs are injected into frontend via /api/v1/settings/public. Toggle enable to expose them. Secrets remain server-side for future server-to-server APIs.</p>
      <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
        <div className="grid gap-3">
          <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm"><strong>GA4</strong> — Measurement ID</span>
            <input type="checkbox" checked={t.gaEnabled} onChange={(e) => setT({ ...t, gaEnabled: e.target.checked })} />
          </label>
          <input placeholder="G-XXXXXXXXXX" value={t.gaMeasurementId || ''} onChange={(e) => setT({ ...t, gaMeasurementId: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />

          <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm"><strong>GTM</strong> — Container ID</span>
            <input type="checkbox" checked={t.gtmEnabled} onChange={(e) => setT({ ...t, gtmEnabled: e.target.checked })} />
          </label>
          <input placeholder="GTM-XXXXXXX" value={t.gtmContainerId || ''} onChange={(e) => setT({ ...t, gtmContainerId: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />

          <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm"><strong>Meta Pixel</strong> — Pixel ID</span>
            <input type="checkbox" checked={t.metaPixelEnabled} onChange={(e) => setT({ ...t, metaPixelEnabled: e.target.checked })} />
          </label>
          <input placeholder="1234567890" value={t.metaPixelId || ''} onChange={(e) => setT({ ...t, metaPixelId: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />

          <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm"><strong>Clarity / Hotjar</strong></span>
            <input type="checkbox" checked={t.clarityEnabled} onChange={(e) => setT({ ...t, clarityEnabled: e.target.checked })} />
          </label>
          <input placeholder="Clarity project ID" value={t.clarityId || ''} onChange={(e) => setT({ ...t, clarityId: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">GSC Verification (meta tag content)</label>
            <input placeholder="google site verification token" value={t.gscVerification || ''} onChange={(e) => setT({ ...t, gscVerification: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Tracking'}</button>
        <p className="text-xs text-white/30">Frontend reads <code>/settings/public</code> and injects gtag/gtm/pixel only when enabled. Add consent banner in Settings → Privacy.</p>
      </form>
    </div>
  );
}
