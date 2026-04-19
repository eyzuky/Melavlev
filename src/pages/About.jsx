import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import CMSImage from '../components/CMSImage';
import LeafAccent from '../components/LeafAccent';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';
import { Phone } from 'lucide-react';

export default function About() {
  const { t } = useContent('about');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();

  return (
    <>
      {/* Top hero image */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '21/9', width: '100%', maxHeight: '60vh', overflow: 'hidden' }}>
          <CMSImage
            imageKey="about_hero"
            alt={lang === 'he' ? 'תמונת גיבור - מי אנחנו' : 'About us hero image'}
            aspectRatio="21/9"
          />
        </div>
      </section>

      {/* Intro */}
      <section ref={fadeRef1} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'מי אנחנו' : 'About Us')}
            title={t('page_title', lang === 'he' ? 'הסיפור שלנו' : 'Our Story')}
            centered
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {t('about_p1', lang === 'he'
              ? 'מלבלב הוא ארגון חברתי שמקים מרכזי טבע קהילתיים ברחבי ישראל. אנחנו מאמינים שחיבור לטבע, לאדמה ולקהילה הוא מרכיב חיוני לחוסן אישי וקולקטיבי.'
              : 'Melavlev is a social organization that establishes community nature centers across Israel. We believe that connection to nature, the land, and the community is a vital component of personal and collective resilience.'
            )}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {t('about_p2', lang === 'he'
              ? 'הצוות שלנו כולל אדריכלים, מתכננים, מנחי קבוצות ואנשי חינוך סביבתי, שכולם חולקים חזון אחד: ליצור מרחבים שמצמיחים קשרים.'
              : 'Our team includes architects, planners, group facilitators, and environmental educators — all sharing one vision: to create spaces that grow connections.'
            )}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            {t('about_p3', lang === 'he'
              ? 'כל פרויקט מתחיל בהקשבה לקהילה, נמשך בהקמה משותפת, וממשיך בליווי ארוך-טווח. אנחנו לא עוזבים כשהשתילים באדמה.'
              : 'Every project starts by listening to the community, continues through joint construction, and is followed by long-term support. We don\'t leave when the saplings are in the ground.'
            )}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={fadeRef2} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-parchment)' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LeafAccent size={64} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            {t('cta_title', lang === 'he' ? 'רוצים להכיר אותנו?' : 'Want to get to know us?')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            {t('cta_text', lang === 'he'
              ? 'נשמח לשיחה — כדי להבין איך הטבע והקהילה יכולים לצמוח אצלכם.'
              : 'We\'d love to chat — to understand how nature and community can grow in your area.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">
              {lang === 'he' ? 'צור קשר' : 'Contact Us'}
            </Link>
            <a href="tel:054-204-0111" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-clay)', fontWeight: 700 }}>
              <Phone size={18} /> 054-204-0111
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
