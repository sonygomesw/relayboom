'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/lib/clipper-translations';
import { dashboardTranslations } from '@/lib/dashboard-translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'fr', 'es'].includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value = (dashboardTranslations[language as keyof typeof dashboardTranslations] || dashboardTranslations['en']) as Record<string, any>;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Try English as fallback
        let fallbackValue = dashboardTranslations['en'] as Record<string, any>;
        for (const fallbackKey of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }
        return fallbackValue;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 