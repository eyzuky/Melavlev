import CMSImage from './CMSImage';

function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // YouTube watch / short links
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

export default function ProjectCard({ title, tags = [], description, results = [], imageKey, imageUrl, imageAlt, videoUrl, imageRight = true, aspectRatio = '4/3' }) {
  const embedUrl = toEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl && !embedUrl && /\.(mp4|webm|ogg)$/i.test(videoUrl);

  return (
    <div className="card p-0 overflow-hidden" style={{ border: '1px solid var(--color-linen)' }}>
      <div className={`flex flex-col ${imageRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="md:w-2/5">
          {embedUrl ? (
            <div style={{ aspectRatio }} className="h-full overflow-hidden">
              <iframe
                src={embedUrl}
                title={imageAlt || title}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          ) : isDirectVideo ? (
            <div style={{ aspectRatio }} className="h-full overflow-hidden">
              <video
                src={videoUrl}
                controls
                preload="metadata"
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : imageUrl ? (
            <div style={{ aspectRatio }} className="h-full overflow-hidden">
              <img src={imageUrl} alt={imageAlt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <CMSImage imageKey={imageKey} alt={imageAlt} aspectRatio={aspectRatio} className="h-full" />
          )}
        </div>
        <div className="md:w-3/5 p-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div className="flex flex-wrap gap-2 mb-4" style={{ justifyContent: 'center' }}>
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
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {description}
          </p>
          {results.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'start', maxWidth: '420px', marginInline: 'auto' }}>
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
