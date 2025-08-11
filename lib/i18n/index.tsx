'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Ctx = { locale: 'ar' | 'en'; setLocale: (l: 'ar' | 'en') => void; dir: 'rtl' | 'ltr'; setDir: (d: 'rtl' | 'ltr') => void };
const C = createContext<Ctx>({ locale: 'ar', setLocale: () => {}, dir: 'rtl', setDir: () => {} });
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'ar' | 'en'>((localStorage.getItem('locale') as any) || 'ar');
  const [dir, setDir] = useState<'rtl' | 'ltr'>((localStorage.getItem('dir') as any) || 'rtl');
  useEffect(() => { localStorage.setItem('locale', locale); document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { localStorage.setItem('dir', dir); document.documentElement.dir = dir; }, [dir]);
  return <C.Provider value={{ locale, setLocale, dir, setDir }}>{children}</C.Provider>;
}
export const useI18n = () => useContext(C);
