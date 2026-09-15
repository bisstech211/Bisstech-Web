import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Service = { id: string; slug: string; title: string; shortDesc?: string; isPublished: boolean; sortOrder: number };

export default function Services() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', shortDesc: '', description: '', icon: '', sortOrder: 0, isPublished: true });

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/services'); setItems(data.data); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', slug: '', shortDesc: '', description: '', icon: '', sortOrder: items.length, isPublished: true }); setShow(true); };
  const openEdit = async (s: Service) => {
    try {
      const { data } = await api.get(`/services/${s.id}`);
      const d = data.data;
      setEditing(s); setForm({ title: d.title, slug: d.slug, shortDesc: d.shortDesc || '', description: d.description || '', icon: d.icon || '', sortOrder: d.sortOrder || 0, isPublished: !!d.isPublished }); setShow(true);
    } catch {}
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/services/${editing.id}`, form);
      else await api.post('/services', form);
      setShow(false); load();
    } catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Save failed'); }
  };
  const del = async (id: string) => { if (!confirm('Delete service?')) return; await api.delete(`/services/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Services</h1><button onClick={openCreate} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white">New Service</button></div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="px-4 py-8 text-center text-white/40">Loading…</td></tr> : items.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-white/40">No services</td></tr> : items.map((s) => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-medium">{s.title}</td><td className="px-4 py-3 text-white/60">{s.slug}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${s.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{s.isPublished ? 'Yes' : 'No'}</span></td>
                <td className="px-4 py-3 text-right space-x-2"><button onClick={() => openEdit(s)} className="text-xs text-white/70 hover:text-white">Edit</button><button onClick={() => del(s.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={submit} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141414] p-6">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Service' : 'New Service'}</h2>
            <div className="mt-4 grid gap-3">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Short description" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="Full description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Icon (lucide name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                <input type="number" placeholder="Sort order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShow(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
