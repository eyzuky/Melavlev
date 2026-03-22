import CMSImage from './CMSImage';

export default function ProjectCard({ title, tags = [], description, results = [], imageKey, imageAlt, imageRight = true, aspectRatio = '4/3' }) {
  return (
    <div className="card p-0 overflow-hidden" style={{ border: '1px solid var(--color-linen)' }}>
      <div className={`flex flex-col ${imageRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="md:w-2/5">
          <CMSImage imageKey={imageKey} alt={imageAlt} aspectRatio={aspectRatio} className="rounded-none h-full" />
        </div>
        <div className="md:w-3/5 p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: '0.75rem', fontWeight: 700,
                padding: '0.25rem 0.75rem', borderRadius: '4px',
                background: tag.color === 'clay' ? 'var(--color-clay)' : 'var(--color-sage)',
                color: 'white',
              }}>
                {tag.label}
              </span>
            ))}
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {description}
          </p>
          {results.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {results.map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-sage)', fontWeight: 700 }}>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
