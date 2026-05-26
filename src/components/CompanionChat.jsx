import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const COMPANION_SYSTEM = `You are Crushky's AI companion — a warm, witty, and genuinely caring friend. You give amazing dating advice, remember everything, and never judge. Keep responses conversational and short (2-3 sentences). Use humor naturally. You're a friend, not a therapist.`

const DEMO_REPLIES = [
  "That's really interesting! So what's been on your mind lately?",
  "I totally get that. What do you think is the real thing holding you back?",
  "You know what, you're being way too hard on yourself. You've got great instincts about people.",
  "Ha, I knew you'd say that! Okay here's what I think...",
]

const FEATURES = [
  { icon: '💬', label: 'Chat', desc: 'Text anytime', active: true },
  { icon: '🎙', label: 'Voice', desc: 'Voice notes', active: false, premium: true },
  { icon: '📞', label: 'Call', desc: 'AI voice call', active: false, premium: true },
  { icon: '🎯', label: 'Date Prep', desc: 'Pre-date coaching', active: false, premium: true },
]

const QUICK_TOPICS = [
  "I have a date tonight, help me prepare",
  "Am I being too picky?",
  "How do I know if she's interested?",
  "I got ghosted, what do I do?",
]

export default function CompanionChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startChat = (topic) => {
    setStarted(true)
    const greeting = "Hey! I'm your Crushky companion. Think of me as that friend who always knows the right thing to say about dating and life. What's on your mind?"
    setMessages([{ role: 'assistant', content: greeting }])
    if (topic) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'user', content: topic }])
        setMsgCount(1)
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

    if (msgCount >= 4 && !showPaywall) {
      setShowPaywall(true)
      return
    }

    const text = input.trim()
    setInput('')
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setMsgCount((c) => c + 1)
    setIsTyping(true)

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey) {
      const reply = await sendMessage(
        updated.map((m) => ({ role: m.role, content: m.content })),
        COMPANION_SYSTEM
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

  if (!started) {
    return (
      <div className="py-8 au">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-soft to-amber mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg">
            ◈
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Your AI <span className="italic text-rose">Companion</span>
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto">
            A personal AI friend that gives dating advice, helps you prep for dates, and is always there when you need to talk.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
          {FEATURES.map((f) => (
            <div key={f.label} className={`relative bg-white rounded-xl p-3 text-center border ${f.active ? 'border-dark-text/5' : 'border-dark-text/5 opacity-60'}`}>
              {f.premium && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose to-amber text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
              )}
              <span className="text-xl block mb-1">{f.icon}</span>
              <p className="text-xs font-semibold text-dark-text">{f.label}</p>
              <p className="text-[9px] text-muted mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick topics */}
        <div className="max-w-md mx-auto mb-8">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Quick topics</p>
          <div className="space-y-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => startChat(topic)}
                className="w-full text-left bg-white rounded-xl px-4 py-3 border border-dark-text/5 text-sm text-dark-text/70 cursor-pointer hover:border-dark-green/30 hover:shadow-sm transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Start chat */}
        <div className="text-center">
          <button
            onClick={() => startChat(null)}
            className="bg-dark-green text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg text-sm"
          >
            Start chatting
          </button>
        </div>

        {/* Revenue pitch */}
        <div className="mt-10 bg-gradient-to-br from-rose-light/30 to-amber-light/20 rounded-2xl p-6 max-w-md mx-auto">
          <h3 className="font-display text-base font-bold mb-2">Crushky Premium</h3>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Unlimited companion chats, AI voice calls, date coaching, and priority matching. Everything you need to find and keep your person.
          </p>
          <div className="flex items-end gap-1 mb-3">
            <span className="font-display text-2xl font-bold text-dark-text">&#x20b9;299</span>
            <span className="text-muted text-sm mb-0.5">/month</span>
          </div>
          <div className="space-y-2">
            {['Unlimited AI companion chats', 'Voice calls with AI companion', 'Pre-date coaching sessions', 'Priority match queue', 'Personality deep-dive reports'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-dark-green/10 flex items-center justify-center shrink-0">
                  <span className="text-dark-green text-[9px]">✓</span>
                </div>
                <span className="text-dark-text/60 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 py-3 rounded-full bg-gradient-to-r from-rose to-amber text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-all">
            Upgrade to Premium
          </button>
          <p className="text-center text-muted text-[10px] mt-2">Cancel anytime. Conversations stay private.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Chat header */}
      <div className="flex items-center justify-between py-4 border-b border-dark-text/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setStarted(false); setMessages([]); setMsgCount(0); setShowPaywall(false) }}
            className="text-muted hover:text-dark-text cursor-pointer transition-colors text-sm"
          >
            &larr;
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-soft to-amber flex items-center justify-center text-white text-sm font-bold">
            C
          </div>
          <div>
            <p className="font-semibold text-sm text-dark-text">Crushky Companion</p>
            <p className="text-[10px] text-dark-green font-medium">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-dark-text/10 flex items-center justify-center text-muted text-sm cursor-pointer hover:bg-white transition-colors" title="Voice note">
            🎙
          </button>
          <button className="w-8 h-8 rounded-full border border-dark-text/10 flex items-center justify-center text-muted text-sm cursor-pointer hover:bg-white transition-colors" title="Call">
            📞
          </button>
        </div>
      </div>

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
        {showPaywall && (
          <div className="au mt-4 glass rounded-2xl p-6 text-center mx-2">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-display text-lg font-bold mb-2">Upgrade to Premium</h3>
            <p className="text-muted text-sm mb-4">
              You've used your free messages. Unlock unlimited conversations.
            </p>
            <button className="w-full py-3 rounded-full bg-gradient-to-r from-rose to-amber text-white font-bold text-sm cursor-pointer hover:shadow-lg transition-all">
              &#x20b9;299/month &mdash; Unlock now
            </button>
            <p className="text-muted text-[10px] mt-2">Cancel anytime. Conversations stay private.</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {!showPaywall && (
        <div className="py-3 border-t border-dark-text/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about dating, life, or your matches..."
              className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/25"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-all"
            >
              &#10148;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
