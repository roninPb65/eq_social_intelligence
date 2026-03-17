import { useState, useRef, useEffect } from 'react';
import { useSimulator } from '../hooks/useSimulator';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import ScoreBar from './ScoreBar';
import { skillColors } from '../data/scenarios';

export default function Simulator({ scenario, onBack }) {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sc = skillColors[scenario.skillColor];

  const { messages, isTyping, sessionDone, coachNote, turnCount, score, sendMessage, reset } = useSimulator(scenario);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, coachNote]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!started) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', animation: 'fadeUp 0.4s ease' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--ink-60)',
          fontSize: 13, fontWeight: 500, marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 6, padding: 0,
        }}>← All scenarios</button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: sc.bg, borderRadius: 20, padding: '5px 12px',
          width: 'fit-content', marginBottom: 20,
          fontSize: 11, fontWeight: 500, letterSpacing: '1px',
          textTransform: 'uppercase', color: sc.text,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
          {scenario.skill}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.8px', marginBottom: 8, lineHeight: 1.15 }}>
          {scenario.title}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 28 }}>{scenario.context} · {scenario.difficulty}</div>

        <div style={{
          background: '#fff',
          border: '0.5px solid rgba(26,23,20,0.12)',
          borderRadius: 20, padding: 28, marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 10 }}>The situation</div>
          <p style={{ fontSize: 16, lineHeight: 1.7, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
            {scenario.setup}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <div style={{ background: sc.bg, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: sc.text, marginBottom: 10 }}>You're talking to</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#fff', color: sc.dot,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 500,
              }}>{scenario.persona.avatar}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{scenario.persona.name}</div>
                <div style={{ fontSize: 12, color: sc.text, opacity: 0.8 }}>{scenario.persona.role}</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 8 }}>Learning goal</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>{scenario.learningGoal}</p>
          </div>
        </div>

        <div style={{
          background: '#FFF0E8',
          border: '0.5px solid rgba(199,91,55,0.2)',
          borderRadius: 16, padding: 18, marginBottom: 28,
          display: 'flex', gap: 12, alignItems: 'flex-start,',
        }}>
          <div style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>💡</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#993C1D', marginBottom: 4 }}>Coach tip before you start</div>
            <div style={{ fontSize: 14, color: '#712B13', lineHeight: 1.6 }}>{scenario.coachTip}</div>
          </div>
        </div>

        <button
          onClick={() => setStarted(true)}
          style={{
            width: '100%', padding: '16px',
            background: '#1A1714', color: '#FAF7F2',
            border: 'none', borderRadius: 28,
            fontSize: 15, fontWeight: 500,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Begin simulation →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '0.5px solid rgba(26,23,20,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--cream)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: 'var(--ink-60)',
            fontSize: 13, fontWeight: 500, padding: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>←</button>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: sc.bg, color: sc.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 500,
          }}>{scenario.persona.avatar}</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{scenario.persona.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>{scenario.persona.role}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>Turn {turnCount}/6</div>
          <div style={{
            height: 4, width: 80, background: 'rgba(26,23,20,0.1)', borderRadius: 2,
          }}>
            <div style={{ height: '100%', borderRadius: 2, background: sc.dot, width: `${(turnCount / 6) * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Score sidebar + chat layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Scores panel */}
        <div style={{
          width: 160, flexShrink: 0,
          borderRight: '0.5px solid rgba(26,23,20,0.08)',
          padding: '20px 16px',
          background: 'var(--cream)',
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 14 }}>Live EQ</div>
          <ScoreBar label="Empathy" value={score.empathy} color="#2D6A50" delay={0} />
          <ScoreBar label="Clarity" value={score.clarity} color="#2B4F82" delay={100} />
          <ScoreBar label="Regulation" value={score.regulation} color="#C75B37" delay={200} />
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Opening line */}
            <ChatBubble
              message={{ role: 'assistant', content: scenario.openingLine }}
              personaName={scenario.persona.name}
              personaAvatar={scenario.persona.avatar}
              personaColor={sc}
            />

            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                message={msg}
                personaName={scenario.persona.name}
                personaAvatar={scenario.persona.avatar}
                personaColor={sc}
              />
            ))}

            {isTyping && <TypingIndicator avatar={scenario.persona.avatar} color={sc} />}

            {coachNote && (
              <div style={{
                background: '#FFF9F7',
                border: '0.5px solid rgba(199,91,55,0.25)',
                borderRadius: 12, padding: '12px 14px',
                fontSize: 13, color: '#712B13', lineHeight: 1.6,
                animation: 'fadeUp 0.35s ease',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <span><strong style={{ fontWeight: 500 }}>Coach: </strong>{coachNote}</span>
              </div>
            )}

            {sessionDone && (
              <div style={{
                background: '#EAF3EC',
                border: '0.5px solid rgba(45,106,80,0.2)',
                borderRadius: 14, padding: '16px',
                animation: 'fadeUp 0.4s ease',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>✓</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1A4530', marginBottom: 4 }}>Session complete</div>
                <div style={{ fontSize: 13, color: '#2D6A50', marginBottom: 14 }}>You earned +{scenario.xp} XP</div>
                <button onClick={reset} style={{
                  background: '#2D6A50', color: '#fff',
                  border: 'none', borderRadius: 20, padding: '8px 20px',
                  fontSize: 13, fontWeight: 500,
                }}>Practice again</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!sessionDone && (
            <div style={{
              padding: '12px 20px 20px',
              borderTop: '0.5px solid rgba(26,23,20,0.08)',
              background: 'var(--cream)',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="How do you respond…"
                  rows={2}
                  style={{
                    flex: 1, resize: 'none',
                    border: '0.5px solid rgba(26,23,20,0.2)',
                    borderRadius: 14, padding: '10px 14px',
                    fontSize: 14, fontFamily: 'var(--font-body)',
                    background: '#fff', color: 'var(--ink)',
                    outline: 'none', lineHeight: 1.5,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: input.trim() && !isTyping ? '#1A1714' : 'rgba(26,23,20,0.1)',
                    border: 'none', color: '#FAF7F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'background 0.2s',
                    fontSize: 16,
                  }}
                >↑</button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 6, textAlign: 'center' }}>
                Enter to send · Shift+Enter for new line
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
