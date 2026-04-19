export default function SectionTitle({ label, title, subtitle, centered = false, light = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {label && (
        <span style={{
          fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '0.75rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: light ? 'rgba(255,255,255,0.7)' : 'var(--color-clay)',
          display: 'block', marginBottom: '0.75rem',
        }}>
          {label}
        </span>
      )}
      <h2 style={{ color: light ? 'white' : 'var(--color-earth)', marginBottom: '1rem' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          color: light ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
          fontSize: '1.125rem', maxWidth: centered ? '600px' : 'none',
          margin: centered ? '0 auto' : '0',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
