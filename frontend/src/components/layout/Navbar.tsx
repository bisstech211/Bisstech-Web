import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../data/site';
import { Button } from '../ui/Button';
import { Logo } from './Logo';
import { cn } from '../../lib/utils';
import { EASE } from '../../lib/motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            'transition-all duration-500',
            scrolled
              ? 'border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <div className="container-bt flex h-[72px] items-center justify-between">
            <Logo />

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                      isActive ? 'text-white' : 'text-cloud-400 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={cn(
                          'absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-electric to-transparent transition-transform duration-300',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Button to="/contact" size="md">
                Start a Project
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-0 z-[80] flex flex-col bg-ink-950 lg:hidden"
    >
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-bt relative flex h-[72px] items-center justify-between">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="container-bt relative flex flex-1 flex-col justify-center gap-2">
        {NAV_LINKS.map((link, i) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE }}
          >
            <Link
              to={link.path}
              onClick={onClose}
              className="group flex items-baseline gap-4 py-3 font-display text-4xl font-semibold text-white/90 transition-colors hover:text-electric"
            >
              <span className="text-xs font-medium text-electric/70">0{i + 1}</span>
              {link.label}
            </Link>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          className="mt-10 flex flex-col gap-3"
        >
          <Link
            to="/contact"
            onClick={onClose}
            className="btn-primary justify-center w-full"
          >
            Start a Project
          </Link>
          <p className="pt-4 text-center text-xs uppercase tracking-[0.3em] text-cloud-500">
            Build · Grow · Automate
          </p>
        </motion.div>
      </nav>
    </motion.div>
  );
}
