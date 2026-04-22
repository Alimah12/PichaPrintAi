import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/admin/analytics" className="hover:underline">Analytics</a></li>
          <li><a href="/admin/settings" className="hover:underline">Settings</a></li>
          <li><a href="/admin/logout" className="hover:underline">Logout</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;