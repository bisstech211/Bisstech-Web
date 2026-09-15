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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ink"
      aria-label="BISSTECH hero"
    >
      <WovenCanvas />

      {/* Soft vignette keeps the text legible over the particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(72% 62% at 50% 46%, transparent 42%, rgba(15,15,15,0.7) 100%)',
        }}
      />

      <div className="relative z-10 w-full px-6 pb-20 pt-28 text-center sm:px-8">
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-bold leading-[1.04] tracking-tight text-white"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', textShadow: '0 0 60px rgba(229,9,20,0.35)' }}
        >
          <motion.span variants={word} className="block">
            BUILD<span className="text-slate-500">.</span> GROW
            <span className="text-slate-500">.</span>
          </motion.span>
          <motion.span variants={word} className="text-gradient block">
            AUTOMATE<span className="text-slate-500">.</span>
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-7 max-w-xl text-balance text-base text-cloud-300 sm:text-lg"
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
          <Button to="/contact" size="lg" withArrow>
            Start a Project
          </Button>
          <Button to="/services" size="lg" variant="ghost">
            Explore Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

/** Optimized three.js particle field — one torus-knot "weave" of BISSTECH-red light. */
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
      // BISSTECH palette — vibrant red (hue 350–360 ∪ 0–12)
      const hue = Math.random() < 0.5 ? Math.random() * 12 : 350 + Math.random() * 10;
      c.setHSL(hue, 0.65 + Math.random() * 0.3, 0.5 + Math.random() * 0.18);
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
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
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