import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import StatCard from '../components/StatCard';
import ProcessStep from '../components/ProcessStep';
import WaveDivider from '../components/WaveDivider';
import LeafAccent from '../components/LeafAccent';
import CMSImage from '../components/CMSImage';
import { useContent } from '../hooks/useContent';
import { useProjects } from '../hooks/useProjects';
import { useLang } from '../context/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

const HERO_VIDEOS = { he: 'RrRMSIMjiHU', en: 'cJpXspugizs' };

function useYouTubeBackground(lang) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const [, forceUpdate] = useState(0);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      readyRef.current = true;
      forceUpdate(n => n + 1);
      return;
    }
    // Avoid loading script twice
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      readyRef.current = true;
      forceUpdate(n => n + 1);
    };
  }, []);

  // Create or update player when ready or lang changes
  useEffect(() => {
    if (!readyRef.current || !containerRef.current) return;
    const videoId = HERO_VIDEOS[lang] || HERO_VIDEOS.he;

    // If player exists, just switch the video
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById({ videoId, startSeconds: 0 });
      return;
    }

    // Clean up any leftover player div (StrictMode double-mount)
    const existing = containerRef.current.querySelector('#yt-hero-player');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'yt-hero-player';
    containerRef.current.appendChild(el);

    playerRef.current = new window.YT.Player('yt-hero-player', {
      videoId,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, loop: 1,
        playlist: videoId,
        playsinline: 1, rel: 0, showinfo: 0,
        modestbranding: 1, disablekb: 1,
      },
      events: {
        onReady: (e) => { e.target.mute(); e.target.playVideo(); },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) {
            e.target.seekTo(0); e.target.playVideo();
          }
        },
      },
    });
  }, [lang, readyRef.current]);

  return containerRef;
}

