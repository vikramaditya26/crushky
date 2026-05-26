import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import CompanionChat from '../components/CompanionChat'
import { seedMatches } from '../data/seedMatches'

const DEMO_CONVERSATION = [
  { role: 'assistant', content: "Hey! I'm Crushky, your AI matchmaker. Let's find your person.\n\nWhat does your ideal weekend look like?" },
  { role: 'user', content: "Wake up late, grab coffee from some hidden cafe, maybe a bookstore. Late-night jam session with friends if I'm in the mood. Nothing loud or forced." },
  { role: 'assistant', content: "Slow mornings, no agenda, peace without loneliness. I love that. What are you actually looking for in a relationship?" },
  { role: 'user', content: "Someone who doesn't need me to perform. We can sit in silence and it's still comfortable. But also someone who challenges me — I want those 2am deep conversations." },
  { role: 'assistant', content: "Depth over everything. That's rare. What kind of person makes you feel most alive?" },
  { role: 'user', content: "Calm confidence. Someone who knows who they are. Creative people who build things. And honestly, if she can roast me and make me laugh — I'm done." },
  { role: 'assistant', content: "Sharp humor, quiet intensity, creative fire. Last question — what's one thing you'd never compromise on?" },
  { role: 'user', content: "Honesty. No games, no manipulation. I'd rather hear something hard than be lied to. That's non-negotiable." },
  { role: 'assistant', content: "That tells me everything I need to know about you. I've found your people. Check your matches." },
]

// Which match to reveal after which user message (0-indexed user msg count)
const MATCH_REVEALS = [1, 2, 3]

