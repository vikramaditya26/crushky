import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import CompanionChat from '../components/CompanionChat'
import { seedMatches } from '../data/seedMatches'

const DEMO_CONVERSATION = [
  // Opening
  { role: 'assistant', content: "Hey! I'm Crushky, your AI matchmaker. I'm going to ask you a few real questions — not the surface-level stuff. Ready to find your person?" },
  { role: 'user', content: "Let's do it." },

  // Round 1: Lifestyle
  { role: 'assistant', content: "Cool. First up — what does your ideal weekend look like? And be honest, not the Instagram version." },
  { role: 'user', content: "Wake up late, grab coffee from some hidden cafe, maybe a bookstore. Late-night jam session with friends if I'm in the mood. Nothing loud or forced." },
  { role: 'assistant', content: "Slow mornings, no agenda, peace without loneliness. I already know a lot about you from just that. What kind of music are you into?" },
  { role: 'user', content: "Prateek Kuhad, The Local Train, some Coldplay when I'm feeling emotional. Basically anything acoustic or indie." },

  // Round 2: Values
  { role: 'assistant', content: "Good taste. Now let's go deeper — what are you actually looking for in a relationship? Not the dating app bio version." },
  { role: 'user', content: "Someone who doesn't need me to perform. We can sit in silence and it's still comfortable. But also someone who challenges me — I want those 2am deep conversations." },
  { role: 'assistant', content: "Depth over everything. That's rare and honestly refreshing. Most people say 'someone funny' and leave it at that. You want real connection." },

  // >>> MATCH 1 REVEALS HERE (after msg index 8, which is user msg #4)

  // Round 3: Personality
  { role: 'assistant', content: "Okay getting warmer. What kind of person makes you feel most alive? Think about the best conversations you've had." },
  { role: 'user', content: "Calm confidence. Someone who knows who they are. Creative people who build things. And honestly, if she can roast me and make me laugh — I'm done." },
  { role: 'assistant', content: "Sharp humor, quiet intensity, creative fire. You're not looking for someone to complete you — you want someone who matches your energy. I respect that." },

  // Round 4: Dealbreakers
  { role: 'assistant', content: "One more thing — what's the one thing you'd never compromise on? The absolute dealbreaker." },
  { role: 'user', content: "Honesty. No games, no manipulation. I'd rather hear something hard than be lied to. That's non-negotiable." },
  { role: 'assistant', content: "Honesty as a core value. That filters out a lot of people — and that's a good thing. You know exactly what you want." },

  // >>> MATCH 2 REVEALS HERE (after msg index 14, which is user msg #6)

  // Round 5: Fun/quirky
  { role: 'assistant', content: "Okay, rapid fire. Controversial food opinion — go." },
  { role: 'user', content: "Maggi is better than any pasta. I will die on this hill." },
  { role: 'assistant', content: "Bold. Correct, but bold. Last one — if you could have dinner with anyone, dead or alive, who?" },
  { role: 'user', content: "Steve Jobs. I want to know what it felt like to believe you could change the world and then actually do it." },

  // >>> MATCH 3 REVEALS HERE (after msg index 19, which is user msg #8)

  { role: 'assistant', content: "That tells me everything. You value vision, authenticity, and quiet ambition. I've analyzed your personality across 12 dimensions and found your top matches. Check them out — I think you'll be surprised how well these click." },
]

// Match reveals tied to conversation message index (0-based)
// Match 1 after 9 messages, Match 2 after 15, Match 3 after 20
const MATCH_REVEAL_AT_INDEX = [
  { matchIdx: 0, afterMsgIndex: 8 },
  { matchIdx: 1, afterMsgIndex: 14 },
  { matchIdx: 2, afterMsgIndex: 19 },
]

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

