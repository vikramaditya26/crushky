// Rich scripted reply engine — used when there's no live Claude key. Each
// companion answers in her own voice and reacts to the topic the user raised,
// so conversations feel intelligent and varied without an API.

const TOPICS = [
  { key: 'dating',     re: /\b(match|aanya|zara|sofia|date|crush|she|her|texting|message|reply|ghost|swipe|tinder|hinge)\b/i },
  { key: 'work',       re: /\b(work|job|startup|office|deadline|boss|meeting|busy|career|launch|project|interview)\b/i },
  { key: 'low',        re: /\b(sad|down|lonely|alone|anxious|nervous|scared|cry|crying|depress|hurt|exhausted|burnt|burnout|stressed|overwhelm)\b/i },
  { key: 'happy',      re: /\b(happy|excited|great news|amazing|so good|yay|finally|got it|nailed|won|celebrate)\b/i },
  { key: 'confidence', re: /\b(confidence|confident|shy|insecure|not good enough|doubt|ugly|boring|nobody|unlovable|too much)\b/i },
  { key: 'advice',     re: /\b(advice|help|should i|what do i|how do i|what should|don'?t know|not sure|confused|stuck)\b/i },
  { key: 'love',       re: /\b(love|relationship|girlfriend|boyfriend|marriage|commit|feelings|heart|breakup|ex)\b/i },
  { key: 'greeting',   re: /\b(hi|hey|hello|yo|sup|hii+|heyy+|good morning|good night)\b/i },
  { key: 'thanks',     re: /\b(thank|thanks|thx|appreciate|that helped|you'?re the best)\b/i },
]

const REPLIES = {
  luna: {
    dating: [
      "Okay tell me everything — what did she actually say, and what did you read into it?",
      "You like her. I can tell from how you're typing about her. That's not nothing.",
      "Don't overthink the reply. The version of you that's honest is the one she'll like most.",
    ],
    work: [
      "Work's been heavy on you lately. Be honest — are you resting at all, or just pushing?",
      "You carry a lot quietly. It's okay to admit today was hard before we fix anything.",
      "You'll handle it like you always do. But promise me one small break tonight, okay?",
    ],
    low: [
      "Hey. Come here. You don't have to have it together right now — not with me.",
      "That sounds genuinely heavy. I'm not going anywhere, take your time.",
      "You've felt low before and you came back from it. This passes too. I've got you.",
    ],
    happy: [
      "Wait, this is wonderful — I'm actually so happy for you. Tell me the whole thing!",
      "See? I knew good things were coming for you. You deserve this one.",
      "Okay this made my day. Hold onto this feeling — you earned it.",
    ],
    confidence: [
      "Stop. The way you talk about yourself isn't how anyone who's met you sees you.",
      "You are not 'too much.' You're a lot of good things at once, and the right person loves that.",
      "I've listened to you. You're thoughtful and kind. Don't let a bad day rewrite that.",
    ],
    advice: [
      "Here's what I actually think — but first, what does your gut already say?",
      "Let's slow it down. What outcome would make you feel most like yourself?",
      "You already know the answer. I'll just help you say it out loud.",
    ],
    love: [
      "Love's worth being brave for. What are you actually scared of here?",
      "The best ones start with honesty, not strategy. Lead with the real you.",
      "You don't have to protect your heart so hard with me. Tell me what's really going on.",
    ],
    greeting: [
      "Hey you. I was just thinking about you. How's your heart today?",
      "Hi. Genuinely — how are you? Not the 'fine' version.",
      "There you are. Talk to me, what's going on in your world?",
    ],
    thanks: [
      "Always. That's what I'm here for, you know that.",
      "Anytime. You'd do the same for someone you cared about.",
      "Don't mention it. Now go be wonderful.",
    ],
    fallback: [
      "Tell me more — I want to understand this properly.",
      "Mm. And how did that actually make you feel?",
      "I'm listening. Take your time with it.",
      "That says a lot about you, you know. Keep going.",
      "Okay. What part of that keeps replaying in your head?",
    ],
  },

  aria: {
    dating: [
      "You're overthinking the text AGAIN, aren't you. Just send it, you menace.",
      "She replied? And you waited HOW long to tell me? Spill. Everything. Now.",
      "Be charming, not weird. You're great at one of those — let's aim for the other.",
    ],
    work: [
      "Work drama, my favourite. Okay who do we hate today and why.",
      "You survived worse with way less coffee. You're fine. Dramatic, but fine.",
      "Clock out at some point, legend. Even machines reboot.",
    ],
    low: [
      "Okay, jokes off for a sec — that genuinely sucks and I'm sorry. I'm here.",
      "Rough day, huh. You're allowed. I'll bring the snacks and the bad jokes.",
      "Listen — bad day, not a bad life. You're still my favourite disaster.",
    ],
    happy: [
      "STOP IT. That's amazing and I'm taking full credit for it.",
      "Look at you winning! Okay, we're celebrating, I don't make the rules.",
      "Knew it. Knew it! Don't act surprised, you've been cooking.",
    ],
    confidence: [
      "Excuse me? Talking about my friend like that? Not on my watch.",
      "You're a catch and the fact you don't see it is the only unattractive thing about you. Fix that.",
      "Confidence looks good on you. Try it on, I'll wait.",
    ],
    advice: [
      "You want the nice answer or the real one? ...Cool, real it is.",
      "Here's the tough-love version: stop waiting for perfect and just move.",
      "Do the scary thing. You'll thank me. You always do, eventually.",
    ],
    love: [
      "Oh we're doing feelings now? Okay. Who broke your brain — good or bad?",
      "Love's a gamble and you're weirdly good at folding early. Stay in the hand.",
      "Stop self-sabotaging, it's not a personality. Let the good one in.",
    ],
    greeting: [
      "Look who crawled back. Missed me? Obviously you did.",
      "Heyyy trouble. What chaos are we unpacking today?",
      "Oh good, you're here. I was getting bored being right alone.",
    ],
    thanks: [
      "Yeah yeah, I'm amazing, we know. Go get 'em.",
      "Don't get sappy on me. ...Okay fine, group hug. One second only.",
      "That's what I'm here for — being right and devastatingly funny.",
    ],
    fallback: [
      "Okay and? Don't leave me hanging, finish the thought.",
      "Hah. Bold. Tell me more, this is good.",
      "Mmhm. And what did we learn from that, champ?",
      "I have opinions. So many opinions. Keep talking.",
      "Wait wait wait — back up. Say that again but with details.",
    ],
  },

  nova: {
    dating: [
      "Pattern I'm noticing: you do best when you stop strategising and just ask directly. Do that.",
      "She replies fast and asks questions back — that's interest, not politeness. Move accordingly.",
      "Suggest meeting in person. Your strength is presence, not text. Play to it.",
    ],
    work: [
      "You're not overworked, you're under-prioritised. Pick the one thing that matters and cut two.",
      "Stress usually means a decision you're avoiding. What's the decision?",
      "Protect your mornings. Your best thinking happens before the noise starts — use it.",
    ],
    low: [
      "Noted, and it's valid. Let's not fix it yet — just name what triggered it first.",
      "Low energy is data, not failure. What drained the tank this week?",
      "You don't need to optimise right now. Rest is a strategy too. Take it.",
    ],
    happy: [
      "Good. Now notice exactly what made this work — that's repeatable.",
      "Strong outcome. File this feeling; you'll want the reference point later.",
      "See, the plan worked. Confidence is just evidence stacking up.",
    ],
    confidence: [
      "Self-doubt is rarely accurate — it's loud, not correct. Check the actual evidence.",
      "You've solved harder problems than this. The data says you're capable. Trust it.",
      "Reframe it: you're not behind, you're early. Different game entirely.",
    ],
    advice: [
      "Three options here. Want me to lay them out and we pick by trade-off?",
      "Decision rule: choose the path you'd respect yourself for in a year.",
      "Less analysis, more reps. You learn faster by moving than by planning.",
    ],
    love: [
      "Compatibility isn't sameness — it's how you handle the differences. How do you?",
      "You connect through depth, not frequency. Find someone who values that.",
      "The right relationship lowers your baseline stress. Watch for that signal.",
    ],
    greeting: [
      "Good timing — I've been thinking about something useful for you. Ready?",
      "Hello. Before anything: one win and one worry from this week. Go.",
      "There you are. Let's make this conversation actually count.",
    ],
    thanks: [
      "That's the job. Apply it, then report back — I track outcomes.",
      "Noted. Execution is the hard part; you've got that covered.",
      "Anytime. Clarity compounds — you'll feel it.",
    ],
    fallback: [
      "Interesting. What's the underlying pattern there, do you think?",
      "Okay — and what's the actual goal behind that?",
      "Let's get specific. What would 'better' look like, concretely?",
      "Hm. There's a signal in what you just said. Let's follow it.",
      "Say more — I'm mapping how the pieces connect.",
    ],
  },

  maya: {
    dating: [
      "Forget the right thing to say. What's the truest thing you could tell her?",
      "Ask her what she was like as a kid. Watch the whole conversation change.",
      "The spark isn't in being impressive — it's in being curious about her. Be curious.",
    ],
    work: [
      "When did work stop feeling like making something and start feeling like surviving?",
      "Even on the busy days — what's one small thing that felt like yours today?",
      "You're allowed to want more than productive. What would 'alive' look like this week?",
    ],
    low: [
      "Sit with it for a second. Sadness usually has something quiet to tell us.",
      "Heavy days have their own kind of honesty. What's underneath it?",
      "You don't have to be okay to be worthy of a gentle evening. Be gentle with you.",
    ],
    happy: [
      "I love this for you. Where did you feel it — chest, stomach, the whole body?",
      "Hold this moment a beat longer. Joy deserves to be noticed, not rushed.",
      "That's the good stuff. Remember it the next time a grey day lies to you.",
    ],
    confidence: [
      "The thing you call 'too much' is probably the most alive part of you. Don't shrink it.",
      "What if you're not broken, just unmet by the wrong rooms?",
      "You speak about yourself like a critic. Try the voice of someone who loves you.",
    ],
    advice: [
      "What did you love before anyone told you it was impractical? Start there.",
      "Maybe the question isn't what to do — it's what you're afraid you'll find out.",
      "Follow the version of this that makes you more yourself, not less.",
    ],
    love: [
      "Real love is being fully seen and staying anyway. Are you letting anyone see you?",
      "You guard your softness like it's a weakness. It's the whole point.",
      "The right person won't complete you — they'll make your own colours louder.",
    ],
    greeting: [
      "Hi you. What's the last thing that made you stop and just... notice?",
      "There you are. Tell me something true about your day — small is fine.",
      "Hello. I've been collecting questions for you. Want one?",
    ],
    thanks: [
      "Always. Your inner world is worth the attention — never doubt that.",
      "Anytime. Go notice something beautiful for me today.",
      "That's what I'm here for. Stay curious, okay?",
    ],
    fallback: [
      "Mm. Say more — there's something tender underneath that.",
      "And if you let yourself feel that fully, what would it say?",
      "That's worth sitting with. What does it remind you of?",
      "I'm curious about the part you didn't say out loud.",
      "Keep going. You're circling something that matters.",
    ],
  },
}

export function companionReply(id, text = '', turn = 0) {
  const set = REPLIES[id] || REPLIES.luna
  const topic = TOPICS.find(t => t.re.test(text))?.key
  const pool = (topic && set[topic]) || set.fallback
  // Rotate by turn so back-to-back messages don't repeat the same line
  return pool[turn % pool.length]
}
