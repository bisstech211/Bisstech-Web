import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchWebsiteSettings } from '../lib/api';

export type ResponsiveValue<T = number> = {
  desktop: T;
  tablet: T;
  mobile: T;
};

export type ResponsiveStringValue = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export type BrandingSettings = {
  id: string;
  logoUrl: string | null;
  mobileLogoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  logoWidth: ResponsiveValue | null;
  logoHeight: ResponsiveValue | null;
};

export type HeaderSettings = {
  id: string;
  backgroundColor: string | null;
  backgroundOpacity: number | null;
  blur: number | null;
  borderColor: string | null;
  borderWidth: number | null;
  shadow: string | null;
  height: ResponsiveValue | null;
  navFontSize: ResponsiveValue | null;
  navFontWeight: string | null;
  navSpacing: ResponsiveValue | null;
  navHoverColor: string | null;
  navActiveColor: string | null;
  navUnderline: boolean | null;
  navUnderlineThickness: number | null;
  navUnderlineSpeed: number | null;
  buttonText: string | null;
  buttonBgColor: string | null;
  buttonHoverBg: string | null;
};

export type ButtonSettings = {
  id: string;
  variant: string;
  bgColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  borderWidth: number | null;
  borderRadius: number | null;
  padding: ResponsiveStringValue | null;
  fontSize: ResponsiveValue | null;
  fontWeight: string | null;
  hoverBgColor: string | null;
  hoverTextColor: string | null;
  hoverBorderColor: string | null;
  hoverScale: number | null;
  hoverShadow: string | null;
  transitionDuration: number | null;
};

export type TextHoverSettings = {
  id: string;
  effectType: string;
  color: string | null;
  opacity: number | null;
  underline: boolean | null;
  underlineThickness: number | null;
  underlineOffset: number | null;
  letterSpacing: number | null;
  transform: string | null;
  scale: number | null;
  glow: string | null;
  shadow: string | null;
  transitionDuration: number | null;
  easing: string | null;
};

export type LinkHoverSettings = {
  id: string;
  effectType: string;
  color: string | null;
  hoverColor: string | null;
  underline: boolean | null;
  underlineThickness: number | null;
  transitionDuration: number | null;
  easing: string | null;
};

export type CardHoverSettings = {
  id: string;
  effectType: string;
  scale: number | null;
  translateY: number | null;
  shadow: string | null;
  borderColor: string | null;
  backgroundChange: string | null;
  glow: string | null;
  imageZoom: number | null;
  overlayOpacity: number | null;
  borderRadius: number | null;
  transitionDuration: number | null;
  easing: string | null;
};

export type FooterAppearanceSettings = {
  id: string;
  logoUrl: string | null;
  description: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  headingColor: string | null;
  linkColor: string | null;
  linkHoverColor: string | null;
  borderColor: string | null;
  borderWidth: number | null;
  spacing: ResponsiveValue | null;
  padding: ResponsiveValue | null;
  columnSpacing: ResponsiveValue | null;
  copyrightText: string | null;
  ctaText: string | null;
  ctaLink: string | null;
};

export type FooterHoverSettings = {
  id: string;
  effectType: string;
  hoverColor: string | null;
  underline: boolean | null;
  underlineThickness: number | null;
  transitionDuration: number | null;
  easing: string | null;
};

export type BottomSectionHoverSettings = {
  id: string;

  // Hero CTA Buttons (woven-light-hero.tsx)
  heroCtaPrimaryBg: string | null;
  heroCtaPrimaryHoverBg: string | null;
  heroCtaPrimaryText: string | null;
  heroCtaPrimaryHoverText: string | null;
  heroCtaPrimaryBorder: string | null;
  heroCtaPrimaryHoverBorder: string | null;
  heroCtaPrimaryShadow: string | null;
  heroCtaPrimaryHoverShadow: string | null;
  heroCtaPrimaryScale: number | null;
  heroCtaPrimaryTransition: number | null;

  heroCtaSecondaryBg: string | null;
  heroCtaSecondaryHoverBg: string | null;
  heroCtaSecondaryText: string | null;
  heroCtaSecondaryHoverText: string | null;
  heroCtaSecondaryBorder: string | null;
  heroCtaSecondaryHoverBorder: string | null;
  heroCtaSecondaryShadow: string | null;
  heroCtaSecondaryHoverShadow: string | null;
  heroCtaSecondaryScale: number | null;
  heroCtaSecondaryTransition: number | null;

  // CTA Section Buttons (CTASection.tsx)
  ctaSectionPrimaryBg: string | null;
  ctaSectionPrimaryHoverBg: string | null;
  ctaSectionPrimaryText: string | null;
  ctaSectionPrimaryHoverText: string | null;
  ctaSectionPrimaryShadow: string | null;
  ctaSectionPrimaryHoverShadow: string | null;
  ctaSectionPrimaryScale: number | null;
  ctaSectionPrimaryTransition: number | null;
  ctaSectionPrimaryArrowTranslateX: number | null;

  ctaSectionSecondaryBg: string | null;
  ctaSectionSecondaryHoverBg: string | null;
  ctaSectionSecondaryText: string | null;
  ctaSectionSecondaryHoverText: string | null;
  ctaSectionSecondaryBorder: string | null;
  ctaSectionSecondaryHoverBorder: string | null;
  ctaSectionSecondaryShadow: string | null;
  ctaSectionSecondaryHoverShadow: string | null;
  ctaSectionSecondaryScale: number | null;
  ctaSectionSecondaryTransition: number | null;

  // Service Cards (ServicesSection.tsx)
  serviceCardBg: string | null;
  serviceCardHoverBg: string | null;
  serviceCardBorderColor: string | null;
  serviceCardHoverBorderColor: string | null;
  serviceCardShadow: string | null;
  serviceCardHoverShadow: string | null;
  serviceCardTranslateY: number | null;
  serviceCardScale: number | null;
  serviceCardImageZoom: number | null;
  serviceCardImageTransition: number | null;
  serviceCardBorderWidth: number | null;
  serviceCardHoverBorderWidth: number | null;
  serviceCardBottomBarHeight: number | null;
  serviceCardBottomBarColor: string | null;
  serviceCardBottomBarTransition: number | null;
  serviceCardIconBg: string | null;
  serviceCardIconHoverBg: string | null;
  serviceCardIconText: string | null;
  serviceCardIconHoverText: string | null;
  serviceCardIconScale: number | null;
  serviceCardIconTransition: number | null;
  serviceCardExploreTextColor: string | null;
  serviceCardExploreHoverTextColor: string | null;
  serviceCardArrowColor: string | null;
  serviceCardArrowHoverColor: string | null;
  serviceCardArrowTranslateX: number | null;
  serviceCardArrowTranslateY: number | null;
  serviceCardArrowTransition: number | null;

  // Footer Branding (Footer.tsx)
  footerLogoHoverOpacity: number | null;
  footerLogoHoverScale: number | null;
  footerLogoTransition: number | null;
  footerEmailColor: string | null;
  footerEmailHoverColor: string | null;
  footerEmailUnderline: boolean | null;
  footerEmailUnderlineThickness: number | null;
  footerEmailTransition: number | null;

  // Footer Navigation Links
  footerNavLinkColor: string | null;
  footerNavLinkHoverColor: string | null;
  footerNavLinkUnderline: boolean | null;
  footerNavLinkUnderlineThickness: number | null;
  footerNavLinkUnderlineOffset: number | null;
  footerNavLinkTransition: number | null;
  footerNavLinkEasing: string | null;

  // Footer Services Links
  footerServiceLinkColor: string | null;
  footerServiceLinkHoverColor: string | null;
  footerServiceLinkUnderline: boolean | null;
  footerServiceLinkUnderlineThickness: number | null;
  footerServiceLinkUnderlineOffset: number | null;
  footerServiceLinkTransition: number | null;
  footerServiceLinkEasing: string | null;

  // Footer Social Icons
  footerSocialIconSize: number | null;
  footerSocialIconColor: string | null;
  footerSocialIconHoverColor: string | null;
  footerSocialIconBg: string | null;
  footerSocialIconHoverBg: string | null;
  footerSocialIconBorderRadius: number | null;
  footerSocialIconScale: number | null;
  footerSocialIconRotation: number | null;
  footerSocialIconShadow: string | null;
  footerSocialIconHoverShadow: string | null;
  footerSocialIconTransition: number | null;

  // Footer CTA Button
  footerCtaBg: string | null;
  footerCtaHoverBg: string | null;
  footerCtaText: string | null;
  footerCtaHoverText: string | null;
  footerCtaShadow: string | null;
  footerCtaHoverShadow: string | null;
  footerCtaScale: number | null;
  footerCtaArrowTranslateX: number | null;
  footerCtaArrowTranslateY: number | null;
  footerCtaTransition: number | null;

  // Copyright Bar Links
  copyrightLinkColor: string | null;
  copyrightLinkHoverColor: string | null;
  copyrightLinkUnderline: boolean | null;
  copyrightLinkUnderlineThickness: number | null;
  copyrightLinkUnderlineOffset: number | null;
  copyrightLinkTransition: number | null;
  copyrightLinkEasing: string | null;

  // Bottom Decorative Text (Watermark)
  watermarkColor: string | null;
  watermarkHoverColor: string | null;
  watermarkScale: number | null;
  watermarkTransition: number | null;
  watermarkOpacity: number | null;
};

export type SocialSettings = {
  id: string;
  platform: string;
  url: string;
  isEnabled: boolean;
  order: number;
  iconSize: number | null;
  color: string | null;
  hoverColor: string | null;
  background: string | null;
  hoverBackground: string | null;
  borderRadius: number | null;
  hoverScale: number | null;
  hoverRotation: number | null;
  hoverShadow: string | null;
  transitionDuration: number | null;
};

export type ColorSettings = {
  id: string;
  primary: string | null;
  secondary: string | null;
  accent: string | null;
  background: string | null;
  surface: string | null;
  heading: string | null;
  body: string | null;
  muted: string | null;
  border: string | null;
  button: string | null;
  buttonHover: string | null;
  buttonText: string | null;
  buttonHoverText: string | null;
  link: string | null;
  linkHover: string | null;
  footerBackground: string | null;
  footerText: string | null;
  footerHeading: string | null;
  footerLink: string | null;
  footerLinkHover: string | null;
  headerBackground: string | null;
  headerText: string | null;
  headerLinkHover: string | null;
  bottomSectionBackground: string | null;
};

export type TypographySettings = {
  id: string;
  primaryFont: string | null;
  headingFont: string | null;
  bodyFont: string | null;
  headingWeight: string | null;
  bodyWeight: string | null;
  baseSize: number | null;
  h1Size: number | null;
  h2Size: number | null;
  h3Size: number | null;
  paragraphSize: number | null;
  lineHeight: number | null;
  letterSpacing: number | null;
};

