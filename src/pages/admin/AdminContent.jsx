import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

const TABS = [
  { key: 'site', label: 'אתר' },
  { key: 'nav', label: 'ניווט' },
  { key: 'home', label: 'בית' },
  { key: 'model', label: 'מודל' },
  { key: 'solutions', label: 'פתרונות' },
  { key: 'impact', label: 'אימפקט' },
  { key: 'contact', label: 'צרו קשר' },
];

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab: activeTab, entries }),
      });
      setToast('נשמר בהצלחה');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.75rem' }}>
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
              fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: '0.85rem',
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
          אין תוכן בטאב הזה. הריצו את סקריפט ה-seed כדי לאכלס את הנתונים.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry, i) => (
            <div key={entry.key} style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{
                fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)',
                marginBottom: '0.75rem', fontWeight: 600,
              }}>
                {entry.key}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-sage)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    עברית
                  </label>
                  <textarea
                    value={entry.value_he}
                    onChange={e => updateEntry(i, 'value_he', e.target.value)}
                    rows={entry.value_he.length > 80 ? 3 : 1}
                    style={{
                      width: '100%', padding: '0.5rem 0.75rem',
                      border: '1.5px solid var(--green-pale)', borderRadius: '6px',
                      fontFamily: "'Jost', sans-serif", fontSize: '0.875rem',
                      resize: 'vertical', outline: 'none', direction: 'rtl',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-sage)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    English
                  </label>
                  <textarea
                    value={entry.value_en}
                    onChange={e => updateEntry(i, 'value_en', e.target.value)}
                    rows={entry.value_en.length > 80 ? 3 : 1}
                    style={{
                      width: '100%', padding: '0.5rem 0.75rem',
                      border: '1.5px solid var(--green-pale)', borderRadius: '6px',
                      fontFamily: "'Jost', sans-serif", fontSize: '0.875rem',
                      resize: 'vertical', outline: 'none', direction: 'ltr',
                    }}
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
