import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type User = { id: string; email: string; name: string; role: string; isActive: boolean; createdAt: string };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'EDITOR' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/users'); setUsers(data.data); } catch (e: unknown) { const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error; if (msg) alert(msg); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/users', form); setShow(false); setForm({ email: '', password: '', name: '', role: 'EDITOR' }); load(); }
    catch (err: unknown) { alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Create failed'); }
  };
  const toggleActive = async (u: User) => { await api.patch(`/users/${u.id}`, { isActive: !u.isActive }); load(); };
  const changeRole = async (u: User, role: string) => { await api.patch(`/users/${u.id}`, { role }); load(); };
  const del = async (id: string) => { if (!confirm('Delete user?')) return; try { await api.delete(`/users/${id}`); load(); } catch (e: unknown) { alert((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Delete failed'); } };
  const resetPw = async (id: string) => {
    const pw = prompt('New password (min 8 chars):'); if (!pw) return;
    try { await api.post(`/users/${id}/reset-password`, { password: pw }); alert('Password reset'); } catch (e: unknown) { alert((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Reset failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Users & Roles</h1><button onClick={() => setShow(true)} className="rounded-full bg-electric px-5 py-2 text-sm font-semibold text-white">New User</button></div>
      <p className="text-xs text-white/40">Roles: SUPER_ADMIN · ADMIN · EDITOR · MARKETING · SUPPORT. Only SUPER_ADMIN/ADMIN can manage users (enforced server-side).</p>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Active</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="px-4 py-8 text-center text-white/40">Loading…</td></tr> : users.length===0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-white/40">No users</td></tr> : users.map(u=>(
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-white/50">{u.email}</p></td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={(e)=>changeRole(u, e.target.value)} className="rounded-full bg-white/10 px-2 py-1 text-xs">
                    {['SUPER_ADMIN','ADMIN','EDITOR','MARKETING','SUPPORT'].map(r=><option key={r} value={r} className="bg-[#141414]">{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><button onClick={()=>toggleActive(u)} className={`rounded-full px-2 py-1 text-xs ${u.isActive?'bg-emerald-500/20 text-emerald-300':'bg-white/10 text-white/50'}`}>{u.isActive?'Active':'Disabled'}</button></td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={()=>resetPw(u.id)} className="text-xs text-white/70 hover:text-white">Reset PW</button>
                  <button onClick={()=>del(u.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={create} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-6">
            <h3 className="font-semibold">New User</h3>
            <div className="mt-4 grid gap-3">
              <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <input placeholder="Password (min 8)" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" required />
              <select value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm">
                <option value="EDITOR">EDITOR</option><option value="ADMIN">ADMIN</option><option value="SUPER_ADMIN">SUPER_ADMIN</option><option value="MARKETING">MARKETING</option><option value="SUPPORT">SUPPORT</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setShow(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm">Cancel</button><button type="submit" className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Create</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
