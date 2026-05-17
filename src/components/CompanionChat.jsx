import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const COMPANION_SYSTEM = `You are Crushky's AI companion — a warm, witty, and genuinely caring friend. You're like that one friend who gives amazing dating advice, remembers everything, and never judges. You can talk about anything: dating, relationships, life decisions, or just how someone's day went. Keep your responses conversational and short (2-3 sentences usually). Use humor naturally. Never be preachy or give unsolicited advice — wait to be asked. You're a friend, not a therapist.`

export default function CompanionChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your Crushky companion. Think of me as that friend who always has the best dating advice and never judges. What's on your mind?" },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    setInput('')
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setIsTyping(true)

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey) {
      const reply = await sendMessage(
        updated.map((m) => ({ role: m.role, content: m.content })),
        COMPANION_SYSTEM
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "That's really interesting! Tell me more about that. I'm all ears." },
        ])
        setIsTyping(false)
      }, 1000)
      return
    }
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.content} isUser={msg.role === 'user'} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-dark-text/5 rounded-2xl rounded-bl-sm px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-dark-text/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-dark-text/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-dark-text/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-6 py-4 border-t border-dark-text/10">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button className="w-10 h-10 rounded-full border border-dark-text/15 flex items-center justify-center text-dark-text/40 shrink-0 cursor-pointer hover:bg-dark-text/5 transition-colors">
            &#127908;
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Talk to Crushky..."
            className="flex-1 bg-white border border-dark-text/15 rounded-full px-5 py-3 text-dark-text text-sm outline-none focus:border-dark-green transition-colors placeholder:text-dark-text/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-colors"
          >
            &#10148;
          </button>
        </div>
      </div>
    </div>
  )
}
