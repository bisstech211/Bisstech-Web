import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

type Tab =
  | 'general'
  | 'branding'
  | 'header'
  | 'button'
  | 'typography'
  | 'textHover'
  | 'linkHover'
  | 'cardHover'
  | 'footer'
  | 'footerHover'
  | 'bottomSectionHover'
  | 'social'
  | 'colors'
  | 'animation'
  | 'seo'
  | 'integrations'
  | 'technologies'
  | 'navigation'
  | 'socials';

const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'branding', label: 'Logo & Branding' },
  { id: 'header', label: 'Header/Navigation' },
  { id: 'button', label: 'Buttons' },
  { id: 'typography', label: 'Typography' },
  { id: 'textHover', label: 'Text Hover' },
  { id: 'linkHover', label: 'Link Hover' },
  { id: 'cardHover', label: 'Card Hover' },
  { id: 'footer', label: 'Footer' },
  { id: 'footerHover', label: 'Footer Hover' },
  { id: 'bottomSectionHover', label: 'Bottom & Footer Appearance' },
  { id: 'social', label: 'Social Icons' },
  { id: 'colors', label: 'Colors' },
  { id: 'animation', label: 'Animation' },
  { id: 'seo', label: 'SEO' },
  { id: 'integrations', label: 'Advanced' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'navigation', label: 'Navigation (Legacy)' },
  { id: 'socials', label: 'Social Links (Legacy)' },
];

type TechnologyItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  logoAlt: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
};

type TechnologyCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  items: TechnologyItem[];
};

type SettingsState = {
  site: Record<string, unknown>;
  branding: Record<string, unknown>;
  header: Record<string, unknown>;
  button: Record<string, unknown>;
  typography: Record<string, unknown>;
  textHover: Record<string, unknown>;
  linkHover: Record<string, unknown>;
  cardHover: Record<string, unknown>;
  footer: Record<string, unknown>;
  footerHover: Record<string, unknown>;
  bottomSectionHover: Record<string, unknown>;
  social: Array<Record<string, unknown>>;
  colors: Record<string, unknown>;
  animation: Record<string, unknown>;
  seo: Record<string, unknown>;
  integrations: Array<Record<string, unknown>>;
  technologies: TechnologyCategory[];
  nav: Array<Record<string, unknown>>;
  socials: Array<Record<string, unknown>>;
};

