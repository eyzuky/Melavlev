import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Upload, Image as ImageIcon, Check } from 'lucide-react';

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

// Image slots per tab. Keys must match the `imageKey` props used in pages
// (Home.jsx, About.jsx, OurModel.jsx, Impact.jsx, SolutionDetail.jsx).
const IMAGE_SLOTS = {
  home: [
    { key: 'home_pillar_1', label: 'תמונת עמוד 1 — עזרה ראשונה לקהילה', aspect: '4/3', category: 'pillar' },
    { key: 'home_pillar_2', label: 'תמונת עמוד 2 — מרחב אדמה וצמיחה', aspect: '4/3', category: 'pillar' },
    { key: 'home_pillar_3', label: 'תמונת עמוד 3 — שיקום מבוסס טבע', aspect: '4/3', category: 'pillar' },
    { key: 'home_featured_project', label: 'פרויקט מוצג בדף הבית', aspect: '4/3', category: 'hero' },
  ],
  about: [
    { key: 'about_hero', label: 'תמונה ראשית — דף "מי אנחנו"', aspect: '16/9', category: 'hero' },
  ],
  model: [
    { key: 'model_hero', label: 'תמונה ראשית — דף "המודל שלנו"', aspect: '16/9', category: 'hero' },
    { key: 'model_pillar_1', label: 'מודל — עמוד 1', aspect: '4/3', category: 'pillar' },
    { key: 'model_pillar_2', label: 'מודל — עמוד 2', aspect: '4/3', category: 'pillar' },
    { key: 'model_pillar_3', label: 'מודל — עמוד 3', aspect: '4/3', category: 'pillar' },
    { key: 'model_pillar_4', label: 'מודל — עמוד 4', aspect: '4/3', category: 'pillar' },
  ],
  impact: [
    { key: 'projects_hero', label: 'תמונה ראשית — דף פרויקטים', aspect: '16/9', category: 'hero' },
  ],
  solutions: [
    { key: 'solution_local_authorities_hero',          label: 'רשויות מקומיות — תמונה ראשית', aspect: '16/9', category: 'solution' },
    { key: 'solution_local_authorities_midbody',       label: 'רשויות מקומיות — תמונה משנית', aspect: '16/9', category: 'solution' },
    { key: 'solution_welfare_directors_hero',          label: 'מנהלי רווחה — תמונה ראשית',     aspect: '16/9', category: 'solution' },
    { key: 'solution_welfare_directors_midbody',       label: 'מנהלי רווחה — תמונה משנית',     aspect: '16/9', category: 'solution' },
    { key: 'solution_educational_institutions_hero',    label: 'מוסדות חינוך — תמונה ראשית',    aspect: '16/9', category: 'solution' },
    { key: 'solution_educational_institutions_midbody', label: 'מוסדות חינוך — תמונה משנית',    aspect: '16/9', category: 'solution' },
    { key: 'solution_rehabilitation_communities_hero',    label: 'קהילות בשיקום — תמונה ראשית', aspect: '16/9', category: 'solution' },
    { key: 'solution_rehabilitation_communities_midbody', label: 'קהילות בשיקום — תמונה משנית', aspect: '16/9', category: 'solution' },
    { key: 'solution_gaza_envelope_hero',    label: 'יישובי עוטף — תמונה ראשית', aspect: '16/9', category: 'solution' },
    { key: 'solution_gaza_envelope_midbody', label: 'יישובי עוטף — תמונה משנית', aspect: '16/9', category: 'solution' },
    { key: 'solution_medical_wellness_hero',    label: 'מרכזי רפואה — תמונה ראשית', aspect: '16/9', category: 'solution' },
    { key: 'solution_medical_wellness_midbody', label: 'מרכזי רפואה — תמונה משנית', aspect: '16/9', category: 'solution' },
  ],
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
  const [imagesByKey, setImagesByKey] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      const [contentRes, imagesRes] = await Promise.all([
        fetch(`/api/admin/content?tab=${tab}`),
        fetch('/api/admin/images'),
      ]);
      const contentData = await contentRes.json();
      const imagesData = await imagesRes.json();
      setEntries(mergeWithScaffold(tab, contentData.entries || []));
      const map = {};
      for (const img of imagesData.images || []) {
        if (img.image_key) map[img.image_key] = img;
      }
      setImagesByKey(map);
    } catch {
      setEntries(mergeWithScaffold(tab, []));
      setImagesByKey({});
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (index, field, value) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

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

  const slots = IMAGE_SLOTS[activeTab] || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem' }}>
          ניהול תוכן
        </h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ gap: '0.5rem' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          שמור טקסטים
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : (
        <>
          {/* Text entries */}
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              אין פריטי טקסט בטאב הזה.
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

          {/* Image slots */}
          {slots.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-light)',
              }}>
                <ImageIcon size={18} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>
                  תמונות בדף
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {slots.map(slot => (
                  <ImageSlot
                    key={slot.key}
                    slot={slot}
                    existing={imagesByKey[slot.key]}
                    onSaved={() => loadTab(activeTab)}
                    showToast={showToast}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ImageSlot({ slot, existing, onSaved, showToast }) {
  const fileRef = useRef();
  const [altHe, setAltHe] = useState(existing?.alt_he || '');
  const [altEn, setAltEn] = useState(existing?.alt_en || '');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  // Reset local state when the underlying image changes (reload after save).
  useEffect(() => {
    setAltHe(existing?.alt_he || '');
    setAltEn(existing?.alt_en || '');
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  }, [existing?.id, existing?.url]);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setPreviewUrl(null); return; }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      let url = null;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const upRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!upRes.ok) throw new Error('upload failed');
        const upData = await upRes.json();
        url = upData.url;
      }

      if (!url && !existing) {
        showToast('בחרו קובץ תחילה');
        return;
      }

      const res = await fetch('/api/admin/image-slot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_key: slot.key,
          url,
          alt_he: altHe,
          alt_en: altEn,
          category: slot.category || 'general',
        }),
      });
      if (!res.ok) throw new Error('save failed');
      showToast('התמונה נשמרה');
      await onSaved();
    } catch {
      showToast('שגיאה בשמירת התמונה');
    } finally {
      setBusy(false);
    }
  };

  const displayUrl = previewUrl || existing?.url || null;

  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '1rem',
      border: '1px solid var(--border-light)',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
          {slot.label}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {slot.key}
        </div>
      </div>

      <div style={{
        aspectRatio: slot.aspect || '16/9', borderRadius: '8px', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-linen, #F0EAD7), var(--color-parchment, #F7F2E5))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: previewUrl ? '2px solid var(--green-sage)' : '1px solid var(--border-light)',
      }}>
        {displayUrl ? (
          <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>אין תמונה</span>
        )}
      </div>

      <div>
        <label style={labelStyle}>החלף קובץ</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ fontSize: '0.8rem' }} />
        {previewUrl && (
          <div style={{ fontSize: '0.7rem', color: 'var(--green-forest)', marginTop: '0.25rem', fontWeight: 600 }}>
            תצוגה מקדימה — לחצו "שמור" כדי להעלות
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>טקסט חלופי (עברית)</label>
        <input value={altHe} onChange={e => setAltHe(e.target.value)} style={{ ...inputStyle, direction: 'rtl' }} />
      </div>
      <div>
        <label style={labelStyle}>Alt text (English)</label>
        <input value={altEn} onChange={e => setAltEn(e.target.value)} style={{ ...inputStyle, direction: 'ltr' }} />
      </div>

      <button onClick={handleSave} disabled={busy} className="btn-primary" style={{ gap: '0.5rem', justifyContent: 'center' }}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : (previewUrl ? <Upload size={14} /> : <Check size={14} />)}
        {busy ? 'שומר...' : (previewUrl ? 'העלה ושמור' : 'שמור')}
      </button>
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

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1.5px solid var(--green-pale)', borderRadius: '6px',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
  outline: 'none',
};
