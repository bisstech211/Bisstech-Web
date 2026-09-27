/**
 * Case studies — placeholder content.
 * Replace `client`, `industry`, `services`, `challenge`, `solution` and `result`
 * with real project data when available. `result` uses a descriptive outcome,
 * never fabricated metrics.
 */

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  result: string;
  accent: string; // tailwind-ish gradient hint for the card visual
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'd2c-fashion-scaling',
    client: 'D2C Fashion Brand',
    industry: 'E-commerce · D2C',
    services: ['Digital Marketing', 'E-commerce Management', 'Meta Ads'],
    challenge:
      'A growing direct-to-consumer fashion label wanted to scale online sales beyond a single marketplace and build a stronger owned channel.',
    solution:
      'We launched a conversion-focused storefront, structured catalog, and a full-funnel Meta ads system with creative testing and retargeting.',
    result:
      'The brand gained a scalable sales engine — a measurable lift in store sessions, qualified orders and a repeatable acquisition playbook.',
    accent: 'from-coffee/60 to-espresso-700/40',
  },
  {
    slug: 'saas-lead-automation',
    client: 'SaaS Platform',
    industry: 'B2B Software',
    services: ['Website Development', 'AI Automation', 'SEO'],
    challenge:
      'A B2B SaaS team was losing leads to slow follow-up and an outdated website with low conversion.',
    solution:
      'We rebuilt a high-performance, SEO-friendly site, added a self-qualifying AI lead bot and automated instant follow-up workflows.',
    result:
      'Faster response times, a steady stream of qualified pipeline, and a marketing site that now converts visitors into demos.',
    accent: 'from-coffee/50 to-espresso-700/20',
  },
  {
    slug: 'quick-commerce-ops',
    client: 'Food & Beverage Brand',
    industry: 'Quick Commerce · FMCG',
    services: ['Quick Commerce Management', 'Marketplace Management', 'Graphic Design'],
    challenge:
      'A food brand wanted to be found and purchased on quick-commerce platforms but had no presence, catalog or content in place.',
    solution:
      'We set up and managed catalog, pricing and promotional calendars across Blinkit, Zepto and Instamart, with on-brand creative assets.',
    result:
      'The brand is now consistently live and shoppable across quick-commerce — with clean operations and steady repeat purchase.',
    accent: 'from-espresso-700/60 to-coffee/30',
  },
  {
    slug: 'local-service-growth',
    client: 'Local Services Business',
    industry: 'Local Services · Healthcare',
    services: ['SEO', 'Google Ads', 'Website Development'],
    challenge:
      'A local services business relied on word-of-mouth and wanted to dominate local search for high-intent service queries.',
    solution:
      'We built a fast, local-SEO site, optimized Google Business Profile, and ran tightly targeted Google Ads with call tracking.',
    result:
      'The business now appears prominently in local results with a measurable increase in calls and booked appointments.',
    accent: 'from-coffee/40 to-transparent',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'BISSTECH rebuilt our website and took over our ads. The difference in the quality of leads and the speed of our team is night and day. They feel like a true growth partner.',
    name: 'Founder, D2C Brand',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'The automation they set up for us saves hours every single week. Leads get qualified and followed up without us lifting a finger. Professional, fast, reliable.',
    name: 'Operations Lead, B2B SaaS',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'From branding to marketplace management, everything feels designed and intentional. Our store finally looks and performs like a serious brand.',
    name: 'Owner, F&B Brand',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'Our organic traffic doubled within three months after their SEO overhaul. Technical fixes, content strategy, and link building — all handled end to end.',
    name: 'Marketing Director, EdTech Startup',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'The AI chatbot they deployed handles 70% of inbound inquiries automatically. Our support team now focuses only on complex cases. Massive time savings.',
    name: 'COO, Logistics Platform',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'Meta Ads ROAS went from 1.8x to 4.2x in six weeks. Creative testing framework, audience segmentation, and budget pacing — finally a system that scales.',
    name: 'Growth Lead, Wellness D2C',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'Quick commerce catalog went live on Blinkit, Zepto, and Instamart in two weeks. Flawless onboarding, pricing sync, and promo calendar management.',
    name: 'Category Manager, Beverage Brand',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'The brand identity system they delivered gives us consistency across every touchpoint — web, social, packaging, ads. Our team finally has clear guidelines.',
    name: 'Creative Director, Fintech Company',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'Their software team built our entire internal dashboard in eight weeks. Clean architecture, weekly demos, and zero scope drift. The product just works.',
    name: 'CTO, PropTech Startup',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'Google Ads campaigns restructured by BISSTECH cut our CPA by 38% while keeping volume steady. Bid strategy and negative-keyword hygiene made the difference.',
    name: 'Performance Marketer, InsurTech',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'The rebrand and packaging redesign gave us shelf presence we never had. Sales team says prospects now recognise us before they read the label.',
    name: 'Founder, Premium Skincare',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
  {
    quote:
      'E-commerce migration to a headless stack lifted checkout conversion from 1.9% to 3.4%. Page speed and mobile UX were the real levers.',
    name: 'E-commerce Director, Home Decor',
    role: 'Illustrative testimonial placeholder — replace with a real client quote.',
  },
];

export const CLIENT_MARQUEE = [
  'Digital Marketing',
  'Web Development',
  'E-commerce',
  'Quick Commerce',
  'AI Automation',
  'Graphic Design',
  'SEO',
  'Meta Ads',
  'Google Ads',
  'Branding',
];
