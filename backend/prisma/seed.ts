import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Full rich seed — mirrors frontend/src/data/services.ts but lives in DB.
// Frontend and Admin both consume /api/v1/services/public as single source of truth.
const RICH_SERVICES: Array<{
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: string;
  sortOrder: number;
  benefits: string[];
  deliverables: string[];
  extra: string[];
  features: Array<{ groupTitle: string; items: string[] }>;
  processes: Array<{ step: string; detail: string }>;
  faqs: Array<{ question: string; answer: string }>;
}> = [
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    shortDesc: 'Visibility. Traffic. Leads. Revenue.',
    description: 'Help businesses increase visibility, traffic, leads, customer acquisition and revenue through performance-driven digital marketing across search, social and paid media.',
    icon: 'TrendingUp',
    sortOrder: 0,
    features: [
      { groupTitle: 'SEO', items: ['Technical SEO','On-Page SEO','Off-Page SEO','Local SEO','Keyword Research','Competitor Analysis','Content SEO','SEO Audits','Website SEO Optimization','Link Building','Search Console & Analytics','SEO Reporting'] },
      { groupTitle: 'Meta Ads', items: ['Facebook Ads','Instagram Ads','Lead Generation Campaigns','Conversion Campaigns','E-commerce Ads','Retargeting','Remarketing','Audience Research','Creative Testing','Campaign Optimization','Pixel / Conversion Tracking','Performance Reporting'] },
      { groupTitle: 'Google Ads', items: ['Search Ads','Display Ads','Performance Max','Shopping Ads','YouTube Ads','Remarketing','Keyword Research','Conversion Tracking','Campaign Optimization','Landing Page Strategy'] },
      { groupTitle: 'Social Media Marketing', items: ['Social Media Strategy','Content Planning','Content Creation','Instagram Marketing','Facebook Marketing','LinkedIn Marketing','Social Media Management','Community Engagement','Social Media Growth','Analytics & Reporting'] },
    ],
    benefits: ['More qualified traffic to your website','Higher conversion rates and lower acquisition cost','A predictable, measurable lead pipeline','Stronger brand presence across search and social'],
    deliverables: ['Marketing strategy & channel roadmap','Campaign setups, tracking & reporting dashboards','Creative assets and ad copy','Monthly performance reviews and optimization'],
    extra: [],
    processes: [
      { step: 'Audit', detail: 'We analyze your market, competitors and current performance.' },
      { step: 'Strategy', detail: 'We define channels, positioning, budget and measurable targets.' },
      { step: 'Launch', detail: 'Campaigns, content and tracking go live with clean measurement.' },
      { step: 'Optimize', detail: 'We iterate on creative, targeting and bidding to scale what works.' },
    ],
  faqs: [
      { question: 'What platforms do you advertise on?', answer: 'We run campaigns on Google Ads (Search, Display, YouTube, Performance Max, Shopping), Meta Ads (Facebook, Instagram), and LinkedIn Ads — always matched to where your audience actually is.' },
      { question: 'Do you guarantee results?', answer: 'We don\'t guarantee vanity metrics. We commit to transparent reporting, continuous optimization and measurable business outcomes — traffic, leads, pipeline, revenue.' },
      { question: 'How quickly can you launch campaigns?', answer: 'Most new accounts are live within 5–10 business days after discovery, strategy and creative approval. Existing accounts can be optimized much faster.' },
      { question: 'Can you work with our in-house team?', answer: 'Yes. We often partner with internal marketing teams — running paid media, SEO or social while your team focuses on brand, content or product marketing.' },
    ],
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    shortDesc: 'Fast, modern, conversion-driven websites.',
    description: 'Design and develop modern, responsive, high-performance websites built around business goals and conversions — from marketing sites to custom web applications.',
    icon: 'Code2',
    sortOrder: 1,
    features: [
      { groupTitle: 'What We Build', items: ['Business Websites','Corporate Websites','Portfolio Websites','Landing Pages','E-commerce Websites','SaaS Websites','Agency Websites','Personal Branding Websites','Real Estate Websites','Healthcare Websites','Education Websites','Restaurant Websites','Service Business Websites','Booking Websites','Membership Websites','Custom Web Applications'] },
      { groupTitle: 'What We Cover', items: ['UI/UX Design','Responsive Development','Frontend Development','Backend Development','CMS Integration','API Integration','Payment Gateway Integration','Database Development','Authentication','Admin Dashboard','Performance Optimization','SEO-Friendly Development','Security','Deployment','Maintenance'] },
    ],
    benefits: ['Fast, accessible and mobile-first experiences','Built to convert visitors into customers','Clean, scalable code you can grow with','Search-engine-friendly from day one'],
    deliverables: ['Design system & responsive UI','Production-ready codebase & deployment','CMS or admin dashboard as needed','Documentation, training and maintenance plan'],
    extra: [],
    processes: [
      { step: 'Discover', detail: 'We understand your audience, goals and brand.' },
      { step: 'Design', detail: 'We craft the UX and visual design in tight loops.' },
      { step: 'Build', detail: 'We develop with modern, performant, scalable technology.' },
      { step: 'Launch', detail: 'We test, optimize, deploy and support you post-launch.' },
    ],
    faqs: [
      { question: 'What technologies do you use?', answer: 'We use modern stacks — React, Next.js, TypeScript, Tailwind, Node.js, Prisma, PostgreSQL — chosen per project for performance, maintainability and scale.' },
      { question: 'Do you build e-commerce sites?', answer: 'Yes. We build custom e-commerce on Shopify, WooCommerce or headless (Medusa, Saleor, custom) with payment, inventory and order management.' },
      { question: 'Can you migrate our existing site?', answer: 'We handle migrations from WordPress, Webflow, Wix, Squarespace and legacy stacks — preserving SEO, content and data integrity.' },
      { question: 'Do you provide ongoing maintenance?', answer: 'Yes. We offer monthly maintenance plans covering updates, security patches, backups, monitoring and priority support.' },
    ],
  },
  {
    slug: 'app-development',
    title: 'App Development',
    shortDesc: 'Custom, scalable and high-performance mobile apps built for modern businesses.',
    description: 'Design and develop modern, scalable, high-performance mobile applications for iOS and Android using Flutter and React Native. From concept to App Store and Play Store deployment — we build apps that grow with your business.',
    icon: 'Smartphone',
    sortOrder: 2,
    features: [
      { groupTitle: 'What We Build', items: ['iOS App Development', 'Android App Development', 'Cross-Platform Apps (Flutter / React Native)', 'Progressive Web Apps (PWA)', 'Enterprise Mobile Apps', 'Consumer-Facing Apps', 'On-Demand Service Apps', 'E-commerce Mobile Apps', 'SaaS Mobile Apps', 'Healthcare & Fitness Apps', 'FinTech & Payment Apps', 'Social & Community Apps', 'IoT & Wearable Apps', 'AR/VR Experiences', 'App Store & Play Store Deployment'] },
      { groupTitle: 'What We Cover', items: ['UI/UX Design for Mobile', 'Native & Cross-Platform Development', 'Backend API Development', 'Database Design & Integration', 'Authentication & Security', 'Push Notifications', 'In-App Purchases & Subscriptions', 'Payment Gateway Integration', 'Analytics & Crash Reporting', 'Performance Optimization', 'Offline-First Architecture', 'App Store Optimization (ASO)', 'CI/CD Pipeline Setup', 'Maintenance & Updates', 'Legacy App Modernization'] },
    ],
    benefits: ['Native performance with cross-platform efficiency', 'Faster time-to-market with Flutter / React Native', 'Scalable architecture that grows with your user base', 'App Store & Play Store ready with ASO optimization'],
    deliverables: ['Design system & interactive prototypes', 'Production-ready source code (iOS / Android / Web)', 'Backend APIs, database & admin dashboard', 'App Store / Play Store deployment & launch support'],
    extra: ['Flutter / React Native', 'Firebase / Supabase / Custom Backend', 'RevenueCat for Subscriptions', 'Mixpanel / Amplitude Analytics', 'TestFlight / Internal Testing'],
    processes: [
      { step: 'Discover', detail: 'We understand your users, goals and technical requirements.' },
      { step: 'Design', detail: 'We craft mobile-first UX and pixel-perfect UI in tight loops.' },
      { step: 'Build', detail: 'We develop with Flutter / React Native and a scalable backend.' },
      { step: 'Launch', detail: 'We test, optimize, submit to stores and support post-launch.' },
    ],
    faqs: [
      { question: 'Which platforms do you build for?', answer: 'We build for iOS and Android, typically using cross-platform frameworks like Flutter and React Native for faster, cost-effective delivery — with native modules where performance matters.' },
      { question: 'Do you handle App Store and Play Store submission?', answer: 'Yes. We prepare the listings, set up the developer accounts, handle the review process and support you through launch.' },
      { question: 'How long does a typical app project take?', answer: 'Timeline depends on scope, but most MVPs are delivered in 8–16 weeks. We break the work into milestones so you see progress early and often.' },
      { question: 'Can you integrate with our existing systems?', answer: 'Absolutely. We integrate with existing CRMs, payment gateways, databases and third-party services through well-documented APIs.' },
    ],
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    shortDesc: 'Custom software solutions designed to streamline operations, solve complex business challenges and scale with your business.',
    description: 'We design and develop scalable software solutions that simplify complex processes, improve efficiency and help businesses grow with technology built around their specific needs.',
    icon: 'Wrench',
    sortOrder: 3,
    features: [
      { groupTitle: 'What We Build', items: ['Custom Software Development','Business Management Software','CRM Development','ERP Development','Inventory Management Systems','Billing & Invoicing Software','Business Automation Software','SaaS Product Development','Web Application Development','Admin Dashboard Development','Reporting & Analytics Systems','Cloud-Based Software Solutions'] },
      { groupTitle: 'What We Cover', items: ['API Development & Integration','Database Development','Third-Party Integrations','User Authentication & Role Management','Software Maintenance & Support'] },
    ],
    benefits: ['Software that fits your business, not a one-size-fits-all product','Complex processes simplified into one streamlined system','Real-time visibility across operations and performance','A scalable foundation that grows with your business'],
    deliverables: ['Discovery & technical architecture document','Design system & interactive prototypes','Production-ready source code & documentation','Deployment, training & ongoing support plan'],
    extra: ['Custom Software Development','SaaS Product Development','Web Application Development','API Development & Integration','Cloud-Based Software Solutions','Software Maintenance & Support'],
    processes: [
      { step: 'Discover', detail: 'We map your processes, goals and technical requirements.' },
      { step: 'Design', detail: 'We architect the system and craft the UX in tight loops.' },
      { step: 'Build', detail: 'We develop with modern, scalable, well-tested technology.' },
      { step: 'Launch', detail: 'We deploy, train your team and support you post-launch.' },
    ],
    faqs: [
      { question: 'What kind of software do you build?', answer: 'We build custom business software — management systems, CRMs, ERPs, inventory and billing tools, SaaS products, web applications and internal automation platforms. Nothing is off the table.' },
      { question: 'Do you build SaaS products?', answer: 'Yes. We have built multi-tenant SaaS platforms with subscription billing, role-based access, analytics and API-first architectures.' },
      { question: 'Can you integrate with our existing tools?', answer: 'We integrate with accounting, CRM, payment, storage and communication tools through APIs and third-party connectors. If an integration doesn\'t exist yet, we build it.' },
      { question: 'Who owns the code and IP?', answer: 'You own the code, the intellectual property and the hosting account. We deliver clean, documented source code with no ongoing lock-in.' },
    ],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation',
    shortDesc: 'Smarter workflows. Less repetitive work.',
    description: 'Use AI and automation to reduce repetitive work, improve efficiency and build smarter business workflows — from chatbots to custom AI agents.',
    icon: 'BrainCircuit',
    sortOrder: 4,
    features: [
      { groupTitle: 'AI & Chatbots', items: ['AI Chatbots','WhatsApp Automation','Custom AI Agents','AI Lead Qualification'] },
      { groupTitle: 'Automation', items: ['Lead Automation','Customer Support Automation','Sales Automation','CRM Automation','Workflow Automation','Automated Follow-ups','Email Automation','Document Automation','Business Process Automation'] },
      { groupTitle: 'AI Systems', items: ['AI Content Automation','AI Data Processing','API Integrations','AI-powered dashboards'] },
    ],
    benefits: ['Hours of manual work replaced every week','Faster response times and happier customers','Leads captured, qualified and followed up automatically','Data flowing through your business without busywork'],
    deliverables: ['Automation audit & opportunity map','Working AI chatbots / agents tuned to your business','Integrations between your tools and platforms','Documentation, training and ongoing support'],
    extra: [],
    processes: [
      { step: 'Map', detail: 'We find the repetitive work worth automating first.' },
      { step: 'Design', detail: 'We architect the flow, data and AI behavior.' },
      { step: 'Build', detail: 'We ship the automation with careful testing.' },
      { step: 'Improve', detail: 'We monitor performance and keep improving outputs.' },
    ],
    faqs: [
      { question: 'What AI tools do you use?', answer: 'We work with OpenAI, Anthropic, LangChain, n8n, Make, Zapier and custom model fine-tuning — always selecting the right tool for the job.' },
      { question: 'Can you automate our specific workflow?', answer: 'We start with an audit to map your processes, then design automation that fits — whether it\'s lead qualification, support triage, content generation or data syncing.' },
      { question: 'Is my data safe?', answer: 'We follow security best practices: encrypted transit/storage, least-privilege access, no training on your data without consent, and full audit trails for every automated action.' },
      { question: 'How do you measure ROI?', answer: 'We track time saved, error reduction, response speed, lead conversion lift and cost per automated task — so you see the business case clearly.' },
    ],
  },
  {
    slug: 'ecommerce-management',
    title: 'E-commerce & Quick Commerce Management',
    shortDesc: 'Build, manage and scale online commerce.',
    description: 'Help brands build, manage and scale their online commerce operations — across their own store, marketplaces and quick-commerce platforms.',
    icon: 'ShoppingBag',
    sortOrder: 5,
    features: [
      { groupTitle: 'E-commerce Management', items: ['Store Setup','Product Listing','Product Optimization','Inventory Management','Order Management','Customer Management','Store Optimization','Conversion Optimization','Analytics','Sales Reporting'] },
      { groupTitle: 'Marketplace Management', items: ['Amazon','Flipkart','Meesho','Other relevant marketplaces'] },
      { groupTitle: 'Quick Commerce', items: ['Blinkit','Zepto','Swiggy Instamart','Other relevant quick-commerce platforms'] },
    ],
    benefits: ['A managed store that is always shoppable and optimized','Higher conversion and average order value','Presence across the platforms your customers actually use','Clean inventory, orders and reporting across channels'],
    deliverables: ['Store & catalog setup across chosen channels','Pricing, promotion and listing playbooks','Daily operations and order/inventory management','Sales dashboards and growth reporting'],
    extra: ['Product Catalog Management','Pricing Strategy','Promotions','Performance Monitoring','Marketplace Ads','Sales Optimization','Reporting'],
    processes: [
      { step: 'Setup', detail: 'Store, catalog, payments and tracking are configured cleanly.' },
      { step: 'Optimize', detail: 'Listings, pricing and pages are tuned for conversion.' },
      { step: 'Manage', detail: 'Day-to-day operations run smoothly and reliably.' },
      { step: 'Scale', detail: 'We expand channels and promotions to grow revenue.' },
    ],
    faqs: [
      { question: 'Which platforms do you manage?', answer: 'We manage Shopify, WooCommerce, custom headless stores, plus marketplaces (Amazon, Flipkart, Meesho) and quick-commerce (Blinkit, Zepto, Swiggy Instamart).' },
      { question: 'Do you handle product photography?', answer: 'We coordinate product photography and creative production with trusted partners — or art-direct your in-house team.' },
      { question: 'Can you run marketplace ads?', answer: 'Yes. We manage sponsored products, sponsored brands and display ads across Amazon, Flipkart and other marketplaces with ROAS targets.' },
      { question: 'How do you handle inventory across channels?', answer: 'We implement centralized inventory sync so stock levels stay accurate across your store, marketplaces and quick-commerce — preventing oversells.' },
    ],
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    shortDesc: 'Brands and creatives that stand out.',
    description: 'Premium design across brand identity, social media, marketing and digital — so every touchpoint looks intentional, professional and on-brand.',
    icon: 'PenTool',
    sortOrder: 6,
    features: [
      { groupTitle: 'Brand Identity', items: ['Logo Design','Brand Guidelines','Visual Identity','Typography System','Color System'] },
      { groupTitle: 'Social Media Design', items: ['Instagram Posts','Facebook Creatives','LinkedIn Creatives','Social Media Campaign Designs','Ad Creatives','Carousel Designs'] },
      { groupTitle: 'Marketing Design', items: ['Brochures','Flyers','Posters','Banners','Presentation Design','Promotional Creatives'] },
      { groupTitle: 'Digital Design', items: ['Website Graphics','UI Visuals','Landing Page Graphics','Ad Banners','Campaign Visuals'] },
    ],
    benefits: ['A consistent, recognizable brand identity','Creatives built for performance, not just looks','Assets ready for every platform and campaign','Design that earns trust and drives engagement'],
    deliverables: ['Brand identity systems & guidelines','Social media and ad creative packs','Print and marketing collateral','Digital and web-ready visuals'],
    extra: [],
    processes: [
      { step: 'Brief', detail: 'We clarify goals, audience and direction.' },
      { step: 'Concept', detail: 'We explore strong, on-brand creative directions.' },
      { step: 'Refine', detail: 'We polish the chosen direction into production assets.' },
      { step: 'Deliver', detail: 'You receive organized, ready-to-use files.' },
    ],
    faqs: [
      { question: 'What design tools do you use?', answer: 'Figma, Adobe Creative Cloud, Principle, Rive — and we hand off clean, developer-ready files with design tokens and component specs.' },
      { question: 'Do you create brand guidelines?', answer: 'Yes. Every brand identity project includes a comprehensive guidelines document covering logo usage, color system, typography, iconography, imagery style and do\'s/don\'ts.' },
      { question: 'Can you design for our existing brand?', answer: 'Absolutely. We work within established brand systems or evolve them — always respecting your existing equity and guidelines.' },
      { question: 'What file formats do you deliver?', answer: 'Figma source files, PNG/SVG for web, print-ready PDFs, and design tokens (JSON) for engineering handoff.' },
    ],
  },
];