export default function Home() {
  const { t } = useContent('home');
  const { lang } = useLang();
  const { featured: featuredProject } = useProjects();
  const [showArrow, setShowArrow] = useState(true);
  const fadeRef1 = useFadeUp();
  const fadeRef2 = useFadeUp();
  const fadeRef3 = useFadeUp();
  const fadeRef4 = useFadeUp();
  const fadeRef5 = useFadeUp();

  const ytRef = useYouTubeBackground(lang);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: '20,000', label: t('stat_1_label', lang === 'he' ? 'ערכות נטיעה הופצו' : 'Planting kits distributed') },
    { number: '3', label: t('stat_2_label', lang === 'he' ? 'מרכזי טבע הוקמו' : 'Nature centers established') },
    { number: '100+', label: t('stat_3_label', lang === 'he' ? 'תושבים ומתנדבים' : 'Residents & volunteers') },
    { number: '2', label: t('stat_4_label', lang === 'he' ? 'קהילות שיקום פעילות' : 'Active rehabilitation communities') },
  ];

  const pillars = [
    {
      imageKey: 'home_pillar_1',
      title: t('pillar_1_title', lang === 'he' ? 'עיצוב קהילתי מותאם' : 'Custom-Tailored Community Design'),
      text: t('pillar_1_text', lang === 'he' ? 'כל מרחב זוכה לתכנון מוקפד התפור למידות ולצרכיה של הקהילה המקומית. הDNA שלנו כולל סטודיו תכנון מובנה.' : 'Our core DNA includes an in-house design studio. Every space receives meticulous planning and custom-made facilities, tailored precisely to the needs of the local community.'),
    },
    {
      imageKey: 'home_pillar_2',
      title: t('pillar_2_title', lang === 'he' ? 'הקמה משותפת' : 'Co-Creation'),
      text: t('pillar_2_text', lang === 'he' ? 'הקהילה אינה רק קהל יעד — אלא שותפה מלאה. פיתוח המרחב נעשה יד ביד עם התושבים, מהחזון ועד הביצוע.' : 'The community is not just a target audience — they are full partners. Development is done hand-in-hand with residents, from vision to execution.'),
    },
    {
      imageKey: 'home_pillar_3',
      title: t('pillar_3_title', lang === 'he' ? 'שיקום וחוסן' : 'Rehabilitation & Resilience'),
      text: t('pillar_3_text', lang === 'he' ? 'התמחות במרחבי טבע מונגשים המותאמים לנפגעי פוסט-טראומה ולבני הגיל השלישי. מרחבים שמחזירים תקווה.' : 'Specializing in accessible nature spaces adapted for trauma (PTSD) survivors and senior citizens. Spaces that restore hope.'),
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: t('step_1_title', lang === 'he' ? 'התהליך הקהילתי' : 'The Community Process'),
      bullets: lang === 'he'
        ? ['מיפוי צרכים והקשבה לתושבים.', 'הקמת צוות מוביל מקומי.', 'תכנון שנגזר מהחלומות של הקהילה.']
        : ['Mapping needs and listening to residents.', 'Establishing a local leadership team.', "Design derived from the community's dreams."],
    },
    {
      number: '02',
      title: t('step_2_title', lang === 'he' ? 'תכנון וביצוע' : 'Planning & Execution'),
      bullets: lang === 'he'
        ? ['אותו צוות שמאפיין — בונה.', 'ימי הקמה קהילתיים חגיגיים.', 'נגרות, בנייה באדמה, שתילה משותפת.']
        : ['The same team that designs — builds.', 'Celebratory community build days.', 'Carpentry, earth building, planting workshops.'],
    },
    {
      number: '03',
      title: t('step_3_title', lang === 'he' ? 'ליווי והפעלה' : 'Ongoing Support'),
      bullets: lang === 'he'
        ? ['הכשרת "מובילי טבע" מקומיים.', 'סדנאות תוכן שוטפות.', 'אנחנו לא עוזבים כשהשתילים באדמה.']
        : ['Training local "Nature Leaders".', 'Regular content workshops.', "We don't leave when the saplings are in the ground."],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 88px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
        {/* YouTube video background — hidden on mobile, shown on md+ */}
        <div
          ref={ytRef}
          className="hidden md:block"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            pointerEvents: 'none', overflow: 'hidden',
          }}
        >
          <style>{`
            #yt-hero-player {
              position: absolute;
              bottom: 0; left: 0; right: 0;
              width: 100%; height: 56.25vw;
              min-height: 100%;
              pointer-events: none;
            }
            #yt-hero-player iframe {
              position: absolute;
              top: 0; left: 0;
              width: 100% !important;
              height: 100% !important;
            }
          `}</style>
        </div>
        {/* Dark overlay — above video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(30, 20, 10, 0.55)' }} />

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '800px', padding: '2rem', width: '100%' }}>
          <span style={{
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '1.5rem',
          }}>
            {t('hero_label', lang === 'he' ? '← מגדלים קהילות מהשורש' : 'Growing Communities from the Root →')}
          </span>

          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'white',
            lineHeight: 1.1, marginBottom: '1.5rem',
          }}>
            {t('hero_title', lang === 'he' ? 'מלבלב –\nמצמיחים קשרים בקהילה' : 'Melavlev –\nCultivating Community Connections')}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            {t('hero_subtitle', lang === 'he'
              ? 'אנחנו מקימים מרכזי טבע קהילתיים המשלבים שיקום, חיבור לאדמה וצמיחה חברתית. הופכים שטחים פתוחים ללב הפועם של היישוב.'
              : 'We establish community nature centers that integrate rehabilitation, connection to the land, and social growth. We transform open spaces into the beating heart of the community.'
            )}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">
              {t('hero_cta_primary', lang === 'he' ? 'הקימו מרכז בקהילה שלכם →' : 'Bring a Center to Your Community →')}
            </Link>
            <Link to="/model" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
              {t('hero_cta_secondary', lang === 'he' ? 'גלו את המודל שלנו' : 'Discover Our Model')}
            </Link>
          </div>

          {/* Inline video on mobile */}
          <div className="md:hidden" style={{ marginTop: '2.5rem', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${HERO_VIDEOS[lang] || HERO_VIDEOS.he}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEOS[lang] || HERO_VIDEOS.he}&playsinline=1&controls=0&modestbranding=1&rel=0`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {showArrow && (
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)', color: 'white', fontSize: '2rem',
            animation: 'countUp 1s ease infinite alternate', opacity: 0.6,
          }}>
            ↓
          </div>
        )}
      </section>

      {/* Impact Numbers Strip */}
      <section ref={fadeRef1} className="fade-up" style={{ background: 'var(--color-clay)', padding: '3rem 0' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} number={s.number} label={s.label} light />
          ))}
        </div>
      </section>

      {/* What We Do - 3 Pillars */}
      <section ref={fadeRef2} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            label={lang === 'he' ? 'הגישה שלנו' : 'Our Approach'}
            title={t('pillars_title', lang === 'he' ? 'הטבע כמרחב של ריפוי וחיבור' : 'Nature as a Space for Healing and Connection')}
            subtitle={t('pillars_subtitle', lang === 'he' ? 'פיתחנו מודל ייחודי שהופך את הגינון הקהילתי לכלי טיפולי, חברתי ותכנוני רב-עוצמה.' : 'We developed a unique model that transforms community gardening into a powerful therapeutic, social, and planning tool.')}
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {pillars.map((p, i) => (
              <div key={i} className="card" style={{ borderTop: '4px solid var(--color-clay)', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  {p.text}
                </p>
                <CMSImage
                  imageKey={p.imageKey}
                  alt={p.title}
                  aspectRatio="4/3"
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/model" style={{ color: 'var(--color-clay)', fontWeight: 700, fontSize: '1rem' }}>
              {lang === 'he' ? '← קראו על המודל המלא' : 'Read about the full model →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider color="var(--color-parchment)" />

      {/* Our Process */}
      <section ref={fadeRef3} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-parchment)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            label={lang === 'he' ? 'איך זה עובד' : 'How It Works'}
            title={lang === 'he' ? 'מצמיחים קהילה, לא רק גינה' : 'Growing Communities, Not Just Gardens'}
            subtitle={lang === 'he' ? 'לא מגיעים עם תוכנית מוכנה מראש. תמיד מתחילים בהקשבה.' : 'We never arrive with a pre-made plan. We always start by listening.'}
            centered
          />
          <div className="flex flex-col md:flex-row gap-8">
            {processSteps.map((s, i) => (
              <ProcessStep key={i} number={s.number} title={s.title} bullets={s.bullets} isLast={i === processSteps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section ref={fadeRef4} className="fade-up" style={{ background: 'var(--color-earth)', color: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-3/5">
              <SectionTitle
                label={t('featured_project_label', lang === 'he' ? 'פרויקט נבחר' : 'Featured Project')}
                title={featuredProject?.title || t('featured_project_title', lang === 'he' ? 'שורשים של תקווה — עוטף עזה' : 'Roots of Hope — Gaza Envelope')}
                light
              />
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
                {featuredProject?.description || t('featured_project_text', lang === 'he'
                  ? 'לאחר אוקטובר 2023, הפצנו 20,000 ערכות נטיעה למשפחות בעוטף עזה — סמל של צמיחה מתוך השבר. היום, אנחנו מקימים מרכזי טבע בסופה ובעין השלושה: מקומות שמחזירים לאנשים תחושת שורש, שייכות ועתיד.'
                  : 'After October 2023, we distributed 20,000 planting kits to families in the Gaza Envelope — seeds, soil, and a small growing kit — with a simple promise: even when a home is destroyed, growth continues.'
                )}
              </p>
              <Link to="/impact" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                {lang === 'he' ? '← לכל הפרויקטים' : 'View All Projects →'}
              </Link>
            </div>
            <div className="md:w-2/5">
              {featuredProject?.imageUrl ? (
                <div style={{ aspectRatio: '4/3' }} className="rounded-lg overflow-hidden">
                  <img src={featuredProject.imageUrl} alt={featuredProject.imageAlt || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <CMSImage imageKey="home_featured_project" alt={lang === 'he' ? 'פעילות קהילתית בעין השלושה' : 'Community activity in Ein HaShlosha'} aspectRatio="4/3" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider back to cream */}
      <WaveDivider color="var(--color-cream)" flip />

      {/* Final CTA */}
      <section ref={fadeRef5} className="fade-up py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LeafAccent size={64} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            {t('final_cta_title', lang === 'he' ? 'בואו נתחיל להצמיח משהו ביחד' : "Let's Start Growing Something Together")}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            {t('final_cta_text', lang === 'he'
              ? 'רוצים להקים מרכז טבע קהילתי אצלכם? השאירו פרטים ונחזור אליכם לשיחת ייעוץ ראשונית ללא עלות.'
              : 'Want to establish a community nature center in your area? Leave your details and we\'ll be in touch.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">
              {t('hero_cta_primary', lang === 'he' ? 'הקימו מרכז בקהילה שלכם →' : 'Bring a Center to Your Community →')}
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
