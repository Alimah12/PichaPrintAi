"use client";

import { useState, useEffect } from 'react';
import { adminAnalytics } from '../../../src/lib/api';
import { getAdminToken } from '../../../src/lib/adminAuth';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Analytics (Users & Designs)</h1>
      <div className="mb-4 flex gap-2 items-center">
        {data && <button onClick={exportCSV} className="px-3 py-2 bg-slate-700 text-white rounded">Export CSV</button>}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading && <div className="text-gray-500 mb-4">Loading...</div>}

      {data && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">User ID</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Country</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Design ID</th>
                <th className="p-2 text-left">Design Input</th>
                <th className="p-2 text-left">Design Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                (u.designs && u.designs.length > 0) ? (
                  u.designs.map((d: any, i: number) => (
                    <tr key={`${u.id}-${d.id}`} className="border-t">
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{u.id}</td>
                      )}
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{u.username}</td>
                      )}
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{u.email}</td>
                      )}
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{(u.first_name||'') + ' ' + (u.last_name||'')}</td>
                      )}
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{u.country}</td>
                      )}
                      {i === 0 && (
                        <td className="p-2" rowSpan={u.designs.length}>{u.phone}</td>
                      )}
                      <td className="p-2">{d.id}</td>
                      <td className="p-2">{d.input_text?.slice(0,80)}</td>
                      <td className="p-2">{new Date(d.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={`u-${u.id}`} className="border-t">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{(u.first_name||'') + ' ' + (u.last_name||'')}</td>
                    <td className="p-2">{u.country}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
