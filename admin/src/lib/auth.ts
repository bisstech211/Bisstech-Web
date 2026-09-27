import { create } from 'zustand';
import { api } from './api';

type User = { id: string; email: string; name: string; role: string };
type State = {
  user: User | null;
  setUser: (u: User | null) => void;
  validateAuth: () => Promise<boolean>;
  logout: () => void;
};

export const useAuth = create<State>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  validateAuth: async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      set({ user: null });
      localStorage.removeItem('user');
      return false;
    }
    try {
      const { data } = await api.get('/auth/me');
      if (data.data) {
        const user = data.data;
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
        return true;
      }
      throw new Error('Invalid response');
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));