'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '../../src/lib/api';
import { setToken } from '../../src/lib/auth';

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw: string) => pw.length >= 8;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username) return setError('Username is required');
    if (!email) return setError('Email is required');
    if (!validatePassword(password)) return setError('Password must be >= 8 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      const payload = {
        username,
        first_name: firstName || null,
        last_name: lastName || null,
        email,
        country: country || null,
        phone: phone || null,
        password
      };

      const data = await signup(payload as any);
      setToken(data.access_token);
      router.push('/demo');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Create your PichaPrint account</h2>

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1 text-gray-200">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="username" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-200">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="country" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-200">First name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="First" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-200">Last name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Last" />
            </div>
          </div>

          <label className="block text-sm mb-1 text-gray-200">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@example.com" />

          <label className="block text-sm mb-1 text-gray-200">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="+254700000000" />

          <label className="block text-sm mb-1 text-gray-200">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Choose a strong password" />

          <label className="block text-sm mb-1 text-gray-200">Confirm password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Repeat password" />

          <div className="flex items-center justify-between">
            <button disabled={loading} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded shadow-md hover:scale-[1.02] transition-transform">Create account</button>
            <a href="/login" className="text-sm text-emerald-400">Sign in</a>
          </div>

          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
