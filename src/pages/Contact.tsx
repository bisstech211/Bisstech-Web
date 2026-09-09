import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, Send, CheckCircle2, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SERVICES } from '../data/services';
import { CONTACT, SOCIALS } from '../data/site';
import { Reveal } from '../components/ui/Reveal';
import { EASE } from '../lib/motion';
import { cn } from '../lib/utils';

const BUDGETS = ['Under $1k', '$1k – $5k', '$5k – $15k', '$15k – $50k', '$50k+', 'Not sure yet'];

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  details: string;
};

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  details: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email';
    if (!form.service) next.service = 'Select a service';
    if (!form.details.trim()) next.details = 'Tell us a little about your project';

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact BISSTECH — Start Your Project"
        description="Let's build something that matters. Tell us about your project — digital marketing, web development, e-commerce, AI automation or design — and we'll get back to you fast."
        path="/contact"
      />
      <main>
        <section className="relative overflow-hidden pt-40 pb-24" aria-label="Contact BISSTECH">
          <div aria-hidden className="absolute inset-0 bg-grid mask-fade-y opacity-50" />
          <div aria-hidden className="absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-electric/[0.12] blur-[130px]" />

          <div className="container-bt relative">
            <Reveal>
              <p className="eyebrow">Contact</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-3xl font-display text-display-lg font-bold text-white">
                Let’s build something that <span className="text-gradient">matters</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-cloud-300 sm:text-lg">
                Tell us where you want to go. We’ll respond within one business day with honest next
                steps.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-28" aria-label="Contact form">
          <div className="container-bt grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            {/* Form / success */}
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/60 p-6 shadow-card sm:p-10">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex min-h-[420px] flex-col items-center justify-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 12, -6, 0] }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                        className="grid h-16 w-16 place-items-center rounded-full bg-electric/20 text-electric"
                      >
                        <CheckCircle2 className="h-8 w-8" />
                      </motion.div>
                      <h2 className="mt-8 font-display text-3xl font-bold text-white">Message received.</h2>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-cloud-300">
                        Thanks, {form.name.split(' ')[0] || 'friend'}. We’re reviewing your brief and
                        will be in touch at <span className="text-electric-200">{form.email}</span> within one
                        business day.
                      </p>
                      <a
                        href={`mailto:${CONTACT.email}?subject=Project%20enquiry%20from%20${encodeURIComponent(form.company || 'your%20website')}`}
                        className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold text-electric transition-colors hover:text-electric-300"
                      >
                        Need an instant reply? Email us now <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5 }}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <Field label="Name" required error={errors.name}>
                        <input
                          className={fieldCls(!!errors.name)}
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Your name"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" required error={errors.email}>
                        <input
                          type="email"
                          className={fieldCls(!!errors.email)}
                          value={form.email}
                          onChange={set('email')}
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field label="Phone">
                        <input
                          className={fieldCls(false)}
                          value={form.phone}
                          onChange={set('phone')}
                          placeholder="+91 8597 029133"
                          autoComplete="tel"
                        />
                      </Field>
                      <Field label="Company">
                        <input
                          className={fieldCls(false)}
                          value={form.company}
                          onChange={set('company')}
                          placeholder="Company name"
                          autoComplete="organization"
                        />
                      </Field>
                      <Field label="Service needed" required error={errors.service}>
                        <select className={fieldCls(!!errors.service)} value={form.service} onChange={set('service')}>
                          <option value="" disabled>
                            Select a service
                          </option>
                          {SERVICES.map((s) => (
                            <option key={s.id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                          <option value="Multiple / not sure">Multiple / not sure</option>
                        </select>
                      </Field>
                      <Field label="Budget range">
                        <select className={fieldCls(false)} value={form.budget} onChange={set('budget')}>
                          <option value="" disabled>
                            Select a range
                          </option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Project details" required error={errors.details}>
                          <textarea
                            rows={5}
                            className={cn(fieldCls(!!errors.details), 'resize-none')}
                            value={form.details}
                            onChange={set('details')}
                            placeholder="Tell us about your goals, timeline, current challenges…"
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2 mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-cloud-500">
                          By submitting, you agree to be contacted by BISSTECH about your enquiry.
                        </p>
                        <button
                          type="submit"
                          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-electric px-8 py-4 font-display text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-electric-600 hover:shadow-glow-lg"
                        >
                          Start Your Project
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Contact info */}
            <div className="space-y-4">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-3 inline-flex items-center gap-2.5 font-display text-base font-medium text-white transition-colors hover:text-electric"
                  >
                    <Mail className="h-4 w-4 text-electric" />
                    {CONTACT.email}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                    WhatsApp
                  </p>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-2.5 font-display text-base font-medium text-white transition-colors hover:text-electric"
                  >
                    <MessageCircle className="h-4 w-4 text-electric" />
                    {CONTACT.whatsappDisplay}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
                    Follow us
                  </p>
                  <div className="mt-4 flex gap-3">
                    {SOCIALS.filter((s) => ![Instagram, Linkedin, Facebook].includes(s.icon) || true).map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cloud-300 transition-all duration-300 hover:border-electric hover:bg-electric hover:text-white"
                      >
                        <s.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.28}>
                <div className="rounded-2xl bg-gradient-to-br from-electric/20 to-violetglow/10 p-7">
                  <p className="font-display text-sm font-semibold text-white">Prefer email?</p>
                  <p className="mt-2 text-sm leading-relaxed text-cloud-300">
                    Send us your brief directly at{' '}
                    <a href={`mailto:${CONTACT.email}`} className="text-electric-200 underline-offset-4 hover:underline">
                      {CONTACT.email}
                    </a>{' '}
                    — we usually reply within a day.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-[0.15em] text-cloud-400">
        {label}
        {required && <span aria-hidden className="text-electric">*</span>}
      </span>
      {children}
      {error && (
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-red-400"
            role="alert"
          >
            {error}
          </motion.span>
        </AnimatePresence>
      )}
    </label>
  );
}

function fieldCls(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-ink-950/60 px-4 py-3.5 text-sm text-white placeholder:text-cloud-600 transition-colors duration-300',
    hasError
      ? 'border-red-500/60 focus:border-red-400 focus:outline-none'
      : 'border-white/10 focus:border-electric/60 focus:outline-none focus:ring-1 focus:ring-electric/30',
  );
}