export default function LeafAccent({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 32 C8 32 10 10 32 8 C32 8 20 20 8 32Z"
        fill="var(--color-sage)" opacity="0.7"/>
      <path d="M8 32 L20 20" stroke="var(--color-sage-dark)" strokeWidth="1.5"/>
    </svg>
  );
}
