# EQRise — AI Scenario Simulator

A React app that uses the Anthropic API to power real-time emotional intelligence practice through AI roleplay.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How it works

- Pick a scenario (work conflict, friendship drift, family empathy, relationship tension)
- Chat with an AI persona that responds authentically and pushes back
- Receive live coaching notes every 3 turns
- Track Empathy, Clarity & Regulation scores in real time
- Session completes after 6 turns with XP reward

## Architecture

```
src/
  data/scenarios.js      # Scenario configs + skill colors
  hooks/useSimulator.js  # Anthropic API + conversation logic
  components/
    ScenarioCard.jsx     # Home grid card
    Simulator.jsx        # Full chat UI
    ChatBubble.jsx       # Message bubbles + typing indicator
    ScoreBar.jsx         # Animated EQ progress bar
  App.jsx                # Home screen + routing
  index.css              # Design system tokens
```

## API

Uses `claude-sonnet-4-20250514` via `/v1/messages`.
The system prompt instructs the model to:
1. Stay in character as the persona
2. Embed `[COACH: ...]` notes every 3 turns
3. Emit `[SESSION_END]` after 6 user turns

## Extending

Add new scenarios in `src/data/scenarios.js` — each needs:
- `skill`, `skillColor`, `difficulty`, `context`
- `persona` with `name`, `role`, `avatar`, `mood`, `personality`
- `openingLine`, `coachTip`, `learningGoal`, `xp`
