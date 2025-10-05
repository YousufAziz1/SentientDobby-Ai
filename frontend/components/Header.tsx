"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const demo = String(process.env.NEXT_PUBLIC_DEMO_MODE || '').toLowerCase() === 'true';

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur bg-white/70 dark:bg-gray-950/60 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">SentientAGIDobby</Link>
          {demo && (
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-brand-300 text-brand-700 bg-brand-50/70">Demo Mode</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-400 text-sm transition">
            {dark ? 'Light' : 'Dark'} Mode
          </button>
          {user ? (
            <>
              <Link href="/settings" className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-400 text-sm transition">Settings</Link>
              <button onClick={logout} className="text-sm px-3 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white shadow-soft transition">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm shadow-soft transition">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
