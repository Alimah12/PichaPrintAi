"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminToken');
    } catch (e) {
      // ignore
    }
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav>
        <ul className="flex space-x-4 items-center">
          <li><Link href="/admin">Overview</Link></li>
          <li><Link href="/admin">Analytics</Link></li>
          <li><Link href="/admin/settings">Settings</Link></li>
          <li>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;