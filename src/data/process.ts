export type ProcessStep = {
  step: string;
  title: string;
  detail: string;
};

/** The core "how we work" process — used on Home + About. */
export const PROCESS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    detail:
      'We dig into your business, audience, competitors and goals. No assumptions — just a clear picture of where growth lives.',
  },
  {
    step: '02',
    title: 'Strategize',
    detail:
      'We define the positioning, channels, experience and technology that will actually move your metrics.',
  },
  {
    step: '03',
    title: 'Build & Create',
    detail:
      'Design, development, content and campaigns come together — fast, with a premium standard on every pixel.',
  },
  {
    step: '04',
    title: 'Launch',
    detail:
      'We ship with clean tracking, solid infrastructure and search-ready foundations.',
  },
  {
    step: '05',
    title: 'Grow & Automate',
    detail:
      'We measure, iterate and scale what works — and automate the repetitive work so your team focuses on the business.',
  },
];

/** The five capability pillars shown as visual anchors. */
export const CAPABILITIES = [
  { title: 'Strategy', detail: 'Positioning, research and growth planning.' },
  { title: 'Technology', detail: 'Web, e-commerce, integrations and infrastructure.' },
  { title: 'Creativity', detail: 'Brand, design and content that stands out.' },
  { title: 'AI', detail: 'Automation and intelligent workflows.' },
  { title: 'Performance', detail: 'Marketing, measurement and scaling.' },
];

export const WHY_BISSTECH = [
  {
    title: 'Growth, not just deliverables',
    detail:
      'We tie every design, code and campaign decision to your business metrics — traffic, leads, sales and retention.',
  },
  {
    title: 'Full-stack under one roof',
    detail:
      'Marketing, development, e-commerce, AI and design together. No hand-offs between agencies, no lost context.',
  },
  {
    title: 'Technology-driven',
    detail:
      'We build on modern, performant, scalable technology and use AI to make your business faster and smarter.',
  },
  {
    title: 'Premium creative standard',
    detail:
      'Every output is designed to feel world-class — clean, intentional and on-brand, never template-like.',
  },
  {
    title: 'Transparent and measurable',
    detail:
      'Clear scopes, honest reporting and dashboards you can actually read. You always know what you’re getting.',
  },
  {
    title: 'Built to scale with you',
    detail:
      'Whether you’re a startup or an established brand, we build systems that scale as you grow.',
  },
];
