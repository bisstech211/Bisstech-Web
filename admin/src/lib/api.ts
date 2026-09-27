import axios from 'axios';

// Use relative path so requests go through Vite proxy (/api → http://127.0.0.1:4000)
export const api = axios.create({ baseURL: '/api/v1' });

// Refresh token queue to prevent concurrent refresh requests
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config as { _retry?: boolean } & typeof error.config;
    if (error.response?.status === 401 && !original._retry && localStorage.getItem('refreshToken')) {
      original._retry = true;

      // Single-flight refresh: if a refresh is already in progress, wait for it
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken: localStorage.getItem('refreshToken') });
            const newToken = data.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            return newToken;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);