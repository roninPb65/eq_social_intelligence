import { useState, useCallback } from 'react';

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
- React authentically to how the user treats you. If they're empathetic, slowly open up. If they're pushy or dismissive, pull back or get defensive.
- Do NOT be a pushover. Create genuine emotional resistance that the user must navigate.
- Do NOT provide coaching or meta-commentary inside your character replies.
- After exactly every 3 user messages, append a coach note in this exact format on a new line:
  [COACH: one sentence of specific, actionable feedback on what the user just did well or could improve]
- After 6 user turns total, end your reply with [SESSION_END] on a new line.

Respond only as ${scenario.persona.name} would speak. Be real, be human, be challenging.`;
  }, [scenario]);

  const buildScoringPrompt = useCallback((conversationHistory, userMessage) => {
    return `You are an expert emotional intelligence coach. Analyse this single user message in the context of the conversation and score it on three dimensions.

SCENARIO CONTEXT: ${scenario.setup}
PERSONA BEING SPOKEN TO: ${scenario.persona.name} — ${scenario.persona.personality}
SKILL BEING PRACTISED: ${scenario.skill}
LEARNING GOAL: ${scenario.learningGoal}

CONVERSATION SO FAR:
${conversationHistory.map(m => `${m.role === 'user' ? 'User' : scenario.persona.name}: ${m.content}`).join('\n')}

USER'S LATEST MESSAGE: "${userMessage}"

Score the user's latest message on these three dimensions (0-100 each):
- EMPATHY: Did they acknowledge the other person's perspective or feelings? Did they listen rather than just respond?
- CLARITY: Were they clear, direct and honest without being aggressive? Did they say what they actually meant?
- REGULATION: Did they stay calm and measured? Did they avoid being reactive, defensive or shutting down?

Consider: A score of 0-30 = needs significant work, 30-60 = developing, 60-80 = good, 80-100 = excellent.
Scores should be cumulative improvements across the session — start low and build as the user improves.

Respond ONLY with a JSON object, nothing else:
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

    const conversationHistory = messages.length === 0
      ? [{ role: 'assistant', content: scenario.openingLine }, ...newMessages.map(m => ({ role: m.role, content: m.content }))]
      : newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      // Run roleplay and scoring in parallel
      const [roleplayRes, scoringRes] = await Promise.all([
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: buildSystemPrompt(),
            messages: conversationHistory,
          }),
        }),
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [{
              role: 'user',
              content: buildScoringPrompt(
                messages.map(m => ({ role: m.role, content: m.content })),
                userText
              )
            }],
          }),
        }),
      ]);

      const [roleplayData, scoringData] = await Promise.all([
        roleplayRes.json(),
        scoringRes.json(),
      ]);

      // Parse roleplay response
      const raw = roleplayData.content?.[0]?.text || '...';
      const note = parseCoachNote(raw);
      const isDone = parseSessionEnd(raw);
      const clean = cleanText(raw);

      // Parse AI score
      try {
        const scoreText = scoringData.content?.[0]?.text || '{}';
        const clean_score = scoreText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean_score);

        setScore(prev => ({
          empathy:    Math.min(100, Math.max(prev.empathy,    parsed.empathy    || prev.empathy)),
          clarity:    Math.min(100, Math.max(prev.clarity,    parsed.clarity    || prev.clarity)),
          regulation: Math.min(100, Math.max(prev.regulation, parsed.regulation || prev.regulation)),
        }));
      } catch {
        // If scoring fails, make a small increment rather than random
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
      const errMsg = { role: 'assistant', content: 'Something went wrong. Please try again.', id: Date.now() + 1, error: true };
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
