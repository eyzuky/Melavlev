import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import logoImage from '../assets/melavlev-logo.png';

const navLinks = [
  { path: '/', key: 'nav_home', he: 'בית', en: 'Home' },
  { path: '/about', key: 'nav_about', he: 'מי אנחנו', en: 'About Us' },
  { path: '/model', key: 'nav_model', he: 'המודל שלנו', en: 'Our Model' },
  { path: '/solutions', key: 'nav_solutions', he: 'פתרונות', en: 'Solutions' },
  { path: '/projects', key: 'nav_projects', he: 'פרויקטים', en: 'Projects' },
  { path: '/gallery', key: 'nav_gallery', he: 'גלריה', en: 'Gallery' },
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

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--color-cream)',
      boxShadow: scrolled ? '0 2px 20px rgba(30,51,40,0.08)' : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      <div
        className="max-w-6xl mx-auto px-6"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: '88px',
          gap: '1.5rem',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            justifySelf: 'start',
          }}
        >
          <img
            src={logoImage}
            alt={lang === 'he' ? 'מלבלב' : 'Melavlev'}
            style={{ height: '64px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Desktop Nav — centered */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: '1.75rem', justifyContent: 'center' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '1rem',
                color: isActive(link.path) ? 'var(--green-forest)' : 'var(--color-earth)',
                borderBottom: isActive(link.path) ? '2px solid var(--green-sage)' : '2px solid transparent',
                paddingBottom: '0.25rem',
                transition: 'color 0.2s, border-color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t(link.key, lang === 'he' ? link.he : link.en)}
            </Link>
          ))}
        </div>

        {/* Desktop Right Cluster */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: '1rem', justifySelf: 'end' }}
        >
          <LanguageSwitcher />
          <Link to="/contact" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            {t('nav_cta', lang === 'he' ? 'הקימו מרכז' : 'Partner With Us')}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
            justifySelf: 'end', gridColumn: '3 / 4',
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} color="var(--color-earth)" /> : <Menu size={24} color="var(--color-earth)" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: '88px',
          background: 'var(--color-cream)',
          zIndex: 49,
          display: 'flex', flexDirection: 'column',
          padding: '2rem',
          gap: '1.5rem',
          overflowY: 'auto',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.25rem',
                color: isActive(link.path) ? 'var(--green-forest)' : 'var(--color-earth)',
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
