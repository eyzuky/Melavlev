import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeafAccent from './LeafAccent';
import LanguageSwitcher from './LanguageSwitcher';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/', key: 'nav_home', he: 'בית', en: 'Home' },
  { path: '/model', key: 'nav_model', he: 'המודל שלנו', en: 'Our Model' },
  { path: '/solutions', key: 'nav_solutions', he: 'פתרונות', en: 'Solutions' },
  { path: '/impact', key: 'nav_impact', he: 'אימפקט', en: 'Impact' },
  { path: '/contact', key: 'nav_contact', he: 'צור קשר', en: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useContent('nav');
  const { lang } = useLang();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'var(--color-cream)' : 'transparent',
      boxShadow: scrolled ? '0 2px 20px rgba(30,51,40,0.08)' : 'none',
      transition: 'background 0.3s, box-shadow 0.3s',
    }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <LeafAccent size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--color-clay)' }}>
            מלבלב
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 500,
                color: location.pathname === link.path ? 'var(--green-forest)' : 'var(--color-earth)',
                borderBottom: location.pathname === link.path ? '2px solid var(--green-sage)' : '2px solid transparent',
                paddingBottom: '0.25rem',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {t(link.key, lang === 'he' ? link.he : link.en)}
            </Link>
          ))}
        </div>

        {/* Desktop Right Cluster */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/contact" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            {t('nav_cta', lang === 'he' ? 'הקימו מרכז' : 'Partner With Us')}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} color="var(--color-earth)" /> : <Menu size={24} color="var(--color-earth)" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: '72px',
          background: 'var(--color-cream)',
          zIndex: 49,
          display: 'flex', flexDirection: 'column',
          padding: '2rem',
          gap: '1.5rem',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: '1.25rem',
                color: location.pathname === link.path ? 'var(--green-forest)' : 'var(--color-earth)',
              }}
            >
              {t(link.key, lang === 'he' ? link.he : link.en)}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <LanguageSwitcher />
          </div>
          <Link to="/contact" className="btn-primary" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            {t('nav_cta', lang === 'he' ? 'הקימו מרכז' : 'Partner With Us')}
          </Link>
        </div>
      )}
    </nav>
  );
}
