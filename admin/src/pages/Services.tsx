import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../hooks/useToast';

type ServiceRow = {
  id: string; slug: string; title: string; shortDesc?: string | null; isPublished: boolean; sortOrder: number;
  backgroundImage?: string | null; backgroundImageAlt?: string | null; imageWidth?: number | null; imageHeight?: number | null;
};

type FullService = {
  id: string; slug: string; title: string; shortDesc?: string | null; description?: string | null;
  icon?: string | null; sortOrder: number; isPublished: boolean;
  seoTitle?: string | null; seoDescription?: string | null;
  benefits?: string | null; deliverables?: string | null; extra?: string | null;
  backgroundImage?: string | null; backgroundImageAlt?: string | null; imageWidth?: number | null; imageHeight?: number | null;
  bannerImage?: string | null; bannerImageAlt?: string | null; bannerImageWidth?: number | null; bannerImageHeight?: number | null;
  features: Array<{ id: string; groupTitle: string; items: string; sortOrder: number }>;
  processes: Array<{ id: string; step: string; detail: string; sortOrder: number }>;
  faqs: Array<{ id: string; question: string; answer: string; sortOrder: number }>;
};

const ICON_OPTIONS = ['TrendingUp','Code2','ShoppingBag','BrainCircuit','PenTool','Sparkles','Megaphone','BarChart3','Wrench','Palette','Smartphone'];

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; }
}
function parseFeatureItems(raw: string): string[] {
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : [String(raw)]; } catch { return raw ? [raw] : []; }
}

type FeatureForm = { groupTitle: string; items: string[] };
type ProcessForm = { step: string; detail: string };
type FaqForm = { question: string; answer: string };

type FormState = {
  title: string; slug: string; shortDesc: string; description: string;
  icon: string; sortOrder: number; isPublished: boolean;
  seoTitle: string; seoDescription: string;
  benefits: string[]; deliverables: string[]; extra: string[];
  backgroundImage: string; backgroundImageAlt: string; imageWidth: number | null; imageHeight: number | null;
  bannerImage: string; bannerImageAlt: string; bannerImageWidth: number | null; bannerImageHeight: number | null;
  features: FeatureForm[]; processes: ProcessForm[]; faqs: FaqForm[];
};

const emptyForm = (nextOrder: number): FormState => ({
  title: '', slug: '', shortDesc: '', description: '',
  icon: 'Sparkles', sortOrder: nextOrder, isPublished: true,
  seoTitle: '', seoDescription: '',
  benefits: [''], deliverables: [''], extra: [],
  backgroundImage: '', backgroundImageAlt: '', imageWidth: null, imageHeight: null,
  bannerImage: '', bannerImageAlt: '', bannerImageWidth: null, bannerImageHeight: null,
  features: [{ groupTitle: '', items: [''] }],
  processes: [{ step: '', detail: '' }],
  faqs: [],
});

function toPayload(form: FormState) {
  const clean = (arr: string[]) => arr.map(s => s.trim()).filter(Boolean);
  const feats = form.features.filter(f => f.groupTitle.trim()).map(f => ({ groupTitle: f.groupTitle.trim(), items: clean(f.items) })).filter(f => f.items.length);
  return {
    title: form.title.trim(),
    slug: form.slug.trim().toLowerCase(),
    shortDesc: form.shortDesc.trim(),
    description: form.description.trim(),
    icon: form.icon.trim(),
    sortOrder: Number(form.sortOrder) || 0,
    isPublished: form.isPublished,
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
    benefits: clean(form.benefits),
    deliverables: clean(form.deliverables),
    extra: clean(form.extra),
    backgroundImage: form.backgroundImage.trim() || null,
    backgroundImageAlt: form.backgroundImageAlt.trim() || null,
    imageWidth: form.imageWidth,
    imageHeight: form.imageHeight,
    bannerImage: form.bannerImage.trim() || null,
    bannerImageAlt: form.bannerImageAlt.trim() || null,
    bannerImageWidth: form.bannerImageWidth,
    bannerImageHeight: form.bannerImageHeight,
    features: feats,
    processes: form.processes.filter(p => p.step.trim() && p.detail.trim()).map(p => ({ step: p.step.trim(), detail: p.detail.trim() })),
    faqs: form.faqs.filter(f => f.question.trim() && f.answer.trim()).map(f => ({ question: f.question.trim(), answer: f.answer.trim() })),
  };
}

