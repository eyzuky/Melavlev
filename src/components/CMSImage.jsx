import { useImages } from '../hooks/useImages';

export default function CMSImage({ imageKey, alt, aspectRatio = '16/9', className = '' }) {
  const { getImageUrl } = useImages();
  const src = getImageUrl(imageKey);

  if (!src) {
    return (
      <div
        style={{ aspectRatio, background: 'linear-gradient(135deg, var(--color-linen), var(--color-parchment))' }}
        className={`rounded-lg flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: "'Jost', sans-serif" }}>
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div style={{ aspectRatio }} className={`rounded-lg overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