export type AnimationSettings = {
  id: string;
  enableHover: boolean;
  hoverSpeed: number | null;
  intensity: number | null;
  reducedMotion: boolean;
};

export type WebsiteSettings = {
  branding: BrandingSettings | null;
  header: HeaderSettings | null;
  button: ButtonSettings | null;
  textHover: TextHoverSettings | null;
  linkHover: LinkHoverSettings | null;
  cardHover: CardHoverSettings | null;
  footerAppearance: FooterAppearanceSettings | null;
  footerHover: FooterHoverSettings | null;
  bottomSectionHover: BottomSectionHoverSettings | null;
  socialSettings: SocialSettings[];
  colors: ColorSettings | null;
  typography: TypographySettings | null;
  animation: AnimationSettings | null;
};

function parseResponsiveValue<T>(value: string | null | undefined, fallback: T): ResponsiveValue {
  if (!value) return fallback as unknown as ResponsiveValue;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as ResponsiveValue;
    }
  } catch {
    // ignore
  }
  return fallback as unknown as ResponsiveValue;
}

function parseResponsiveStringValue(value: string | null | undefined, fallback: string): ResponsiveStringValue {
  if (!value) return { desktop: fallback, tablet: fallback, mobile: fallback };
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as ResponsiveStringValue;
    }
  } catch {
    // ignore
  }
  return { desktop: fallback, tablet: fallback, mobile: fallback };
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  branding: {
    id: 'branding',
    logoUrl: null,
    mobileLogoUrl: null,
    darkLogoUrl: null,
    faviconUrl: null,
    logoWidth: { desktop: 140, tablet: 120, mobile: 100 },
    logoHeight: { desktop: 36, tablet: 32, mobile: 28 },
  },
  header: {
    id: 'header',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backgroundOpacity: 0.95,
    blur: 20,
    borderColor: 'rgba(61, 43, 31, 0.1)',
    borderWidth: 1,
    shadow: '0 4px 30px rgba(61, 43, 31, 0.08)',
    height: { desktop: 72, tablet: 68, mobile: 64 },
    navFontSize: { desktop: 14, tablet: 13, mobile: 13 },
    navFontWeight: '500',
    navSpacing: { desktop: 32, tablet: 24, mobile: 16 },
    navHoverColor: '#6f4e37',
    navActiveColor: '#1a1a1a',
    navUnderline: true,
    navUnderlineThickness: 1,
    navUnderlineSpeed: 0.3,
    buttonText: 'Start a Project',
    buttonBgColor: '#6f4e37',
    buttonHoverBg: '#3d2b1f',
  },
  button: {
    id: 'button',
    variant: 'primary',
    bgColor: '#6f4e37',
    textColor: '#ffffff',
    borderColor: '#6f4e37',
    borderWidth: 0,
    borderRadius: 9999,
    padding: { desktop: '16px 32px', tablet: '14px 28px', mobile: '12px 24px' },
    fontSize: { desktop: 14, tablet: 13, mobile: 13 },
    fontWeight: '600',
    hoverBgColor: '#3d2b1f',
    hoverTextColor: '#ffffff',
    hoverBorderColor: '#3d2b1f',
    hoverScale: 1.02,
    hoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    transitionDuration: 0.3,
  },
  textHover: {
    id: 'textHover',
    effectType: 'color',
    color: '#6f4e37',
    opacity: 0.9,
    underline: false,
    underlineThickness: 2,
    underlineOffset: 4,
    letterSpacing: 0,
    transform: 'none',
    scale: 1,
    glow: 'none',
    shadow: 'none',
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  linkHover: {
    id: 'linkHover',
    effectType: 'color',
    color: '#1a1a1a',
    hoverColor: '#6f4e37',
    underline: true,
    underlineThickness: 2,
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  cardHover: {
    id: 'cardHover',
    effectType: 'lift',
    scale: 1.02,
    translateY: -8,
    shadow: '0 20px 40px rgba(61, 43, 31, 0.15)',
    borderColor: 'rgba(111, 78, 55, 0.2)',
    backgroundChange: 'rgba(111, 78, 55, 0.05)',
    glow: 'none',
    imageZoom: 1.05,
    overlayOpacity: 0.05,
    borderRadius: 16,
    transitionDuration: 0.4,
    easing: 'ease-out',
  },
  footerAppearance: {
    id: 'footerAppearance',
    logoUrl: null,
    description: 'Build. Grow. Automate. A global digital growth, technology, AI & creative agency for ambitious businesses.',
    backgroundColor: '#fafafa',
    textColor: '#4a4a4a',
    headingColor: '#1a1a1a',
    linkColor: '#4a4a4a',
    linkHoverColor: '#6f4e37',
    borderColor: 'rgba(61, 43, 31, 0.1)',
    borderWidth: 1,
    spacing: { desktop: 64, tablet: 48, mobile: 32 },
    padding: { desktop: 80, tablet: 60, mobile: 40 },
    columnSpacing: { desktop: 48, tablet: 32, mobile: 24 },
    copyrightText: '© 2025 BISSTECH. All rights reserved.',
    ctaText: 'Start a Project',
    ctaLink: '/contact',
  },
  footerHover: {
    id: 'footerHover',
    effectType: 'color',
    hoverColor: '#6f4e37',
    underline: true,
    underlineThickness: 2,
    transitionDuration: 0.3,
    easing: 'ease-out',
  },
  socialSettings: [],
  colors: {
    id: 'colors',
    primary: '#6f4e37',
    secondary: '#a08d7a',
    accent: '#c9a962',
    background: '#ffffff',
    surface: '#fafafa',
    heading: '#1a1a1a',
    body: '#3d2b1f',
    muted: '#8a7d6e',
    border: 'rgba(61, 43, 31, 0.1)',
    button: '#6f4e37',
    buttonHover: '#3d2b1f',
    buttonText: '#ffffff',
    buttonHoverText: '#ffffff',
    link: '#6f4e37',
    linkHover: '#a08d7a',
    footerBackground: '#fafafa',
    footerText: '#4a4a4a',
    footerHeading: '#1a1a1a',
    footerLink: '#4a4a4a',
    footerLinkHover: '#6f4e37',
    headerBackground: 'rgba(255, 255, 255, 0.95)',
    headerText: '#1a1a1a',
    headerLinkHover: '#6f4e37',
    bottomSectionBackground: '#f5f5f5',
  },
  typography: {
    id: 'typography',
    primaryFont: 'Inter, system-ui, sans-serif',
    headingFont: 'Montserrat, Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '700',
    bodyWeight: '400',
    baseSize: 16,
    h1Size: 48,
    h2Size: 36,
    h3Size: 24,
    paragraphSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  animation: {
    id: 'animation',
    enableHover: true,
    hoverSpeed: 0.3,
    intensity: 1,
    reducedMotion: false,
  },
  bottomSectionHover: {
    id: 'bottomSectionHover',

    // Hero CTA Buttons (woven-light-hero.tsx)
    heroCtaPrimaryBg: '#6f4e37',
    heroCtaPrimaryHoverBg: '#3d2b1f',
    heroCtaPrimaryText: '#ffffff',
    heroCtaPrimaryHoverText: '#ffffff',
    heroCtaPrimaryBorder: '#6f4e37',
    heroCtaPrimaryHoverBorder: '#3d2b1f',
    heroCtaPrimaryShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    heroCtaPrimaryHoverShadow: '0 12px 35px rgba(61, 43, 31, 0.4)',
    heroCtaPrimaryScale: 1.02,
    heroCtaPrimaryTransition: 0.3,

    heroCtaSecondaryBg: 'transparent',
    heroCtaSecondaryHoverBg: '#6f4e37',
    heroCtaSecondaryText: '#6f4e37',
    heroCtaSecondaryHoverText: '#ffffff',
    heroCtaSecondaryBorder: '#6f4e37',
    heroCtaSecondaryHoverBorder: '#6f4e37',
    heroCtaSecondaryShadow: 'none',
    heroCtaSecondaryHoverShadow: '0 8px 25px rgba(111, 78, 55, 0.3)',
    heroCtaSecondaryScale: 1.02,
    heroCtaSecondaryTransition: 0.3,

    // CTA Section Buttons (CTASection.tsx)
    ctaSectionPrimaryBg: '#2b2118',
    ctaSectionPrimaryHoverBg: '#1a1611',
    ctaSectionPrimaryText: '#fafafa',
    ctaSectionPrimaryHoverText: '#fafafa',
    ctaSectionPrimaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    ctaSectionPrimaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    ctaSectionPrimaryScale: 1.0,
    ctaSectionPrimaryTransition: 0.3,
    ctaSectionPrimaryArrowTranslateX: 4,

    ctaSectionSecondaryBg: '#ffffff',
    ctaSectionSecondaryHoverBg: '#f5f5f5',
    ctaSectionSecondaryText: '#3d2b1f',
    ctaSectionSecondaryHoverText: '#1a1a1a',
    ctaSectionSecondaryBorder: 'rgba(111, 78, 55, 0.1)',
    ctaSectionSecondaryHoverBorder: '#6f4e37',
    ctaSectionSecondaryShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    ctaSectionSecondaryHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    ctaSectionSecondaryScale: 1.0,
    ctaSectionSecondaryTransition: 0.3,

    // Service Cards (ServicesSection.tsx)
    serviceCardBg: '#ffffff',
    serviceCardHoverBg: '#ffffff',
    serviceCardBorderColor: 'rgba(111, 78, 55, 0.06)',
    serviceCardHoverBorderColor: '#6f4e37',
    serviceCardShadow: '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
    serviceCardHoverShadow: '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
    serviceCardTranslateY: -4,
    serviceCardScale: 1.0,
    serviceCardImageZoom: 1.05,
    serviceCardImageTransition: 0.7,
    serviceCardBorderWidth: 1,
    serviceCardHoverBorderWidth: 1,
    serviceCardBottomBarHeight: 2,
    serviceCardBottomBarColor: '#6f4e37',
    serviceCardBottomBarTransition: 0.5,
    serviceCardIconBg: 'rgba(111, 78, 55, 0.1)',
    serviceCardIconHoverBg: '#6f4e37',
    serviceCardIconText: '#6f4e37',
    serviceCardIconHoverText: '#fafafa',
    serviceCardIconScale: 1.0,
    serviceCardIconTransition: 0.5,
    serviceCardExploreTextColor: '#8a7d6e',
    serviceCardExploreHoverTextColor: '#6f4e37',
    serviceCardArrowColor: '#8a7d6e',
    serviceCardArrowHoverColor: '#6f4e37',
    serviceCardArrowTranslateX: 4,
    serviceCardArrowTranslateY: -4,
    serviceCardArrowTransition: 0.3,

    // Footer Branding (Footer.tsx)
    footerLogoHoverOpacity: 0.8,
    footerLogoHoverScale: 1.02,
    footerLogoTransition: 0.3,
    footerEmailColor: '#6f4e37',
    footerEmailHoverColor: '#3d2b1f',
    footerEmailUnderline: true,
    footerEmailUnderlineThickness: 1,
    footerEmailTransition: 0.2,

    // Footer Navigation Links
    footerNavLinkColor: '#4a4a4a',
    footerNavLinkHoverColor: '#6f4e37',
    footerNavLinkUnderline: false,
    footerNavLinkUnderlineThickness: 2,
    footerNavLinkUnderlineOffset: 4,
    footerNavLinkTransition: 0.2,
    footerNavLinkEasing: 'ease-out',

    // Footer Services Links
    footerServiceLinkColor: '#4a4a4a',
    footerServiceLinkHoverColor: '#6f4e37',
    footerServiceLinkUnderline: false,
    footerServiceLinkUnderlineThickness: 2,
    footerServiceLinkUnderlineOffset: 4,
    footerServiceLinkTransition: 0.2,
    footerServiceLinkEasing: 'ease-out',

    // Footer Social Icons
    footerSocialIconSize: 20,
    footerSocialIconColor: '#4a4a4a',
    footerSocialIconHoverColor: '#6f4e37',
    footerSocialIconBg: 'transparent',
    footerSocialIconHoverBg: 'rgba(111, 78, 55, 0.1)',
    footerSocialIconBorderRadius: 12,
    footerSocialIconScale: 1.1,
    footerSocialIconRotation: 0,
    footerSocialIconShadow: 'none',
    footerSocialIconHoverShadow: '0 4px 15px rgba(111, 78, 55, 0.2)',
    footerSocialIconTransition: 0.3,

    // Footer CTA Button
    footerCtaBg: '#6f4e37',
    footerCtaHoverBg: '#3d2b1f',
    footerCtaText: '#ffffff',
    footerCtaHoverText: '#ffffff',
    footerCtaShadow: '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)',
    footerCtaHoverShadow: '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)',
    footerCtaScale: 1.0,
    footerCtaArrowTranslateX: 4,
    footerCtaArrowTranslateY: -4,
    footerCtaTransition: 0.3,

    // Copyright Bar Links
    copyrightLinkColor: '#4a4a4a',
    copyrightLinkHoverColor: '#6f4e37',
    copyrightLinkUnderline: false,
    copyrightLinkUnderlineThickness: 1,
    copyrightLinkUnderlineOffset: 3,
    copyrightLinkTransition: 0.2,
    copyrightLinkEasing: 'ease-out',

    // Bottom Decorative Text (Watermark)
    watermarkColor: 'rgba(111, 78, 55, 0.05)',
    watermarkHoverColor: 'rgba(111, 78, 55, 0.15)',
    watermarkScale: 1.0,
    watermarkTransition: 0.5,
    watermarkOpacity: 1.0,
  },
};

function transformApiSettings(apiData: Record<string, unknown>): WebsiteSettings {
  const branding = apiData.branding as Record<string, unknown> | null;
  const header = apiData.header as Record<string, unknown> | null;
  const button = apiData.button as Record<string, unknown> | null;
  const textHover = apiData.textHover as Record<string, unknown> | null;
  const linkHover = apiData.linkHover as Record<string, unknown> | null;
  const cardHover = apiData.cardHover as Record<string, unknown> | null;
  const footerAppearance = apiData.footerAppearance as Record<string, unknown> | null;
  const footerHover = apiData.footerHover as Record<string, unknown> | null;
  const bottomSectionHover = apiData.bottomSectionHover as Record<string, unknown> | null;
  const socialSettings = (apiData.socialSettings as Array<Record<string, unknown>>) || [];
  const colors = apiData.colors as Record<string, unknown> | null;
  const typography = apiData.typography as Record<string, unknown> | null;
  const animation = apiData.animation as Record<string, unknown> | null;

  return {
    branding: branding ? {
      id: branding.id as string,
      logoUrl: branding.logoUrl as string | null,
      mobileLogoUrl: branding.mobileLogoUrl as string | null,
      darkLogoUrl: branding.darkLogoUrl as string | null,
      faviconUrl: branding.faviconUrl as string | null,
      logoWidth: parseResponsiveValue(branding.logoWidth as string | null, DEFAULT_SETTINGS.branding!.logoWidth!),
      logoHeight: parseResponsiveValue(branding.logoHeight as string | null, DEFAULT_SETTINGS.branding!.logoHeight!),
    } : DEFAULT_SETTINGS.branding,
    header: header ? {
      id: header.id as string,
      backgroundColor: header.backgroundColor as string | null,
      backgroundOpacity: header.backgroundOpacity as number | null,
      blur: header.blur as number | null,
      borderColor: header.borderColor as string | null,
      borderWidth: header.borderWidth as number | null,
      shadow: header.shadow as string | null,
      height: parseResponsiveValue(header.height as string | null, DEFAULT_SETTINGS.header!.height!),
      navFontSize: parseResponsiveValue(header.navFontSize as string | null, DEFAULT_SETTINGS.header!.navFontSize!),
      navFontWeight: header.navFontWeight as string | null,
      navSpacing: parseResponsiveValue(header.navSpacing as string | null, DEFAULT_SETTINGS.header!.navSpacing!),
      navHoverColor: header.navHoverColor as string | null,
      navActiveColor: header.navActiveColor as string | null,
      navUnderline: header.navUnderline as boolean | null,
      navUnderlineThickness: header.navUnderlineThickness as number | null,
      navUnderlineSpeed: header.navUnderlineSpeed as number | null,
      buttonText: header.buttonText as string | null,
      buttonBgColor: header.buttonBgColor as string | null,
      buttonHoverBg: header.buttonHoverBg as string | null,
    } : DEFAULT_SETTINGS.header,
    button: button ? {
      id: button.id as string,
      variant: button.variant as string,
      bgColor: button.bgColor as string | null,
      textColor: button.textColor as string | null,
      borderColor: button.borderColor as string | null,
      borderWidth: button.borderWidth as number | null,
      borderRadius: button.borderRadius as number | null,
      padding: parseResponsiveStringValue(button.padding as string | null, '16px 32px'),
      fontSize: parseResponsiveValue(button.fontSize as string | null, DEFAULT_SETTINGS.button!.fontSize!),
      fontWeight: button.fontWeight as string | null,
      hoverBgColor: button.hoverBgColor as string | null,
      hoverTextColor: button.hoverTextColor as string | null,
      hoverBorderColor: button.hoverBorderColor as string | null,
      hoverScale: button.hoverScale as number | null,
      hoverShadow: button.hoverShadow as string | null,
      transitionDuration: button.transitionDuration as number | null,
    } : DEFAULT_SETTINGS.button,
    textHover: textHover ? {
      id: textHover.id as string,
      effectType: textHover.effectType as string,
      color: textHover.color as string | null,
      opacity: textHover.opacity as number | null,
      underline: textHover.underline as boolean | null,
      underlineThickness: textHover.underlineThickness as number | null,
      underlineOffset: textHover.underlineOffset as number | null,
      letterSpacing: textHover.letterSpacing as number | null,
      transform: textHover.transform as string | null,
      scale: textHover.scale as number | null,
      glow: textHover.glow as string | null,
      shadow: textHover.shadow as string | null,
      transitionDuration: textHover.transitionDuration as number | null,
      easing: textHover.easing as string | null,
    } : DEFAULT_SETTINGS.textHover,
    linkHover: linkHover ? {
      id: linkHover.id as string,
      effectType: linkHover.effectType as string,
      color: linkHover.color as string | null,
      hoverColor: linkHover.hoverColor as string | null,
      underline: linkHover.underline as boolean | null,
      underlineThickness: linkHover.underlineThickness as number | null,
      transitionDuration: linkHover.transitionDuration as number | null,
      easing: linkHover.easing as string | null,
    } : DEFAULT_SETTINGS.linkHover,
    cardHover: cardHover ? {
      id: cardHover.id as string,
      effectType: cardHover.effectType as string,
      scale: cardHover.scale as number | null,
      translateY: cardHover.translateY as number | null,
      shadow: cardHover.shadow as string | null,
      borderColor: cardHover.borderColor as string | null,
      backgroundChange: cardHover.backgroundChange as string | null,
      glow: cardHover.glow as string | null,
      imageZoom: cardHover.imageZoom as number | null,
      overlayOpacity: cardHover.overlayOpacity as number | null,
      borderRadius: cardHover.borderRadius as number | null,
      transitionDuration: cardHover.transitionDuration as number | null,
      easing: cardHover.easing as string | null,
    } : DEFAULT_SETTINGS.cardHover,
    footerAppearance: footerAppearance ? {
      id: footerAppearance.id as string,
      logoUrl: footerAppearance.logoUrl as string | null,
      description: footerAppearance.description as string | null,
      backgroundColor: footerAppearance.backgroundColor as string | null,
      textColor: footerAppearance.textColor as string | null,
      headingColor: footerAppearance.headingColor as string | null,
      linkColor: footerAppearance.linkColor as string | null,
      linkHoverColor: footerAppearance.linkHoverColor as string | null,
      borderColor: footerAppearance.borderColor as string | null,
      borderWidth: footerAppearance.borderWidth as number | null,
      spacing: parseResponsiveValue(footerAppearance.spacing as string | null, DEFAULT_SETTINGS.footerAppearance!.spacing!),
      padding: parseResponsiveValue(footerAppearance.padding as string | null, DEFAULT_SETTINGS.footerAppearance!.padding!),
      columnSpacing: parseResponsiveValue(footerAppearance.columnSpacing as string | null, DEFAULT_SETTINGS.footerAppearance!.columnSpacing!),
      copyrightText: footerAppearance.copyrightText as string | null,
      ctaText: footerAppearance.ctaText as string | null,
      ctaLink: footerAppearance.ctaLink as string | null,
    } : DEFAULT_SETTINGS.footerAppearance,
    footerHover: footerHover ? {
      id: footerHover.id as string,
      effectType: footerHover.effectType as string,
      hoverColor: footerHover.hoverColor as string | null,
      underline: footerHover.underline as boolean | null,
      underlineThickness: footerHover.underlineThickness as number | null,
      transitionDuration: footerHover.transitionDuration as number | null,
      easing: footerHover.easing as string | null,
    } : DEFAULT_SETTINGS.footerHover,
    bottomSectionHover: bottomSectionHover ? {
      id: bottomSectionHover.id as string,
      // Hero CTA Buttons
      heroCtaPrimaryBg: bottomSectionHover.heroCtaPrimaryBg as string | null,
      heroCtaPrimaryHoverBg: bottomSectionHover.heroCtaPrimaryHoverBg as string | null,
      heroCtaPrimaryText: bottomSectionHover.heroCtaPrimaryText as string | null,
      heroCtaPrimaryHoverText: bottomSectionHover.heroCtaPrimaryHoverText as string | null,
      heroCtaPrimaryBorder: bottomSectionHover.heroCtaPrimaryBorder as string | null,
      heroCtaPrimaryHoverBorder: bottomSectionHover.heroCtaPrimaryHoverBorder as string | null,
      heroCtaPrimaryShadow: bottomSectionHover.heroCtaPrimaryShadow as string | null,
      heroCtaPrimaryHoverShadow: bottomSectionHover.heroCtaPrimaryHoverShadow as string | null,
      heroCtaPrimaryScale: bottomSectionHover.heroCtaPrimaryScale as number | null,
      heroCtaPrimaryTransition: bottomSectionHover.heroCtaPrimaryTransition as number | null,
      heroCtaSecondaryBg: bottomSectionHover.heroCtaSecondaryBg as string | null,
      heroCtaSecondaryHoverBg: bottomSectionHover.heroCtaSecondaryHoverBg as string | null,
      heroCtaSecondaryText: bottomSectionHover.heroCtaSecondaryText as string | null,
      heroCtaSecondaryHoverText: bottomSectionHover.heroCtaSecondaryHoverText as string | null,
      heroCtaSecondaryBorder: bottomSectionHover.heroCtaSecondaryBorder as string | null,
      heroCtaSecondaryHoverBorder: bottomSectionHover.heroCtaSecondaryHoverBorder as string | null,
      heroCtaSecondaryShadow: bottomSectionHover.heroCtaSecondaryShadow as string | null,
      heroCtaSecondaryHoverShadow: bottomSectionHover.heroCtaSecondaryHoverShadow as string | null,
      heroCtaSecondaryScale: bottomSectionHover.heroCtaSecondaryScale as number | null,
      heroCtaSecondaryTransition: bottomSectionHover.heroCtaSecondaryTransition as number | null,
      // CTA Section Buttons
      ctaSectionPrimaryBg: bottomSectionHover.ctaSectionPrimaryBg as string | null,
      ctaSectionPrimaryHoverBg: bottomSectionHover.ctaSectionPrimaryHoverBg as string | null,
      ctaSectionPrimaryText: bottomSectionHover.ctaSectionPrimaryText as string | null,
      ctaSectionPrimaryHoverText: bottomSectionHover.ctaSectionPrimaryHoverText as string | null,
      ctaSectionPrimaryShadow: bottomSectionHover.ctaSectionPrimaryShadow as string | null,
      ctaSectionPrimaryHoverShadow: bottomSectionHover.ctaSectionPrimaryHoverShadow as string | null,
      ctaSectionPrimaryScale: bottomSectionHover.ctaSectionPrimaryScale as number | null,
      ctaSectionPrimaryTransition: bottomSectionHover.ctaSectionPrimaryTransition as number | null,
      ctaSectionPrimaryArrowTranslateX: bottomSectionHover.ctaSectionPrimaryArrowTranslateX as number | null,
      ctaSectionSecondaryBg: bottomSectionHover.ctaSectionSecondaryBg as string | null,
      ctaSectionSecondaryHoverBg: bottomSectionHover.ctaSectionSecondaryHoverBg as string | null,
      ctaSectionSecondaryText: bottomSectionHover.ctaSectionSecondaryText as string | null,
      ctaSectionSecondaryHoverText: bottomSectionHover.ctaSectionSecondaryHoverText as string | null,
      ctaSectionSecondaryBorder: bottomSectionHover.ctaSectionSecondaryBorder as string | null,
      ctaSectionSecondaryHoverBorder: bottomSectionHover.ctaSectionSecondaryHoverBorder as string | null,
      ctaSectionSecondaryShadow: bottomSectionHover.ctaSectionSecondaryShadow as string | null,
      ctaSectionSecondaryHoverShadow: bottomSectionHover.ctaSectionSecondaryHoverShadow as string | null,
      ctaSectionSecondaryScale: bottomSectionHover.ctaSectionSecondaryScale as number | null,
      ctaSectionSecondaryTransition: bottomSectionHover.ctaSectionSecondaryTransition as number | null,
      // Service Cards
      serviceCardBg: bottomSectionHover.serviceCardBg as string | null,
      serviceCardHoverBg: bottomSectionHover.serviceCardHoverBg as string | null,
      serviceCardBorderColor: bottomSectionHover.serviceCardBorderColor as string | null,
      serviceCardHoverBorderColor: bottomSectionHover.serviceCardHoverBorderColor as string | null,
      serviceCardShadow: bottomSectionHover.serviceCardShadow as string | null,
      serviceCardHoverShadow: bottomSectionHover.serviceCardHoverShadow as string | null,
      serviceCardTranslateY: bottomSectionHover.serviceCardTranslateY as number | null,
      serviceCardScale: bottomSectionHover.serviceCardScale as number | null,
      serviceCardImageZoom: bottomSectionHover.serviceCardImageZoom as number | null,
      serviceCardImageTransition: bottomSectionHover.serviceCardImageTransition as number | null,
      serviceCardBorderWidth: bottomSectionHover.serviceCardBorderWidth as number | null,
      serviceCardHoverBorderWidth: bottomSectionHover.serviceCardHoverBorderWidth as number | null,
      serviceCardBottomBarHeight: bottomSectionHover.serviceCardBottomBarHeight as number | null,
      serviceCardBottomBarColor: bottomSectionHover.serviceCardBottomBarColor as string | null,
      serviceCardBottomBarTransition: bottomSectionHover.serviceCardBottomBarTransition as number | null,
      serviceCardIconBg: bottomSectionHover.serviceCardIconBg as string | null,
      serviceCardIconHoverBg: bottomSectionHover.serviceCardIconHoverBg as string | null,
      serviceCardIconText: bottomSectionHover.serviceCardIconText as string | null,
      serviceCardIconHoverText: bottomSectionHover.serviceCardIconHoverText as string | null,
      serviceCardIconScale: bottomSectionHover.serviceCardIconScale as number | null,
      serviceCardIconTransition: bottomSectionHover.serviceCardIconTransition as number | null,
      serviceCardExploreTextColor: bottomSectionHover.serviceCardExploreTextColor as string | null,
      serviceCardExploreHoverTextColor: bottomSectionHover.serviceCardExploreHoverTextColor as string | null,
      serviceCardArrowColor: bottomSectionHover.serviceCardArrowColor as string | null,
      serviceCardArrowHoverColor: bottomSectionHover.serviceCardArrowHoverColor as string | null,
      serviceCardArrowTranslateX: bottomSectionHover.serviceCardArrowTranslateX as number | null,
      serviceCardArrowTranslateY: bottomSectionHover.serviceCardArrowTranslateY as number | null,
      serviceCardArrowTransition: bottomSectionHover.serviceCardArrowTransition as number | null,
      // Footer Branding
      footerLogoHoverOpacity: bottomSectionHover.footerLogoHoverOpacity as number | null,
      footerLogoHoverScale: bottomSectionHover.footerLogoHoverScale as number | null,
      footerLogoTransition: bottomSectionHover.footerLogoTransition as number | null,
      footerEmailColor: bottomSectionHover.footerEmailColor as string | null,
      footerEmailHoverColor: bottomSectionHover.footerEmailHoverColor as string | null,
      footerEmailUnderline: bottomSectionHover.footerEmailUnderline as boolean | null,
      footerEmailUnderlineThickness: bottomSectionHover.footerEmailUnderlineThickness as number | null,
      footerEmailTransition: bottomSectionHover.footerEmailTransition as number | null,
      // Footer Navigation Links
      footerNavLinkColor: bottomSectionHover.footerNavLinkColor as string | null,
      footerNavLinkHoverColor: bottomSectionHover.footerNavLinkHoverColor as string | null,
      footerNavLinkUnderline: bottomSectionHover.footerNavLinkUnderline as boolean | null,
      footerNavLinkUnderlineThickness: bottomSectionHover.footerNavLinkUnderlineThickness as number | null,
      footerNavLinkUnderlineOffset: bottomSectionHover.footerNavLinkUnderlineOffset as number | null,
      footerNavLinkTransition: bottomSectionHover.footerNavLinkTransition as number | null,
      footerNavLinkEasing: bottomSectionHover.footerNavLinkEasing as string | null,
      // Footer Services Links
      footerServiceLinkColor: bottomSectionHover.footerServiceLinkColor as string | null,
      footerServiceLinkHoverColor: bottomSectionHover.footerServiceLinkHoverColor as string | null,
      footerServiceLinkUnderline: bottomSectionHover.footerServiceLinkUnderline as boolean | null,
      footerServiceLinkUnderlineThickness: bottomSectionHover.footerServiceLinkUnderlineThickness as number | null,
      footerServiceLinkUnderlineOffset: bottomSectionHover.footerServiceLinkUnderlineOffset as number | null,
      footerServiceLinkTransition: bottomSectionHover.footerServiceLinkTransition as number | null,
      footerServiceLinkEasing: bottomSectionHover.footerServiceLinkEasing as string | null,
      // Footer Social Icons
      footerSocialIconSize: bottomSectionHover.footerSocialIconSize as number | null,
      footerSocialIconColor: bottomSectionHover.footerSocialIconColor as string | null,
      footerSocialIconHoverColor: bottomSectionHover.footerSocialIconHoverColor as string | null,
      footerSocialIconBg: bottomSectionHover.footerSocialIconBg as string | null,
      footerSocialIconHoverBg: bottomSectionHover.footerSocialIconHoverBg as string | null,
      footerSocialIconBorderRadius: bottomSectionHover.footerSocialIconBorderRadius as number | null,
      footerSocialIconScale: bottomSectionHover.footerSocialIconScale as number | null,
      footerSocialIconRotation: bottomSectionHover.footerSocialIconRotation as number | null,
      footerSocialIconShadow: bottomSectionHover.footerSocialIconShadow as string | null,
      footerSocialIconHoverShadow: bottomSectionHover.footerSocialIconHoverShadow as string | null,
      footerSocialIconTransition: bottomSectionHover.footerSocialIconTransition as number | null,
      // Footer CTA Button
      footerCtaBg: bottomSectionHover.footerCtaBg as string | null,
      footerCtaHoverBg: bottomSectionHover.footerCtaHoverBg as string | null,
      footerCtaText: bottomSectionHover.footerCtaText as string | null,
      footerCtaHoverText: bottomSectionHover.footerCtaHoverText as string | null,
      footerCtaShadow: bottomSectionHover.footerCtaShadow as string | null,
      footerCtaHoverShadow: bottomSectionHover.footerCtaHoverShadow as string | null,
      footerCtaScale: bottomSectionHover.footerCtaScale as number | null,
      footerCtaArrowTranslateX: bottomSectionHover.footerCtaArrowTranslateX as number | null,
      footerCtaArrowTranslateY: bottomSectionHover.footerCtaArrowTranslateY as number | null,
      footerCtaTransition: bottomSectionHover.footerCtaTransition as number | null,
      // Copyright Bar Links
      copyrightLinkColor: bottomSectionHover.copyrightLinkColor as string | null,
      copyrightLinkHoverColor: bottomSectionHover.copyrightLinkHoverColor as string | null,
      copyrightLinkUnderline: bottomSectionHover.copyrightLinkUnderline as boolean | null,
      copyrightLinkUnderlineThickness: bottomSectionHover.copyrightLinkUnderlineThickness as number | null,
      copyrightLinkUnderlineOffset: bottomSectionHover.copyrightLinkUnderlineOffset as number | null,
      copyrightLinkTransition: bottomSectionHover.copyrightLinkTransition as number | null,
      copyrightLinkEasing: bottomSectionHover.copyrightLinkEasing as string | null,
      // Bottom Decorative Text (Watermark)
      watermarkColor: bottomSectionHover.watermarkColor as string | null,
      watermarkHoverColor: bottomSectionHover.watermarkHoverColor as string | null,
      watermarkScale: bottomSectionHover.watermarkScale as number | null,
      watermarkTransition: bottomSectionHover.watermarkTransition as number | null,
      watermarkOpacity: bottomSectionHover.watermarkOpacity as number | null,
    } : DEFAULT_SETTINGS.bottomSectionHover,
    socialSettings: socialSettings.map(s => ({
      id: s.id as string,
      platform: s.platform as string,
      url: s.url as string,
      isEnabled: s.isEnabled as boolean,
      order: s.order as number,
      iconSize: s.iconSize as number | null,
      color: s.color as string | null,
      hoverColor: s.hoverColor as string | null,
      background: s.background as string | null,
      hoverBackground: s.hoverBackground as string | null,
      borderRadius: s.borderRadius as number | null,
      hoverScale: s.hoverScale as number | null,
      hoverRotation: s.hoverRotation as number | null,
      hoverShadow: s.hoverShadow as string | null,
      transitionDuration: s.transitionDuration as number | null,
    })),
    colors: colors ? {
      id: colors.id as string,
      primary: colors.primary as string | null,
      secondary: colors.secondary as string | null,
      accent: colors.accent as string | null,
      background: colors.background as string | null,
      surface: colors.surface as string | null,
      heading: colors.heading as string | null,
      body: colors.body as string | null,
      muted: colors.muted as string | null,
      border: colors.border as string | null,
      button: colors.button as string | null,
      buttonHover: colors.buttonHover as string | null,
      buttonText: colors.buttonText as string | null,
      buttonHoverText: colors.buttonHoverText as string | null,
      link: colors.link as string | null,
      linkHover: colors.linkHover as string | null,
      footerBackground: colors.footerBackground as string | null,
      footerText: colors.footerText as string | null,
      footerHeading: colors.footerHeading as string | null,
      footerLink: colors.footerLink as string | null,
      footerLinkHover: colors.footerLinkHover as string | null,
      headerBackground: colors.headerBackground as string | null,
      headerText: colors.headerText as string | null,
      headerLinkHover: colors.headerLinkHover as string | null,
      bottomSectionBackground: colors.bottomSectionBackground as string | null,
    } : DEFAULT_SETTINGS.colors,
    typography: typography ? {
      id: typography.id as string,
      primaryFont: typography.primaryFont as string | null,
      headingFont: typography.headingFont as string | null,
      bodyFont: typography.bodyFont as string | null,
      headingWeight: typography.headingWeight as string | null,
      bodyWeight: typography.bodyWeight as string | null,
      baseSize: typography.baseSize as number | null,
      h1Size: typography.h1Size as number | null,
      h2Size: typography.h2Size as number | null,
      h3Size: typography.h3Size as number | null,
      paragraphSize: typography.paragraphSize as number | null,
      lineHeight: typography.lineHeight as number | null,
      letterSpacing: typography.letterSpacing as number | null,
    } : DEFAULT_SETTINGS.typography,
    animation: animation ? {
      id: animation.id as string,
      enableHover: animation.enableHover as boolean,
      hoverSpeed: animation.hoverSpeed as number | null,
      intensity: animation.intensity as number | null,
      reducedMotion: animation.reducedMotion as boolean,
    } : DEFAULT_SETTINGS.animation,
  };
}

type WebsiteSettingsContextType = {
  settings: WebsiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<WebsiteSettings>;
  applyCssVariables: () => void;
};

export const WebsiteSettingsContext = createContext<WebsiteSettingsContextType | null>(null);

export function WebsiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetchWebsiteSettings();
      const transformed = transformApiSettings(res.data as Record<string, unknown>);
      setSettings(transformed);
      setError(null);
      return transformed;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch settings');
      setSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } finally {
      setLoading(false);
    }
  };

  const applyCssVariables = (currentSettings?: WebsiteSettings) => {
    const s = currentSettings || settings;
    const root = document.documentElement;

    // Colors
    if (s.colors) {
      const c = s.colors;
      if (c.primary) root.style.setProperty('--color-primary', c.primary);
      if (c.secondary) root.style.setProperty('--color-secondary', c.secondary);
      if (c.accent) root.style.setProperty('--color-accent', c.accent);
      if (c.background) root.style.setProperty('--color-background', c.background);
      if (c.surface) root.style.setProperty('--color-surface', c.surface);
      if (c.heading) root.style.setProperty('--color-heading', c.heading);
      if (c.body) root.style.setProperty('--color-body', c.body);
      if (c.muted) root.style.setProperty('--color-muted', c.muted);
      if (c.border) root.style.setProperty('--color-border', c.border);
      if (c.button) root.style.setProperty('--color-button', c.button);
      if (c.buttonHover) root.style.setProperty('--color-button-hover', c.buttonHover);
      if (c.link) root.style.setProperty('--color-link', c.link);
      if (c.linkHover) root.style.setProperty('--color-link-hover', c.linkHover);
      if (c.footerBackground) root.style.setProperty('--color-footer-background', c.footerBackground);
      if (c.footerText) root.style.setProperty('--color-footer-text', c.footerText);
      if (c.footerHeading) root.style.setProperty('--color-footer-heading', c.footerHeading);
      if (c.footerLink) root.style.setProperty('--color-footer-link', c.footerLink);
      if (c.footerLinkHover) root.style.setProperty('--color-footer-link-hover', c.footerLinkHover);
      if (c.buttonText) root.style.setProperty('--color-button-text', c.buttonText);
      if (c.buttonHoverText) root.style.setProperty('--color-button-hover-text', c.buttonHoverText);
      if (c.headerBackground) root.style.setProperty('--color-header-background', c.headerBackground);
      if (c.headerText) root.style.setProperty('--color-header-text', c.headerText);
      if (c.headerLinkHover) root.style.setProperty('--color-header-link-hover', c.headerLinkHover);
      if (c.bottomSectionBackground) root.style.setProperty('--color-bottom-section-background', c.bottomSectionBackground);
    }

    // Typography
    if (s.typography) {
      const t = s.typography;
      if (t.primaryFont) root.style.setProperty('--font-primary', t.primaryFont);
      if (t.headingFont) root.style.setProperty('--font-heading', t.headingFont);
      if (t.bodyFont) root.style.setProperty('--font-body', t.bodyFont);
      if (t.headingWeight) root.style.setProperty('--font-weight-heading', t.headingWeight);
      if (t.bodyWeight) root.style.setProperty('--font-weight-body', t.bodyWeight);
      if (t.baseSize) root.style.setProperty('--font-size-base', `${t.baseSize}px`);
      if (t.h1Size) root.style.setProperty('--font-size-h1', `${t.h1Size}px`);
      if (t.h2Size) root.style.setProperty('--font-size-h2', `${t.h2Size}px`);
      if (t.h3Size) root.style.setProperty('--font-size-h3', `${t.h3Size}px`);
      if (t.paragraphSize) root.style.setProperty('--font-size-paragraph', `${t.paragraphSize}px`);
      if (t.lineHeight) root.style.setProperty('--line-height', String(t.lineHeight));
      if (t.letterSpacing !== null && t.letterSpacing !== undefined) root.style.setProperty('--letter-spacing', `${t.letterSpacing}px`);
    }

    // Header
    if (s.header) {
      const h = s.header;
      if (h.backgroundColor) root.style.setProperty('--header-bg', h.backgroundColor);
      if (h.backgroundOpacity !== null && h.backgroundOpacity !== undefined) root.style.setProperty('--header-bg-opacity', String(h.backgroundOpacity));
      if (h.blur !== null && h.blur !== undefined) root.style.setProperty('--header-blur', `${h.blur}px`);
      if (h.borderColor) root.style.setProperty('--header-border-color', h.borderColor);
      if (h.borderWidth !== null && h.borderWidth !== undefined) root.style.setProperty('--header-border-width', `${h.borderWidth}px`);
      if (h.shadow) root.style.setProperty('--header-shadow', h.shadow);
      if (h.height) {
        root.style.setProperty('--header-height-desktop', `${h.height.desktop}px`);
        root.style.setProperty('--header-height-tablet', `${h.height.tablet}px`);
        root.style.setProperty('--header-height-mobile', `${h.height.mobile}px`);
      }
      if (h.navFontSize) {
        root.style.setProperty('--nav-font-size-desktop', `${h.navFontSize.desktop}px`);
        root.style.setProperty('--nav-font-size-tablet', `${h.navFontSize.tablet}px`);
        root.style.setProperty('--nav-font-size-mobile', `${h.navFontSize.mobile}px`);
      }
      if (h.navFontWeight) root.style.setProperty('--nav-font-weight', h.navFontWeight);
      if (h.navSpacing) {
        root.style.setProperty('--nav-spacing-desktop', `${h.navSpacing.desktop}px`);
        root.style.setProperty('--nav-spacing-tablet', `${h.navSpacing.tablet}px`);
        root.style.setProperty('--nav-spacing-mobile', `${h.navSpacing.mobile}px`);
      }
      if (h.navHoverColor) root.style.setProperty('--nav-hover-color', h.navHoverColor);
      if (h.navActiveColor) root.style.setProperty('--nav-active-color', h.navActiveColor);
      if (h.navUnderline !== null && h.navUnderline !== undefined) root.style.setProperty('--nav-underline', h.navUnderline ? '1' : '0');
      if (h.navUnderlineThickness !== null && h.navUnderlineThickness !== undefined) root.style.setProperty('--nav-underline-thickness', `${h.navUnderlineThickness}px`);
      if (h.navUnderlineSpeed !== null && h.navUnderlineSpeed !== undefined) root.style.setProperty('--nav-underline-speed', `${h.navUnderlineSpeed}s`);
      if (h.buttonText) root.style.setProperty('--header-btn-text', h.buttonText);
      if (h.buttonBgColor) root.style.setProperty('--header-btn-bg', h.buttonBgColor);
      if (h.buttonHoverBg) root.style.setProperty('--header-btn-hover-bg', h.buttonHoverBg);
    }

    // Button
    if (s.button) {
      const b = s.button;
      if (b.bgColor) root.style.setProperty('--btn-bg', b.bgColor);
      if (b.textColor) root.style.setProperty('--btn-text', b.textColor);
      if (b.borderColor) root.style.setProperty('--btn-border', b.borderColor);
      if (b.borderWidth !== null && b.borderWidth !== undefined) root.style.setProperty('--btn-border-width', `${b.borderWidth}px`);
      if (b.borderRadius !== null && b.borderRadius !== undefined) root.style.setProperty('--btn-radius', `${b.borderRadius}px`);
      if (b.padding) {
        root.style.setProperty('--btn-padding-desktop', b.padding.desktop);
        root.style.setProperty('--btn-padding-tablet', b.padding.tablet);
        root.style.setProperty('--btn-padding-mobile', b.padding.mobile);
      }
      if (b.fontSize) {
        root.style.setProperty('--btn-font-size-desktop', `${b.fontSize.desktop}px`);
        root.style.setProperty('--btn-font-size-tablet', `${b.fontSize.tablet}px`);
        root.style.setProperty('--btn-font-size-mobile', `${b.fontSize.mobile}px`);
      }
      if (b.fontWeight) root.style.setProperty('--btn-font-weight', b.fontWeight);
      if (b.hoverBgColor) root.style.setProperty('--btn-hover-bg', b.hoverBgColor);
      if (b.hoverTextColor) root.style.setProperty('--btn-hover-text', b.hoverTextColor);
      if (b.hoverBorderColor) root.style.setProperty('--btn-hover-border', b.hoverBorderColor);
      if (b.hoverScale !== null && b.hoverScale !== undefined) root.style.setProperty('--btn-hover-scale', String(b.hoverScale));
      if (b.hoverShadow) root.style.setProperty('--btn-hover-shadow', b.hoverShadow);
      if (b.transitionDuration !== null && b.transitionDuration !== undefined) root.style.setProperty('--btn-transition', `${b.transitionDuration}s`);
    }

    // Text Hover
    if (s.textHover) {
      const th = s.textHover;
      if (th.effectType) root.style.setProperty('--text-hover-effect', th.effectType);
      if (th.color) root.style.setProperty('--text-hover-color', th.color);
      if (th.opacity !== null && th.opacity !== undefined) root.style.setProperty('--text-hover-opacity', String(th.opacity));
      if (th.underline !== null && th.underline !== undefined) root.style.setProperty('--text-hover-underline', th.underline ? '1' : '0');
      if (th.underlineThickness !== null && th.underlineThickness !== undefined) root.style.setProperty('--text-hover-underline-thickness', `${th.underlineThickness}px`);
      if (th.underlineOffset !== null && th.underlineOffset !== undefined) root.style.setProperty('--text-hover-underline-offset', `${th.underlineOffset}px`);
      if (th.letterSpacing !== null && th.letterSpacing !== undefined) root.style.setProperty('--text-hover-letter-spacing', `${th.letterSpacing}px`);
      if (th.transform) root.style.setProperty('--text-hover-transform', th.transform);
      if (th.scale !== null && th.scale !== undefined) root.style.setProperty('--text-hover-scale', String(th.scale));
      if (th.glow) root.style.setProperty('--text-hover-glow', th.glow);
      if (th.shadow) root.style.setProperty('--text-hover-shadow', th.shadow);
      if (th.transitionDuration !== null && th.transitionDuration !== undefined) root.style.setProperty('--text-hover-transition', `${th.transitionDuration}s`);
      if (th.easing) root.style.setProperty('--text-hover-easing', th.easing);
    }

    // Link Hover
    if (s.linkHover) {
      const lh = s.linkHover;
      if (lh.effectType) root.style.setProperty('--link-hover-effect', lh.effectType);
      if (lh.color) root.style.setProperty('--link-color', lh.color);
      if (lh.hoverColor) root.style.setProperty('--link-hover-color', lh.hoverColor);
      if (lh.underline !== null && lh.underline !== undefined) root.style.setProperty('--link-hover-underline', lh.underline ? '1' : '0');
      if (lh.underlineThickness !== null && lh.underlineThickness !== undefined) root.style.setProperty('--link-hover-underline-thickness', `${lh.underlineThickness}px`);
      if (lh.transitionDuration !== null && lh.transitionDuration !== undefined) root.style.setProperty('--link-hover-transition', `${lh.transitionDuration}s`);
      if (lh.easing) root.style.setProperty('--link-hover-easing', lh.easing);
    }

    // Card Hover
    if (s.cardHover) {
      const ch = s.cardHover;
      if (ch.effectType) root.style.setProperty('--card-hover-effect', ch.effectType);
      if (ch.scale !== null && ch.scale !== undefined) root.style.setProperty('--card-hover-scale', String(ch.scale));
      if (ch.translateY !== null && ch.translateY !== undefined) root.style.setProperty('--card-hover-translate-y', `${ch.translateY}px`);
      if (ch.shadow) root.style.setProperty('--card-hover-shadow', ch.shadow);
      if (ch.borderColor) root.style.setProperty('--card-hover-border-color', ch.borderColor);
      if (ch.backgroundChange) root.style.setProperty('--card-hover-bg-change', ch.backgroundChange);
      if (ch.glow) root.style.setProperty('--card-hover-glow', ch.glow);
      if (ch.imageZoom !== null && ch.imageZoom !== undefined) root.style.setProperty('--card-hover-image-zoom', String(ch.imageZoom));
      if (ch.overlayOpacity !== null && ch.overlayOpacity !== undefined) root.style.setProperty('--card-hover-overlay-opacity', String(ch.overlayOpacity));
      if (ch.borderRadius !== null && ch.borderRadius !== undefined) root.style.setProperty('--card-hover-radius', `${ch.borderRadius}px`);
      if (ch.transitionDuration !== null && ch.transitionDuration !== undefined) root.style.setProperty('--card-hover-transition', `${ch.transitionDuration}s`);
      if (ch.easing) root.style.setProperty('--card-hover-easing', ch.easing);
    }

    // Footer
    if (s.footerAppearance) {
      const f = s.footerAppearance;
      if (f.backgroundColor) root.style.setProperty('--footer-bg', f.backgroundColor);
      if (f.textColor) root.style.setProperty('--footer-text', f.textColor);
      if (f.headingColor) root.style.setProperty('--footer-heading', f.headingColor);
      if (f.linkColor) root.style.setProperty('--footer-link', f.linkColor);
      if (f.linkHoverColor) root.style.setProperty('--footer-link-hover', f.linkHoverColor);
      if (f.borderColor) root.style.setProperty('--footer-border-color', f.borderColor);
      if (f.borderWidth !== null && f.borderWidth !== undefined) root.style.setProperty('--footer-border-width', `${f.borderWidth}px`);
      if (f.spacing) {
        root.style.setProperty('--footer-spacing-desktop', `${f.spacing.desktop}px`);
        root.style.setProperty('--footer-spacing-tablet', `${f.spacing.tablet}px`);
        root.style.setProperty('--footer-spacing-mobile', `${f.spacing.mobile}px`);
      }
      if (f.padding) {
        root.style.setProperty('--footer-padding-desktop', `${f.padding.desktop}px`);
        root.style.setProperty('--footer-padding-tablet', `${f.padding.tablet}px`);
        root.style.setProperty('--footer-padding-mobile', `${f.padding.mobile}px`);
      }
      if (f.columnSpacing) {
        root.style.setProperty('--footer-col-spacing-desktop', `${f.columnSpacing.desktop}px`);
        root.style.setProperty('--footer-col-spacing-tablet', `${f.columnSpacing.tablet}px`);
        root.style.setProperty('--footer-col-spacing-mobile', `${f.columnSpacing.mobile}px`);
      }
    }

    // Footer Hover
    if (s.footerHover) {
      const fh = s.footerHover;
      if (fh.effectType) root.style.setProperty('--footer-hover-effect', fh.effectType);
      if (fh.hoverColor) root.style.setProperty('--footer-hover-color', fh.hoverColor);
      if (fh.underline !== null && fh.underline !== undefined) root.style.setProperty('--footer-hover-underline', fh.underline ? '1' : '0');
      if (fh.underlineThickness !== null && fh.underlineThickness !== undefined) root.style.setProperty('--footer-hover-underline-thickness', `${fh.underlineThickness}px`);
      if (fh.transitionDuration !== null && fh.transitionDuration !== undefined) root.style.setProperty('--footer-hover-transition', `${fh.transitionDuration}s`);
      if (fh.easing) root.style.setProperty('--footer-hover-easing', fh.easing);
    }

    // Bottom Section Hover
    if (s.bottomSectionHover) {
      const bsh = s.bottomSectionHover;
      // Hero CTA Buttons
      if (bsh.heroCtaPrimaryBg) root.style.setProperty('--hero-cta-primary-bg', bsh.heroCtaPrimaryBg);
      if (bsh.heroCtaPrimaryHoverBg) root.style.setProperty('--hero-cta-primary-hover-bg', bsh.heroCtaPrimaryHoverBg);
      if (bsh.heroCtaPrimaryText) root.style.setProperty('--hero-cta-primary-text', bsh.heroCtaPrimaryText);
      if (bsh.heroCtaPrimaryHoverText) root.style.setProperty('--hero-cta-primary-hover-text', bsh.heroCtaPrimaryHoverText);
      if (bsh.heroCtaPrimaryBorder) root.style.setProperty('--hero-cta-primary-border', bsh.heroCtaPrimaryBorder);
      if (bsh.heroCtaPrimaryHoverBorder) root.style.setProperty('--hero-cta-primary-hover-border', bsh.heroCtaPrimaryHoverBorder);
      if (bsh.heroCtaPrimaryShadow) root.style.setProperty('--hero-cta-primary-shadow', bsh.heroCtaPrimaryShadow);
      if (bsh.heroCtaPrimaryHoverShadow) root.style.setProperty('--hero-cta-primary-hover-shadow', bsh.heroCtaPrimaryHoverShadow);
      if (bsh.heroCtaPrimaryScale !== null && bsh.heroCtaPrimaryScale !== undefined) root.style.setProperty('--hero-cta-primary-scale', String(bsh.heroCtaPrimaryScale));
      if (bsh.heroCtaPrimaryTransition !== null && bsh.heroCtaPrimaryTransition !== undefined) root.style.setProperty('--hero-cta-primary-transition', `${bsh.heroCtaPrimaryTransition}s`);

      if (bsh.heroCtaSecondaryBg) root.style.setProperty('--hero-cta-secondary-bg', bsh.heroCtaSecondaryBg);
      if (bsh.heroCtaSecondaryHoverBg) root.style.setProperty('--hero-cta-secondary-hover-bg', bsh.heroCtaSecondaryHoverBg);
      if (bsh.heroCtaSecondaryText) root.style.setProperty('--hero-cta-secondary-text', bsh.heroCtaSecondaryText);
      if (bsh.heroCtaSecondaryHoverText) root.style.setProperty('--hero-cta-secondary-hover-text', bsh.heroCtaSecondaryHoverText);
      if (bsh.heroCtaSecondaryBorder) root.style.setProperty('--hero-cta-secondary-border', bsh.heroCtaSecondaryBorder);
      if (bsh.heroCtaSecondaryHoverBorder) root.style.setProperty('--hero-cta-secondary-hover-border', bsh.heroCtaSecondaryHoverBorder);
      if (bsh.heroCtaSecondaryShadow) root.style.setProperty('--hero-cta-secondary-shadow', bsh.heroCtaSecondaryShadow);
      if (bsh.heroCtaSecondaryHoverShadow) root.style.setProperty('--hero-cta-secondary-hover-shadow', bsh.heroCtaSecondaryHoverShadow);
      if (bsh.heroCtaSecondaryScale !== null && bsh.heroCtaSecondaryScale !== undefined) root.style.setProperty('--hero-cta-secondary-scale', String(bsh.heroCtaSecondaryScale));
      if (bsh.heroCtaSecondaryTransition !== null && bsh.heroCtaSecondaryTransition !== undefined) root.style.setProperty('--hero-cta-secondary-transition', `${bsh.heroCtaSecondaryTransition}s`);

      // CTA Section Buttons
      if (bsh.ctaSectionPrimaryBg) root.style.setProperty('--cta-section-primary-bg', bsh.ctaSectionPrimaryBg);
      if (bsh.ctaSectionPrimaryHoverBg) root.style.setProperty('--cta-section-primary-hover-bg', bsh.ctaSectionPrimaryHoverBg);
      if (bsh.ctaSectionPrimaryText) root.style.setProperty('--cta-section-primary-text', bsh.ctaSectionPrimaryText);
      if (bsh.ctaSectionPrimaryHoverText) root.style.setProperty('--cta-section-primary-hover-text', bsh.ctaSectionPrimaryHoverText);
      if (bsh.ctaSectionPrimaryShadow) root.style.setProperty('--cta-section-primary-shadow', bsh.ctaSectionPrimaryShadow);
      if (bsh.ctaSectionPrimaryHoverShadow) root.style.setProperty('--cta-section-primary-hover-shadow', bsh.ctaSectionPrimaryHoverShadow);
      if (bsh.ctaSectionPrimaryScale !== null && bsh.ctaSectionPrimaryScale !== undefined) root.style.setProperty('--cta-section-primary-scale', String(bsh.ctaSectionPrimaryScale));
      if (bsh.ctaSectionPrimaryTransition !== null && bsh.ctaSectionPrimaryTransition !== undefined) root.style.setProperty('--cta-section-primary-transition', `${bsh.ctaSectionPrimaryTransition}s`);
      if (bsh.ctaSectionPrimaryArrowTranslateX !== null && bsh.ctaSectionPrimaryArrowTranslateX !== undefined) root.style.setProperty('--cta-section-primary-arrow-translate-x', `${bsh.ctaSectionPrimaryArrowTranslateX}px`);

      if (bsh.ctaSectionSecondaryBg) root.style.setProperty('--cta-section-secondary-bg', bsh.ctaSectionSecondaryBg);
      if (bsh.ctaSectionSecondaryHoverBg) root.style.setProperty('--cta-section-secondary-hover-bg', bsh.ctaSectionSecondaryHoverBg);
      if (bsh.ctaSectionSecondaryText) root.style.setProperty('--cta-section-secondary-text', bsh.ctaSectionSecondaryText);
      if (bsh.ctaSectionSecondaryHoverText) root.style.setProperty('--cta-section-secondary-hover-text', bsh.ctaSectionSecondaryHoverText);
      if (bsh.ctaSectionSecondaryBorder) root.style.setProperty('--cta-section-secondary-border', bsh.ctaSectionSecondaryBorder);
      if (bsh.ctaSectionSecondaryHoverBorder) root.style.setProperty('--cta-section-secondary-hover-border', bsh.ctaSectionSecondaryHoverBorder);
      if (bsh.ctaSectionSecondaryShadow) root.style.setProperty('--cta-section-secondary-shadow', bsh.ctaSectionSecondaryShadow);
      if (bsh.ctaSectionSecondaryHoverShadow) root.style.setProperty('--cta-section-secondary-hover-shadow', bsh.ctaSectionSecondaryHoverShadow);
      if (bsh.ctaSectionSecondaryScale !== null && bsh.ctaSectionSecondaryScale !== undefined) root.style.setProperty('--cta-section-secondary-scale', String(bsh.ctaSectionSecondaryScale));
      if (bsh.ctaSectionSecondaryTransition !== null && bsh.ctaSectionSecondaryTransition !== undefined) root.style.setProperty('--cta-section-secondary-transition', `${bsh.ctaSectionSecondaryTransition}s`);

      // Service Cards
      if (bsh.serviceCardBg) root.style.setProperty('--service-card-bg', bsh.serviceCardBg);
      if (bsh.serviceCardHoverBg) root.style.setProperty('--service-card-hover-bg', bsh.serviceCardHoverBg);
      if (bsh.serviceCardBorderColor) root.style.setProperty('--service-card-border-color', bsh.serviceCardBorderColor);
      if (bsh.serviceCardHoverBorderColor) root.style.setProperty('--service-card-hover-border-color', bsh.serviceCardHoverBorderColor);
      if (bsh.serviceCardShadow) root.style.setProperty('--service-card-shadow', bsh.serviceCardShadow);
      if (bsh.serviceCardHoverShadow) root.style.setProperty('--service-card-hover-shadow', bsh.serviceCardHoverShadow);
      if (bsh.serviceCardTranslateY !== null && bsh.serviceCardTranslateY !== undefined) root.style.setProperty('--service-card-translate-y', `${bsh.serviceCardTranslateY}px`);
      if (bsh.serviceCardScale !== null && bsh.serviceCardScale !== undefined) root.style.setProperty('--service-card-scale', String(bsh.serviceCardScale));
      if (bsh.serviceCardImageZoom !== null && bsh.serviceCardImageZoom !== undefined) root.style.setProperty('--service-card-image-zoom', String(bsh.serviceCardImageZoom));
      if (bsh.serviceCardImageTransition !== null && bsh.serviceCardImageTransition !== undefined) root.style.setProperty('--service-card-image-transition', `${bsh.serviceCardImageTransition}s`);
      if (bsh.serviceCardBorderWidth !== null && bsh.serviceCardBorderWidth !== undefined) root.style.setProperty('--service-card-border-width', `${bsh.serviceCardBorderWidth}px`);
      if (bsh.serviceCardHoverBorderWidth !== null && bsh.serviceCardHoverBorderWidth !== undefined) root.style.setProperty('--service-card-hover-border-width', `${bsh.serviceCardHoverBorderWidth}px`);
      if (bsh.serviceCardBottomBarHeight !== null && bsh.serviceCardBottomBarHeight !== undefined) root.style.setProperty('--service-card-bottom-bar-height', `${bsh.serviceCardBottomBarHeight}px`);
      if (bsh.serviceCardBottomBarColor) root.style.setProperty('--service-card-bottom-bar-color', bsh.serviceCardBottomBarColor);
      if (bsh.serviceCardBottomBarTransition !== null && bsh.serviceCardBottomBarTransition !== undefined) root.style.setProperty('--service-card-bottom-bar-transition', `${bsh.serviceCardBottomBarTransition}s`);
      if (bsh.serviceCardIconBg) root.style.setProperty('--service-card-icon-bg', bsh.serviceCardIconBg);
      if (bsh.serviceCardIconHoverBg) root.style.setProperty('--service-card-icon-hover-bg', bsh.serviceCardIconHoverBg);
      if (bsh.serviceCardIconText) root.style.setProperty('--service-card-icon-text', bsh.serviceCardIconText);
      if (bsh.serviceCardIconHoverText) root.style.setProperty('--service-card-icon-hover-text', bsh.serviceCardIconHoverText);
      if (bsh.serviceCardIconScale !== null && bsh.serviceCardIconScale !== undefined) root.style.setProperty('--service-card-icon-scale', String(bsh.serviceCardIconScale));
      if (bsh.serviceCardIconTransition !== null && bsh.serviceCardIconTransition !== undefined) root.style.setProperty('--service-card-icon-transition', `${bsh.serviceCardIconTransition}s`);
      if (bsh.serviceCardExploreTextColor) root.style.setProperty('--service-card-explore-text-color', bsh.serviceCardExploreTextColor);
      if (bsh.serviceCardExploreHoverTextColor) root.style.setProperty('--service-card-explore-hover-text-color', bsh.serviceCardExploreHoverTextColor);
      if (bsh.serviceCardArrowColor) root.style.setProperty('--service-card-arrow-color', bsh.serviceCardArrowColor);
      if (bsh.serviceCardArrowHoverColor) root.style.setProperty('--service-card-arrow-hover-color', bsh.serviceCardArrowHoverColor);
      if (bsh.serviceCardArrowTranslateX !== null && bsh.serviceCardArrowTranslateX !== undefined) root.style.setProperty('--service-card-arrow-translate-x', `${bsh.serviceCardArrowTranslateX}px`);
      if (bsh.serviceCardArrowTranslateY !== null && bsh.serviceCardArrowTranslateY !== undefined) root.style.setProperty('--service-card-arrow-translate-y', `${bsh.serviceCardArrowTranslateY}px`);
      if (bsh.serviceCardArrowTransition !== null && bsh.serviceCardArrowTransition !== undefined) root.style.setProperty('--service-card-arrow-transition', `${bsh.serviceCardArrowTransition}s`);

      // Footer Branding
      if (bsh.footerLogoHoverOpacity !== null && bsh.footerLogoHoverOpacity !== undefined) root.style.setProperty('--footer-logo-hover-opacity', String(bsh.footerLogoHoverOpacity));
      if (bsh.footerLogoHoverScale !== null && bsh.footerLogoHoverScale !== undefined) root.style.setProperty('--footer-logo-hover-scale', String(bsh.footerLogoHoverScale));
      if (bsh.footerLogoTransition !== null && bsh.footerLogoTransition !== undefined) root.style.setProperty('--footer-logo-transition', `${bsh.footerLogoTransition}s`);
      if (bsh.footerEmailColor) root.style.setProperty('--footer-email-color', bsh.footerEmailColor);
      if (bsh.footerEmailHoverColor) root.style.setProperty('--footer-email-hover-color', bsh.footerEmailHoverColor);
      if (bsh.footerEmailUnderline !== null && bsh.footerEmailUnderline !== undefined) root.style.setProperty('--footer-email-underline', bsh.footerEmailUnderline ? '1' : '0');
      if (bsh.footerEmailUnderlineThickness !== null && bsh.footerEmailUnderlineThickness !== undefined) root.style.setProperty('--footer-email-underline-thickness', `${bsh.footerEmailUnderlineThickness}px`);
      if (bsh.footerEmailTransition !== null && bsh.footerEmailTransition !== undefined) root.style.setProperty('--footer-email-transition', `${bsh.footerEmailTransition}s`);

      // Footer Navigation Links
      if (bsh.footerNavLinkColor) root.style.setProperty('--footer-nav-link-color', bsh.footerNavLinkColor);
      if (bsh.footerNavLinkHoverColor) root.style.setProperty('--footer-nav-link-hover-color', bsh.footerNavLinkHoverColor);
      if (bsh.footerNavLinkUnderline !== null && bsh.footerNavLinkUnderline !== undefined) root.style.setProperty('--footer-nav-link-underline', bsh.footerNavLinkUnderline ? '1' : '0');
      if (bsh.footerNavLinkUnderlineThickness !== null && bsh.footerNavLinkUnderlineThickness !== undefined) root.style.setProperty('--footer-nav-link-underline-thickness', `${bsh.footerNavLinkUnderlineThickness}px`);
      if (bsh.footerNavLinkUnderlineOffset !== null && bsh.footerNavLinkUnderlineOffset !== undefined) root.style.setProperty('--footer-nav-link-underline-offset', `${bsh.footerNavLinkUnderlineOffset}px`);
      if (bsh.footerNavLinkTransition !== null && bsh.footerNavLinkTransition !== undefined) root.style.setProperty('--footer-nav-link-transition', `${bsh.footerNavLinkTransition}s`);
      if (bsh.footerNavLinkEasing) root.style.setProperty('--footer-nav-link-easing', bsh.footerNavLinkEasing);

      // Footer Services Links
      if (bsh.footerServiceLinkColor) root.style.setProperty('--footer-service-link-color', bsh.footerServiceLinkColor);
      if (bsh.footerServiceLinkHoverColor) root.style.setProperty('--footer-service-link-hover-color', bsh.footerServiceLinkHoverColor);
      if (bsh.footerServiceLinkUnderline !== null && bsh.footerServiceLinkUnderline !== undefined) root.style.setProperty('--footer-service-link-underline', bsh.footerServiceLinkUnderline ? '1' : '0');
      if (bsh.footerServiceLinkUnderlineThickness !== null && bsh.footerServiceLinkUnderlineThickness !== undefined) root.style.setProperty('--footer-service-link-underline-thickness', `${bsh.footerServiceLinkUnderlineThickness}px`);
      if (bsh.footerServiceLinkUnderlineOffset !== null && bsh.footerServiceLinkUnderlineOffset !== undefined) root.style.setProperty('--footer-service-link-underline-offset', `${bsh.footerServiceLinkUnderlineOffset}px`);
      if (bsh.footerServiceLinkTransition !== null && bsh.footerServiceLinkTransition !== undefined) root.style.setProperty('--footer-service-link-transition', `${bsh.footerServiceLinkTransition}s`);
      if (bsh.footerServiceLinkEasing) root.style.setProperty('--footer-service-link-easing', bsh.footerServiceLinkEasing);

      // Footer Social Icons
      if (bsh.footerSocialIconSize !== null && bsh.footerSocialIconSize !== undefined) root.style.setProperty('--footer-social-icon-size', `${bsh.footerSocialIconSize}px`);
      if (bsh.footerSocialIconColor) root.style.setProperty('--footer-social-icon-color', bsh.footerSocialIconColor);
      if (bsh.footerSocialIconHoverColor) root.style.setProperty('--footer-social-icon-hover-color', bsh.footerSocialIconHoverColor);
      if (bsh.footerSocialIconBg) root.style.setProperty('--footer-social-icon-bg', bsh.footerSocialIconBg);
      if (bsh.footerSocialIconHoverBg) root.style.setProperty('--footer-social-icon-hover-bg', bsh.footerSocialIconHoverBg);
      if (bsh.footerSocialIconBorderRadius !== null && bsh.footerSocialIconBorderRadius !== undefined) root.style.setProperty('--footer-social-icon-border-radius', `${bsh.footerSocialIconBorderRadius}px`);
      if (bsh.footerSocialIconScale !== null && bsh.footerSocialIconScale !== undefined) root.style.setProperty('--footer-social-icon-scale', String(bsh.footerSocialIconScale));
      if (bsh.footerSocialIconRotation !== null && bsh.footerSocialIconRotation !== undefined) root.style.setProperty('--footer-social-icon-rotation', `${bsh.footerSocialIconRotation}deg`);
      if (bsh.footerSocialIconShadow) root.style.setProperty('--footer-social-icon-shadow', bsh.footerSocialIconShadow);
      if (bsh.footerSocialIconHoverShadow) root.style.setProperty('--footer-social-icon-hover-shadow', bsh.footerSocialIconHoverShadow);
      if (bsh.footerSocialIconTransition !== null && bsh.footerSocialIconTransition !== undefined) root.style.setProperty('--footer-social-icon-transition', `${bsh.footerSocialIconTransition}s`);

      // Footer CTA Button
      if (bsh.footerCtaBg) root.style.setProperty('--footer-cta-bg', bsh.footerCtaBg);
      if (bsh.footerCtaHoverBg) root.style.setProperty('--footer-cta-hover-bg', bsh.footerCtaHoverBg);
      if (bsh.footerCtaText) root.style.setProperty('--footer-cta-text', bsh.footerCtaText);
      if (bsh.footerCtaHoverText) root.style.setProperty('--footer-cta-hover-text', bsh.footerCtaHoverText);
      if (bsh.footerCtaShadow) root.style.setProperty('--footer-cta-shadow', bsh.footerCtaShadow);
      if (bsh.footerCtaHoverShadow) root.style.setProperty('--footer-cta-hover-shadow', bsh.footerCtaHoverShadow);
      if (bsh.footerCtaScale !== null && bsh.footerCtaScale !== undefined) root.style.setProperty('--footer-cta-scale', String(bsh.footerCtaScale));
      if (bsh.footerCtaArrowTranslateX !== null && bsh.footerCtaArrowTranslateX !== undefined) root.style.setProperty('--footer-cta-arrow-translate-x', `${bsh.footerCtaArrowTranslateX}px`);
      if (bsh.footerCtaArrowTranslateY !== null && bsh.footerCtaArrowTranslateY !== undefined) root.style.setProperty('--footer-cta-arrow-translate-y', `${bsh.footerCtaArrowTranslateY}px`);
      if (bsh.footerCtaTransition !== null && bsh.footerCtaTransition !== undefined) root.style.setProperty('--footer-cta-transition', `${bsh.footerCtaTransition}s`);

      // Copyright Bar Links
      if (bsh.copyrightLinkColor) root.style.setProperty('--copyright-link-color', bsh.copyrightLinkColor);
      if (bsh.copyrightLinkHoverColor) root.style.setProperty('--copyright-link-hover-color', bsh.copyrightLinkHoverColor);
      if (bsh.copyrightLinkUnderline !== null && bsh.copyrightLinkUnderline !== undefined) root.style.setProperty('--copyright-link-underline', bsh.copyrightLinkUnderline ? '1' : '0');
      if (bsh.copyrightLinkUnderlineThickness !== null && bsh.copyrightLinkUnderlineThickness !== undefined) root.style.setProperty('--copyright-link-underline-thickness', `${bsh.copyrightLinkUnderlineThickness}px`);
      if (bsh.copyrightLinkUnderlineOffset !== null && bsh.copyrightLinkUnderlineOffset !== undefined) root.style.setProperty('--copyright-link-underline-offset', `${bsh.copyrightLinkUnderlineOffset}px`);
      if (bsh.copyrightLinkTransition !== null && bsh.copyrightLinkTransition !== undefined) root.style.setProperty('--copyright-link-transition', `${bsh.copyrightLinkTransition}s`);
      if (bsh.copyrightLinkEasing) root.style.setProperty('--copyright-link-easing', bsh.copyrightLinkEasing);

      // Bottom Decorative Text (Watermark)
      if (bsh.watermarkColor) root.style.setProperty('--watermark-color', bsh.watermarkColor);
      if (bsh.watermarkHoverColor) root.style.setProperty('--watermark-hover-color', bsh.watermarkHoverColor);
      if (bsh.watermarkScale !== null && bsh.watermarkScale !== undefined) root.style.setProperty('--watermark-scale', String(bsh.watermarkScale));
      if (bsh.watermarkTransition !== null && bsh.watermarkTransition !== undefined) root.style.setProperty('--watermark-transition', `${bsh.watermarkTransition}s`);
      if (bsh.watermarkOpacity !== null && bsh.watermarkOpacity !== undefined) root.style.setProperty('--watermark-opacity', String(bsh.watermarkOpacity));
    }

    // Animation
    if (s.animation) {
      const a = s.animation;
      if (a.enableHover !== null && a.enableHover !== undefined) root.style.setProperty('--enable-hover', a.enableHover ? '1' : '0');
      if (a.hoverSpeed !== null && a.hoverSpeed !== undefined) root.style.setProperty('--hover-speed', `${a.hoverSpeed}s`);
      if (a.intensity !== null && a.intensity !== undefined) root.style.setProperty('--hover-intensity', String(a.intensity));
      if (a.reducedMotion !== null && a.reducedMotion !== undefined) root.style.setProperty('--reduced-motion', a.reducedMotion ? '1' : '0');
    }

    // Branding
    if (s.branding) {
      const b = s.branding;
      if (b.logoUrl) root.style.setProperty('--logo-url', `url(${b.logoUrl})`);
      if (b.mobileLogoUrl) root.style.setProperty('--mobile-logo-url', `url(${b.mobileLogoUrl})`);
      if (b.darkLogoUrl) root.style.setProperty('--dark-logo-url', `url(${b.darkLogoUrl})`);
      if (b.faviconUrl) {
        const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
        if (link) link.href = b.faviconUrl;
      }
      if (b.logoWidth) {
        root.style.setProperty('--logo-width-desktop', `${b.logoWidth.desktop}px`);
        root.style.setProperty('--logo-width-tablet', `${b.logoWidth.tablet}px`);
        root.style.setProperty('--logo-width-mobile', `${b.logoWidth.mobile}px`);
      }
      if (b.logoHeight) {
        root.style.setProperty('--logo-height-desktop', `${b.logoHeight.desktop}px`);
        root.style.setProperty('--logo-height-tablet', `${b.logoHeight.tablet}px`);
        root.style.setProperty('--logo-height-mobile', `${b.logoHeight.mobile}px`);
      }
    }
  };

  useEffect(() => {
    fetchSettings().then(applyCssVariables);
  }, []);

  useEffect(() => {
    if (!loading) {
      applyCssVariables();
    }
  }, [settings, loading]);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, error, refresh: fetchSettings, applyCssVariables }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);
  if (!context) {
    throw new Error('useWebsiteSettings must be used within a WebsiteSettingsProvider');
  }
  return context;
}