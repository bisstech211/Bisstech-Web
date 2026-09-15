import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Tab = 'general' | 'navigation' | 'socials' | 'footer' | 'integrations';

export default function Settings() {
  const [tab, setTab] = useState<Tab>('general');
  const [site, setSite] = useState<Record<string, string>>({});
  const [nav, setNav] = useState<Array<{ id: string; label: string; path: string; sortOrder: number; isActive: boolean }>>([]);
  const [socials, setSocials] = useState<Array<{ id: string; platform: string; url: string; sortOrder: number }>>([]);
  const [footer, setFooter] = useState<Record<string, string>>({});
  const [integrations, setIntegrations] = useState<Array<{ provider: string; isEnabled: boolean; config: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [newNav, setNewNav] = useState({ label: '', path: '', sortOrder: 0 });
  const [newSocial, setNewSocial] = useState({ platform: 'instagram', url: '' });

  const loadAll = async () => {
    const [s, n, so, f, ig] = await Promise.all([
      api.get('/settings/site'),
      api.get('/settings/navigation'),
      api.get('/settings/socials'),
      api.get('/settings/footer'),
      api.get('/settings/integrations').catch(() => ({ data: { data: [] } })),
    ]);
    setSite(s.data.data || {}); setNav(n.data.data || []); setSocials(so.data.data || []); setFooter(f.data.data || {}); setIntegrations(ig.data.data || []);
  };
  useEffect(() => { loadAll(); }, []);

  const saveSite = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/settings/site', site); alert('Site saved'); } catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Save failed'); } finally { setSaving(false); }
  };
  const saveFooter = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/settings/footer', footer); alert('Footer saved'); } catch { alert('Save failed'); } finally { setSaving(false); }
  };
  const addNav = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/settings/navigation', newNav); setNewNav({ label: '', path: '', sortOrder: 0 }); loadAll();
  };
  const delNav = async (id: string) => { if (!confirm('Delete nav item?')) return; await api.delete(`/settings/navigation/${id}`); loadAll(); };
  const addSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/settings/socials', newSocial); setNewSocial({ platform: 'instagram', url: '' }); loadAll();
  };
  const delSocial = async (id: string) => { if (!confirm('Delete social link?')) return; await api.delete(`/settings/socials/${id}`); loadAll(); };

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="flex flex-wrap gap-2">
        {(['general','navigation','socials','footer','integrations'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${tab === t ? 'bg-white text-black' : 'border border-white/15 text-white/70 hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>

      {tab === 'general' && (
        <form onSubmit={saveSite} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
          <h2 className="font-semibold">General / Business</h2>
          <input placeholder="Site name" value={site.siteName || ''} onChange={(e) => setSite({ ...site, siteName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <input placeholder="Tagline" value={site.tagline || ''} onChange={(e) => setSite({ ...site, tagline: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <input placeholder="Description" value={site.description || ''} onChange={(e) => setSite({ ...site, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Logo URL" value={site.logoUrl || ''} onChange={(e) => setSite({ ...site, logoUrl: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
            <input placeholder="Favicon URL" value={site.faviconUrl || ''} onChange={(e) => setSite({ ...site, faviconUrl: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Contact email" value={site.contactEmail || ''} onChange={(e) => setSite({ ...site, contactEmail: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
            <input placeholder="Contact phone" value={site.contactPhone || ''} onChange={(e) => setSite({ ...site, contactPhone: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="WhatsApp URL (https://wa.me/...)" value={site.whatsapp || ''} onChange={(e) => setSite({ ...site, whatsapp: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
            <input placeholder="WhatsApp display" value={site.whatsappDisplay || ''} onChange={(e) => setSite({ ...site, whatsappDisplay: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          </div>
          <input placeholder="Address" value={site.address || ''} onChange={(e) => setSite({ ...site, address: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <input placeholder="Business hours" value={site.businessHours || ''} onChange={(e) => setSite({ ...site, businessHours: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <input placeholder="Map embed URL" value={site.mapEmbedUrl || ''} onChange={(e) => setSite({ ...site, mapEmbedUrl: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save General'}</button>
        </form>
      )}

      {tab === 'navigation' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Navigation Menus</h2>
          <form onSubmit={addNav} className="flex flex-wrap gap-2">
            <input placeholder="Label" value={newNav.label} onChange={(e) => setNewNav({ ...newNav, label: e.target.value })} className="flex-1 min-w-[100px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <input placeholder="/path" value={newNav.path} onChange={(e) => setNewNav({ ...newNav, path: e.target.value })} className="flex-1 min-w-[100px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <input type="number" placeholder="Order" value={newNav.sortOrder} onChange={(e) => setNewNav({ ...newNav, sortOrder: parseInt(e.target.value) || 0 })} className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Add</button>
          </form>
          <div className="space-y-2">
            {nav.length === 0 && <p className="text-sm text-white/40">No nav items</p>}
            {nav.map((n) => (
              <div key={n.id} className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm">
                <span>{n.label} <span className="text-white/40">→ {n.path}</span> <span className="text-xs text-white/30">order {n.sortOrder}</span></span>
                <button onClick={() => delNav(n.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'socials' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Social Links</h2>
          <form onSubmit={addSocial} className="flex flex-wrap gap-2">
            <select value={newSocial.platform} onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
              <option value="instagram">instagram</option><option value="linkedin">linkedin</option><option value="facebook">facebook</option><option value="youtube">youtube</option><option value="twitter">twitter</option><option value="whatsapp">whatsapp</option>
            </select>
            <input placeholder="https://..." value={newSocial.url} onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })} className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Add</button>
          </form>
          <div className="space-y-2">
            {socials.length === 0 && <p className="text-sm text-white/40">No social links</p>}
            {socials.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm">
                <span><strong>{s.platform}</strong> <span className="text-white/50 break-all">{s.url}</span></span>
                <button onClick={() => delSocial(s.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'footer' && (
        <form onSubmit={saveFooter} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
          <h2 className="font-semibold">Footer</h2>
          <textarea placeholder="Footer description" value={footer.description || ''} onChange={(e) => setFooter({ ...footer, description: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <input placeholder="Copyright line" value={footer.copyright || ''} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Footer'}</button>
        </form>
      )}

      {tab === 'integrations' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
          <h2 className="font-semibold">Integrations</h2>
          <p className="text-xs text-white/40">SMTP, Cloudinary/S3, reCAPTCHA, WhatsApp Business API etc. Stored as JSON per provider. Secrets remain server-side; frontend never sees them. Use <code>/settings/integrations/:provider</code>.</p>
          {integrations.length === 0 && <p className="text-sm text-white/40">No integrations configured. Create via API: PUT /settings/integrations/smtp with {'{ config: {host, port, user, pass}, isEnabled }'}</p>}
          {integrations.map((ig) => (
            <div key={ig.provider} className="rounded-xl bg-black/30 px-4 py-3">
              <p className="text-sm font-medium">{ig.provider} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${ig.isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{ig.isEnabled ? 'enabled' : 'disabled'}</span></p>
              <p className="mt-1 break-all text-xs text-white/40">{ig.config.slice(0, 200)}</p>
            </div>
          ))}
          <div className="pt-2 text-xs text-white/30">
            <p>Example — configure SMTP via curl:</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px]">{`curl -X PUT http://localhost:4000/api/v1/settings/integrations/smtp \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"isEnabled":true,"config":{"host":"smtp.gmail.com","port":587,"user":"...","pass":"...","from":"noreply@bisstech.com"}}'`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
