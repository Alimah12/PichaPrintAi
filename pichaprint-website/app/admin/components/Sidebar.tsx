"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminToken } from '../../../src/lib/adminAuth';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // Clear client-side admin token and any related keys
      try {
        clearAdminToken();
      } catch (e) {
        console.warn('clearAdminToken failed', e);
      }

      // Also remove any ephemeral session keys that may store admin info
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pichaprint_admin_session');
        }
      } catch (e) {
        // non-fatal
      }

      // Redirect to the production landing page using replace to avoid back navigation
      if (typeof window !== 'undefined') {
        window.location.replace('https://picha-print-ai.vercel.app/');
      } else {
        // Fallback to router if running in an environment that supports it
        router.replace('/');
      }
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col py-6 px-4 min-h-screen">
      <div className="text-2xl font-bold mb-8 text-white">Admin Dashboard</div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link href="/admin">
          <span className={`block px-4 py-2 rounded hover:bg-slate-700 ${isActive('/admin') ? 'bg-slate-700 font-semibold' : ''}`}>Overview</span>
        </Link>
      
        <Link href="/admin/users">
          <span className={`block px-4 py-2 rounded hover:bg-slate-700 ${isActive('/admin/users') ? 'bg-slate-700 font-semibold' : ''}`}>Users</span>
        </Link>
        <Link href="/admin/designs">
          <span className={`block px-4 py-2 rounded hover:bg-slate-700 ${isActive('/admin/designs') ? 'bg-slate-700 font-semibold' : ''}`}>Designs</span>
        </Link>
        <Link href="/admin/settings">
          <span className={`block px-4 py-2 rounded hover:bg-slate-700 ${isActive('/admin/settings') ? 'bg-slate-700 font-semibold' : ''}`}>Settings</span>
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        aria-busy={loggingOut}
        className={`mt-8 px-4 py-2 rounded text-white ${loggingOut ? 'bg-red-500 opacity-80 cursor-wait' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {loggingOut ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            Logging out...
          </span>
        ) : (
          'Logout'
        )}
      </button>
    </aside>
  );
};

export default Sidebar;