function ChipList({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const set = (i: number, val: string) => { const n = [...values]; n[i] = val; onChange(n); };
  return (
    <div className="grid gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input value={v} onChange={e => set(i, e.target.value)} placeholder={placeholder} className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm" />
          <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="rounded-xl border border-white/10 px-3 text-xs text-white/60 hover:text-white">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ''])} className="self-start rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white">+ Add</button>
    </div>
  );
}

export default function Services() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<FullService | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(0));
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/services'); setItems(data.data); }
    catch (err) { addToast('Failed to load services', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm(items.length)); setShow(true); };
  const openEdit = async (s: ServiceRow) => {
    try {
      const { data } = await api.get(`/services/${s.id}`);
      const d: FullService = data.data;
      setEditing(d);
      setForm({
        title: d.title, slug: d.slug, shortDesc: d.shortDesc || '', description: d.description || '',
        icon: d.icon || 'Sparkles', sortOrder: d.sortOrder ?? 0, isPublished: !!d.isPublished,
        seoTitle: d.seoTitle || '', seoDescription: d.seoDescription || '',
        benefits: parseJsonArray(d.benefits).length ? parseJsonArray(d.benefits) : [''],
        deliverables: parseJsonArray(d.deliverables).length ? parseJsonArray(d.deliverables) : [''],
        extra: parseJsonArray(d.extra),
        backgroundImage: d.backgroundImage || '',
        backgroundImageAlt: d.backgroundImageAlt || '',
        imageWidth: d.imageWidth ?? null,
        imageHeight: d.imageHeight ?? null,
        bannerImage: d.bannerImage || '',
        bannerImageAlt: d.bannerImageAlt || '',
        bannerImageWidth: d.bannerImageWidth ?? null,
        bannerImageHeight: d.bannerImageHeight ?? null,
        features: d.features.length ? d.features.sort((a,b)=>a.sortOrder-b.sortOrder).map(f => ({ groupTitle: f.groupTitle, items: parseFeatureItems(f.items) })) : [{ groupTitle: '', items: [''] }],
        processes: d.processes.length ? d.processes.sort((a,b)=>a.sortOrder-b.sortOrder).map(p => ({ step: p.step, detail: p.detail })) : [{ step: '', detail: '' }],
        faqs: d.faqs.sort((a,b)=>a.sortOrder-b.sortOrder).map(f => ({ question: f.question, answer: f.answer })),
      });
      setShow(true);
    } catch { addToast('Failed to load service details', 'error'); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return addToast('Title and slug are required', 'error');
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (editing) await api.put(`/services/${editing.id}`, payload);
      else await api.post('/services', payload);
      addToast(editing ? 'Service updated' : 'Service created', 'success');
      setShow(false); load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string; details?: unknown } } })?.response?.data?.error || 'Save failed';
      addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => { if (!confirm('Delete service? This removes it from Home and Services pages.')) return; try { await api.delete(`/services/${id}`); addToast('Service deleted', 'success'); load(); } catch { addToast('Failed to delete service', 'error'); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Services</h1>
          <p className="text-xs text-white/50">Single source for Home preview + Services page. Sort Order drives the 01/02 number globally.</p>
        </div>
        <button onClick={openCreate} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600">New Service</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
            <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">Loading…</td></tr>
            : items.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No services — create your first one.</td></tr>
            : items.sort((a,b)=>a.sortOrder-b.sortOrder).map((s) => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-mono text-xs text-white/50">{String(s.sortOrder + 1).padStart(2,'0')}</td>
                <td className="px-4 py-3 font-medium">{s.title}<span className="block text-xs font-normal text-white/40 line-clamp-1">{s.shortDesc || ''}</span></td>
                <td className="px-4 py-3 text-white/60">{s.slug}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${s.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{s.isPublished ? 'Yes' : 'No'}</span></td>
                <td className="px-4 py-3 text-right space-x-2"><button onClick={() => openEdit(s)} className="text-xs text-white/70 hover:text-white">Edit</button><button onClick={() => del(s.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <form onSubmit={submit} className="my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#141414] p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Service' : 'New Service'}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">Preview number: {String((Number(form.sortOrder)||0)+1).padStart(2,'0')}</span>
            </div>

            {/* Global fields */}
            <div className="mt-6 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">General</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Title e.g. Digital Marketing" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
                <input placeholder="slug e.g. digital-marketing" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              </div>
              <input placeholder="Subtitle / Tagline — e.g. Visibility. Traffic. Leads. Revenue." value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="Full description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <div className="grid gap-3 sm:grid-cols-3">
                <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm">
                  {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <input type="number" placeholder="Sort order (0 = 01)" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-sm"><input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="SEO title (optional)" value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                <input placeholder="SEO description (optional)" value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              </div>
            </div>

            {/* Background Image for Service Card */}
            <div className="mt-6 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-electric">
                Card Background Image
              </p>
              <p className="text-xs text-white/50">
                Recommended: 1600 × 1200 px (4:3 aspect ratio) · WebP / AVIF preferred · Under 500 KB recommended
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  placeholder="Background Image URL (auto-filled after upload)"
                  value={form.backgroundImage}
                  onChange={e => setForm({ ...form, backgroundImage: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                <input
                  placeholder="Alt text for accessibility"
                  value={form.backgroundImageAlt}
                  onChange={e => setForm({ ...form, backgroundImageAlt: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="number"
                  placeholder="Image width (px)"
                  value={form.imageWidth ?? ''}
                  onChange={e => setForm({ ...form, imageWidth: e.target.value ? parseInt(e.target.value) : null })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Image height (px)"
                  value={form.imageHeight ?? ''}
                  onChange={e => setForm({ ...form, imageHeight: e.target.value ? parseInt(e.target.value) : null })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                {editing && (
                  <button
                    type="button"
                    className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:text-white"
                    onClick={() => {
                      if (!confirm('Remove background image?')) return;
                      setForm({ ...form, backgroundImage: '', backgroundImageAlt: '', imageWidth: null, imageHeight: null });
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {/* Upload helper */}
              {editing && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/30">
                  <label className="cursor-pointer rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600 flex-1 text-center">
                    Upload Image
                    <input type="file" accept="image/webp,image/avif,image/jpeg,image/png,image/gif" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        fd.append('altText', file.name);
                        try {
                          const res = await api.post(`/services/${editing.id}/background-image`, fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          const { url, width, height, warning } = res.data.imageUpload;
                          setForm(f => ({ ...f, backgroundImage: url, backgroundImageAlt: file.name, imageWidth: width, imageHeight: height }));
                          if (warning) alert('Uploaded: ' + warning);
                        } catch (err: unknown) {
                          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload failed';
                          alert(msg);
                        }
                      }}
                    />
                  </label>
                  {form.backgroundImage && (
                    <img src={form.backgroundImage} alt="preview" className="h-20 w-auto rounded-lg object-cover border border-white/10" />
                  )}
                </div>
              )}
            </div>

            {/* Section Banner Image (for accordion expansion) */}
            <div className="mt-6 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-electric">
                Section Banner Image (shown when expanded)
              </p>
              <p className="text-xs text-white/50">
                Recommended: 1200 × 400 px (16:9 aspect ratio) · WebP / AVIF preferred · Under 500 KB recommended
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  placeholder="Banner Image URL (auto-filled after upload)"
                  value={form.bannerImage ?? ''}
                  onChange={e => setForm({ ...form, bannerImage: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                <input
                  placeholder="Alt text for accessibility"
                  value={form.bannerImageAlt ?? ''}
                  onChange={e => setForm({ ...form, bannerImageAlt: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="number"
                  placeholder="Image width (px)"
                  value={form.bannerImageWidth ?? ''}
                  onChange={e => setForm({ ...form, bannerImageWidth: e.target.value ? parseInt(e.target.value) : null })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Image height (px)"
                  value={form.bannerImageHeight ?? ''}
                  onChange={e => setForm({ ...form, bannerImageHeight: e.target.value ? parseInt(e.target.value) : null })}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
                />
                {editing && (
                  <button
                    type="button"
                    className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:text-white"
                    onClick={() => {
                      if (!confirm('Remove banner image?')) return;
                      setForm({ ...form, bannerImage: '', bannerImageAlt: '', bannerImageWidth: null, bannerImageHeight: null });
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {/* Upload helper */}
              {editing && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/30">
                  <label className="cursor-pointer rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600 flex-1 text-center">
                    Upload Banner Image
                    <input type="file" accept="image/webp,image/avif,image/jpeg,image/png,image/gif" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        fd.append('altText', file.name);
                        try {
                          const res = await api.post(`/services/${editing.id}/banner-image`, fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          const { url, width, height, warning } = res.data.imageUpload;
                          setForm(f => ({ ...f, bannerImage: url, bannerImageAlt: file.name, bannerImageWidth: width, bannerImageHeight: height }));
                          if (warning) alert('Uploaded: ' + warning);
                        } catch (err: unknown) {
                          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload failed';
                          alert(msg);
                        }
                      }}
                    />
                  </label>
                  {form.bannerImage && (
                    <img src={form.bannerImage} alt="preview" className="h-20 w-auto rounded-lg object-cover border border-white/10" />
                  )}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="mt-8 grid gap-3">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-electric">What&apos;s Included — categories & bullets</p><button type="button" onClick={() => setForm({ ...form, features: [...form.features, { groupTitle: '', items: [''] }] })} className="rounded-full border border-electric/30 px-3 py-1 text-xs text-electric hover:bg-electric/10">+ Category</button></div>
              {form.features.map((g, gi) => (
                <div key={gi} className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex gap-2">
                    <input placeholder="Category title e.g. SEO" value={g.groupTitle} onChange={e => { const n=[...form.features]; n[gi] = { ...n[gi], groupTitle: e.target.value }; setForm({ ...form, features: n }); }} className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm" />
                    <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, i)=>i!==gi) })} className="rounded-xl border border-white/10 px-3 text-xs text-red-300">Remove</button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {g.items.map((it, ii) => (
                      <div key={ii} className="flex gap-2">
                        <input value={it} onChange={e => { const n=[...form.features]; const items=[...n[gi].items]; items[ii]=e.target.value; n[gi]={...n[gi], items}; setForm({ ...form, features: n }); }} placeholder="Bullet point" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm" />
                        <button type="button" onClick={() => { const n=[...form.features]; n[gi] = { ...n[gi], items: n[gi].items.filter((_, idx)=>idx!==ii) }; setForm({ ...form, features: n }); }} className="rounded-xl border border-white/10 px-3 text-xs text-white/60">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => { const n=[...form.features]; n[gi] = { ...n[gi], items: [...n[gi].items, ''] }; setForm({ ...form, features: n }); }} className="self-start rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">+ Bullet</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits / Deliverables / Extra */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">Why It Matters</p><ChipList values={form.benefits} onChange={v => setForm({ ...form, benefits: v })} placeholder="Benefit point" /></div>
              <div className="grid gap-2"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">Deliverables</p><ChipList values={form.deliverables} onChange={v => setForm({ ...form, deliverables: v })} placeholder="Deliverable" /></div>
            </div>
            <div className="mt-6 grid gap-2"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">Tag pills (extra) — optional</p><ChipList values={form.extra} onChange={v => setForm({ ...form, extra: v })} placeholder="Tag e.g. Product Catalog Management" /></div>

            {/* Process */}
            <div className="mt-8 grid gap-3">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">Our Process</p><button type="button" onClick={() => setForm({ ...form, processes: [...form.processes, { step: '', detail: '' }] })} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">+ Step</button></div>
              {form.processes.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Step e.g. Audit" value={p.step} onChange={e => { const n=[...form.processes]; n[i]={...n[i], step: e.target.value}; setForm({ ...form, processes: n }); }} className="w-32 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  <input placeholder="Detail" value={p.detail} onChange={e => { const n=[...form.processes]; n[i]={...n[i], detail: e.target.value}; setForm({ ...form, processes: n }); }} className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  <button type="button" onClick={() => setForm({ ...form, processes: form.processes.filter((_, idx)=>idx!==i) })} className="rounded-xl border border-white/10 px-3 text-xs text-white/60">✕</button>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="mt-8 grid gap-3">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">FAQs (optional)</p><button type="button" onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">+ FAQ</button></div>
              {form.faqs.map((f, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="flex gap-2"><input placeholder="Question" value={f.question} onChange={e => { const n=[...form.faqs]; n[i]={...n[i], question: e.target.value}; setForm({ ...form, faqs: n }); }} className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" /><button type="button" onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, idx)=>idx!==i) })} className="rounded-xl border border-white/10 px-3 text-xs text-red-300">Remove</button></div>
                  <textarea placeholder="Answer" value={f.answer} onChange={e => { const n=[...form.faqs]; n[i]={...n[i], answer: e.target.value}; setForm({ ...form, faqs: n }); }} rows={2} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-2"><button type="button" onClick={() => setShow(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button></div>
            <p className="mt-3 text-center text-xs text-white/30">Saved services appear instantly on Home and /services — both pull from the same API.</p>
          </form>
        </div>
      )}
    </div>
  );
}
