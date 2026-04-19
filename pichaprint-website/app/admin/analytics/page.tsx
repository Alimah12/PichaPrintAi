"use client";

import { useState, useEffect } from 'react';
import { adminAnalytics } from '../../../src/lib/api';

export default function AnalyticsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const autoFetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminAnalytics('PichaAdmin', 'PichaAdmin@123');
        setData(res);
      } catch (err: any) {
        setError(err?.message || 'Failed to auto-load admin data');
      } finally {
        setLoading(false);
      }
    };

    autoFetchAdminData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAnalytics(adminKey);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mb-4 flex gap-2">
        <input value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="Enter admin key" className="p-2 border rounded w-96" />
        <button onClick={fetchData} disabled={loading || !adminKey} className="px-3 py-2 bg-emerald-600 text-white rounded">{loading ? 'Loading...' : 'Load'}</button>
        {data && <button onClick={exportCSV} className="px-3 py-2 bg-slate-700 text-white rounded">Export CSV</button>}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

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
