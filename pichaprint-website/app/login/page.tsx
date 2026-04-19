'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      const response = await fetch('https://pichaprintai-1.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('access_token', data.access_token);
      
      // Redirect to demo
      router.push('/demo');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Sign in to PichaPrint</h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1 text-gray-300">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
            required
          />

          <label className="block text-sm mb-1 text-gray-300">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-2 text-gray-300 hover:text-white"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded shadow-md transition-transform flex items-center justify-center ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              Sign in
            </button>
            <a href="/signup" className="text-sm text-emerald-400 hover:text-emerald-200">Create account</a>
          </div>
        </form>
      </div>
    </div>
  );
}