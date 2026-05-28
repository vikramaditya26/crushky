import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const AVATARS = [
  {
    id: 'mira',
    name: 'Mira',
    vibe: 'The Supportive One',
    desc: 'Warm, empathetic, incredible listener. She remembers everything and always knows the right thing to say.',
    avatar: '🧕',
    color: 'from-rose-soft to-rose-light',
    greeting: "Hey! I'm Mira, your personal wingwoman. I already know a bit about you from your profile — you seem like someone who values depth over everything. I'm here whenever you need to talk about dating, life, or literally anything. What's on your mind?",
    system: `You are Mira, a warm and empathetic AI friend on Crushky (a dating app). You're supportive, a great listener, and give thoughtful dating advice. You remember everything the user tells you. You're like the best friend everyone wishes they had. Keep responses conversational, 2-3 sentences. Use warmth and encouragement naturally.`,
  },
  {
    id: 'arjun',
    name: 'Arjun',
    vibe: 'The Real One',
    desc: 'Funny, brutally honest, your ultimate hype man. Will roast you and gas you up in the same sentence.',
    avatar: '🧔',
    color: 'from-amber-light to-amber',
    greeting: "Yo! Arjun here. Your profile says you're looking for someone genuine — respect. I'm basically that friend who'll tell you when you're being dumb and also hype you up before a date. So what's happening, what do you need?",
    system: `You are Arjun, a funny and brutally honest AI friend on Crushky (a dating app). You're the hype man who also keeps it real. You roast gently but always have the user's back. You give dating advice with humor. Keep responses punchy, 2-3 sentences. Use casual, confident energy.`,
  },
  {
    id: 'zara',
    name: 'Zara',
    vibe: 'The Strategist',
    desc: 'Sharp, analytical, sees patterns others miss. She turns your dating life into a winning strategy.',
    avatar: '👩‍💼',
    color: 'from-sage/30 to-dark-green/10',
    greeting: "Hi, I'm Zara. Think of me as your dating strategist — I analyze patterns, spot red flags, and help you make smart moves. I've already looked at your matches and I have some thoughts. Want to hear them, or is there something specific on your mind?",
    system: `You are Zara, a sharp and analytical AI friend on Crushky (a dating app). You're strategic, see patterns in behavior, and give data-driven dating advice. You're the friend who reads between the lines. Keep responses concise, 2-3 sentences. Use confident, intelligent energy.`,
  },
]

const GIFTS = [
  { id: 'coffee', icon: '☕', name: 'Coffee', cost: 5, reaction: 'Ooh, you got me a coffee? You really know the way to my heart!' },
  { id: 'book', icon: '📚', name: 'Book', cost: 10, reaction: "A book! You clearly know me well. I'll read it tonight and tell you what I think." },
  { id: 'playlist', icon: '🎵', name: 'Playlist', cost: 8, reaction: "A playlist?? I'm literally adding this to my queue right now. Great taste as always." },
  { id: 'flowers', icon: '💐', name: 'Flowers', cost: 15, reaction: "Flowers! That's so thoughtful. You really are a romantic at heart, aren't you?" },
  { id: 'pizza', icon: '🍕', name: 'Pizza', cost: 5, reaction: "PIZZA! Now we're talking. This is honestly the best gift. You understand me." },
  { id: 'star', icon: '⭐', name: 'Gold Star', cost: 25, reaction: "A gold star?! That's the highest honor. I'm literally saving this forever. You're the best." },
]

const ACTIVITIES = [
  "Truth or Dare",
  "Rate My Opener",
  "Would You Rather",
  "Analyze My Match",
  "Pre-Date Coaching",
  "Vent Session",
]

const QUICK_TOPICS = [
  "I have a date tonight, help me prepare",
  "Am I being too picky?",
  "How do I know if she's interested?",
  "Help me write the perfect first message",
]

const RELATIONSHIP_LEVELS = [
  { level: 1, name: 'Acquaintance', xpNeeded: 0, emoji: '🤝' },
  { level: 2, name: 'Buddy', xpNeeded: 50, emoji: '😊' },
  { level: 3, name: 'Close Friend', xpNeeded: 150, emoji: '🫂' },
  { level: 4, name: 'Best Friend', xpNeeded: 350, emoji: '💛' },
  { level: 5, name: 'Soulmate', xpNeeded: 700, emoji: '✨' },
]

