import { skillColors } from '../data/scenarios';

const difficultyColors = {
  Beginner:     { bg: '#EAF3EC', text: '#1A4530' },
  Intermediate: { bg: '#FBF5E6', text: '#5C3D00' },
  Advanced:     { bg: '#FAECE7', text: '#4A1B0C' },
};

export default function ScenarioCard({ scenario, onSelect, index }) {
  const sc = skillColors[scenario.skillColor];
  const dc = difficultyColors[scenario.difficulty];

  return (
    <div
      onClick={() => onSelect(scenario)}
      style={{
        background: '#fff',
        border: '0.5px solid rgba(26,23,20,0.12)',
        borderRadius: 20,
        padding: '28px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        animation: `fadeUp 0.4s ease ${index * 0.08}s both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(26,23,20,0.3)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,23,20,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(26,23,20,0.12)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          background: sc.bg, color: sc.text,
          fontSize: 11, fontWeight: 500, letterSpacing: '1px',
          textTransform: 'uppercase', padding: '4px 10px',
          borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
          {scenario.skill}
        </div>
        <div style={{
          background: dc.bg, color: dc.text,
          fontSize: 11, fontWeight: 500, padding: '4px 10px',
          borderRadius: 20, letterSpacing: '0.5px',
        }}>
          {scenario.difficulty}
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--ink-60)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
        {scenario.context}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.3px', marginBottom: 10, lineHeight: 1.2 }}>
        {scenario.title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.65, marginBottom: 20 }}>
        {scenario.setup}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: sc.bg, color: sc.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 500,
          }}>
            {scenario.persona.avatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{scenario.persona.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>{scenario.persona.role}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: sc.dot, fontWeight: 500 }}>+{scenario.xp} XP →</div>
      </div>
    </div>
  );
}
