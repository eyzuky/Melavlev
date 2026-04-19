import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Pencil, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  { value: 'general', label: 'כללי' },
  { value: 'project', label: 'פרויקט' },
  { value: 'hero', label: 'דף הבית' },
  { value: 'pillar', label: 'עמוד מודל' },
  { value: 'gallery', label: 'גלריה' },
  { value: 'solution', label: 'פתרונות' },
];

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef();

  // Upload form state
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadAltHe, setUploadAltHe] = useState('');
  const [uploadAltEn, setUploadAltEn] = useState('');
  const [uploadKey, setUploadKey] = useState('');
  const [uploadProjectId, setUploadProjectId] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [imgRes, projRes] = await Promise.all([
        fetch('/api/admin/images'),
        fetch('/api/admin/projects'),
      ]);
      const imgData = await imgRes.json();
      const projData = await projRes.json();
      setImages(imgData.images || []);
      setProjects(projData.projects || []);
    } catch {} finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const { url } = await uploadRes.json();

      // Save image metadata
      await fetch('/api/admin/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          image_key: uploadKey || null,
          alt_he: uploadAltHe,
          alt_en: uploadAltEn,
          category: uploadCategory,
          project_id: uploadProjectId ? parseInt(uploadProjectId) : null,
        }),
      });

      // Reset form
      fileRef.current.value = '';
      setUploadAltHe('');
      setUploadAltEn('');
      setUploadKey('');
      setUploadProjectId('');
      setUploadCategory('general');
      showToast('תמונה הועלתה בהצלחה');
      await loadData();
    } catch {
      showToast('שגיאה בהעלאה');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('למחוק את התמונה?')) return;
    await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
    showToast('תמונה נמחקה');
    await loadData();
  };

  const handleSaveEdit = async () => {
    await fetch('/api/admin/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    showToast('עודכן בהצלחה');
    await loadData();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '1.75rem', marginBottom: '2rem' }}>
        ניהול תמונות
      </h2>

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

      {/* Upload Zone */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '1.5rem',
        border: '2px dashed var(--green-pale)', marginBottom: '2rem',
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={18} /> העלאת תמונה חדשה
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>קובץ</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ fontSize: '0.85rem' }} />
          </div>
          <div>
            <label style={labelStyle}>קטגוריה</label>
            <select
              value={uploadCategory}
              onChange={e => setUploadCategory(e.target.value)}
              style={inputStyle}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>טקסט חלופי (עברית)</label>
            <input value={uploadAltHe} onChange={e => setUploadAltHe(e.target.value)} style={inputStyle} dir="rtl" />
          </div>
          <div>
            <label style={labelStyle}>Alt text (English)</label>
            <input value={uploadAltEn} onChange={e => setUploadAltEn(e.target.value)} style={inputStyle} dir="ltr" />
          </div>
          <div>
            <label style={labelStyle}>מפתח תמונה (למשל: model_pillar_1)</label>
            <input value={uploadKey} onChange={e => setUploadKey(e.target.value)} style={inputStyle} dir="ltr" />
          </div>
          <div>
            <label style={labelStyle}>שיוך לפרויקט</label>
            <select value={uploadProjectId} onChange={e => setUploadProjectId(e.target.value)} style={inputStyle}>
              <option value="">ללא</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title_he}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleUpload} disabled={uploading} className="btn-primary" style={{ gap: '0.5rem' }}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'מעלה...' : 'העלה תמונה'}
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          border: '2px solid var(--green-sage)', marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>עריכת תמונה</h3>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>מפתח</label>
              <input value={editing.image_key || ''} onChange={e => setEditing({ ...editing, image_key: e.target.value })} style={inputStyle} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>קטגוריה</label>
              <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>טקסט חלופי (עברית)</label>
              <input value={editing.alt_he} onChange={e => setEditing({ ...editing, alt_he: e.target.value })} style={inputStyle} dir="rtl" />
            </div>
            <div>
              <label style={labelStyle}>Alt text (English)</label>
              <input value={editing.alt_en} onChange={e => setEditing({ ...editing, alt_en: e.target.value })} style={inputStyle} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>שיוך לפרויקט</label>
              <select value={editing.project_id || ''} onChange={e => setEditing({ ...editing, project_id: e.target.value ? parseInt(e.target.value) : null })} style={inputStyle}>
                <option value="">ללא</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title_he}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>סדר</label>
              <input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
          <button onClick={handleSaveEdit} className="btn-primary" style={{ marginTop: '1rem', gap: '0.5rem' }}>
            <Save size={16} /> שמור
          </button>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>אין תמונות. העלו את התמונה הראשונה למעלה.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {images.map(img => (
            <div key={img.id} style={{
              background: 'white', borderRadius: '12px', overflow: 'hidden',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={img.url} alt={img.alt_he} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.alt_he || img.image_key || 'ללא שם'}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    background: 'var(--green-blush)', color: 'var(--green-mid)',
                  }}>
                    {CATEGORIES.find(c => c.value === img.category)?.label || img.category}
                  </span>
                  {img.image_key && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
                      background: 'var(--brown-parchment)', color: 'var(--brown-mid)', fontFamily: 'monospace',
                    }}>
                      {img.image_key}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button onClick={() => setEditing(img)} style={iconBtnStyle}><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(img.id)} style={{ ...iconBtnStyle, color: '#E74C3C' }}><Trash2 size={14} /></button>
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
  fontFamily: "var(--font-body)", fontSize: '0.875rem',
  outline: 'none',
};

const iconBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '0.35rem', borderRadius: '4px', color: 'var(--text-muted)',
};
