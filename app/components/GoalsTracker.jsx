import { useState, useEffect } from 'react';
import { goals } from '../data/goals';

const STORAGE_KEY = 'eqrise_goals_progress';

const typeLabels = {
  journal:    { label: 'Journal',    bg: '#EAF0F9', color: '#2B4F82' },
  checkin:    { label: 'Check-in',   bg: '#EAF3EC', color: '#2D6A50' },
  reflection: { label: 'Reflection', bg: '#FBF5E6', color: '#B08A3A' },
};

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return Object.fromEntries(goals.map(g => [g.id, { completed: 0, entries: {} }]));
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

function WeekStep({ step, goalId, completed, journalEntry, onToggle, onJournal, isActive, onOpen, isOpen }) {
  const tl = typeLabels[step.type];

  return (
    <div style={{
      border: `0.5px solid ${completed ? 'rgba(45,106,80,0.25)' : isActive ? 'rgba(26,23,20,0.18)' : 'rgba(26,23,20,0.08)'}`,
      borderRadius: 14,
      background: completed ? '#F7FAF8' : '#fff',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
      opacity: !isActive && !completed ? 0.45 : 1,
    }}>
      <div
        onClick={() => isActive || completed ? onOpen() : null}
        style={{
          padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: isActive || completed ? 'pointer' : 'default',
        }}
      >
        <div
          onClick={(e) => { e.stopPropagation(); if (isActive || completed) onToggle(); }}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: `1.5px solid ${completed ? '#2D6A50' : 'rgba(26,23,20,0.18)'}`,
            background: completed ? '#2D6A50' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {completed && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-60)', letterSpacing: '0.5px' }}>Week {step.week}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10, background: tl.bg, color: tl.color }}>{tl.label}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: completed ? '#2D6A50' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {step.action}
          </div>
        </div>

        {(isActive || completed) && (
          <div style={{ fontSize: 12, color: 'var(--ink-30)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</div>
        )}
      </div>

      {isOpen && (
        <div style={{ padding: '0 18px 18px', borderTop: '0.5px solid rgba(26,23,20,0.07)', paddingTop: 14 }}>
          <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.75, marginBottom: 14 }}>
            {step.description}
          </p>

          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-60)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Reflection prompt
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontStyle: 'italic', marginBottom: 14, padding: '10px 14px', background: 'rgba(26,23,20,0.03)', borderRadius: 10, lineHeight: 1.7, borderLeft: '2px solid rgba(26,23,20,0.12)' }}>
            {step.prompt}
          </div>

          <textarea
            value={journalEntry || ''}
            onChange={(e) => onJournal(e.target.value)}
            placeholder="Write your reflection here…"
            rows={4}
            style={{
              width: '100%', resize: 'vertical',
              border: '0.5px solid rgba(26,23,20,0.15)',
              borderRadius: 10, padding: '10px 12px',
              fontSize: 13, fontFamily: 'var(--font-body)',
              color: 'var(--ink)', background: '#fff',
              outline: 'none', lineHeight: 1.65,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(26,23,20,0.32)'}
            onBlur={e => e.target.style.borderColor = 'rgba(26,23,20,0.15)'}
          />

          {!completed && (
            <button
              onClick={onToggle}
              disabled={!journalEntry?.trim()}
              style={{
                marginTop: 10, padding: '9px 20px',
                background: journalEntry?.trim() ? '#1A1714' : 'rgba(26,23,20,0.07)',
                color: journalEntry?.trim() ? '#FAF7F2' : 'rgba(26,23,20,0.25)',
                border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 500,
                cursor: journalEntry?.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
              }}
            >Mark week {step.week} complete</button>
          )}

          {completed && journalEntry && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: '#F7FAF8', borderRadius: 10, borderLeft: '2px solid #2D6A50' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#2D6A50', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your reflection</div>
              <div style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.65 }}>{journalEntry}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, progress, onSelect }) {
  const pct = Math.round((progress.completed / goal.steps.length) * 100);
  const currentWeek = Math.min(progress.completed + 1, 6);

  return (
    <div
      onClick={() => onSelect(goal.id)}
      style={{
        background: '#fff',
        border: '0.5px solid rgba(26,23,20,0.1)',
        borderRadius: 20, padding: 28, cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(26,23,20,0.22)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(26,23,20,0.1)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontSize: 26 }}>{goal.icon}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: goal.dot }}>{pct}%</div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: goal.textColor, background: goal.bg, borderRadius: 20, padding: '3px 10px', width: 'fit-content', marginBottom: 10 }}>
        {goal.title}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, letterSpacing: '-0.3px', marginBottom: 8, lineHeight: 1.25 }}>
        {goal.subtitle}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 18, lineHeight: 1.65 }}>
        6-week structured practice program
      </p>

      <div style={{ marginBottom: 10 }}>
        <div style={{ height: 4, background: 'rgba(26,23,20,0.07)', borderRadius: 2 }}>
          <div style={{ height: '100%', borderRadius: 2, background: goal.dot, width: `${pct}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
        {goal.steps.map((_, i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: i < progress.completed ? goal.dot : 'rgba(26,23,20,0.09)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>
        {progress.completed === 6
          ? 'All 6 weeks complete'
          : `Week ${currentWeek} of 6 · ${goal.steps[Math.min(progress.completed, 5)].action}`}
      </div>
    </div>
  );
}

export default function GoalsTracker({ onBack }) {
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [openStepKey, setOpenStepKey] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Persist on every change
  useEffect(() => {
    saveProgress(progress);
    setSavedIndicator(true);
    const t = setTimeout(() => setSavedIndicator(false), 1800);
    return () => clearTimeout(t);
  }, [progress]);

  const toggleStep = (goalId, stepIndex) => {
    setProgress(prev => {
      const gp = prev[goalId];
      const isCompleting = stepIndex === gp.completed;
      if (!isCompleting && stepIndex !== gp.completed - 1) return prev;
      return {
        ...prev,
        [goalId]: { ...gp, completed: isCompleting ? gp.completed + 1 : gp.completed - 1 },
      };
    });
  };

  const saveEntry = (goalId, stepIndex, text) => {
    setProgress(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        entries: { ...prev[goalId].entries, [stepIndex]: text },
      },
    }));
  };

  const toggleOpen = (key) => setOpenStepKey(prev => prev === key ? null : key);

  const activeGoal = goals.find(g => g.id === activeGoalId);
  const totalCompleted = Object.values(progress).reduce((sum, gp) => sum + gp.completed, 0);
  const totalWeeks = goals.reduce((sum, g) => sum + g.steps.length, 0);
  const overallPct = Math.round((totalCompleted / totalWeeks) * 100);

  if (activeGoal) {
    const gp = progress[activeGoal.id];
    const pct = Math.round((gp.completed / activeGoal.steps.length) * 100);

    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', animation: 'fadeUp 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <button onClick={() => setActiveGoalId(null)} style={{
            background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: 13,
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, padding: 0, cursor: 'pointer',
          }}>← All goals</button>
          {savedIndicator && (
            <div style={{ fontSize: 12, color: '#2D6A50', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D6A50' }} />
              Saved
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ fontSize: 34 }}>{activeGoal.icon}</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: activeGoal.textColor, marginBottom: 4 }}>{activeGoal.title}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '-0.4px', lineHeight: 1.2 }}>{activeGoal.subtitle}</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Weeks done', val: gp.completed },
            { label: 'Weeks left', val: 6 - gp.completed },
            { label: 'Progress', val: `${pct}%` },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(26,23,20,0.03)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 21, fontWeight: 500, color: activeGoal.dot }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ height: 5, background: 'rgba(26,23,20,0.07)', borderRadius: 3 }}>
            <div style={{ height: '100%', borderRadius: 3, background: activeGoal.dot, width: `${pct}%`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'var(--ink-60)' }}>
            <span>Start</span><span>Week 6</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeGoal.steps.map((step, i) => (
            <WeekStep
              key={i}
              step={step}
              goalId={activeGoal.id}
              completed={i < gp.completed}
              isActive={i === gp.completed}
              journalEntry={gp.entries[i]}
              onToggle={() => toggleStep(activeGoal.id, i)}
              onJournal={(text) => saveEntry(activeGoal.id, i, text)}
              isOpen={openStepKey === `${activeGoal.id}-${i}`}
              onOpen={() => toggleOpen(`${activeGoal.id}-${i}`)}
            />
          ))}
        </div>

        {gp.completed === 6 && (
          <div style={{ marginTop: 28, background: activeGoal.bg, borderRadius: 18, padding: 28, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: activeGoal.textColor, marginBottom: 8 }}>6-week program complete</div>
            <div style={{ fontSize: 14, color: activeGoal.textColor, opacity: 0.75, lineHeight: 1.75 }}>
              You've finished all 6 weeks of {activeGoal.title}. The real skill is now in your muscle memory.
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px', animation: 'fadeUp 0.4s ease' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: 13,
        fontWeight: 500, marginBottom: 32, display: 'flex', alignItems: 'center',
        gap: 6, padding: 0, cursor: 'pointer',
      }}>← Back to simulator</button>

      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
        6-Week Programs
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-0.8px', lineHeight: 1.1, marginBottom: 12 }}>
        Your growth goals
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-60)', maxWidth: 480, lineHeight: 1.8, marginBottom: 32 }}>
        Structured week-by-week programs. Each step builds on the last. Reflect, journal, and track your real-world practice. Progress is saved automatically.
      </p>

      {totalCompleted > 0 && (
        <div style={{ background: '#F4F8F6', borderRadius: 14, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2D6A50', flexShrink: 0 }} />
            <div style={{ fontSize: 14, color: '#1A4530' }}>
              <span style={{ fontWeight: 500 }}>{totalCompleted} of {totalWeeks} weeks</span> completed across all programs
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#2D6A50' }}>{overallPct}%</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18, marginBottom: 48 }}>
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} progress={progress[goal.id]} onSelect={setActiveGoalId} />
        ))}
      </div>

      <div style={{ background: '#F5F2ED', borderRadius: 18, padding: '32px 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 16 }}>How the programs work</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { icon: '📅', title: 'One week at a time', body: 'Each week has one specific action. Small enough to do, meaningful enough to matter.' },
            { icon: '✍️', title: 'Journal as you go', body: 'Reflection prompts turn experience into insight. Writing makes the learning stick.' },
            { icon: '💾', title: 'Saved automatically', body: 'Your progress and journal entries are saved locally — pick up exactly where you left off.' },
          ].map(item => (
            <div key={item.title} style={{ borderTop: '0.5px solid rgba(26,23,20,0.12)', paddingTop: 16 }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 5 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.65 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
