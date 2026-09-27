import {
  TrendingUp,
  Code2,
  Smartphone,
  Wrench,
  BrainCircuit,
  ShoppingBag,
  PenTool,
  type LucideIcon,
} from 'lucide-react';

export type SubServiceGroup = {
  title: string;
  items: string[];
};

export type Service = {
  id: string;
  number: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** groups of sub-services, or a flat list via `extra` */
  groups: SubServiceGroup[];
  extra?: string[];
  benefits: string[];
  deliverables: string[];
  process: { step: string; detail: string }[];
  /** raw API row when hydrated from backend — useful for detail pages */
  _api?: unknown;
  /** Background image for service card (1600x1200, 4:3, WebP/AVIF) */
  backgroundImage?: string;
  backgroundImageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Banner image for service section accordion (1200x400, 16:9, WebP/AVIF) */
  bannerImage?: string;
  bannerImageAlt?: string;
  bannerImageWidth?: number | null;
  bannerImageHeight?: number | null;
};

export const SERVICES: Service[] = [
  {
    id: 'digital-marketing',
    number: '01',
    title: 'Digital Marketing',
    short: 'Visibility. Traffic. Leads. Revenue.',
    description:
      'Help businesses increase visibility, traffic, leads, customer acquisition and revenue through performance-driven digital marketing across search, social and paid media.',
    icon: TrendingUp,
    groups: [
      {
        title: 'SEO',
        items: [
          'Technical SEO',
          'On-Page SEO',
          'Off-Page SEO',
          'Local SEO',
          'Keyword Research',
          'Competitor Analysis',
          'Content SEO',
          'SEO Audits',
          'Website SEO Optimization',
          'Link Building',
          'Search Console & Analytics',
          'SEO Reporting',
        ],
      },
      {
        title: 'Meta Ads',
        items: [
          'Facebook Ads',
          'Instagram Ads',
          'Lead Generation Campaigns',
          'Conversion Campaigns',
          'E-commerce Ads',
          'Retargeting',
          'Remarketing',
          'Audience Research',
          'Creative Testing',
          'Campaign Optimization',
          'Pixel / Conversion Tracking',
          'Performance Reporting',
        ],
      },
      {
        title: 'Google Ads',
        items: [
          'Search Ads',
          'Display Ads',
          'Performance Max',
          'Shopping Ads',
          'YouTube Ads',
          'Remarketing',
          'Keyword Research',
          'Conversion Tracking',
          'Campaign Optimization',
          'Landing Page Strategy',
        ],
      },
      {
        title: 'Social Media Marketing',
        items: [
          'Social Media Strategy',
          'Content Planning',
          'Content Creation',
          'Instagram Marketing',
          'Facebook Marketing',
          'LinkedIn Marketing',
          'Social Media Management',
          'Community Engagement',
          'Social Media Growth',
          'Analytics & Reporting',
        ],
      },
    ],
    benefits: [
      'More qualified traffic to your website',
      'Higher conversion rates and lower acquisition cost',
      'A predictable, measurable lead pipeline',
      'Stronger brand presence across search and social',
    ],
    deliverables: [
      'Marketing strategy & channel roadmap',
      'Campaign setups, tracking & reporting dashboards',
      'Creative assets and ad copy',
      'Monthly performance reviews and optimization',
    ],
    process: [
      { step: 'Audit', detail: 'We analyze your market, competitors and current performance.' },
      { step: 'Strategy', detail: 'We define channels, positioning, budget and measurable targets.' },
      { step: 'Launch', detail: 'Campaigns, content and tracking go live with clean measurement.' },
      { step: 'Optimize', detail: 'We iterate on creative, targeting and bidding to scale what works.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'website-development',
    number: '02',
    title: 'Website Development',
    short: 'Fast, modern, conversion-driven websites.',
    description:
      'Design and develop modern, responsive, high-performance websites built around business goals and conversions — from marketing sites to custom web applications.',
    icon: Code2,
    groups: [
      {
        title: 'What We Build',
        items: [
          'Business Websites',
          'Corporate Websites',
          'Portfolio Websites',
          'Landing Pages',
          'E-commerce Websites',
          'SaaS Websites',
          'Agency Websites',
          'Personal Branding Websites',
          'Real Estate Websites',
          'Healthcare Websites',
          'Education Websites',
          'Restaurant Websites',
          'Service Business Websites',
          'Booking Websites',
          'Membership Websites',
          'Custom Web Applications',
        ],
      },
      {
        title: 'What We Cover',
        items: [
          'UI/UX Design',
          'Responsive Development',
          'Frontend Development',
          'Backend Development',
          'CMS Integration',
          'API Integration',
          'Payment Gateway Integration',
          'Database Development',
          'Authentication',
          'Admin Dashboard',
          'Performance Optimization',
          'SEO-Friendly Development',
          'Security',
          'Deployment',
          'Maintenance',
        ],
      },
    ],
    benefits: [
      'Fast, accessible and mobile-first experiences',
      'Built to convert visitors into customers',
      'Clean, scalable code you can grow with',
      'Search-engine-friendly from day one',
    ],
    deliverables: [
      'Design system & responsive UI',
      'Production-ready codebase & deployment',
      'CMS or admin dashboard as needed',
      'Documentation, training and maintenance plan',
    ],
    process: [
      { step: 'Discover', detail: 'We understand your audience, goals and brand.' },
      { step: 'Design', detail: 'We craft the UX and visual design in tight loops.' },
      { step: 'Build', detail: 'We develop with modern, performant, scalable technology.' },
      { step: 'Launch', detail: 'We test, optimize, deploy and support you post-launch.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'app-development',
    number: '03',
    title: 'App Development',
    short: 'Custom, scalable and high-performance mobile apps built for modern businesses.',
    description:
      'Design and develop modern, scalable, high-performance mobile applications for iOS and Android using Flutter and React Native. From concept to App Store and Play Store deployment — we build apps that grow with your business.',
    icon: Smartphone,
    groups: [
      {
        title: 'What We Build',
        items: [
          'iOS App Development',
          'Android App Development',
          'Cross-Platform Apps (Flutter / React Native)',
          'Progressive Web Apps (PWA)',
          'Enterprise Mobile Apps',
          'Consumer-Facing Apps',
          'On-Demand Service Apps',
          'E-commerce Mobile Apps',
          'SaaS Mobile Apps',
          'Healthcare & Fitness Apps',
          'FinTech & Payment Apps',
          'Social & Community Apps',
          'IoT & Wearable Apps',
          'AR/VR Experiences',
          'App Store & Play Store Deployment',
        ],
      },
      {
        title: 'What We Cover',
        items: [
          'UI/UX Design for Mobile',
          'Native & Cross-Platform Development',
          'Backend API Development',
          'Database Design & Integration',
          'Authentication & Security',
          'Push Notifications',
          'In-App Purchases & Subscriptions',
          'Payment Gateway Integration',
          'Analytics & Crash Reporting',
          'Performance Optimization',
          'Offline-First Architecture',
          'App Store Optimization (ASO)',
          'CI/CD Pipeline Setup',
          'Maintenance & Updates',
          'Legacy App Modernization',
        ],
      },
    ],
    benefits: [
      'Native performance with cross-platform efficiency',
      'Faster time-to-market with Flutter / React Native',
      'Scalable architecture that grows with your user base',
      'App Store & Play Store ready with ASO optimization',
    ],
    deliverables: [
      'Design system & interactive prototypes',
      'Production-ready source code (iOS / Android / Web)',
      'Backend APIs, database & admin dashboard',
      'App Store / Play Store deployment & launch support',
    ],
    extra: [
      'Flutter / React Native',
      'Firebase / Supabase / Custom Backend',
      'RevenueCat for Subscriptions',
      'Mixpanel / Amplitude Analytics',
      'TestFlight / Internal Testing',
    ],
    process: [
      { step: 'Discover', detail: 'We understand your users, goals and technical requirements.' },
      { step: 'Design', detail: 'We craft mobile-first UX and pixel-perfect UI in tight loops.' },
      { step: 'Build', detail: 'We develop with Flutter / React Native and a scalable backend.' },
      { step: 'Launch', detail: 'We test, optimize, submit to stores and support post-launch.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'software-development',
    number: '04',
    title: 'Software Development',
    short: 'Custom software solutions designed to streamline operations, solve complex business challenges and scale with your business.',
    description:
      'We design and develop scalable software solutions that simplify complex processes, improve efficiency and help businesses grow with technology built around their specific needs.',
    icon: Wrench,
    groups: [
      {
        title: 'What We Build',
        items: [
          'Custom Software Development',
          'Business Management Software',
          'CRM Development',
          'ERP Development',
          'Inventory Management Systems',
          'Billing & Invoicing Software',
          'Business Automation Software',
          'SaaS Product Development',
          'Web Application Development',
          'Admin Dashboard Development',
          'Reporting & Analytics Systems',
          'Cloud-Based Software Solutions',
        ],
      },
      {
        title: 'What We Cover',
        items: [
          'API Development & Integration',
          'Database Development',
          'Third-Party Integrations',
          'User Authentication & Role Management',
          'Software Maintenance & Support',
        ],
      },
    ],
    benefits: [
      'Software that fits your business, not a one-size-fits-all product',
      'Complex processes simplified into one streamlined system',
      'Real-time visibility across operations and performance',
      'A scalable foundation that grows with your business',
    ],
    deliverables: [
      'Discovery & technical architecture document',
      'Design system & interactive prototypes',
      'Production-ready source code & documentation',
      'Deployment, training & ongoing support plan',
    ],
    extra: [
      'Custom Software Development',
      'SaaS Product Development',
      'Web Application Development',
      'API Development & Integration',
      'Cloud-Based Software Solutions',
      'Software Maintenance & Support',
    ],
    process: [
      { step: 'Discover', detail: 'We map your processes, goals and technical requirements.' },
      { step: 'Design', detail: 'We architect the system and craft the UX in tight loops.' },
      { step: 'Build', detail: 'We develop with modern, scalable, well-tested technology.' },
      { step: 'Launch', detail: 'We deploy, train your team and support you post-launch.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'ecommerce-management',
    number: '06',
    title: 'E-commerce & Quick Commerce Management',
    short: 'Build, manage and scale online commerce.',
    description:
      'Help brands build, manage and scale their online commerce operations — across their own store, marketplaces and quick-commerce platforms.',
    icon: ShoppingBag,
    groups: [
      {
        title: 'E-commerce Management',
        items: [
          'Store Setup',
          'Product Listing',
          'Product Optimization',
          'Inventory Management',
          'Order Management',
          'Customer Management',
          'Store Optimization',
          'Conversion Optimization',
          'Analytics',
          'Sales Reporting',
        ],
      },
      {
        title: 'Marketplace Management',
        items: ['Amazon', 'Flipkart', 'Meesho', 'Other relevant marketplaces'],
      },
      {
        title: 'Quick Commerce',
        items: ['Blinkit', 'Zepto', 'Swiggy Instamart', 'Other relevant quick-commerce platforms'],
      },
    ],
    extra: [
      'Product Catalog Management',
      'Pricing Strategy',
      'Promotions',
      'Performance Monitoring',
      'Marketplace Ads',
      'Sales Optimization',
      'Reporting',
    ],
    benefits: [
      'A managed store that is always shoppable and optimized',
      'Higher conversion and average order value',
      'Presence across the platforms your customers actually use',
      'Clean inventory, orders and reporting across channels',
    ],
    deliverables: [
      'Store & catalog setup across chosen channels',
      'Pricing, promotion and listing playbooks',
      'Daily operations and order/inventory management',
      'Sales dashboards and growth reporting',
    ],
    process: [
      { step: 'Setup', detail: 'Store, catalog, payments and tracking are configured cleanly.' },
      { step: 'Optimize', detail: 'Listings, pricing and pages are tuned for conversion.' },
      { step: 'Manage', detail: 'Day-to-day operations run smoothly and reliably.' },
      { step: 'Scale', detail: 'We expand channels and promotions to grow revenue.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'ai-automation',
    number: '06',
    title: 'AI Automation',
    short: 'Smarter workflows. Less repetitive work.',
    description:
      'Use AI and automation to reduce repetitive work, improve efficiency and build smarter business workflows — from chatbots to custom AI agents.',
    icon: BrainCircuit,
    groups: [
      {
        title: 'AI & Chatbots',
        items: [
          'AI Chatbots',
          'WhatsApp Automation',
          'Custom AI Agents',
          'AI Lead Qualification',
        ],
      },
      {
        title: 'Automation',
        items: [
          'Lead Automation',
          'Customer Support Automation',
          'Sales Automation',
          'CRM Automation',
          'Workflow Automation',
          'Automated Follow-ups',
          'Email Automation',
          'Document Automation',
          'Business Process Automation',
        ],
      },
      {
        title: 'AI Systems',
        items: ['AI Content Automation', 'AI Data Processing', 'API Integrations', 'AI-powered dashboards'],
      },
    ],
    benefits: [
      'Hours of manual work replaced every week',
      'Faster response times and happier customers',
      'Leads captured, qualified and followed up automatically',
      'Data flowing through your business without busywork',
    ],
    deliverables: [
      'Automation audit & opportunity map',
      'Working AI chatbots / agents tuned to your business',
      'Integrations between your tools and platforms',
      'Documentation, training and ongoing support',
    ],
    process: [
      { step: 'Map', detail: 'We find the repetitive work worth automating first.' },
      { step: 'Design', detail: 'We architect the flow, data and AI behavior.' },
      { step: 'Build', detail: 'We ship the automation with careful testing.' },
      { step: 'Improve', detail: 'We monitor performance and keep improving outputs.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'graphic-design',
    number: '07',
    title: 'Graphic Design',
    short: 'Brands and creatives that stand out.',
    description:
      'Premium design across brand identity, social media, marketing and digital — so every touchpoint looks intentional, professional and on-brand.',
    icon: PenTool,
    groups: [
      {
        title: 'Brand Identity',
        items: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Typography System', 'Color System'],
      },
      {
        title: 'Social Media Design',
        items: [
          'Instagram Posts',
          'Facebook Creatives',
          'LinkedIn Creatives',
          'Social Media Campaign Designs',
          'Ad Creatives',
          'Carousel Designs',
        ],
      },
      {
        title: 'Marketing Design',
        items: [
          'Brochures',
          'Flyers',
          'Posters',
          'Banners',
          'Presentation Design',
          'Promotional Creatives',
        ],
      },
      {
        title: 'Digital Design',
        items: ['Website Graphics', 'UI Visuals', 'Landing Page Graphics', 'Ad Banners', 'Campaign Visuals'],
      },
    ],
    benefits: [
      'A consistent, recognizable brand identity',
      'Creatives built for performance, not just looks',
      'Assets ready for every platform and campaign',
      'Design that earns trust and drives engagement',
    ],
    deliverables: [
      'Brand identity systems & guidelines',
      'Social media and ad creative packs',
      'Print and marketing collateral',
      'Digital and web-ready visuals',
    ],
    process: [
      { step: 'Brief', detail: 'We clarify goals, audience and direction.' },
      { step: 'Concept', detail: 'We explore strong, on-brand creative directions.' },
      { step: 'Refine', detail: 'We polish the chosen direction into production assets.' },
      { step: 'Deliver', detail: 'You receive organized, ready-to-use files.' },
    ],
    backgroundImage: '',
    backgroundImageAlt: '',
    imageWidth: 1600,
    imageHeight: 1200,
  },
];

export const SERVICE_HIGHLIGHTS = [
  {
    label: 'SEO & Search',
    items: ['Technical SEO', 'On-Page / Off-Page SEO', 'Local SEO', 'Keyword Research', 'Content SEO', 'SEO Audits'],
  },
  {
    label: 'Paid Media',
    items: ['Meta Ads', 'Google Ads', 'YouTube Ads', 'Performance Max', 'Retargeting', 'Conversion Tracking'],
  },
  {
    label: 'Social',
    items: ['Instagram', 'Facebook', 'LinkedIn', 'Content Strategy', 'Community Management', 'Social Growth'],
  },
  {
    label: 'Web & E-commerce',
    items: ['Web Development', 'E-commerce Stores', 'Marketplaces', 'Quick Commerce', 'Payment Integration', 'Conversion Optimization'],
  },
  {
    label: 'AI & Automation',
    items: ['AI Chatbots', 'WhatsApp Automation', 'Lead Automation', 'Workflow Automation', 'Custom AI Agents', 'CRM Automation'],
  },
  {
    label: 'Design',
    items: ['Brand Identity', 'Logo Design', 'Social Creatives', 'Ad Design', 'Marketing Collateral', 'UI Visuals'],
  },
];
