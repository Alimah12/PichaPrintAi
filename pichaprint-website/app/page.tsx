import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import QuickCTA from "./components/QuickCTA";
import BelowHero from "./components/BelowHero";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <BelowHero />
      <QuickCTA />
      <HowItWorks />
      <QuickCTA />
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -mt-10">
          <svg viewBox="0 0 1440 160" className="w-full h-32">
            <defs>
              <linearGradient id="curveSeparator" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 C320,160 640,0 960,80 C1180,140 1300,20 1440,80 L1440,160 L0,160 Z"
              fill="url(#curveSeparator)"
              opacity="0.35"
            />
          </svg>
        </div>
        <div className="h-20" />
      </div>
      <Footer />
    </>
  );
}
