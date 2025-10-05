import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-hero-gradient dark:bg-hero-gradient-dark">
      <div className="max-w-3xl w-full">
        <div className="rounded-2xl shadow-card bg-white/70 dark:bg-gray-900/60 backdrop-blur p-8 border border-gray-100 dark:border-gray-800 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 border border-brand-200/60 dark:border-brand-700/50">AI Chat Platform</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-500 via-accent-500 to-brand-700 text-transparent bg-clip-text">
            SentientAGIDobby
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Professional multi-model AI chat powered by SentientAGI. Clean UI, dark mode, and chat history.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition">Login</Link>
            <Link href="/register" className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Register</Link>
          </div>
          <div className="pt-1 text-sm text-gray-500">Built by Yousuf • @SentientAGI</div>
        </div>
      </div>
    </main>
  );
}
