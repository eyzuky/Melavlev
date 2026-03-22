import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

let projectsCache = null;

export function useProjects() {
  const { lang } = useLang();
  const [data, setData] = useState(projectsCache);
  const [loading, setLoading] = useState(!projectsCache);

  useEffect(() => {
    if (projectsCache) { setLoading(false); return; }
    setLoading(true);
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => { projectsCache = d.projects || []; setData(projectsCache); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const projects = (data || []).map(p => ({
    id: p.id,
    title: lang === 'he' ? p.title_he : p.title_en,
    description: lang === 'he' ? p.description_he : p.description_en,
    results: (lang === 'he' ? p.results_he : p.results_en || '').split('|').filter(Boolean),
    tags: (p.tags || []).map(t => ({
      label: lang === 'he' ? t.label_he : t.label_en,
      color: t.color,
    })),
    images: p.images || [],
    imageUrl: p.images?.[0]?.url || null,
    imageAlt: lang === 'he' ? p.images?.[0]?.alt_he : p.images?.[0]?.alt_en,
    is_featured: p.is_featured,
    sort_order: p.sort_order,
  }));

  const featured = projects.find(p => p.is_featured) || projects[0] || null;

  return { projects, featured, loading };
}
