"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, clearToken } from "../../src/lib/auth";

export default function Header() {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Re-check auth status whenever pathname changes (in case token was stored after initial mount)
  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');
    if (isAdmin) {
      // Skip ALL redirect logic for admin routes - they handle their own auth
      console.debug('[Header] admin route detected, skipping redirect logic');
      return;
    }
    
    // For non-admin routes: update authed state based on current token
    const token = getToken();
    setAuthed(!!token);
    console.debug('[Header] checking auth for route', { pathname, authed: !!token, isAdmin });
  }, [pathname]);

  useEffect(() => {
    // Skip redirect logic entirely for admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Only redirect authenticated users to /demo when they are on public entry pages
    if (authed && (pathname === '/' || pathname === '/login' || pathname === '/signup')) {
      console.debug('[Header] redirecting authed user from entry page to /demo');
      router.push('/demo');
      return;
    }

    if (!authed && pathname === '/demo') {
      console.debug('[Header] redirecting unauthed user from /demo to /');
      router.push('/');
    }
  }, [authed, pathname, router]);

  const handleSignOut = () => {
    clearToken();
    setAuthed(false);
    router.push('/');
  };

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
            {!authed ? (
              <>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/demo"
                  className="hidden sm:inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Create
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  Sign out
                </button>
              </>
            )}

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
