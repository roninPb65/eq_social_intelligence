import { useState } from 'react';
import ScenarioCard from './components/ScenarioCard';
import Simulator from './components/Simulator';
import { scenarios } from './data/scenarios';

const SKILLS = ['All', 'Emotional Regulation', 'Social Intelligence', 'Empathy in Practice', 'Conflict Navigation'];

export default function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? scenarios : scenarios.filter(s => s.skill === filter);

  if (activeScenario) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Simulator scenario={activeScenario} onBack={() => setActiveScenario(null)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 40px',
        borderBottom: '0.5px solid rgba(26,23,20,0.1)',
        position: 'sticky', top: 0, background: 'var(--cream)', zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>
          EQ<span style={{ color: 'var(--accent)' }}>Rise</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#EAF3EC', color: '#1A4530',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 12, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D6A50' }} />
            12 day streak
          </div>
          <div style={{
            background: '#FBF5E6', color: '#5C3D00',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 12, fontWeight: 500,
          }}>
            1,240 XP
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '56px 40px 40px', maxWidth: 900, margin: '0 auto', animation: 'fadeUp 0.5s ease' }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 500, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--accent)',
          marginBottom: 16,
        }}>AI Scenario Simulator</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,54px)',
          letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16,
        }}>
          Practice the conversations<br />
          <em style={{ color: 'var(--accent)' }}>you dread having.</em>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-60)', maxWidth: 500, lineHeight: 1.75, marginBottom: 40 }}>
          Safe AI-powered roleplays of real emotional situations. Get live coaching after each exchange. No judgment — just reps.
        </p>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
          {SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => setFilter(skill)}
              style={{
                border: `0.5px solid ${filter === skill ? 'rgba(26,23,20,0.5)' : 'rgba(26,23,20,0.15)'}`,
                borderRadius: 20, padding: '7px 16px',
                fontSize: 13, fontWeight: filter === skill ? 500 : 400,
                background: filter === skill ? '#1A1714' : 'transparent',
                color: filter === skill ? '#FAF7F2' : 'var(--ink)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{skill}</button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
        padding: '0 40px 60px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {filtered.map((scenario, i) => (
          <ScenarioCard key={scenario.id} scenario={scenario} onSelect={setActiveScenario} index={i} />
        ))}
      </div>

      {/* How it works */}
      <div style={{
        borderTop: '0.5px solid rgba(26,23,20,0.1)',
        padding: '60px 40px',
        background: '#1A1714',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>
            How the simulator works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { num: '01', title: 'Choose a scenario', body: 'Pick a real-life situation that challenges your emotional skills — at work, home, or in relationships.' },
              { num: '02', title: 'Converse with AI', body: 'The AI plays the other person — authentically difficult. Your words shape how they respond.' },
              { num: '03', title: 'Get live coaching', body: 'Every few exchanges, your AI coach surfaces what you did well and what to try differently.' },
            ].map(item => (
              <div key={item.num} style={{ borderTop: '0.5px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'rgba(255,255,255,0.12)', marginBottom: 10 }}>{item.num}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#FAF7F2', marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.55)', lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
