import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const COMPANION_SYSTEM = `You are Crushky's AI companion — a warm, witty, and genuinely caring friend. You're like that one friend who gives amazing dating advice, remembers everything, and never judges. You can talk about anything: dating, relationships, life decisions, or just how someone's day went. Keep your responses conversational and short (2-3 sentences usually). Use humor naturally. Never be preachy or give unsolicited advice — wait to be asked. You're a friend, not a therapist.`

const DEMO_REPLIES = [
  "That's really interesting! I love hearing about stuff like this. So what's been on your mind lately?",
  "I totally get that. It sounds like you've been thinking about this a lot. What do you think is the real thing holding you back?",
  "You know what, you're being way too hard on yourself. From what I can tell, you've got great instincts about people.",
  "Ha, I knew you'd say that! Okay here's what I think...",
]

const AI_AVATARS = [
  { name: "Mira", role: "Dating Coach", emoji: "\u{1F338}", desc: "Helps you prepare for dates and build confidence" },
  { name: "Arjun", role: "Relationship Guide", emoji: "\u{1F9ED}", desc: "Advice on communication and understanding your partner" },
  { name: "Zara", role: "Self-Growth Mentor", emoji: "\u{2728}", desc: "Focus on personal growth and becoming your best self" },
]

export default function CompanionChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [msgCount, setMsgCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startChat = (avatar) => {
    setSelectedAvatar(avatar)
    setMessages([
      { role: 'assistant', content: `Hey! I'm ${avatar.name}, your ${avatar.role.toLowerCase()}. Think of me as that friend who always knows the right thing to say. What's on your mind today?` },
    ])
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

  if (!selectedAvatar) {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Choose your <span className="italic text-rose">companion</span></h2>
          <p className="text-muted text-sm mt-2">Pick an AI friend to chat with</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {AI_AVATARS.map((av, i) => (
            <button
              key={av.name}
              onClick={() => startChat(av)}
              className="bg-white rounded-2xl p-6 border border-dark-text/5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group anim-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {av.emoji}
              </div>
              <h3 className="font-display text-lg font-bold text-dark-text">{av.name}</h3>
              <p className="text-rose text-xs font-medium mt-0.5">{av.role}</p>
              <p className="text-muted text-xs mt-2 leading-relaxed">{av.desc}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 py-4 border-b border-dark-text/5">
        <button
          onClick={() => { setSelectedAvatar(null); setMessages([]); setMsgCount(0); setShowPaywall(false) }}
          className="text-muted hover:text-dark-text cursor-pointer transition-colors text-sm"
        >
          &larr;
        </button>
        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-base">
          {selectedAvatar.emoji}
        </div>
        <div>
          <p className="font-semibold text-sm text-dark-text">{selectedAvatar.name}</p>
          <p className="text-[10px] text-muted">{selectedAvatar.role}</p>
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
          <div className="anim-up mt-4 glass-card rounded-2xl p-6 text-center mx-4">
            <div className="text-3xl mb-3">&#128274;</div>
            <h3 className="font-display text-lg font-bold mb-2">Upgrade to Premium</h3>
            <p className="text-muted text-sm mb-4 leading-relaxed">
              You've used your free messages. Unlock unlimited conversations with all AI companions.
            </p>
            <div className="bg-gradient-to-r from-rose to-amber text-white font-bold text-lg rounded-xl py-3 mb-2">
              &#x20b9;299/month
            </div>
            <p className="text-muted text-[10px]">Cancel anytime. Your conversations stay private.</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {!showPaywall && (
        <div className="py-4 border-t border-dark-text/5">
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full border border-dark-text/10 flex items-center justify-center text-dark-text/30 shrink-0 cursor-pointer hover:bg-white transition-colors">
              &#127908;
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Talk to ${selectedAvatar.name}...`}
              className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-dark-text text-sm outline-none focus:border-dark-green/40 focus:shadow-sm transition-all placeholder:text-dark-text/25"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-all hover:shadow-md"
            >
              &#10148;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
