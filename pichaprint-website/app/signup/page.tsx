'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '../../src/lib/api';
import { setToken } from '../../src/lib/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await signup(email, password);
      setToken(data.access_token);
      router.push('/demo');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Create account</h2>
        <label className="block mb-2 text-sm">Email</label>
        <input className="w-full mb-3 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" className="w-full mb-4 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded">Create</button>
          <a href="/login" className="text-sm text-emerald-600">Sign in</a>
        </div>
      </form>
    </div>
  );
}
