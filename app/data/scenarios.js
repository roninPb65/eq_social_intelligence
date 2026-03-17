export const scenarios = [
  {
    id: 1,
    skill: "Emotional Regulation",
    skillColor: "accent",
    difficulty: "Intermediate",
    context: "At work",
    title: "The dismissed idea",
    setup: "You spent two evenings preparing a proposal. In today's all-hands meeting, your manager cuts you off mid-sentence and moves on — no explanation, no acknowledgment.",
    persona: {
      name: "Jordan",
      role: "Your manager",
      avatar: "JM",
      mood: "dismissive",
      personality: "Direct, task-focused, often unaware of emotional impact. Responds to confidence and logic, not pleading."
    },
    openingLine: "Okay, moving on — we have a lot to get through today.",
    coachTip: "Notice your body first. The pause between trigger and response is where regulation lives.",
    learningGoal: "Practice staying composed and advocating for yourself without reactive emotion.",
    xp: 120,
  },
  {
    id: 2,
    skill: "Social Intelligence",
    skillColor: "green",
    difficulty: "Advanced",
    context: "Friendship",
    title: "The quiet drift",
    setup: "Your closest friend has been distant for three weeks — shorter replies, cancelled plans. They insist 'everything is fine' but something clearly isn't.",
    persona: {
      name: "Sam",
      role: "Your close friend",
      avatar: "SF",
      mood: "guarded",
      personality: "Tends to withdraw when hurt. Won't say what's wrong directly. Responds to genuine curiosity, not pressure."
    },
    openingLine: "Hey. Yeah I've just been busy lately. It's nothing.",
    coachTip: "Read what's unspoken. Ask questions that open doors, not ones that demand answers.",
    learningGoal: "Practice reading between the lines and creating safety without pressure.",
    xp: 150,
  },
  {
    id: 3,
    skill: "Empathy in Practice",
    skillColor: "blue",
    difficulty: "Beginner",
    context: "Family",
    title: "The invisible burden",
    setup: "Your sibling calls, clearly upset but saying they're fine. They just lost a job opportunity they'd been working toward for months.",
    persona: {
      name: "Alex",
      role: "Your sibling",
      avatar: "AS",
      mood: "deflecting",
      personality: "Hides vulnerability behind jokes and 'I'm fine.' Opens up when they feel truly heard, not advised."
    },
    openingLine: "I'm fine honestly, don't worry about it. These things happen.",
    coachTip: "Empathy is presence, not solutions. Resist the urge to fix — focus on witnessing.",
    learningGoal: "Practice deep listening and reflecting without jumping to advice or reassurance.",
    xp: 100,
  },
  {
    id: 4,
    skill: "Conflict Navigation",
    skillColor: "gold",
    difficulty: "Advanced",
    context: "Relationship",
    title: "The recurring argument",
    setup: "You and your partner keep having the same fight about household responsibilities. It always escalates. Tonight it's starting again.",
    persona: {
      name: "Riley",
      role: "Your partner",
      avatar: "RP",
      mood: "frustrated",
      personality: "Feels unheard and undervalued. Escalates when defensive. De-escalates when genuinely acknowledged."
    },
    openingLine: "I just — I feel like I'm the only one who notices what needs to be done around here.",
    coachTip: "In conflict, acknowledgment before explanation. Their feelings are real even if the facts are disputed.",
    learningGoal: "Break the cycle by acknowledging before defending. Find the need beneath the complaint.",
    xp: 140,
  },
];

export const skillColors = {
  accent: { bg: '#FFF0E8', text: '#712B13', dot: '#C75B37', bar: '#C75B37' },
  green:  { bg: '#EAF3EC', text: '#1A4530', dot: '#2D6A50', bar: '#2D6A50' },
  blue:   { bg: '#EAF0F9', text: '#1A3055', dot: '#2B4F82', bar: '#2B4F82' },
  gold:   { bg: '#FBF5E6', text: '#5C3D00', dot: '#B08A3A', bar: '#B08A3A' },
};
