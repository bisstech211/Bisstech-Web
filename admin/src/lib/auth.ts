import { create } from 'zustand';

type User = { id: string; email: string; name: string; role: string };
type State = { user: User | null; setUser: (u: User | null) => void };

export const useAuth = create<State>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
}));
