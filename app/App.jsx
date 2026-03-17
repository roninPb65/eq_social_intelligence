import { useState } from 'react';
import ScenarioCard from './components/ScenarioCard';
import Simulator from './components/Simulator';
import GoalsTracker from './components/GoalsTracker';
import { scenarios } from './data/scenarios';

const SKILLS = ['All', 'Emotional Regulation', 'Social Intelligence', 'Self-Awareness', 'Empathy in Practice', 'Conflict Navigation'];

export default function App() {
  const [view, setView] = useState('home');
  const [activeScenario, setActiveScenario] = useState(null);
  const [filter, setFilter] = useState('All');
  const [totalXP, setTotalXP] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);

  const filtered = filter === 'All' ? scenarios : scenarios.filter(s => s.skill === filter);

  const handleSessionComplete = (scenarioId, xp) => {
    if (completedIds.includes(scenarioId)) return;
    setCompletedIds(prev => [...prev, scenarioId]);
    setTotalXP(prev => prev + xp);
  };

  if (activeScenario) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Simulator
          scenario={activeScenario}
          onBack={() => setActiveScenario(null)}
          onComplete={(xp) => handleSessionComplete(activeScenario.id, xp)}
        />
      </div>
    );
  }

  if (view === 'goals') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Nav view={view} setView={setView} totalXP={totalXP} completedCount={completedIds.length} />
        <GoalsTracker onBack={() => setView('home')} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Nav view={view} setView={setView} totalXP={totalXP} completedCount={completedIds.length} />

      {/* Hero */}
      <div style={{ padding: '52px 40px 36px', maxWidth: 860, margin: '0 auto', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>
          AI Scenario Simulator
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4.5vw,50px)', letterSpacing: '-1px', lineHeight: 1.12, marginBottom: 14 }}>
          Practice the conversations<br />
          <em style={{ color: 'var(--accent)' }}>you find difficult.</em>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-60)', maxWidth: 480, lineHeight: 1.8, marginBottom: 14 }}>
          A private space to practise real emotional situations with an AI. Receive live coaching after each exchange — no pressure, no judgment.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          <button onClick={() => setView('goals')} style={{
            background: 'none', border: '0.5px solid rgba(26,23,20,0.18)',
            borderRadius: 20, padding: '7px 16px', fontSize: 13, color: 'var(--ink)',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            View 6-week growth programs →
          </button>
          <div style={{ fontSize: 12, color: 'var(--ink-30)' }}>Progress saved automatically</div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {SKILLS.map(skill => (
            <button key={skill} onClick={() => setFilter(skill)} style={{
              border: `0.5px solid ${filter === skill ? 'rgba(26,23,20,0.45)' : 'rgba(26,23,20,0.13)'}`,
              borderRadius: 20, padding: '6px 15px',
              fontSize: 13, fontWeight: filter === skill ? 500 : 400,
              background: filter === skill ? '#1A1714' : 'transparent',
              color: filter === skill ? '#FAF7F2' : 'var(--ink)',
              cursor: 'pointer', transition: 'all 0.18s',
            }}>{skill}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, padding: '0 40px 64px', maxWidth: 1080, margin: '0 auto' }}>
        {filtered.map((scenario, i) => (
          <ScenarioCard key={scenario.id} scenario={scenario} onSelect={setActiveScenario} index={i} completed={completedIds.includes(scenario.id)} />
        ))}
      </div>

      {/* How it works */}
      <div style={{ borderTop: '0.5px solid rgba(26,23,20,0.08)', padding: '56px 40px', background: '#F5F2ED' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 20 }}>How it works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            {[
              { num: '01', title: 'Choose a scenario', body: 'Pick a real-life situation that challenges your emotional skills — at work, in relationships, or with yourself.' },
              { num: '02', title: 'Converse with AI', body: 'The AI plays the other person authentically. Your words and tone shape how they respond.' },
              { num: '03', title: 'Get live coaching', body: 'Your AI coach gives you specific, honest feedback after every few exchanges — not praise, but insight.' },
            ].map(item => (
              <div key={item.num} style={{ borderTop: '0.5px solid rgba(26,23,20,0.15)', paddingTop: 18 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'rgba(26,23,20,0.1)', marginBottom: 10 }}>{item.num}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 7 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sensitivity note */}
      <div style={{ padding: '28px 40px', background: 'var(--cream)', borderTop: '0.5px solid rgba(26,23,20,0.07)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', fontSize: 12, color: 'var(--ink-30)', lineHeight: 1.7 }}>
          This app is a private space for personal reflection and practice. Conversations are not stored or shared.
          These scenarios deal with real emotional situations — take breaks when you need to.
        </div>
      </div>
    </div>
  );
}

function Nav({ view, setView, totalXP, completedCount }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 40px', borderBottom: '0.5px solid rgba(26,23,20,0.08)',
      position: 'sticky', top: 0, background: 'var(--cream)', zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>
          EQ<span style={{ color: 'var(--accent)' }}>Rise</span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {[
            { id: 'home', label: 'Simulator' },
            { id: 'goals', label: '6-Week Goals' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} style={{
              background: view === tab.id ? 'rgba(26,23,20,0.06)' : 'none',
              border: 'none', borderRadius: 20, padding: '5px 13px',
              fontSize: 13, fontWeight: view === tab.id ? 500 : 400,
              color: view === tab.id ? 'var(--ink)' : 'var(--ink-60)',
              cursor: 'pointer', transition: 'all 0.18s',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {completedCount > 0 && (
          <div style={{ background: '#EAF3EC', color: '#1A4530', borderRadius: 20, padding: '4px 11px', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2D6A50' }} />
            {completedCount} done
          </div>
        )}
        {totalXP > 0 && (
          <div style={{ background: '#FBF5E6', color: '#5C3D00', borderRadius: 20, padding: '4px 11px', fontSize: 12, fontWeight: 500 }}>
            {totalXP} XP
          </div>
        )}
      </div>
    </nav>
  );
}
