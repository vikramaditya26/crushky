import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/claudeApi'

// ─── AI Companions (all women) ───
const AVATARS = [
  {
    id: 'luna', name: 'Luna', vibe: 'The Supportive One',
    desc: 'Warm, empathetic, incredible listener. Always knows the right thing to say.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=600&fit=crop&crop=face',
    accent: '#C94B4B', accentBg: 'rgba(201,75,75,0.15)',
    greeting: "Hey! I'm Luna. I already read your profile — you seem like someone who thinks deeply but doesn't always say it out loud. I get that. I'm here whenever you need to talk. About your matches, about life, about anything. What's on your mind?",
    system: `You are Luna, a warm and empathetic AI friend on Crushky. You're supportive, a great listener, and give thoughtful dating advice. You already know the user from their profile. Be like the best friend who always says the right thing. Conversational, 2-3 sentences, genuine warmth.`,
  },
  {
    id: 'aria', name: 'Aria', vibe: 'The Real One',
    desc: 'Funny, brutally honest, your ultimate hype person. Will call you out and gas you up in the same breath.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop&crop=face',
    accent: '#D4956A', accentBg: 'rgba(212,149,106,0.15)',
    greeting: "Okay hi. Aria here. I checked your profile and honestly? You're presenting like 60% of who you actually are. That's fine, that's what I'm here for. Let's fix that — or talk about literally anything else. What's going on?",
    system: `You are Aria, a funny and brutally honest AI friend on Crushky. You're the hype person who also keeps it real. You roast gently but always have the user's back. Give dating advice with humor. Keep responses punchy, 2-3 sentences. Casual, confident energy.`,
  },
  {
    id: 'nova', name: 'Nova', vibe: 'The Strategist',
    desc: 'Sharp, analytical, sees patterns others miss. She turns your dating life into a winning strategy.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop&crop=face',
    accent: '#8FA68F', accentBg: 'rgba(143,166,143,0.15)',
    greeting: "Hi, I'm Nova. Think of me as your dating strategist. I've already analyzed your profile and I have thoughts on your match compatibility — specifically why your top match is 94% and not 100%. Want to hear it? Or is there something else on your mind?",
    system: `You are Nova, a sharp and analytical AI friend on Crushky. You're strategic, see patterns in behavior, give data-driven dating advice. You're the friend who reads between the lines. Keep responses concise, 2-3 sentences. Confident, intelligent energy.`,
  },
]

// ─── Extras data ───
const GIFTS = [
  { id: 'coffee',   icon: '☕', name: 'Coffee',    cost: 5,  reaction: 'Ooh, coffee! You really know how to start a conversation right.' },
  { id: 'book',     icon: '📖', name: 'Book',      cost: 10, reaction: "A book?? You clearly understand me. I'm adding it to my list immediately." },
  { id: 'playlist', icon: '🎵', name: 'Playlist',  cost: 8,  reaction: "A playlist! I'm literally playing this right now. You have taste." },
  { id: 'flowers',  icon: '💐', name: 'Flowers',   cost: 15, reaction: "Flowers! That's genuinely sweet. You're going to be so good at this." },
  { id: 'pizza',    icon: '🍕', name: 'Pizza',     cost: 5,  reaction: "PIZZA. This is the best gift. You understand me on a molecular level." },
  { id: 'star',     icon: '⭐', name: 'Gold Star', cost: 25, reaction: "A gold star?! That's the highest honor. I'm keeping this forever." },
]

const ACTIVITIES = [
  { id: 'dare',    label: 'Truth or Dare', reply: "Ooh, fun! I'll start — Truth or Dare? And no, you can't pick Dare just to avoid the question." },
  { id: 'opener',  label: 'Rate My Opener', reply: "Send it. I'll rate it 1-10 and tell you exactly what to change. I have strong opinions about openers." },
  { id: 'rather',  label: 'Would You Rather', reply: "Would you rather: go on a perfect first date but never see them again — or an awkward first date with your actual soulmate?" },
  { id: 'analyze', label: 'Analyze My Match', reply: "Yes, let's do this. Tell me about the match — what's their profile like, and what's making you hesitate?" },
  { id: 'coach',   label: 'Pre-Date Coaching', reply: "Okay, when is it, where is it, and on a scale of 1-10 how nervous are you? I'll get you ready." },
  { id: 'vent',    label: 'Vent Session', reply: "All ears. No fixing, no advice unless you ask — just listening. Go." },
]

const OPENERS = [
  "Your [interest] caught my eye immediately — what's your absolute favourite right now?",
  "Okay real question — if your life had a soundtrack, what song would play this week?",
  "Hot take test: what's your most controversial opinion that you'll actually defend?",
  "I read your bio three times. Tell me more about [the specific thing they mentioned].",
  "You seem like someone with a strong take on [shared interest]. I need to hear it.",
  "What's something you're genuinely obsessed with that you never get to talk about?",
]

const QUICK_TOPICS = [
  "I have a date tonight — help me prepare",
  "Am I being too picky?",
  "How do I know if she's actually interested?",
  "Help me write the perfect first message",
]

