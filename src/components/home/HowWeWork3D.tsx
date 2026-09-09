import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 0, number: '01', title: 'Discover', description: 'We dive deep into your business, audience, and goals to uncover every opportunity.' },
  { id: 1, number: '02', title: 'Strategize', description: 'We architect a data‑driven roadmap that aligns technology, growth, and automation.' },
  { id: 2, number: '03', title: 'Build & Create', description: 'We engineer high‑performance solutions with a relentless focus on quality and speed.' },
  { id: 3, number: '04', title: 'Launch', description: 'We deploy, test, and refine to ensure a flawless go‑live that drives immediate impact.' },
  { id: 4, number: '05', title: 'Grow & Automate', description: 'We continuously scale your systems and automate the repeatable, so you keep winning.' },
];

// ---- Particle background (canvas) ----
const useParticles = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 pointer-events-none z-0';
    container.prepend(canvas);
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    const count = 60;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };
    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random() * 2,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          opacity: 0.2 + Math.random() * 0.5,
        });
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 9, 20, ${p.opacity * 0.5})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);

    window.addEventListener('resize', () => { resize(); });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, [containerRef]);
};

// ---- Main component ----
export const HowWeWork3D = () => {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useParticles(containerRef);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 150 });
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 2);
    mouseY.set(y * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Switch step on click
  const handleStepClick = (id: number) => {
    setActive(id);
  };

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-ink py-24">
      {/* 3D container with perspective */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{
          perspective: 1200,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-[0.2em] text-electric uppercase">Our Process</span>
          <h2 className="font-display text-4xl font-bold text-white mt-2 sm:text-5xl">
            How We Work
          </h2>
          <p className="mt-4 text-base text-cloud-300 max-w-2xl mx-auto">
            A transparent, collaborative system that turns your vision into measurable growth.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => {
            const isActive = active === step.id;
            return (
              <motion.div
                key={step.id}
                className={cn(
                  'relative rounded-2xl p-6 cursor-pointer transition-all duration-500',
                  'border border-white/5 bg-white/[0.03] backdrop-blur-sm',
                  'hover:border-electric/40',
                  isActive && 'border-electric/60 bg-white/[0.06]'
                )}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  translateZ: isActive ? 30 : 0,
                  boxShadow: isActive
                    ? '0 0 40px rgba(229, 9, 20, 0.25), inset 0 0 40px rgba(229, 9, 20, 0.05)'
                    : '0 0 0 rgba(229, 9, 20, 0)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => handleStepClick(step.id)}
              >
                {/* Watermark number */}
                <div className="absolute -top-4 -right-2 text-7xl font-bold text-white/5 select-none pointer-events-none">
                  {step.number}
                </div>

                {/* Step index (small) */}
                <span className="text-xs font-medium text-electric/70 tracking-widest">
                  {step.number}
                </span>

                <h3 className="mt-3 font-display text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-cloud-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Glow ring on active */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-px rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      boxShadow: '0 0 30px rgba(229, 9, 20, 0.3), inset 0 0 30px rgba(229, 9, 20, 0.05)',
                      border: '1px solid rgba(229, 9, 20, 0.4)',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress connector (line with animated fill) */}
        <div className="relative mt-12 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric to-electric/60 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-cloud-500">
          <span>Start</span>
          <span>Scale</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HowWeWork3D;