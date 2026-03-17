import { skillColors } from '../data/scenarios';

const difficultyColors = {
  Beginner:     { bg: '#EAF3EC', text: '#1A4530' },
  Intermediate: { bg: '#FBF5E6', text: '#5C3D00' },
  Advanced:     { bg: '#FAECE7', text: '#4A1B0C' },
};

export default function ScenarioCard({ scenario, onSelect, index, completed }) {
  const sc = skillColors[scenario.skillColor];
  const dc = difficultyColors[scenario.difficulty];

  return (
    <div
      onClick={() => onSelect(scenario)}
      style={{
        background: completed ? '#FAFAF8' : '#fff',
        border: `0.5px solid ${completed ? 'rgba(45,106,80,0.2)' : 'rgba(26,23,20,0.1)'}`,
        borderRadius: 20,
        padding: '26px',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, border-color 0.18s ease',
        animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = completed ? 'rgba(45,106,80,0.35)' : 'rgba(26,23,20,0.22)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = completed ? 'rgba(45,106,80,0.2)' : 'rgba(26,23,20,0.1)';
      }}
    >
      {completed && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          width: 20, height: 20, borderRadius: '50%',
          background: '#2D6A50', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
        <div style={{
          background: sc.bg, color: sc.text,
          fontSize: 10, fontWeight: 500, letterSpacing: '1px',
          textTransform: 'uppercase', padding: '4px 10px',
          borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />
          {scenario.skill}
        </div>
        <div style={{
          background: dc.bg, color: dc.text,
          fontSize: 10, fontWeight: 500, padding: '4px 10px',
          borderRadius: 20, letterSpacing: '0.5px',
        }}>
          {scenario.difficulty}
        </div>
      </div>

      <div style={{ fontSize: 10, color: 'var(--ink-60)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 7 }}>
        {scenario.context}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 21, letterSpacing: '-0.3px', marginBottom: 9, lineHeight: 1.2 }}>
        {scenario.title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.7, marginBottom: 18 }}>
        {scenario.setup}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: sc.bg, color: sc.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 500,
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
