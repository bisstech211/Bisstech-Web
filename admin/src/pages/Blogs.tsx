import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Post = { id: string; slug: string; title: string; status: string; featured: boolean; category?: { name: string } | null; updatedAt: string };
type Cat = { id: string; name: string; slug: string };

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', status: 'DRAFT', featured: false, categoryId: '', readingTime: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blog', { params: { page, limit: 10, search: q || undefined, status: status || undefined } });
      setPosts(data.data); setTotalPages(data.pagination.pages);
    } catch { /* ignore */ } finally { setLoading(false); }
  };
  const loadCats = async () => {
    try { const { data } = await api.get('/blog/categories/all'); setCats(data.data); } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, [page, status]);
  useEffect(() => { loadCats(); }, []);
  useEffect(() => { const t = setTimeout(() => { setPage(1); load(); }, 400); return () => clearTimeout(t); }, [q]);

  const openCreate = () => { setEditing(null); setForm({ title: '', slug: '', excerpt: '', content: '', status: 'DRAFT', featured: false, categoryId: '', readingTime: '' }); setShowForm(true); };
  const openEdit = async (p: Post) => {
    try {
      const { data } = await api.get(`/blog/${p.id}`);
      const d = data.data;
      setEditing(p); setForm({ title: d.title, slug: d.slug, excerpt: d.excerpt || '', content: d.content || '', status: d.status, featured: !!d.featured, categoryId: d.categoryId || '', readingTime: d.readingTime || '' });
      setShowForm(true);
    } catch { /* ignore */ }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, unknown> = { ...form, categoryId: form.categoryId || null };
      if (editing) await api.put(`/blog/${editing.id}`, payload);
      else await api.post('/blog', payload);
      setShowForm(false); load();
    } catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Save failed'); }
  };
  const del = async (id: string) => { if (!confirm('Delete this post?')) return; await api.delete(`/blog/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Blogs</h1>
        <button onClick={openCreate} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600">New Post</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title…" className="min-w-[220px] flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/40" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
          <option value="">All status</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="SCHEDULED">Scheduled</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">Loading…</td></tr> : posts.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No posts</td></tr> : posts.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3"><p className="font-medium line-clamp-1">{p.title}</p><p className="text-xs text-white/40">{p.slug}</p></td>
                <td className="px-4 py-3 text-white/60">{p.category?.name || '—'}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${p.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/60'}`}>{p.status}</span></td>
                <td className="px-4 py-3">{p.featured ? '★' : '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-xs text-white/70 hover:text-white">Edit</button>
                  <button onClick={() => del(p.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Prev</button>
        <span className="text-white/50">Page {page} / {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Next</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] p-6">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Post' : 'New Post'}</h2>
            <div className="mt-4 grid gap-3">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="slug (lowercase, hyphens)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="HTML content (supports h2/h3/p/ul/ol/blockquote/code/table)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm">
                  <option value="DRAFT">DRAFT</option><option value="PUBLISHED">PUBLISHED</option><option value="SCHEDULED">SCHEDULED</option>
                </select>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm">
                  <option value="">No category</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <input placeholder="Reading time e.g. 5 min read" value={form.readingTime} onChange={(e) => setForm({ ...form, readingTime: e.target.value })} className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button>
              <button type="submit" className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
