import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-sm bg-white/60 dark:bg-black/60 border-b border-white/10 dark:border-black/20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            PichaPrint
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#learn" className="text-zinc-700 dark:text-zinc-300 hover:underline">
              Learn
            </Link>
            <Link href="#docs" className="text-zinc-700 dark:text-zinc-300 hover:underline">
              Docs
            </Link>
            <Link href="#pricing" className="text-zinc-700 dark:text-zinc-300 hover:underline">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#signup"
              className="hidden sm:inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Sign up
            </Link>
            <Link
              href="#more"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50"
            >
              More
            </Link>
            <button className="ml-2 inline-flex items-center p-2 rounded-md md:hidden text-zinc-700 dark:text-zinc-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
