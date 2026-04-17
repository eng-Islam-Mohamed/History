'use client';

import { createContext, useContext, useEffect } from 'react';
import { Dictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

type LocaleContextValue = {
  dictionary: Dictionary;
  dir: 'ltr' | 'rtl';
  locale: Locale;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
  dictionary: Dictionary;
  dir: 'ltr' | 'rtl';
  locale: Locale;
}

export function LocaleProvider({
  children,
  dictionary,
  dir,
  locale,
}: LocaleProviderProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return (
    <LocaleContext.Provider value={{ dictionary, dir, locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useI18n must be used within LocaleProvider');
  }

  return context;
}
