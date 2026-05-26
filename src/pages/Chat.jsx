import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'

const DEMO_CONVERSATION = [
  { role: 'assistant', content: "Hey Aditya! Welcome yaar, let's find your person. ✨\n\nStraight up — what does your ideal weekend look like?" },
  { role: 'user', content: "honestly? late uthna, filter coffee leke kisi tucked-away cafe mein baith jaana. bookstore ya bas aise hi ghoomna with no plan. friends ke saath late-night jam session if I'm feeling it. loud jagah bilkul nahi" },
  { role: 'assistant', content: "You're a slow-morning, no-agenda kind of person — love that energy. Peace chahiye but not loneliness. Accha tell me, relationship mein actually kya dhundh rahe ho? Honestly bolo." },
  { role: 'user', content: "someone who doesn't need me to perform yaar. like we can sit in silence and it's still comfortable. but also someone who challenges me intellectually — 2am pe random deep conversations wali. small talk se door hi rehna hai" },
  { role: 'assistant', content: "Depth over everything. You want someone who sees through the surface. That's actually rare. Ok so what kind of person makes you feel alive? Kaunsi energy attract karti hai?" },
  { role: 'user', content: "calm confidence. someone who knows who they are, validation ki zaroorat nahi. creative log who build things — chahe art ho, code ho ya business. and honestly? agar wo mujhe roast karke hasa de, then I'm done. bas." },
  { role: 'assistant', content: "Sharp humor, quiet intensity, creative fire. I'm getting a really clear picture of you Aditya. Last one — ek cheez batao jo tum partner mein kabhi compromise nahi karoge?" },
  { role: 'user', content: "honesty. games and manipulation nahi chalega. kuch galat hai toh seedha bol do. I'd rather hear something hard than be lied to. ye non-negotiable hai mere liye" },
  { role: 'assistant', content: "Radical honesty — ye bahut kuch bata deta hai about your character. I think I've got a really clear picture of who you are, and more importantly, who you need.\n\nEk second, tumhare log dhundh rahi hoon... 🌟" },
]

export default function Chat() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [autoPlaying, setAutoPlaying] = useState(true)
  const [autoIndex, setAutoIndex] = useState(0)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-play the demo conversation
  useEffect(() => {
    if (!autoPlaying || autoIndex >= DEMO_CONVERSATION.length) return

    const msg = DEMO_CONVERSATION[autoIndex]
    const isAssistant = msg.role === 'assistant'
    const delay = autoIndex === 0 ? 600 : isAssistant ? 1200 : 800

    // Show typing indicator before assistant messages
    if (isAssistant && autoIndex > 0) {
      setIsTyping(true)
      const typingTimer = setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, msg])
        setAutoIndex(i => i + 1)
      }, delay)
      return () => clearTimeout(typingTimer)
    }

    const timer = setTimeout(() => {
      setMessages(prev => [...prev, msg])
      setAutoIndex(i => i + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [autoPlaying, autoIndex])

  // When all messages are shown, navigate after a pause
  useEffect(() => {
    if (autoIndex >= DEMO_CONVERSATION.length && autoPlaying) {
      const timer = setTimeout(() => {
        localStorage.setItem('crushky_chat_done', 'true')
        navigate('/dashboard')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [autoIndex, autoPlaying])

  const progress = Math.min((Math.floor(messages.filter(m => m.role === 'user').length) / 4) * 100, 100)
  const questionNum = messages.filter(m => m.role === 'user').length

  // Skip button to jump ahead
  const handleSkip = () => {
    setAutoPlaying(false)
    setIsTyping(false)
    setMessages(DEMO_CONVERSATION)
    setTimeout(() => {
      localStorage.setItem('crushky_chat_done', 'true')
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-cream text-dark-text flex flex-col grain">
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
              {autoPlaying && autoIndex < DEMO_CONVERSATION.length && (
                <button
                  onClick={handleSkip}
                  className="text-muted hover:text-dark-text text-xs font-medium cursor-pointer transition-colors px-3 py-1.5 rounded-full border border-dark-text/10 hover:border-dark-text/20"
                >
                  Skip demo &rarr;
                </button>
              )}
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

      {/* Demo banner */}
      {autoPlaying && (
        <div className="bg-amber-light/40 border-b border-amber/20 px-6 py-2.5">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
            <span className="text-amber text-xs">&#9679;</span>
            <p className="text-dark-text/60 text-xs font-medium">MVP Demo &mdash; Auto-playing a sample conversation</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className="ai">
              <ChatBubble message={msg.content} isUser={msg.role === 'user'} />
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4 ai">
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

      {/* Input (disabled during auto-play) */}
      <div className="bg-cream/80 backdrop-blur-lg border-t border-dark-text/5 px-6 md:px-10 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="w-10 h-10 rounded-full border border-dark-text/10 flex items-center justify-center text-dark-text/30 shrink-0 cursor-pointer hover:bg-white hover:shadow-sm transition-all">
            &#127908;
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={autoPlaying ? "Demo in progress..." : "Type your answer..."}
            disabled={autoPlaying}
            className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-dark-text text-sm outline-none focus:border-dark-green/40 focus:shadow-sm transition-all placeholder:text-dark-text/25 disabled:opacity-50"
          />
          <button
            disabled={autoPlaying}
            className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-dark-green/90 transition-all hover:shadow-md"
          >
            &#10148;
          </button>
        </div>
      </div>
    </div>
  )
}
