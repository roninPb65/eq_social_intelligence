import { useState, useRef, useEffect } from 'react';
import { useSimulator } from '../hooks/useSimulator';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import { skillColors } from '../data/scenarios';

const EQBar = ({ label, value, color, icon }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: value > 0 ? color : 'var(--ink-30)' }}>{value}%</span>
    </div>
    <div style={{ height: 6, background: 'rgba(26,23,20,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3, background: color,
        width: `${value}%`, transition: 'width 1s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  </div>
);

const QuickReply = ({ text, onClick }) => (
  <button onClick={() => onClick(text)} style={{
    background: 'var(--cream)', border: '0.5px solid rgba(26,23,20,0.18)',
    borderRadius: 20, padding: '7px 14px', fontSize: 12,
    color: 'var(--ink)', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.18s', whiteSpace: 'nowrap',
  }}
  onMouseEnter={e => { e.target.style.borderColor = 'rgba(26,23,20,0.4)'; e.target.style.background = '#fff'; }}
  onMouseLeave={e => { e.target.style.borderColor = 'rgba(26,23,20,0.18)'; e.target.style.background = 'var(--cream)'; }}
  >{text}</button>
);

const quickRepliesBySkill = {
  'Emotional Regulation': [
    "I hear you — can we revisit this after the meeting?",
    "I'd like to understand your concerns about my idea.",
    "I felt dismissed just now. Can we talk privately?",
  ],
  'Social Intelligence': [
    "I've noticed you seem distant lately. Is everything okay?",
    "I miss spending time with you. No pressure, just checking in.",
    "Did I do something that upset you? I genuinely want to know.",
  ],
  'Empathy in Practice': [
    "That sounds really painful. I'm here if you want to talk.",
    "You don't have to pretend everything is fine with me.",
    "I can only imagine how disappointing that must feel.",
  ],
  'Conflict Navigation': [
    "You're right, I haven't been pulling my weight. I'm sorry.",
    "Help me understand what you need from me specifically.",
    "I don't want to fight. Can we really listen to each other?",
  ],
};

export default function Simulator({ scenario, onBack }) {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [allCoachNotes, setAllCoachNotes] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sc = skillColors[scenario.skillColor];

  const { messages, isTyping, sessionDone, coachNote, turnCount, score, sendMessage, reset } = useSimulator(scenario);

  useEffect(() => {
    if (coachNote && !allCoachNotes.includes(coachNote)) {
      setAllCoachNotes(prev => [...prev, coachNote]);
    }
  }, [coachNote]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, coachNote]);

  const handleSend = (text) => {
    const t = (text || input).trim();
    if (!t || isTyping) return;
    setInput('');
    sendMessage(t);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleReset = () => { setAllCoachNotes([]); reset(); };
  const avgScore = Math.round((score.empathy + score.clarity + score.regulation) / 3);
  const quickReplies = quickRepliesBySkill[scenario.skill] || [];

  // PRE-START BRIEFING
  if (!started) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px', animation: 'fadeUp 0.4s ease' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: 13,
          fontWeight: 500, marginBottom: 32, display: 'flex', alignItems: 'center',
          gap: 6, padding: 0, cursor: 'pointer',
        }}>← All scenarios</button>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { bg: sc.bg, color: sc.text, dot: sc.dot, text: scenario.skill },
            { bg: 'rgba(26,23,20,0.06)', color: 'var(--ink-60)', text: scenario.difficulty },
            { bg: 'rgba(26,23,20,0.06)', color: 'var(--ink-60)', text: scenario.context },
          ].map((b, i) => (
            <div key={i} style={{
              background: b.bg, color: b.color, fontSize: 11, fontWeight: 500,
              letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px',
              borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {b.dot && <div style={{ width: 6, height: 6, borderRadius: '50%', background: b.dot }} />}
              {b.text}
            </div>
          ))}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: '-0.8px', marginBottom: 28, lineHeight: 1.1 }}>
          {scenario.title}
        </h1>

        <div style={{ background: '#fff', border: '0.5px solid rgba(26,23,20,0.12)', borderRadius: 18, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 10 }}>The situation</div>
          <p style={{ fontSize: 16, lineHeight: 1.75, fontFamily: 'var(--font-display)' }}>{scenario.setup}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: sc.bg, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: sc.text, marginBottom: 12 }}>Who you're talking to</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', color: sc.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500 }}>{scenario.persona.avatar}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{scenario.persona.name}</div>
                <div style={{ fontSize: 12, color: sc.text, opacity: 0.8 }}>{scenario.persona.role}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: sc.text, lineHeight: 1.6, opacity: 0.85 }}>{scenario.persona.personality}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(26,23,20,0.04)', borderRadius: 16, padding: 20, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 8 }}>Learning goal</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65 }}>{scenario.learningGoal}</p>
            </div>
            <div style={{ background: 'rgba(26,23,20,0.04)', borderRadius: 16, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-60)', fontWeight: 500 }}>Reward</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: sc.dot }}>+{scenario.xp} XP</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(26,23,20,0.04)', border: '0.5px solid rgba(26,23,20,0.12)', borderRadius: 16, padding: 18, marginBottom: 20, display: 'flex', gap: 12 }}>
          <div style={{ fontSize: 18, flexShrink: 0, opacity: 0.7 }}>💡</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-60)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Before you start</div>
            <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.75 }}>{scenario.coachTip}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
          {[
            { icon: '🎭', label: '6 turns', desc: 'Real back-and-forth conversation' },
            { icon: '📊', label: 'Live EQ score', desc: 'Empathy, Clarity & Regulation tracked' },
            { icon: '🧠', label: 'AI coaching', desc: 'Feedback after every 3 exchanges' },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', border: '0.5px solid rgba(26,23,20,0.1)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-60)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setStarted(true)} style={{
          width: '100%', padding: 16, background: '#1A1714', color: '#FAF7F2',
          border: 'none', borderRadius: 28, fontSize: 15, fontWeight: 500, cursor: 'pointer',
        }}>Begin simulation →</button>
      </div>
    );
  }

  // ACTIVE SIMULATION
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' }}>

      {/* LEFT PANEL */}
      <div style={{ width: 250, flexShrink: 0, borderRight: '0.5px solid rgba(26,23,20,0.1)', display: 'flex', flexDirection: 'column', background: '#fff', overflowY: 'auto' }}>

        <div style={{ padding: '20px 18px 16px', borderBottom: '0.5px solid rgba(26,23,20,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: sc.bg, color: sc.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>{scenario.persona.avatar}</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{scenario.persona.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-60)' }}>{scenario.persona.role}</div>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: sc.bg, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 500, color: sc.text }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />
            {scenario.skill}
          </div>
        </div>

        <div style={{ padding: '14px 18px', borderBottom: '0.5px solid rgba(26,23,20,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Turn {turnCount}/6</span>
          </div>
          <div style={{ height: 5, background: 'rgba(26,23,20,0.08)', borderRadius: 3 }}>
            <div style={{ height: '100%', borderRadius: 3, background: sc.dot, width: `${(turnCount / 6) * 100}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div style={{ padding: '16px 18px', borderBottom: '0.5px solid rgba(26,23,20,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 14 }}>Live EQ score</div>
          <EQBar label="Empathy"    value={score.empathy}    color="#2D6A50" icon="🤝" />
          <EQBar label="Clarity"    value={score.clarity}    color="#2B4F82" icon="💬" />
          <EQBar label="Regulation" value={score.regulation} color="#C75B37" icon="🧘" />
          {avgScore > 0 && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(26,23,20,0.03)', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-60)', fontWeight: 500 }}>Overall</span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{avgScore}%</span>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 18px', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 12 }}>
            Coach notes {allCoachNotes.length > 0 && `(${allCoachNotes.length})`}
          </div>
          {allCoachNotes.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--ink-30)', lineHeight: 1.7, fontStyle: 'italic' }}>
              Your coach leaves feedback after every 3 exchanges.
            </div>
          ) : allCoachNotes.map((note, i) => (
            <div key={i} style={{ marginBottom: 10, padding: '10px 12px', background: 'rgba(26,23,20,0.03)', borderRadius: 10, borderLeft: '2px solid rgba(26,23,20,0.2)', animation: 'fadeUp 0.3s ease' }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--ink-60)', marginBottom: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>After turn {(i + 1) * 3}</div>
              <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.65 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div style={{ padding: '14px 24px', borderBottom: '0.5px solid rgba(26,23,20,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)', flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0 }}>← Back</button>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{scenario.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>{sessionDone ? '✓ Complete' : `${6 - turnCount} turns left`}</div>
        </div>

        <div style={{ padding: '10px 24px', background: sc.bg, borderBottom: `1px solid ${sc.dot}20`, fontSize: 13, color: sc.text, lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 500 }}>Situation: </strong>{scenario.setup}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ChatBubble message={{ role: 'assistant', content: scenario.openingLine }} personaName={scenario.persona.name} personaAvatar={scenario.persona.avatar} personaColor={sc} />

          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} personaName={scenario.persona.name} personaAvatar={scenario.persona.avatar} personaColor={sc} />
          ))}

          {isTyping && <TypingIndicator avatar={scenario.persona.avatar} color={sc} />}

          {coachNote && (
            <div style={{ background: 'rgba(26,23,20,0.03)', border: '0.5px solid rgba(26,23,20,0.12)', borderLeft: '2px solid rgba(26,23,20,0.25)', borderRadius: '0 10px 10px 0', padding: '12px 14px', animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--ink-60)', marginBottom: 5, letterSpacing: '1px', textTransform: 'uppercase' }}>Coach insight</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>{coachNote}</div>
            </div>
          )}

          {sessionDone && (
            <div style={{ background: '#fff', border: '0.5px solid rgba(26,23,20,0.12)', borderRadius: 18, padding: 24, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Session complete!</div>
              <div style={{ fontSize: 14, color: 'var(--ink-60)', marginBottom: 18, lineHeight: 1.65 }}>
                You completed <strong style={{ fontWeight: 500 }}>{scenario.title}</strong>. Here's how you did:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Empathy', val: score.empathy, color: '#2D6A50' },
                  { label: 'Clarity', val: score.clarity, color: '#2B4F82' },
                  { label: 'Regulation', val: score.regulation, color: '#C75B37' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(26,23,20,0.03)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.val}%</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: sc.bg, borderRadius: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: sc.text, fontWeight: 500 }}>XP earned</span>
                <span style={{ fontSize: 20, fontWeight: 500, color: sc.dot }}>+{scenario.xp}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleReset} style={{ flex: 1, padding: 12, background: '#1A1714', color: '#FAF7F2', border: 'none', borderRadius: 22, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Practice again</button>
                <button onClick={onBack} style={{ flex: 1, padding: 12, background: 'transparent', color: 'var(--ink)', border: '0.5px solid rgba(26,23,20,0.2)', borderRadius: 22, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Try another</button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!sessionDone && messages.length === 0 && (
          <div style={{ padding: '0 24px 10px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-60)', fontWeight: 500 }}>Try:</span>
            {quickReplies.map(r => <QuickReply key={r} text={r} onClick={handleSend} />)}
          </div>
        )}

        {!sessionDone && (
          <div style={{ padding: '12px 24px 20px', borderTop: '0.5px solid rgba(26,23,20,0.08)', background: 'var(--cream)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Respond to ${scenario.persona.name}…`}
                rows={2}
                style={{ flex: 1, resize: 'none', border: '0.5px solid rgba(26,23,20,0.2)', borderRadius: 14, padding: '12px 16px', fontSize: 14, fontFamily: 'var(--font-body)', background: '#fff', color: 'var(--ink)', outline: 'none', lineHeight: 1.55 }}
                onFocus={e => e.target.style.borderColor = 'rgba(26,23,20,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(26,23,20,0.2)'}
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} style={{
                width: 44, height: 44, borderRadius: '50%',
                background: input.trim() && !isTyping ? '#1A1714' : 'rgba(26,23,20,0.08)',
                border: 'none', color: input.trim() && !isTyping ? '#FAF7F2' : 'rgba(26,23,20,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s', fontSize: 18, cursor: input.trim() ? 'pointer' : 'default',
              }}>↑</button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-30)', marginTop: 6, textAlign: 'center' }}>
              Enter to send · Shift+Enter for new line · The AI responds to your tone
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
