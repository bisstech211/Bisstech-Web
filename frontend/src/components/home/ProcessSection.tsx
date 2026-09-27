import type { CSSProperties } from 'react';
import { LazyMotion, domAnimation, m } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
type CardTheme = 'coffee' | 'coffeeSoft' | 'espresso';

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: CardTheme;
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface Step {
  title: string;
  description: string;
  colorTheme?: CardTheme;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

/* ------------------------------------------------------------------ */
/* Pin icon                                                             */
/* ------------------------------------------------------------------ */
const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117.007v4.764l1.894 3.789a1 1 0 0 1 .1.331l.006.116v2a1 1 0 0 1-.883.993l-.117.007h-4v4a1 1 0 0 1-1.993.117l-.007-.117v-4h-4a1 1 0 0 1-.993-.883l-.007-.117v-2a1 1 0 0 1 .06-.34l.046-.107l1.894-3.791v-4.762a1 1 0 0 1-.117-1.993l.117-.007h8z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */
const DEFAULT_BG_COLORS: Record<CardTheme, string> = {
  coffee: 'bg-coffee/10',
  coffeeSoft: 'bg-coffee/5',
  espresso: 'bg-espresso-800/10',
};

const DEFAULT_TEXT_COLORS: Record<CardTheme, string> = {
  coffee: 'text-coffee',
  coffeeSoft: 'text-coffee',
  espresso: 'text-espresso-700',
};

const DEFAULT_BORDER_COLORS: Record<CardTheme, string> = {
  coffee: 'border-coffee/20',
  coffeeSoft: 'border-coffee/10',
  espresso: 'border-espresso-700/15',
};

const Card = ({
  number,
  title,
  description,
  colorTheme = 'coffee',
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const bgColor = customColors?.bg ?? DEFAULT_BG_COLORS[colorTheme];
  const textColor = customColors?.text ?? DEFAULT_TEXT_COLORS[colorTheme];
  const borderColor = customColors?.border ?? DEFAULT_BORDER_COLORS[colorTheme];

  return (
    <div
      className={`relative w-full md:w-[280px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate ?? ''} ${className ?? ''}`}
    >
      <div className="bg-cream-50 p-2 rounded-[25px] shadow-[0px_10px_20px_0px_rgba(61,43,31,0.06)] border border-espresso-950/06">
        <Pin className={`w-8 h-8 mb-6 mx-auto ${textColor}`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-[15px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} font-display text-5xl font-bold mb-5 opacity-90`}
          >
            {number}
          </span>
          <h3 className="text-2xl font-semibold text-espresso-950 leading-none mb-[10px]">
            {title}
          </h3>
          <p className="text-espresso-600 text-sm leading-5 tracking-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */
const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: 'md:absolute md:top-0 md:left-[15%]', rotate: 'rotate-[8deg]' },
  {
    className: 'md:absolute md:top-[120px] md:right-[15%]',
    rotate: '-rotate-[8deg]',
  },
  { className: 'md:absolute md:top-[450px] md:left-[15%]', rotate: 'rotate-[8deg]' },
  {
    className: 'md:absolute md:top-[570px] md:right-[10%]',
    rotate: '-rotate-[8deg]',
  },
  { className: 'md:absolute md:top-[850px] md:left-[15%]', rotate: 'rotate-[8deg]' },
];

const DEFAULT_FEATURES: Step[] = [
  {
    title: 'Discover',
    description:
      'We dig into your business, audience, competitors, and goals. No assumptions — just a clear picture of where growth lives.',
    colorTheme: 'coffee',
  },
  {
    title: 'Strategize',
    description:
      'We map out the architectural blueprint, user journeys, and technical roadmap to ensure maximum speed and stability.',
    colorTheme: 'coffeeSoft',
  },
  {
    title: 'Build & Create',
    description:
      'Our engineering and design team executes with precision, crafting high-performance digital experiences.',
    colorTheme: 'espresso',
  },
  {
    title: 'Launch',
    description:
      'Rigorous testing, optimization, and seamless deployment to get your product live with zero downtime.',
    colorTheme: 'coffeeSoft',
  },
  {
    title: 'Scale & Grow',
    description:
      'Continuous tracking, iteration, and automation to maintain momentum and scale your brand.',
    colorTheme: 'coffee',
  },
];

export function ProcessSection({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const data = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const positions = stepPositions ?? DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3) height = 800;
  else if (data.length === 4) height = 900;

  return (
    <LazyMotion features={domAnimation}>
      <section
        className={`bg-cream-50 max-md:pt-10 max-md:pb-20 md:py-20 px-8 relative overflow-hidden ${className ?? ''}`}
      >
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-20">
          <p className="text-coffee font-medium tracking-widest text-sm uppercase mb-2">
            HOW WE WORK
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-espresso-950 mb-4">
            A process built for <span className="text-gradient">momentum.</span>
          </h2>
          <p className="text-espresso-600 text-lg">
            Clear, fast and collaborative — you always know what's happening and what's next.
          </p>
        </div>

        {/* Horizontal scanline backdrop (light theme) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(61,43,31,0.08) 1px, transparent 1px)',
            backgroundSize: '100% 32px',
            marginTop: '4px',
          }}
        ></div>
        <div className="from-cream-100 pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r to-transparent" />
        <div className="from-cream-100 pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
            style={{ '--md-height': `${height}px` } as CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    if (index === 0) return 'M 290 150 C 500 150, 550 270, 710 270';
                    if (index === 1) return `${acc} C 850 270, 500 350, 290 450`;
                    if (index === 2) return `${acc} C 290 600, 550 720, 750 720`;
                    if (index === 3) return `${acc} C 950 720, 500 800, 290 850`;
                    return acc;
                  }, '');
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-espresso-950/10"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -140 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];
              const stepNumber = `0${index + 1}`;

              return (
                <Card
                  key={step.title}
                  number={stepNumber}
                  title={step.title}
                  description={step.description}
                  colorTheme={step.colorTheme}
                  colors={step.colors}
                  className={position.className}
                  rotate={position.rotate}
                />
              );
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default ProcessSection;