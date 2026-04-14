'use client';

export default function HowItWorks() {
  return (
    <section className="relative z-20 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From a simple text description to complete hardware designs in minutes
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative py-12">
          {/* Connecting arrows - SVG paths for curved arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1200 500">
            {/* Arrow from Prompt to STL */}
            <path
              d="M 250 170 Q 420 110 590 170"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="opacity-60"
            />
            {/* Arrow from STL to Circuit */}
            <path
              d="M 250 370 Q 420 310 590 370"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="opacity-60"
            />
            {/* Arrow from Circuit to Firmware */}
            <path
              d="M 760 170 Q 930 110 1100 170"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="opacity-60"
            />

            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrowGradient)" />
              </marker>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 relative z-20">
            {/* Step 1: Prompt */}
            <div className="text-center">
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-18 h-18 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">1. Describe</h3>
                <p className="text-base text-white/70 mb-6">Input your hardware idea in plain English</p>
                <div className="bg-white/5 rounded-3xl p-4 border border-white/10">
                  <p className="text-sm text-white/80 italic">
                    "A consumer electronics box unit with LED indicators and USB connectivity"
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: STL Design */}
            <div className="text-center">
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-18 h-18 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">2. 3D Model</h3>
                <p className="text-base text-white/70 mb-6">AI generates STL enclosure design</p>
                <div className="group relative h-96 rounded-4xl overflow-hidden border border-white/20 shadow-lg shadow-black/10">
                  <a href="/images/hero/HowItWorks/stl1.jpeg" className="block w-full h-full">
                    <img
                      src="/images/hero/HowItWorks/stl1.jpeg"
                      alt="Generated STL model"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Circuit Design */}
            <div className="text-center">
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-18 h-18 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">3. Circuit</h3>
                <p className="text-base text-white/70 mb-6">Automatic schematic generation</p>
                <div className="group relative h-96 rounded-4xl overflow-hidden border border-white/20 shadow-lg shadow-black/10">
                  <a href="/images/hero/HowItWorks/circuit.jpeg" className="block w-full h-full">
                    <img
                      src="/images/hero/HowItWorks/circuit.jpeg"
                      alt="Generated circuit diagram"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 4: Firmware */}
            <div className="text-center">
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-18 h-18 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">4. Firmware</h3>
                <p className="text-base text-white/70 mb-6">Ready-to-compile microcontroller code</p>
                <div className="group relative h-96 rounded-4xl overflow-hidden border border-white/20 shadow-lg shadow-black/10">
                  <a href="/images/hero/HowItWorks/firmware.jpeg" className="block w-full h-full">
                    <img
                      src="/images/hero/HowItWorks/firmware.jpeg"
                      alt="Generated firmware code"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional STL Example */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-white mb-8">See Your Designs Come to Life</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-medium text-white mb-4">3D Rendered Model</h4>
              <div className="group relative h-80 rounded-3xl overflow-hidden border border-white/20 shadow-lg shadow-black/10">
                <a href="/images/hero/HowItWorks/stl2.jpeg" className="block w-full h-full">
                  <img
                    src="/images/hero/HowItWorks/stl2.jpeg"
                    alt="3D rendered STL model"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                  />
                </a>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-medium text-white mb-4">Ready for Manufacturing</h4>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-16 h-16 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-white/80">Export Gerber files, order PCBs, and start building immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}