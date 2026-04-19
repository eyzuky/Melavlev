import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, HeartPulse, GraduationCap, Users, Home, Leaf, ChevronDown, Phone } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-linen)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 0', border: 'none', background: 'none', cursor: 'pointer',
          fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '1.05rem',
          color: 'var(--color-earth)', textAlign: 'start',
        }}
      >
        <span>{title}</span>
        <ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      <div style={{
        maxHeight: open ? '300px' : '0', overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{ paddingBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Solutions() {
  const { t } = useContent('solutions');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();
  const fadeRef4 = useFadeUp();
  const fadeRef5 = useFadeUp();

  const audiences = [
    { icon: <Building2 size={28} />, key: 'audience_1', slug: 'local-authorities', he_label: 'רשויות מקומיות', en_label: 'Local Authorities', he_text: 'הקמת מרחב קהילתי שמחזיר תושבים לחיי הקהילה', en_text: 'Establishing a community space that brings residents back to community life' },
    { icon: <HeartPulse size={28} />, key: 'audience_2', slug: 'welfare-directors', he_label: 'מנהלי רווחה', en_label: 'Welfare Directors', he_text: 'מרחבים טיפוליים לנפגעי פוסט-טראומה וקשישים', en_text: 'Therapeutic spaces for PTSD survivors and senior citizens' },
    { icon: <GraduationCap size={28} />, key: 'audience_3', slug: 'educational-institutions', he_label: 'מוסדות חינוך', en_label: 'Educational Institutions', he_text: 'גינות לימוד ומרכזי חינוך סביבתי לתלמידים', en_text: 'Learning gardens and environmental education centers for students' },
    { icon: <Users size={28} />, key: 'audience_4', slug: 'rehabilitation-communities', he_label: 'קהילות בשיקום', en_label: 'Rehabilitation Communities', he_text: 'כלי מרכזי בתוכניות שיקום קהילתי מקיפות', en_text: 'A central tool in comprehensive community rehabilitation programs' },
    { icon: <Home size={28} />, key: 'audience_5', slug: 'gaza-envelope', he_label: 'יישובי עוטף', en_label: 'Gaza Envelope Communities', he_text: 'שיקום מרחבי ציבוריים לקהילות שנפגעו', en_text: 'Restoring public spaces for communities affected by trauma' },
    { icon: <Leaf size={28} />, key: 'audience_6', slug: 'medical-wellness', he_label: 'מרכזי רפואה ובריאות', en_label: 'Medical & Wellness Centers', he_text: 'גינות טיפוליות מונגשות לאוכלוסיות מיוחדות', en_text: 'Accessible therapeutic gardens for special populations' },
  ];

  const services = [
    { key: 'service_1', he_title: 'ייעוץ ראשוני ומיפוי צרכים — ללא עלות', en_title: 'Initial Consultation & Needs Assessment — Free', he_text: 'מגיעים אליכם לפגישת היכרות, מבינים את הצרכים, ומציגים הצעת גישה ראשונית מותאמת.', en_text: 'We come to you for an introductory meeting, understand your needs, and present an initial tailored approach.' },
    { key: 'service_2', he_title: 'תכנון אדריכלי ונופי', en_title: 'Architectural & Landscape Design', he_text: 'סטודיו התכנון הפנימי שלנו מפתח תוכנית מפורטת — כולל הדמיות, רשימת חומרים, ולוח זמנים.', en_text: 'Our in-house design studio develops a detailed plan — including renderings, materials list, and timeline.' },
    { key: 'service_3', he_title: 'ימי הקמה קהילתיים', en_title: 'Community Build Days', he_text: 'ניהול מלא של ימי הבנייה. אנחנו מביאים ציוד, חומרים, ומנחים מקצועיים לסדנאות.', en_text: 'Full management of construction days. We bring equipment, materials, and professional workshop facilitators.' },
    { key: 'service_4', he_title: 'הכשרת מובילי טבע מקומיים', en_title: 'Training Local Nature Leaders', he_text: 'הכשרה של 4–6 תושבים שינהלו את המרכז לאחר ההקמה — כולל ידע גינון, הפעלת קבוצות ותחזוקה.', en_text: 'Training 4–6 residents who will manage the center after establishment — including gardening knowledge, group facilitation, and maintenance.' },
    { key: 'service_5', he_title: 'ליווי שוטף בשנה הראשונה', en_title: 'Ongoing Support in Year One', he_text: 'ביקורי מעקב, תמיכה טלפונית ומרחוק, ועדכוני תוכן לפעילות השוטפת.', en_text: 'Follow-up visits, phone and remote support, and content updates for ongoing programming.' },
  ];

  const timelineSteps = [
    { emoji: '📞', he: 'שיחת ייעוץ\nראשונית', en: 'Initial\nConsultation' },
    { emoji: '📋', he: 'הצעת תוכנית\nמותאמת', en: 'Tailored\nProposal' },
    { emoji: '🔨', he: 'ימי הקמה\nקהילתיים', en: 'Community\nBuild Days' },
    { emoji: '🌱', he: 'הפעלה שוטפת\nוליווי', en: 'Ongoing\nActivation' },
  ];

  return (
    <>
      {/* Page Hero */}
      <section style={{ background: 'var(--color-parchment)', minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'לרשויות ומוסדות' : 'For Authorities & Institutions')}
            title={t('page_title', lang === 'he' ? 'שותפות מקצועית להקמת מרחבי טבע' : 'A Professional Partnership for Establishing Nature Spaces')}
            subtitle={t('page_subtitle', lang === 'he' ? 'אנחנו מלווים אתכם מהשלב התכנוני ועד לשגרה הפעילה במרכז.' : 'We accompany you from the initial planning stage through to the active daily routine of the center.')}
            centered
          />
        </div>
      </section>

      {/* Who Is This For */}
      <section ref={fadeRef1} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-parchment)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title={lang === 'he' ? 'למי מתאים המודל שלנו?' : 'Who Is Our Model For?'}
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <Link
                key={i}
                to={`/solutions/${a.slug}`}
                className="card"
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  textDecoration: 'none', color: 'inherit', cursor: 'pointer',
                }}
              >
                <div style={{ color: 'var(--color-sage)', flexShrink: 0, marginTop: '0.25rem' }}>
                  {a.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                    {t(`${a.key}_label`, lang === 'he' ? a.he_label : a.en_label)}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {t(`${a.key}_text`, lang === 'he' ? a.he_text : a.en_text)}
                  </p>
                  <span style={{ color: 'var(--color-clay)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {lang === 'he' ? 'קראו עוד ←' : 'Read more →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section ref={fadeRef2} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionTitle
            title={lang === 'he' ? 'מה כולל הליווי שלנו?' : 'What Does Our Support Include?'}
            centered
          />
          <div>
            {services.map((s, i) => (
              <AccordionItem key={i} title={t(`${s.key}_title`, lang === 'he' ? s.he_title : s.en_title)}>
                {t(`${s.key}_text`, lang === 'he' ? s.he_text : s.en_text)}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section ref={fadeRef3} className="fade-up py-12" style={{ background: 'var(--color-parchment)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <SectionTitle
            title={lang === 'he' ? 'כבר עובדים איתנו' : 'Already Working With Us'}
            centered
          />
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: '2rem', flexWrap: 'wrap',
            fontFamily: "var(--font-body)", fontWeight: 500, fontSize: '1.1rem',
            color: 'var(--text-secondary)',
          }}>
            {/* LOGO: יישוב סופה */}
            <span>{lang === 'he' ? 'יישוב סופה' : 'Sufa'}</span>
            <span style={{ color: 'var(--color-linen)' }}>|</span>
            {/* LOGO: עין השלושה */}
            <span>{lang === 'he' ? 'עין השלושה' : 'Ein HaShlosha'}</span>
            <span style={{ color: 'var(--color-linen)' }}>|</span>
            {/* LOGO: כפר סטודנטים דימונה */}
            <span>{lang === 'he' ? 'כפר סטודנטים דימונה' : 'Student Village Dimona'}</span>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section ref={fadeRef4} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title={lang === 'he' ? 'איך עובד התהליך?' : 'How Does the Process Work?'}
            centered
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timelineSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{s.emoji}</div>
                <p style={{ fontWeight: 700, whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                  {lang === 'he' ? s.he : s.en}
                </p>
                {i < timelineSteps.length - 1 && (
                  <div className="hidden md:block" style={{
                    position: 'absolute', top: '50%',
                    color: 'var(--color-linen)', fontSize: '1.5rem',
                  }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={fadeRef5} className="fade-up" style={{ background: 'var(--color-clay)', color: 'white', padding: '4rem 1.5rem' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            {t('cta_title', lang === 'he' ? 'מוכנים להצמיח מרחב חדש בקהילה שלכם?' : 'Ready to grow a new space in your community?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', lineHeight: 1.7 }}>
            {t('cta_text', lang === 'he'
              ? 'שיחת ייעוץ ראשונית היא ללא עלות וללא התחייבות. נגיע אליכם, נקשיב, ונבין יחד מה נכון לכם.'
              : "An initial consultation is free and non-binding. We'll come to you, listen, and understand what's right for you together."
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--color-clay)' }}>
              {t('cta_btn', lang === 'he' ? 'השאירו פרטים ונחזור אליכם' : 'Leave Your Details')}
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