// ─── Voice Entry Screen ───
function VoiceEntry({ onStart }) {
  const [listening, setListening] = useState(false)

  const handleTap = () => {
    setListening(true)
    setTimeout(() => onStart(), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,75,75,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative flex flex-col items-center au">
        {/* Mic button with rings */}
        <div className="relative flex items-center justify-center mb-10">
          {listening && (
            <>
              <div className="voice-ring-outer absolute w-24 h-24 rounded-full border border-rose/30" />
              <div className="voice-ring-mid absolute w-24 h-24 rounded-full border border-rose/20" />
            </>
          )}
          <button
            onClick={handleTap}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all z-10 ${
              listening ? 'mic-breath' : 'hover:scale-105'
            }`}
            style={{
              background: listening
                ? 'linear-gradient(135deg, #C94B4B, #D4956A)'
                : 'rgba(201,75,75,0.12)',
              border: '1.5px solid rgba(201,75,75,0.3)',
            }}
          >
            {listening ? (
              <div className="flex items-end gap-0.5 h-8 px-2">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="wave-bar bg-cream"
                    style={{ height: '24px', animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(201,75,75,0.9)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        </div>

        {listening ? (
          <div className="text-center">
            <p className="font-display text-2xl italic text-dark-text/80 mb-2">Listening…</p>
            <p className="text-muted text-sm">Getting to know you</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-display text-3xl italic text-dark-text mb-3">
              Talk to <span className="text-rose">Crushky</span>
            </h2>
            <p className="text-muted text-sm max-w-xs leading-relaxed mb-8">
              Just speak. I'll ask you real questions and find people who actually match you.
            </p>
            <button
              onClick={handleTap}
              className="bg-dark-text text-cream px-8 py-3.5 rounded-full text-sm font-semibold cursor-pointer hover:bg-dark-text/90 transition-all hover:shadow-lg"
            >
              Tap to talk ✦
            </button>
            <p className="text-muted/60 text-xs mt-4 cursor-pointer hover:text-muted transition-colors" onClick={onStart}>
              or skip to chat instead →
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('talk')
  const [talkStarted, setTalkStarted] = useState(false)
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')

  // Chat state
  const [messages, setMessages] = useState([])
  const [autoIndex, setAutoIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  // Match state
  const [revealedMatches, setRevealedMatches] = useState([])
  const [shortlisted, setShortlisted] = useState([])
  const [skipped, setSkipped] = useState([])
  const [newReveal, setNewReveal] = useState(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, revealedMatches])

  // Auto-play conversation — only starts after voice entry
  useEffect(() => {
    if (!talkStarted) return
    if (autoIndex >= DEMO_CONVERSATION.length) return

    const msg = DEMO_CONVERSATION[autoIndex]
    const isAssistant = msg.role === 'assistant'
    // Slower pacing for a more natural feel
    const delay = autoIndex === 0 ? 1000 : isAssistant ? 1800 : 1100

    if (isAssistant && autoIndex > 0) {
      setIsTyping(true)
      const t = setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, msg])
        // Check for match reveal after this message
        checkMatchReveal(autoIndex)
        setAutoIndex(i => i + 1)
      }, delay)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setMessages(prev => [...prev, msg])
      checkMatchReveal(autoIndex)
      setAutoIndex(i => i + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [autoIndex, talkStarted])

  const checkMatchReveal = (msgIndex) => {
    const reveal = MATCH_REVEAL_AT_INDEX.find(r => r.afterMsgIndex === msgIndex)
    if (reveal && seedMatches[reveal.matchIdx]) {
      setTimeout(() => {
        setRevealedMatches(prev => [...prev, seedMatches[reveal.matchIdx]])
        setNewReveal(seedMatches[reveal.matchIdx].id)
        setTimeout(() => setNewReveal(null), 2500)
      }, 800)
    }
  }

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
    { id: 'companion', label: 'Virtual Friend', icon: '◈' },
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
      {tab === 'talk' && !talkStarted && (
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <VoiceEntry onStart={() => setTalkStarted(true)} />
        </div>
      )}

      {tab === 'talk' && talkStarted && (
        <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Demo banner */}
          <div className="bg-amber-light/40 border-b border-amber/20 px-5 py-2">
            <p className="text-dark-text/50 text-[11px] font-medium text-center">
              🎙 Voice session in progress — Crushky is listening and learning about you
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-5">
            <div className="max-w-2xl mx-auto space-y-1">
              {messages.map((msg, i) => {
                // Check if a match card should appear after this message
                const revealHere = MATCH_REVEAL_AT_INDEX.find(r => r.afterMsgIndex === i)
                const matchForReveal = revealHere ? revealedMatches.find(m => m.id === seedMatches[revealHere.matchIdx]?.id) : null

                return (
                  <div key={i}>
                    <div className="ai">
                      <ChatBubble
                        message={msg.content}
                        isUser={msg.role === 'user'}
                        voiceMode={true}
                      />
                    </div>
                    {/* Match reveal card inline after specific messages */}
                    {matchForReveal && !skipped.includes(matchForReveal.id) && (
                      <div className="py-3">
                        <p className="text-rose text-xs font-semibold mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-rose rounded-full animate-pulse" /> New match found
                        </p>
                        <MatchRevealCard
                          match={matchForReveal}
                          onShortlist={handleShortlist}
                          onSkip={handleSkip}
                          isNew={newReveal === matchForReveal.id}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

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
