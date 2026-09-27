import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../hooks/useToast';
import { ArrowUpRight } from 'lucide-react';

type CaseStudyRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  category?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type FullCaseStudy = CaseStudyRow & {
  services: string;
  challenge: string;
  solution: string;
  result: string;
  accent: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  shortDescription?: string;
  status?: string;
  featured?: boolean;
  projectDate?: string;
  projectUrl?: string;
  metrics?: any;
  gallery?: any;
};

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

const DEFAULT_ACCENTS = [
  'from-coffee/60 to-espresso-700/40',
  'from-coffee/50 to-espresso-700/20',
  'from-espresso-700/60 to-coffee/30',
  'from-coffee/40 to-transparent',
];

type FormState = {
  title: string;
  slug: string;
  client: string;
  industry: string;
  category: string;
  shortDescription: string;
  services: string[];
  challenge: string;
  solution: string;
  result: string;
  accent: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  sortOrder: number;
  isPublished: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  projectDate: string;
  projectUrl: string;
  metrics: any;
  gallery: any;
};

const emptyForm = (nextOrder: number): FormState => ({
  title: '',
  slug: '',
  client: '',
  industry: '',
  category: '',
  shortDescription: '',
  services: [''],
  challenge: '',
  solution: '',
  result: '',
  accent: DEFAULT_ACCENTS[nextOrder % DEFAULT_ACCENTS.length],
  imageUrl: '',
  imageAlt: '',
  imageWidth: null,
  imageHeight: null,
  sortOrder: nextOrder,
  isPublished: true,
  status: 'DRAFT' as const,
  featured: false,
  projectDate: '',
  projectUrl: '',
  metrics: {},
  gallery: [],
});

function ServiceTag({ value, onRemove, onChange }: { value: string; onRemove: () => void; onChange: (v: string) => void }) {
  return (
    <div key={value} className="flex gap-2">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Service" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm" />
      <button type="button" onClick={onRemove} className="rounded-xl border border-white/10 px-3 text-xs text-white/60 hover:text-white">✕</button>
    </div>
  );
}

