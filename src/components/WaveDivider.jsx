export default function WaveDivider({ flip = false, color = 'var(--color-parchment)' }) {
  return (
    <div style={{ lineHeight: 0, transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '60px' }}>
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={color} />
      </svg>
    </div>
  );
}
