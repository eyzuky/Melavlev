import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

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

const KEY_PATTERN = /^[a-z0-9_]+$/i;

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('site');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [newKey, setNewKey] = useState('');
  const [newValueHe, setNewValueHe] = useState('');
  const [newValueEn, setNewValueEn] = useState('');

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?tab=${tab}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (index, field, value) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const removeEntry = (index) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addEntry = () => {
    const key = newKey.trim();
    if (!key) {
      showToast('חובה להזין מפתח');
      return;
    }
    if (!KEY_PATTERN.test(key)) {
      showToast('מפתח חייב להיות באותיות לטיניות / מספרים / _');
      return;
    }
    if (entries.some(e => e.key === key)) {
      showToast('מפתח כבר קיים');
      return;
    }
    setEntries(prev => [...prev, { key, value_he: newValueHe, value_en: newValueEn }]);
    setNewKey('');
    setNewValueHe('');
    setNewValueEn('');
    showToast('פריט נוסף — לחצו "שמור שינויים"');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab: activeTab, entries }),
      });
      showToast('נשמר בהצלחה');
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

      {/* Add new entry */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '1.25rem',
        border: '2px dashed var(--green-pale)', marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> הוספת פריט חדש בטאב "{TABS.find(t => t.key === activeTab)?.label}"
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: '0.5rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>מפתח</label>
            <input
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="e.g. nav_newtab"
              style={inputStyle}
              dir="ltr"
            />
          </div>
          <div>
            <label style={labelStyle}>עברית</label>
            <input value={newValueHe} onChange={e => setNewValueHe(e.target.value)} style={inputStyle} dir="rtl" />
          </div>
          <div>
            <label style={labelStyle}>English</label>
            <input value={newValueEn} onChange={e => setNewValueEn(e.target.value)} style={inputStyle} dir="ltr" />
          </div>
          <button onClick={addEntry} className="btn-primary" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Plus size={14} /> הוסף
          </button>
        </div>
      </div>

      {/* Entries */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          אין עדיין פריטים בטאב הזה. הוסיפו פריט ראשון למעלה.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry, i) => (
            <div key={entry.key} style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {entry.key}
                </div>
                <button
                  onClick={() => removeEntry(i)}
                  title="הסר מרשימת הפריטים (השמירה מעדכנת רק פריטים קיימים ואינה מוחקת)"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.25rem', color: 'var(--text-muted)',
                  }}
                >
                  <Trash2 size={14} />
                </button>
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

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1.5px solid var(--green-pale)', borderRadius: '6px',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
  outline: 'none',
};

const textareaStyle = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1.5px solid var(--green-pale)', borderRadius: '6px',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
  resize: 'vertical', outline: 'none',
};
