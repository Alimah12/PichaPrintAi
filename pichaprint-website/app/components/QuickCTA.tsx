'use client';

import { useRouter } from 'next/navigation';

interface QuickCTAProps {
  title?: string;
  description?: string;
  priceText?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('access_token');
  }
  return false;
};

export default function QuickCTA({
  title = 'Launch Your Hardware Journey',
  description = 'Start from a single prompt and get a complete design workflow—STL, firmware, and circuit-ready outputs in one click.',
  priceText = '$0.15 USD per gram',
  buttonLabel = 'Try the Demo',
  buttonHref = '/demo'
}: QuickCTAProps) {
  const router = useRouter();

  const handleDemoClick = () => {
    if (isAuthenticated()) {
      router.push(buttonHref);
    } else {
      router.push('/login');
    }
  };

  return (
    <section className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-slate-900 py-12 px-6 rounded-3xl shadow-2xl shadow-cyan-800/30 overflow-hidden relative">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_45%)]" />
      <div className="relative max-w-5xl mx-auto grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
        <div className="space-y-5 text-white order-2 lg:order-1">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-black/10">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
            72h print, assemble, test & ship
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Launch your hardware quickly</h2>
          <p className="max-w-xl text-base leading-7 text-slate-100/90">
            Prompt it, print it, get the full package at <span className="font-semibold text-white">{priceText}</span>.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-slate-900 shadow-xl shadow-white/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {buttonLabel}
            </button>
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-slate-100">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-200/80">Price</p>
              <p className="mt-1 text-lg font-semibold text-white">{priceText}</p>
            </div>
          </div>
          <div className="h-16 w-full rounded-3xl border border-white/15 bg-white/5 p-3 text-sm text-slate-200 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-300/15 blur-3xl" />
            <p className="relative">Less text, more impact.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 right-0 hidden lg:block pointer-events-none">
            <svg viewBox="0 0 900 250" className="mx-auto h-full w-full opacity-70">
              <path
                d="M 120 40 C 300 40, 480 210, 720 210"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path d="M 720 210 L 708 200 L 718 190" fill="white" />
            </svg>
          </div>
          <img
            src="/images/hero/hero.jpeg"
            alt="Hero image"
            className="relative w-full h-96 rounded-[2rem] object-cover border border-white/10 shadow-lg shadow-black/20"
          />
        </div>
      </div>
    </section>
  );
}