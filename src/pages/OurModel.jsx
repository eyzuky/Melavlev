import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import CMSImage from '../components/CMSImage';
import LeafAccent from '../components/LeafAccent';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

export default function OurModel() {
  const { t } = useContent('model');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();
  const fadeRef4 = useFadeUp();

  const pillars = [
    {
      title: t('pillar_1_title', lang === 'he' ? 'עיצוב קהילתי מותאם אישית' : 'Custom-Tailored Community Design'),
      text: t('pillar_1_text', lang === 'he'
        ? 'ה-DNA שלנו כולל סטודיו תכנון מובנה. כל מרחב זוכה לתכנון מוקפד ולמתקנים ייחודיים התפורים בדיוק למידותיה ולצרכיה של הקהילה המקומית. אין שני מרכזים דומים — כי אין שתי קהילות דומות.'
        : 'Our core DNA includes an in-house design studio. Every space receives meticulous planning and unique facilities tailored to the exact dimensions and needs of the local community. No two centers are alike — because no two communities are alike.'
      ),
      imageKey: 'model_pillar_1',
      imageAlt: lang === 'he' ? 'תכנון אדריכלי של מרכז טבע' : 'Architectural planning of a nature center',
    },
    {
      title: t('pillar_2_title', lang === 'he' ? 'הקמה משותפת' : 'Co-Creation'),
      text: t('pillar_2_text', lang === 'he'
        ? 'הקהילה אינה רק קהל יעד, אלא שותפה מלאה. פיתוח המרחב נעשה יד ביד עם התושבים — משלב החזון והתכנון ועד לביצוע בשטח. ימי ההקמה המשותפים הם הלב הפועם של התהליך. הם הופכים את התושבים מצופים לשותפים, ומעניקים להם תחושת בעלות מלאה על המרחב.'
        : 'The community is not just a target audience; they are full partners. The development of the space is done hand-in-hand with residents — from vision and planning to on-site execution. The joint build days are the beating heart of the process.'
      ),
      imageKey: 'model_pillar_2',
      imageAlt: lang === 'he' ? 'תושבים בונים ביחד ביום הקמה' : 'Residents building together on build day',
    },
    {
      title: t('pillar_3_title', lang === 'he' ? 'חוסן קהילתי' : 'Community Resilience'),
      text: t('pillar_3_text', lang === 'he'
        ? 'יצירת מרחבי מפגש שמחברים לטבע, מפיגים בדידות ומחזקים את הקשר בין התושבים. המרכזים שלנו מפתחים קשר בין-דורי — מקום שבו סבתא ונכד יכולים לגדל עגבנייה ביחד.'
        : 'Creating gathering spaces that connect people to nature, alleviate loneliness, and strengthen bonds between residents. Our centers foster intergenerational connection.'
      ),
      imageKey: 'model_pillar_3',
      imageAlt: lang === 'he' ? 'קשישים וילדים גוננים יחד' : 'Seniors and children gardening together',
    },
    {
      title: t('pillar_4_title', lang === 'he' ? 'שיקום וצמיחה' : 'Rehabilitation & Growth'),
      text: t('pillar_4_text', lang === 'he'
        ? 'התמחות במרחבי טבע מונגשים המותאמים לנפגעי פוסט-טראומה (PTSD) ולבני הגיל השלישי. חקלאות קהילתית בת קיימא. למידה חווייתית. מרחבים שמחזירים תכלית ועתיד.'
        : 'Specializing in accessible nature spaces adapted for PTSD survivors and senior citizens. Sustainable community agriculture. Experiential learning. Spaces that restore purpose and a sense of future.'
      ),
      imageKey: 'model_pillar_4',
      imageAlt: lang === 'he' ? 'מרחב טבע טיפולי' : 'Therapeutic nature space',
    },
  ];

  const steps = [
    {
      title: t('step_1_title', lang === 'he' ? 'התהליך הקהילתי' : 'The Community Process'),
      bullets: lang === 'he'
        ? ['מתחילים בהקשבה — לא מגיעים עם תוכנית מוכנה מראש', 'מיפוי צרכים ורצונות של הקהילה', 'הקמת צוות מוביל מקומי', 'אפיון אדריכלי הנגזר מחלומות התושבים']
        : ['Starting by listening — we never arrive with a pre-made plan', 'Mapping community needs and desires', 'Establishing a local leadership team', "Architectural design derived from the community's dreams"],
    },
    {
      title: t('step_2_title', lang === 'he' ? 'תכנון וביצוע תחת קורת גג אחת' : 'Planning & Execution Under One Roof'),
      bullets: lang === 'he'
        ? ['אותו צוות שמאפיין — מנהל את ההקמה', 'אחריות מלאה ללא קבלני משנה', 'סדנאות הקמה חגיגיות: נגרות קהילתית / בנייה באדמה ובחומרים טבעיים / שתילה']
        : ['The same team that designs — manages the build', 'Full responsibility with no subcontractors', 'Celebratory build workshops: community carpentry, earth building, planting'],
    },
    {
      title: t('step_3_title', lang === 'he' ? 'ליווי והפעלה' : 'Ongoing Support'),
      bullets: lang === 'he'
        ? ['הכשרת "מובילי טבע" מקומיים', 'סדנאות תוכן מותאמות לצרכי הקהילה', 'אנחנו לא עוזבים כשהשתילים באדמה']
        : ['Training local "Nature Leaders"', 'Content workshops tailored to community needs', "We don't leave when the saplings are in the ground"],
    },
  ];

  return (
    <>
      {/* Top hero image */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '21/9', width: '100%', maxHeight: '60vh', overflow: 'hidden' }}>
          <CMSImage
            imageKey="model_hero"
            alt={lang === 'he' ? 'תמונת גיבור - המודל שלנו' : 'Our model hero image'}
            aspectRatio="21/9"
          />
        </div>
      </section>

      {/* Page Title */}
      <section style={{ background: 'var(--color-parchment)', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center relative">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'המודל שלנו' : 'Our Model')}
            title={t('page_title', lang === 'he' ? 'הטבע כמרחב של ריפוי וחיבור' : 'Nature as a Space for Healing and Connection')}
            subtitle={t('page_subtitle', lang === 'he' ? 'לא רק גינות — אקו-סיסטם שלם של עשייה קהילתית.' : 'Not just gardens — a complete ecosystem of community action.')}
            centered
          />
        </div>
      </section>

      {/* 4 Pillars */}
      {pillars.map((p, i) => (
        <section
          key={i}
          ref={i === 0 ? fadeRef1 : undefined}
          className={i === 0 ? 'fade-up' : ''}
          style={{ background: i % 2 === 0 ? 'var(--color-cream)' : 'var(--color-parchment)', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', top: '-2rem', left: i % 2 === 0 ? 'auto' : '-1rem', right: i % 2 === 0 ? '-1rem' : 'auto',
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '12rem', lineHeight: 1,
            color: 'var(--color-earth)', opacity: 0.03,
          }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="md:w-1/2">
                <CMSImage imageKey={p.imageKey} alt={p.imageAlt} aspectRatio="4/3" />
              </div>
              <div className="md:w-1/2">
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.75rem', marginBottom: '1rem' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {p.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 3-Step Process (dark) */}
      <section ref={fadeRef2} className="fade-up" style={{ background: 'var(--color-earth)', color: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <SectionTitle
            label={lang === 'he' ? 'התהליך' : 'The Process'}
            title={t('process_title', lang === 'he' ? 'מצמיחים קהילה, לא רק גינה' : 'Growing Communities, Not Just Gardens')}
            subtitle={t('process_subtitle', lang === 'he' ? 'לא מגיעים עם תוכנית מוכנה מראש. תמיד מתחילים בהקשבה.' : 'We never arrive with a pre-made plan. We always start by listening.')}
            centered
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative p-6 text-center">
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 600,
                  fontSize: '1.25rem', color: 'var(--color-clay-light)', marginBottom: '0.75rem',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>
                  {s.title}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.bullets.map((b, j) => (
                    <li key={j} style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section ref={fadeRef3} className="fade-up" style={{ background: 'var(--color-clay)', color: 'white', padding: '4rem 1.5rem' }}>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: 'clamp(1.25rem, 3vw, 2rem)', lineHeight: 1.5,
          }}>
            {t('pull_quote', lang === 'he'
              ? '"אנחנו מביאים את הכלים והידע, הקהילה מביאה את הלב — ביחד אנחנו יוצרים מקום."'
              : '"We bring the tools and expertise, the community brings the heart — together, we create a place."'
            )}
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={fadeRef4} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LeafAccent size={64} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            {lang === 'he' ? 'בואו נתחיל להצמיח משהו ביחד' : "Let's Start Growing Something Together"}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            {lang === 'he'
              ? 'רוצים להקים מרכז טבע קהילתי אצלכם? השאירו פרטים ונחזור אליכם לשיחת ייעוץ ראשונית ללא עלות.'
              : "Want to establish a community nature center in your area? Leave your details and we'll be in touch for a free initial consultation."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">
              {lang === 'he' ? 'הקימו מרכז בקהילה שלכם →' : 'Bring a Center to Your Community →'}
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
