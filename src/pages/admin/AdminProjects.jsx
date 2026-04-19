import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Star, Save, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

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
      return data.projects || [];
    } catch {
      return [];
    } finally { setLoading(false); }
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
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json().catch(() => ({}));
      const savedId = isNew ? data.project?.id : editing.id;
      showToast(isNew ? 'פרויקט נוצר — הוסיפו תמונה למטה' : 'פרויקט עודכן');

      const fresh = await loadProjects();
      const refreshed = fresh.find(p => p.id === savedId);
      if (refreshed) {
        setEditing({
          ...refreshed,
          tags: typeof refreshed.tags === 'string' ? refreshed.tags : JSON.stringify(refreshed.tags),
        });
        setIsNew(false);
      } else {
        setEditing(null);
      }
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

  const refreshEditingImages = async () => {
    const fresh = await loadProjects();
    const refreshed = fresh.find(p => p.id === editing?.id);
    if (refreshed) {
      setEditing(prev => ({ ...prev, images: refreshed.images }));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem' }}>
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
            <h3 style={{ fontWeight: 700 }}>{isNew ? 'פרויקט חדש' : 'עריכת פרויקט'}</h3>
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
            <button onClick={() => setEditing(null)} className="btn-secondary">סגור</button>
          </div>

          {/* Per-project image manager */}
          <div style={{
            marginTop: '2rem', paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)',
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} /> תמונות הפרויקט
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              התמונה הראשונה (לפי סדר מיון) היא זו שמוצגת בכרטיס הפרויקט באתר.
            </p>

            {editing.id ? (
              <ProjectImagesPanel
                projectId={editing.id}
                images={editing.images || []}
                onChanged={refreshEditingImages}
                onToast={showToast}
              />
            ) : (
              <div style={{
                padding: '1rem', background: 'var(--green-whisper)',
                borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)',
              }}>
                שמרו את הפרויקט תחילה כדי להוסיף לו תמונות.
              </div>
            )}
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
          {projects.map(p => {
            const cover = (p.images || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))[0];
            return (
              <div key={p.id} style={{
                background: 'white', borderRadius: '12px', padding: '1.25rem',
                border: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <div style={{
                    width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden',
                    flexShrink: 0, background: 'var(--green-whisper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cover ? (
                      <img src={cover.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={20} color="var(--green-sage)" />
                    )}
                  </div>
                  {p.is_featured && <Star size={16} fill="var(--brown-sand)" color="var(--brown-sand)" />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title_he}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      סדר: {p.sort_order} {p.images?.length > 0 ? `· ${p.images.length} תמונות` : '· ללא תמונה'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(p)} style={iconBtnStyle}><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...iconBtnStyle, color: '#E74C3C' }}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectImagesPanel({ projectId, images, onChanged, onToast }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [altHe, setAltHe] = useState('');
  const [altEn, setAltEn] = useState('');

  const sorted = [...(images || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      onToast('בחרו קובץ תמונה');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('upload failed');
      const { url } = await uploadRes.json();

      await fetch('/api/admin/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          category: 'project',
          project_id: projectId,
          alt_he: altHe,
          alt_en: altEn,
          sort_order: sorted.length + 1,
        }),
      });

      fileRef.current.value = '';
      setAltHe('');
      setAltEn('');
      onToast('תמונה נוספה לפרויקט');
      await onChanged();
    } catch {
      onToast('שגיאה בהעלאה');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('למחוק את התמונה מהפרויקט?')) return;
    await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
    onToast('תמונה נמחקה');
    await onChanged();
  };

  const handleUpdateSort = async (img, newSort) => {
    await fetch('/api/admin/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...img,
        project_id: projectId,
        category: 'project',
        sort_order: newSort,
      }),
    });
    await onChanged();
  };

  return (
    <div>
      {/* Upload zone */}
      <div style={{
        background: 'var(--green-whisper)', borderRadius: '8px',
        padding: '1rem', marginBottom: '1rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr auto', gap: '0.5rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>קובץ תמונה</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ fontSize: '0.85rem' }} />
          </div>
          <div>
            <label style={labelStyle}>כיתוב (עברית)</label>
            <input value={altHe} onChange={e => setAltHe(e.target.value)} style={inputStyle} dir="rtl" />
          </div>
          <div>
            <label style={labelStyle}>Caption (English)</label>
            <input value={altEn} onChange={e => setAltEn(e.target.value)} style={inputStyle} dir="ltr" />
          </div>
          <button onClick={handleUpload} disabled={uploading} className="btn-primary" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            העלה
          </button>
        </div>
      </div>

      {/* Existing images grid */}
      {sorted.length === 0 ? (
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
          עדיין אין תמונות לפרויקט זה.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {sorted.map((img, idx) => (
            <div key={img.id} style={{
              background: 'white', borderRadius: '8px', overflow: 'hidden',
              border: idx === 0 ? '2px solid var(--green-forest)' : '1px solid var(--border-light)',
              position: 'relative',
            }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={img.url} alt={img.alt_he || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              {idx === 0 && (
                <div style={{
                  position: 'absolute', top: '0.35rem', right: '0.35rem',
                  background: 'var(--green-forest)', color: 'white',
                  fontSize: '0.65rem', fontWeight: 700,
                  padding: '0.2rem 0.5rem', borderRadius: '4px',
                  letterSpacing: '0.05em',
                }}>
                  תמונת שער
                </div>
              )}
              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.alt_he || '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>סדר:</label>
                  <input
                    type="number"
                    value={img.sort_order || 0}
                    onChange={e => handleUpdateSort(img, parseInt(e.target.value) || 0)}
                    style={{ ...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '60px' }}
                  />
                  <button
                    onClick={() => handleDelete(img.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '0.25rem', marginInlineStart: 'auto', color: '#E74C3C',
                    }}
                    aria-label="מחק"
                  >
                    <Trash2 size={14} />
                  </button>
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
