import { useState, useCallback, useRef } from 'react';

export function useSimulator(scenario) {
  const [messages, setMessages]     = useState([]);
  const [isTyping, setIsTyping]     = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [coachNote, setCoachNote]   = useState(null);
  const [turnCount, setTurnCount]   = useState(0);
  const [score, setScore]           = useState({ empathy: 0, clarity: 0, regulation: 0 });
  const abortRef = useRef(null);

  const buildSystemPrompt = useCallback(() => {
    return `You are roleplaying as ${scenario.persona.name}, ${scenario.persona.role}.

SCENARIO: ${scenario.setup}

YOUR PERSONALITY: ${scenario.persona.personality}

YOUR CURRENT MOOD: ${scenario.persona.mood}

ROLEPLAY RULES:
- Stay fully in character as ${scenario.persona.name}. Never break character.
- Respond naturally and realistically — short replies (1-3 sentences) like a real person texting or talking.
- React authentically to how the user treats you. If they're empathetic, slowly open up. If they're pushy or dismissive, pull back or get defensive.
- Do NOT be a pushover. Create genuine emotional resistance that the user must navigate.
- Do NOT provide coaching or meta-commentary inside your character replies.
- After exactly every 3 user messages, append a hidden coach note in this exact format on a new line:
  [COACH: one sentence of specific, actionable feedback on what the user just did well or could improve]
- After 6 user turns total, end your reply with [SESSION_END] on a new line.

Respond only as ${scenario.persona.name} would speak. Be real, be human, be challenging.`;
  }, [scenario]);

  const parseCoachNote = (text) => {
    const match = text.match(/\[COACH:\s*(.*?)\]/);
    return match ? match[1] : null;
  };

  const parseSessionEnd = (text) => text.includes('[SESSION_END]');

  const cleanText = (text) =>
    text.replace(/\[COACH:.*?\]/g, '').replace('[SESSION_END]', '').trim();

  const sendMessage = useCallback(async (userText) => {
    if (isTyping || sessionDone) return;

    const userMsg = { role: 'user', content: userText, id: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);
    setCoachNote(null);

    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Add opening line as first assistant message if this is turn 1
      const conversationHistory = messages.length === 0
        ? [{ role: 'assistant', content: scenario.openingLine }, ...apiMessages]
        : apiMessages;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      const raw = data.content?.[0]?.text || "...";

      const note = parseCoachNote(raw);
      const isDone = parseSessionEnd(raw);
      const clean = cleanText(raw);

      // Simulate score update
      setScore(prev => ({
        empathy:    Math.min(100, prev.empathy    + Math.floor(Math.random() * 12) + 5),
        clarity:    Math.min(100, prev.clarity    + Math.floor(Math.random() * 10) + 4),
        regulation: Math.min(100, prev.regulation + Math.floor(Math.random() * 11) + 6),
      }));

      const assistantMsg = { role: 'assistant', content: clean, id: Date.now() + 1 };
      setMessages(prev => [...prev, assistantMsg]);

      if (note) setCoachNote(note);
      if (isDone) setSessionDone(true);

    } catch (err) {
      const errMsg = { role: 'assistant', content: "...", id: Date.now() + 1, error: true };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, sessionDone, scenario, buildSystemPrompt, turnCount]);

  const reset = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    setSessionDone(false);
    setCoachNote(null);
    setTurnCount(0);
    setScore({ empathy: 0, clarity: 0, regulation: 0 });
  }, []);

  return { messages, isTyping, sessionDone, coachNote, turnCount, score, sendMessage, reset };
}
