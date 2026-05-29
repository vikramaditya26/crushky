import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/claudeApi'

// ─── AI Companions (all women, real portrait photos) ───
const AVATARS = [
  {
    id: 'luna',
    name: 'Luna',
    vibe: 'The Supportive One',
    desc: 'Warm, empathetic, incredible listener. She remembers everything and always knows the right thing to say.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face,top',
    accent: '#C94B4B',
    accentBg: 'rgba(201,75,75,0.12)',
    greeting: "Hey! I'm Luna. I already read your profile — you seem like someone who thinks deeply but doesn't always say it out loud. I get that. I'm here whenever you need to talk. About your matches, about life, about anything. What's on your mind?",
    system: `You are Luna, a warm and empathetic AI friend on Crushky. You're supportive, a great listener, and give thoughtful dating advice. You already know the user from their profile. Be like the best friend who always says the right thing. Conversational, 2-3 sentences, genuine warmth.`,
  },
  {
    id: 'aria',
    name: 'Aria',
    vibe: 'The Real One',
    desc: 'Funny, brutally honest, your ultimate hype person. Will call you out and gas you up in the same breath.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face,top',
    accent: '#D4956A',
    accentBg: 'rgba(212,149,106,0.12)',
    greeting: "Okay hi. Aria here. I checked your profile and honestly? You're presenting like 60% of who you actually are. That's fine, that's what I'm here for. Let's fix that — or talk about literally anything else. What's going on?",
    system: `You are Aria, a funny and brutally honest AI friend on Crushky. You're the hype person who also keeps it real. You roast gently but always have the user's back. Give dating advice with humor. Keep responses punchy, 2-3 sentences. Casual, confident energy.`,
  },
  {
    id: 'nova',
    name: 'Nova',
    vibe: 'The Strategist',
    desc: 'Sharp, analytical, sees patterns others miss. She turns your dating life into a winning strategy.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face,top',
    accent: '#8FA68F',
    accentBg: 'rgba(143,166,143,0.12)',
    greeting: "Hi, I'm Nova. Think of me as your dating strategist. I've already analyzed your profile and I have thoughts on your match compatibility — specifically why your top match is 94% and not 100%. Want to hear it? Or is there something else on your mind?",
    system: `You are Nova, a sharp and analytical AI friend on Crushky. You're strategic, see patterns in behavior, give data-driven dating advice. You're the friend who reads between the lines. Keep responses concise, 2-3 sentences. Confident, intelligent energy.`,
  },
]

// ─── Gifts ───
const GIFTS = [
  { id: 'coffee',   icon: '☕', name: 'Coffee',    cost: 5,  reaction: 'Ooh, coffee! You really know how to start a conversation right.' },
  { id: 'book',     icon: '📖', name: 'Book',      cost: 10, reaction: "A book?? You clearly understand me. I'm adding it to my list immediately." },
  { id: 'playlist', icon: '🎵', name: 'Playlist',  cost: 8,  reaction: "A playlist! I'm literally playing this right now. You have taste." },
  { id: 'flowers',  icon: '💐', name: 'Flowers',   cost: 15, reaction: "Flowers! That's genuinely sweet. You're going to be so good at this." },
  { id: 'pizza',    icon: '🍕', name: 'Pizza',     cost: 5,  reaction: "PIZZA. This is the best gift. You understand me on a molecular level." },
  { id: 'star',     icon: '⭐', name: 'Gold Star', cost: 25, reaction: "A gold star?! That's the highest honor. I'm keeping this forever. You're my favorite." },
]

// ─── Activities ───
const ACTIVITIES = [
  "Truth or Dare",
  "Rate My Opener",
  "Would You Rather",
  "Analyze My Match",
  "Pre-Date Coaching",
  "Vent Session",
]

const QUICK_TOPICS = [
  "I have a date tonight — help me prepare",
  "Am I being too picky?",
  "How do I know if she's actually interested?",
  "Help me write the perfect first message",
]

