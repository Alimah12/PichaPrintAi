import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <ul className="space-y-4">
        <li><Link href="/admin/analytics"><a className="hover:underline">Analytics</a></Link></li>
        <li><Link href="/admin/users"><a className="hover:underline">Users</a></Link></li>
        <li><Link href="/admin/settings"><a className="hover:underline">Settings</a></Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;