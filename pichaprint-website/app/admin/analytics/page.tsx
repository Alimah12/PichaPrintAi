"use client";

import { useState, useEffect } from 'react';
import { adminAnalytics } from '../../../src/lib/api';
import { getAdminToken } from '../../../src/lib/adminAuth';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    console.debug('[analytics] page mounted, checking for admin token');
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAdminToken();
        console.debug('[analytics] retrieved admin token', { present: !!token, attempt: retryCount + 1 });
        
        if (!token) {
          console.warn('[analytics] No authentication token found - this is the analytics page, token should be present');
          // If token is missing on first attempt, wait a moment and retry once (in case of race condition)
          if (retryCount < 1) {
            console.debug('[analytics] retrying token check after delay');
            setRetryCount(r => r + 1);
            setTimeout(() => {
              fetchAdminData();
            }, 500);
            return;
          }
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.debug('[analytics] calling adminAnalytics');
        const res = await adminAnalytics(token);
        console.debug('[analytics] adminAnalytics returned', Array.isArray(res) ? res.length : undefined, 'users');
        setData(res);
      } catch (err: any) {
        console.error('[analytics] fetchAdminData error', err);
        setError(err?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [retryCount]);

  const exportCSV = () => {
    if (!data) return;
    const rows: string[] = [];
    // header
    rows.push(['user_id','username','email','first_name','last_name','country','phone','design_id','design_input','design_timestamp'].join(','));
    data.forEach(u => {
      (u.designs || []).forEach((d: any) => {
        const cols = [u.id, u.username, u.email, u.first_name || '', u.last_name || '', u.country || '', u.phone || '', d.id, `"${(d.input_text||'').replace(/"/g,'""')}"`, d.timestamp];
        rows.push(cols.join(','));
      });
      if ((u.designs || []).length === 0) {
        rows.push([u.id, u.username, u.email, u.first_name || '', u.last_name || '', u.country || '', u.phone || '', '', '', ''].join(','));
      }
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p>Welcome to the Analytics page. Here you can view all the data insights.</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </main>
        <Footer />
      </div>
    </div>
  );
}
