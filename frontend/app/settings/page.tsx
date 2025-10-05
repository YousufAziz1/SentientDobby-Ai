"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ModelSelector from '../../components/ModelSelector';

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [defaultModel, setDefaultModel] = useState<string>('openai/gpt-4o-mini');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const m = typeof window !== 'undefined' ? localStorage.getItem('settings.defaultModel') : null;
    if (m) setDefaultModel(m);
  }, []);

  function save() {
    if (typeof window !== 'undefined') localStorage.setItem('settings.defaultModel', defaultModel);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient dark:bg-hero-gradient-dark">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <div className="rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/50 backdrop-blur">
            <div className="p-6 sm:p-8 space-y-8">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 border border-brand-200/60 dark:border-brand-700/50">Settings</div>
                <h1 className="text-2xl font-bold">Your Preferences</h1>
                <p className="text-sm text-gray-500">Update your account and chat preferences.</p>
              </div>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Account</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40">
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="font-medium">{user?.name || '-'}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{user?.email || '-'}</div>
                  </div>
                </div>
                <div>
                  <button onClick={logout} className="mt-2 text-sm px-3 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white shadow-soft">Logout</button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferences</h2>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Theme</div>
                    <div className="text-sm text-gray-500">Switch between Light and Dark</div>
                  </div>
                  <button onClick={toggle} className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 text-sm">
                    {dark ? 'Disable Dark' : 'Enable Dark'}
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40">
                  <div className="font-medium mb-2">Default Model</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <ModelSelector token={token || undefined} value={defaultModel} onChange={setDefaultModel} />
                    <button onClick={save} className="sm:justify-self-start px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft">Save</button>
                  </div>
                  {saved && <div className="mt-2 text-xs text-brand-600">Saved!</div>}
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">About</h2>
                <div className="text-sm text-gray-500">SentientAGIDobby • Built by Yousuf • Multi-model chat via OpenRouter</div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
