export default function BelowHero() {
  return (
    <section className="bg-white dark:bg-zinc-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            From Idea to Hardware — Fast
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            PichaPrint streamlines the entire hardware workflow — design, BOM, PCB layout,
            and manufacturing-ready exports so teams ship robust devices faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Design</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">AI-generated schematics and component selection tailored to your requirements.</p>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Prototype</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Quick turn prototypes with ready-to-order component lists and assembly guides.</p>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Manufacture</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Export Gerber, pick-and-place, and BOMs for production and supply chain handoff.</p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a href="#contact" className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800">Contact Sales</a>
        </div>
      </div>
    </section>
  );
}
