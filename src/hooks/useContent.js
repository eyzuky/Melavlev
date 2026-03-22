import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

const cache = {};

export function useContent(tab) {
  const { lang } = useLang();
  const [rawContent, setRawContent] = useState(cache[tab] || null);
  const [loading, setLoading] = useState(!cache[tab]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache[tab]) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/content?tab=${tab}`)
      .then(res => { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(data => { cache[tab] = data; setRawContent(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [tab]);

  const t = (key, fallback = '') => {
    if (!rawContent || !rawContent[key]) return fallback;
    return rawContent[key][lang] || rawContent[key]['he'] || fallback;
  };

  return { t, loading, error, rawContent };
}
