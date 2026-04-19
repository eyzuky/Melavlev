import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Pencil, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef();

  const [uploadAltHe, setUploadAltHe] = useState('');
  const [uploadAltEn, setUploadAltEn] = useState('');
  const [uploadSortOrder, setUploadSortOrder] = useState(0);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/images?category=gallery');
      const data = await res.json();
      setItems((data.images || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch {} finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      showToast('בחרו קובץ להעלאה');
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
          alt_he: uploadAltHe,
          alt_en: uploadAltEn,
          category: 'gallery',
          sort_order: uploadSortOrder || items.length + 1,
        }),
      });

      fileRef.current.value = '';
      setUploadAltHe('');
      setUploadAltEn('');
      setUploadSortOrder(0);
      showToast('פריט נוסף לגלריה');
      await loadData();
    } catch {
      showToast('שגיאה בהעלאה');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('למחוק את הפריט מהגלריה?')) return;
    await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
    showToast('נמחק');
    await loadData();
  };

  const handleSaveEdit = async () => {
    await fetch('/api/admin/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, category: 'gallery' }),
    });
    setEditing(null);
    showToast('עודכן');
    await loadData();
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', marginBottom: '2rem' }}>
        ניהול גלריה
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
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={18} /> הוספת פריט חדש לגלריה
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>קובץ תמונה</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ fontSize: '0.85rem' }} />
          </div>
          <div>
            <label style={labelStyle}>סדר הופעה</label>
            <input
              type="number"
              value={uploadSortOrder}
              onChange={e => setUploadSortOrder(parseInt(e.target.value) || 0)}
              style={inputStyle}
              placeholder="אוטומטי"
            />
          </div>
          <div>
            <label style={labelStyle}>כיתוב (עברית)</label>
            <input value={uploadAltHe} onChange={e => setUploadAltHe(e.target.value)} style={inputStyle} dir="rtl" />
          </div>
          <div>
            <label style={labelStyle}>Caption (English)</label>
            <input value={uploadAltEn} onChange={e => setUploadAltEn(e.target.value)} style={inputStyle} dir="ltr" />
          </div>
        </div>

        <button onClick={handleUpload} disabled={uploading} className="btn-primary" style={{ gap: '0.5rem' }}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'מעלה...' : 'הוסף לגלריה'}
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          border: '2px solid var(--green-sage)', marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>עריכת פריט</h3>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>כיתוב (עברית)</label>
              <input value={editing.alt_he || ''} onChange={e => setEditing({ ...editing, alt_he: e.target.value })} style={inputStyle} dir="rtl" />
            </div>
            <div>
              <label style={labelStyle}>Caption (English)</label>
              <input value={editing.alt_en || ''} onChange={e => setEditing({ ...editing, alt_en: e.target.value })} style={inputStyle} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>סדר הופעה</label>
              <input type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
          <button onClick={handleSaveEdit} className="btn-primary" style={{ marginTop: '1rem', gap: '0.5rem' }}>
            <Save size={16} /> שמור
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>טוען...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>אין עדיין פריטים בגלריה. הוסיפו את הראשון למעלה.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: 'white', borderRadius: '12px', overflow: 'hidden',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={item.url} alt={item.alt_he || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.alt_he || item.alt_en || 'ללא כיתוב'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  סדר: {item.sort_order || 0}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button onClick={() => setEditing(item)} style={iconBtnStyle}><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} style={{ ...iconBtnStyle, color: '#E74C3C' }}><Trash2 size={14} /></button>
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
  padding: '0.35rem', borderRadius: '4px', color: 'var(--text-muted)',
};
