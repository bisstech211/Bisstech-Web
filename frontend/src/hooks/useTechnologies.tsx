import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

export type TechnologyItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  logoAlt: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TechnologyCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  items: TechnologyItem[];
  createdAt: string;
  updatedAt: string;
};

export type TechnologiesData = {
  categories: TechnologyCategory[];
  featuredItems: TechnologyItem[];
};

const DEFAULT_TECHNOLOGIES: TechnologiesData = {
  categories: [
    {
      id: 'marketing-analytics',
      name: 'Marketing & Analytics',
      slug: 'marketing-analytics',
      description: 'Tools for digital marketing, advertising, analytics and growth tracking',
      icon: 'TrendingUp',
      sortOrder: 0,
      isActive: true,
      items: [
        { id: '1', categoryId: 'marketing-analytics', name: 'Google Ads', slug: 'google-ads', description: 'Search, Display, YouTube and Performance Max advertising', logoUrl: 'https://ssl.gstatic.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png', logoAlt: 'Google Ads logo', websiteUrl: 'https://ads.google.com', sortOrder: 0, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '2', categoryId: 'marketing-analytics', name: 'Meta Ads', slug: 'meta-ads', description: 'Facebook, Instagram, Messenger and Audience Network advertising', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', logoAlt: 'Meta Ads logo', websiteUrl: 'https://business.facebook.com/adsmanager', sortOrder: 1, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '3', categoryId: 'marketing-analytics', name: 'Google Analytics 4', slug: 'google-analytics-4', description: 'Web and app analytics with event-based measurement', logoUrl: 'https://analytics.google.com/analytics/images/favicon.ico', logoAlt: 'Google Analytics 4 logo', websiteUrl: 'https://analytics.google.com', sortOrder: 2, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '4', categoryId: 'marketing-analytics', name: 'Search Console', slug: 'search-console', description: 'Google search performance and indexing monitoring', logoUrl: 'https://search.google.com/search-console/images/favicon.ico', logoAlt: 'Search Console logo', websiteUrl: 'https://search.google.com/search-console', sortOrder: 3, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '5', categoryId: 'marketing-analytics', name: 'GTM', slug: 'gtm', description: 'Google Tag Manager for tag management', logoUrl: 'https://www.gstatic.com/images/branding/product/1x/tagmanager_48dp.png', logoAlt: 'GTM logo', websiteUrl: 'https://tagmanager.google.com', sortOrder: 4, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '6', categoryId: 'marketing-analytics', name: 'Hotjar', slug: 'hotjar', description: 'Heatmaps, session recordings and user feedback', logoUrl: 'https://static.hotjar.com/images/hotjar-logo.png', logoAlt: 'Hotjar logo', websiteUrl: 'https://www.hotjar.com', sortOrder: 5, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '7', categoryId: 'marketing-analytics', name: 'SEMrush', slug: 'semrush', description: 'SEO, PPC, content and competitive research', logoUrl: 'https://www.semrush.com/static/logos/semrush-logo.svg', logoAlt: 'SEMrush logo', websiteUrl: 'https://www.semrush.com', sortOrder: 6, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '8', categoryId: 'marketing-analytics', name: 'Ahrefs', slug: 'ahrefs', description: 'SEO toolset for backlinks, keywords and content', logoUrl: 'https://ahrefs.com/favicon.ico', logoAlt: 'Ahrefs logo', websiteUrl: 'https://ahrefs.com', sortOrder: 7, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
      ],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'web-ecommerce',
      name: 'Web & E-commerce',
      slug: 'web-ecommerce',
      description: 'Frameworks, platforms and tools for web development and online commerce',
      icon: 'Code2',
      sortOrder: 1,
      isActive: true,
      items: [
        { id: '9', categoryId: 'web-ecommerce', name: 'React', slug: 'react', description: 'JavaScript library for building user interfaces', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', logoAlt: 'React logo', websiteUrl: 'https://react.dev', sortOrder: 0, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '10', categoryId: 'web-ecommerce', name: 'Next.js', slug: 'nextjs', description: 'React framework for production', logoUrl: 'https://nextjs.org/favicon.ico', logoAlt: 'Next.js logo', websiteUrl: 'https://nextjs.org', sortOrder: 1, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '11', categoryId: 'web-ecommerce', name: 'TypeScript', slug: 'typescript', description: 'Typed JavaScript at any scale', logoUrl: 'https://www.typescriptlang.org/favicon.ico', logoAlt: 'TypeScript logo', websiteUrl: 'https://www.typescriptlang.org', sortOrder: 2, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '12', categoryId: 'web-ecommerce', name: 'Node.js', slug: 'nodejs', description: 'JavaScript runtime built on Chrome\'s V8', logoUrl: 'https://nodejs.org/static/images/logo.svg', logoAlt: 'Node.js logo', websiteUrl: 'https://nodejs.org', sortOrder: 3, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '13', categoryId: 'web-ecommerce', name: 'Shopify', slug: 'shopify', description: 'E-commerce platform for online stores', logoUrl: 'https://cdn.shopify.com/s/assets/brand_assets/logo-28915c79a577d0f9d8ceb9a582e6c9d7.svg', logoAlt: 'Shopify logo', websiteUrl: 'https://www.shopify.com', sortOrder: 4, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '14', categoryId: 'web-ecommerce', name: 'WooCommerce', slug: 'woocommerce', description: 'Open-source e-commerce for WordPress', logoUrl: 'https://woocommerce.com/wp-content/uploads/2022/02/Logo.png', logoAlt: 'WooCommerce logo', websiteUrl: 'https://woocommerce.com', sortOrder: 5, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '15', categoryId: 'web-ecommerce', name: 'Webflow', slug: 'webflow', description: 'Visual web development platform', logoUrl: 'https://uploads-ssl.webflow.com/5e5d1f5e9e8c4f5d5b9e2f3a/5e5d1f5e9e8c4f5d5b9e2f3a_Webflow_Logo_Full_Color_RGB.svg', logoAlt: 'Webflow logo', websiteUrl: 'https://webflow.com', sortOrder: 6, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '16', categoryId: 'web-ecommerce', name: 'Vite', slug: 'vite', description: 'Next generation frontend tooling', logoUrl: 'https://vitejs.dev/logo.svg', logoAlt: 'Vite logo', websiteUrl: 'https://vitejs.dev', sortOrder: 7, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '17', categoryId: 'web-ecommerce', name: 'Tailwind CSS', slug: 'tailwind-css', description: 'Utility-first CSS framework', logoUrl: 'https://tailwindcss.com/favicon.ico', logoAlt: 'Tailwind CSS logo', websiteUrl: 'https://tailwindcss.com', sortOrder: 8, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
      ],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'ai-automation',
      name: 'AI & Automation',
      slug: 'ai-automation',
      description: 'AI models, automation platforms and intelligent workflow tools',
      icon: 'BrainCircuit',
      sortOrder: 2,
      isActive: true,
      items: [
        { id: '18', categoryId: 'ai-automation', name: 'OpenAI', slug: 'openai', description: 'GPT models, embeddings and AI APIs', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', logoAlt: 'OpenAI logo', websiteUrl: 'https://openai.com', sortOrder: 0, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '19', categoryId: 'ai-automation', name: 'Claude API', slug: 'claude-api', description: 'Anthropic\'s AI assistant API', logoUrl: 'https://www.anthropic.com/favicon.ico', logoAlt: 'Claude API logo', websiteUrl: 'https://www.anthropic.com/api', sortOrder: 1, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '20', categoryId: 'ai-automation', name: 'Make', slug: 'make', description: 'Visual workflow automation platform', logoUrl: 'https://www.make.com/en/logo', logoAlt: 'Make logo', websiteUrl: 'https://www.make.com', sortOrder: 2, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '21', categoryId: 'ai-automation', name: 'Zapier', slug: 'zapier', description: 'No-code automation connecting 5000+ apps', logoUrl: 'https://zapier.com/static/images/logo-zapier.svg', logoAlt: 'Zapier logo', websiteUrl: 'https://zapier.com', sortOrder: 3, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '22', categoryId: 'ai-automation', name: 'n8n', slug: 'n8n', description: 'Fair-code workflow automation tool', logoUrl: 'https://n8n.io/favicon.ico', logoAlt: 'n8n logo', websiteUrl: 'https://n8n.io', sortOrder: 4, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '23', categoryId: 'ai-automation', name: 'Chatbots', slug: 'chatbots', description: 'AI-powered conversational agents', logoUrl: '', logoAlt: 'Chatbots icon', websiteUrl: '', sortOrder: 5, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '24', categoryId: 'ai-automation', name: 'WhatsApp Business API', slug: 'whatsapp-business-api', description: 'Official WhatsApp business messaging', logoUrl: 'https://www.whatsappbrand.com/img/logo-icon/blue/whatsapp-icon-blue.png', logoAlt: 'WhatsApp Business API logo', websiteUrl: 'https://developers.facebook.com/docs/whatsapp', sortOrder: 6, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '25', categoryId: 'ai-automation', name: 'Custom Agents', slug: 'custom-agents', description: 'Tailored AI agents for specific workflows', logoUrl: '', logoAlt: 'Custom Agents icon', websiteUrl: '', sortOrder: 7, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
      ],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'design-creative',
      name: 'Design & Creative',
      slug: 'design-creative',
      description: 'Professional design tools for UI, graphics, video and creative work',
      icon: 'PenTool',
      sortOrder: 3,
      isActive: true,
      items: [
        { id: '26', categoryId: 'design-creative', name: 'Figma', slug: 'figma', description: 'Collaborative interface design tool', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', logoAlt: 'Figma logo', websiteUrl: 'https://www.figma.com', sortOrder: 0, isActive: true, isFeatured: true, createdAt: '', updatedAt: '' },
        { id: '27', categoryId: 'design-creative', name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Industry-standard image editing', logoUrl: '', logoAlt: 'Adobe Photoshop logo', websiteUrl: 'https://www.adobe.com/products/photoshop.html', sortOrder: 1, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '28', categoryId: 'design-creative', name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Vector graphics and illustration', logoUrl: '', logoAlt: 'Adobe Illustrator logo', websiteUrl: 'https://www.adobe.com/products/illustrator.html', sortOrder: 2, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '29', categoryId: 'design-creative', name: 'Premiere Pro', slug: 'premiere-pro', description: 'Professional video editing', logoUrl: '', logoAlt: 'Premiere Pro logo', websiteUrl: 'https://www.adobe.com/products/premiere.html', sortOrder: 3, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '30', categoryId: 'design-creative', name: 'After Effects', slug: 'after-effects', description: 'Motion graphics and visual effects', logoUrl: '', logoAlt: 'After Effects logo', websiteUrl: 'https://www.adobe.com/products/aftereffects.html', sortOrder: 4, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
        { id: '31', categoryId: 'design-creative', name: 'Canva', slug: 'canva', description: 'Online design and publishing tool', logoUrl: 'https://www.canva.com/static/images/favicon.ico', logoAlt: 'Canva logo', websiteUrl: 'https://www.canva.com', sortOrder: 5, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
      ],
      createdAt: '',
      updatedAt: '',
    },
  ],
  featuredItems: [],
};

type TechnologiesContextType = {
  data: TechnologiesData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<TechnologiesData>;
};

export const TechnologiesContext = createContext<TechnologiesContextType | null>(null);

export function TechnologiesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TechnologiesData>(DEFAULT_TECHNOLOGIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnologies = async () => {
    try {
      const [categoriesRes, featuredRes] = await Promise.all([
        api.get('/technologies/public'),
        api.get('/technologies/public/featured'),
      ]);

      const categories = (categoriesRes.data as TechnologyCategory[]) || [];
      const featuredItems = (featuredRes.data as TechnologyItem[]) || [];

      // Populate featured items in categories
      const categoriesWithFeatured = categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({
          ...item,
          isFeatured: featuredItems.some(f => f.id === item.id) || item.isFeatured,
        })),
      }));

      setData({ categories: categoriesWithFeatured, featuredItems });
      setError(null);
      return { categories: categoriesWithFeatured, featuredItems };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch technologies');
      setData(DEFAULT_TECHNOLOGIES);
      return DEFAULT_TECHNOLOGIES;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return (
    <TechnologiesContext.Provider value={{ data, loading, error, refresh: fetchTechnologies }}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export function useTechnologies() {
  const context = useContext(TechnologiesContext);
  if (!context) {
    throw new Error('useTechnologies must be used within a TechnologiesProvider');
  }
  return context;
}