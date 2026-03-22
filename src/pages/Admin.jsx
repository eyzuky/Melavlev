import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { FileText, FolderOpen, Image, LogOut } from 'lucide-react';
import LeafAccent from '../components/LeafAccent';
import AdminLogin from './admin/AdminLogin';
import AdminContent from './admin/AdminContent';
import AdminProjects from './admin/AdminProjects';
import AdminImages from './admin/AdminImages';

const navItems = [
  { path: 'content', label: 'תוכן', icon: FileText },
  { path: 'projects', label: 'פרויקטים', icon: FolderOpen },
  { path: 'images', label: 'תמונות', icon: Image },
];

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null=loading, true/false
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/verify')
      .then(r => r.json())
      .then(d => setAuthed(d.valid))
      .catch(() => setAuthed(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white-warm)' }}>
        <div style={{ color: 'var(--text-muted)' }}>טוען...</div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px', background: 'var(--green-deep)', padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(200,221,208,0.2)' }}>
          <LeafAccent size={28} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.25rem', color: 'var(--green-pale)' }}>
              מלבלב
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--green-sage)' }}>
              ניהול תוכן
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.75rem', borderRadius: '6px',
                fontSize: '0.9rem', fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--green-pale)' : 'var(--green-light)',
                background: isActive ? 'var(--green-forest)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
                textDecoration: 'none',
              })}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', borderRadius: '6px', border: 'none',
            background: 'none', cursor: 'pointer', width: '100%',
            fontSize: '0.9rem', color: 'var(--green-sage)',
            transition: 'color 0.15s',
          }}
        >
          <LogOut size={18} />
          התנתק
        </button>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1, padding: '2rem 3rem', background: 'var(--white-warm)',
        overflowY: 'auto', maxHeight: '100vh',
      }}>
        <Routes>
          <Route index element={<Navigate to="content" replace />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="images" element={<AdminImages />} />
        </Routes>
      </main>
    </div>
  );
}
