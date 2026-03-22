import { Phone, Mail, Instagram, Leaf } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ContactForm from '../components/ContactForm';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

export default function Contact() {
  const { t } = useContent('contact');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();

  const whyUs = [
    { key: 'sidebar_why_1', he: 'אנחנו לא קבלן — אנחנו שותפים לחזון שלכם', en: "We're not a contractor — we're your partners in vision" },
    { key: 'sidebar_why_2', he: 'מנסיון מוכח בעוטף עזה ובמדבר', en: 'Proven experience in the Gaza Envelope and the Negev' },
    { key: 'sidebar_why_3', he: 'תהליך שכולו בנוי סביב הקהילה שלכם', en: 'A process built entirely around your community' },
  ];

  return (
    <>
      {/* Page Hero */}
      <section style={{ background: 'var(--color-parchment)', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'צרו קשר' : 'Contact')}
            title={t('page_title', lang === 'he' ? 'בואו נתחיל להצמיח משהו ביחד' : "Let's Start Growing Something Together")}
            subtitle={t('page_subtitle', lang === 'he'
              ? 'שיחת ייעוץ ראשונית היא ללא עלות וללא התחייבות. נגיע אליכם, נקשיב, ונבין יחד מה נכון לכם.'
              : "An initial consultation is free and non-binding. We'll come to you, listen, and understand what's right for you."
            )}
            centered
          />
        </div>
      </section>

      {/* Contact Layout */}
      <section ref={fadeRef1} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Form */}
            <div className="md:w-3/5">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="md:w-2/5">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                {t('sidebar_title', lang === 'he' ? 'דרכים נוספות לדבר איתנו' : 'Other Ways to Reach Us')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <a href="tel:054-204-0111" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-earth)' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--color-parchment)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone size={18} color="var(--color-clay)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>054-204-0111</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {lang === 'he' ? 'לחצו לחיוג' : 'Click to call'}
                    </div>
                  </div>
                </a>

                <a href="mailto:wearemelavlev@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-earth)' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--color-parchment)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Mail size={18} color="var(--color-clay)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>wearemelavlev@gmail.com</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {lang === 'he' ? 'שלחו מייל' : 'Send email'}
                    </div>
                  </div>
                </a>

                <a href="https://www.instagram.com/melavlev_community" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-earth)' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--color-parchment)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Instagram size={18} color="var(--color-clay)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>@melavlev_community</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {lang === 'he' ? 'אינסטגרם' : 'Instagram'}
                    </div>
                  </div>
                </a>
              </div>

              {/* Why Us */}
              <div style={{ background: 'var(--color-parchment)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  {t('sidebar_why_title', lang === 'he' ? 'למה מלבלב?' : 'Why Melavlev?')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {whyUs.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Leaf size={16} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {t(w.key, lang === 'he' ? w.he : w.en)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
