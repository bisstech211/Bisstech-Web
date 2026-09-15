import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Admin user — password: Admin@123 (change immediately)
  const hash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'info.bisstech@gmail.com' },
    create: { email: 'info.bisstech@gmail.com', name: 'Super Admin', passwordHash: hash, role: 'SUPER_ADMIN' },
    update: {},
  });
  console.log('  ✓ info.bisstech@gmail.com / Admin@123');
  // Keep legacy admin@bisstech.com for backwards compat if it exists — no-op otherwise
  const legacy = await prisma.user.findUnique({ where: { email: 'admin@bisstech.com' } });
  if (legacy) {
    console.log('  • legacy admin@bisstech.com still present');
  }

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: 'site' },
    create: { id: 'site', siteName: 'BISSTECH', tagline: 'Build. Grow. Automate.', description: 'BISSTECH is a global digital growth, technology, AI & creative agency.', contactEmail: 'info.bisstech@gmail.com', whatsapp: 'https://wa.me/918597029133', whatsappDisplay: '+91 8597 029133' },
    update: {},
  });

  // Navigation
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

  // Footer
  await prisma.footerSettings.upsert({
    where: { id: 'footer' },
    create: { id: 'footer', description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency.', copyright: '© BISSTECH. All rights reserved.' },
    update: {},
  });

  // SEO
  await prisma.seoSettings.upsert({
    where: { id: 'seo' },
    create: { id: 'seo', defaultTitle: 'BISSTECH — Build. Grow. Automate.', defaultDescription: 'BISSTECH is a global digital growth, technology, AI & creative agency.', robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://bisstech.com/sitemap.xml' },
    update: {},
  });

  // Tracking placeholder
  await prisma.trackingSettings.upsert({ where: { id: 'tracking' }, create: { id: 'tracking' }, update: {} });

  // Pages
  for (const slug of ['home', 'about', 'services', 'contact']) {
    const exists = await prisma.page.findUnique({ where: { slug } });
    if (!exists) await prisma.page.create({ data: { slug, title: slug.charAt(0).toUpperCase() + slug.slice(1) } });
  }

  // Blog categories
  const categories = ['Digital Marketing','SEO','Performance Marketing','Web Development','AI Automation','Ecommerce','Business Growth','Technology','Design'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const exists = await prisma.blogCategory.findUnique({ where: { slug } });
    if (!exists) await prisma.blogCategory.create({ data: { name, slug } });
  }

  // Services — seed from frontend data shape (simplified)
  const servicesSeed = [
    { slug: 'digital-marketing', title: 'Digital Marketing', shortDesc: 'Visibility. Traffic. Leads. Revenue.', icon: 'TrendingUp', sortOrder: 0 },
    { slug: 'website-development', title: 'Website Development', shortDesc: 'Fast, modern, conversion-driven websites.', icon: 'Code2', sortOrder: 1 },
    { slug: 'ecommerce-management', title: 'E-commerce & Quick Commerce Management', shortDesc: 'Build, manage and scale online commerce.', icon: 'ShoppingBag', sortOrder: 2 },
    { slug: 'ai-automation', title: 'AI Automation', shortDesc: 'Automate repetitive work with AI.', icon: 'BrainCircuit', sortOrder: 3 },
    { slug: 'graphic-design', title: 'Graphic Design', shortDesc: 'Brand, creative and visual design.', icon: 'PenTool', sortOrder: 4 },
  ];
  for (const s of servicesSeed) {
    const exists = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!exists) await prisma.service.create({ data: s });
  }

  // Socials
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
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
