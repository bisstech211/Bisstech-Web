import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    __lenis?: { scrollTo: (target: number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void };
  }
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      // fallback smooth for browsers that honour it
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* noop */ }
    }
  }, [pathname]);
  return null;
}
