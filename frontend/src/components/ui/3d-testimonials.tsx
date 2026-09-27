"use client";

import React, { ComponentPropsWithoutRef, useRef } from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  autoFill?: boolean;
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaRole?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                key={i}
                className={cn(
                  !vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]',
                  'flex shrink-0 justify-around',
                  !vertical && 'animate-marquee flex-row',
                  vertical && 'animate-marquee-vertical flex-col',
                  pauseOnHover && 'group-hover:[animation-play-state:paused]',
                  reverse && '[animation-direction:reverse]',
                )}
              >
                {children}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse],
      )}
    </div>
  );
}

// Demo component showing the 3D testimonials with vertical marquees
// BISSTECH client testimonials related to our services
const testimonials = [
  {
    name: 'Priya Sharma',
    username: '@priya_sharma',
    body: 'BISSTECH transformed our digital marketing strategy. Our Meta Ads ROAS went from 1.8x to 4.2x in just 6 weeks. Their creative testing framework is exceptional.',
    img: 'https://cdn.21st.dev/assets/mirror/55/55cf6231499bcdc496f15ff1d28d4170ac9b99e9279495caa44fca70886d8b2e.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'Marcus Chen',
    username: '@marcus_chen',
    body: 'The AI automation they built for our SaaS platform handles 70% of inbound inquiries automatically. Our support team now focuses only on complex cases. Massive time savings.',
    img: 'https://cdn.21st.dev/assets/mirror/f0/f07b84f12ef125cbb837a7bd64da401992f5f62bd55fee10d01cd3dcc8abae80.jpg',
    country: '🇸🇬 Singapore',
  },
  {
    name: 'Sophie Laurent',
    username: '@sophie_laurent',
    body: 'Our e-commerce migration to a headless stack lifted checkout conversion from 1.9% to 3.4%. Page speed and mobile UX were the real levers. Outstanding technical expertise.',
    img: 'https://cdn.21st.dev/assets/mirror/7c/7c0d2aa99715b15c218385f5679347782843c02f939d8eee6f9cb1cad6ba6ed0.jpg',
    country: '🇫🇷 France',
  },
  {
    name: 'Rajesh Kumar',
    username: '@rajesh_k',
    body: 'Quick commerce catalog went live on Blinkit, Zepto, and Instamart in two weeks. Flawless onboarding, pricing sync, and promo calendar management. True partners.',
    img: 'https://cdn.21st.dev/assets/mirror/f8/f8f2ddc445b6b2318430260bdebb665c9415865827230565aa42f57c9c794baf.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'Emma Thompson',
    username: '@emma_t',
    body: 'Google Ads campaigns restructured by BISSTECH cut our CPA by 38% while keeping volume steady. Bid strategy and negative-keyword hygiene made the difference.',
    img: 'https://cdn.21st.dev/assets/mirror/ae/ae1d49872fdd6f8d9aa933f6ca8bce8cb1ba7e87dfb9d2926661184cb7bfe26d.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'Diego Rodriguez',
    username: '@diego_r',
    body: 'The rebrand and packaging redesign gave us shelf presence we never had. Sales team says prospects now recognise us before they read the label. Creative excellence.',
    img: 'https://cdn.21st.dev/assets/mirror/9a/9aac54d62e727561f6958213b8a3649230a3bba61ba5ddf63c69d3c6e4aecb0a.jpg',
    country: '🇲🇽 Mexico',
  },
  {
    name: 'Aisha Al-Rashid',
    username: '@aisha_ar',
    body: 'Their software team built our entire internal dashboard in eight weeks. Clean architecture, weekly demos, and zero scope drift. The product just works.',
    img: 'https://cdn.21st.dev/assets/mirror/e5/e55f3cdab57eb4084f7006cfe9f7f047e638e1b257a53498aaed14b83087152a.jpg',
    country: '🇦🇪 UAE',
  },
  {
    name: 'Kenji Tanaka',
    username: '@kenji_t',
    body: 'Our organic traffic doubled within three months after their SEO overhaul. Technical fixes, content strategy, and link building — all handled end to end.',
    img: 'https://cdn.21st.dev/assets/mirror/03/03410c155320ba33ecb8d798807c6c9610f33b2b2acdd4ed961a68185806df79.jpg',
    country: '🇯🇵 Japan',
  },
  {
    name: 'Laura Martinez',
    username: '@laura_m',
    body: 'The brand identity system they delivered gives us consistency across every touchpoint — web, social, packaging, ads. Our team finally has clear guidelines.',
    img: 'https://cdn.21st.dev/assets/mirror/b5/b58616f0d669595c9a42d60a0b9803364c9859f1c3db93a5e3dc408b603e03e8.jpg',
    country: '🇨🇴 Colombia',
  },
];

interface TestimonialCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
  country: string;
}

function TestimonialCard({ img, name, username, body, country }: TestimonialCardProps) {
  return (
    <Card className="w-80 bg-white shadow-sm flex-shrink-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-coffee/10 text-coffee text-sm font-medium">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-espresso-950 flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-espresso-950/60">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-espresso-950/70">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials3DMarquee() {
  return (
    <div className="relative flex h-96 w-full max-w-[1000px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] bg-cream-50">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Gradient overlays for vertical marquee */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-cream-50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cream-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-cream-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-cream-50 to-transparent" />
      </div>
    </div>
  );
}

export default Testimonials3DMarquee;