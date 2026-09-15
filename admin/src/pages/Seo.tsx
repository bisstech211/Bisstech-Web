import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Seo() {
  const [seo, setSeo] = useState<Record<string, string>>({});
  const [redirects, setRedirects] = useState<Array<{ id: string; from: string; to: string; statusCode: number }>>([]);
  const [saving, setSaving] = useState(false);
  const [newRedir, setNewRedir] = useState({ from: '', to: '', statusCode: 301 });

  const load = async () => {
    const [s, r] = await Promise.all([api.get('/settings/seo'), api.get('/settings/redirects')]);
    setSeo(s.data.data || {}); setRedirects(r.data.data || []);
  };
  useEffect(() => { load(); }, []);

  const saveSeo = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/settings/seo', seo); alert('SEO saved'); } catch (e: unknown) { alert((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  };
  const addRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/settings/redirects', newRedir); setNewRedir({ from: '', to: '', statusCode: 301 }); load();
  };
  const del = async (id: string) => { if (!confirm('Delete redirect?')) return; await api.delete(`/settings/redirects/${id}`); load(); };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">SEO</h1>
      <form onSubmit={saveSeo} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
        <h2 className="font-semibold">Global SEO</h2>
        <input placeholder="Default title" value={seo.defaultTitle || ''} onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
        <input placeholder="Default description" value={seo.defaultDescription || ''} onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
        <input placeholder="Default OG image URL" value={seo.defaultOgImage || ''} onChange={(e) => setSeo({ ...seo, defaultOgImage: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
        <input placeholder="Favicon URL" value={seo.faviconUrl || ''} onChange={(e) => setSeo({ ...seo, faviconUrl: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
        <label className="block text-xs font-semibold uppercase tracking-widest text-white/50">robots.txt</label>
        <textarea value={seo.robotsTxt || ''} onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })} rows={4} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-mono" />
        <button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save SEO'}</button>
        <p className="text-xs text-white/40">Sitemap: <a href="http://localhost:4000/sitemap.xml" target="_blank" rel="noreferrer" className="underline">/sitemap.xml</a> · Robots: <a href="http://localhost:4000/robots.txt" target="_blank" rel="noreferrer" className="underline">/robots.txt</a> (auto-generated from DB)</p>
      </form>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="font-semibold">Redirects (301)</h2>
        <form onSubmit={addRedirect} className="mt-3 flex flex-wrap gap-2">
          <input placeholder="/old-path" value={newRedir.from} onChange={(e) => setNewRedir({ ...newRedir, from: e.target.value })} className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
          <input placeholder="/new-path" value={newRedir.to} onChange={(e) => setNewRedir({ ...newRedir, to: e.target.value })} className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
          <select value={newRedir.statusCode} onChange={(e) => setNewRedir({ ...newRedir, statusCode: parseInt(e.target.value) })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"><option value={301}>301</option><option value={302}>302</option></select>
          <button type="submit" className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold">Add</button>
        </form>
        <div className="mt-4 space-y-2">
          {redirects.length === 0 && <p className="text-sm text-white/40">No redirects</p>}
          {redirects.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm">
              <span><code>{r.from}</code> → <code>{r.to}</code> <span className="text-white/40">({r.statusCode})</span></span>
              <button onClick={() => del(r.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
