import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { Instagram, Facebook, Linkedin, Phone, Mail } from 'lucide-react';
import logoImage from '../assets/melavlev-logo.png';

export default function Footer() {
  const { t: tNav } = useContent('nav');
  const { t } = useContent('site');
  const { lang } = useLang();

  const footerLinks = [
    { path: '/', key: 'nav_home', he: 'בית', en: 'Home' },
    { path: '/about', key: 'nav_about', he: 'מי אנחנו', en: 'About Us' },
    { path: '/model', key: 'nav_model', he: 'המודל שלנו', en: 'Our Model' },
    { path: '/solutions', key: 'nav_solutions', he: 'פתרונות', en: 'Solutions' },
    { path: '/projects', key: 'nav_projects', he: 'פרויקטים', en: 'Projects' },
    { path: '/gallery', key: 'nav_gallery', he: 'גלריה', en: 'Gallery' },
    { path: '/contact', key: 'nav_contact', he: 'צור קשר', en: 'Contact Us' },
  ];

  return (
    <footer style={{ background: 'var(--color-earth)', color: '#E5DBCA' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1: Logo + tagline + social */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', marginBottom: '1rem',
              background: 'var(--white-pure)', borderRadius: '12px',
              padding: '0.75rem 1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}>
              <img
                src={logoImage}
                alt={lang === 'he' ? 'מלבלב' : 'Melavlev'}
                style={{ height: '72px', width: 'auto', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.7 }}>
              {t('footer_tagline', lang === 'he' ? 'מצמיחים קשרים, מחזירים קהילות לחיים.' : 'Growing connections, restoring communities to life.')}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.instagram.com/melavlev_community" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} color="#E5DBCA" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook size={20} color="#E5DBCA" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} color="#E5DBCA" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
              {lang === 'he' ? 'ניווט מהיר' : 'Quick Links'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerLinks.map(link => (
                <Link key={link.path} to={link.path} style={{ color: '#E5DBCA', opacity: 0.8, transition: 'opacity 0.2s', fontSize: '0.95rem' }}>
                  {tNav(link.key, lang === 'he' ? link.he : link.en)}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Contact info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
              {lang === 'he' ? 'צור קשר' : 'Contact'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="tel:054-204-0111" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5DBCA', opacity: 0.8 }}>
                <Phone size={16} /> {t('site_phone', '054-204-0111')}
              </a>
              <a href="mailto:wearemelavlev@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5DBCA', opacity: 0.8 }}>
                <Mail size={16} /> {t('site_email', 'wearemelavlev@gmail.com')}
              </a>
              <a href="https://www.instagram.com/melavlev_community" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5DBCA', opacity: 0.8 }}>
                <Instagram size={16} /> @melavlev_community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(229,219,202,0.2)', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.6 }}>
          © 2024 מלבלב — {lang === 'he' ? 'כל הזכויות שמורות' : 'All rights reserved'}
        </div>
      </div>
    </footer>
  );
}
