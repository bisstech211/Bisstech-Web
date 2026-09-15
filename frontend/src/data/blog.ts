export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  authorAvatar?: string;
  publishedAt: string; // ISO date string
  readingTime: string;
  featured?: boolean;
};

export const BLOG_CATEGORIES = [
  'All',
  'Digital Marketing',
  'SEO',
  'Performance Marketing',
  'Web Development',
  'AI Automation',
  'Ecommerce',
  'Business Growth',
  'Technology',
  'Design',
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'how-digital-marketing-can-help-small-businesses-grow',
    title: 'How Digital Marketing Can Help Small Businesses Grow',
    excerpt:
      'Discover how small businesses are using affordable digital marketing strategies to compete with larger brands and drive consistent, measurable growth.',
    content: `
      <p>Small businesses no longer need massive budgets to compete. With the right digital marketing strategy, even a local shop can reach customers across the city — and beyond.</p>
      <h2 id="why-digital-marketing-matters">Why Digital Marketing Matters for Small Businesses</h2>
      <p>Traditional marketing — flyers, newspaper ads, hoardings — is expensive and hard to measure. Digital marketing flips that. Every click, view, and enquiry is trackable. You know exactly what is working and what is not.</p>
      <blockquote>Digital marketing is not about being everywhere. It is about being exactly where your customers are.</blockquote>
      <h2 id="channels-that-drive-growth">Channels That Drive Real Growth</h2>
      <h3>1. Search Engine Optimization (SEO)</h3>
      <p>When someone searches "best bakery near me" or "plumber in Kolkata", you want to be the first result. Local SEO, Google Business Profile, and content optimization make that happen.</p>
      <h3>2. Social Media Marketing</h3>
      <p>Instagram, Facebook, and LinkedIn are not just for posting. They are customer acquisition engines when paired with consistent content, community engagement, and targeted ads.</p>
      <h3>3. Performance Marketing</h3>
      <p>Google Ads and Meta Ads let you pay only for results — clicks, leads, or sales. With smart targeting and creative testing, the return on ad spend can be 4-8x.</p>
      <h2 id="a-practical-roadmap">A Practical Roadmap</h2>
      <ul>
        <li><strong>Month 1-2:</strong> Set up tracking, optimize website and Google Business Profile.</li>
        <li><strong>Month 3-4:</strong> Launch SEO content and start small-budget ad campaigns.</li>
        <li><strong>Month 5-6:</strong> Double down on what converts, automate lead follow-ups.</li>
      </ul>
      <p>The businesses that grow fastest are not the ones that spend the most — they are the ones that are most consistent.</p>
      <h2 id="key-takeaway">Key Takeaway</h2>
      <p>Start small, measure everything, and scale what works. Digital marketing rewards consistency far more than perfection.</p>
    `,
    category: 'Digital Marketing',
    tags: ['Digital Marketing', 'Small Business', 'Growth'],
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
    author: 'BISSTECH Team',
    publishedAt: '2026-03-15',
    readingTime: '6 min read',
    featured: true,
  },
  {
    id: '2',
    slug: 'seo-strategies-every-business-should-know-in-2026',
    title: 'SEO Strategies Every Business Should Know in 2026',
    excerpt:
      'Search is evolving faster than ever. Learn the SEO strategies that actually work in 2026 — from AI search to E-E-A-T and technical fundamentals.',
    content: `
      <p>Google's search results in 2026 look nothing like they did three years ago. AI overviews, zero-click answers, and hyper-personalized results have changed the game. Yet the businesses ranking at the top share the same few habits.</p>
      <h2 id="what-changed-in-2026">What Changed in 2026</h2>
      <p>AI-powered search now answers many queries directly. That means fewer clicks — but the clicks that remain are far more valuable. Users who click through are deeper in the buying journey.</p>
      <h2 id="the-5-pillars-that-still-win">The 5 Pillars That Still Win</h2>
      <ol>
        <li><strong>Technical excellence:</strong> Core Web Vitals, crawlability, and structured data are non-negotiable.</li>
        <li><strong>Topical authority:</strong> Cover a topic comprehensively, not just one keyword. Build content clusters.</li>
        <li><strong>E-E-A-T:</strong> Experience, Expertise, Authority and Trust — prove you have actually done the work.</li>
        <li><strong>Search intent alignment:</strong> Answer the user's real question, not just the keyword you want to rank for.</li>
        <li><strong>Local signals:</strong> For service businesses, local SEO drives 60%+ of inbound enquiries.</li>
      </ol>
      <blockquote>SEO in 2026 is not about gaming the algorithm. It is about being the most helpful answer for a real person.</blockquote>
      <h2 id="quick-wins">Quick Wins You Can Do This Week</h2>
      <ul>
        <li>Audit your top 10 pages for title tags, meta descriptions, and internal links.</li>
        <li>Add FAQ schema to service pages that answer common buyer questions.</li>
        <li>Compress and lazy-load every image — page speed directly impacts rankings.</li>
      </ul>
    `,
    category: 'SEO',
    tags: ['SEO', 'Search', '2026 Trends'],
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
    author: 'Arjun Mehta',
    publishedAt: '2026-04-02',
    readingTime: '7 min read',
    featured: true,
  },
  {
    id: '3',
    slug: 'google-ads-vs-meta-ads-which-is-better',
    title: 'Google Ads vs Meta Ads: Which Is Better for Your Business?',
    excerpt:
      'Both platforms can deliver customers — but they work very differently. Here is how to choose the right mix for your budget, audience, and goals.',
    content: `
      <p>Should you run Google Ads or Meta (Facebook & Instagram) Ads? The honest answer: most growing businesses eventually use both — but where you start matters a lot.</p>
      <h2 id="how-they-differ">How They Differ</h2>
      <table>
        <thead><tr><th>Aspect</th><th>Google Ads</th><th>Meta Ads</th></tr></thead>
        <tbody>
          <tr><td>Intent</td><td>High — user is actively searching</td><td>Low — you interrupt the scroll</td></tr>
          <tr><td>Best for</td><td>Capturing demand</td><td>Creating demand</td></tr>
          <tr><td>Cost per lead</td><td>Higher, but more qualified</td><td>Lower, needs nurturing</td></tr>
          <tr><td>Time to results</td><td>Days</td><td>1-2 weeks to optimize</td></tr>
        </tbody>
      </table>
      <h2 id="when-to-choose-google-ads">When to Choose Google Ads</h2>
      <p>If people already search for what you sell — "interior designer in Mumbai", "best CRM for startups" — Google Ads puts you at the top of that intent. It is ideal for service businesses, B2B, and high-ticket offers.</p>
      <h2 id="when-to-choose-meta-ads">When to Choose Meta Ads</h2>
      <p>If your product is visual, impulse-friendly, or needs education — fashion, food, courses, apps — Meta's creative-driven targeting is powerful. You can test 10 audiences and 10 creatives in a week.</p>
      <h2 id="the-smart-combination">The Smart Combination</h2>
      <ul>
        <li>Use Meta to generate awareness and retargeting pools cheaply.</li>
        <li>Use Google to capture high-intent searches and close the deal.</li>
        <li>Connect both with consistent messaging and a single conversion tracking setup.</li>
      </ul>
    `,
    category: 'Performance Marketing',
    tags: ['Google Ads', 'Meta Ads', 'Performance Marketing'],
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&q=80&auto=format&fit=crop',
    author: 'Sneha Roy',
    publishedAt: '2026-03-28',
    readingTime: '5 min read',
  },
  {
    id: '4',
    slug: 'how-ai-automation-can-save-businesses-time-and-money',
    title: 'How AI Automation Can Save Businesses Time and Money',
    excerpt:
      'From lead follow-ups to customer support — see how AI automation is helping lean teams do the work of ten, without the overhead.',
    content: `
      <p>The average small team loses 12-15 hours a week to repetitive work: copying data between tools, answering the same five questions, chasing leads that went cold. AI automation eliminates that tax.</p>
      <h2 id="where-automation-pays-first">Where Automation Pays First</h2>
      <h3>Lead Management</h3>
      <p>When a lead fills a form at 11pm, an AI workflow can instantly send a WhatsApp message, add them to a CRM, assign a follow-up task, and schedule a reminder — while your team sleeps.</p>
      <h3>Customer Support</h3>
      <p>AI chatbots trained on your business knowledge handle 60-70% of common queries instantly. Human agents step in only for complex cases.</p>
      <h3>Marketing Operations</h3>
      <p>Auto-generate reports, repurpose content, schedule social posts, and enrich CRM data — without adding headcount.</p>
      <blockquote>Automation does not replace your team. It frees them to do the work that actually needs a human.</blockquote>
      <h2 id="how-to-start">How to Start Without Overwhelming Your Team</h2>
      <ul>
        <li>Map one repetitive workflow you do daily — e.g., "new lead from Instagram → add to sheet → send welcome message".</li>
        <li>Automate just that one flow with a tool like Make, Zapier, or n8n.</li>
        <li>Measure time saved for two weeks. Then expand to the next workflow.</li>
      </ul>
    `,
    category: 'AI Automation',
    tags: ['AI Automation', 'Productivity', 'No-Code'],
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop',
    author: 'BISSTECH Team',
    publishedAt: '2026-04-10',
    readingTime: '6 min read',
  },
  {
    id: '5',
    slug: 'why-your-business-needs-a-high-converting-website',
    title: 'Why Your Business Needs a High-Converting Website',
    excerpt:
      'A beautiful website means nothing if it does not convert. Learn the anatomy of a website that turns visitors into customers.',
    content: `
      <p>Your website is not a brochure. It is your hardest-working salesperson — available 24/7, never tired, never forgetting a follow-up. But most business websites are built to impress, not to convert.</p>
      <h2 id="conversion-vs-beauty">Conversion vs Beauty</h2>
      <p>A high-converting site balances aesthetics with psychology: clear messaging, obvious next steps, and social proof exactly where doubt appears.</p>
      <h2 id="the-5-non-negotiables">The 5 Non-Negotiables</h2>
      <ol>
        <li><strong>One clear promise above the fold</strong> — visitor knows in 3 seconds what you do and who it is for.</li>
        <li><strong>Single primary CTA</strong> — "Book a Call" or "Get Quote" repeated consistently, not five competing buttons.</li>
        <li><strong>Proof near every claim</strong> — testimonials, logos, numbers, case studies.</li>
        <li><strong>Speed:</strong> Under 2.5s load on mobile. Every extra second drops conversion by 7%.</li>
        <li><strong>Mobile-first layout</strong> — 70%+ of traffic is mobile. Design there first.</li>
      </ol>
      <h2 id="small-changes-big-impact">Small Changes, Big Impact</h2>
      <p>One of our clients increased enquiry rate by 42% just by moving testimonials above the pricing section and simplifying the contact form from 7 fields to 3.</p>
    `,
    category: 'Web Development',
    tags: ['Web Development', 'Conversion', 'UX'],
    featuredImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80&auto=format&fit=crop',
    author: 'Priya Sharma',
    publishedAt: '2026-02-20',
    readingTime: '5 min read',
  },
  {
    id: '6',
    slug: 'ecommerce-growth-strategies-for-modern-businesses',
    title: 'Ecommerce Growth Strategies for Modern Businesses',
    excerpt:
      'Standing out on Shopify, Amazon, or Blinkit takes more than listing products. Here are proven tactics to scale ecommerce profitably.',
    content: `
      <p>India's ecommerce market is growing at 18% year on year. But competition is growing faster. Winning today requires more than a storefront — it requires a system.</p>
      <h2 id="the-three-engines">The Three Engines of Ecommerce Growth</h2>
      <h3>1. Traffic Engine</h3>
      <p>Paid ads, SEO, and marketplace visibility. Optimize product titles, images, and A+ content for conversion on each platform.</p>
      <h3>2. Conversion Engine</h3>
      <p>Fast site, clear pricing, trust badges, easy returns, and one-click checkout. Reduce friction at every step.</p>
      <h3>3. Retention Engine</h3>
      <p>Email, WhatsApp, and loyalty loops. It costs 5x more to acquire a new customer than to bring an existing one back.</p>
      <h2 id="quick-commerce-matters">Why Quick Commerce Matters</h2>
      <p>For FMCG, grocery, and impulse products, being on Blinkit, Zepto, and Instamart is no longer optional. Assortment, pricing, and visibility management across these platforms is its own discipline.</p>
      <blockquote>Ecommerce is not a channel. It is an operating model that touches supply chain, creative, data, and customer experience.</blockquote>
    `,
    category: 'Ecommerce',
    tags: ['Ecommerce', 'Quick Commerce', 'Shopify'],
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop',
    author: 'Rahul Verma',
    publishedAt: '2026-03-05',
    readingTime: '6 min read',
  },
  {
    id: '7',
    slug: 'how-to-build-a-strong-digital-presence-for-your-brand',
    title: 'How to Build a Strong Digital Presence for Your Brand',
    excerpt:
      'Your digital presence is your reputation. Learn how to build a brand that people find, trust, and remember — across every channel.',
    content: `
      <p>When someone hears your brand name, what is the first thing they do? They Google you. What they find in those first 10 seconds shapes whether they trust you.</p>
      <h2 id="the-four-layers">The Four Layers of Digital Presence</h2>
      <ul>
        <li><strong>Discoverability:</strong> Can people find you when they search your name, your service, or your problem? This is SEO + Google Business Profile + directory listings.</li>
        <li><strong>Credibility:</strong> When they land on your site or social profile, does it look professional, current, and trustworthy?</li>
        <li><strong>Consistency:</strong> Is your story, visual identity, and tone the same on website, Instagram, LinkedIn, and ads?</li>
        <li><strong>Activity:</strong> Are you publishing regularly so people see you as alive and active — not a dormant website from 2021?</li>
      </ul>
      <h2 id="the-90-day-plan">The 90-Day Plan</h2>
      <p>Week 1-2: Audit every touchpoint. Week 3-6: Fix website, unify branding, set up content calendar. Week 7-12: Publish 2x weekly, run targeted ads to amplify best content, collect and showcase reviews.</p>
      <h2 id="measure-what-matters">Measure What Matters</h2>
      <p>Track branded search volume, direct traffic, and inbound enquiries — not vanity metrics like follower count.</p>
    `,
    category: 'Business Growth',
    tags: ['Branding', 'Business Growth', 'Digital Presence'],
    featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80&auto=format&fit=crop',
    author: 'BISSTECH Team',
    publishedAt: '2026-02-10',
    readingTime: '5 min read',
  },
  {
    id: '8',
    slug: 'website-speed-and-seo-why-performance-matters',
    title: 'Website Speed and SEO: Why Performance Matters',
    excerpt:
      'A one-second delay can cost you rankings and customers. Here is why speed is an SEO and revenue issue — and how to fix it.',
    content: `
      <p>Google has been explicit: speed is a ranking factor. But even if it were not, your visitors punish slow sites by leaving. A fast website is table stakes.</p>
      <h2 id="the-numbers">The Numbers</h2>
      <ul>
        <li>53% of mobile visitors abandon a site that takes longer than 3 seconds to load.</li>
        <li>Every 100ms improvement in load time increases conversion by ~1%.</li>
        <li>Core Web Vitals now directly influence both rankings and Google Ads quality score.</li>
      </ul>
      <h2 id="what-slows-sites-down">What Slows Sites Down</h2>
      <p>Uncompressed images are the #1 culprit. Next: render-blocking scripts, too many fonts, unoptimized video embeds, and slow server response. Most of these are fixable in a single sprint.</p>
      <h2 id="the-fix-checklist">The Fix Checklist</h2>
      <ol>
        <li>Serve images in WebP/AVIF, lazy-load off-screen assets, and define width/height to prevent layout shift.</li>
        <li>Minimize and defer non-critical JavaScript. Load analytics and chat widgets after the page is interactive.</li>
        <li>Use a CDN and enable caching headers. Choose hosting close to your users.</li>
        <li>Monitor Core Web Vitals weekly via Search Console and PageSpeed Insights.</li>
      </ol>
      <blockquote>Performance is not a technical detail. It is a user-experience and business metric.</blockquote>
    `,
    category: 'Technology',
    tags: ['Performance', 'SEO', 'Technology'],
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop',
    author: 'Aman Gupta',
    publishedAt: '2026-01-28',
    readingTime: '4 min read',
  },
];

// ---- Helpers ----
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.id !== current.id && (p.category === current.category || p.tags.some((t) => current.tags.includes(t))))
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