function MatchRevealCard({ match, onShortlist, onSkip, isNew }) {
  return (
    <div className={`bg-white rounded-2xl border border-dark-text/5 overflow-hidden shadow-lg ${isNew ? 'as' : ''}`}>
      <div className="flex gap-4 p-4">
        <img src={match.photo} alt={match.name} className="w-20 h-24 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-base font-bold">{match.name}, {match.age}</h3>
              <p className="text-muted text-xs mt-0.5">{match.city} &middot; {match.work}</p>
            </div>
            <span className="text-rose font-bold text-sm">{match.compatibility}%</span>
          </div>
          <p className="text-dark-text/60 text-xs mt-2 line-clamp-2">{match.whyYouMatch}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onShortlist(match.id)} className="flex-1 py-2 rounded-full bg-dark-green text-white text-xs font-semibold cursor-pointer hover:bg-dark-green/90 transition-all">
              Shortlist ♡
            </button>
            <button onClick={() => onSkip(match.id)} className="py-2 px-4 rounded-full border border-dark-text/10 text-muted text-xs font-medium cursor-pointer hover:bg-cream transition-all">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('talk')
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')

  // Chat state
  const [messages, setMessages] = useState([])
  const [autoIndex, setAutoIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const endRef = useRef(null)

  // Match state
  const [revealedMatches, setRevealedMatches] = useState([])
  const [shortlisted, setShortlisted] = useState([])
  const [skipped, setSkipped] = useState([])
  const [newReveal, setNewReveal] = useState(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, revealedMatches])

  // Auto-play conversation
  useEffect(() => {
    if (autoIndex >= DEMO_CONVERSATION.length) return

    const msg = DEMO_CONVERSATION[autoIndex]
    const isAssistant = msg.role === 'assistant'
    const delay = autoIndex === 0 ? 800 : isAssistant ? 1400 : 900

    if (isAssistant && autoIndex > 0) {
      setIsTyping(true)
      const t = setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, msg])
        setAutoIndex(i => i + 1)
      }, delay)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setMessages(prev => [...prev, msg])
      if (msg.role === 'user') {
        const newCount = userMsgCount + 1
        setUserMsgCount(newCount)
        // Check if we should reveal a match
        const matchIdx = MATCH_REVEALS.indexOf(newCount)
        if (matchIdx !== -1 && seedMatches[matchIdx]) {
          setTimeout(() => {
            setRevealedMatches(prev => [...prev, seedMatches[matchIdx]])
            setNewReveal(seedMatches[matchIdx].id)
            setTimeout(() => setNewReveal(null), 2000)
          }, 600)
        }
      }
      setAutoIndex(i => i + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [autoIndex])

  const handleShortlist = (id) => {
    setShortlisted(prev => [...prev, id])
    localStorage.setItem('crushky_chat_done', 'true')
  }

  const handleSkip = (id) => {
    setSkipped(prev => [...prev, id])
  }

  const activeMatches = revealedMatches.filter(m => !skipped.includes(m.id))
  const shortlistedMatches = seedMatches.filter(m => shortlisted.includes(m.id))
  const pendingMatches = activeMatches.filter(m => !shortlisted.includes(m.id))

  const tabs = [
    { id: 'talk', label: 'Talk', icon: '✦' },
    { id: 'matches', label: `Matches${shortlisted.length ? ` (${shortlisted.length})` : ''}`, icon: '♡' },
    { id: 'companion', label: 'Companion', icon: '◈' },
  ]

  return (
    <div className="min-h-screen bg-cream text-dark-text grain">
      {/* Top Bar */}
      <div className="bg-cream/70 backdrop-blur-xl border-b border-dark-text/5 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 md:px-10 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold">Crushky</span>
              <span className="bg-rose/10 text-rose text-[9px] font-semibold px-2 py-0.5 rounded-full border border-rose/20">MVP</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber overflow-hidden flex items-center justify-center text-sm font-semibold text-white">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
          <div className="flex gap-1 bg-dark-text/5 rounded-full p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === t.id ? 'bg-dark-green text-white shadow-sm' : 'text-muted hover:text-dark-text/60'
                }`}
              >
                <span className="text-xs">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TALK TAB ─── */}
      {tab === 'talk' && (
        <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Demo banner */}
          <div className="bg-amber-light/40 border-b border-amber/20 px-5 py-2">
            <p className="text-dark-text/50 text-[11px] font-medium text-center">
              MVP Demo &mdash; Auto-playing a sample conversation. Matches appear as you talk.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-5">
            <div className="max-w-2xl mx-auto space-y-1">
              {messages.map((msg, i) => (
                <div key={i} className="ai">
                  <ChatBubble message={msg.content} isUser={msg.role === 'user'} />
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-3 ai">
                  <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Match reveal cards inline */}
              {pendingMatches.map((match) => (
                <div key={match.id} className="py-3">
                  <p className="text-rose text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-rose rounded-full animate-pulse" /> New match found
                  </p>
                  <MatchRevealCard
                    match={match}
                    onShortlist={handleShortlist}
                    onSkip={handleSkip}
                    isNew={newReveal === match.id}
                  />
                </div>
              ))}

              <div ref={endRef} />
            </div>
          </div>

          {/* Input (disabled during demo) */}
          <div className="bg-cream/80 backdrop-blur-lg border-t border-dark-text/5 px-5 md:px-10 py-3">
            <div className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                placeholder="Demo in progress..."
                disabled
                className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-sm outline-none placeholder:text-dark-text/25 disabled:opacity-50"
              />
              <button disabled className="w-10 h-10 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 disabled:opacity-30 text-sm">
                &#10148;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MATCHES TAB ─── */}
      {tab === 'matches' && (
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-6">
          {shortlistedMatches.length === 0 && revealedMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center au">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-light/50 to-amber-light/50 apg mb-6" />
              <h2 className="font-display text-2xl font-bold mb-2">No matches yet</h2>
              <p className="text-muted text-sm max-w-xs mb-6">Keep talking to Crushky AI to discover your matches. The more you share, the better your matches.</p>
              <button onClick={() => setTab('talk')} className="bg-dark-green text-white font-semibold px-6 py-3 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all text-sm">
                Back to conversation
              </button>
            </div>
          ) : (
            <div className="au">
              {shortlistedMatches.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold mb-1">Your shortlist</h2>
                  <p className="text-muted text-sm mb-5">People you're interested in</p>
                  <div className="space-y-4">
                    {shortlistedMatches.map((match, i) => (
                      <div key={match.id} className="as" style={{ animationDelay: `${i * 100}ms` }}>
                        <div
                          onClick={() => navigate(`/match/${match.id}`)}
                          className="bg-white rounded-2xl border border-dark-text/5 overflow-hidden cursor-pointer hover-lift"
                        >
                          <div className="flex gap-4 p-4">
                            <img src={match.photo} alt={match.name} className="w-24 h-28 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-display text-lg font-bold">{match.name}, {match.age}</h3>
                                  <p className="text-muted text-xs mt-0.5">{match.city} &middot; {match.work}</p>
                                </div>
                                <span className="bg-rose/10 text-rose font-bold text-xs px-2.5 py-1 rounded-full">{match.compatibility}%</span>
                              </div>
                              <p className="text-dark-text/60 text-xs mt-2 line-clamp-2">{match.whyYouMatch}</p>
                              <div className="flex gap-1.5 mt-2">
                                {match.interests.slice(0, 3).map((int) => (
                                  <span key={int} className="bg-cream text-dark-text/50 text-[10px] px-2 py-0.5 rounded-full">{int}</span>
                                ))}
                              </div>
                              <p className="text-dark-green text-xs font-semibold mt-3">Chat &amp; view profile &rarr;</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending matches not yet shortlisted */}
              {pendingMatches.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold mb-1">Pending</h2>
                  <p className="text-muted text-sm mb-4">Decide on these matches</p>
                  <div className="space-y-3">
                    {pendingMatches.map((match) => (
                      <MatchRevealCard key={match.id} match={match} onShortlist={handleShortlist} onSkip={handleSkip} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── COMPANION TAB ─── */}
      {tab === 'companion' && (
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <CompanionChat />
        </div>
      )}
    </div>
  )
}
