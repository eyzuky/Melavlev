import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import { useContent } from '../hooks/useContent';
import { useProjects } from '../hooks/useProjects';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

export default function Impact() {
  const { t } = useContent('impact');
  const { lang } = useLang();
  const { projects, loading: projectsLoading } = useProjects();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();

  const stats = [
    { number: '20,000', label: lang === 'he' ? 'ערכות נטיעה' : 'Planting kits', desc: lang === 'he' ? 'הופצו' : 'distributed' },
    { number: '3', label: lang === 'he' ? 'מרכזי טבע' : 'Nature centers', desc: lang === 'he' ? 'הוקמו' : 'established' },
    { number: '100+', label: lang === 'he' ? 'תושבים ומתנדבים' : 'Residents & volunteers', desc: lang === 'he' ? 'בימי הקמה' : 'on build days' },
    { number: '2', label: lang === 'he' ? 'קהילות שיקום' : 'Rehabilitation communities', desc: lang === 'he' ? 'פעילות' : 'active' },
  ];

  // Fallback projects if DB is empty/unavailable
  const displayProjects = projects.length > 0 ? projects : [
    {
      title: lang === 'he' ? 'שורשים של תקווה — ערכות נטיעה לעוטף עזה' : 'Roots of Hope — Planting Kits for the Gaza Envelope',
      tags: [{ label: lang === 'he' ? 'עוטף עזה' : 'Gaza Envelope', color: 'clay' }],
      description: lang === 'he'
        ? 'אחרי אוקטובר 2023, הבנו שהתרומה הגדולה ביותר שנוכל לתת לקהילות שנפגעו אינה חומרית — אלא סמלית וחיונית גם יחד. הפצנו 20,000 ערכות נטיעה למשפחות בעוטף עזה — זרעים, עפר וכלי גידול קטן — עם הבטחה פשוטה: גם אם הבית נהרס, הצמיחה ממשיכה.'
        : 'After October 2023, we distributed 20,000 planting kits to families across the Gaza Envelope — seeds, soil, and a small growing kit — with a simple promise: even when a home is destroyed, growth continues.',
      results: lang === 'he'
        ? ['20,000 ערכות הופצו ל-15 יישובים', 'שיתוף פעולה עם 8 ארגונים מקומיים', 'סיקור ב-3 כלי תקשורת לאומיים']
        : ['20,000 kits distributed across 15 communities', 'Collaboration with 8 local organizations', 'Coverage in 3 national media outlets'],
      imageKey: 'impact_project_1',
      imageAlt: lang === 'he' ? 'חלוקת ערכות נטיעה לילדים בעוטף' : 'Distributing planting kits',
    },
    {
      title: lang === 'he' ? 'מרכז הטבע לתקומת העוטף — עין השלושה' : 'Community Nature Center — Ein HaShlosha',
      tags: [{ label: lang === 'he' ? 'עוטף עזה | שיקום פוסט-טראומה' : 'Gaza Envelope · Post-Trauma Rehabilitation', color: 'sage' }],
      description: lang === 'he'
        ? 'בעין השלושה, קיבוץ שנפגע קשות ב-7 באוקטובר, הקמנו מרכז טבע קהילתי מותאם לשיקום פוסט-טראומטי.'
        : 'In Ein HaShlosha, a kibbutz severely affected on October 7th, we established a community nature center adapted for post-traumatic rehabilitation.',
      results: lang === 'he'
        ? ['6 ימי הקמה קהילתיים', '80+ מתנדבים מרחבי הארץ', '3 סדנאות גינון שבועיות פעילות']
        : ['6 community build days', '80+ volunteers from across the country', '3 active weekly gardening workshops'],
      imageKey: 'impact_project_2',
      imageAlt: lang === 'he' ? 'מרכז הטבע בעין השלושה' : 'Nature center in Ein HaShlosha',
    },
    {
      title: lang === 'he' ? 'חקלאות מדברית — כפר סטודנטים, דימונה' : 'Desert Agriculture — Student Village, Dimona',
      tags: [{ label: lang === 'he' ? 'חקלאות קהילתית | חינוך' : 'Community Agriculture · Education', color: 'sage' }],
      description: lang === 'he'
        ? 'בלב המדבר, בכפר סטודנטים בדימונה, הקמנו מרכז חקלאות וטבע קהילתי.'
        : 'In the heart of the desert, in a student village in Dimona, we established a community agriculture and nature center.',
      results: lang === 'he'
        ? ['200 מ"ר של גינת ירקות פעילה', '40 משפחות סטודנטים משתתפות', 'תוכנית חינוך סביבתי לבתי ספר בסביבה']
        : ['200 sqm active vegetable garden', '40 student families participating', 'Environmental education program for surrounding schools'],
      imageKey: 'impact_project_3',
      imageAlt: lang === 'he' ? 'מרכז חקלאות בכפר סטודנטים דימונה' : 'Agriculture center in Dimona',
    },
  ];

  return (
    <>
      {/* Page Hero */}
      <section style={{ background: 'var(--color-parchment)', minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <SectionTitle
            label={t('page_label', lang === 'he' ? 'האימפקט שלנו' : 'Our Impact')}
            title={t('page_title', lang === 'he' ? 'מה שנבנה לא נשכח' : 'What Is Built Is Not Forgotten')}
            subtitle={t('page_subtitle', lang === 'he' ? 'כל מרכז הוא סיפור. כאן הסיפורים שלנו.' : 'Every center is a story. Here are our stories.')}
            centered
          />
        </div>
      </section>

      {/* Impact Numbers */}
      <section ref={fadeRef1} className="fade-up py-16" style={{ background: 'var(--color-parchment)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} number={s.number} label={s.label} description={s.desc} />
          ))}
        </div>
      </section>

      {/* Project Cards */}
      <section ref={fadeRef2} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title={t('projects_title', lang === 'he' ? 'הפרויקטים שלנו' : 'Our Projects')}
            centered
          />
          <div className="flex flex-col gap-12">
            {displayProjects.map((p, i) => (
              <ProjectCard
                key={p.id || i}
                title={p.title}
                tags={p.tags}
                description={p.description}
                results={p.results}
                imageKey={p.imageKey}
                imageUrl={p.imageUrl}
                imageAlt={p.imageAlt}
                imageRight={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section ref={fadeRef3} className="fade-up" style={{ background: 'var(--color-earth)', color: 'white' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>
            {t('vision_title', lang === 'he' ? 'המפה גדולה יותר' : 'The Map Is Bigger')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
            {t('vision_text', lang === 'he'
              ? 'אנחנו בתחילת הדרך. החזון שלנו הוא רשת של מרכזי טבע קהילתיים בכל רחבי ישראל — ממושבי הנגב ועד לשכונות בצפון. אם אתם רוצים שהמרכז הבא יקום בקהילה שלכם — דברו איתנו.'
              : 'We are at the beginning of our journey. Our vision is a network of community nature centers across Israel — from villages in the Negev to neighborhoods in the north. If you want the next center to be built in your community — talk to us.'
            )}
          </p>
          <Link to="/contact" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
            {t('vision_cta', lang === 'he' ? 'הצטרפו למפה שלנו →' : 'Join Our Map →')}
          </Link>
        </div>
      </section>
    </>
  );
}
