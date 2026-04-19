import { useParams, Link, Navigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import CMSImage from '../components/CMSImage';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

const SOLUTIONS = [
  {
    slug: 'local-authorities',
    he_label: 'רשויות מקומיות',
    en_label: 'Local Authorities',
    he_intro: 'הקמת מרחב קהילתי שמחזיר תושבים לחיי הקהילה',
    en_intro: 'Establishing a community space that brings residents back to community life',
  },
  {
    slug: 'welfare-directors',
    he_label: 'מנהלי רווחה',
    en_label: 'Welfare Directors',
    he_intro: 'מרחבים טיפוליים לנפגעי פוסט-טראומה וקשישים',
    en_intro: 'Therapeutic spaces for PTSD survivors and senior citizens',
  },
  {
    slug: 'educational-institutions',
    he_label: 'מוסדות חינוך',
    en_label: 'Educational Institutions',
    he_intro: 'גינות לימוד ומרכזי חינוך סביבתי לתלמידים',
    en_intro: 'Learning gardens and environmental education centers for students',
  },
  {
    slug: 'rehabilitation-communities',
    he_label: 'קהילות בשיקום',
    en_label: 'Rehabilitation Communities',
    he_intro: 'כלי מרכזי בתוכניות שיקום קהילתי מקיפות',
    en_intro: 'A central tool in comprehensive community rehabilitation programs',
  },
  {
    slug: 'gaza-envelope',
    he_label: 'יישובי עוטף',
    en_label: 'Gaza Envelope Communities',
    he_intro: 'שיקום מרחבי ציבוריים לקהילות שנפגעו',
    en_intro: 'Restoring public spaces for communities affected by trauma',
  },
  {
    slug: 'medical-wellness',
    he_label: 'מרכזי רפואה ובריאות',
    en_label: 'Medical & Wellness Centers',
    he_intro: 'גינות טיפוליות מונגשות לאוכלוסיות מיוחדות',
    en_intro: 'Accessible therapeutic gardens for special populations',
  },
];

export { SOLUTIONS };

export default function SolutionDetail() {
  const { slug } = useParams();
  const { t } = useContent('solutions');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();

  const solution = SOLUTIONS.find(s => s.slug === slug);
  if (!solution) return <Navigate to="/solutions" replace />;

  const Arrow = lang === 'he' ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Narrow full-bleed horizontal hero — edge to edge */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '32/9', width: '100%', maxHeight: '45vh', overflow: 'hidden' }}>
          <CMSImage
            imageKey={`solution_${slug.replace(/-/g, '_')}_hero`}
            alt={lang === 'he' ? solution.he_label : solution.en_label}
            aspectRatio="32/9"
          />
        </div>
      </section>

      {/* Title + intro */}
      <section ref={fadeRef1} className="fade-up py-16 md:py-20" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            to="/solutions"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--color-clay)', fontWeight: 600, fontSize: '0.9rem',
              marginBottom: '1.25rem',
            }}
          >
            <Arrow size={16} /> {lang === 'he' ? 'חזרה לפתרונות' : 'Back to Solutions'}
          </Link>
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'לרשויות ומוסדות' : 'For Authorities & Institutions')}
            title={t(`solution_${slug.replace(/-/g, '_')}_title`, lang === 'he' ? solution.he_label : solution.en_label)}
            subtitle={t(`solution_${slug.replace(/-/g, '_')}_intro`, lang === 'he' ? solution.he_intro : solution.en_intro)}
            centered
          />
        </div>
      </section>

      {/* Body text block */}
      <section className="py-12 md:py-16" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-3xl mx-auto px-6" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85 }}>
          <p style={{ marginBottom: '1.25rem' }}>
            {t(`solution_${slug.replace(/-/g, '_')}_body_p1`, lang === 'he'
              ? 'אנחנו בונים פתרונות מותאמים לצרכים הספציפיים של כל ארגון. התהליך מתחיל בהיכרות עמוקה עם המקום, הקהילה והמטרות — ומגיע לפתרון שמשקף את הזהות שלכם.'
              : 'We build solutions tailored to each organization\'s specific needs. The process begins with a deep understanding of the place, community, and goals — leading to a solution that reflects your identity.'
            )}
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            {t(`solution_${slug.replace(/-/g, '_')}_body_p2`, lang === 'he'
              ? 'הצוות שלנו מלווה אתכם משלב הייעוץ הראשוני, דרך התכנון האדריכלי, ועד לביצוע והפעלה בשטח. אחריות מלאה, ללא קבלני משנה.'
              : 'Our team accompanies you from initial consultation, through architectural planning, to execution and operation in the field. Full responsibility, no subcontractors.'
            )}
          </p>
        </div>
      </section>

      {/* Narrow mid-body full-bleed image */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '32/9', width: '100%', maxHeight: '40vh', overflow: 'hidden' }}>
          <CMSImage
            imageKey={`solution_${slug.replace(/-/g, '_')}_midbody`}
            alt={lang === 'he' ? solution.he_label : solution.en_label}
            aspectRatio="32/9"
          />
        </div>
      </section>

      {/* More body text */}
      <section className="py-12 md:py-16" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-3xl mx-auto px-6" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85 }}>
          <p>
            {t(`solution_${slug.replace(/-/g, '_')}_body_p3`, lang === 'he'
              ? 'התוצאה: מרחב חי, פעיל, שמייצר קשרים, שייכות ותקווה — ושממשיך לצמוח הרבה אחרי שהשתילים באדמה.'
              : 'The result: a living, active space that creates connections, belonging, and hope — and continues to grow long after the saplings are in the ground.'
            )}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={fadeRef2} className="fade-up" style={{ background: 'var(--color-clay)', color: 'white', padding: '4rem 1.5rem' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            {t('cta_title', lang === 'he' ? 'מוכנים להצמיח מרחב חדש?' : 'Ready to grow a new space?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', lineHeight: 1.7 }}>
            {t('cta_text', lang === 'he'
              ? 'שיחת ייעוץ ראשונית היא ללא עלות וללא התחייבות.'
              : 'An initial consultation is free and non-binding.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--color-clay)' }}>
              {lang === 'he' ? 'השאירו פרטים ונחזור אליכם' : 'Leave Your Details'}
            </Link>
            <a href="tel:054-204-0111" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 700 }}>
              <Phone size={18} /> 054-204-0111
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
