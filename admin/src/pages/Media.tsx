import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';

type MediaItem = { id: string; filename: string; originalName: string; url: string; mimeType: string; size: number; createdAt: string; altText?: string; folder?: string };

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/media', { params: { page, limit: 24, search: q || undefined } });
      setItems(data.data); setPages(data.pagination.pages);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); load(); }, 400); return () => clearTimeout(t); }, [q]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append('files', f);
    try { await api.post('/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); load(); } catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload failed'); }
    if (inputRef.current) inputRef.current.value = '';
  };
  const del = async (id: string) => { if (!confirm('Delete file?')) return; await api.delete(`/media/${id}`); load(); };
  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); alert('URL copied'); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Media Library</h1>
        <label className="cursor-pointer rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white hover:bg-electric-600">
          Upload
          <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={upload} />
        </label>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search filename…" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm placeholder:text-white/40" />
      {loading ? <p className="py-8 text-center text-sm text-white/40">Loading…</p> : items.length === 0 ? <p className="py-8 text-center text-sm text-white/40">No media yet</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="aspect-[4/3] overflow-hidden bg-black/40">
                {m.mimeType.startsWith('image/') ? <img src={m.url} alt={m.originalName} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-xs text-white/40">{m.mimeType}</div>}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium">{m.originalName}</p>
                <p className="text-[11px] text-white/40">{(m.size / 1024).toFixed(1)} KB · {m.folder}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => copyUrl(m.url)} className="rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/5">Copy URL</button>
                  <button onClick={() => del(m.id)} className="ml-auto text-xs text-red-300 hover:text-red-200">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Prev</button>
        <span className="text-white/50">Page {page} / {pages||1}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
