import { useState, useEffect, useRef } from 'react';

export default function StatCard({ number, label, description, light = false }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const raw = number.replace(/[^0-9]/g, '');
        const target = parseInt(raw, 10);
        const suffix = number.replace(/[0-9,]/g, '');
        const hasComma = number.includes(',');
        const duration = 1500;
        const steps = 40;
        const stepTime = duration / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += Math.ceil(target / steps);
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          const formatted = hasComma
            ? current.toLocaleString()
            : current.toString();
          setDisplay(formatted + suffix);
        }, stepTime);
      }
    }, { threshold: 0.5 });

    const el = ref.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [number]);

  return (
    <div ref={ref} className="text-center p-6">
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: '3rem', lineHeight: 1.1,
        color: light ? 'white' : 'var(--color-clay)',
        animation: 'countUp 0.6s ease forwards',
      }}>
        {display}
      </div>
      <div style={{
        fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem',
        color: light ? 'rgba(255,255,255,0.9)' : 'var(--color-earth)',
      }}>
        {label}
      </div>
      {description && (
        <div style={{
          fontSize: '0.875rem', marginTop: '0.25rem',
          color: light ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
        }}>
          {description}
        </div>
      )}
    </div>
  );
}