function SettingsForm<T extends Record<string, unknown>>({
  category,
  fields,
  initialValues,
  onSubmit,
  onReset,
}: {
  category: Tab;
  fields: Array<{
    key: keyof T;
    label: string;
    type?: 'text' | 'number' | 'color' | 'select' | 'textarea' | 'checkbox' | 'file' | 'json';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    responsive?: boolean;
    help?: string;
  }>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [data, setData] = useState<T>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{fields[0]?.label || category}</h2>
        <div className="flex items-center gap-2">
          {success && <span className="text-xs text-emerald-300">Saved!</span>}
          {error && <span className="text-xs text-red-300">{error}</span>}
          <button type="button" onClick={onReset} disabled={saving} className="text-xs text-white/50 hover:text-red-300">Reset</button>
        </div>
      </div>

      {fields.map((field) => (
        <div key={String(field.key)} className="space-y-1">
          <label className="text-xs font-medium text-white/70 block">{field.label}{field.help && <span className="text-white/40 ml-1">({field.help})</span>}</label>

          {field.type === 'select' && (
            <select
              value={data[field.key] as string}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
              disabled={saving}
            >
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {field.type === 'textarea' && (
            <textarea
              value={data[field.key] as string}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={3}
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm"
              disabled={saving}
            />
          )}

          {field.type === 'checkbox' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data[field.key] as boolean}
                onChange={(e) => handleChange(field.key, e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/40 text-electric"
                disabled={saving}
              />
              <span className="text-sm">{field.label}</span>
            </label>
          )}

          {field.type === 'file' && (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('files', file);
                  const res = await api.post('/media/upload?folder=logos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  handleChange(field.key, res.data.data[0].url);
                }}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-electric file:px-3 file:py-1 file:text-white"
                disabled={saving}
              />
              {data[field.key] && (
                <img src={data[field.key] as string} alt="Preview" className="h-16 w-auto rounded-lg border border-white/10" />
              )}
            </div>
          )}

          {field.type === 'json' && (
            <textarea
              value={JSON.stringify(data[field.key] || {}, null, 2)}
              onChange={(e) => {
                try {
                  handleChange(field.key, JSON.parse(e.target.value));
                } catch {
                  // invalid JSON, ignore
                }
              }}
              rows={4}
              placeholder={field.placeholder || '{}'}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-mono"
              disabled={saving}
            />
          )}

          {!field.type && field.type !== 'textarea' && field.type !== 'select' && field.type !== 'checkbox' && field.type !== 'file' && field.type !== 'json' && (
            <input
              type={field.type === 'number' ? 'number' : field.type === 'color' ? 'color' : 'text'}
              value={data[field.key] as string | number}
              onChange={(e) => handleChange(field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
              placeholder={field.placeholder}
              className={`w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm ${field.type === 'color' ? 'h-10 p-1 cursor-pointer' : ''}`}
              disabled={saving}
            />
          )}

          {field.responsive && (
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-white/40">
              <span>Desktop</span>
              <span>Tablet</span>
              <span>Mobile</span>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button type="submit" disabled={saving} className="flex-1 rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" onClick={onReset} disabled={saving} className="rounded-full border border-white/15 px-6 py-2 text-sm font-medium text-white/70 hover:bg-white/5">
          Reset to Defaults
        </button>
      </div>
    </form>
  );
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('general');
  const [loading, setLoading] = useState(true);

  // State for each category
  const [state, setState] = useState<SettingsState>({
    site: {},
    branding: {},
    header: {},
    button: {},
    typography: {},
    textHover: {},
    linkHover: {},
    cardHover: {},
    footer: {},
    footerHover: {},
    bottomSectionHover: {},
    social: [],
    colors: {},
    animation: {},
    seo: {},
    integrations: [],
    technologies: [],
    nav: [],
    socials: [],
  });
  const [newNav, setNewNav] = useState({ label: '', path: '', sortOrder: 0 });
  const [newSocial, setNewSocial] = useState({ platform: 'instagram', url: '' });

  const loadCategory = useCallback(async (category: Tab) => {
    try {
      switch (category) {
        case 'general': {
          const res = await api.get('/settings/site');
          setState(prev => ({ ...prev, site: res.data.data }));
          break;
        }
        case 'branding': {
          const res = await api.get('/settings/branding');
          setState(prev => ({ ...prev, branding: res.data.data }));
          break;
        }
        case 'header': {
          const res = await api.get('/settings/header');
          setState(prev => ({ ...prev, header: res.data.data }));
          break;
        }
        case 'button': {
          const res = await api.get('/settings/button');
          setState(prev => ({ ...prev, button: res.data.data }));
          break;
        }
        case 'typography': {
          const res = await api.get('/settings/typography');
          setState(prev => ({ ...prev, typography: res.data.data }));
          break;
        }
        case 'textHover': {
          const res = await api.get('/settings/textHover');
          setState(prev => ({ ...prev, textHover: res.data.data }));
          break;
        }
        case 'linkHover': {
          const res = await api.get('/settings/linkHover');
          setState(prev => ({ ...prev, linkHover: res.data.data }));
          break;
        }
        case 'cardHover': {
          const res = await api.get('/settings/cardHover');
          setState(prev => ({ ...prev, cardHover: res.data.data }));
          break;
        }
        case 'footer': {
          const res = await api.get('/settings/footer');
          setState(prev => ({ ...prev, footer: res.data.data }));
          break;
        }
        case 'footerHover': {
          const res = await api.get('/settings/footerHover');
          setState(prev => ({ ...prev, footerHover: res.data.data }));
          break;
        }
        case 'bottomSectionHover': {
          const res = await api.get('/settings/bottomSectionHover');
          setState(prev => ({ ...prev, bottomSectionHover: res.data.data }));
          break;
        }
        case 'social': {
          const res = await api.get('/settings/social');
          setState(prev => ({ ...prev, social: res.data.data }));
          break;
        }
        case 'colors': {
          const res = await api.get('/settings/colors');
          setState(prev => ({ ...prev, colors: res.data.data }));
          break;
        }
        case 'animation': {
          const res = await api.get('/settings/animation');
          setState(prev => ({ ...prev, animation: res.data.data }));
          break;
        }
        case 'technologies': {
          const res = await api.get('/technologies/categories');
          setState(prev => ({ ...prev, technologies: res.data.data || [] }));
          break;
        }
        case 'seo': {
          const res = await api.get('/settings/seo');
          setState(prev => ({ ...prev, seo: res.data.data }));
          break;
        }
        case 'integrations': {
          const res = await api.get('/settings/integrations');
          setState(prev => ({ ...prev, integrations: res.data.data || [] }));
          break;
        }
        case 'navigation': {
          const res = await api.get('/settings/navigation');
          setState(prev => ({ ...prev, nav: res.data.data || [] }));
          break;
        }
        case 'socials': {
          const res = await api.get('/settings/socials');
          setState(prev => ({ ...prev, socials: res.data.data || [] }));
          break;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      api.get('/settings/site').then(r => setState(prev => ({ ...prev, site: r.data.data }))),
      api.get('/settings/branding').then(r => setState(prev => ({ ...prev, branding: r.data.data }))),
      api.get('/settings/header').then(r => setState(prev => ({ ...prev, header: r.data.data }))),
      api.get('/settings/button').then(r => setState(prev => ({ ...prev, button: r.data.data }))),
      api.get('/settings/typography').then(r => setState(prev => ({ ...prev, typography: r.data.data }))),
      api.get('/settings/textHover').then(r => setState(prev => ({ ...prev, textHover: r.data.data }))),
      api.get('/settings/linkHover').then(r => setState(prev => ({ ...prev, linkHover: r.data.data }))),
      api.get('/settings/cardHover').then(r => setState(prev => ({ ...prev, cardHover: r.data.data }))),
      api.get('/settings/footer').then(r => setState(prev => ({ ...prev, footer: r.data.data }))),
      api.get('/settings/footerHover').then(r => setState(prev => ({ ...prev, footerHover: r.data.data }))),
      api.get('/settings/bottomSectionHover').then(r => setState(prev => ({ ...prev, bottomSectionHover: r.data.data }))),
      api.get('/settings/social').then(r => setState(prev => ({ ...prev, social: r.data.data }))),
      api.get('/settings/colors').then(r => setState(prev => ({ ...prev, colors: r.data.data }))),
      api.get('/settings/animation').then(r => setState(prev => ({ ...prev, animation: r.data.data }))),
      api.get('/technologies/categories').then(r => setState(prev => ({ ...prev, technologies: r.data.data || [] }))).catch(() => setState(prev => ({ ...prev, technologies: [] }))),
      api.get('/settings/seo').then(r => setState(prev => ({ ...prev, seo: r.data.data }))),
      api.get('/settings/integrations').catch(() => ({ data: { data: [] } })).then(r => setState(prev => ({ ...prev, integrations: r.data.data || [] }))),
      api.get('/settings/navigation').then(r => setState(prev => ({ ...prev, nav: r.data.data || [] }))),
      api.get('/settings/socials').then(r => setState(prev => ({ ...prev, socials: r.data.data || [] }))),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveCategory = useCallback(async (category: Tab, data: Record<string, unknown>) => {
    const endpoint = category === 'general' ? 'site' : category;
    await api.put(`/settings/${endpoint}`, data);
  }, []);

  const resetCategory = useCallback(async (category: Tab) => {
    if (!confirm('Reset this section to defaults?')) return;
    const endpoint = category === 'general' ? 'site' : category;
    await api.post(`/settings/${endpoint}/reset`);
    await loadCategory(category);
    alert('Reset to defaults');
  }, [loadCategory]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent" /></div>;

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); loadCategory(t.id); }}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
              tab === t.id
                ? 'bg-electric text-white'
                : 'border border-white/15 text-white/70 hover:bg-white/5 hover:border-electric/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <SettingsForm
          category="general"
          initialValues={state.site}
          onSubmit={data => saveCategory('general', data)}
          onReset={() => resetCategory('general')}
          fields={[
            { key: 'siteName', label: 'Site Name', type: 'text', placeholder: 'BISSTECH' },
            { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Build. Grow. Automate.' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Company description' },
            { key: 'logoUrl', label: 'Logo URL', type: 'file', help: 'Upload logo image' },
            { key: 'faviconUrl', label: 'Favicon URL', type: 'file', help: 'Upload favicon (32x32 or 16x16)' },
            { key: 'contactEmail', label: 'Contact Email', type: 'text', placeholder: 'info@bisstech.com' },
            { key: 'contactPhone', label: 'Contact Phone', type: 'text', placeholder: '+1 234 567 890' },
            { key: 'whatsapp', label: 'WhatsApp URL', type: 'text', placeholder: 'https://wa.me/...' },
            { key: 'whatsappDisplay', label: 'WhatsApp Display', type: 'text', placeholder: '+1 234 567 890' },
            { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Company address' },
            { key: 'businessHours', label: 'Business Hours', type: 'text', placeholder: 'Mon-Fri 9am-6pm' },
            { key: 'mapEmbedUrl', label: 'Map Embed URL', type: 'text', placeholder: 'Google Maps embed iframe URL' },
          ]}
        />
      )}

      {/* Logo & Branding */}
      {tab === 'branding' && (
        <SettingsForm
          category="branding"
          initialValues={state.branding}
          onSubmit={data => saveCategory('branding', data)}
          onReset={() => resetCategory('branding')}
          fields={[
            { key: 'logoUrl', label: 'Main Logo', type: 'file', help: 'Primary logo (light background)' },
            { key: 'mobileLogoUrl', label: 'Mobile Logo', type: 'file', help: 'Logo for mobile header' },
            { key: 'darkLogoUrl', label: 'Dark Mode Logo', type: 'file', help: 'Logo for dark backgrounds' },
            { key: 'faviconUrl', label: 'Favicon', type: 'file', help: 'Browser tab icon (32x32)' },
            { key: 'logoWidth', label: 'Logo Width (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 180, tablet: 160, mobile: 140}' },
            { key: 'logoHeight', label: 'Logo Height (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 48, tablet: 42, mobile: 36}' },
          ]}
        />
      )}

      {/* Header/Navigation */}
      {tab === 'header' && (
        <SettingsForm
          category="header"
          initialValues={state.header}
          onSubmit={data => saveCategory('header', data)}
          onReset={() => resetCategory('header')}
          fields={[
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'backgroundOpacity', label: 'Background Opacity (0-1)', type: 'number', placeholder: '0.95' },
            { key: 'blur', label: 'Backdrop Blur (px)', type: 'number', placeholder: '20' },
            { key: 'borderColor', label: 'Border Color', type: 'color' },
            { key: 'borderWidth', label: 'Border Width (px)', type: 'number', placeholder: '1' },
            { key: 'shadow', label: 'Box Shadow', type: 'text', placeholder: '0 4px 30px rgba(0,0,0,0.3)' },
            { key: 'height', label: 'Height (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 80, tablet: 72, mobile: 64}' },
            { key: 'navFontSize', label: 'Nav Font Size (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 15, tablet: 14, mobile: 13}' },
            { key: 'navFontWeight', label: 'Nav Font Weight', type: 'select', options: [
              { value: '400', label: 'Normal (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi-bold (600)' },
              { value: '700', label: 'Bold (700)' },
            ]},
            { key: 'navSpacing', label: 'Nav Item Spacing (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 32, tablet: 24, mobile: 16}' },
            { key: 'navHoverColor', label: 'Nav Hover Color', type: 'color' },
            { key: 'navActiveColor', label: 'Nav Active Color', type: 'color' },
            { key: 'navUnderline', label: 'Nav Underline', type: 'checkbox' },
            { key: 'navUnderlineThickness', label: 'Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'navUnderlineSpeed', label: 'Underline Animation Speed (s)', type: 'number', placeholder: '0.3' },
            { key: 'buttonText', label: 'Header CTA Button Text', type: 'text', placeholder: 'Get Started' },
            { key: 'buttonBgColor', label: 'Header CTA Background', type: 'color' },
            { key: 'buttonHoverBg', label: 'Header CTA Hover Background', type: 'color' },
          ]}
        />
      )}

      {/* Buttons */}
      {tab === 'button' && (
        <SettingsForm
          category="button"
          initialValues={state.button}
          onSubmit={data => saveCategory('button', data)}
          onReset={() => resetCategory('button')}
          fields={[
            { key: 'variant', label: 'Default Variant', type: 'select', options: [
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'outline', label: 'Outline' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'headerCta', label: 'Header CTA' },
            ]},
            { key: 'bgColor', label: 'Background Color', type: 'color' },
            { key: 'textColor', label: 'Text Color', type: 'color' },
            { key: 'borderColor', label: 'Border Color', type: 'color' },
            { key: 'borderWidth', label: 'Border Width (px)', type: 'number', placeholder: '0' },
            { key: 'borderRadius', label: 'Border Radius (px)', type: 'number', placeholder: '9999' },
            { key: 'padding', label: 'Padding (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: "16px 32px", tablet: "14px 28px", mobile: "12px 24px"}' },
            { key: 'fontSize', label: 'Font Size (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 15, tablet: 14, mobile: 13}' },
            { key: 'fontWeight', label: 'Font Weight', type: 'select', options: [
              { value: '400', label: 'Normal (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi-bold (600)' },
              { value: '700', label: 'Bold (700)' },
            ]},
            { key: 'hoverBgColor', label: 'Hover Background', type: 'color' },
            { key: 'hoverTextColor', label: 'Hover Text Color', type: 'color' },
            { key: 'hoverBorderColor', label: 'Hover Border Color', type: 'color' },
            { key: 'hoverScale', label: 'Hover Scale', type: 'number', placeholder: '1.02', help: 'e.g., 1.02' },
            { key: 'hoverShadow', label: 'Hover Shadow', type: 'text', placeholder: '0 8px 25px rgba(245,158,11,0.4)' },
            { key: 'transitionDuration', label: 'Transition Duration (s)', type: 'number', placeholder: '0.3' },
          ]}
        />
      )}

      {/* Typography */}
      {tab === 'typography' && (
        <SettingsForm
          category="typography"
          initialValues={state.typography}
          onSubmit={data => saveCategory('typography', data)}
          onReset={() => resetCategory('typography')}
          fields={[
            { key: 'primaryFont', label: 'Primary Font', type: 'text', placeholder: 'Inter, system-ui, sans-serif' },
            { key: 'headingFont', label: 'Heading Font', type: 'text', placeholder: 'Inter, system-ui, sans-serif' },
            { key: 'bodyFont', label: 'Body Font', type: 'text', placeholder: 'Inter, system-ui, sans-serif' },
            { key: 'headingWeight', label: 'Heading Weight', type: 'select', options: [
              { value: '400', label: 'Normal (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi-bold (600)' },
              { value: '700', label: 'Bold (700)' },
              { value: '800', label: 'Extra-bold (800)' },
            ]},
            { key: 'bodyWeight', label: 'Body Weight', type: 'select', options: [
              { value: '400', label: 'Normal (400)' },
              { value: '500', label: 'Medium (500)' },
              { value: '600', label: 'Semi-bold (600)' },
            ]},
            { key: 'baseSize', label: 'Base Font Size (px)', type: 'number', placeholder: '16' },
            { key: 'h1Size', label: 'H1 Size (px)', type: 'number', placeholder: '48' },
            { key: 'h2Size', label: 'H2 Size (px)', type: 'number', placeholder: '36' },
            { key: 'h3Size', label: 'H3 Size (px)', type: 'number', placeholder: '24' },
            { key: 'paragraphSize', label: 'Paragraph Size (px)', type: 'number', placeholder: '16' },
            { key: 'lineHeight', label: 'Line Height', type: 'number', placeholder: '1.6', help: 'e.g., 1.6' },
            { key: 'letterSpacing', label: 'Letter Spacing (px)', type: 'number', placeholder: '0' },
          ]}
        />
      )}

      {/* Text Hover */}
      {tab === 'textHover' && (
        <SettingsForm
          category="textHover"
          initialValues={state.textHover}
          onSubmit={data => saveCategory('textHover', data)}
          onReset={() => resetCategory('textHover')}
          fields={[
            { key: 'effectType', label: 'Effect Type', type: 'select', options: [
              { value: 'none', label: 'None' },
              { value: 'color', label: 'Color Change' },
              { value: 'underline', label: 'Underline' },
              { value: 'opacity', label: 'Opacity' },
              { value: 'scale', label: 'Scale' },
              { value: 'glow', label: 'Glow' },
              { value: 'shadow', label: 'Shadow' },
              { value: 'letterSpacing', label: 'Letter Spacing' },
            ]},
            { key: 'color', label: 'Hover Color', type: 'color' },
            { key: 'opacity', label: 'Hover Opacity', type: 'number', placeholder: '0.8' },
            { key: 'underline', label: 'Show Underline', type: 'checkbox' },
            { key: 'underlineThickness', label: 'Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'underlineOffset', label: 'Underline Offset (px)', type: 'number', placeholder: '4' },
            { key: 'letterSpacing', label: 'Letter Spacing Change (px)', type: 'number', placeholder: '0' },
            { key: 'transform', label: 'Transform', type: 'select', options: [
              { value: 'none', label: 'None' },
              { value: 'uppercase', label: 'Uppercase' },
              { value: 'lowercase', label: 'Lowercase' },
            ]},
            { key: 'scale', label: 'Scale Factor', type: 'number', placeholder: '1' },
            { key: 'glow', label: 'Glow Effect', type: 'text', placeholder: '0 0 20px #f59e0b' },
            { key: 'shadow', label: 'Shadow Effect', type: 'text', placeholder: '0 4px 20px rgba(245,158,11,0.3)' },
            { key: 'transitionDuration', label: 'Transition Duration (s)', type: 'number', placeholder: '0.3' },
            { key: 'easing', label: 'Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},
          ]}
        />
      )}

      {/* Link Hover */}
      {tab === 'linkHover' && (
        <SettingsForm
          category="linkHover"
          initialValues={state.linkHover}
          onSubmit={data => saveCategory('linkHover', data)}
          onReset={() => resetCategory('linkHover')}
          fields={[
            { key: 'effectType', label: 'Effect Type', type: 'select', options: [
              { value: 'color', label: 'Color Change' },
              { value: 'underline', label: 'Underline' },
              { value: 'none', label: 'None' },
            ]},
            { key: 'color', label: 'Default Color', type: 'color' },
            { key: 'hoverColor', label: 'Hover Color', type: 'color' },
            { key: 'underline', label: 'Show Underline on Hover', type: 'checkbox' },
            { key: 'underlineThickness', label: 'Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'transitionDuration', label: 'Transition Duration (s)', type: 'number', placeholder: '0.3' },
            { key: 'easing', label: 'Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},
          ]}
        />
      )}

      {/* Card Hover */}
      {tab === 'cardHover' && (
        <SettingsForm
          category="cardHover"
          initialValues={state.cardHover}
          onSubmit={data => saveCategory('cardHover', data)}
          onReset={() => resetCategory('cardHover')}
          fields={[
            { key: 'effectType', label: 'Effect Type', type: 'select', options: [
              { value: 'lift', label: 'Lift' },
              { value: 'scale', label: 'Scale' },
              { value: 'glow', label: 'Glow' },
              { value: 'border', label: 'Border' },
              { value: 'shadow', label: 'Shadow' },
              { value: 'none', label: 'None' },
            ]},
            { key: 'scale', label: 'Scale Factor', type: 'number', placeholder: '1.02' },
            { key: 'translateY', label: 'Translate Y (px)', type: 'number', placeholder: '-8' },
            { key: 'shadow', label: 'Hover Shadow', type: 'text', placeholder: '0 20px 40px rgba(0,0,0,0.4)' },
            { key: 'borderColor', label: 'Hover Border Color', type: 'color' },
            { key: 'backgroundChange', label: 'Background Change', type: 'color' },
            { key: 'glow', label: 'Glow Effect', type: 'text', placeholder: '0 0 30px rgba(245,158,11,0.3)' },
            { key: 'imageZoom', label: 'Image Zoom', type: 'number', placeholder: '1.05' },
            { key: 'overlayOpacity', label: 'Overlay Opacity', type: 'number', placeholder: '0.1' },
            { key: 'borderRadius', label: 'Border Radius (px)', type: 'number', placeholder: '16' },
            { key: 'transitionDuration', label: 'Transition Duration (s)', type: 'number', placeholder: '0.4' },
            { key: 'easing', label: 'Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},
          ]}
        />
      )}

      {/* Footer */}
      {tab === 'footer' && (
        <SettingsForm
          category="footer"
          initialValues={state.footer}
          onSubmit={data => saveCategory('footer', data)}
          onReset={() => resetCategory('footer')}
          fields={[
            { key: 'logoUrl', label: 'Footer Logo', type: 'file' },
            { key: 'description', label: 'Footer Description', type: 'textarea', placeholder: 'Build. Grow. Automate...' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'textColor', label: 'Text Color', type: 'color' },
            { key: 'headingColor', label: 'Heading Color', type: 'color' },
            { key: 'linkColor', label: 'Link Color', type: 'color' },
            { key: 'linkHoverColor', label: 'Link Hover Color', type: 'color' },
            { key: 'borderColor', label: 'Border Color', type: 'color' },
            { key: 'borderWidth', label: 'Border Width (px)', type: 'number', placeholder: '1' },
            { key: 'spacing', label: 'Section Spacing (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 64, tablet: 48, mobile: 32}' },
            { key: 'padding', label: 'Padding (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 80, tablet: 60, mobile: 40}' },
            { key: 'columnSpacing', label: 'Column Spacing (responsive)', type: 'json', responsive: true, help: 'JSON: {desktop: 48, tablet: 32, mobile: 24}' },
            { key: 'copyrightText', label: 'Copyright Text', type: 'text', placeholder: '© 2025 BISSTECH. All rights reserved.' },
            { key: 'ctaText', label: 'CTA Button Text', type: 'text', placeholder: 'Start Your Project' },
            { key: 'ctaLink', label: 'CTA Link', type: 'text', placeholder: '/contact' },
          ]}
        />
      )}

      {/* Footer Hover */}
      {tab === 'footerHover' && (
        <SettingsForm
          category="footerHover"
          initialValues={state.footerHover}
          onSubmit={data => saveCategory('footerHover', data)}
          onReset={() => resetCategory('footerHover')}
          fields={[
            { key: 'effectType', label: 'Effect Type', type: 'select', options: [
              { value: 'color', label: 'Color Change' },
              { value: 'underline', label: 'Underline' },
              { value: 'none', label: 'None' },
            ]},
            { key: 'hoverColor', label: 'Hover Color', type: 'color' },
            { key: 'underline', label: 'Show Underline', type: 'checkbox' },
            { key: 'underlineThickness', label: 'Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'transitionDuration', label: 'Transition Duration (s)', type: 'number', placeholder: '0.3' },
            { key: 'easing', label: 'Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},
          ]}
        />
      )}

      {/* Bottom & Footer Appearance */}
      {tab === 'bottomSectionHover' && (
        <SettingsForm
          category="bottomSectionHover"
          initialValues={state.bottomSectionHover}
          onSubmit={data => saveCategory('bottomSectionHover', data)}
          onReset={() => resetCategory('bottomSectionHover')}
          fields={[
            // Hero CTA Buttons Section
            { key: 'heroCtaPrimaryBg', label: 'Hero Primary CTA — Background', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaPrimaryHoverBg', label: 'Hero Primary CTA — Hover Background', type: 'color', help: 'Default: #3d2b1f' },
            { key: 'heroCtaPrimaryText', label: 'Hero Primary CTA — Text Color', type: 'color', help: 'Default: #ffffff' },
            { key: 'heroCtaPrimaryHoverText', label: 'Hero Primary CTA — Hover Text', type: 'color', help: 'Default: #ffffff' },
            { key: 'heroCtaPrimaryBorder', label: 'Hero Primary CTA — Border', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaPrimaryHoverBorder', label: 'Hero Primary CTA — Hover Border', type: 'color', help: 'Default: #3d2b1f' },
            { key: 'heroCtaPrimaryShadow', label: 'Hero Primary CTA — Shadow', type: 'text', placeholder: '0 8px 25px rgba(111,78,55,0.3)' },
            { key: 'heroCtaPrimaryHoverShadow', label: 'Hero Primary CTA — Hover Shadow', type: 'text', placeholder: '0 12px 35px rgba(61,43,31,0.4)' },
            { key: 'heroCtaPrimaryScale', label: 'Hero Primary CTA — Hover Scale', type: 'number', placeholder: '1.02', help: 'e.g., 1.02' },
            { key: 'heroCtaPrimaryTransition', label: 'Hero Primary CTA — Transition (s)', type: 'number', placeholder: '0.3' },

            { key: 'heroCtaSecondaryBg', label: 'Hero Secondary CTA — Background', type: 'color', help: 'Default: transparent' },
            { key: 'heroCtaSecondaryHoverBg', label: 'Hero Secondary CTA — Hover Background', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaSecondaryText', label: 'Hero Secondary CTA — Text Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaSecondaryHoverText', label: 'Hero Secondary CTA — Hover Text', type: 'color', help: 'Default: #ffffff' },
            { key: 'heroCtaSecondaryBorder', label: 'Hero Secondary CTA — Border', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaSecondaryHoverBorder', label: 'Hero Secondary CTA — Hover Border', type: 'color', help: 'Default: #6f4e37' },
            { key: 'heroCtaSecondaryShadow', label: 'Hero Secondary CTA — Shadow', type: 'text', placeholder: 'none' },
            { key: 'heroCtaSecondaryHoverShadow', label: 'Hero Secondary CTA — Hover Shadow', type: 'text', placeholder: '0 8px 25px rgba(111,78,55,0.3)' },
            { key: 'heroCtaSecondaryScale', label: 'Hero Secondary CTA — Hover Scale', type: 'number', placeholder: '1.02' },
            { key: 'heroCtaSecondaryTransition', label: 'Hero Secondary CTA — Transition (s)', type: 'number', placeholder: '0.3' },

            // CTA Section Buttons
            { key: 'ctaSectionPrimaryBg', label: 'CTA Section Primary — Background', type: 'color', help: 'Default: #2b2118' },
            { key: 'ctaSectionPrimaryHoverBg', label: 'CTA Section Primary — Hover Background', type: 'color', help: 'Default: #1a1611' },
            { key: 'ctaSectionPrimaryText', label: 'CTA Section Primary — Text Color', type: 'color', help: 'Default: #fafafa' },
            { key: 'ctaSectionPrimaryHoverText', label: 'CTA Section Primary — Hover Text', type: 'color', help: 'Default: #fafafa' },
            { key: 'ctaSectionPrimaryShadow', label: 'CTA Section Primary — Shadow', type: 'text', placeholder: '0 2px 12px -2px rgba(61,43,31,0.08)' },
            { key: 'ctaSectionPrimaryHoverShadow', label: 'CTA Section Primary — Hover Shadow', type: 'text', placeholder: '0 4px 20px -4px rgba(61,43,31,0.1)' },
            { key: 'ctaSectionPrimaryScale', label: 'CTA Section Primary — Hover Scale', type: 'number', placeholder: '1.0' },
            { key: 'ctaSectionPrimaryTransition', label: 'CTA Section Primary — Transition (s)', type: 'number', placeholder: '0.3' },
            { key: 'ctaSectionPrimaryArrowTranslateX', label: 'CTA Section Primary — Arrow Translate X (px)', type: 'number', placeholder: '4' },

            { key: 'ctaSectionSecondaryBg', label: 'CTA Section Secondary — Background', type: 'color', help: 'Default: #ffffff' },
            { key: 'ctaSectionSecondaryHoverBg', label: 'CTA Section Secondary — Hover Background', type: 'color', help: 'Default: #f5f5f5' },
            { key: 'ctaSectionSecondaryText', label: 'CTA Section Secondary — Text Color', type: 'color', help: 'Default: #3d2b1f' },
            { key: 'ctaSectionSecondaryHoverText', label: 'CTA Section Secondary — Hover Text', type: 'color', help: 'Default: #1a1a1a' },
            { key: 'ctaSectionSecondaryBorder', label: 'CTA Section Secondary — Border', type: 'color', help: 'Default: rgba(111,78,55,0.1)' },
            { key: 'ctaSectionSecondaryHoverBorder', label: 'CTA Section Secondary — Hover Border', type: 'color', help: 'Default: #6f4e37' },
            { key: 'ctaSectionSecondaryShadow', label: 'CTA Section Secondary — Shadow', type: 'text', placeholder: '0 2px 12px -2px rgba(61,43,31,0.08)' },
            { key: 'ctaSectionSecondaryHoverShadow', label: 'CTA Section Secondary — Hover Shadow', type: 'text', placeholder: '0 4px 20px -4px rgba(61,43,31,0.1)' },
            { key: 'ctaSectionSecondaryScale', label: 'CTA Section Secondary — Hover Scale', type: 'number', placeholder: '1.0' },
            { key: 'ctaSectionSecondaryTransition', label: 'CTA Section Secondary — Transition (s)', type: 'number', placeholder: '0.3' },

            // Service Cards
            { key: 'serviceCardBg', label: 'Service Card — Background', type: 'color', help: 'Default: #ffffff' },
            { key: 'serviceCardHoverBg', label: 'Service Card — Hover Background', type: 'color', help: 'Default: #ffffff' },
            { key: 'serviceCardBorderColor', label: 'Service Card — Border Color', type: 'color', help: 'Default: rgba(111,78,55,0.06)' },
            { key: 'serviceCardHoverBorderColor', label: 'Service Card — Hover Border Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardShadow', label: 'Service Card — Shadow', type: 'text', placeholder: '0 2px 12px -2px rgba(61,43,31,0.08)' },
            { key: 'serviceCardHoverShadow', label: 'Service Card — Hover Shadow', type: 'text', placeholder: '0 4px 20px -4px rgba(61,43,31,0.1)' },
            { key: 'serviceCardTranslateY', label: 'Service Card — Translate Y (px)', type: 'number', placeholder: '-4' },
            { key: 'serviceCardScale', label: 'Service Card — Hover Scale', type: 'number', placeholder: '1.0' },
            { key: 'serviceCardImageZoom', label: 'Service Card — Image Zoom', type: 'number', placeholder: '1.05' },
            { key: 'serviceCardImageTransition', label: 'Service Card — Image Transition (s)', type: 'number', placeholder: '0.7' },
            { key: 'serviceCardBorderWidth', label: 'Service Card — Border Width (px)', type: 'number', placeholder: '1' },
            { key: 'serviceCardHoverBorderWidth', label: 'Service Card — Hover Border Width (px)', type: 'number', placeholder: '1' },
            { key: 'serviceCardBottomBarHeight', label: 'Service Card — Bottom Bar Height (px)', type: 'number', placeholder: '2' },
            { key: 'serviceCardBottomBarColor', label: 'Service Card — Bottom Bar Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardBottomBarTransition', label: 'Service Card — Bottom Bar Transition (s)', type: 'number', placeholder: '0.5' },
            { key: 'serviceCardIconBg', label: 'Service Card — Icon Background', type: 'color', help: 'Default: rgba(111,78,55,0.1)' },
            { key: 'serviceCardIconHoverBg', label: 'Service Card — Icon Hover Background', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardIconText', label: 'Service Card — Icon Text Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardIconHoverText', label: 'Service Card — Icon Hover Text', type: 'color', help: 'Default: #fafafa' },
            { key: 'serviceCardIconScale', label: 'Service Card — Icon Scale', type: 'number', placeholder: '1.0' },
            { key: 'serviceCardIconTransition', label: 'Service Card — Icon Transition (s)', type: 'number', placeholder: '0.5' },
            { key: 'serviceCardExploreTextColor', label: 'Service Card — Explore Text Color', type: 'color', help: 'Default: #8a7d6e' },
            { key: 'serviceCardExploreHoverTextColor', label: 'Service Card — Explore Hover Text', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardArrowColor', label: 'Service Card — Arrow Color', type: 'color', help: 'Default: #8a7d6e' },
            { key: 'serviceCardArrowHoverColor', label: 'Service Card — Arrow Hover Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'serviceCardArrowTranslateX', label: 'Service Card — Arrow Translate X (px)', type: 'number', placeholder: '4' },
            { key: 'serviceCardArrowTranslateY', label: 'Service Card — Arrow Translate Y (px)', type: 'number', placeholder: '-4' },
            { key: 'serviceCardArrowTransition', label: 'Service Card — Arrow Transition (s)', type: 'number', placeholder: '0.3' },

            // Footer Branding
            { key: 'footerLogoHoverOpacity', label: 'Footer Logo — Hover Opacity', type: 'number', placeholder: '0.8' },
            { key: 'footerLogoHoverScale', label: 'Footer Logo — Hover Scale', type: 'number', placeholder: '1.02' },
            { key: 'footerLogoTransition', label: 'Footer Logo — Transition (s)', type: 'number', placeholder: '0.3' },
            { key: 'footerEmailColor', label: 'Footer Email — Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'footerEmailHoverColor', label: 'Footer Email — Hover Color', type: 'color', help: 'Default: #3d2b1f' },
            { key: 'footerEmailUnderline', label: 'Footer Email — Underline', type: 'checkbox' },
            { key: 'footerEmailUnderlineThickness', label: 'Footer Email — Underline Thickness (px)', type: 'number', placeholder: '1' },
            { key: 'footerEmailTransition', label: 'Footer Email — Transition (s)', type: 'number', placeholder: '0.2' },

            // Footer Navigation Links
            { key: 'footerNavLinkColor', label: 'Footer Nav Links — Color', type: 'color', help: 'Default: #4a4a4a' },
            { key: 'footerNavLinkHoverColor', label: 'Footer Nav Links — Hover Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'footerNavLinkUnderline', label: 'Footer Nav Links — Underline', type: 'checkbox' },
            { key: 'footerNavLinkUnderlineThickness', label: 'Footer Nav Links — Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'footerNavLinkUnderlineOffset', label: 'Footer Nav Links — Underline Offset (px)', type: 'number', placeholder: '4' },
            { key: 'footerNavLinkTransition', label: 'Footer Nav Links — Transition (s)', type: 'number', placeholder: '0.2' },
            { key: 'footerNavLinkEasing', label: 'Footer Nav Links — Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},

            // Footer Services Links
            { key: 'footerServiceLinkColor', label: 'Footer Service Links — Color', type: 'color', help: 'Default: #4a4a4a' },
            { key: 'footerServiceLinkHoverColor', label: 'Footer Service Links — Hover Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'footerServiceLinkUnderline', label: 'Footer Service Links — Underline', type: 'checkbox' },
            { key: 'footerServiceLinkUnderlineThickness', label: 'Footer Service Links — Underline Thickness (px)', type: 'number', placeholder: '2' },
            { key: 'footerServiceLinkUnderlineOffset', label: 'Footer Service Links — Underline Offset (px)', type: 'number', placeholder: '4' },
            { key: 'footerServiceLinkTransition', label: 'Footer Service Links — Transition (s)', type: 'number', placeholder: '0.2' },
            { key: 'footerServiceLinkEasing', label: 'Footer Service Links — Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},

            // Footer Social Icons
            { key: 'footerSocialIconSize', label: 'Footer Social Icons — Size (px)', type: 'number', placeholder: '20' },
            { key: 'footerSocialIconColor', label: 'Footer Social Icons — Color', type: 'color', help: 'Default: #4a4a4a' },
            { key: 'footerSocialIconHoverColor', label: 'Footer Social Icons — Hover Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'footerSocialIconBg', label: 'Footer Social Icons — Background', type: 'color', help: 'Default: transparent' },
            { key: 'footerSocialIconHoverBg', label: 'Footer Social Icons — Hover Background', type: 'color', help: 'Default: rgba(111,78,55,0.1)' },
            { key: 'footerSocialIconBorderRadius', label: 'Footer Social Icons — Border Radius (px)', type: 'number', placeholder: '12' },
            { key: 'footerSocialIconScale', label: 'Footer Social Icons — Hover Scale', type: 'number', placeholder: '1.1' },
            { key: 'footerSocialIconRotation', label: 'Footer Social Icons — Hover Rotation (deg)', type: 'number', placeholder: '0' },
            { key: 'footerSocialIconShadow', label: 'Footer Social Icons — Shadow', type: 'text', placeholder: 'none' },
            { key: 'footerSocialIconHoverShadow', label: 'Footer Social Icons — Hover Shadow', type: 'text', placeholder: '0 4px 15px rgba(111,78,55,0.2)' },
            { key: 'footerSocialIconTransition', label: 'Footer Social Icons — Transition (s)', type: 'number', placeholder: '0.3' },

            // Footer CTA Button
            { key: 'footerCtaBg', label: 'Footer CTA — Background', type: 'color', help: 'Default: #6f4e37' },
            { key: 'footerCtaHoverBg', label: 'Footer CTA — Hover Background', type: 'color', help: 'Default: #3d2b1f' },
            { key: 'footerCtaText', label: 'Footer CTA — Text Color', type: 'color', help: 'Default: #ffffff' },
            { key: 'footerCtaHoverText', label: 'Footer CTA — Hover Text', type: 'color', help: 'Default: #ffffff' },
            { key: 'footerCtaShadow', label: 'Footer CTA — Shadow', type: 'text', placeholder: '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)' },
            { key: 'footerCtaHoverShadow', label: 'Footer CTA — Hover Shadow', type: 'text', placeholder: '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)' },
            { key: 'footerCtaScale', label: 'Footer CTA — Hover Scale', type: 'number', placeholder: '1.0' },
            { key: 'footerCtaArrowTranslateX', label: 'Footer CTA — Arrow Translate X (px)', type: 'number', placeholder: '4' },
            { key: 'footerCtaArrowTranslateY', label: 'Footer CTA — Arrow Translate Y (px)', type: 'number', placeholder: '-4' },
            { key: 'footerCtaTransition', label: 'Footer CTA — Transition (s)', type: 'number', placeholder: '0.3' },

            // Copyright Bar Links
            { key: 'copyrightLinkColor', label: 'Copyright Links — Color', type: 'color', help: 'Default: #4a4a4a' },
            { key: 'copyrightLinkHoverColor', label: 'Copyright Links — Hover Color', type: 'color', help: 'Default: #6f4e37' },
            { key: 'copyrightLinkUnderline', label: 'Copyright Links — Underline', type: 'checkbox' },
            { key: 'copyrightLinkUnderlineThickness', label: 'Copyright Links — Underline Thickness (px)', type: 'number', placeholder: '1' },
            { key: 'copyrightLinkUnderlineOffset', label: 'Copyright Links — Underline Offset (px)', type: 'number', placeholder: '3' },
            { key: 'copyrightLinkTransition', label: 'Copyright Links — Transition (s)', type: 'number', placeholder: '0.2' },
            { key: 'copyrightLinkEasing', label: 'Copyright Links — Easing', type: 'select', options: [
              { value: 'ease', label: 'Ease' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'linear', label: 'Linear' },
            ]},

            // Bottom Decorative Text (Watermark)
            { key: 'watermarkColor', label: 'Watermark — Color', type: 'color', help: 'Default: rgba(111,78,55,0.05)' },
            { key: 'watermarkHoverColor', label: 'Watermark — Hover Color', type: 'color', help: 'Default: rgba(111,78,55,0.15)' },
            { key: 'watermarkScale', label: 'Watermark — Hover Scale', type: 'number', placeholder: '1.0' },
            { key: 'watermarkTransition', label: 'Watermark — Transition (s)', type: 'number', placeholder: '0.5' },
            { key: 'watermarkOpacity', label: 'Watermark — Opacity', type: 'number', placeholder: '1.0' },
          ]}
        />
      )}

      {/* Social Icons */}
      {tab === 'social' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Social Icons</h2>
          <p className="text-xs text-white/40">Configure each platform's icon style and hover effects.</p>

          {state.social.map((s: Record<string, unknown>, index) => (
            <div key={String(s.id || index)} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium capitalize">{String(s.platform)}</h3>
                <button onClick={() => setState(prev => ({ ...prev, social: prev.social.filter((_, i) => i !== index) }))} className="text-xs text-red-300">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/70 block mb-1">URL</label>
                  <input value={String(s.url)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, url: e.target.value } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Enabled</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(s.isEnabled)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, isEnabled: e.target.checked } : x) }))} className="w-4 h-4 rounded border-white/20 bg-black/40 text-electric" />
                    <span className="text-sm">Yes</span>
                  </label>
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Icon Size (px)</label>
                  <input type="number" value={Number(s.iconSize)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, iconSize: parseFloat(e.target.value) || 20 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Order</label>
                  <input type="number" value={Number(s.order)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, order: parseInt(e.target.value) || 0 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Color</label>
                  <input type="color" value={String(s.color)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, color: e.target.value } : x) }))} className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-1 py-1 cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Hover Color</label>
                  <input type="color" value={String(s.hoverColor)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, hoverColor: e.target.value } : x) }))} className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-1 py-1 cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Background</label>
                  <input type="color" value={String(s.background)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, background: e.target.value } : x) }))} className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-1 py-1 cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Hover Background</label>
                  <input type="color" value={String(s.hoverBackground)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, hoverBackground: e.target.value } : x) }))} className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-1 py-1 cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Border Radius (px)</label>
                  <input type="number" value={Number(s.borderRadius)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, borderRadius: parseFloat(e.target.value) || 12 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Hover Scale</label>
                  <input type="number" step="0.05" value={Number(s.hoverScale)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, hoverScale: parseFloat(e.target.value) || 1.1 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Hover Rotation (deg)</label>
                  <input type="number" value={Number(s.hoverRotation)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, hoverRotation: parseFloat(e.target.value) || 0 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">Hover Shadow</label>
                  <input value={String(s.hoverShadow)} onChange={e => setState(prev => ({ ...prev, social: prev.social.map((x, i) => i === index ? { ...x, hoverShadow: e.target.value } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm" />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-white/10">
            <h3 className="font-medium mb-2">Add Social Platform</h3>
            <div className="flex flex-wrap gap-2">
              <select value={newSocial.platform} onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
                <option value="instagram">instagram</option>
                <option value="linkedin">linkedin</option>
                <option value="facebook">facebook</option>
                <option value="youtube">youtube</option>
                <option value="twitter">twitter</option>
                <option value="tiktok">tiktok</option>
                <option value="github">github</option>
                <option value="dribbble">dribbble</option>
                <option value="behance">behance</option>
              </select>
              <input placeholder="https://..." value={newSocial.url} onChange={e => setNewSocial({ ...newSocial, url: e.target.value })} className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
              <button onClick={async () => { await api.post('/settings/social', { ...newSocial, isEnabled: true, order: state.social.length }); setNewSocial({ platform: 'instagram', url: '' }); loadCategory('social'); }} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Add Platform</button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button onClick={async () => { await api.put('/settings/social', state.social); alert('Social icons saved'); }} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">Save All Social Icons</button>
            <button onClick={async () => { await api.post('/settings/social/reset'); loadCategory('social'); }} className="rounded-full border border-white/15 px-6 py-2 text-sm font-medium text-white/70 hover:bg-white/5">Reset to Defaults</button>
          </div>
        </div>
      )}

      {/* Colors */}
      {tab === 'colors' && (
        <SettingsForm
          category="colors"
          initialValues={state.colors}
          onSubmit={data => saveCategory('colors', data)}
          onReset={() => resetCategory('colors')}
          fields={[
            { key: 'primary', label: 'Primary', type: 'color' },
            { key: 'secondary', label: 'Secondary', type: 'color' },
            { key: 'accent', label: 'Accent', type: 'color' },
            { key: 'background', label: 'Background', type: 'color' },
            { key: 'surface', label: 'Surface', type: 'color' },
            { key: 'heading', label: 'Heading Text', type: 'color' },
            { key: 'body', label: 'Body Text', type: 'color' },
            { key: 'muted', label: 'Muted Text', type: 'color' },
            { key: 'border', label: 'Border', type: 'color' },
            { key: 'button', label: 'Button Background', type: 'color' },
            { key: 'buttonHover', label: 'Button Hover', type: 'color' },
            { key: 'link', label: 'Link Color', type: 'color' },
            { key: 'linkHover', label: 'Link Hover', type: 'color' },
            { key: 'footerBackground', label: 'Footer Background', type: 'color' },
            { key: 'footerText', label: 'Footer Text', type: 'color' },
            { key: 'footerHeading', label: 'Footer Heading', type: 'color' },
            { key: 'footerLink', label: 'Footer Link', type: 'color' },
            { key: 'footerLinkHover', label: 'Footer Link Hover', type: 'color' },
          ]}
        />
      )}

      {/* Animation */}
      {tab === 'animation' && (
        <SettingsForm
          category="animation"
          initialValues={state.animation}
          onSubmit={data => saveCategory('animation', data)}
          onReset={() => resetCategory('animation')}
          fields={[
            { key: 'enableHover', label: 'Enable Hover Effects', type: 'checkbox' },
            { key: 'hoverSpeed', label: 'Hover Speed (s)', type: 'number', placeholder: '0.3' },
            { key: 'intensity', label: 'Hover Intensity', type: 'number', placeholder: '1', help: 'Multiplier for hover effects' },
            { key: 'reducedMotion', label: 'Respect Reduced Motion', type: 'checkbox' },
          ]}
        />
      )}

      {/* Technologies */}
      {tab === 'technologies' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Technology Categories & Items</h2>
          <p className="text-xs text-white/40">Manage technology categories and their items displayed on the website.</p>

          <div className="space-y-4">
            {state.technologies.map((cat: Record<string, unknown>, catIndex: number) => (
              <div key={String(cat.id)} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{String(cat.name)} <span className="text-white/40 ml-2">({String(cat.slug)})</span></h3>
                  <button onClick={async () => { if (!confirm('Delete this category and all its items?')) return; await api.delete(`/technologies/categories/${String(cat.id)}`); loadCategory('technologies'); }} className="text-xs text-red-300 hover:text-red-200">Delete Category</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Name</label>
                    <input value={String(cat.name)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, name: e.target.value } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Slug</label>
                    <input value={String(cat.slug)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, slug: e.target.value } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Icon (Lucide name)</label>
                    <input value={String(cat.icon || '')} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, icon: e.target.value } : x) }))} placeholder="TrendingUp, Code2, BrainCircuit, PenTool" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Sort Order</label>
                    <input type="number" value={Number(cat.sortOrder)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, sortOrder: parseInt(e.target.value) || 0 } : x) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/70 block mb-1">Description</label>
                    <textarea value={String(cat.description || '')} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, description: e.target.value } : x) }))} rows={2} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/70 block mb-1 flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={Boolean(cat.isActive)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((x, i) => i === catIndex ? { ...x, isActive: e.target.checked } : x) }))} className="w-4 h-4 rounded border-white/20 bg-black/40 text-electric" />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-2">Items</h4>
                  {(cat.items as Array<Record<string, unknown>> || []).map((item: Record<string, unknown>, itemIndex: number) => (
                    <div key={String(item.id)} className="rounded-lg border border-white/10 bg-black/40 p-3 space-y-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{String(item.name)}</span>
                        <button onClick={async () => { if (!confirm('Delete this item?')) return; await api.delete(`/technologies/items/${String(item.id)}`); loadCategory('technologies'); }} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-white/70 block mb-1">Name</label>
                          <input value={String(item.name)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, name: e.target.value } : x) } : c) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-white/70 block mb-1">Slug</label>
                          <input value={String(item.slug)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, slug: e.target.value } : x) } : c) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-white/70 block mb-1">Logo URL</label>
                          <input value={String(item.logoUrl || '')} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, logoUrl: e.target.value } : x) } : c) }))} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-white/70 block mb-1">Website URL</label>
                          <input value={String(item.websiteUrl || '')} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, websiteUrl: e.target.value } : x) } : c) }))} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-white/70 block mb-1">Sort Order</label>
                          <input type="number" value={Number(item.sortOrder)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, sortOrder: parseInt(e.target.value) || 0 } : x) } : c) }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-white/70 block mb-1 flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={Boolean(item.isActive)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, isActive: e.target.checked } : x) } : c) }))} className="w-4 h-4 rounded border-white/20 bg-black/40 text-electric" />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-white/70 block mb-1 flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={Boolean(item.isFeatured)} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, isFeatured: e.target.checked } : x) } : c) }))} className="w-4 h-4 rounded border-white/20 bg-black/40 text-electric" />
                            <span className="text-sm">Featured</span>
                          </label>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-white/70 block mb-1">Description</label>
                          <textarea value={String(item.description || '')} onChange={e => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: (c.items as TechnologyItem[] || []).map((x, j) => j === itemIndex ? { ...x, description: e.target.value } : x) } : c) }))} rows={2} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button onClick={() => setState(prev => ({ ...prev, technologies: prev.technologies.map((c, i) => i === catIndex ? { ...c, items: [...(c.items as TechnologyItem[] || []), { id: `temp-${Date.now()}`, categoryId: String(c.id), name: '', slug: '', description: '', logoUrl: '', logoAlt: '', websiteUrl: '', sortOrder: (c.items as TechnologyItem[] || []).length, isActive: true, isFeatured: false }] } : c) }))} className="text-sm text-electric hover:text-electric/70">+ Add Item</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button onClick={() => setState(prev => ({ ...prev, technologies: [...prev.technologies, { id: `temp-${Date.now()}`, name: '', slug: '', description: '', icon: '', sortOrder: prev.technologies.length, isActive: true, items: [] }] }))} className="rounded-full border border-electric/30 px-4 py-2 text-sm font-medium text-electric hover:bg-electric/10">+ Add Category</button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button onClick={async () => {
              // Filter out temp items
              const validData = state.technologies.filter((c: TechnologyCategory) => !String(c.id).startsWith('temp')).map((c: TechnologyCategory) => ({
                ...c,
                items: (c.items as TechnologyItem[] || []).filter((i: TechnologyItem) => !String(i.id).startsWith('temp'))
              }));
              await api.put('/technologies/categories/reorder', { orderedIds: validData.map((c: TechnologyCategory) => String(c.id)) });
              for (const cat of validData) {
                await api.put(`/technologies/categories/${String(cat.id)}`, { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder, isActive: cat.isActive });
                for (const item of (cat.items as TechnologyItem[] || [])) {
                  await api.put(`/technologies/items/${String(item.id)}`, { categoryId: item.categoryId, name: item.name, slug: item.slug, description: item.description, logoUrl: item.logoUrl, logoAlt: item.logoAlt, websiteUrl: item.websiteUrl, sortOrder: item.sortOrder, isActive: item.isActive, isFeatured: item.isFeatured });
                }
              }
              alert('Technologies saved');
              loadCategory('technologies');
            }} className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-white">
              Save All Changes
            </button>
          </div>
        </div>
      )}

      {/* SEO */}
      {tab === 'seo' && (
        <SettingsForm
          category="seo"
          initialValues={state.seo}
          onSubmit={data => saveCategory('seo', data)}
          onReset={() => resetCategory('seo')}
          fields={[
            { key: 'defaultTitle', label: 'Default Title', type: 'text', placeholder: 'BISSTECH — Build. Grow. Automate.' },
            { key: 'defaultDescription', label: 'Default Description', type: 'textarea', placeholder: 'Default meta description' },
            { key: 'defaultOgImage', label: 'Default OG Image URL', type: 'file' },
            { key: 'robotsTxt', label: 'Robots.txt', type: 'textarea', placeholder: 'User-agent: *\nAllow: /' },
            { key: 'faviconUrl', label: 'Favicon URL', type: 'file' },
          ]}
        />
      )}

      {/* Advanced/Integrations */}
      {tab === 'integrations' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
          <h2 className="font-semibold">Advanced / Integrations</h2>
          <p className="text-xs text-white/40">SMTP, Cloudinary/S3, reCAPTCHA, WhatsApp Business API etc. Stored as JSON per provider. Secrets remain server-side; frontend never sees them.</p>
          {state.integrations.length === 0 && <p className="text-sm text-white/40">No integrations configured. Create via API: PUT /settings/integrations/smtp with config object</p>}
          {state.integrations.map((ig: Record<string, unknown>) => (
            <div key={String(ig.provider)} className="rounded-xl bg-black/30 px-4 py-3">
              <p className="text-sm font-medium">{String(ig.provider)} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${ig.isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{ig.isEnabled ? 'enabled' : 'disabled'}</span></p>
              <p className="mt-1 break-all text-xs text-white/40">{((ig.config as string) || '').slice(0, 200)}</p>
            </div>
          ))}
          <div className="pt-2 text-xs text-white/30">
            <p>Example - configure SMTP via curl:</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px]">{`curl -X PUT http://localhost:4000/api/v1/settings/integrations/smtp \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{"isEnabled":true,"config":{"host":"smtp.gmail.com","port":587,"user":"...","pass":"...","from":"noreply@bisstech.com"}}'`}</pre>
          </div>
        </div>
      )}

      {/* Navigation (legacy) */}
      {tab === 'navigation' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Navigation Menus (Legacy)</h2>
          <p className="text-xs text-white/40">Use Header/Navigation tab for dynamic header settings. This manages the navigation structure.</p>
          <form onSubmit={async (e) => { e.preventDefault(); await api.post('/settings/navigation', newNav); setNewNav({ label: '', path: '', sortOrder: 0 }); loadAll(); }} className="flex flex-wrap gap-2">
            <input placeholder="Label" value={newNav.label} onChange={e => setNewNav({ ...newNav, label: e.target.value })} className="flex-1 min-w-[100px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <input placeholder="/path" value={newNav.path} onChange={e => setNewNav({ ...newNav, path: e.target.value })} className="flex-1 min-w-[100px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <input type="number" placeholder="Order" value={newNav.sortOrder} onChange={e => setNewNav({ ...newNav, sortOrder: parseInt(e.target.value) || 0 })} className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Add</button>
          </form>
          <div className="space-y-2">
            {state.nav.length === 0 && <p className="text-sm text-white/40">No nav items</p>}
            {state.nav.map((n: Record<string, unknown>) => (
              <div key={String(n.id)} className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm">
                <span>{String(n.label)} <span className="text-white/40">→ {String(n.path)}</span> <span className="text-xs text-white/30">order {Number(n.sortOrder)}</span></span>
                <button onClick={async () => { if (!confirm('Delete nav item?')) return; await api.delete(`/settings/navigation/${String(n.id)}`); loadAll(); }} className="text-xs text-red-300 hover:text-red-200">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links (legacy) */}
      {tab === 'socials' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <h2 className="font-semibold">Social Links (Legacy)</h2>
          <p className="text-xs text-white/40">Use Social Icons tab for dynamic social icon settings. This manages simple link list.</p>
          <form onSubmit={async (e) => { e.preventDefault(); await api.post('/settings/socials', newSocial); setNewSocial({ platform: 'instagram', url: '' }); loadAll(); }} className="flex flex-wrap gap-2">
            <select value={newSocial.platform} onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
              <option value="instagram">instagram</option><option value="linkedin">linkedin</option><option value="facebook">facebook</option><option value="youtube">youtube</option><option value="twitter">twitter</option><option value="whatsapp">whatsapp</option>
            </select>
            <input placeholder="https://..." value={newSocial.url} onChange={e => setNewSocial({ ...newSocial, url: e.target.value })} className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" required />
            <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Add</button>
          </form>
          <div className="space-y-2">
            {state.socials.length === 0 && <p className="text-sm text-white/40">No social links</p>}
            {state.socials.map((s: Record<string, unknown>) => (
              <div key={String(s.id)} className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm">
                <span><strong>{String(s.platform)}</strong> <span className="text-white/50 break-all">{String(s.url)}</span></span>
                <button onClick={async () => { if (!confirm('Delete social link?')) return; await api.delete(`/settings/socials/${String(s.id)}`); loadAll(); }} className="text-xs text-red-300 hover:text-red-200">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}