const DEMO_REPLIES = [
  "That's really interesting! So what's been on your mind lately?",
  "I totally get that. What do you think is the real thing holding you back?",
  "You know what, you're being way too hard on yourself. You've got great instincts about people.",
  "Ha, I knew you'd say that! Okay here's what I think...",
  "Honestly? I think you already know the answer. But let me help you see it clearly.",
]

export default function CompanionChat() {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [xp, setXp] = useState(35)
  const [coins, setCoins] = useState(50)
  const [streak, setStreak] = useState(3)
  const [showGiftStore, setShowGiftStore] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const endRef = useRef(null)

  const currentLevel = [...RELATIONSHIP_LEVELS].reverse().find(l => xp >= l.xpNeeded) || RELATIONSHIP_LEVELS[0]
  const nextLevel = RELATIONSHIP_LEVELS.find(l => l.xpNeeded > xp)
  const levelProgress = nextLevel
    ? ((xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100
    : 100

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const companion = selectedAvatar ? AVATARS.find(a => a.id === selectedAvatar) : null

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
        }, 1200)
      }, 600)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const text = input.trim()
    setInput('')
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setMsgCount((c) => c + 1)
    setXp(x => x + 5)
    setCoins(c => c + 2)
    setIsTyping(true)

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey && companion) {
      const reply = await sendMessage(
        updated.map((m) => ({ role: m.role, content: m.content })),
        companion.system
      )
      if (reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        setIsTyping(false)
        return
      }
    }

    setTimeout(() => {
      const reply = DEMO_REPLIES[msgCount % DEMO_REPLIES.length]
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setIsTyping(false)
    }, 1000)
  }

  const handleGift = (gift) => {
    if (coins < gift.cost) return
    setCoins(c => c - gift.cost)
    setXp(x => x + gift.cost)
    setShowGiftStore(false)
    setMessages(prev => [
      ...prev,
      { role: 'user', content: `🎁 Sent a ${gift.name} ${gift.icon}` },
    ])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: gift.reaction }])
    }, 800)
  }

  const handleActivity = (activity) => {
    setShowActivities(false)
    setMessages(prev => [...prev, { role: 'user', content: `Let's play ${activity}!` }])
    setXp(x => x + 10)
    setIsTyping(true)
    setTimeout(() => {
      const responses = {
        "Truth or Dare": "Ooh fun! I'll start. Truth or Dare? And you better not chicken out.",
        "Rate My Opener": "Okay send me the opener and I'll rate it 1-10. No mercy though.",
        "Would You Rather": "Love this game! Would you rather: have a perfect first date but never see them again, or have an awkward first date with your soulmate?",
        "Analyze My Match": "Send me the match details and I'll break down the compatibility for you. I'm pretty good at spotting patterns.",
        "Pre-Date Coaching": "Date coaching mode activated! When is it, where is it, and how nervous are you on a scale of 1-10?",
        "Vent Session": "Okay I'm all ears. No judgment, no fixing — just listening. Go.",
      }
      setMessages(prev => [...prev, { role: 'assistant', content: responses[activity] || "Let's do it!" }])
      setIsTyping(false)
    }, 1000)
  }

  // ─── Avatar Selection Screen ───
  if (!selectedAvatar) {
    return (
      <div className="py-8 au">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Meet your <span className="italic text-rose">virtual friend</span>
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Pick a companion who gets you. They'll remember everything, give dating advice, and be there 24/7.
          </p>
        </div>

        {/* Avatar cards */}
        <div className="space-y-4 max-w-md mx-auto mb-8">
          {AVATARS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setSelectedAvatar(a.id)}
              className="w-full text-left bg-white rounded-2xl p-5 border-2 border-dark-text/5 cursor-pointer hover:border-dark-green/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl shrink-0`}>
                  {a.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base font-bold">{a.name}</h3>
                    <span className="text-[10px] text-muted bg-cream px-2 py-0.5 rounded-full">{a.vibe}</span>
                  </div>
                  <p className="text-muted text-xs leading-relaxed">{a.desc}</p>
                </div>
                <span className="text-dark-text/20 group-hover:text-dark-green transition-colors text-lg mt-1">&rarr;</span>
              </div>
            </button>
          ))}
        </div>

        {/* Streak & coins preview */}
        <div className="max-w-md mx-auto bg-gradient-to-br from-amber-light/30 to-rose-light/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="font-display text-sm font-bold">3-day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <span className="font-display text-sm font-bold">50 coins</span>
            </div>
          </div>
          <p className="text-muted text-xs">Chat daily to keep your streak. Earn coins to buy gifts for your friend.</p>
        </div>

        {/* Feature grid */}
        <div className="max-w-md mx-auto">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Your virtual friend can</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '💬', label: 'Unlimited chat' },
              { icon: '🎯', label: 'Date coaching' },
              { icon: '🎁', label: 'Gift exchange' },
              { icon: '🎮', label: 'Fun activities' },
              { icon: '🧠', label: 'Remember everything' },
              { icon: '📈', label: 'Level up together' },
            ].map(f => (
              <div key={f.label} className="bg-white rounded-xl p-3 border border-dark-text/5 flex items-center gap-2.5">
                <span className="text-base">{f.icon}</span>
                <span className="text-xs text-dark-text/70 font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div className="mt-8 max-w-md mx-auto bg-gradient-to-br from-rose-light/30 to-amber-light/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-rose to-amber text-white text-[9px] font-bold px-2 py-0.5 rounded-full">PRO</span>
            <h3 className="font-display text-base font-bold">Crushky Premium</h3>
          </div>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Voice calls, all 3 companions, priority matching, date coaching sessions, and personality deep-dive reports.
          </p>
          <div className="flex items-end gap-1 mb-3">
            <span className="font-display text-2xl font-bold text-dark-text">&#x20b9;299</span>
            <span className="text-muted text-sm mb-0.5">/month</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {['Unlimited chats', 'Voice calls', 'All 3 companions', 'Date coaching', 'Priority matches', 'Deep-dive reports'].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <span className="text-dark-green text-[9px]">✓</span>
                <span className="text-dark-text/60 text-[11px]">{f}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3 rounded-full bg-gradient-to-r from-rose to-amber text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-all">
            Upgrade to Premium
          </button>
          <p className="text-center text-muted text-[10px] mt-2">Cancel anytime. Conversations stay private.</p>
        </div>
      </div>
    )
  }

  // ─── Pre-Chat: Topics + Activities ───
  if (!started) {
    return (
      <div className="py-6 au">
        {/* Companion header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${companion.color} mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg`}>
            {companion.avatar}
          </div>
          <h2 className="font-display text-xl font-bold">{companion.name}</h2>
          <p className="text-muted text-xs">{companion.vibe}</p>
        </div>

        {/* Stats bar */}
        <div className="bg-white rounded-2xl p-4 border border-dark-text/5 mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span>{currentLevel.emoji}</span>
              <div>
                <p className="text-xs font-semibold">Level {currentLevel.level}: {currentLevel.name}</p>
                <p className="text-[10px] text-muted">{xp} XP {nextLevel ? `· ${nextLevel.xpNeeded - xp} to ${nextLevel.name}` : '· Max level!'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-bold">{streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🪙</span>
                <span className="text-xs font-bold">{coins}</span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-dark-text/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber to-rose rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        {/* Quick topics */}
        <div className="max-w-md mx-auto mb-6">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Quick topics</p>
          <div className="space-y-2">
            {QUICK_TOPICS.map((topic) => (
              <button key={topic} onClick={() => startChat(topic)}
                className="w-full text-left bg-white rounded-xl px-4 py-3 border border-dark-text/5 text-sm text-dark-text/70 cursor-pointer hover:border-dark-green/30 hover:shadow-sm transition-all">
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="max-w-md mx-auto mb-6">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Activities <span className="text-amber">+10 XP each</span></p>
          <div className="grid grid-cols-3 gap-2">
            {ACTIVITIES.map((a) => (
              <button key={a} onClick={() => { startChat(null); setTimeout(() => handleActivity(a), 800) }}
                className="bg-white rounded-xl p-3 border border-dark-text/5 text-[11px] text-dark-text/60 font-medium cursor-pointer hover:border-dark-green/30 hover:shadow-sm transition-all text-center">
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Start chat button */}
        <div className="text-center max-w-md mx-auto">
          <button onClick={() => startChat(null)}
            className="bg-dark-green text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg text-sm">
            Just chat with {companion.name}
          </button>
        </div>

        {/* Switch */}
        <div className="text-center mt-6">
          <button onClick={() => { setSelectedAvatar(null); setStarted(false); setMessages([]) }}
            className="text-muted text-xs cursor-pointer hover:text-dark-text transition-colors underline underline-offset-2">
            Switch companion
          </button>
        </div>
      </div>
    )
  }

  // ─── Active Chat ───
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Chat header */}
      <div className="flex items-center justify-between py-3 border-b border-dark-text/5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setStarted(false); setMessages([]); setMsgCount(0) }}
            className="text-muted hover:text-dark-text cursor-pointer transition-colors text-sm">&larr;</button>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${companion.color} flex items-center justify-center text-base`}>
            {companion.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm text-dark-text">{companion.name}</p>
            <p className="text-[10px] text-dark-green font-medium">Online &middot; Lvl {currentLevel.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-light/40 px-2 py-1 rounded-full">
            <span className="text-xs">🔥</span>
            <span className="text-[10px] font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-light/30 px-2 py-1 rounded-full">
            <span className="text-xs">🪙</span>
            <span className="text-[10px] font-bold">{coins}</span>
          </div>
          <button onClick={() => { setShowGiftStore(!showGiftStore); setShowActivities(false) }}
            className="w-8 h-8 rounded-full border border-dark-text/10 flex items-center justify-center text-sm cursor-pointer hover:bg-white transition-colors">🎁</button>
          <button onClick={() => { setShowActivities(!showActivities); setShowGiftStore(false) }}
            className="w-8 h-8 rounded-full border border-dark-text/10 flex items-center justify-center text-sm cursor-pointer hover:bg-white transition-colors">🎮</button>
        </div>
      </div>

      {/* XP bar */}
      <div className="px-4 py-2 bg-cream/50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted">{currentLevel.emoji} {currentLevel.name}</span>
          <div className="flex-1 h-1.5 bg-dark-text/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber to-rose rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }} />
          </div>
          {nextLevel && <span className="text-[10px] text-muted">{nextLevel.emoji}</span>}
        </div>
      </div>

      {/* Gift store overlay */}
      {showGiftStore && (
        <div className="as bg-white border-b border-dark-text/5 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold">Send a gift to {companion.name}</p>
            <button onClick={() => setShowGiftStore(false)} className="text-muted text-sm cursor-pointer">&times;</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GIFTS.map(g => (
              <button key={g.id} onClick={() => handleGift(g)} disabled={coins < g.cost}
                className="bg-cream rounded-xl p-3 text-center cursor-pointer hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-transparent hover:border-dark-green/20">
                <span className="text-2xl block mb-1">{g.icon}</span>
                <p className="text-[11px] font-medium text-dark-text">{g.name}</p>
                <p className="text-[10px] text-muted flex items-center justify-center gap-0.5">🪙 {g.cost}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activities overlay */}
      {showActivities && (
        <div className="as bg-white border-b border-dark-text/5 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold">Activities <span className="text-amber">+10 XP</span></p>
            <button onClick={() => setShowActivities(false)} className="text-muted text-sm cursor-pointer">&times;</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ACTIVITIES.map(a => (
              <button key={a} onClick={() => handleActivity(a)}
                className="bg-cream rounded-xl p-2.5 text-[11px] font-medium text-dark-text/70 cursor-pointer hover:shadow-sm transition-all text-center border border-transparent hover:border-dark-green/20">
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.content} isUser={msg.role === 'user'} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="py-3 border-t border-dark-text/5">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Talk to ${companion.name}...`}
            className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/25" />
          <button onClick={handleSend} disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-all">
            &#10148;
          </button>
        </div>
        <p className="text-center text-muted text-[9px] mt-2">+5 XP per message &middot; +2 coins per message</p>
      </div>
    </div>
  )
}
