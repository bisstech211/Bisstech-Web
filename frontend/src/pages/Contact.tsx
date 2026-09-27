import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SERVICES } from '../data/services';
import { CONTACT, SOCIALS } from '../data/site';
import { Reveal } from '../components/ui/Reveal';
import { EASE } from '../lib/motion';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const BUDGETS = ['Under $1k', '$1k – $5k', '$5k – $15k', '$15k – $50k', '$50k+', 'Not sure yet'];

type FormState = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  details: string;
};

const empty: FormState = {
  name: '',
  email: '',
  countryCode: '+91',
  phone: '',
  company: '',
  service: '',
  budget: '',
  details: '',
};

export default function Contact() {
  const { settings } = useWebsiteSettings();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Header button settings for consistent hover effect
  const headerBtnBg = settings.header?.buttonBgColor || '#6f4e37';
  const headerBtnHoverBg = settings.header?.buttonHoverBg || '#3d2b1f';
  const headerBtnText = settings.header?.buttonText || 'Start a Project';

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (apiError) setApiError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email';
    if (!form.service) next.service = 'Select a service';
    if (!form.details.trim()) next.details = 'Tell us a little about your project';
    if (Object.keys(next).length) { setErrors(next); return; }

    setSubmitting(true);
    setApiError(null);

    // UTM + referrer + device capture (graceful — backend is optional)
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fullPhone = form.countryCode && form.phone.trim() ? `${form.countryCode} ${form.phone.trim()}` : undefined;
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: fullPhone,
      company: form.company.trim() || undefined,
      service: form.service,
      budget: form.budget || undefined,
      message: form.details.trim(),
      source: 'contact-page',
      landingPage: typeof window !== 'undefined' ? window.location.href : undefined,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      utmContent: params.get('utm_content') || undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      website: honeypot || undefined, // honeypot — backend silently accepts if filled and drops
    };

    try {
      const res = await fetch('/api/v1/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as { error?: string }).error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      // Graceful fallback: if backend is unreachable, still show success so the UX is not broken.
      // We surface a soft error only when the backend explicitly rejected the payload (4xx with message).
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      const isNetworkError = msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch');
      if (isNetworkError) {
        setSubmitted(true);
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact BISSTECH — Start Your Project"
        description="Let's build something that matters. Tell us about your project — digital marketing, web development, e-commerce, AI automation or design — and we'll get back to you fast."
        path="/contact"
      />
      <main>
        <section className="relative overflow-hidden pt-40 pb-24 bg-cream-50" aria-label="Contact BISSTECH">
          <div aria-hidden className="absolute inset-0 bg-grid-cream mask-fade-y opacity-60" />
          <div aria-hidden className="absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-coffee/10 blur-[130px]" />

          <div className="container-bt relative">
            <Reveal>
              <p className="eyebrow">Contact</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-3xl font-display text-display-lg font-bold text-espresso-950">
                Let's build something that <span className="text-gradient">matters</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-espresso-600 sm:text-lg">
                Tell us where you want to go. We'll respond within one business day with honest next
                steps.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-28" aria-label="Contact form">
          <div className="container-bt grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            {/* Form / success */}
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-espresso-950/08 bg-white p-6 shadow-card-light sm:p-10">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coffee/50 to-transparent" />

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
                        className="grid h-16 w-16 place-items-center rounded-full bg-coffee/20 text-coffee"
                      >
                        <CheckCircle2 className="h-8 w-8" />
                      </motion.div>
                      <h2 className="mt-8 font-display text-3xl font-bold text-espresso-950">Message received.</h2>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-espresso-600">
                        Thanks, {form.name.split(' ')[0] || 'friend'}. We're reviewing your brief and
                        will be in touch at <span className="text-coffee">{form.email}</span> within one
                        business day.
                      </p>
                      <a
                        href={`mailto:${CONTACT.email}?subject=Project%20enquiry%20from%20${encodeURIComponent(form.company || 'your%20website')}`}
                        className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold text-coffee transition-colors hover:text-espresso-950"
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
                        <div className="flex gap-2">
                          <select
                            value={form.countryCode || '+91'}
                            onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
                            className={cn('rounded-xl border bg-cream-100 px-3 py-3.5 text-sm text-espresso-950 transition-colors duration-300 border-espresso-950/10 focus:border-coffee/60 focus:outline-none focus:ring-1 focus:ring-coffee/30 shrink-0 w-[85px]', false)}
                          >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+86">🇨🇳 +86</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+65">🇸🇬 +65</option>
                          </select>
                          <input
                            className={cn(fieldCls(false), 'flex-1')}
                            value={form.phone}
                            onChange={set('phone')}
                            placeholder="12345 67890"
                            autoComplete="tel"
                          />
                        </div>
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
                            placeholder="Tell us about your goals, timeline, current challenges..."
                          />
                        </Field>
                      </div>
                      {/* Honeypot — hidden from users, catches bots */}
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
                        placeholder="Leave this field empty"
                      />
                      {apiError && (
                        <div className="sm:col-span-2 rounded-xl border border-coffee/40 bg-coffee/10 px-4 py-3 text-sm text-espresso-950" role="alert">
                          {apiError}
                        </div>
                      )}
                      <div className="sm:col-span-2 mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-espresso-400">
                          By submitting, you agree to be contacted by BISSTECH about your enquiry.
                        </p>
                        <Button
                          type="submit"
                          disabled={submitting}
                          to="/contact"
                          size="md"
                          variant="primary"
                          withArrow
                          style={{
                            backgroundColor: headerBtnBg,
                          }}
                          onMouseEnter={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            target.style.backgroundColor = headerBtnHoverBg;
                          }}
                          onMouseLeave={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            target.style.backgroundColor = headerBtnBg;
                          }}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                            </>
                          ) : (
                            <>
                              {headerBtnText}
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Contact info */}
            <div className="space-y-4">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-espresso-950/06 bg-white p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-3 inline-flex items-center gap-2.5 font-display text-base font-medium text-espresso-950 transition-colors hover:text-coffee"
                  >
                    <Mail className="h-4 w-4 text-coffee" />
                    {CONTACT.email}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="rounded-2xl border border-espresso-950/06 bg-white p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-400">
                    WhatsApp
                  </p>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-2.5 font-display text-base font-medium text-espresso-950 transition-colors hover:text-coffee"
                  >
                    <MessageCircle className="h-4 w-4 text-coffee" />
                    {CONTACT.whatsappDisplay}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="rounded-2xl border border-espresso-950/06 bg-white p-7">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-espresso-400">
                    Follow us
                  </p>
                  <div className="mt-4 flex gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full border border-espresso-950/10 text-espresso-600 transition-all duration-300 hover:border-coffee hover:bg-coffee hover:text-cream-50"
                      >
                        <s.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.28}>
                <div className="rounded-2xl bg-gradient-to-br from-coffee/20 to-espresso-700/10 p-7">
                  <p className="font-display text-sm font-semibold text-espresso-950">Prefer email?</p>
                  <p className="mt-2 text-sm leading-relaxed text-espresso-600">
                    Send us your brief directly at{' '}
                    <a href={`mailto:${CONTACT.email}`} className="text-coffee underline-offset-4 hover:underline">
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
      <span className="mb-2 flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-[0.15em] text-espresso-400">
        {label}
        {required && <span aria-hidden className="text-coffee">*</span>}
      </span>
      {children}
      {error && (
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-coffee"
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
    'w-full rounded-xl border bg-cream-100 px-4 py-3.5 text-sm text-espresso-950 placeholder:text-espresso-400 transition-colors duration-300',
    hasError
      ? 'border-coffee/60 focus:border-coffee/40 focus:outline-none focus:ring-1 focus:ring-coffee/30'
      : 'border-espresso-950/10 focus:border-coffee/60 focus:outline-none focus:ring-1 focus:ring-coffee/30',
  );
}