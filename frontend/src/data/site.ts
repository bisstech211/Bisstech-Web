import { Instagram, Linkedin, Facebook, MessageCircle } from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const CONTACT = {
  email: 'info.bisstech@gmail.com',
  whatsapp: 'https://wa.me/918597029133',
  whatsappDisplay: '+91 8597 029133',
};

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/bisstech', icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bisstech', icon: Linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/bisstech', icon: Facebook },
  { label: 'WhatsApp', href: CONTACT.whatsapp, icon: MessageCircle },
];

export const FOOTER_SERVICES = [
  'Digital Marketing',
  'Website Development',
  'App Development',
  'Software Development',
  'AI Automation',
  'E-commerce & Quick Commerce Management',
  'Graphic Design',
];

/** Visual storytelling arc used across the site. */
export const STORY_ARC = [
  { word: 'IDEA', note: 'We start with strategy, insight and a clear plan.' },
  { word: 'BUILD', note: 'We design and engineer high-performance digital products.' },
  { word: 'GROW', note: 'We drive traffic, leads and revenue through marketing.' },
  { word: 'AUTOMATE', note: 'We remove repetitive work with AI and automation.' },
  { word: 'SCALE', note: 'We compound results and help you scale sustainably.' },
];
