import { Compass, Eye, HeartHandshake, Lightbulb, Target } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { CTASection } from '../components/home/CTASection';
import { CAPABILITIES, PROCESS, WHY_BISSTECH } from '../data/process';
import { STACK_HIGHLIGHTS } from '../data/technologies';

const BELIEFS = [
  {
    icon: Lightbulb,
    title: 'Growth is an outcome, not an activity',
    detail: 'We care about results your business can feel — not vanity metrics.',
  },
  {
    icon: HeartHandshake,
    title: 'Clarity beats cleverness',
    detail: 'Simple, honest communication on scope, timeline and expectations.',
  },
  {
    icon: Target,
    title: 'Craft is non-negotiable',
    detail: 'Premium design and clean engineering, on every deliverable, every time.',
  },
  {
    icon: Compass,
    title: 'Technology should remove friction',
    detail: 'AI and automation exist to free your team for work that matters.',
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About BISSTECH"
        description="BISSTECH is a modern agency combining strategy, technology, creativity, AI and performance to help ambitious businesses grow."
        path="/about"
      />
      <main>
        {/* Page hero */}
        <section className="relative overflow-hidden pt-40 pb-24 bg-cream-50" aria-label="About BISSTECH">
          <div aria-hidden className="absolute inset-0 bg-grid-cream mask-fade-y opacity-60" />
          <div aria-hidden className="absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-coffee/10 blur-[130px]" />

          <div className="container-bt relative text-center">
            <Reveal>
              <p className="eyebrow justify-center">About BISSTECH</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mx-auto mt-6 max-w-4xl font-display text-display-lg font-bold text-espresso-950">
                Where <span className="text-gradient">strategy</span>,{' '}
                <span className="text-gradient">technology</span> and{' '}
                <span className="text-gradient">creativity</span> compound.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-espresso-600 sm:text-lg">
                We are a global digital growth, technology, AI & creative agency. One team that
                takes your business from idea to build to growth — then keeps compounding it with
                data, creative and automation.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-3">
                {CAPABILITIES.map((c) => (
                  <span
                    key={c.title}
                    className="rounded-full border border-espresso-950/10 bg-white px-5 py-2 font-display text-sm font-semibold text-espresso-700"
                  >
                    {c.title}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Who we are */}
        <section className="section-pad border-t border-espresso-950/06" aria-label="Who we are">
          <div className="container-bt grid gap-16 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  A modern agency for a <span className="text-gradient">digital-first</span> world.
                </>
              }
              description={
                <>
                  <p className="mb-4">
                    BISSTECH was built on a simple frustration: most businesses have to stitch
                    together multiple agencies and freelancers — a marketer here, a developer there,
                    a designer somewhere else. Nothing connects. Context gets lost. Growth stalls.
                  </p>
                  <p>
                    We put it all under one roof. Marketing, development, e-commerce, quick
                    commerce, AI automation and design work as one system — so your growth is
                    coherent, measurable and fast.
                  </p>
                </>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {BELIEFS.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-6 transition-colors duration-500 hover:border-coffee/30 hover:shadow-card-light-hover">
                    <b.icon className="h-5 w-5 text-coffee" />
                    <h3 className="mt-4 font-display text-base font-semibold text-espresso-950">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-espresso-600">{b.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-pad bg-cream-50" aria-label="Mission and vision">
          <div className="container-bt grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-8">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-coffee/15 text-coffee">
                  <Target className="h-5 w-5" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-semibold text-espresso-950">Our mission</h2>
                <p className="mt-4 text-sm leading-relaxed text-espresso-600">
                  To give ambitious businesses a single, technology-driven partner that turns
                  strategy, creative and AI into measurable growth — without the agency runaround.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-8">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-espresso-800/15 text-espresso-700">
                  <Eye className="h-5 w-5" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-semibold text-espresso-950">Our vision</h2>
                <p className="mt-4 text-sm leading-relaxed text-espresso-600">
                  A world where every ambitious brand — from startup to enterprise — can compete
                  like the best in the world, powered by intelligent technology and world-class
                  creativity.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Why businesses choose us */}
        <section className="section-pad" aria-label="Why businesses choose BISSTECH">
          <div className="container-bt">
            <SectionHeading
              align="center"
              eyebrow="Why choose us"
              title={
                <>
                  What makes BISSTECH <span className="text-gradient">different</span>.
                </>
              }
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHY_BISSTECH.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-7 hover:border-coffee/30 hover:shadow-card-light-hover">
                    <span className="font-display text-sm font-bold text-coffee/60">0{i + 1}</span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-espresso-950">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-espresso-600">{w.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Our process */}
        <section className="section-pad bg-cream-50" aria-label="Our process">
          <div className="container-bt">
            <SectionHeading
              align="center"
              eyebrow="Our process"
              title={
                <>
                  How we <span className="text-gradient">deliver</span>.
                </>
              }
            />
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {PROCESS.map((p, i) => (
                <Reveal key={p.step} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-espresso-950/06 bg-white p-6">
                    <span className="font-display text-3xl font-bold text-espresso-950/10">{p.step}</span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-espresso-950">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-espresso-600">{p.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Technology & creativity */}
        <section className="section-pad" aria-label="Technology and creativity">
          <div className="container-bt grid items-center gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Technology & creativity"
              title={
                <>
                  Where the <span className="text-gradient">best tools</span> meet bold ideas.
                </>
              }
              description="We build with a modern, proven stack — and we're fluent in the AI tools reshaping how businesses run. That combination lets us ship faster, measure better and design bolder."
            />
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-3">
                {STACK_HIGHLIGHTS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-espresso-950/10 bg-white px-5 py-2.5 font-display text-sm font-medium text-espresso-700 transition-colors hover:border-coffee/40 hover:text-coffee"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <CTASection />
      </main>
    </>
  );
}