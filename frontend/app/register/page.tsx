"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient dark:bg-hero-gradient-dark">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-2xl shadow-card bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-gray-100 dark:border-gray-800 p-8">
          <div className="space-y-1 text-center">
            <div className="text-xs font-medium inline-flex px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 border border-brand-200/60 dark:border-brand-700/50">Create account</div>
            <h1 className="text-2xl font-bold">Register</h1>
            <p className="text-sm text-gray-500">Start chatting with SentientAGIDobby</p>
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-2">{error}</div>}
          <div className="space-y-3">
            <input className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full p-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition">{loading ? 'Creating account...' : 'Register'}</button>
          <div className="text-sm text-gray-500 text-center">Have an account? <a className="underline" href="/login">Login</a></div>
        </form>
      </main>
    </div>
  );
}
