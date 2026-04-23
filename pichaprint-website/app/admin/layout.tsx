"use client";

import React from 'react';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
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
