"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../lib/api';

type AuthUser = { id: string; name?: string; email: string } | null;

type AuthCtxType = {
  user: AuthUser;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthCtxType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const api = useMemo(() => apiClient(token || undefined), [token]);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth.token') : null;
    if (t) setToken(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    let cancelled = false;
    api.get('/auth/me').then(res => { if (!cancelled) setUser(res.data); }).catch(() => setUser(null));
    return () => { cancelled = true; };
  }, [token, api]);

  async function login(email: string, password: string) {
    const res = await apiClient().post('/auth/login', { email, password });
    setToken(res.data.token);
    if (typeof window !== 'undefined') localStorage.setItem('auth.token', res.data.token);
    setUser(res.data.user);
  }

  async function registerFn(email: string, password: string, name?: string) {
    const res = await apiClient().post('/auth/register', { email, password, name });
    setToken(res.data.token);
    if (typeof window !== 'undefined') localStorage.setItem('auth.token', res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('auth.token');
  }

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, register: registerFn, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
