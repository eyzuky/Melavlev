import { useLang } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language selector"
      style={{
        display: 'flex',
        border: '1.5px solid var(--color-linen)',
        borderRadius: '6px',
        overflow: 'hidden',
        fontSize: '0.8rem',
        fontFamily: "'Jost', sans-serif",
        fontWeight: 700,
      }}
    >
      <button
        onClick={() => setLang('he')}
        aria-pressed={lang === 'he'}
        style={{
          padding: '0.35rem 0.75rem',
          border: 'none',
          cursor: 'pointer',
          background: lang === 'he' ? 'var(--green-forest)' : 'transparent',
          color: lang === 'he' ? 'white' : 'var(--text-secondary)',
          transition: 'background 0.2s, color 0.2s',
          letterSpacing: '0.03em',
        }}
      >
        עב
      </button>
      <div style={{ width: '1px', background: 'var(--color-linen)' }} />
      <button
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        style={{
          padding: '0.35rem 0.75rem',
          border: 'none',
          cursor: 'pointer',
          background: lang === 'en' ? 'var(--green-forest)' : 'transparent',
          color: lang === 'en' ? 'white' : 'var(--text-secondary)',
          transition: 'background 0.2s, color 0.2s',
          letterSpacing: '0.05em',
        }}
      >
        EN
      </button>
    </div>
  );
}
