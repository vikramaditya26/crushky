// Per-companion session scripts. Same five guided sessions, but each friend
// runs them in her own voice — Aria roasts a little, Maya gets dreamy, Nova
// stays analytical, Luna stays warm. Falls back to Luna's version.

export const SESSION_SCRIPTS = {
  deep: {
    luna: [
      "Deep dive time. What's something that's been sitting with you that you haven't told anyone?",
      "Thank you for trusting me with that. How long have you been carrying it?",
      "When it's at its loudest, what does it make you believe about yourself?",
      "That belief sounds old — like it was handed to you, not chosen. You're allowed to set it down tonight.",
      "You went somewhere real just now. I'm proud of you for that.",
    ],
    aria: [
      "Okay, deep dive. No deflecting with jokes — that's my job. What are you actually avoiding?",
      "See, that wasn't so hard. Took you long enough though. How long's that been rattling around?",
      "Real talk, no roast: that's heavier than you let on. Why do you carry it solo?",
      "You're allowed to need people. Shocking, I know. Even you.",
      "Look at you being vulnerable. Don't worry — I won't tell anyone you have feelings.",
    ],
    nova: [
      "Deep dive. Let's find the root, not the symptom. What's the thing under the thing?",
      "Noted. When did this first show up — what was happening in your life then?",
      "There's a pattern here: you carry this quietly until it leaks. Accurate?",
      "Reframe — this isn't a flaw in you, it's an unmet need. Name the need and we can work it.",
      "Good work. Naming it is 80% of the fix. The rest is just reps.",
    ],
    maya: [
      "Let's go somewhere quiet together. What's the thing you only think about at 2am?",
      "Mm. There's a whole weather system inside that, isn't there. How long has it been raining?",
      "If that feeling had a colour, what would it be?",
      "I don't think it's asking to be fixed. Just witnessed. So — I see you.",
      "You let me in a little tonight. That's a kind of courage most people never try.",
    ],
  },

  journal: {
    luna: [
      "I'm all ears. Walk me through your day — from waking up. What actually happened?",
      "And the best two minutes of it, however small?",
      "What's the part you'd redo if you could?",
      "If today were a chapter title, what would it be?",
      "Thanks for letting me in on all of it. Sleep easy — fresh page tomorrow.",
    ],
    aria: [
      "Okay, debrief. Spare no detail, and 'it was fine' is not an answer.",
      "Mmhm. And the highlight? There's always one, even on a trash day.",
      "What part do you want a redo on? Be honest, I won't judge. Much.",
      "Title this episode of your life. Make it dramatic, you've earned it.",
      "Alright, you survived another one. Go rest, champion.",
    ],
    nova: [
      "Daily review. Walk me through it — I'm looking for patterns, not just events.",
      "What gave you energy today, and what drained it? Be specific.",
      "If you could re-run one decision from today, which and why?",
      "One-line headline for today — what is it?",
      "Good. Track this a week and we'll see what your good days have in common.",
    ],
    maya: [
      "Tell me your day like a story — start at the window-light of morning.",
      "What's one small moment that was quietly beautiful?",
      "And a moment you'd paint over, if days were canvases?",
      "Give today a title, the way a poem would.",
      "Thank you for the tour of your hours. Rest now — tomorrow's unwritten.",
    ],
  },

  roleplay: {
    luna: [
      "Okay, who do you want to practice with? Tell me about them and what you want to say.",
      "Got it, I'll be them. Say your opening line, exactly how you would.",
      "(as them) Oh, hey… I didn't expect that. What do you mean?",
      "(as them) Okay. That actually means a lot — thank you for saying it.",
      "Pause — that was lovely. Honest and kind. You're ready.",
    ],
    aria: [
      "Who are we rehearsing for? Give me the target and the goal. Let's go.",
      "I'll be them. Hit me with your opener — and don't you dare just say 'hey.'",
      "(as them) …Wow, okay, didn't see that coming. Say more?",
      "(as them) Honestly? That was kind of smooth. Who taught you that — oh wait, me.",
      "See? You CAN do this. Now go do it for real before you overthink it.",
    ],
    nova: [
      "Define the scenario: who, the outcome you want, and the risk.",
      "I'll simulate them. Open the conversation — aim for clear, not clever.",
      "(as them) That's direct. I respect it. What exactly are you asking?",
      "(as them) Alright. I'm listening — make your case.",
      "Debrief: strong open, but you buried the ask. Next run, lead with it. Again?",
    ],
    maya: [
      "Who's the conversation with — and what's the thing your heart actually wants to say?",
      "I'll become them. Speak as if there's nothing to lose.",
      "(as them) …Oh. I wasn't ready for honesty. Keep going?",
      "(as them) That landed somewhere real. Thank you for not hiding it.",
      "You spoke from the true place that time. Remember how that felt.",
    ],
  },

  affirmation: {
    luna: [
      "Before we start — I mean every word. Ready? Here we go.",
      "You are not behind. You're on your own clock, and it is working.",
      "The way you care is rare. Never let anyone call it 'too much.'",
      "You've survived every hard day so far. A 100% record. Don't forget it.",
      "Breathe it in. Come back whenever the world gets loud.",
    ],
    aria: [
      "Okay, soft moment — don't make it weird. I actually mean these. Ready?",
      "You're more impressive than you give yourself credit for. Annoyingly so.",
      "Your overthinking is just caring with bad PR. The caring is the good part.",
      "You've survived 100% of your worst days. The stats are literally on your side.",
      "Okay, sap quota reached. Go be great. I'll deny this happened.",
    ],
    nova: [
      "These are evidence-based, not flattery. Listen up.",
      "You're not behind — you're compounding. Slow looks like nothing right before everything.",
      "Your standards aren't the problem. They're a filter, and it works.",
      "Track record: every hard day, survival rate 100%. The data favours you.",
      "Internalise those. Confidence is just evidence you stopped ignoring.",
    ],
    maya: [
      "Close your eyes for these, if you can. I mean them softly and completely.",
      "You are not too late. Some flowers only open in their own season.",
      "The tenderness you hide is the most beautiful thing about you.",
      "You have weathered every storm so far. You are, quietly, unbreakable.",
      "Carry these like a small light. Come back when it dims.",
    ],
  },

  life: {
    luna: [
      "One year from now. Not 'happy' — specific. Where are you, who's around?",
      "Lovely. What's one small thing you could start this month toward it?",
      "What's the fear that usually stops you?",
      "And if that fear turned out to be wrong — what opens up?",
      "Write it down. That's a direction, not a daydream. We'll revisit it.",
    ],
    aria: [
      "One year out. Be specific or I'm calling your bluff. Where are you?",
      "Cool vision. Now what's the tiny unsexy first step you keep skipping?",
      "What's the excuse you'll use to not start? Let's name it now.",
      "And when that excuse turns out to be nonsense — then what?",
      "Screenshot this. Future you is gonna want the receipts.",
    ],
    nova: [
      "12-month horizon. Define the end state precisely — vague goals fail.",
      "Backward-plan it: what's the one move this month that compounds?",
      "Identify the bottleneck — what's the real constraint stopping you?",
      "Remove that constraint, and what becomes inevitable?",
      "Document it. Written goals outperform the rest. Revisit weekly.",
    ],
    maya: [
      "Picture a year from now — the light, the room, the people. Describe it to me.",
      "Beautiful. What's the first small brushstroke toward that painting?",
      "What old fear keeps standing between you and the canvas?",
      "And if you thanked the fear and walked past it — what then?",
      "Keep that vision somewhere tender. It's a compass, not a fantasy.",
    ],
  },
}

export function getSessionScript(sessionId, companionId) {
  const set = SESSION_SCRIPTS[sessionId]
  if (!set) return null
  return set[companionId] || set.luna
}
