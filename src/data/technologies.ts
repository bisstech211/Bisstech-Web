export type TechCategory = {
  category: string;
  items: string[];
};

export const TECHNOLOGIES: TechCategory[] = [
  {
    category: 'Marketing & Analytics',
    items: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'Search Console', 'GTM', 'Hotjar', 'SEMrush', 'Ahrefs'],
  },
  {
    category: 'Web & E-commerce',
    items: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Shopify', 'WooCommerce', 'Webflow', 'Vite', 'Tailwind CSS'],
  },
  {
    category: 'AI & Automation',
    items: ['OpenAI', 'Claude API', 'Make', 'Zapier', 'n8n', 'Chatbots', 'WhatsApp Business API', 'Custom Agents'],
  },
  {
    category: 'Design & Creative',
    items: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Premiere Pro', 'After Effects', 'Canva'],
  },
];

export const STACK_HIGHLIGHTS = [
  'React & TypeScript',
  'Tailwind CSS',
  'Three.js / R3F',
  'Framer Motion',
  'Google Ads & Meta Ads',
  'Shopify & WooCommerce',
  'OpenAI & Claude',
  'Make & Zapier',
];
