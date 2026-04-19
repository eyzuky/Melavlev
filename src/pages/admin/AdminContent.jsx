import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

const TABS = [
  { key: 'site', label: 'אתר' },
  { key: 'nav', label: 'ניווט' },
  { key: 'home', label: 'בית' },
  { key: 'about', label: 'מי אנחנו' },
  { key: 'model', label: 'מודל' },
  { key: 'solutions', label: 'פתרונות' },
  { key: 'impact', label: 'פרויקטים' },
  { key: 'gallery', label: 'גלריה' },
  { key: 'contact', label: 'צרו קשר' },
];

// Scaffolds — any key listed here that isn't already in the DB will be shown
// with its default value so the client can edit it. Saving then persists it.
// Keep this in sync with hardcoded fallbacks across pages/Navbar/Footer.
const SCAFFOLDS = {
  nav: {
    nav_home:     ['בית', 'Home'],
    nav_about:    ['מי אנחנו', 'About Us'],
    nav_model:    ['המודל שלנו', 'Our Model'],
    nav_solutions:['פתרונות', 'Solutions'],
    nav_projects: ['פרויקטים', 'Projects'],
    nav_gallery:  ['גלריה', 'Gallery'],
    nav_contact:  ['צור קשר', 'Contact Us'],
    nav_cta:      ['הקימו מרכז', 'Partner With Us'],
  },
  about: {
    page_label: ['מי אנחנו', 'About Us'],
    page_title: ['הסיפור שלנו', 'Our Story'],
    about_p1: [
      'מלבלב הוא ארגון חברתי שמקים מרכזי טבע קהילתיים ברחבי ישראל. אנחנו מאמינים שחיבור לטבע, לאדמה ולקהילה הוא מרכיב חיוני לחוסן אישי וקולקטיבי.',
      'Melavlev is a social organization that establishes community nature centers across Israel. We believe that connection to nature, the land, and the community is a vital component of personal and collective resilience.',
    ],
    about_p2: [
      'הצוות שלנו כולל אדריכלים, מתכננים, מנחי קבוצות ואנשי חינוך סביבתי, שכולם חולקים חזון אחד: ליצור מרחבים שמצמיחים קשרים.',
      'Our team includes architects, planners, group facilitators, and environmental educators — all sharing one vision: to create spaces that grow connections.',
    ],
    about_p3: [
      'כל פרויקט מתחיל בהקשבה לקהילה, נמשך בהקמה משותפת, וממשיך בליווי ארוך-טווח. אנחנו לא עוזבים כשהשתילים באדמה.',
      "Every project starts by listening to the community, continues through joint construction, and is followed by long-term support. We don't leave when the saplings are in the ground.",
    ],
    cta_title: ['רוצים להכיר אותנו?', 'Want to get to know us?'],
    cta_text: [
      'נשמח לשיחה — כדי להבין איך הטבע והקהילה יכולים לצמוח אצלכם.',
      "We'd love to chat — to understand how nature and community can grow in your area.",
    ],
  },
  gallery: {
    page_label: ['גלריה', 'Gallery'],
    page_title: ['רגעים מהשטח', 'Moments from the Field'],
    page_subtitle: [
      'אוסף תמונות ממרכזי הטבע והקהילות שאנחנו מלווים.',
      'A collection of images from the nature centers and communities we accompany.',
    ],
  },
};

function mergeWithScaffold(tab, dbEntries) {
  const scaffold = SCAFFOLDS[tab] || {};
  const existingKeys = new Set(dbEntries.map(e => e.key));
  const scaffoldRows = Object.entries(scaffold)
    .filter(([key]) => !existingKeys.has(key))
    .map(([key, [he, en]]) => ({ key, value_he: he, value_en: en, __scaffold: true }));
  return [...dbEntries, ...scaffoldRows];
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('site');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?tab=${tab}`);
      const data = await res.json();
      setEntries(mergeWithScaffold(tab, data.entries || []));
    } catch {
      setEntries(mergeWithScaffold(tab, []));
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (index, field, value) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Strip the __scaffold marker before sending; the payload is just key + values.
      const payload = entries.map(({ __scaffold, ...rest }) => rest);
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab: activeTab, entries: payload }),
      });
      showToast('נשמר בהצלחה');
      await loadTab(activeTab);
    } catch {
      showToast('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem' }}>
          ניהול תוכן
        </h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ gap: '0.5rem' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          שמור שינויים
        </button>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem',
              background: activeTab === t.key ? 'var(--green-forest)' : 'var(--green-blush)',
              color: activeTab === t.key ? 'white' : 'var(--green-mid)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--green-forest)', color: 'white', padding: '0.75rem 1.5rem',
          borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, zIndex: 100,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {toast}
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          אין פריטים בטאב הזה.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry, i) => (
            <div
              key={entry.key}
              style={{
                background: 'white', borderRadius: '12px', padding: '1.25rem',
                border: entry.__scaffold ? '1px dashed var(--green-sage)' : '1px solid var(--border-light)',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {entry.key}
                </div>
                {entry.__scaffold && (
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                    background: 'var(--green-blush)', color: 'var(--green-mid)', letterSpacing: '0.05em',
                  }}>
                    חדש — יישמר בלחיצה על "שמור"
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>עברית</label>
                  <textarea
                    value={entry.value_he || ''}
                    onChange={e => updateEntry(i, 'value_he', e.target.value)}
                    rows={(entry.value_he || '').length > 80 ? 3 : 1}
                    style={{ ...textareaStyle, direction: 'rtl' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>English</label>
                  <textarea
                    value={entry.value_en || ''}
                    onChange={e => updateEntry(i, 'value_en', e.target.value)}
                    rows={(entry.value_en || '').length > 80 ? 3 : 1}
                    style={{ ...textareaStyle, direction: 'ltr' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-sage)',
  letterSpacing: '0.1em', textTransform: 'uppercase',
  display: 'block', marginBottom: '0.25rem',
};

const textareaStyle = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1.5px solid var(--green-pale)', borderRadius: '6px',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
  resize: 'vertical', outline: 'none',
};
