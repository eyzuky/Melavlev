export default function PageSkeleton() {
  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: '2rem',
          background: 'var(--color-linen)',
          borderRadius: '4px',
          marginBottom: '1rem',
          width: i === 2 ? '60%' : '100%',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  );
}
