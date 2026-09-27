import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import { Footer } from './components/layout/Footer';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { CursorGlow } from './components/layout/CursorGlow';
import { PageTransition } from './components/layout/PageTransition';
import { SiteStructuredData } from './lib/seo';

// Lazy pages so each route's JS loads only when visited.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/services/:slug', element: <ServiceDetail /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:slug', element: <BlogPost /> },
  { path: '/contact', element: <Contact /> },
];

function Shell() {
  return <Outlet />;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <SiteStructuredData />
      <SmoothScroll>
        <ScrollToTop />
        <ScrollProgress />
        <CursorGlow />
        <Navbar />

        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="flex min-h-[80vh] items-center justify-center">
                <span className="shimmer h-1 w-32 rounded-full" />
              </div>
            }
          >
            <Routes location={location}>
              <Route element={<Shell />}>
                {routes.map((r) => (
                  <Route key={r.path} path={r.path} element={<PageTransition key={r.path}>{r.element}</PageTransition>} />
                ))}
                <Route path="*" element={<PageTransition key="404"><NotFound /></PageTransition>} />
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
              
        <Footer />
      </SmoothScroll>
    </>
  );
}