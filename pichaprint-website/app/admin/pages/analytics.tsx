import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Analytics = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p>Welcome to the Analytics page. Here you can view all the data insights.</p>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Analytics;