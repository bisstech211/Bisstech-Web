import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE = {
  name: 'BISSTECH',
  url: 'https://bisstech.com',
  tagline: 'Build. Grow. Automate.',
  description:
    'BISSTECH is a global digital growth, technology, AI & creative agency. We help ambitious businesses grow through digital marketing, high-performance websites, e-commerce & quick commerce management, AI automation and creative design.',
};

type SEOProps = {
  title: string;
  description?: string;
  path?: string;
};

/**
 * Lightweight per-route SEO — sets document title, meta description,
 * canonical, Open Graph and Twitter tags. Also resets scroll on navigation.
 */
export function SEO({ title, description = SITE.description, path }: SEOProps) {
  const location = useLocation();
  const fullTitle = title.includes('BISSTECH') ? title : `${title} | BISSTECH`;
  const url = `${SITE.url}${path ?? location.pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [fullTitle, description, url]);

  // Reset scroll on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

/** JSON-LD structured data injected once for the site. */
export function SiteStructuredData() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'site-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BISSTECH',
      url: SITE.url,
      slogan: SITE.tagline,
      description: SITE.description,
      sameAs: [
        'https://www.instagram.com/bisstech',
        'https://www.linkedin.com/company/bisstech',
        'https://www.facebook.com/bisstech',
        'https://wa.me/0000000000',
      ],
      makesOffer: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'App Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automation' } },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'E-commerce & Quick Commerce Management' },
        },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design' } },
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById('site-schema')?.remove();
    };
  }, []);
  return null;
}
