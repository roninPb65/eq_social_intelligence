import { useEffect, useState } from 'react';

export default function ScoreBar({ label, value, color, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: 'var(--ink-60)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 500, color }}>{displayed}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(26,23,20,0.08)', borderRadius: 3 }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: color,
          width: `${displayed}%`,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}
