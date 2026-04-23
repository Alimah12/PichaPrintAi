"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { adminAnalytics } from '../../../src/lib/api';
import { getAdminToken } from '../../../src/lib/adminAuth';

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAdminToken();
        const res = await adminAnalytics(token || undefined);
        setUsers(res || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      return (
        String(u.id).includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        ((u.first_name || '') + ' ' + (u.last_name || '')).toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-700">Users</h2>
          <p className="text-sm text-indigo-500 mt-1">Manage and inspect registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by id, email, username, name, country or phone"
            className="px-3 py-2 border border-transparent rounded w-80 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button onClick={() => setQuery('')} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm shadow-sm">Clear</button>
        </div>
      </div>

      {loading && <div className="p-6 bg-white rounded shadow-md border border-indigo-50">Loading users...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && users && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="w-full overflow-auto">
            <table className="min-w-full text-sm text-slate-900">
              <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Username</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">First name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Last name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Country</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-800">Admin</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-800">Designs</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any) => (
                  <tr key={u.id} className="border-t hover:bg-indigo-50 odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 text-slate-700">{u.id}</td>
                    <td className="px-4 py-3 text-slate-700">{u.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{u.username || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{u.first_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{u.last_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{u.country || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{u.phone || '-'}</td>
                    <td className="px-4 py-3">
                      {u.is_admin || u.isAdmin || u.admin || u.role === 'admin' ? (
                        <span className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full font-medium">Yes</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{(u.designs || []).length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-white border-t border-gray-100 text-xs text-indigo-600">Showing {filtered.length} of {users.length} users</div>
        </div>
      )}
    </section>
  );
}
