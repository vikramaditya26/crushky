import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const DEMO_RESPONSES = [
  "Hey! Welcome to Crushky. I'm so glad you're here. So tell me — how's your day going so far?",
  "Love that. Okay, tell me a bit about yourself — what do you do? Like, what fills your days?",
  "That's really cool. I can already tell you've got an interesting mind. So what does your ideal weekend look like?",
  "Nice taste. Okay, getting a bit more real now — what are you actually looking for? Like, honestly?",
  "I appreciate the honesty. Quick one — do you drink, smoke, or have any strong preferences about that in a partner?",
  "Got it. Now here's a fun one — what's something most people wouldn't guess about you?",
  "Ha, I love that. Okay this one's spicy — describe your last situationship or relationship in three words.",
  "Oof, felt that. So what kind of person makes you feel most alive? Like, what energy draws you in?",
  "Beautiful answer. Alright, one thing you'd absolutely never compromise on in a partner?",
  "Respect. Last one — what's your love language?",
  "I think I know exactly who you should meet. Give me a moment...",
]

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [exchangeCount, setExchangeCount] = useState(0)
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => {
        if (prev.length > 0) return prev
        return [{ role: 'assistant', content: DEMO_RESPONSES[0] }]
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    const newExchange = exchangeCount + 1

    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage },
    ]
    setMessages(updatedMessages)
    setExchangeCount(newExchange)
    setIsTyping(true)

    if (newExchange >= 10) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: DEMO_RESPONSES[10] },
        ])
        setIsTyping(false)
        setTimeout(() => navigate('/match'), 2000)
      }, 1500)
      return
    }

    const hasApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

    if (hasApiKey) {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const reply = await sendMessage(apiMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: DEMO_RESPONSES[newExchange] || "Tell me more about that..." },
        ])
        setIsTyping(false)
      }, 1000)
      return
    }

    setIsTyping(false)
  }

  const progress = Math.min((exchangeCount / 10) * 100, 100)

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <div className="border-b border-card-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-light-text">Crushky AI</h1>
          <div className="flex items-center gap-3">
            <span className="text-light-text/40 text-xs">{exchangeCount}/10</span>
            <div className="w-24 h-1.5 bg-card-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-rose rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.content} isUser={msg.role === 'user'} />
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-card-dark border border-card-border rounded-2xl rounded-bl-md px-5 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-light-text/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-light-text/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-light-text/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-card-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
            disabled={exchangeCount >= 10}
            className="flex-1 bg-card-dark border border-card-border rounded-full px-5 py-3 text-light-text placeholder-light-text/30 focus:outline-none focus:border-rose transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || exchangeCount >= 10}
            className="bg-rose hover:bg-rose/90 disabled:bg-card-dark disabled:text-light-text/30 text-white font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
