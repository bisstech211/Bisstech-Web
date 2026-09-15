import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Users, Settings, LogOut, Image as ImageIcon, MessageSquare, Globe, Link2, Shield, Activity, Webhook, Mail } from 'lucide-react';
import { useAuth } from '../lib/auth';

const nav = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Blogs', path: '/blogs', icon: FileText },
  { label: 'Services', path: '/services', icon: Briefcase },
  { label: 'Leads', path: '/leads', icon: MessageSquare },
  { label: 'Newsletter', path: '/newsletter', icon: Mail },
  { label: 'Media', path: '/media', icon: ImageIcon },
  { label: 'Pages', path: '/pages', icon: Globe },
  { label: 'SEO', path: '/seo', icon: Link2 },
  { label: 'Tracking', path: '/tracking', icon: Activity },
  { label: 'Webhooks', path: '/webhooks', icon: Webhook },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Audit Logs', path: '/audit', icon: Shield },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Layout() {
  const { setUser } = useAuth();
  const nav2 = useNavigate();
  const logout = () => { localStorage.clear(); setUser(null); nav2('/login'); };
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#111] lg:flex">
        <div className="px-6 py-6 text-lg font-bold tracking-tight">BISSTECH <span className="text-electric">Admin</span></div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#111] px-4 lg:px-6">
          <span className="text-sm text-white/60 lg:hidden">BISSTECH Admin</span>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={logout} className="text-sm text-white/60 hover:text-white">Logout</button>
          </div>
        </header>
        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 bg-[#111] p-2 lg:hidden">
          {nav.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-1 text-xs ${isActive ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
