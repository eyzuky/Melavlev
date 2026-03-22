export default function ProcessStep({ number, title, bullets = [], isLast = false }) {
  return (
    <div className="relative flex-1 p-6" style={{ minWidth: '250px' }}>
      <div style={{
        position: 'absolute', top: '-1rem', fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600, fontSize: '6rem', lineHeight: 1,
        color: 'var(--color-clay)', opacity: 0.07,
      }}>
        {number}
      </div>
      <div className="relative">
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
          fontSize: '1.25rem', color: 'var(--color-clay)', marginBottom: '0.5rem',
        }}>
          {number}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem' }}>
          {title}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {b}
            </li>
          ))}
        </ul>
      </div>
      {!isLast && (
        <div className="hidden md:block" style={{
          position: 'absolute', top: '50%',
          left: 0, width: '2px', height: '60%',
          transform: 'translateY(-50%)',
          borderLeft: '2px dotted var(--color-linen)',
        }} />
      )}
    </div>
  );
}
