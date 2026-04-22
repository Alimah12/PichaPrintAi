'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '../../src/lib/api';
import { setToken } from '../../src/lib/auth';
import { setAdminToken, checkAdminAccess } from '../../src/lib/adminAuth';

function PasswordChecks({ pw }: { pw: string }) {
  const checks = {
    length: pw.length >= 8,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };

  const row = (ok: boolean, label: string) => (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${ok ? 'bg-emerald-400' : 'bg-gray-600'}`} />
      <span className={ok ? 'text-emerald-200' : 'text-gray-400'}>{label}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {row(checks.length, 'At least 8 characters')}
      {row(checks.lower, 'Lowercase letter')}
      {row(checks.upper, 'Uppercase letter')}
      {row(checks.number, 'Number')}
      {row(checks.special, 'Special character')}
    </div>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (pw: string) => {
    return {
      length: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username) return setError('Username is required');
    if (!email) return setError('Email is required');
    const pwChecks = validatePassword(password);
    if (Object.values(pwChecks).includes(false)) return setError('Password does not meet requirements');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      console.debug('[signup] submit', { email });
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
      console.debug('[signup] signup response', data);
      const token = data.access_token;
      console.debug('[signup] storing tokens');
      setToken(token);
      setAdminToken(token);

      // Check if user is admin
      const isAdmin = await checkAdminAccess(token);
      console.debug('[signup] isAdmin result', isAdmin);
      if (isAdmin) {
        console.debug('[signup] redirecting to /admin/analytics');
        router.push('/admin/analytics');
      } else {
        console.debug('[signup] redirecting to /demo');
        router.push('/demo');
      }
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
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Choose a strong password" />
            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-gray-300 hover:text-white">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="mb-3 text-xs text-gray-300">
            <PasswordChecks pw={password} />
          </div>

          <label className="block text-sm mb-1 text-gray-200">Confirm password</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Repeat password" />
            <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-2 top-2 text-gray-300 hover:text-white">
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button disabled={loading || Object.values(validatePassword(password)).includes(false) || password !== confirmPassword} className={`px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded shadow-md transition-transform flex items-center ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}>
              {loading && (
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              )}
              Create account
            </button>
            <a href="/login" className="text-sm text-emerald-400">Sign in</a>
          </div>

          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
