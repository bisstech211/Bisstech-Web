import { WovenLightHero } from '../ui/woven-light-hero';

/**
 * Home hero — BISSTECH's WebGL particle hero (three.js torus-knot "weave" of
 * light behind the centered headline). Replaced the ResponsiveHeroBanner; the
 * global Navbar (App.tsx) still owns the logo/links/CTA on every page.
 */
export function Hero() {
  return <WovenLightHero />;
}