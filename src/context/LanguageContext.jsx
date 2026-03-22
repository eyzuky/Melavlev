import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const getInitialLang = () => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'he') return urlLang;
    return localStorage.getItem('melavlev_lang') || 'he';
  };

  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang === 'he' ? 'he' : 'en');
    localStorage.setItem('melavlev_lang', lang);

    const url = new URL(window.location);
    if (lang === 'he') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'he' ? 'en' : 'he');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL: lang === 'he' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
