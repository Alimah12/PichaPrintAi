'use client';

import { useRouter } from 'next/navigation';
import { getToken } from '../../src/lib/auth';
import { getAdminToken, checkAdminAccess } from '../../src/lib/adminAuth';

export default function Hero() {
  const router = useRouter();

  const handleDemoClick = async () => {
    const token = getToken();
    const adminToken = getAdminToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (adminToken) {
      try {
        const isAdmin = await checkAdminAccess(adminToken);
        if (isAdmin) {
          router.push('/admin');
          return;
        }
      } catch (e) {
        console.warn('[hero] admin check failed', e);
      }
    }

    router.push('/demo');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Layer 1: Slow spinning background */}
      <img
        src="/images/hero/hero.jpeg"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover animate-slow-spin z-0"
        aria-hidden
      />

      {/* Layer 2: Reverse spinning overlay for depth (optional) */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="/images/hero/hero.jpeg"
          alt=""
          className="w-full h-full object-cover animate-reverse-slow-spin"
          aria-hidden
        />
      </div>

      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent z-10" />

      {/* Floating particles / circuit board dots (dynamic feel) */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      </div>

      <section className="relative z-20 max-w-4xl text-center px-6 py-28">
        {/* Badge with float animation */}
        <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white shadow-sm animate-float">
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          AI-Powered Hardware Generation
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          Turn Text Into
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent ml-2">
            Physical Electronics
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-xl md:text-2xl leading-8 text-white/90 max-w-3xl mx-auto backdrop-blur-sm">
          Describe any electronic product in plain English — and Pichaprint AI instantly generates
          circuit architectures, component lists, and ready-to-manufacture PCB layouts.
        </p>

        {/* Example prompt - glass morphism effect */}
        <div className="mt-8 mx-auto max-w-2xl rounded-2xl bg-white/10 border border-white/20 p-4 shadow-lg backdrop-blur-md transition-all hover:scale-105 duration-300">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-emerald-500/20 backdrop-blur-sm p-2">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white/70">Example input</p>
              <p className="text-base text-white font-mono">
                &quot;A temperature sensor with a digital display and buzzer alert&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Value props with glass cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          {[
            { icon: "", title: "10x Faster", desc: "Prototype in minutes, not weeks" },
            { icon: "", title: "No CAD Skills", desc: "Generate PCB layouts automatically" },
            { icon: "", title: "Manufacturing Ready", desc: "Export Gerber files & BOMs" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <span className="text-emerald-400 text-xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            onClick={handleDemoClick}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-xl animate-float"
          >
            Try the Demo
          </button>
          <a
            href="#learn"
            className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            How It Works
          </a>
        </div>

        {/* Trust indicator */}
        <p className="mt-8 text-xs text-white/50">
          Built for engineers, makers, and hardware startups
        </p>
      </section>
    </div>
  );
}