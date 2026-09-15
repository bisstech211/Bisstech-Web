import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Section = { id: string; key: string; title?: string; subtitle?: string; content?: string; imageUrl?: string; ctaLabel?: string; ctaLink?: string; sortOrder: number; isVisible: boolean };
type Page = { id: string; slug: string; title: string; description?: string; isPublished: boolean; sections: Section[] };

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Page | null>(null);
  const [showPage, setShowPage] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [pageForm, setPageForm] = useState({ slug: '', title: '', description: '' });
  const [sectionForm, setSectionForm] = useState({ key: '', title: '', subtitle: '', content: '', imageUrl: '', ctaLabel: '', ctaLink: '', sortOrder: 0, isVisible: true });
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const load = async () => {
    const { data } = await api.get('/settings/pages');
    setPages(data.data);
    if (selected) { const f = data.data.find((p: Page) => p.id === selected.id); if (f) setSelected(f); }
  };
  useEffect(() => { load(); }, []);

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/settings/pages', pageForm);
    setShowPage(false); setPageForm({ slug: '', title: '', description: '' }); load();
  };

  const createOrUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (editingSection) await api.put(`/settings/sections/${editingSection.id}`, sectionForm);
    else await api.post(`/settings/pages/${selected.id}/sections`, sectionForm);
    setShowSection(false); setEditingSection(null); setSectionForm({ key: '', title: '', subtitle: '', content: '', imageUrl: '', ctaLabel: '', ctaLink: '', sortOrder: 0, isVisible: true }); load();
  };
  const deleteSection = async (id: string) => { if (!confirm('Delete section?')) return; await api.delete(`/settings/sections/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Pages & Sections</h1><button onClick={() => setShowPage(true)} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white">New Page</button></div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-white/50">Pages</p>
          <div className="mt-2 space-y-1">
            {pages.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${selected?.id === p.id ? 'bg-white text-black' : 'hover:bg-white/5 text-white/80'}`}>
                <p className="font-medium">{p.title}</p><p className="text-xs opacity-60">/{p.slug} · {p.sections.length} sections</p>
              </button>
            ))}
            {pages.length === 0 && <p className="px-3 py-4 text-sm text-white/40">No pages</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          {!selected ? <p className="py-12 text-center text-sm text-white/40">Select a page</p> : (
            <>
              <div className="flex items-center justify-between"><h2 className="font-semibold">{selected.title} <span className="text-sm text-white/50">/{selected.slug}</span></h2><button onClick={() => { setEditingSection(null); setSectionForm({ key: '', title: '', subtitle: '', content: '', imageUrl: '', ctaLabel: '', ctaLink: '', sortOrder: selected.sections.length, isVisible: true }); setShowSection(true); }} className="rounded-full border border-white/15 px-4 py-1.5 text-xs hover:bg-white/5">Add Section</button></div>
              <div className="mt-4 space-y-2">
                {selected.sections.length === 0 && <p className="text-sm text-white/40">No sections yet</p>}
                {selected.sections.sort((a,b)=>a.sortOrder-b.sortOrder).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    <div><p className="text-sm font-medium">{s.key} {s.title ? `— ${s.title}` : ''}</p><p className="text-xs text-white/40">Order {s.sortOrder} · {s.isVisible ? 'Visible' : 'Hidden'}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingSection(s); setSectionForm({ key: s.key, title: s.title||'', subtitle: s.subtitle||'', content: s.content||'', imageUrl: s.imageUrl||'', ctaLabel: s.ctaLabel||'', ctaLink: s.ctaLink||'', sortOrder: s.sortOrder, isVisible: s.isVisible }); setShowSection(true); }} className="text-xs text-white/70 hover:text-white">Edit</button>
                      <button onClick={() => deleteSection(s.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={createPage} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-6">
            <h3 className="font-semibold">New Page</h3>
            <div className="mt-4 grid gap-3">
              <input placeholder="slug (e.g. home)" value={pageForm.slug} onChange={(e)=>setPageForm({...pageForm, slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Title" value={pageForm.title} onChange={(e)=>setPageForm({...pageForm, title:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Description" value={pageForm.description} onChange={(e)=>setPageForm({...pageForm, description:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setShowPage(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Create</button></div>
          </form>
        </div>
      )}
      {showSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={createOrUpdateSection} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] p-6">
            <h3 className="font-semibold">{editingSection ? 'Edit Section' : 'Add Section'}</h3>
            <p className="text-xs text-white/50">Keys: hero, stats, whyUs, process, portfolio, testimonials, cta, faq, etc.</p>
            <div className="mt-4 grid gap-3">
              <input placeholder="key (hero)" value={sectionForm.key} onChange={(e)=>setSectionForm({...sectionForm, key:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Title" value={sectionForm.title} onChange={(e)=>setSectionForm({...sectionForm, title:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <input placeholder="Subtitle" value={sectionForm.subtitle} onChange={(e)=>setSectionForm({...sectionForm, subtitle:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <textarea placeholder="Content (JSON or text)" value={sectionForm.content} onChange={(e)=>setSectionForm({...sectionForm, content:e.target.value})} rows={4} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <input placeholder="Image URL" value={sectionForm.imageUrl} onChange={(e)=>setSectionForm({...sectionForm, imageUrl:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
              <div className="grid grid-cols-2 gap-3"><input placeholder="CTA label" value={sectionForm.ctaLabel} onChange={(e)=>setSectionForm({...sectionForm, ctaLabel:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" /><input placeholder="CTA link" value={sectionForm.ctaLink} onChange={(e)=>setSectionForm({...sectionForm, ctaLink:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" /></div>
              <div className="flex gap-3"><input type="number" value={sectionForm.sortOrder} onChange={(e)=>setSectionForm({...sectionForm, sortOrder: parseInt(e.target.value)||0})} className="w-24 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sectionForm.isVisible} onChange={(e)=>setSectionForm({...sectionForm, isVisible:e.target.checked})} /> Visible</label></div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>{setShowSection(false); setEditingSection(null);}} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