async function seedServices() {
  for (const s of RICH_SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    const payload = {
      title: s.title,
      shortDesc: s.shortDesc,
      description: s.description,
      icon: s.icon,
      sortOrder: s.sortOrder,
      isPublished: true,
      benefits: JSON.stringify(s.benefits),
      deliverables: JSON.stringify(s.deliverables),
      extra: JSON.stringify(s.extra),
    };
    if (!existing) {
      await prisma.service.create({
        data: {
          ...payload,
          slug: s.slug,
          features: { create: s.features.map((f, i) => ({ groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: i })) },
          processes: { create: s.processes.map((p, i) => ({ step: p.step, detail: p.detail, sortOrder: i })) },
        },
      });
      console.log(`  + service ${s.slug}`);
    } else {
      // Upsert rich fields idempotently; also ensure features/processes/faqs are fully synced
      await prisma.$transaction(async (tx) => {
        await tx.service.update({ where: { id: existing.id }, data: payload });
        const count = await tx.serviceFeature.count({ where: { serviceId: existing.id } });
        const pCount = await tx.serviceProcess.count({ where: { serviceId: existing.id } });
        const fCount = await tx.serviceFaq.count({ where: { serviceId: existing.id } });
        const needsFeatures = count === 0;
        const needsProcesses = pCount === 0;
        const needsFaqs = fCount === 0;
        if (needsFeatures) {
          await tx.serviceFeature.createMany({ data: s.features.map((f, i) => ({ serviceId: existing.id, groupTitle: f.groupTitle, items: JSON.stringify(f.items), sortOrder: i })) });
        }
        if (needsProcesses) {
          await tx.serviceProcess.createMany({ data: s.processes.map((proc, i) => ({ serviceId: existing.id, step: proc.step, detail: proc.detail, sortOrder: i })) });
        }
        if (needsFaqs) {
          await tx.serviceFaq.createMany({ data: s.faqs.map((q, i) => ({ serviceId: existing.id, question: q.question, answer: q.answer, sortOrder: i })) });
        }
        if (needsFeatures || needsProcesses || needsFaqs) console.log(`  ~ synced features/processes/faqs for ${s.slug}`);
      });
    }
  }
}

