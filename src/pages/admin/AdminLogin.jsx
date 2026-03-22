import { useState } from 'react';
import LeafAccent from '../../components/LeafAccent';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'שגיאה');
        return;
      }
      onLogin();
    } catch {
      setError('שגיאת חיבור');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--white-warm)', direction: 'rtl',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: '16px', padding: '3rem',
        boxShadow: 'var(--shadow-lg)', maxWidth: '400px', width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <LeafAccent size={48} />
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          ניהול מלבלב
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          הזינו סיסמה כדי להיכנס
        </p>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="סיסמה"
          style={{
            width: '100%', padding: '0.75rem 1rem',
            border: '1.5px solid var(--green-pale)', borderRadius: '8px',
            fontFamily: "'Jost', sans-serif", fontSize: '1rem',
            outline: 'none', marginBottom: '1rem', textAlign: 'center',
          }}
          autoFocus
        />

        {error && (
          <p style={{ color: '#E74C3C', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '...מתחבר' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}
