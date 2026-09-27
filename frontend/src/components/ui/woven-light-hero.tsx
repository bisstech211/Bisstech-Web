import { useRef, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import * as THREE from 'three';
import { Button } from './Button';
import { EASE } from '../../lib/motion';

// --- Motion variants (BISSTECH entrance) ---
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35, delayChildren: 0.9 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 64, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 2.1 } },
};

/**
 * WovenLightHero — BISSTECH's WebGL home hero.
 * A three.js particle field weaves a torus-knot "tapestry of light" behind the
 * centered BUILD. GROW. AUTOMATE. headline; the field flows away from the cursor
 * and settles back into place.
 *
 * Rebranded for BISSTECH (vibrant-red-on-black palette, forced dark, no external
 * fonts, no internal nav — the global Navbar handles branding). The particle
 * loop is optimized vs. the source template: preallocated vectors, squared
 * distance tests, responsive density, DPR cap, and it pauses when the tab is
 * hidden (no per-frame GC churn / no battery drain).
 */
export const WovenLightHero = () => {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="BISSTECH hero"
    >
      <WovenCanvas />

      {/* Soft vignette keeps the text legible over the particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(72% 62% at 50% 46%, transparent 42%, rgba(43,33,24,0.08) 100%)',
        }}
      />

      <div className="relative z-10 w-full px-6 pb-20 pt-28 text-center sm:px-8">
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-bold leading-[1.04] tracking-tight"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', color: '#2B2118', textShadow: '0 0 60px rgba(111,78,55,0.15)' }}
        >
          <motion.span variants={word} className="block">
            BUILD<span style={{ color: '#8B6B52' }}>.</span> GROW
            <span style={{ color: '#8B6B52' }}>.</span>
          </motion.span>
          <motion.span variants={word} className="block" style={{ color: '#2B2118' }}>
            AUTOMATE<span style={{ color: '#8B6B52' }}>.</span>
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-7 max-w-xl text-balance text-base sm:text-lg"
          style={{ color: '#6F4E37' }}
        >
          An interactive field of light and data — BISSTECH weaves high-performance
          engineering, growth strategy, and automated workflows into one system.
        </motion.p>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            to="/contact"
            size="lg"
            withArrow
            className="border-2"
            style={{
              borderColor: 'var(--hero-cta-primary-border)',
              backgroundColor: 'var(--hero-cta-primary-bg)',
              color: 'var(--hero-cta-primary-text)',
              transition: `all var(--hero-cta-primary-transition) ease-out`,
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = 'var(--hero-cta-primary-hover-bg)';
              target.style.color = 'var(--hero-cta-primary-hover-text)';
              target.style.borderColor = 'var(--hero-cta-primary-hover-border)';
              target.style.boxShadow = 'var(--hero-cta-primary-hover-shadow)';
              target.style.transform = `scale(var(--hero-cta-primary-scale))`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = 'var(--hero-cta-primary-bg)';
              target.style.color = 'var(--hero-cta-primary-text)';
              target.style.borderColor = 'var(--hero-cta-primary-border)';
              target.style.boxShadow = 'var(--hero-cta-primary-shadow)';
              target.style.transform = 'scale(1)';
            }}
          >
            Start a Project
          </Button>
          <Button
            to="/services"
            size="lg"
            variant="ghost"
            className="border-2"
            style={{
              borderColor: 'var(--hero-cta-secondary-border)',
              backgroundColor: 'var(--hero-cta-secondary-bg)',
              color: 'var(--hero-cta-secondary-text)',
              transition: `all var(--hero-cta-secondary-transition) ease-out`,
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = 'var(--hero-cta-secondary-hover-bg)';
              target.style.color = 'var(--hero-cta-secondary-hover-text)';
              target.style.borderColor = 'var(--hero-cta-secondary-hover-border)';
              target.style.boxShadow = 'var(--hero-cta-secondary-hover-shadow)';
              target.style.transform = `scale(var(--hero-cta-secondary-scale))`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = 'var(--hero-cta-secondary-bg)';
              target.style.color = 'var(--hero-cta-secondary-text)';
              target.style.borderColor = 'var(--hero-cta-secondary-border)';
              target.style.boxShadow = 'var(--hero-cta-secondary-shadow)';
              target.style.transform = 'scale(1)';
            }}
          >
            Explore Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

/** Optimized three.js particle field — one torus-knot "weave" of coffee light. */
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      Math.max(1, mount.clientWidth / mount.clientHeight),
      0.1,
      100,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(Math.max(1, mount.clientWidth), Math.max(1, mount.clientHeight));
    mount.appendChild(renderer.domElement);

    // Responsive density: fewer points on small screens, no interaction on
    // reduced-motion devices (still renders the static weave).
    const isMobile = mount.clientWidth < 768;
    const particleCount = isMobile ? 9000 : 20000;
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const positions = new Float32Array(particleCount * 3);
    const original = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Sample the torus-knot surface (source positions for the weave + rest state)
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const total = torusKnot.attributes.position.count;
    const src = torusKnot.attributes.position.array as Float32Array;

    // Coffee palette
    const coffeePalette = [
      '#2B2118',
      '#6F4E37',
      '#8B6B52',
      '#A98262',
      '#C8B6A6'
    ];
    const c = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const vi = (i % total) * 3;
      const x = src[vi];
      const y = src[vi + 1];
      const z = src[vi + 2];
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      original[i * 3] = x;
      original[i * 3 + 1] = y;
      original[i * 3 + 2] = z;
      // Coffee palette
      c.set(coffeePalette[i % coffeePalette.length]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Preallocated scratch vectors — no per-frame allocations.
    const mouseWorld = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const rest = new THREE.Vector3();

    const onPointerMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseWorld.set(nx * 3, ny * 3, 0);
    };

    const onResize = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!running) return;

      const t = clock.getElapsedTime();
      if (!prefersReduced) {
        const attr = geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const ix = i * 3;
          const iy = ix + 1;
          const iz = ix + 2;

          // Squared-distance repulsion from the cursor (cheap, no sqrt unless close)
          const dx = positions[ix] - mouseWorld.x;
          const dy = positions[iy] - mouseWorld.y;
          const dz = positions[iz] - mouseWorld.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < 2.25) {
            const dist = Math.sqrt(distSq) || 1e-4;
            const strength = (1.5 - dist) * 0.01;
            dir.set(dx / dist, dy / dist, dz / dist);
            velocities[ix] += dir.x * strength;
            velocities[iy] += dir.y * strength;
            velocities[iz] += dir.z * strength;
          }

          // Spring back to the weave's rest position
          rest.set(original[ix] - positions[ix], original[iy] - positions[iy], original[iz] - positions[iz]);
          velocities[ix] += rest.x * 0.001;
          velocities[iy] += rest.y * 0.001;
          velocities[iz] += rest.z * 0.001;

          // Damping + integrate
          velocities[ix] *= 0.95;
          velocities[iy] *= 0.95;
          velocities[iz] *= 0.95;
          positions[ix] += velocities[ix];
          positions[iy] += velocities[iy];
          positions[iz] += velocities[iz];
        }
        attr.needsUpdate = true;
      }

      points.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    if (!prefersReduced) window.addEventListener('mousemove', onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onPointerMove);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      torusKnot.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default WovenLightHero;