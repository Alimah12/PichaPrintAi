"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAdminToken } from "../../src/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAdminToken();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold mb-8">Admin Dashboard</div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/admin/analytics">
            <span className={`block px-4 py-2 rounded hover:bg-gray-800 ${pathname === "/admin/analytics" ? "bg-gray-800 font-semibold" : ""}`}>Analytics</span>
          </Link>
          <Link href="#" className="pointer-events-none opacity-50">
            <span className="block px-4 py-2 rounded">Users (coming soon)</span>
          </Link>
          <Link href="#" className="pointer-events-none opacity-50">
            <span className="block px-4 py-2 rounded">Settings (coming soon)</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="mt-8 px-4 py-2 bg-rose-600 rounded text-white hover:bg-rose-700">Logout</button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <span className="text-gray-600 text-sm">Welcome, Admin</span>
        </header>
        <div>{children}</div>
      </main>
    </div>
  );
}