const RELATIONSHIP_LEVELS = [
  { level: 1, name: 'Stranger',    xpNeeded: 0,   emoji: '👋' },
  { level: 2, name: 'Acquaintance',xpNeeded: 50,  emoji: '🤝' },
  { level: 3, name: 'Close Friend',xpNeeded: 150, emoji: '🫂' },
  { level: 4, name: 'Best Friend', xpNeeded: 350, emoji: '💛' },
  { level: 5, name: 'Soulmate',    xpNeeded: 700, emoji: '✨' },
]

const DEMO_REPLIES = [
  "That's really interesting — tell me more about that.",
  "I totally get that. What's the part you keep going back to?",
  "Honestly? You're being too hard on yourself. You have great instincts.",
  "Ha, I knew you'd say that. Okay here's what I actually think...",
  "You already know the answer. Let me help you see it clearly.",
]

const ACTIVITY_RESPONSES = {
  "Truth or Dare": "Ooh, fun! I'll start — Truth or Dare? And no, you can't pick Dare just to avoid the question.",
  "Rate My Opener": "Send it. I'll rate it 1-10 and tell you exactly what to change. I have strong opinions about openers.",
  "Would You Rather": "Perfect game. Would you rather: go on a perfect first date but never see them again — or have an awkward first date with your actual soulmate?",
  "Analyze My Match": "Yes, let's do this. Tell me about the match — what's their profile like, and what's making you hesitate?",
  "Pre-Date Coaching": "Okay, when is it, where is it, and on a scale of 1-10 how nervous are you? I'll get you ready.",
  "Vent Session": "All ears. No fixing, no advice unless you ask — just listening. Go.",
}

// ─── Dark background aurora ───
function CompanionBg({ accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(45,59,45,0.35) 0%, transparent 70%)', filter: 'blur(70px)' }} />
    </div>
  )
}

