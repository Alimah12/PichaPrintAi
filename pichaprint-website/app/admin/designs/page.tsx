"use client";

import React, { useEffect, useState } from 'react';
import { adminAnalytics } from '../../../src/lib/api';
import { getAdminToken } from '../../../src/lib/adminAuth';

export default function DesignsPage() {
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAdminToken();
        const users = await adminAnalytics(token || undefined);
        const allDesigns: any[] = [];
        (users || []).forEach((u: any) => {
          (u.designs || []).forEach((d: any) => {
            allDesigns.push({ ...d, user: { id: u.id, username: u.username, email: u.email } });
          });
        });
        setDesigns(allDesigns);
      } catch (err: any) {
        setError(err?.message || 'Failed to load designs');
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Designs</h2>
      {loading && <p>Loading designs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && designs && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Design ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Input</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((d: any) => (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{d.id}</td>
                  <td className="px-4 py-2 text-sm">{d.user?.username} ({d.user?.email})</td>
                  <td className="px-4 py-2 text-sm">{d.input_text || d.prompt || '-'}</td>
                  <td className="px-4 py-2 text-sm">{d.timestamp || d.created_at || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
