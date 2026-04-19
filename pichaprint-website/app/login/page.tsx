'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../src/lib/api';
import { setToken } from '../../src/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.access_token);
      router.push('/demo');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Sign in</h2>
        <label className="block mb-2 text-sm">Email</label>
        <input className="w-full mb-3 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2 text-sm">Password</label>
        <div className="relative mb-4">
          <input type={showPassword ? 'text' : 'password'} className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-gray-600">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-between items-center">
          <button disabled={loading} className={`px-4 py-2 bg-emerald-600 text-white rounded flex items-center ${loading ? 'opacity-70 cursor-wait' : 'hover:brightness-105'}`}>
            {loading && (
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            )}
            Sign in
          </button>
          <a href="/signup" className="text-sm text-emerald-600">Create account</a>
        </div>
      </form>
    </div>
  );
}