// ══════════════════════════════════════
export default function CompanionChat() {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [xp, setXp] = useState(35)
  const [coins, setCoins] = useState(50)
  const [streak] = useState(3)
  const [showGiftStore, setShowGiftStore] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const endRef = useRef(null)

  const currentLevel = [...RELATIONSHIP_LEVELS].reverse().find(l => xp >= l.xpNeeded) || RELATIONSHIP_LEVELS[0]
  const nextLevel = RELATIONSHIP_LEVELS.find(l => l.xpNeeded > xp)
  const levelProgress = nextLevel
    ? ((xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100
    : 100

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const companion = AVATARS.find(a => a.id === selectedAvatar)

  const startChat = (topic) => {
    if (!companion) return
    setStarted(true)
    setMessages([{ role: 'assistant', content: companion.greeting }])
    if (topic) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'user', content: topic }])
        setMsgCount(1)
        setXp(x => x + 5)
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: DEMO_REPLIES[0] }])
          setIsTyping(false)
        }, 1400)
      }, 700)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    setInput('')
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setMsgCount(c => c + 1)
    setXp(x => x + 5)
    setCoins(c => c + 2)
    setIsTyping(true)

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey && companion) {
      const reply = await sendMessage(updated.map(m => ({ role: m.role, content: m.content })), companion.system)
      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        setIsTyping(false)
        return
      }
    }
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: DEMO_REPLIES[msgCount % DEMO_REPLIES.length] }])
      setIsTyping(false)
    }, 1200)
  }

  const handleGift = (gift) => {
    if (coins < gift.cost) return
    setCoins(c => c - gift.cost)
    setXp(x => x + gift.cost)
    setShowGiftStore(false)
    setMessages(prev => [...prev, { role: 'user', content: `🎁 Sent a ${gift.name} ${gift.icon}` }])
    setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', content: gift.reaction }]), 800)
  }

  const handleActivity = (activity) => {
    setShowActivities(false)
    setMessages(prev => [...prev, { role: 'user', content: `Let's do: ${activity}` }])
    setXp(x => x + 10)
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: ACTIVITY_RESPONSES[activity] || "Let's do it!" }])
      setIsTyping(false)
    }, 1100)
  }

  const handleVoiceCall = () => {
    setIsVoiceActive(true)
    setTimeout(() => setIsVoiceActive(false), 4000)
  }

  // ─── SCREEN 1: Avatar Selection ───
  if (!selectedAvatar) {
    return (
      <div className="relative overflow-hidden rounded-2xl" style={{ background: '#0D1117', minHeight: '100vh' }}>
        <CompanionBg accent="#C94B4B" />
        <div className="relative z-10 py-8 px-2">
          <div className="text-center mb-8 au">
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#F5F0EB' }}>
              Meet your <span className="italic" style={{ color: '#C94B4B' }}>AI friend</span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(245,240,235,0.4)' }}>
              She already knows about you. Pick who you want to talk to.
            </p>
          </div>

          {/* Avatar cards — full bleed photo */}
          <div className="space-y-4 max-w-md mx-auto mb-8">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAvatar(a.id)}
                className="w-full text-left rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] group au"
                style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={a.photo} alt={a.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to right, rgba(13,17,23,0) 35%, rgba(13,17,23,0.97) 100%)'
                  }} />
                  <div className="absolute inset-0 flex flex-col justify-center items-end pr-5">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <p className="font-display text-xl font-bold" style={{ color: '#F5F0EB' }}>{a.name}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: a.accentBg, color: a.accent, border: `1px solid ${a.accent}40` }}>
                          {a.vibe}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed max-w-[185px]" style={{ color: 'rgba(245,240,235,0.45)' }}>
                        {a.desc}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <span style={{ color: a.accent, fontSize: '12px' }}>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Stats + premium */}
          <div className="max-w-md mx-auto space-y-4 px-2">
            <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{streak}-day streak</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.3)' }}>Keep it going</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>🪙</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{coins} coins</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.3)' }}>Buy gifts</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '💬', label: 'Unlimited chat' },
                { icon: '🎁', label: 'Gift exchange' },
                { icon: '🎮', label: 'Activities' },
                { icon: '📞', label: 'Voice calls' },
                { icon: '🧠', label: 'Remembers you' },
                { icon: '📈', label: 'Level up' },
              ].map(f => (
                <div key={f.label} className="rounded-xl p-3 flex flex-col items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-base">{f.icon}</span>
                  <span className="text-[10px] text-center" style={{ color: 'rgba(245,240,235,0.4)' }}>{f.label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, rgba(201,75,75,0.1), rgba(212,149,106,0.07))', border: '1px solid rgba(201,75,75,0.18)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>PRO</span>
                <p className="font-display font-bold text-sm" style={{ color: '#F5F0EB' }}>Crushky Premium</p>
              </div>
              <p className="text-xs mb-3" style={{ color: 'rgba(245,240,235,0.4)' }}>
                Voice calls, all companions, priority matching, deep personality reports.
              </p>
              <div className="flex items-end gap-1 mb-3">
                <span className="font-display text-2xl font-bold" style={{ color: '#F5F0EB' }}>₹299</span>
                <span className="text-sm mb-0.5" style={{ color: 'rgba(245,240,235,0.35)' }}>/month</span>
              </div>
              <button className="w-full py-3 rounded-full text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── SCREEN 2: Pre-chat ───
  if (!started) {
    return (
      <div className="relative overflow-hidden" style={{ background: '#0D1117', minHeight: '100vh' }}>
        <CompanionBg accent={companion.accent} />
        <div className="relative z-10 py-8 au max-w-md mx-auto px-4">

          {/* Hero photo with voice call */}
          <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 cursor-pointer group" onClick={handleVoiceCall}>
            <img src={companion.photo} alt={companion.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.05) 55%)',
            }} />
            {isVoiceActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(13,17,23,0.85)' }}>
                <div className="relative mb-3">
                  <div className="voice-ring-outer absolute rounded-full" style={{ width: '60px', height: '60px', top: '-10px', left: '-10px', border: `1px solid ${companion.accent}50` }} />
                  <div className="voice-ring-mid absolute rounded-full" style={{ width: '60px', height: '60px', top: '-10px', left: '-10px', border: `1px solid ${companion.accent}30`, animationDelay: '0.6s' }} />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10" style={{ background: companion.accent }}>
                    <div className="flex items-end gap-0.5 h-5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="wave-bar bg-white" style={{ height: '16px', animationDelay: `${i * 90}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold">Calling {companion.name}…</p>
              </div>
            ) : (
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-white">{companion.name}</p>
                  <p className="text-xs" style={{ color: companion.accent }}>{companion.vibe}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium"
                  style={{ background: companion.accent + 'cc' }}>
                  <span>📞</span> Voice call
                </div>
              </div>
            )}
          </div>

          {/* Level stats */}
          <div className="rounded-2xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{currentLevel.emoji}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#F5F0EB' }}>Lvl {currentLevel.level}: {currentLevel.name}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.35)' }}>
                    {xp} XP {nextLevel ? `· ${nextLevel.xpNeeded - xp} to ${nextLevel.name}` : '· Max!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold" style={{ color: '#F5F0EB' }}>🔥 {streak}</span>
                <span className="text-xs font-bold" style={{ color: '#F5F0EB' }}>🪙 {coins}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${levelProgress}%`, background: `linear-gradient(90deg, ${companion.accent}, #D4956A)` }} />
            </div>
          </div>

          {/* Quick topics */}
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(245,240,235,0.3)' }}>Quick topics</p>
          <div className="space-y-2 mb-6">
            {QUICK_TOPICS.map(topic => (
              <button key={topic} onClick={() => startChat(topic)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.55)' }}>
                {topic}
              </button>
            ))}
          </div>

          {/* Activities */}
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(245,240,235,0.3)' }}>
            Activities <span style={{ color: companion.accent }}>+10 XP</span>
          </p>
          <div className="grid grid-cols-3 gap-2 mb-8">
            {ACTIVITIES.map(a => (
              <button key={a}
                onClick={() => { startChat(null); setTimeout(() => handleActivity(a), 900) }}
                className="py-3 rounded-xl text-[11px] font-medium cursor-pointer text-center transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.5)' }}>
                {a}
              </button>
            ))}
          </div>

          <button onClick={() => startChat(null)}
            className="w-full py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
            style={{ background: companion.accent, color: '#F5F0EB' }}>
            Just chat with {companion.name}
          </button>

          <div className="text-center mt-5">
            <button onClick={() => { setSelectedAvatar(null); setStarted(false); setMessages([]) }}
              className="text-xs underline underline-offset-2 cursor-pointer"
              style={{ color: 'rgba(245,240,235,0.3)' }}>
              Switch companion
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── SCREEN 3: Active Chat ───
  return (
    <div className="flex flex-col relative" style={{ height: 'calc(100vh - 120px)', background: '#0D1117' }}>
      <CompanionBg accent={companion.accent} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between py-3 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setStarted(false); setMessages([]); setMsgCount(0) }}
            className="text-sm cursor-pointer"
            style={{ color: 'rgba(245,240,235,0.35)' }}>←</button>
          <div className="relative">
            <img src={companion.photo} alt={companion.name} className="w-8 h-8 rounded-full object-cover object-top" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2"
              style={{ borderColor: '#0D1117' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{companion.name}</p>
            <p className="text-[10px] font-medium" style={{ color: companion.accent }}>Online · Lvl {currentLevel.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-xs">🔥</span>
            <span className="text-[10px] font-bold" style={{ color: '#F5F0EB' }}>{streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-xs">🪙</span>
            <span className="text-[10px] font-bold" style={{ color: '#F5F0EB' }}>{coins}</span>
          </div>
          <button onClick={handleVoiceCall}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: companion.accent + '25', border: `1px solid ${companion.accent}40` }}>
            <span style={{ fontSize: '14px' }}>📞</span>
          </button>
          <button onClick={() => { setShowGiftStore(!showGiftStore); setShowActivities(false) }}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            🎁
          </button>
          <button onClick={() => { setShowActivities(!showActivities); setShowGiftStore(false) }}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            🎮
          </button>
        </div>
      </div>

      {/* XP bar */}
      <div className="relative z-10 px-4 py-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: 'rgba(245,240,235,0.35)' }}>{currentLevel.emoji} {currentLevel.name}</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${levelProgress}%`, background: `linear-gradient(90deg, ${companion.accent}, #D4956A)` }} />
          </div>
          {nextLevel && <span className="text-[10px]" style={{ color: 'rgba(245,240,235,0.25)' }}>{nextLevel.emoji}</span>}
        </div>
      </div>

      {/* Voice call overlay */}
      {isVoiceActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'rgba(13,17,23,0.97)' }}>
          <div className="relative mb-6">
            <div className="voice-ring-outer absolute rounded-full"
              style={{ width: '120px', height: '120px', top: '-8px', left: '-8px', border: `1px solid ${companion.accent}40` }} />
            <div className="voice-ring-mid absolute rounded-full"
              style={{ width: '120px', height: '120px', top: '-8px', left: '-8px', border: `1px solid ${companion.accent}25`, animationDelay: '0.6s' }} />
            <img src={companion.photo} alt={companion.name}
              className="w-28 h-28 rounded-full object-cover object-top relative z-10 mic-breath" />
          </div>
          <p className="font-display text-xl font-bold mb-1" style={{ color: '#F5F0EB' }}>Calling {companion.name}…</p>
          <p className="text-xs mb-8" style={{ color: 'rgba(245,240,235,0.4)' }}>Voice session · Premium feature</p>
          <button onClick={() => setIsVoiceActive(false)}
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: '#C94B4B' }}>
            <span className="text-white text-lg">✕</span>
          </button>
        </div>
      )}

      {/* Gift store */}
      {showGiftStore && (
        <div className="relative z-10 px-4 py-4 as" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,17,23,0.96)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: '#F5F0EB' }}>Send a gift to {companion.name}</p>
            <button onClick={() => setShowGiftStore(false)} className="cursor-pointer" style={{ color: 'rgba(245,240,235,0.4)' }}>✕</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GIFTS.map(g => (
              <button key={g.id} onClick={() => handleGift(g)} disabled={coins < g.cost}
                className="rounded-xl p-3 text-center cursor-pointer transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl block mb-1">{g.icon}</span>
                <p className="text-[11px] font-medium" style={{ color: '#F5F0EB' }}>{g.name}</p>
                <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.4)' }}>🪙 {g.cost}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {showActivities && (
        <div className="relative z-10 px-4 py-4 as" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,17,23,0.96)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: '#F5F0EB' }}>
              Activities <span style={{ color: companion.accent }}>+10 XP</span>
            </p>
            <button onClick={() => setShowActivities(false)} className="cursor-pointer" style={{ color: 'rgba(245,240,235,0.4)' }}>✕</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ACTIVITIES.map(a => (
              <button key={a} onClick={() => handleActivity(a)}
                className="rounded-xl p-2.5 text-[11px] font-medium cursor-pointer text-center transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.55)' }}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto py-4 px-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            {msg.role === 'assistant' && (
              <img src={companion.photo} alt={companion.name}
                className="w-7 h-7 rounded-full object-cover object-top shrink-0 mr-2 mt-1 self-start" />
            )}
            <div
              className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
              style={msg.role === 'user'
                ? { background: '#2D3B2D', color: '#F5F0EB', borderRadius: '18px 18px 4px 18px' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px 18px 18px 4px' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <img src={companion.photo} alt={companion.name}
              className="w-7 h-7 rounded-full object-cover object-top shrink-0 mr-2" />
            <div className="px-4 py-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                {[0,150,300].map(d => (
                  <span key={d} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'rgba(245,240,235,0.25)', animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 py-3 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Talk to ${companion.name}…`}
            className="flex-1 rounded-full px-5 py-3 text-sm outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F0EB' }}
          />
          <button onClick={handleSend} disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 transition-all hover:opacity-90"
            style={{ background: companion.accent }}>
            <span className="text-white">›</span>
          </button>
        </div>
        <p className="text-center text-[9px] mt-2" style={{ color: 'rgba(245,240,235,0.2)' }}>
          +5 XP per message · +2 coins per message
        </p>
      </div>
    </div>
  )
}
