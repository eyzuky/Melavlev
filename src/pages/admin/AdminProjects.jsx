import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, Save, X, Loader2 } from 'lucide-react';

const emptyProject = {
  title_he: '', title_en: '', description_he: '', description_en: '',
  results_he: '', results_en: '', tags: '[]', sort_order: 0, is_featured: false,
  video_url: '',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // project object or null
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {} finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleNew = () => {
    setEditing({ ...emptyProject, sort_order: projects.length + 1 });
    setIsNew(true);
  };

  const handleEdit = (project) => {
    setEditing({
      ...project,
      tags: typeof project.tags === 'string' ? project.tags : JSON.stringify(project.tags),
    });
    setIsNew(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      setEditing(null);
      showToast(isNew ? 'פרויקט נוצר' : 'פרויקט עודכן');
      await loadProjects();
    } catch {
      showToast('שגיאה בשמירה');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('למחוק את הפרויקט?')) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
    showToast('פרויקט נמחק');
    await loadProjects();
  };

  const updateField = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '1.75rem' }}>
          ניהול פרויקטים
        </h2>
        <button onClick={handleNew} className="btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> הוסף פרויקט
        </button>
      </div>

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

      {/* Edit Form */}
      {editing && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          border: '2px solid var(--green-sage)', marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600 }}>{isNew ? 'פרויקט חדש' : 'עריכת פרויקט'}</h3>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="כותרת (עברית)" value={editing.title_he} onChange={v => updateField('title_he', v)} dir="rtl" />
            <Field label="Title (English)" value={editing.title_en} onChange={v => updateField('title_en', v)} dir="ltr" />
            <Field label="תיאור (עברית)" value={editing.description_he} onChange={v => updateField('description_he', v)} dir="rtl" rows={4} />
            <Field label="Description (English)" value={editing.description_en} onChange={v => updateField('description_en', v)} dir="ltr" rows={4} />
            <Field label="תוצאות (עברית, מופרדות ב-|)" value={editing.results_he} onChange={v => updateField('results_he', v)} dir="rtl" rows={2} />
            <Field label="Results (English, pipe-separated)" value={editing.results_en} onChange={v => updateField('results_en', v)} dir="ltr" rows={2} />
            <Field label='תגיות (JSON)' value={editing.tags} onChange={v => updateField('tags', v)} dir="ltr" rows={2} />
            <Field
              label='קישור לווידאו (YouTube / Vimeo / .mp4)'
              value={editing.video_url || ''}
              onChange={v => updateField('video_url', v)}
              dir="ltr"
            />
            <div>
              <label style={labelStyle}>סדר מיון</label>
              <input
                type="number"
                value={editing.sort_order}
                onChange={e => updateField('sort_order', parseInt(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editing.is_featured}
                onChange={e => updateField('is_featured', e.target.checked)}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>פרויקט מומלץ (מוצג בדף הבית)</span>
            </label>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ gap: '0.5rem' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isNew ? 'צור פרויקט' : 'שמור שינויים'}
            </button>
            <button onClick={() => setEditing(null)} className="btn-secondary">ביטול</button>
          </div>
        </div>
      )}

      {/* Project List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>אין פרויקטים. לחצו "הוסף פרויקט" כדי להתחיל.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map(p => (
            <div key={p.id} style={{
              background: 'white', borderRadius: '12px', padding: '1.25rem',
              border: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {p.is_featured && <Star size={16} fill="var(--brown-sand)" color="var(--brown-sand)" />}
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title_he}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    סדר: {p.sort_order} {p.images?.length > 0 && `· ${p.images.length} תמונות`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(p)} style={iconBtnStyle}><Pencil size={16} /></button>
                <button onClick={() => handleDelete(p.id)} style={{ ...iconBtnStyle, color: '#E74C3C' }}><Trash2 size={16} /></button>
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
  fontFamily: "var(--font-body)", fontSize: '0.875rem',
  outline: 'none',
};

const iconBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '0.5rem', borderRadius: '6px', color: 'var(--text-muted)',
  transition: 'background 0.15s',
};

function Field({ label, value, onChange, dir = 'rtl', rows = 1 }) {
  const Tag = rows > 1 ? 'textarea' : 'input';
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows > 1 ? rows : undefined}
        dir={dir}
        style={{ ...inputStyle, resize: rows > 1 ? 'vertical' : 'none' }}
      />
    </div>
  );
}
