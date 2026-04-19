import { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

export default function Gallery() {
  const { t } = useContent('gallery');
  const { lang } = useLang();
  const fadeRef = useFadeUp();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--color-parchment)', minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'גלריה' : 'Gallery')}
            title={t('page_title', lang === 'he' ? 'רגעים מהשטח' : 'Moments from the Field')}
            subtitle={t('page_subtitle', lang === 'he' ? 'אוסף תמונות ממרכזי הטבע והקהילות שאנחנו מלווים.' : 'A collection of images from the nature centers and communities we accompany.')}
            centered
          />
        </div>
      </section>

      {/* Grid */}
      <section ref={fadeRef} className="fade-up py-16" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {lang === 'he' ? 'טוען...' : 'Loading...'}
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {lang === 'he' ? 'אין עדיין פריטים בגלריה. בקרוב.' : 'No gallery items yet. Coming soon.'}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}>
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  style={{
                    border: 'none', padding: 0, cursor: 'pointer',
                    background: 'var(--surface)', borderRadius: '12px',
                    overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={item.url}
                      alt={lang === 'he' ? (item.alt_he || '') : (item.alt_en || item.alt_he || '')}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  {(item.alt_he || item.alt_en) && (
                    <div style={{ padding: '0.75rem 1rem', textAlign: lang === 'he' ? 'right' : 'left' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {lang === 'he' ? (item.alt_he || item.alt_en) : (item.alt_en || item.alt_he)}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.9)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '2rem',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox.url}
            alt={lang === 'he' ? (lightbox.alt_he || '') : (lightbox.alt_en || lightbox.alt_he || '')}
            style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
      )}
    </>
  );
}
