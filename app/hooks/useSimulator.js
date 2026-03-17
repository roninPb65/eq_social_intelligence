import { useState, useCallback } from 'react';

const PROXY_URL = 'https://getupandgo.onrender.com/api/chat';
const MODEL = 'llama-3.3-70b-versatile';

async function callProxy({ system, messages, max_tokens = 1000 }) {
  // Build messages array — prepend system as first user/assistant pair if needed,
  // or include as a system role message (Groq supports system role)
  const payload = {
    model: MODEL,
    max_tokens,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ],
  };

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Proxy error ${res.status}: ${err}`);
  }

  const data = await res.json();

  // Support both OpenAI-style and Anthropic-style response shapes
  const text =
    data?.choices?.[0]?.message?.content ||   // OpenAI / Groq shape
    data?.content?.[0]?.text ||               // Anthropic shape
    data?.message?.content ||                 // some proxies
    '';

  return text;
}

export function useSimulator(scenario) {
  const [messages, setMessages]       = useState([]);
  const [isTyping, setIsTyping]       = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [coachNote, setCoachNote]     = useState(null);
  const [turnCount, setTurnCount]     = useState(0);
  const [score, setScore]             = useState({ empathy: 0, clarity: 0, regulation: 0 });

  const buildSystemPrompt = useCallback(() => {
    return `You are roleplaying as ${scenario.persona.name}, ${scenario.persona.role}.

SCENARIO: ${scenario.setup}

YOUR PERSONALITY: ${scenario.persona.personality}

YOUR CURRENT MOOD: ${scenario.persona.mood}

ROLEPLAY RULES:
- Stay fully in character as ${scenario.persona.name}. Never break character.
- Respond naturally and realistically — short replies (1-3 sentences) like a real person talking.
- React authentically to how the user treats you. If they are empathetic, slowly open up. If they are pushy or dismissive, pull back or get defensive.
- Do NOT be a pushover. Create genuine emotional resistance that the user must navigate.
- Do NOT provide coaching or meta-commentary inside your character replies.
- After exactly every 3 user messages, append a coach note in this exact format on a new line:
  [COACH: one sentence of specific, actionable feedback on what the user just did well or could improve]
- After 6 user turns total, end your reply with [SESSION_END] on a new line.

Respond only as ${scenario.persona.name} would speak. Be real, be human, be challenging.`;
  }, [scenario]);

  const buildScoringPrompt = useCallback((conversationHistory, userMessage) => {
    return `You are an expert emotional intelligence coach. Analyse this single user message in context and score it.

SCENARIO: ${scenario.setup}
PERSONA: ${scenario.persona.name} — ${scenario.persona.personality}
SKILL BEING PRACTISED: ${scenario.skill}
LEARNING GOAL: ${scenario.learningGoal}

CONVERSATION SO FAR:
${conversationHistory.map(m => `${m.role === 'user' ? 'User' : scenario.persona.name}: ${m.content}`).join('\n')}

USER'S LATEST MESSAGE: "${userMessage}"

Score the user's latest message on three dimensions (0-100 each):
- EMPATHY: Did they acknowledge the other person's perspective or feelings?
- CLARITY: Were they clear and direct without being aggressive?
- REGULATION: Did they stay calm and measured, avoiding reactivity or shutdown?

Scoring guide: 0-30 needs work, 30-60 developing, 60-80 good, 80-100 excellent.
Scores should reflect cumulative improvement — start conservative and build as the user improves.

Respond ONLY with a valid JSON object, no other text, no markdown:
{"empathy": <number>, "clarity": <number>, "regulation": <number>}`;
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

    // Build conversation history for roleplay
    const historyForRoleplay = messages.length === 0
      ? [{ role: 'assistant', content: scenario.openingLine }, { role: 'user', content: userText }]
      : [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: userText }];

    try {
      // Run roleplay and scoring in parallel
      const [roleplayText, scoringText] = await Promise.all([
        callProxy({
          system: buildSystemPrompt(),
          messages: historyForRoleplay,
          max_tokens: 1000,
        }),
        callProxy({
          messages: [{
            role: 'user',
            content: buildScoringPrompt(
              messages.map(m => ({ role: m.role, content: m.content })),
              userText
            ),
          }],
          max_tokens: 150,
        }),
      ]);

      // Parse roleplay response
      const note = parseCoachNote(roleplayText);
      const isDone = parseSessionEnd(roleplayText);
      const clean = cleanText(roleplayText);

      // Parse AI score
      try {
        const cleanScore = scoringText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanScore);
        setScore(prev => ({
          empathy:    Math.min(100, Math.max(prev.empathy,    Number(parsed.empathy)    || prev.empathy)),
          clarity:    Math.min(100, Math.max(prev.clarity,    Number(parsed.clarity)    || prev.clarity)),
          regulation: Math.min(100, Math.max(prev.regulation, Number(parsed.regulation) || prev.regulation)),
        }));
      } catch {
        // Fallback: small increment if scoring parse fails
        setScore(prev => ({
          empathy:    Math.min(100, prev.empathy    + 5),
          clarity:    Math.min(100, prev.clarity    + 4),
          regulation: Math.min(100, prev.regulation + 5),
        }));
      }

      const assistantMsg = { role: 'assistant', content: clean, id: Date.now() + 1 };
      setMessages(prev => [...prev, assistantMsg]);
      if (note) setCoachNote(note);
      if (isDone) setSessionDone(true);

    } catch (err) {
      console.error('Proxy error:', err);
      const errMsg = {
        role: 'assistant',
        content: 'Something went wrong connecting to the server. Please try again.',
        id: Date.now() + 1,
        error: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, sessionDone, scenario, buildSystemPrompt, buildScoringPrompt, turnCount]);

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
