"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  dark: boolean;
  toggle: () => void;
};

const ThemeCtx = createContext<ThemeContextType>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme.dark') : null;
    const initial = saved === 'true';
    setDark(initial);
    const root = document.documentElement;
    if (initial) root.classList.add('dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    if (typeof window !== 'undefined') localStorage.setItem('theme.dark', String(dark));
  }, [dark]);

  function toggle() { setDark(v => !v); }

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() { return useContext(ThemeCtx); }