function ServiceTagList({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const removeAt = (i: number) => {
    const newVals = [...values];
    newVals.splice(i, 1);
    onChange(newVals);
  };
  const addNew = () => onChange([...values, '']);
  return (
    <div className="grid gap-2">
      {values.map((v, i) => (
        <ServiceTag key={v} value={v} onRemove={() => removeAt(i)} onChange={(val) => {
          const newVals = [...values];
          newVals[i] = val;
          onChange(newVals);
        }} />
      ))}
      <button type="button" onClick={addNew} className="self-start rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white">+ Add</button>
    </div>
  );
}

/** Convert form state into the payload the backend expects */
function toPayload(form: FormState) {
  const clean = (arr: string[]) => arr.map(s => s.trim()).filter(Boolean);
  return {
    title: form.title.trim(),
    slug: form.slug.trim().toLowerCase(),
    client: form.client.trim(),
    industry: form.industry.trim(),
    category: form.category.trim() || null,
    shortDescription: form.shortDescription.trim() || null,
    services: clean(form.services),
    challenge: form.challenge.trim(),
    solution: form.solution.trim(),
    result: form.result.trim(),
    accent: form.accent.trim(),
    sortOrder: Number(form.sortOrder) || 0,
    isPublished: form.isPublished,
    status: form.status,
    featured: form.featured,
    projectDate: form.projectDate.trim() || null,
    projectUrl: form.projectUrl.trim() || null,
    metrics: typeof form.metrics === 'object' ? JSON.stringify(form.metrics) : form.metrics,
    gallery: typeof form.gallery === 'object' ? JSON.stringify(form.gallery) : form.gallery,
    imageUrl: form.imageUrl.trim() || null,
    imageAlt: form.imageAlt.trim() || null,
    imageWidth: form.imageWidth,
    imageHeight: form.imageHeight,
  };
}

export default function CaseStudies() {
  const [items, setItems] = useState<CaseStudyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<FullCaseStudy | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(0));
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/case-studies'); setItems(data.data); }
    catch { addToast('Failed to load case studies', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm(items.length)); setShow(true); };
  const openEdit = async (cs: CaseStudyRow) => {
    try {
      const { data } = await api.get(`/case-studies/${cs.id}`);
      const d: FullCaseStudy = data.data;
      setEditing(d);
      setForm({
        title: d.title,
        slug: d.slug,
        client: d.client,
        industry: d.industry,
        category: d.category || '',
        shortDescription: d.shortDescription || '',
        services: parseJsonArray(d.services).length ? parseJsonArray(d.services) : [''],
        challenge: d.challenge,
        solution: d.solution,
        result: d.result,
        accent: d.accent,
        imageUrl: d.imageUrl || '',
        imageAlt: d.imageAlt || '',
        imageWidth: d.imageWidth ?? null,
        imageHeight: d.imageHeight ?? null,
        sortOrder: d.sortOrder ?? 0,
        isPublished: !!d.isPublished,
        status: (d.status || 'DRAFT') as 'DRAFT' | 'PUBLISHED',
        featured: d.featured || false,
        projectDate: d.projectDate || '',
        projectUrl: d.projectUrl || '',
        metrics: d.metrics || {},
        gallery: d.gallery || [],
      });
      setShow(true);
    } catch { addToast('Failed to load case study details', 'error'); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.client.trim()) return addToast('Title, slug and client are required', 'error');
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (editing) await api.put(`/case-studies/${editing.id}`, payload);
      else await api.post('/case-studies', payload);
      addToast(editing ? 'Case study updated' : 'Case study created', 'success');
      setShow(false); load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string; details?: unknown } } })?.response?.data?.error || 'Save failed';
      addToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete case study? This removes it from Home.')) return;
    try { await api.delete(`/case-studies/${id}`); addToast('Case study deleted', 'success'); load(); }
    catch { addToast('Failed to delete case study', 'error'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Case Studies Management</h1>
          <p className="text-xs text-white/50">Manage case study cards shown on the Home page. Each card needs a header image (1920×1080, 16:9).</p>
        </div>
        <button onClick={openCreate} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600">New Case Study</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
            <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Image</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="px-4 py-8 text-center text-white/40">Loading…</td></tr>
            : items.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-white/40">No case studies — create your first one.</td></tr>
            : items.sort((a,b)=>a.sortOrder-b.sortOrder).map((cs) => (
              <tr key={cs.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-mono text-xs text-white/50">{String(cs.sortOrder + 1).padStart(2,'0')}</td>
                <td className="px-4 py-3 font-medium">{cs.title}</td>
                <td className="px-4 py-3 text-white/60">{cs.client}</td>
                <td className="px-4 py-3 text-white/60">{cs.category}</td>
                <td className="px-4 py-3">
                  {cs.imageUrl ? (
                    <img src={cs.imageUrl} alt={cs.imageAlt || 'preview'} className="h-12 w-auto rounded-lg object-cover border border-white/10" />
                  ) : (
                    <span className="text-white/30">No image</span>
                  )}
                </td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${cs.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{cs.isPublished ? 'Yes' : 'No'}</span></td>
                <td className="px-4 py-3 text-right space-x-2"><button onClick={() => openEdit(cs)} className="text-xs text-white/70 hover:text-white">Edit</button><button onClick={() => del(cs.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <form onSubmit={submit} className="my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#141414] p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Case Study' : 'New Case Study'}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">Preview number: {String((Number(form.sortOrder)||0)+1).padStart(2,'0')}</span>
            </div>

            {/* General fields */}
            <div className="mt-6 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-electric">General</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Title e.g. D2C Fashion Brand Scaling" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
                <input placeholder="slug e.g. d2c-fashion-scaling" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Client name e.g. D2C Fashion Brand" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
                <input placeholder="Industry e.g. E-commerce · D2C" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              </div>
              <input placeholder="Category (e.g. E‑commerce)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="Short description (tagline)" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} rows={2} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="Challenge description" value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} rows={3} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <textarea placeholder="Solution description" value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} rows={3} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <textarea placeholder="Result description" value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} rows={3} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <div className="grid gap-3 sm:grid-cols-3">
                <select value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm">
                  {DEFAULT_ACCENTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <input type="number" placeholder="Sort order (0 = 01)" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-sm"><input type="radio" checked={form.status === 'DRAFT'} onChange={e => setForm({ ...form, status: 'DRAFT' })} name="status" /> Draft</label>
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-sm"><input type="radio" checked={form.status === 'PUBLISHED'} onChange={e => setForm({ ...form, status: 'PUBLISHED' })} name="status" /> Published</label>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Mark as Featured
                </label>
                <textarea placeholder="Metrics JSON (key/value)" value={JSON.stringify(form.metrics)} onChange={e => setForm({ ...form, metrics: JSON.parse(e.target.value) })} rows={2} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm w-full" />
              </div>
              {/* Gallery preview */}
              {form.gallery && Array.isArray(form.gallery) && form.gallery.length > 0 && (
                <div className="mt-3 grid gap-2 row lg:grid-cols-3">
                  {form.gallery.slice(0, 3).map((g, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-2">
                      {g.url && <img src={g.url} alt={g.alt || 'gallery'} className="w-full h-24 object-cover rounded" />}
                      <span className="text-xs text-white/60 truncate">{g.alt || 'image'}</span>
                    </div>
                  ))}
                  {form.gallery.length > 3 && <p className="mt-1 text-xs text-white/50">+ {form.gallery.length - 3} more images</p>}
                </div>
              )}
              {/* Remove header image */}
              {editing && (
                <button
                  type="button"
                  className="mt-3 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:text-white"
                  onClick={() => {
                    if (!confirm('Remove header image?')) return;
                    setForm({ ...form, imageUrl: '', imageAlt: '', imageWidth: null, imageHeight: null });
                  }}
                >
                  Remove Image
                </button>
              )}
              {/* Upload helper - Header Image */}
              {editing && (
                <div className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/30">
                  <label className="cursor-pointer rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600 flex-1 text-center">
                    Upload Header Image
                    <input type="file" accept="image/webp,image/avif,image/jpeg,image/png,image/gif" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        fd.append('altText', file.name);
                        try {
                          const res = await api.post(`/case-studies/${editing.id}/image`, fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          const { url, width, height, warning } = res.data.imageUpload;
                          setForm(f => ({ ...f, imageUrl: url, imageAlt: file.name, imageWidth: width, imageHeight: height }));
                          if (warning) alert('Uploaded: ' + warning);
                        } catch (err: unknown) {
                          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload failed';
                          alert(msg);
                        }
                      }}
                    />
                  </label>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="preview" className="h-20 w-auto rounded-lg object-cover border border-white/10" />
                  )}
                </div>
              )}

              {/* Gallery Upload */}
              {editing && (
                <div className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/30">
                  <label className="cursor-pointer rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600 flex-1 text-center">
                    Upload Gallery Images (Multiple)
                    <input type="file" accept="image/webp,image/avif,image/jpeg,image/png,image/gif" className="hidden" multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const fd = new FormData();
                        Array.from(files).forEach(f => fd.append('files', f));
                        try {
                          const res = await api.post(`/case-studies/${editing.id}/gallery`, fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          // Reload to get updated gallery
                          const { data } = await api.get(`/case-studies/${editing.id}`);
                          setForm(f => ({ ...f, gallery: data.data.gallery ? JSON.parse(data.data.gallery as string) : [] }));
                        } catch (err: unknown) {
                          const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Gallery upload failed';
                          alert(msg);
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Gallery Preview */}
              {form.gallery && Array.isArray(form.gallery) && form.gallery.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {form.gallery.slice(0, 8).map((g, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-2 relative group">
                      {g.url && <img src={g.url} alt={g.alt || 'gallery'} className="w-full h-24 object-cover rounded" />}
                      <span className="text-xs text-white/60 truncate block mt-1">{g.alt || 'image'}</span>
                      <button
                        type="button"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 rounded-full bg-red-500/80 px-1.5 py-0.5 text-xs text-white hover:bg-red-500 transition-opacity"
                        onClick={() => {
                          const newGallery = form.gallery.filter((_g: unknown, idx: number) => idx !== i);
                          setForm({ ...form, gallery: newGallery });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {form.gallery.length > 8 && <p className="mt-1 text-xs text-white/50 col-span-full">+ {form.gallery.length - 8} more images</p>}
                </div>
              )}

              <div className="mt-8 flex justify-end gap-2"><button type="button" onClick={() => setShow(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" disabled={saving} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button></div>
              <p className="mt-3 text-center text-xs text-white/30">Saved case studies appear instantly on Home — both pull from the same API.</p>
            </div>
            </form>
          </div>
      )}
    </div>
  );
}