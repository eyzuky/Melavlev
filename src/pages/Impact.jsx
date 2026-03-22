import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

export default function Impact() {
  const { t } = useContent('impact');
  const { lang } = useLang();
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();

  const stats = [
    { number: '20,000', label: lang === 'he' ? 'ערכות נטיעה' : 'Planting kits', desc: lang === 'he' ? 'הופצו' : 'distributed' },
    { number: '3', label: lang === 'he' ? 'מרכזי טבע' : 'Nature centers', desc: lang === 'he' ? 'הוקמו' : 'established' },
    { number: '100+', label: lang === 'he' ? 'תושבים ומתנדבים' : 'Residents & volunteers', desc: lang === 'he' ? 'בימי הקמה' : 'on build days' },
    { number: '2', label: lang === 'he' ? 'קהילות שיקום' : 'Rehabilitation communities', desc: lang === 'he' ? 'פעילות' : 'active' },
  ];

  const projects = [
    {
      title: t('project_1_title', lang === 'he' ? 'שורשים של תקווה — ערכות נטיעה לעוטף עזה' : 'Roots of Hope — Planting Kits for the Gaza Envelope'),
      tags: [{ label: t('project_1_tag', lang === 'he' ? 'עוטף עזה' : 'Gaza Envelope'), color: 'clay' }],
      description: t('project_1_text', lang === 'he'
        ? 'אחרי אוקטובר 2023, הבנו שהתרומה הגדולה ביותר שנוכל לתת לקהילות שנפגעו אינה חומרית — אלא סמלית וחיונית גם יחד. הפצנו 20,000 ערכות נטיעה למשפחות בעוטף עזה — זרעים, עפר וכלי גידול קטן — עם הבטחה פשוטה: גם אם הבית נהרס, הצמיחה ממשיכה.'
        : 'After October 2023, we understood that the greatest contribution we could make to affected communities was not material — but symbolic and vital both. We distributed 20,000 planting kits to families across the Gaza Envelope — seeds, soil, and a small growing kit — with a simple promise: even when a home is destroyed, growth continues.'
      ),
      results: t('project_1_results', lang === 'he'
        ? '20,000 ערכות הופצו ל-15 יישובים|שיתוף פעולה עם 8 ארגונים מקומיים|סיקור ב-3 כלי תקשורת לאומיים'
        : '20,000 kits distributed across 15 communities|Collaboration with 8 local organizations|Coverage in 3 national media outlets'
      ).split('|'),
      imageKey: 'impact_project_1',
      imageAlt: lang === 'he' ? 'חלוקת ערכות נטיעה לילדים בעוטף' : 'Distributing planting kits to children in the Envelope',
      imageRight: true,
    },
    {
      title: t('project_2_title', lang === 'he' ? 'מרכז הטבע לתקומת העוטף — עין השלושה' : 'Community Nature Center — Ein HaShlosha'),
      tags: [{ label: t('project_2_tag', lang === 'he' ? 'עוטף עזה | שיקום פוסט-טראומה' : 'Gaza Envelope · Post-Trauma Rehabilitation'), color: 'sage' }],
      description: t('project_2_text', lang === 'he'
        ? 'בעין השלושה, קיבוץ שנפגע קשות ב-7 באוקטובר, הקמנו מרכז טבע קהילתי מותאם לשיקום פוסט-טראומטי. שבועות של שיפוץ, סידור שבילים, הרכבת חממה, ובנייה של מטבח חוץ — כל זאת יחד עם תושבי הקיבוץ עצמם. המרכז הפך למקום שבו אנשים חוזרים לגעת באדמה, לנשום, ולהרגיש ששורשים עמוקים יותר מן השבר.'
        : 'In Ein HaShlosha, a kibbutz severely affected on October 7th, we established a community nature center adapted for post-traumatic rehabilitation. Weeks of renovation, laying paths, building a greenhouse, and constructing an outdoor kitchen — all together with the kibbutz residents themselves. The center became a place where people return to touch the earth, to breathe, and to feel that roots run deeper than destruction.'
      ),
      results: t('project_2_results', lang === 'he'
        ? '6 ימי הקמה קהילתיים|80+ מתנדבים מרחבי הארץ|3 סדנאות גינון שבועיות פעילות'
        : '6 community build days|80+ volunteers from across the country|3 active weekly gardening workshops'
      ).split('|'),
      imageKey: 'impact_project_2',
      imageAlt: lang === 'he' ? 'מרכז הטבע בעין השלושה' : 'Nature center in Ein HaShlosha',
      imageRight: false,
    },
    {
      title: t('project_3_title', lang === 'he' ? 'חקלאות מדברית — כפר סטודנטים, דימונה' : 'Desert Agriculture — Student Village, Dimona'),
      tags: [{ label: t('project_3_tag', lang === 'he' ? 'חקלאות קהילתית | חינוך' : 'Community Agriculture · Education'), color: 'sage' }],
      description: t('project_3_text', lang === 'he'
        ? 'בלב המדבר, בכפר סטודנטים בדימונה, הקמנו מרכז חקלאות וטבע קהילתי. המרכז משלב חינוך סביבתי, גינון טיפולי וחקלאות בת קיימא — ומוכיח שגם בתנאי המדבר הקשביים, אפשר להצמיח קהילה ירוקה ופורחת.'
        : 'In the heart of the desert, in a student village in Dimona, we established a community agriculture and nature center. The center integrates environmental education, therapeutic gardening, and sustainable agriculture — proving that even in harsh desert conditions, a green and flourishing community can grow.'
      ),
      results: t('project_3_results', lang === 'he'
        ? '200 מ"ר של גינת ירקות פעילה|40 משפחות סטודנטים משתתפות|תוכנית חינוך סביבתי לבתי ספר בסביבה'
        : '200 sqm active vegetable garden|40 student families participating|Environmental education program for surrounding schools'
      ).split('|'),
      imageKey: 'impact_project_3',
      imageAlt: lang === 'he' ? 'מרכז חקלאות בכפר סטודנטים דימונה' : 'Agriculture center in Student Village Dimona',
      imageRight: true,
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
            {projects.map((p, i) => (
              <ProjectCard key={i} {...p} />
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
