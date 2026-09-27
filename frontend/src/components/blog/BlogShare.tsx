import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export function BlogShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encTitle}%20${encUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-[0.15em] text-espresso-500">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-espresso-950/10 bg-white px-3 py-1.5 text-xs font-medium text-espresso-600 transition-colors hover:border-coffee/30 hover:text-espresso-950"
        >
          {l.label}
        </a>
      ))}
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-espresso-950/10 bg-white px-3 py-1.5 text-xs font-medium text-espresso-600 transition-colors hover:border-coffee/30 hover:text-espresso-950"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
