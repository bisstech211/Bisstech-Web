import { motion } from 'framer-motion';
import { Eye, MousePointerClick, Users, TrendingUp } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { EASE } from '../../lib/motion';

const LEVERS = [
  {
    icon: Eye,
    title: 'Visibility',
    detail: 'Be found where your customers search, scroll and shop.',
  },
  {
    icon: MousePointerClick,
    title: 'Traffic',
    detail: 'Turn visibility into a steady stream of relevant visitors.',
  },
  {
    icon: Users,
    title: 'Leads & Customers',
    detail: 'Convert attention into enquiries, demos, calls and sales.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue',
    detail: 'Scale what works with data, creative and automation.',
  },
];

/**
 * Digital growth — a clear system, shown with an illustrative (non-client) dashboard.
 */
export function GrowthSection() {
  return (
    <section className="section-pad relative bg-ink-950/60" aria-label="Digital growth">
      <div className="container-bt grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Digital growth"
            title={
              <>
                A <span className="text-gradient">growth system</span>, not just campaigns.
              </>
            }
            description="We connect every channel into one measurable engine — search, paid, social, web, commerce and AI — and keep it compounding."
          />

          <div className="mt-12 space-y-6">
            {LEVERS.map((l, i) => (
              <Reveal key={l.title} delay={i * 0.08}>
                <div className="group flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-electric transition-colors duration-300 group-hover:bg-electric group-hover:text-white">
                    <l.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{l.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cloud-400">{l.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Illustrative dashboard */}
        <Reveal delay={0.15}>
          <div className="relative rounded-3xl border border-white/[0.08] bg-ink-900/80 p-6 shadow-card sm:p-8">
            <div aria-hidden className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-electric/20 to-violetglow/10 blur-xl" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-semibold text-white">Growth dashboard</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cloud-600">
                  Illustrative sample — not client data
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-[11px] font-medium text-electric-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
                Live
              </span>
            </div>

            {/* Chart */}
            <div className="mt-8">
              <svg viewBox="0 0 320 140" className="h-40 w-full" aria-hidden>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* grid lines */}
                {[20, 60, 100, 140].map((y) => (
                  <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.06)" />
                ))}
                <motion.path
                  d="M0,120 C40,116 60,100 90,96 C120,92 140,70 170,64 C200,58 230,40 260,34 C290,28 305,20 320,14"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: EASE }}
                />
                <motion.path
                  d="M0,120 C40,116 60,100 90,96 C120,92 140,70 170,64 C200,58 230,40 260,34 C290,28 305,20 320,14 L320,140 L0,140 Z"
                  fill="url(#growthFill)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 1 }}
                />
              </svg>
            </div>

            {/* KPI rows */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Visibility', value: '↑↑' },
                { label: 'Qualified leads', value: '↑↑' },
                { label: 'Automation', value: 'On' },
              ].map((k) => (
                <div key={k.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cloud-500">{k.label}</p>
                  <p className="mt-1 font-display text-base font-bold text-electric">{k.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
