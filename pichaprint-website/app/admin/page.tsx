"use client";

import React, { useEffect, useState } from 'react';
import { adminAnalytics } from '../../src/lib/api';
import { getAdminToken } from '../../src/lib/adminAuth';

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; color?: string }> = ({ title, value, subtitle, color = 'from-blue-500 to-indigo-500' }) => (
  <div className="rounded-lg shadow overflow-hidden">
    <div className={`p-4 bg-gradient-to-r ${color} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <svg className="w-10 h-10 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
        </svg>
      </div>
    </div>
    {subtitle && <div className="p-3 text-xs text-gray-500 bg-white">{subtitle}</div>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAdminToken();
        if (!token) {
          setError('No authentication token found');
          return;
        }
        const res = await adminAnalytics(token);
        setData(res);
      } catch (err: any) {
        setError(err?.message || 'Failed to load overview');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const totalUsers = data?.length ?? 0;
  const totalDesigns = (data || []).reduce((acc: number, u: any) => acc + ((u.designs && u.designs.length) || 0), 0);
  const recentUsers = (data || []).slice(0, 5);
  const recentDesigns = (data || []).flatMap(u => (u.designs || []).map((d: any) => ({ ...d, user: { id: u.id, username: u.username } }))).slice(0, 8);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">High-level performance and recent activity</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded shadow-sm text-sm">Refresh</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded shadow-sm text-sm">Create report</button>
        </div>
      </div>

      {loading && <div className="p-6 bg-white rounded shadow">Loading overview...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Users" value={totalUsers} subtitle="All registered users" color="from-green-400 to-emerald-600" />
            <StatCard title="Total Designs" value={totalDesigns} subtitle="Designs created by users" color="from-blue-400 to-indigo-600" />
            <StatCard title="Active This Month" value={`${Math.round((totalUsers || 0) * 0.72)}`} subtitle="Approximate active users" color="from-rose-400 to-rose-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Designs</h3>
                <div className="text-sm text-gray-500">Latest activity from users</div>
              </div>
              {recentDesigns.length === 0 ? (
                <div className="text-sm text-gray-400 p-8">No designs yet.</div>
              ) : (
                <div className="space-y-3">
                  {recentDesigns.map(d => (
                    <div key={d.id || Math.random()} className="flex items-start gap-3 p-3 border rounded">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-semibold">D</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{d.input_text ? (d.input_text.length > 80 ? d.input_text.slice(0, 80) + '…' : d.input_text) : d.prompt || '—'}</div>
                        <div className="text-xs text-gray-500 mt-1">By {d.user?.username || 'unknown'} • {formatDate(d.timestamp || d.created_at)}</div>
                      </div>
                      <div className="text-xs text-gray-400">ID: {d.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Recent Users</h3>
              {recentUsers.length === 0 ? (
                <div className="text-sm text-gray-400">No users yet.</div>
              ) : (
                <ul className="space-y-3">
                  {recentUsers.map(u => (
                    <li key={u.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{u.username || u.email || 'User'}</div>
                        <div className="text-xs text-gray-500">{u.email || '—'}</div>
                      </div>
                      <div className="text-xs text-gray-400">{(u.designs || []).length} designs</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <a className="text-sm text-indigo-600 hover:underline" href="/admin/users">View all users</a>
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboard;