import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" path="/404" />
      <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div aria-hidden className="absolute inset-0 bg-grid mask-fade-y opacity-50" />
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.12] blur-[120px]" />

        <p className="relative font-display text-8xl font-bold text-white/10 sm:text-9xl">404</p>
        <h1 className="relative mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          This page drifted off the grid.
        </h1>
        <p className="relative mt-4 max-w-md text-sm text-cloud-400 sm:text-base">
          The page you’re looking for was moved, renamed, or never existed. Let’s get you back to
          building, growing and automating.
        </p>
        <Link to="/" className="relative mt-10 inline-flex items-center gap-3 rounded-full bg-electric px-7 py-4 font-display text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:shadow-glow-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </main>
    </>
  );
}