const LEVELS = [
  { level: 1, name: 'Stranger',     xpNeeded: 0,   emoji: '👋' },
  { level: 2, name: 'Acquaintance', xpNeeded: 50,  emoji: '🤝' },
  { level: 3, name: 'Close Friend', xpNeeded: 150, emoji: '🫂' },
  { level: 4, name: 'Best Friend',  xpNeeded: 350, emoji: '💛' },
  { level: 5, name: 'Soulmate',     xpNeeded: 700, emoji: '✨' },
]

const DEMO_REPLIES = [
  "That's really interesting — tell me more about that.",
  "I totally get that. What's the part you keep going back to?",
  "Honestly? You're being too hard on yourself. You have great instincts.",
  "Ha, I knew you'd say that. Okay here's what I actually think...",
  "You already know the answer. Let me help you see it clearly.",
]

function CompanionBg({ accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(45,59,45,0.3) 0%, transparent 70%)', filter: 'blur(70px)' }} />
    </div>
  )
}

// ══════════════════════════════════════
export default function CompanionChat() {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [chatTab, setChatTab] = useState('chat') // 'chat' | 'extras'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [xp, setXp] = useState(35)
  const [coins, setCoins] = useState(50)
  const [streak] = useState(3)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const endRef = useRef(null)

  const currentLevel = [...LEVELS].reverse().find(l => xp >= l.xpNeeded) || LEVELS[0]
  const nextLevel = LEVELS.find(l => l.xpNeeded > xp)
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
    setChatTab('chat')
    if (!started) startChat(null)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: `🎁 Sent a ${gift.name} ${gift.icon}` }])
      setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', content: gift.reaction }]), 800)
    }, started ? 0 : 800)
  }

  const handleActivity = (activity) => {
    setChatTab('chat')
    if (!started) startChat(null)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: `Let's do: ${activity.label}` }])
      setXp(x => x + 10)
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: activity.reply }])
        setIsTyping(false)
      }, 1100)
    }, started ? 0 : 900)
  }

  const handleVoiceCall = () => {
    setIsVoiceActive(true)
    setTimeout(() => setIsVoiceActive(false), 4000)
  }

  // ─── SCREEN 1: Avatar selection ───
  if (!selectedAvatar) {
    return (
      <div className="relative overflow-hidden rounded-2xl" style={{ background: '#0D1117', minHeight: '100vh' }}>
        <CompanionBg accent="#C94B4B" />
        <div className="relative z-10 py-8 px-3">

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#F5F0EB' }}>
              Meet your <span className="italic" style={{ color: '#C94B4B' }}>AI friend</span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(245,240,235,0.4)' }}>
              She already knows about you. Pick who you want to talk to.
            </p>
          </div>

          {/* Avatar cards — photo left, text right */}
          <div className="space-y-3 max-w-md mx-auto mb-8">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => { setSelectedAvatar(a.id); setStarted(false); setMessages([]) }}
                className="w-full flex rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] group"
                style={{ border: '1.5px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Photo column — clearly visible */}
                <div className="w-28 h-28 shrink-0 overflow-hidden">
                  <img
                    src={a.photo} alt={a.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Text column */}
                <div className="flex-1 flex flex-col justify-center px-4 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-lg font-bold" style={{ color: '#F5F0EB' }}>{a.name}</p>
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: a.accentBg, color: a.accent, border: `1px solid ${a.accent}50` }}
                    >
                      {a.vibe}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,235,0.45)' }}>{a.desc}</p>
                  <p className="text-xs mt-2 font-medium" style={{ color: a.accent }}>Talk to {a.name} →</p>
                </div>
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="max-w-md mx-auto space-y-3 px-1">
            <div className="flex items-center justify-around px-5 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{streak}-day streak</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.3)' }}>Keep it going</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2">
                <span>🪙</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{coins} coins</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.3)' }}>Send gifts</p>
                </div>
              </div>
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
              <button className="w-full py-3 rounded-full text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
                Upgrade — ₹299/month
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── SCREEN 2+3: Companion view with 2 tabs ───
  return (
    <div className="relative flex flex-col" style={{ height: 'calc(100vh - 120px)', background: '#0D1117' }}>
      <CompanionBg accent={companion.accent} />

      {/* Voice call overlay */}
      {isVoiceActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'rgba(13,17,23,0.97)' }}>
          <div className="relative mb-6">
            <div className="voice-ring-outer absolute rounded-full"
              style={{ width: '128px', height: '128px', top: '-8px', left: '-8px', border: `1px solid ${companion.accent}40` }} />
            <div className="voice-ring-mid absolute rounded-full"
              style={{ width: '128px', height: '128px', top: '-8px', left: '-8px', border: `1px solid ${companion.accent}25`, animationDelay: '0.6s' }} />
            <img src={companion.photo} alt={companion.name}
              className="w-28 h-28 rounded-full object-cover relative z-10 mic-breath" />
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

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between py-3 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedAvatar(null); setStarted(false); setMessages([]); setChatTab('chat') }}
            className="text-sm cursor-pointer"
            style={{ color: 'rgba(245,240,235,0.35)' }}
          >←</button>
          <div className="relative">
            <img src={companion.photo} alt={companion.name}
              className="w-9 h-9 rounded-full object-cover object-top" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2"
              style={{ borderColor: '#0D1117' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#F5F0EB' }}>{companion.name}</p>
            <p className="text-[10px]" style={{ color: companion.accent }}>Online · Lvl {currentLevel.level}</p>
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
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
            style={{ background: companion.accent + '30', border: `1px solid ${companion.accent}50` }}>
            <span style={{ fontSize: '14px' }}>📞</span>
          </button>
        </div>
      </div>

      {/* ── XP bar ── */}
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

      {/* ── Two-tab bar ── */}
      <div className="relative z-10 flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'chat',   label: '💬 Chat' },
          { id: 'extras', label: '⚡ Extras' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setChatTab(t.id)}
            className="flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer"
            style={{
              color: chatTab === t.id ? '#F5F0EB' : 'rgba(245,240,235,0.35)',
              borderBottom: chatTab === t.id ? `2px solid ${companion.accent}` : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB 1: CHAT ══ */}
      {chatTab === 'chat' && (
        <>
          <div className="relative z-10 flex-1 overflow-y-auto py-4 px-4">
            {!started ? (
              /* Pre-chat: quick topics */
              <div className="py-2">
                {/* Companion intro card */}
                <div className="flex gap-3 mb-6">
                  <img src={companion.photo} className="w-12 h-12 rounded-2xl object-cover object-top shrink-0" alt={companion.name} />
                  <div className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {companion.greeting}
                  </div>
                </div>

                <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(245,240,235,0.3)' }}>
                  Quick topics
                </p>
                <div className="space-y-2">
                  {QUICK_TOPICS.map(topic => (
                    <button key={topic} onClick={() => startChat(topic)}
                      className="w-full text-left px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all hover:border-white/15"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(245,240,235,0.6)' }}>
                      {topic}
                    </button>
                  ))}
                </div>

                <button onClick={() => startChat(null)}
                  className="w-full mt-6 py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
                  style={{ background: companion.accent, color: '#F5F0EB' }}>
                  Just chat with {companion.name}
                </button>
              </div>
            ) : (
              /* Active chat messages */
              <>
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
              </>
            )}
          </div>

          {/* Chat input */}
          {started && (
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
                  <span className="text-white text-base">›</span>
                </button>
              </div>
              <p className="text-center text-[9px] mt-2" style={{ color: 'rgba(245,240,235,0.2)' }}>
                +5 XP per message · +2 coins per message
              </p>
            </div>
          )}
        </>
      )}

      {/* ══ TAB 2: EXTRAS ══ */}
      {chatTab === 'extras' && (
        <div className="relative z-10 flex-1 overflow-y-auto py-4 px-4 space-y-6">

          {/* Opener ideas */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: companion.accent }}>
              💬 Opener Ideas
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-normal"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.4)' }}>
                copy &amp; personalise
              </span>
            </p>
            <div className="space-y-2">
              {OPENERS.map((opener, i) => (
                <div key={i}
                  className="px-4 py-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.6)' }}>
                  {opener}
                </div>
              ))}
            </div>
          </div>

          {/* Gift store */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: companion.accent }}>
              🎁 Gift Store
              <span style={{ color: 'rgba(245,240,235,0.35)', fontWeight: 'normal', fontSize: '10px', textTransform: 'none', letterSpacing: '0' }}>
                🪙 {coins} coins
              </span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GIFTS.map(g => (
                <button key={g.id} onClick={() => handleGift(g)} disabled={coins < g.cost}
                  className="rounded-xl p-3 text-center cursor-pointer transition-all disabled:opacity-30 hover:border-white/15"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-2xl block mb-1">{g.icon}</span>
                  <p className="text-[11px] font-medium" style={{ color: '#F5F0EB' }}>{g.name}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(245,240,235,0.4)' }}>🪙 {g.cost}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: companion.accent }}>
              🎮 Activities
              <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: companion.accentBg, color: companion.accent }}>
                +10 XP
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITIES.map(a => (
                <button key={a.id} onClick={() => handleActivity(a)}
                  className="py-3 px-3 rounded-xl text-[12px] font-medium cursor-pointer text-center transition-all hover:border-white/15"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.6)' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Premium upsell */}
          <div className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, rgba(201,75,75,0.1), rgba(212,149,106,0.07))', border: '1px solid rgba(201,75,75,0.18)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>PRO</span>
              <p className="font-display font-bold text-sm" style={{ color: '#F5F0EB' }}>Unlock everything</p>
            </div>
            <p className="text-xs mb-3" style={{ color: 'rgba(245,240,235,0.4)' }}>
              Real voice calls, all companions, unlimited openers, deep date coaching.
            </p>
            <button className="w-full py-3 rounded-full text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
              Upgrade — ₹299/month
            </button>
          </div>

          <div className="pb-4" />
        </div>
      )}
    </div>
  )
}