async function main() {
  console.log('Seeding...');

  const hash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'info.bisstech@gmail.com' },
    create: { email: 'info.bisstech@gmail.com', name: 'Super Admin', passwordHash: hash, role: 'SUPER_ADMIN' },
    update: {},
  });
  console.log('  ✓ info.bisstech@gmail.com / Admin@123');
  const legacy = await prisma.user.findUnique({ where: { email: 'admin@bisstech.com' } });
  if (legacy) console.log('  • legacy admin@bisstech.com still present');

  await prisma.siteSettings.upsert({
    where: { id: 'site' },
    create: { id: 'site', siteName: 'BISSTECH', tagline: 'Build. Grow. Automate.', description: 'BISSTECH is a global digital growth, technology, AI & creative agency.', contactEmail: 'info.bisstech@gmail.com', whatsapp: 'https://wa.me/918597029133', whatsappDisplay: '+91 8597 029133' },
    update: {},
  });

  const navItems = [
    { label: 'Home', path: '/', sortOrder: 0 },
    { label: 'About', path: '/about', sortOrder: 1 },
    { label: 'Services', path: '/services', sortOrder: 2 },
    { label: 'Blog', path: '/blog', sortOrder: 3 },
    { label: 'Contact', path: '/contact', sortOrder: 4 },
  ];
  for (const n of navItems) {
    const exists = await prisma.navigationMenu.findFirst({ where: { label: n.label } });
    if (!exists) await prisma.navigationMenu.create({ data: n });
  }

  await prisma.footerSettings.upsert({
    where: { id: 'footer' },
    create: { id: 'footer', description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency.', copyright: '© BISSTECH. All rights reserved.' },
    update: {},
  });

  await prisma.seoSettings.upsert({
    where: { id: 'seo' },
    create: { id: 'seo', defaultTitle: 'BISSTECH — Build. Grow. Automate.', defaultDescription: 'BISSTECH is a global digital growth, technology, AI & creative agency.', robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://bisstech.com/sitemap.xml' },
    update: {},
  });

  await prisma.trackingSettings.upsert({ where: { id: 'tracking' }, create: { id: 'tracking' }, update: {} });

  for (const slug of ['home', 'about', 'services', 'contact']) {
    const exists = await prisma.page.findUnique({ where: { slug } });
    if (!exists) await prisma.page.create({ data: { slug, title: slug.charAt(0).toUpperCase() + slug.slice(1) } });
  }

  const categories = ['Digital Marketing','SEO','Performance Marketing','Web Development','AI Automation','Ecommerce','Business Growth','Technology','Design'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const exists = await prisma.blogCategory.findUnique({ where: { slug } });
    if (!exists) await prisma.blogCategory.create({ data: { name, slug } });
  }

  await seedServices();

  // Seed Case Studies matching frontend/src/data/caseStudies.ts
  const RICH_CASE_STUDIES: Array<{
    slug: string;
    title: string;
    client: string;
    industry: string;
    services: string[];
    challenge: string;
    solution: string;
    result: string;
    accent: string;
    sortOrder: number;
  }> = [
    {
      slug: 'd2c-fashion-scaling',
      title: 'D2C Fashion Brand — Scaling Online Sales',
      client: 'D2C Fashion Brand',
      industry: 'E-commerce · D2C',
      services: ['Digital Marketing', 'E-commerce Management', 'Meta Ads'],
      challenge: 'A growing direct-to-consumer fashion label wanted to scale online sales beyond a single marketplace and build a stronger owned channel.',
      solution: 'We launched a conversion-focused storefront, structured catalog, and a full-funnel Meta ads system with creative testing and retargeting.',
      result: 'The brand gained a scalable sales engine — a measurable lift in store sessions, qualified orders and a repeatable acquisition playbook.',
      accent: 'from-coffee/60 to-espresso-700/40',
      sortOrder: 0,
    },
    {
      slug: 'saas-lead-automation',
      title: 'SaaS Platform — Lead Automation & Site Rebuild',
      client: 'SaaS Platform',
      industry: 'B2B Software',
      services: ['Website Development', 'AI Automation', 'SEO'],
      challenge: 'A B2B SaaS team was losing leads to slow follow-up and an outdated website with low conversion.',
      solution: 'We rebuilt a high-performance, SEO-friendly site, added a self-qualifying AI lead bot and automated instant follow-up workflows.',
      result: 'Faster response times, a steady stream of qualified pipeline, and a marketing site that now converts visitors into demos.',
      accent: 'from-coffee/50 to-espresso-700/20',
      sortOrder: 1,
    },
    {
      slug: 'quick-commerce-ops',
      title: 'Food & Beverage Brand — Quick Commerce Operations',
      client: 'Food & Beverage Brand',
      industry: 'Quick Commerce · FMCG',
      services: ['Quick Commerce Management', 'Marketplace Management', 'Graphic Design'],
      challenge: 'A food brand wanted to be found and purchased on quick-commerce platforms but had no presence, catalog or content in place.',
      solution: 'We set up and managed catalog, pricing and promotional calendars across Blinkit, Zepto and Instamart, with on-brand creative assets.',
      result: 'The brand is now consistently live and shoppable across quick-commerce — with clean operations and steady repeat purchase.',
      accent: 'from-espresso-700/60 to-coffee/30',
      sortOrder: 2,
    },
    {
      slug: 'local-service-growth',
      title: 'Local Services Business — Local Search Dominance',
      client: 'Local Services Business',
      industry: 'Local Services · Healthcare',
      services: ['SEO', 'Google Ads', 'Website Development'],
      challenge: 'A local services business relied on word-of-mouth and wanted to dominate local search for high-intent service queries.',
      solution: 'We built a fast, local-SEO site, optimized Google Business Profile, and ran tightly targeted Google Ads with call tracking.',
      result: 'The business now appears prominently in local results with a measurable increase in calls and booked appointments.',
      accent: 'from-coffee/40 to-transparent',
      sortOrder: 3,
    },
  ];

  for (const cs of RICH_CASE_STUDIES) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug: cs.slug } });
    if (!existing) {
      await prisma.caseStudy.create({
        data: {
          ...cs,
          services: JSON.stringify(cs.services),
          isPublished: true,
        },
      });
      console.log(`  + case study ${cs.slug}`);
    }
  }

  const socials = [
    { platform: 'instagram', url: 'https://www.instagram.com/bisstech', sortOrder: 0 },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/bisstech', sortOrder: 1 },
    { platform: 'facebook', url: 'https://www.facebook.com/bisstech', sortOrder: 2 },
    { platform: 'whatsapp', url: 'https://wa.me/918597029133', sortOrder: 3 },
  ];
  for (const s of socials) {
    const exists = await prisma.socialLinks.findFirst({ where: { platform: s.platform } });
    if (!exists) await prisma.socialLinks.create({ data: s });
  }

  console.log('Seed complete.');

  // Seed default website appearance settings (ORIGINAL DESIGN - White + Coffee/Warm Brown theme)
  console.log('Seeding website appearance settings...');

  const defaultBranding = await prisma.brandingSettings.upsert({
    where: { id: 'branding' },
    create: {
      id: 'branding',
      logoUrl: null,
      mobileLogoUrl: null,
      darkLogoUrl: null,
      faviconUrl: null,
      logoWidth: JSON.stringify({ desktop: 140, tablet: 120, mobile: 100 }),
      logoHeight: JSON.stringify({ desktop: 36, tablet: 32, mobile: 28 }),
    },
    update: {
      logoWidth: JSON.stringify({ desktop: 140, tablet: 120, mobile: 100 }),
      logoHeight: JSON.stringify({ desktop: 36, tablet: 32, mobile: 28 }),
    },
  });
  console.log('  + branding settings');

  const defaultHeader = await prisma.headerSettings.upsert({
    where: { id: 'header' },
    create: {
      id: 'header',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backgroundOpacity: 0.95,
      blur: 20,
      borderColor: 'rgba(61, 43, 31, 0.1)',
      borderWidth: 1,
      shadow: '0 4px 30px rgba(61, 43, 31, 0.08)',
      height: JSON.stringify({ desktop: 72, tablet: 68, mobile: 64 }),
      navFontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
      navFontWeight: '500',
      navSpacing: JSON.stringify({ desktop: 32, tablet: 24, mobile: 16 }),
      navHoverColor: '#6f4e37',
      navActiveColor: '#1a1a1a',
      navUnderline: true,
      navUnderlineThickness: 1,
      navUnderlineSpeed: 0.3,
      buttonText: 'Start a Project',
      buttonBgColor: '#6f4e37',
      buttonHoverBg: '#3d2b1f',
    },
    update: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backgroundOpacity: 0.95,
      blur: 20,
      borderColor: 'rgba(61, 43, 31, 0.1)',
      borderWidth: 1,
      shadow: '0 4px 30px rgba(61, 43, 31, 0.08)',
      height: JSON.stringify({ desktop: 72, tablet: 68, mobile: 64 }),
      navFontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
      navFontWeight: '500',
      navSpacing: JSON.stringify({ desktop: 32, tablet: 24, mobile: 16 }),
      navHoverColor: '#6f4e37',
      navActiveColor: '#1a1a1a',
      navUnderline: true,
      navUnderlineThickness: 1,
      navUnderlineSpeed: 0.3,
      buttonText: 'Start a Project',
      buttonBgColor: '#6f4e37',
      buttonHoverBg: '#3d2b1f',
    },
  });
  console.log('  + header settings');

  const defaultButton = await prisma.buttonSettings.upsert({
    where: { id: 'button' },
    create: {
      id: 'button',
      variant: 'primary',
      bgColor: '#6f4e37',
      textColor: '#ffffff',
      borderColor: '#6f4e37',
      borderWidth: 0,
      borderRadius: 9999,
      padding: JSON.stringify({ desktop: '16px 32px', tablet: '14px 28px', mobile: '12px 24px' }),
      fontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
      fontWeight: '600',
      hoverBgColor: '#3d2b1f',
      hoverTextColor: '#ffffff',
      hoverBorderColor: '#3d2b1f',
      hoverScale: 1.02,
      hoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      transitionDuration: 0.3,
    },
    update: {
      bgColor: '#6f4e37',
      textColor: '#ffffff',
      borderColor: '#6f4e37',
      borderWidth: 0,
      borderRadius: 9999,
      padding: JSON.stringify({ desktop: '16px 32px', tablet: '14px 28px', mobile: '12px 24px' }),
      fontSize: JSON.stringify({ desktop: 14, tablet: 13, mobile: 13 }),
      fontWeight: '600',
      hoverBgColor: '#3d2b1f',
      hoverTextColor: '#ffffff',
      hoverBorderColor: '#3d2b1f',
      hoverScale: 1.02,
      hoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      transitionDuration: 0.3,
    },
  });
  console.log('  + button settings');

  const defaultTextHover = await prisma.textHoverSettings.upsert({
    where: { id: 'textHover' },
    create: {
      id: 'textHover',
      effectType: 'color',
      color: '#6f4e37',
      opacity: 0.9,
      underline: false,
      underlineThickness: 2,
      underlineOffset: 4,
      letterSpacing: 0,
      transform: 'none',
      scale: 1,
      glow: 'none',
      shadow: 'none',
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
    update: {
      effectType: 'color',
      color: '#6f4e37',
      opacity: 0.9,
      underline: false,
      underlineThickness: 2,
      underlineOffset: 4,
      letterSpacing: 0,
      transform: 'none',
      scale: 1,
      glow: 'none',
      shadow: 'none',
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
  });
  console.log('  + text hover settings');

  const defaultLinkHover = await prisma.linkHoverSettings.upsert({
    where: { id: 'linkHover' },
    create: {
      id: 'linkHover',
      effectType: 'color',
      color: '#1a1a1a',
      hoverColor: '#6f4e37',
      underline: true,
      underlineThickness: 2,
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
    update: {
      effectType: 'color',
      color: '#1a1a1a',
      hoverColor: '#6f4e37',
      underline: true,
      underlineThickness: 2,
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
  });
  console.log('  + link hover settings');

  const defaultCardHover = await prisma.cardHoverSettings.upsert({
    where: { id: 'cardHover' },
    create: {
      id: 'cardHover',
      effectType: 'lift',
      scale: 1.02,
      translateY: -8,
      shadow: '0 20px 40px rgba(61, 43, 31, 0.15)',
      borderColor: 'rgba(111, 78, 55, 0.2)',
      backgroundChange: 'rgba(111, 78, 55, 0.05)',
      glow: 'none',
      imageZoom: 1.05,
      overlayOpacity: 0.05,
      borderRadius: 16,
      transitionDuration: 0.4,
      easing: 'ease-out',
    },
    update: {
      effectType: 'lift',
      scale: 1.02,
      translateY: -8,
      shadow: '0 20px 40px rgba(61, 43, 31, 0.15)',
      borderColor: 'rgba(111, 78, 55, 0.2)',
      backgroundChange: 'rgba(111, 78, 55, 0.05)',
      glow: 'none',
      imageZoom: 1.05,
      overlayOpacity: 0.05,
      borderRadius: 16,
      transitionDuration: 0.4,
      easing: 'ease-out',
    },
  });
  console.log('  + card hover settings');

  const defaultFooterAppearance = await prisma.footerAppearanceSettings.upsert({
    where: { id: 'footerAppearance' },
    create: {
      id: 'footerAppearance',
      logoUrl: null,
      description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.',
      backgroundColor: '#fafafa',
      textColor: '#4a4a4a',
      headingColor: '#1a1a1a',
      linkColor: '#4a4a4a',
      linkHoverColor: '#6f4e37',
      borderColor: 'rgba(61, 43, 31, 0.1)',
      borderWidth: 1,
      spacing: JSON.stringify({ desktop: 64, tablet: 48, mobile: 32 }),
      padding: JSON.stringify({ desktop: 80, tablet: 60, mobile: 40 }),
      columnSpacing: JSON.stringify({ desktop: 48, tablet: 32, mobile: 24 }),
      copyrightText: '© 2025 BISSTECH. All rights reserved.',
      ctaText: 'Start a Project',
      ctaLink: '/contact',
    },
    update: {
      logoUrl: null,
      description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.',
      backgroundColor: '#fafafa',
      textColor: '#4a4a4a',
      headingColor: '#1a1a1a',
      linkColor: '#4a4a4a',
      linkHoverColor: '#6f4e37',
      borderColor: 'rgba(61, 43, 31, 0.1)',
      borderWidth: 1,
      spacing: JSON.stringify({ desktop: 64, tablet: 48, mobile: 32 }),
      padding: JSON.stringify({ desktop: 80, tablet: 60, mobile: 40 }),
      columnSpacing: JSON.stringify({ desktop: 48, tablet: 32, mobile: 24 }),
      copyrightText: '© 2025 BISSTECH. All rights reserved.',
      ctaText: 'Start a Project',
      ctaLink: '/contact',
    },
  });
  console.log('  + footer appearance settings');

  const defaultFooterHover = await prisma.footerHoverSettings.upsert({
    where: { id: 'footerHover' },
    create: {
      id: 'footerHover',
      effectType: 'color',
      hoverColor: '#6f4e37',
      underline: true,
      underlineThickness: 2,
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
    update: {
      effectType: 'color',
      hoverColor: '#6f4e37',
      underline: true,
      underlineThickness: 2,
      transitionDuration: 0.3,
      easing: 'ease-out',
    },
  });
  console.log('  + footer hover settings');

  // Seed default social settings
  const socialPlatforms = [
    { id: 'social-instagram', platform: 'instagram', url: 'https://www.instagram.com/bisstech', isEnabled: true, order: 0, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
    { id: 'social-linkedin', platform: 'linkedin', url: 'https://www.linkedin.com/company/bisstech', isEnabled: true, order: 1, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
    { id: 'social-facebook', platform: 'facebook', url: 'https://www.facebook.com/bisstech', isEnabled: true, order: 2, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
    { id: 'social-youtube', platform: 'youtube', url: 'https://www.youtube.com/@bisstech', isEnabled: true, order: 3, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
    { id: 'social-twitter', platform: 'twitter', url: 'https://twitter.com/bisstech', isEnabled: true, order: 4, iconSize: 20, color: '#4a4a4a', hoverColor: '#6f4e37', background: 'transparent', hoverBackground: 'rgba(111, 78, 55, 0.1)', borderRadius: 12, hoverScale: 1.1, hoverRotation: 0, hoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)' },
  ];
  for (const s of socialPlatforms) {
    const exists = await prisma.socialSettings.findUnique({ where: { id: s.id } });
    if (!exists) {
      await prisma.socialSettings.create({ data: s });
      console.log(`  + social settings: ${s.platform}`);
    }
  }

  const defaultColors = await prisma.colorSettings.upsert({
    where: { id: 'colors' },
    create: {
      id: 'colors',
      primary: '#6f4e37',
      secondary: '#a08d7a',
      accent: '#c9a962',
      background: '#ffffff',
      surface: '#fafafa',
      heading: '#1a1a1a',
      body: '#3d2b1f',
      muted: '#8a7d6e',
      border: 'rgba(61, 43, 31, 0.1)',
      button: '#6f4e37',
      buttonHover: '#3d2b1f',
      buttonText: '#ffffff',
      buttonHoverText: '#ffffff',
      link: '#6f4e37',
      linkHover: '#a08d7a',
      footerBackground: '#fafafa',
      footerText: '#4a4a4a',
      footerHeading: '#1a1a1a',
      footerLink: '#4a4a4a',
      footerLinkHover: '#6f4e37',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#1a1a1a',
      headerLinkHover: '#6f4e37',
      bottomSectionBackground: '#f5f5f5',
    },
    update: {
      primary: '#6f4e37',
      secondary: '#a08d7a',
      accent: '#c9a962',
      background: '#ffffff',
      surface: '#fafafa',
      heading: '#1a1a1a',
      body: '#3d2b1f',
      muted: '#8a7d6e',
      border: 'rgba(61, 43, 31, 0.1)',
      button: '#6f4e37',
      buttonHover: '#3d2b1f',
      buttonText: '#ffffff',
      buttonHoverText: '#ffffff',
      link: '#6f4e37',
      linkHover: '#a08d7a',
      footerBackground: '#fafafa',
      footerText: '#4a4a4a',
      footerHeading: '#1a1a1a',
      footerLink: '#4a4a4a',
      footerLinkHover: '#6f4e37',
      headerBackground: 'rgba(255, 255, 255, 0.95)',
      headerText: '#1a1a1a',
      headerLinkHover: '#6f4e37',
      bottomSectionBackground: '#f5f5f5',
    },
  });
  console.log('  + color settings');

  const defaultTypography = await prisma.typographySettings.upsert({
    where: { id: 'typography' },
    create: {
      id: 'typography',
      primaryFont: 'Inter, system-ui, sans-serif',
      headingFont: 'Montserrat, Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
      baseSize: 16,
      h1Size: 48,
      h2Size: 36,
      h3Size: 24,
      paragraphSize: 16,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    update: {
      primaryFont: 'Inter, system-ui, sans-serif',
      headingFont: 'Montserrat, Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
      baseSize: 16,
      h1Size: 48,
      h2Size: 36,
      h3Size: 24,
      paragraphSize: 16,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
  });
  console.log('  + typography settings');

  const defaultAnimation = await prisma.animationSettings.upsert({
    where: { id: 'animation' },
    create: {
      id: 'animation',
      enableHover: true,
      hoverSpeed: 0.3,
      intensity: 1,
      reducedMotion: false,
    },
    update: {
      enableHover: true,
      hoverSpeed: 0.3,
      intensity: 1,
      reducedMotion: false,
    },
  });
  console.log('  + animation settings');

  // Seed default bottom section hover settings
  const defaultBottomSectionHover = await prisma.bottomSectionHoverSettings.upsert({
    where: { id: 'bottomSectionHover' },
    create: {
      id: 'bottomSectionHover',

      // Hero CTA Buttons (woven-light-hero.tsx)
      heroCtaPrimaryBg: '#6f4e37',
      heroCtaPrimaryHoverBg: '#3d2b1f',
      heroCtaPrimaryText: '#ffffff',
      heroCtaPrimaryHoverText: '#ffffff',
      heroCtaPrimaryBorder: '#6f4e37',
      heroCtaPrimaryHoverBorder: '#3d2b1f',
      heroCtaPrimaryShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      heroCtaPrimaryHoverShadow: '0 12px 35px rgba(61, 43, 31, 0.4)',
      heroCtaPrimaryScale: 1.02,
      heroCtaPrimaryTransition: 0.3,

      heroCtaSecondaryBg: 'transparent',
      heroCtaSecondaryHoverBg: '#6f4e37',
      heroCtaSecondaryText: '#6f4e37',
      heroCtaSecondaryHoverText: '#ffffff',
      heroCtaSecondaryBorder: '#6f4e37',
      heroCtaSecondaryHoverBorder: '#6f4e37',
      heroCtaSecondaryShadow: 'none',
      heroCtaSecondaryHoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      heroCtaSecondaryScale: 1.02,
      heroCtaSecondaryTransition: 0.3,

      // CTA Section Buttons (CTASection.tsx)
      ctaSectionPrimaryBg: '#2b2118',
      ctaSectionPrimaryHoverBg: '#1a1611',
      ctaSectionPrimaryText: '#fafafa',
      ctaSectionPrimaryHoverText: '#fafafa',
      ctaSectionPrimaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      ctaSectionPrimaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      ctaSectionPrimaryScale: 1.0,
      ctaSectionPrimaryTransition: 0.3,
      ctaSectionPrimaryArrowTranslateX: 4,

      ctaSectionSecondaryBg: '#ffffff',
      ctaSectionSecondaryHoverBg: '#f5f5f5',
      ctaSectionSecondaryText: '#3d2b1f',
      ctaSectionSecondaryHoverText: '#1a1a1a',
      ctaSectionSecondaryBorder: 'rgba(111, 78, 55, 0.1)',
      ctaSectionSecondaryHoverBorder: '#6f4e37',
      ctaSectionSecondaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      ctaSectionSecondaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      ctaSectionSecondaryScale: 1.0,
      ctaSectionSecondaryTransition: 0.3,

      // Service Cards (ServicesSection.tsx)
      serviceCardBg: '#ffffff',
      serviceCardHoverBg: '#ffffff',
      serviceCardBorderColor: 'rgba(111, 78, 55, 0.06)',
      serviceCardHoverBorderColor: '#6f4e37',
      serviceCardShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      serviceCardHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      serviceCardTranslateY: -4,
      serviceCardScale: 1.0,
      serviceCardImageZoom: 1.05,
      serviceCardImageTransition: 0.7,
      serviceCardBorderWidth: 1,
      serviceCardHoverBorderWidth: 1,
      serviceCardBottomBarHeight: 2,
      serviceCardBottomBarColor: '#6f4e37',
      serviceCardBottomBarTransition: 0.5,
      serviceCardIconBg: 'rgba(111, 78, 55, 0.1)',
      serviceCardIconHoverBg: '#6f4e37',
      serviceCardIconText: '#6f4e37',
      serviceCardIconHoverText: '#fafafa',
      serviceCardIconScale: 1.0,
      serviceCardIconTransition: 0.5,
      serviceCardExploreTextColor: '#8a7d6e',
      serviceCardExploreHoverTextColor: '#6f4e37',
      serviceCardArrowColor: '#8a7d6e',
      serviceCardArrowHoverColor: '#6f4e37',
      serviceCardArrowTranslateX: 4,
      serviceCardArrowTranslateY: -4,
      serviceCardArrowTransition: 0.3,

      // Footer Branding (Footer.tsx)
      footerLogoHoverOpacity: 0.8,
      footerLogoHoverScale: 1.02,
      footerLogoTransition: 0.3,
      footerEmailColor: '#6f4e37',
      footerEmailHoverColor: '#3d2b1f',
      footerEmailUnderline: true,
      footerEmailUnderlineThickness: 1,
      footerEmailTransition: 0.2,

      // Footer Navigation Links
      footerNavLinkColor: '#4a4a4a',
      footerNavLinkHoverColor: '#6f4e37',
      footerNavLinkUnderline: false,
      footerNavLinkUnderlineThickness: 2,
      footerNavLinkUnderlineOffset: 4,
      footerNavLinkTransition: 0.2,
      footerNavLinkEasing: 'ease-out',

      // Footer Services Links
      footerServiceLinkColor: '#4a4a4a',
      footerServiceLinkHoverColor: '#6f4e37',
      footerServiceLinkUnderline: false,
      footerServiceLinkUnderlineThickness: 2,
      footerServiceLinkUnderlineOffset: 4,
      footerServiceLinkTransition: 0.2,
      footerServiceLinkEasing: 'ease-out',

      // Footer Social Icons
      footerSocialIconSize: 20,
      footerSocialIconColor: '#4a4a4a',
      footerSocialIconHoverColor: '#6f4e37',
      footerSocialIconBg: 'transparent',
      footerSocialIconHoverBg: 'rgba(111, 78, 55, 0.1)',
      footerSocialIconBorderRadius: 12,
      footerSocialIconScale: 1.1,
      footerSocialIconRotation: 0,
      footerSocialIconShadow: 'none',
      footerSocialIconHoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)',
      footerSocialIconTransition: 0.3,

      // Footer CTA Button
      footerCtaBg: '#6f4e37',
      footerCtaHoverBg: '#3d2b1f',
      footerCtaText: '#ffffff',
      footerCtaHoverText: '#ffffff',
      footerCtaShadow: '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)',
      footerCtaHoverShadow: '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)',
      footerCtaScale: 1.0,
      footerCtaArrowTranslateX: 4,
      footerCtaArrowTranslateY: -4,
      footerCtaTransition: 0.3,

      // Copyright Bar Links
      copyrightLinkColor: '#4a4a4a',
      copyrightLinkHoverColor: '#6f4e37',
      copyrightLinkUnderline: false,
      copyrightLinkUnderlineThickness: 1,
      copyrightLinkUnderlineOffset: 3,
      copyrightLinkTransition: 0.2,
      copyrightLinkEasing: 'ease-out',

      // Bottom Decorative Text (Watermark)
      watermarkColor: 'rgba(111, 78, 55, 0.05)',
      watermarkHoverColor: 'rgba(111, 78, 55, 0.15)',
      watermarkScale: 1.0,
      watermarkTransition: 0.5,
      watermarkOpacity: 1.0,
    },
    update: {
      heroCtaPrimaryBg: '#6f4e37',
      heroCtaPrimaryHoverBg: '#3d2b1f',
      heroCtaPrimaryText: '#ffffff',
      heroCtaPrimaryHoverText: '#ffffff',
      heroCtaPrimaryBorder: '#6f4e37',
      heroCtaPrimaryHoverBorder: '#3d2b1f',
      heroCtaPrimaryShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      heroCtaPrimaryHoverShadow: '0 12px 35px rgba(61, 43, 31, 0.4)',
      heroCtaPrimaryScale: 1.02,
      heroCtaPrimaryTransition: 0.3,

      heroCtaSecondaryBg: 'transparent',
      heroCtaSecondaryHoverBg: '#6f4e37',
      heroCtaSecondaryText: '#6f4e37',
      heroCtaSecondaryHoverText: '#ffffff',
      heroCtaSecondaryBorder: '#6f4e37',
      heroCtaSecondaryHoverBorder: '#6f4e37',
      heroCtaSecondaryShadow: 'none',
      heroCtaSecondaryHoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
      heroCtaSecondaryScale: 1.02,
      heroCtaSecondaryTransition: 0.3,

      ctaSectionPrimaryBg: '#2b2118',
      ctaSectionPrimaryHoverBg: '#1a1611',
      ctaSectionPrimaryText: '#fafafa',
      ctaSectionPrimaryHoverText: '#fafafa',
      ctaSectionPrimaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      ctaSectionPrimaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      ctaSectionPrimaryScale: 1.0,
      ctaSectionPrimaryTransition: 0.3,
      ctaSectionPrimaryArrowTranslateX: 4,

      ctaSectionSecondaryBg: '#ffffff',
      ctaSectionSecondaryHoverBg: '#f5f5f5',
      ctaSectionSecondaryText: '#3d2b1f',
      ctaSectionSecondaryHoverText: '#1a1a1a',
      ctaSectionSecondaryBorder: 'rgba(111, 78, 55, 0.1)',
      ctaSectionSecondaryHoverBorder: '#6f4e37',
      ctaSectionSecondaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      ctaSectionSecondaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      ctaSectionSecondaryScale: 1.0,
      ctaSectionSecondaryTransition: 0.3,

      serviceCardBg: '#ffffff',
      serviceCardHoverBg: '#ffffff',
      serviceCardBorderColor: 'rgba(111, 78, 55, 0.06)',
      serviceCardHoverBorderColor: '#6f4e37',
      serviceCardShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
      serviceCardHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
      serviceCardTranslateY: -4,
      serviceCardScale: 1.0,
      serviceCardImageZoom: 1.05,
      serviceCardImageTransition: 0.7,
      serviceCardBorderWidth: 1,
      serviceCardHoverBorderWidth: 1,
      serviceCardBottomBarHeight: 2,
      serviceCardBottomBarColor: '#6f4e37',
      serviceCardBottomBarTransition: 0.5,
      serviceCardIconBg: 'rgba(111, 78, 55, 0.1)',
      serviceCardIconHoverBg: '#6f4e37',
      serviceCardIconText: '#6f4e37',
      serviceCardIconHoverText: '#fafafa',
      serviceCardIconScale: 1.0,
      serviceCardIconTransition: 0.5,
      serviceCardExploreTextColor: '#8a7d6e',
      serviceCardExploreHoverTextColor: '#6f4e37',
      serviceCardArrowColor: '#8a7d6e',
      serviceCardArrowHoverColor: '#6f4e37',
      serviceCardArrowTranslateX: 4,
      serviceCardArrowTranslateY: -4,
      serviceCardArrowTransition: 0.3,

      footerLogoHoverOpacity: 0.8,
      footerLogoHoverScale: 1.02,
      footerLogoTransition: 0.3,
      footerEmailColor: '#6f4e37',
      footerEmailHoverColor: '#3d2b1f',
      footerEmailUnderline: true,
      footerEmailUnderlineThickness: 1,
      footerEmailTransition: 0.2,

      footerNavLinkColor: '#4a4a4a',
      footerNavLinkHoverColor: '#6f4e37',
      footerNavLinkUnderline: false,
      footerNavLinkUnderlineThickness: 2,
      footerNavLinkUnderlineOffset: 4,
      footerNavLinkTransition: 0.2,
      footerNavLinkEasing: 'ease-out',

      footerServiceLinkColor: '#4a4a4a',
      footerServiceLinkHoverColor: '#6f4e37',
      footerServiceLinkUnderline: false,
      footerServiceLinkUnderlineThickness: 2,
      footerServiceLinkUnderlineOffset: 4,
      footerServiceLinkTransition: 0.2,
      footerServiceLinkEasing: 'ease-out',

      footerSocialIconSize: 20,
      footerSocialIconColor: '#4a4a4a',
      footerSocialIconHoverColor: '#6f4e37',
      footerSocialIconBg: 'transparent',
      footerSocialIconHoverBg: 'rgba(111, 78, 55, 0.1)',
      footerSocialIconBorderRadius: 12,
      footerSocialIconScale: 1.1,
      footerSocialIconRotation: 0,
      footerSocialIconShadow: 'none',
      footerSocialIconHoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)',
      footerSocialIconTransition: 0.3,

      footerCtaBg: '#6f4e37',
      footerCtaHoverBg: '#3d2b1f',
      footerCtaText: '#ffffff',
      footerCtaHoverText: '#ffffff',
      footerCtaShadow: '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)',
      footerCtaHoverShadow: '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)',
      footerCtaScale: 1.0,
      footerCtaArrowTranslateX: 4,
      footerCtaArrowTranslateY: -4,
      footerCtaTransition: 0.3,

      copyrightLinkColor: '#4a4a4a',
      copyrightLinkHoverColor: '#6f4e37',
      copyrightLinkUnderline: false,
      copyrightLinkUnderlineThickness: 1,
      copyrightLinkUnderlineOffset: 3,
      copyrightLinkTransition: 0.2,
      copyrightLinkEasing: 'ease-out',

      watermarkColor: 'rgba(111, 78, 55, 0.05)',
      watermarkHoverColor: 'rgba(111, 78, 55, 0.15)',
      watermarkScale: 1.0,
      watermarkTransition: 0.5,
      watermarkOpacity: 1.0,
    },
  });
  console.log('  + bottom section hover settings');

  console.log('Website appearance settings seeded.');

  // Seed Technology Categories & Items
  console.log('Seeding technology categories & items...');

  const techCategories = [
    {
      name: 'Marketing & Analytics',
      slug: 'marketing-analytics',
      description: 'Tools for digital marketing, advertising, analytics and growth tracking',
      icon: 'TrendingUp',
      sortOrder: 0,
      items: [
        { name: 'Google Ads', slug: 'google-ads', description: 'Search, Display, YouTube and Performance Max advertising', logoUrl: 'https://ssl.gstatic.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png', logoAlt: 'Google Ads logo', websiteUrl: 'https://ads.google.com', sortOrder: 0, isFeatured: true },
        { name: 'Meta Ads', slug: 'meta-ads', description: 'Facebook, Instagram, Messenger and Audience Network advertising', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', logoAlt: 'Meta Ads logo', websiteUrl: 'https://business.facebook.com/adsmanager', sortOrder: 1, isFeatured: true },
        { name: 'Google Analytics 4', slug: 'google-analytics-4', description: 'Web and app analytics with event-based measurement', logoUrl: 'https://analytics.google.com/analytics/images/favicon.ico', logoAlt: 'Google Analytics 4 logo', websiteUrl: 'https://analytics.google.com', sortOrder: 2, isFeatured: true },
        { name: 'Search Console', slug: 'search-console', description: 'Google search performance and indexing monitoring', logoUrl: 'https://search.google.com/search-console/images/favicon.ico', logoAlt: 'Search Console logo', websiteUrl: 'https://search.google.com/search-console', sortOrder: 3 },
        { name: 'GTM', slug: 'gtm', description: 'Google Tag Manager for tag management', logoUrl: 'https://www.gstatic.com/images/branding/product/1x/tagmanager_48dp.png', logoAlt: 'GTM logo', websiteUrl: 'https://tagmanager.google.com', sortOrder: 4 },
        { name: 'Hotjar', slug: 'hotjar', description: 'Heatmaps, session recordings and user feedback', logoUrl: 'https://static.hotjar.com/images/hotjar-logo.png', logoAlt: 'Hotjar logo', websiteUrl: 'https://www.hotjar.com', sortOrder: 5 },
        { name: 'SEMrush', slug: 'semrush', description: 'SEO, PPC, content and competitive research', logoUrl: 'https://www.semrush.com/static/logos/semrush-logo.svg', logoAlt: 'SEMrush logo', websiteUrl: 'https://www.semrush.com', sortOrder: 6 },
        { name: 'Ahrefs', slug: 'ahrefs', description: 'SEO toolset for backlinks, keywords and content', logoUrl: 'https://ahrefs.com/favicon.ico', logoAlt: 'Ahrefs logo', websiteUrl: 'https://ahrefs.com', sortOrder: 7 },
      ],
    },
    {
      name: 'Web & E-commerce',
      slug: 'web-ecommerce',
      description: 'Frameworks, platforms and tools for web development and online commerce',
      icon: 'Code2',
      sortOrder: 1,
      items: [
        { name: 'React', slug: 'react', description: 'JavaScript library for building user interfaces', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', logoAlt: 'React logo', websiteUrl: 'https://react.dev', sortOrder: 0, isFeatured: true },
        { name: 'Next.js', slug: 'nextjs', description: 'React framework for production', logoUrl: 'https://nextjs.org/favicon.ico', logoAlt: 'Next.js logo', websiteUrl: 'https://nextjs.org', sortOrder: 1, isFeatured: true },
        { name: 'TypeScript', slug: 'typescript', description: 'Typed JavaScript at any scale', logoUrl: 'https://www.typescriptlang.org/favicon.ico', logoAlt: 'TypeScript logo', websiteUrl: 'https://www.typescriptlang.org', sortOrder: 2 },
        { name: 'Node.js', slug: 'nodejs', description: 'JavaScript runtime built on Chrome\'s V8', logoUrl: 'https://nodejs.org/static/images/logo.svg', logoAlt: 'Node.js logo', websiteUrl: 'https://nodejs.org', sortOrder: 3 },
        { name: 'Shopify', slug: 'shopify', description: 'E-commerce platform for online stores', logoUrl: 'https://cdn.shopify.com/s/assets/brand_assets/logo-28915c79a577d0f9d8ceb9a582e6c9d7.svg', logoAlt: 'Shopify logo', websiteUrl: 'https://www.shopify.com', sortOrder: 4, isFeatured: true },
        { name: 'WooCommerce', slug: 'woocommerce', description: 'Open-source e-commerce for WordPress', logoUrl: 'https://woocommerce.com/wp-content/uploads/2022/02/Logo.png', logoAlt: 'WooCommerce logo', websiteUrl: 'https://woocommerce.com', sortOrder: 5 },
        { name: 'Webflow', slug: 'webflow', description: 'Visual web development platform', logoUrl: 'https://uploads-ssl.webflow.com/5e5d1f5e9e8c4f5d5b9e2f3a/5e5d1f5e9e8c4f5d5b9e2f3a_Webflow_Logo_Full_Color_RGB.svg', logoAlt: 'Webflow logo', websiteUrl: 'https://webflow.com', sortOrder: 6 },
        { name: 'Vite', slug: 'vite', description: 'Next generation frontend tooling', logoUrl: 'https://vitejs.dev/logo.svg', logoAlt: 'Vite logo', websiteUrl: 'https://vitejs.dev', sortOrder: 7 },
        { name: 'Tailwind CSS', slug: 'tailwind-css', description: 'Utility-first CSS framework', logoUrl: 'https://tailwindcss.com/favicon.ico', logoAlt: 'Tailwind CSS logo', websiteUrl: 'https://tailwindcss.com', sortOrder: 8, isFeatured: true },
      ],
    },
    {
      name: 'AI & Automation',
      slug: 'ai-automation',
      description: 'AI models, automation platforms and intelligent workflow tools',
      icon: 'BrainCircuit',
      sortOrder: 2,
      items: [
        { name: 'OpenAI', slug: 'openai', description: 'GPT models, embeddings and AI APIs', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', logoAlt: 'OpenAI logo', websiteUrl: 'https://openai.com', sortOrder: 0, isFeatured: true },
        { name: 'Claude API', slug: 'claude-api', description: 'Anthropic\'s AI assistant API', logoUrl: 'https://www.anthropic.com/favicon.ico', logoAlt: 'Claude API logo', websiteUrl: 'https://www.anthropic.com/api', sortOrder: 1, isFeatured: true },
        { name: 'Make', slug: 'make', description: 'Visual workflow automation platform', logoUrl: 'https://www.make.com/en/logo', logoAlt: 'Make logo', websiteUrl: 'https://www.make.com', sortOrder: 2 },
        { name: 'Zapier', slug: 'zapier', description: 'No-code automation connecting 5000+ apps', logoUrl: 'https://zapier.com/static/images/logo-zapier.svg', logoAlt: 'Zapier logo', websiteUrl: 'https://zapier.com', sortOrder: 3 },
        { name: 'n8n', slug: 'n8n', description: 'Fair-code workflow automation tool', logoUrl: 'https://n8n.io/favicon.ico', logoAlt: 'n8n logo', websiteUrl: 'https://n8n.io', sortOrder: 4 },
        { name: 'Chatbots', slug: 'chatbots', description: 'AI-powered conversational agents', logoUrl: 'https://cdn.jsdelivr.net/gh/lucide-icons/lucide@latest/icons/bot.svg', logoAlt: 'Chatbots icon', websiteUrl: '', sortOrder: 5 },
        { name: 'WhatsApp Business API', slug: 'whatsapp-business-api', description: 'Official WhatsApp business messaging', logoUrl: 'https://www.whatsappbrand.com/img/logo-icon/blue/whatsapp-icon-blue.png', logoAlt: 'WhatsApp Business API logo', websiteUrl: 'https://developers.facebook.com/docs/whatsapp', sortOrder: 6 },
        { name: 'Custom Agents', slug: 'custom-agents', description: 'Tailored AI agents for specific workflows', logoUrl: 'https://cdn.jsdelivr.net/gh/lucide-icons/lucide@latest/icons/cpu.svg', logoAlt: 'Custom Agents icon', websiteUrl: '', sortOrder: 7 },
      ],
    },
    {
      name: 'Design & Creative',
      slug: 'design-creative',
      description: 'Professional design tools for UI, graphics, video and creative work',
      icon: 'PenTool',
      sortOrder: 3,
      items: [
        { name: 'Figma', slug: 'figma', description: 'Collaborative interface design tool', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', logoAlt: 'Figma logo', websiteUrl: 'https://www.figma.com', sortOrder: 0, isFeatured: true },
        { name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Industry-standard image editing', logoUrl: 'https://adobeccfiles.box.com/v/AdobePhotoshopBrand', logoAlt: 'Adobe Photoshop logo', websiteUrl: 'https://www.adobe.com/products/photoshop.html', sortOrder: 1 },
        { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Vector graphics and illustration', logoUrl: 'https://adobeccfiles.box.com/v/AdobeIllustratorBrand', logoAlt: 'Adobe Illustrator logo', websiteUrl: 'https://www.adobe.com/products/illustrator.html', sortOrder: 2 },
        { name: 'Premiere Pro', slug: 'premiere-pro', description: 'Professional video editing', logoUrl: 'https://adobeccfiles.box.com/v/AdobePremiereProBrand', logoAlt: 'Premiere Pro logo', websiteUrl: 'https://www.adobe.com/products/premiere.html', sortOrder: 3 },
        { name: 'After Effects', slug: 'after-effects', description: 'Motion graphics and visual effects', logoUrl: 'https://adobeccfiles.box.com/v/AdobeAfterEffectsBrand', logoAlt: 'After Effects logo', websiteUrl: 'https://www.adobe.com/products/aftereffects.html', sortOrder: 4 },
        { name: 'Canva', slug: 'canva', description: 'Online design and publishing tool', logoUrl: 'https://www.canva.com/static/images/favicon.ico', logoAlt: 'Canva logo', websiteUrl: 'https://www.canva.com', sortOrder: 5 },
      ],
    },
  ];

  for (const cat of techCategories) {
    const { items, ...categoryData } = cat;
    const existingCat = await prisma.technologyCategory.findUnique({ where: { slug: categoryData.slug } });

    if (!existingCat) {
      const newCat = await prisma.technologyCategory.create({
        data: {
          ...categoryData,
          items: { create: items.map(item => ({ ...item })) },
        },
      });
      console.log(`  + technology category: ${categoryData.name}`);
    } else {
      // Update category
      await prisma.technologyCategory.update({ where: { id: existingCat.id }, data: categoryData });

      // Sync items
      for (const item of items) {
        const existingItem = await prisma.technologyItem.findFirst({
          where: { categoryId: existingCat.id, slug: item.slug },
        });
        if (!existingItem) {
          await prisma.technologyItem.create({ data: { ...item, categoryId: existingCat.id } });
          console.log(`  + technology item: ${item.name} (in ${categoryData.name})`);
        } else {
          await prisma.technologyItem.update({ where: { id: existingItem.id }, data: item });
        }
      }
    }
  }

  console.log('Technology categories & items seeded.');

}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
