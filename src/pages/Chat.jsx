import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import { sendMessage } from '../utils/claudeApi'

const DEMO_RESPONSES = [
  null,
  "Love that! Sounds like you really know how to recharge. Okay next one — what are you actually looking for in a relationship? Like, honestly?",
  "I appreciate the honesty. So what kind of person makes you feel most alive? Like what energy draws you in?",
  "Beautiful answer. Last one — what's one thing you'd absolutely never compromise on in a partner?",
  "I think I've got a pretty good picture of who you are. Give me a moment to find your people...",
]

export default function Chat() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const greeting = `Hey${user.name ? ' ' + user.name : ''}! I'm so glad you're here. Let's find your person. ✨\n\nFirst up — what does your ideal weekend look like?`
    const timer = setTimeout(() => {
      setMessages((prev) => {
        if (prev.length > 0) return prev
        return [{ role: 'assistant', content: greeting }]
      })
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    setInput('')
    const newQ = questionNum + 1
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setQuestionNum(newQ)
    setIsTyping(true)

    if (newQ >= 4) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: DEMO_RESPONSES[4] }])
        setIsTyping(false)
        setTimeout(() => {
          localStorage.setItem('crushky_chat_done', 'true')
          navigate('/dashboard')
        }, 2500)
      }, 1500)
      return
    }

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey) {
      const apiMsgs = updated.map((m) => ({ role: m.role, content: m.content }))
      const reply = await sendMessage(apiMsgs)
      if (reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        setIsTyping(false)
        return
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: DEMO_RESPONSES[newQ] }])
      setIsTyping(false)
    }, 1000)
  }

  const progress = Math.min((questionNum / 4) * 100, 100)

  return (
    <div className="min-h-screen bg-cream text-dark-text flex flex-col">
      {/* Top bar */}
      <div className="bg-cream/80 backdrop-blur-lg border-b border-dark-text/5 sticky top-0 z-40 px-6 md:px-10 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose/20 to-amber/20 flex items-center justify-center">
                <span className="text-sm">&#10024;</span>
              </div>
              <div>
                <h1 className="font-display text-base font-bold">Crushky AI</h1>
                <p className="text-[10px] text-muted">Getting to know you</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted text-xs font-medium">{questionNum}/4</span>
              <div className="w-20 h-1.5 bg-dark-text/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose to-amber rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className="anim-in">
              <ChatBubble message={msg.content} isUser={msg.role === 'user'} />
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4 anim-in">
              <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
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
      </div>

      {/* Input */}
      <div className="bg-cream/80 backdrop-blur-lg border-t border-dark-text/5 px-6 md:px-10 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="w-10 h-10 rounded-full border border-dark-text/10 flex items-center justify-center text-dark-text/30 shrink-0 cursor-pointer hover:bg-white hover:shadow-sm transition-all">
            &#127908;
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
            disabled={questionNum >= 4}
            className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-dark-text text-sm outline-none focus:border-dark-green/40 focus:shadow-sm transition-all placeholder:text-dark-text/25"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || questionNum >= 4}
            className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-all hover:shadow-md"
          >
            &#10148;
          </button>
        </div>
      </div>
    </div>
  )
}
