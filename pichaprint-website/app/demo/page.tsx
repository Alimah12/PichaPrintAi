'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratorInterface } from '../../src/components/GeneratorInterface';
import { getToken, clearToken } from '../../src/lib/auth';
import { me, listDesigns } from '../../src/lib/api';

export default function DemoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return router.push('/login');

    let mounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const u = await me(token!);
        if (!mounted) return;
        setUser(u);
        const ds = await listDesigns(token!);
        if (!mounted) return;
        setDesigns(ds || []);
      } catch (err: any) {
        console.error('Failed to fetch user/designs', err);
        setError('Failed to load account data');
        // If auth failed, send to login
        clearToken();
        router.push('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="col-span-1 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Account</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : user ? (
            <div className="text-sm">
              <div className="mb-2"><strong>{user.username}</strong></div>
              <div className="text-gray-600 text-xs">{user.email}</div>
              {user.first_name && <div className="text-gray-600 text-xs">{user.first_name} {user.last_name}</div>}
              {user.country && <div className="text-gray-600 text-xs">{user.country}</div>}
              {user.phone && <div className="text-gray-600 text-xs">{user.phone}</div>}
              <div className="mt-4">
                <button onClick={handleLogout} className="px-3 py-1 bg-rose-500 text-white rounded">Logout</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not signed in</div>
          )}

          <div className="mt-6">
            <h4 className="font-medium mb-2">Your designs</h4>
            {loading ? (
              <div className="text-sm text-gray-500">Loading designs...</div>
            ) : designs.length === 0 ? (
              <div className="text-sm text-gray-500">No saved designs yet.</div>
            ) : (
              <ul className="space-y-2 text-sm">
                {designs.map((d) => (
                  <li key={d.id} className="p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100" onClick={() => setSelectedDesign(d)}>
                    <div className="font-medium">{d.input_text?.slice(0, 80) || 'Design'}</div>
                    <div className="text-xs text-gray-400">{new Date(d.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="col-span-1 lg:col-span-3">
          <GeneratorInterface initialShowGenerator={true} externalDesign={selectedDesign} />
        </main>
      </div>
    </div>
  );
}
