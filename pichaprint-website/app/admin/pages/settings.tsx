import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <p>Configure your settings here.</p>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;