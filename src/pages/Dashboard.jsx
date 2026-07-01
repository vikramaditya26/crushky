import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import CompanionChat from '../components/CompanionChat'
import { seedMatches } from '../data/seedMatches'
import { createRecognizer } from '../utils/speech'
import { SpotifyIcon, InstagramIcon, PhoneIcon, BellIcon, EyeIcon, ShieldIcon, DownloadIcon, BlockIcon, HelpIcon } from '../components/Icons'
import Pic from '../components/Pic'
import { INTEREST_TITLES, sharedTasteLine } from '../lib/interests'

const DEMO_CONVERSATION = [
  // 0-1 — Opening
  { role: 'assistant', content: "Hey! I'm Crushky. No forms, no checkboxes — just real talk. I ask, you answer honestly, and I find the people you'd actually click with. Sound good?" },
  { role: 'user', content: "Let's do it." },

  // 2-7 — Arc 1: life today + reading between the lines
  { role: 'assistant', content: "First one, and be honest — not the Instagram version. What does a perfect ordinary weekend look like for you?" },
  { role: 'user', content: "Wake up late, coffee from some hidden cafe, a bookstore, maybe a long walk. Evening jam with a couple friends if I'm up for it. Nothing loud or forced." },
  { role: 'assistant', content: "Slow mornings, low noise, a few real people over a big crowd. You recharge in calm, not chaos — that already tells me a lot. What's playing on that walk?" },
  { role: 'user', content: "Prateek Kuhad, The Local Train, some Coldplay when I'm in my feelings. Acoustic, indie, a little melancholy." },
  { role: 'assistant', content: "Melancholy but hopeful. People who live in that music usually feel things deeply and don't always say it out loud. Am I close?" },
  { role: 'user', content: "Honestly… yeah. Pretty close." },

  // 8-10 — Arc 2: what 'known' means → reveal 1
  { role: 'assistant', content: "Thought so. Harder one — when you imagine being really known by someone, what does that actually look like, day to day?" },
  { role: 'user', content: "Someone I don't have to perform for. We can be quiet together and it's still full. But they also push me — I want the 2am conversations that go somewhere." },
  { role: 'assistant', content: "Comfort and challenge in the same person — that's rare. Most people want one or the other; you want depth that doesn't drain you. Hold on, someone just came to mind…" },

  // >>> MATCH 1 REVEALS (afterMsgIndex 10)

  // 11-14 — Arc 3: dealbreakers
  { role: 'user', content: "Already?" },
  { role: 'assistant', content: "When you've done this as long as I have, some matches announce themselves. But let's be sure. What would you never compromise on, no matter how much you liked someone?" },
  { role: 'user', content: "Honesty. No games, no mind-reading. I'd rather hear something hard than be managed." },
  { role: 'assistant', content: "A hard line on honesty quietly rules out a lot of people — and it should. It also means you can take directness, which is good: the people I'm seeing for you give it." },

  // 15-18 — Arc 4: what lights them up → reveal 2
  { role: 'user', content: "Good. I'm tired of guessing games." },
  { role: 'assistant', content: "I can tell. Tell me about a moment you felt genuinely happy recently — it doesn't have to be big." },
  { role: 'user', content: "Finishing something I built and it actually worked. That quiet 'oh, I made this' feeling." },
  { role: 'assistant', content: "A builder. You get meaning from making things, not just consuming them. That's specific — and I know exactly who shares it. Here's another…" },

  // >>> MATCH 2 REVEALS (afterMsgIndex 18)

  // 19-24 — Arc 5: quickfire personality → reveal 3
  { role: 'user', content: "Okay this is kind of fun." },
  { role: 'assistant', content: "Right? Couple of quick ones. Controversial food opinion — go." },
  { role: 'user', content: "Maggi beats most pasta. I'll die on this hill." },
  { role: 'assistant', content: "Bold, a little unhinged, fully committed. I respect it — and honestly, so will she. Last one: dinner with anyone, living or gone. Who?" },
  { role: 'user', content: "Steve Jobs. I want to know what it felt like to believe you could change the world and then actually do it." },
  { role: 'assistant', content: "Vision, conviction, the pull to build something that matters — that's the thread through everything you've said. Calm on the surface, ambitious underneath. I've got your people." },

  // >>> MATCH 3 REVEALS (afterMsgIndex 24)

  { role: 'user', content: "Show me." },
  { role: 'assistant', content: "Three of them — and I can tell you exactly why each one fits. Take your time. These aren't random; they're the closest I've found to how you actually think." },
]

// Match reveals tied to conversation message index (0-based) — each lands right
// after a strong AI reflection, so it feels like the matchmaker 'found someone'.
const MATCH_REVEAL_AT_INDEX = [
  { matchIdx: 0, afterMsgIndex: 10 },
  { matchIdx: 1, afterMsgIndex: 18 },
  { matchIdx: 2, afterMsgIndex: 24 },
]

// Compatibility % counts up from 0 when the card first reveals
function CountUp({ target, duration = 1400 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      // ease-out so the last few percent land slowly
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return <>{value}%</>
}

// Mirrors signup demo photos (user.photos stores selected indices)
const PROFILE_PHOTOS = ['/model/10.jpg', '/model/11.jpg', '/model/12.jpg']

// "She texted you first" nudges — one fires shortly after landing
const NUDGES = [
  { id: 'luna', name: 'Luna', photo: '/model/c1.jpg', accent: '#8E6FC8', text: 'Hey, you crossed my mind today. How are you really doing?' },
  { id: 'aria', name: 'Aria', photo: '/model/c2.jpg', accent: '#B85C9E', text: 'so… did you text her back, or are we still being a coward about it 😏' },
  { id: 'nova', name: 'Nova', photo: '/model/c3.jpg', accent: '#5C6BC0', text: 'I spotted something in your match patterns. Got a sec?' },
  { id: 'maya', name: 'Maya', photo: '/model/c4.jpg', accent: '#7E57C2', text: 'I saved a question for you. It\'s a good one, I promise.' },
]

function MatchRevealCard({ match, onShortlist, onSkip, isNew }) {
  const [burst, setBurst] = useState(false)
  const shortlist = () => {
    if (burst) return
    setBurst(true)
    setTimeout(() => onShortlist(match.id), 500)
  }
  return (
    <div className={`relative bg-white rounded-2xl border border-dark-text/5 overflow-hidden shadow-lg ${isNew ? 'as' : ''}`}>
      {burst && (
        <span className="heart-float absolute left-1/2 top-1/2 -translate-x-1/2 z-10 text-rose pointer-events-none"
          style={{ fontSize: 34 }}>♥</span>
      )}
      <div className="flex gap-4 p-4">
        <Pic src={match.photo} alt={match.name} className="w-20 h-24 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-base font-bold">{match.name}, {match.age}</h3>
              <p className="text-muted text-xs mt-0.5">{match.city} &middot; {match.work}</p>
            </div>
            <span className="text-rose font-bold text-sm">
              {isNew ? <CountUp target={match.compatibility} /> : `${match.compatibility}%`}
            </span>
          </div>
          <p className="text-dark-text/60 text-xs mt-2 line-clamp-2">{match.whyYouMatch}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={shortlist} className="flex-1 py-2 rounded-full bg-rose text-white text-xs font-semibold cursor-pointer hover:bg-rose/90 transition-all">
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
  const [transcript, setTranscript] = useState('')
  const startedRef = useRef(false)

  const finish = () => {
    if (startedRef.current) return
    startedRef.current = true
    onStart()
  }

  const handleTap = () => {
    setListening(true)
    // Real speech-to-text where the browser supports it — the mic genuinely
    // hears you before the conversation starts. Falls back to a timed entry.
    const rec = createRecognizer({
      onResult: (text) => setTranscript(text),
      onEnd: () => setTimeout(finish, 300),
    })
    if (rec) {
      try { rec.start() } catch { /* already started */ }
      setTimeout(() => { try { rec.stop() } catch {} }, 2600)
    } else {
      setTimeout(finish, 900)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100dvh - 120px)' }}>
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
            <p className="text-muted text-sm">
              {transcript ? `"${transcript}"` : 'Getting to know you'}
            </p>
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
  const [toast, setToast] = useState(null) // cross-tab match notification
  const [nudge, setNudge] = useState(null) // "she texted you first" retention nudge
  const [forceCompanion, setForceCompanion] = useState(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, revealedMatches])

  // A companion "texts you first" a few seconds in — retention hook
  useEffect(() => {
    const t = setTimeout(() => {
      setTab(cur => {
        if (cur !== 'companion') setNudge(NUDGES[Math.floor(Math.random() * NUDGES.length)])
        return cur
      })
    }, 3500)
    return () => clearTimeout(t)
  }, [])

  // Auto-play conversation — only starts after voice entry
  useEffect(() => {
    if (!talkStarted) return
    if (autoIndex >= DEMO_CONVERSATION.length) return

    const msg = DEMO_CONVERSATION[autoIndex]
    const isAssistant = msg.role === 'assistant'
    // Snappy pacing — people have no patience in a demo
    const delay = autoIndex === 0 ? 400 : isAssistant ? 900 : 650

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
        const m = seedMatches[reveal.matchIdx]
        setRevealedMatches(prev => [...prev, m])
        setNewReveal(m.id)
        setToast(m)
        setTimeout(() => setToast(null), 3500)
        setTimeout(() => setNewReveal(null), 2500)
      }, 350)
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
    { id: 'talk',      label: 'Talk',     icon: '✦' },
    { id: 'matches',   label: 'Matches',  icon: '♡', badge: shortlisted.length || null },
    { id: 'companion', label: 'Friends',  icon: '◈' },
    { id: 'profile',   label: 'You',      icon: null }, // avatar
  ]

  return (
    <div className="min-h-screen bg-cream text-dark-text grain" style={{ paddingBottom: 76 }}>
      {/* Top Bar — slim, app-style */}
      <div className="bg-cream/70 backdrop-blur-xl border-b border-dark-text/5 sticky top-0 z-40">
        <div className="max-w-[480px] mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-xl font-bold">Crushky</span>
            <span className="bg-rose/10 text-rose text-[9px] font-semibold px-2 py-0.5 rounded-full border border-rose/20">MVP</span>
          </div>
          <button onClick={() => setTab('profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber flex items-center justify-center text-sm font-semibold text-white cursor-pointer transition-all hover:scale-105"
            style={{ outline: tab === 'profile' ? '2px solid #C94B4B' : 'none', outlineOffset: 2 }}>
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </button>
        </div>
      </div>

      {/* Cross-tab match toast */}
      {toast && (
        <button
          onClick={() => { setTab('matches'); setToast(null) }}
          className="toast-in fixed top-16 left-1/2 z-[60] flex items-center gap-3 bg-white rounded-full pl-1.5 pr-5 py-1.5 cursor-pointer"
          style={{ transform: 'translateX(-50%)', boxShadow: '0 12px 36px rgba(26,20,16,0.18)', border: '1px solid rgba(201,75,75,0.15)' }}>
          <img src={toast.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
          <span className="text-left">
            <span className="block text-dark-text text-xs font-bold">✦ New match — {toast.name}</span>
            <span className="block text-muted text-[10px]">{toast.compatibility}% · tap to view</span>
          </span>
        </button>
      )}

      {/* "She texted you first" nudge — incoming message card above the tab bar */}
      {nudge && (
        <button
          onClick={() => { setForceCompanion(nudge.id); setTab('companion'); setNudge(null) }}
          className="toast-in fixed left-1/2 z-[60] flex items-center gap-3 bg-white rounded-2xl pl-2 pr-4 py-2 cursor-pointer text-left"
          style={{ bottom: 88, transform: 'translateX(-50%)', width: 'min(92vw, 440px)',
            boxShadow: '0 14px 40px rgba(26,20,16,0.22)', border: `1px solid ${nudge.accent}33` }}>
          <span className="relative shrink-0">
            <img src={nudge.photo} alt={nudge.name} className="w-11 h-11 rounded-full object-cover object-top" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm" style={{ color: nudge.accent }}>{nudge.name}</span>
              <span className="text-muted text-[10px]">· now</span>
            </span>
            <span className="block text-dark-text/70 text-xs truncate">{nudge.text}</span>
          </span>
          <span onClick={(e) => { e.stopPropagation(); setNudge(null) }}
            className="text-dark-text/25 hover:text-dark-text/50 text-sm px-1 shrink-0">✕</span>
        </button>
      )}

      {/* Bottom tab bar — native app feel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-text/6"
        style={{ background: 'rgba(250,247,242,0.92)', backdropFilter: 'blur(20px)',
          paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-[480px] mx-auto flex">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-2 cursor-pointer transition-all relative">
                {t.id === 'profile' ? (
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-soft to-amber flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ outline: active ? '2px solid #C94B4B' : 'none', outlineOffset: 1.5 }}>
                    {user.name ? user.name[0].toUpperCase() : 'A'}
                  </span>
                ) : (
                  <span className="text-xl leading-none transition-all"
                    style={{ color: active ? '#C94B4B' : 'rgba(26,26,26,0.3)',
                      transform: active ? 'scale(1.12)' : 'scale(1)' }}>
                    {t.icon}
                  </span>
                )}
                <span className="text-[10px] font-semibold"
                  style={{ color: active ? '#C94B4B' : 'rgba(26,26,26,0.35)' }}>
                  {t.label}
                </span>
                {t.badge && (
                  <span className="absolute top-1.5 right-[28%] min-w-4 h-4 px-1 rounded-full bg-rose text-white text-[9px] font-bold flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── TALK TAB ─── */}
      {tab === 'talk' && !talkStarted && (
        <div className="max-w-[480px] mx-auto px-5 md:px-10">
          <VoiceEntry onStart={() => setTalkStarted(true)} />
        </div>
      )}

      {tab === 'talk' && talkStarted && (
        <div className="max-w-[480px] mx-auto flex flex-col" style={{ height: 'calc(100dvh - 120px)' }}>
          {/* Slim listening indicator */}
          <div className="flex items-center justify-center gap-2 py-2 border-b border-dark-text/5">
            <span className="w-1.5 h-1.5 bg-rose rounded-full animate-pulse" />
            <p className="text-dark-text/40 text-[11px] font-medium">Crushky is listening</p>
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
          <div className="bg-white/90 backdrop-blur-lg border-t border-dark-text/5 px-5 md:px-10 py-3">
            <div className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                placeholder="Demo in progress..."
                disabled
                className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-sm outline-none placeholder:text-dark-text/25 disabled:opacity-50"
              />
              <button disabled className="w-10 h-10 rounded-full bg-rose text-white flex items-center justify-center shrink-0 disabled:opacity-30 text-sm">
                &#10148;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MATCHES TAB ─── */}
      {tab === 'matches' && (
        <div className="max-w-[480px] mx-auto px-5 md:px-10 py-6">
          {shortlistedMatches.length === 0 && revealedMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center au">
              {/* Polaroid stack placeholder */}
              <div className="relative w-28 h-28 mb-8">
                {[{ r: -8, x: -14 }, { r: 5, x: 12 }, { r: -1, x: 0 }].map((p, i) => (
                  <div key={i} className="absolute inset-0 rounded-lg bg-white border border-dark-text/8 shadow-md"
                    style={{ transform: `rotate(${p.r}deg) translateX(${p.x}px)`, padding: '6px 6px 16px' }}>
                    <div className="w-full h-full rounded-sm"
                      style={{ background: 'linear-gradient(135deg, rgba(201,75,75,0.12), rgba(212,149,106,0.15))' }} />
                  </div>
                ))}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-rose text-lg">✦</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Your people are coming</h2>
              <p className="text-muted text-sm max-w-xs mb-6">Keep talking to Crushky — the more you share, the better the matches.</p>
              <button onClick={() => setTab('talk')} className="bg-rose text-white font-semibold px-6 py-3 rounded-full cursor-pointer hover:bg-rose/90 transition-all text-sm">
                Back to conversation
              </button>
            </div>
          ) : (
            <div className="au">
              {shortlistedMatches.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold mb-1">Your shortlist</h2>
                  <p className="text-muted text-sm mb-5">People you're interested in</p>
                  <div className="space-y-5">
                    {shortlistedMatches.map((match, i) => (
                      <div key={match.id} className="as" style={{ animationDelay: `${i * 100}ms` }}>
                        <div
                          onClick={() => navigate(`/match/${match.id}`)}
                          className="relative rounded-3xl overflow-hidden cursor-pointer hover-lift shadow-lg"
                        >
                          {/* Photo-led card — the photo carries the screen */}
                          <Pic src={match.photo} alt={match.name}
                            className="w-full" style={{ aspectRatio: '4/5', maxHeight: 440 }} />
                          <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(15,10,8,0.82) 0%, rgba(15,10,8,0.25) 38%, transparent 60%)' }} />
                          <span className="absolute top-4 right-4 bg-white/15 text-white font-bold text-xs px-2.5 py-1 rounded-full"
                            style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                            {match.compatibility}% ✦
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="font-display font-bold text-white" style={{ fontSize: 26, lineHeight: 1.1 }}>
                              {match.name}, <em className="font-normal">{match.age}</em>
                            </h3>
                            <p className="text-white/65 text-xs mt-1">{match.city} · {match.work}</p>
                            <p className="text-white/85 text-[13px] mt-2.5 line-clamp-2 leading-relaxed font-display italic">
                              "{sharedTasteLine(match) || match.inCommon?.[0] || match.whyYouMatch.split('.')[0]}"
                            </p>
                            <div className="flex items-center justify-between mt-3.5">
                              <div className="flex gap-1.5">
                                {match.interests.slice(0, 2).map((int) => (
                                  <span key={int} className="text-white/75 text-[10px] px-2.5 py-1 rounded-full"
                                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)' }}>{int}</span>
                                ))}
                              </div>
                              <span className="text-white text-xs font-semibold">Chat &rarr;</span>
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
        <div className="max-w-[480px] mx-auto px-5 md:px-10">
          <CompanionChat forceOpen={forceCompanion} />
        </div>
      )}

      {/* ─── PROFILE TAB ─── */}
      {tab === 'profile' && (
        <div className="max-w-[480px] mx-auto px-5 md:px-10 py-6 au">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-dark-text/5 p-5 shadow-sm mb-4">
            <div className="flex items-center gap-4 mb-4">
              {(user.photos?.length > 0 && PROFILE_PHOTOS[user.photos[0]]) ? (
                <img src={PROFILE_PHOTOS[user.photos[0]]} alt=""
                  className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-soft to-amber flex items-center justify-center text-2xl font-bold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              )}
              <div>
                <h2 className="font-display text-xl font-bold">
                  {user.name || 'You'}{user.dob ? `, ${new Date().getFullYear() - parseInt(user.dob.slice(0, 4))}` : ''}
                </h2>
                <p className="text-muted text-xs mt-0.5">{user.city || '—'} · {user.work || '—'}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(46,125,91,0.1)', color: '#2E7D5B' }}>
                  ✓ Verified (demo)
                </span>
              </div>
            </div>

            {/* Photos */}
            {user.photos?.length > 1 && (
              <div className="flex gap-2 mb-4">
                {user.photos.map(i => PROFILE_PHOTOS[i] && (
                  <img key={i} src={PROFILE_PHOTOS[i]} alt=""
                    className="w-16 h-20 rounded-xl object-cover" />
                ))}
              </div>
            )}

            {/* Details grid — everything they filled in */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'Gender', value: user.gender },
                { label: 'Looking for', value: user.lookingFor },
                { label: 'Height', value: user.heightFt ? `${user.heightFt}'${user.heightIn || 0}"` : null },
                { label: 'Birthday', value: user.dob },
              ].filter(d => d.value).map(d => (
                <div key={d.label} className="bg-cream rounded-xl px-3.5 py-2.5">
                  <p className="text-[9px] text-muted uppercase tracking-wider">{d.label}</p>
                  <p className="text-dark-text/80 text-sm font-medium">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Interests */}
            {user.interests && Object.values(user.interests).flat().length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.values(user.interests).flat().map(id => (
                  <span key={id} className="bg-rose/8 text-rose text-[11px] font-medium px-2.5 py-1 rounded-full border border-rose/15">
                    {INTEREST_TITLES[id] || id}
                  </span>
                ))}
              </div>
            )}

            {/* Prompts */}
            {user.prompts && Object.entries(user.prompts).filter(([, v]) => v?.trim()).map(([id, v]) => (
              <div key={id} className="bg-cream rounded-xl px-3.5 py-3 mb-2">
                <p className="text-dark-text/70 text-xs leading-relaxed">"{v}"</p>
              </div>
            ))}

            {/* Socials */}
            {(user.instagram || user.spotify) && (
              <div className="flex gap-4 mt-3">
                {user.instagram && (
                  <span className="flex items-center gap-1.5 text-muted text-xs">
                    <InstagramIcon size={14} /> @{user.instagram.replace('@', '')}
                  </span>
                )}
                {user.spotify && (
                  <span className="flex items-center gap-1.5 text-muted text-xs">
                    <SpotifyIcon size={14} /> {user.spotify}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Plan card */}
          <div className="bg-white rounded-2xl border border-dark-text/5 p-5 shadow-sm mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                {localStorage.getItem('crushky_premium') === 'true' ? 'Crushky Premium ✦' : 'Free plan'}
              </p>
              <p className="text-muted text-xs mt-0.5">
                {localStorage.getItem('crushky_premium') === 'true'
                  ? 'All companions, video calls, unlimited messages'
                  : 'Upgrade for all 4 companions & video calls'}
              </p>
            </div>
            {localStorage.getItem('crushky_premium') === 'true' ? (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>PRO</span>
            ) : (
              <button onClick={() => setTab('companion')}
                className="text-xs font-bold px-4 py-2 rounded-full text-white cursor-pointer hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
                Upgrade
              </button>
            )}
          </div>

          {/* Account settings */}
          <p className="text-muted text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 px-1">Account</p>
          <div className="bg-white rounded-2xl border border-dark-text/5 shadow-sm overflow-hidden mb-5">
            {[
              { icon: <PhoneIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Contact info', note: '+91 ••••• •••10' },
              { icon: <BellIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Notifications', note: 'On' },
              { icon: <EyeIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Who can see you', note: 'Matches only' },
              { icon: <span className="text-rose text-base leading-none">↻</span>, label: 'Replay the matchmaking demo', note: '', onClick: () => {
                setTalkStarted(false); setMessages([]); setAutoIndex(0)
                setRevealedMatches([]); setShortlisted([]); setSkipped([]); setTab('talk')
              } },
            ].map((row, i) => (
              <div key={row.label}
                onClick={row.onClick}
                className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-dark-text/5' : ''} ${row.onClick ? 'cursor-pointer hover:bg-cream/60 transition-colors' : ''}`}>
                <span className="flex items-center">{row.icon}</span>
                <span className="flex-1 text-sm text-dark-text/75 font-medium">{row.label}</span>
                {row.note && <span className="text-muted text-xs">{row.note}</span>}
                <span className="text-dark-text/20">›</span>
              </div>
            ))}
          </div>

          {/* Safety & privacy */}
          <p className="text-muted text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 px-1">Safety & privacy</p>
          <div className="bg-white rounded-2xl border border-dark-text/5 shadow-sm overflow-hidden mb-5">
            {[
              { icon: <ShieldIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Data safety', note: 'Voice deleted after matching' },
              { icon: <DownloadIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Download my data', note: '' },
              { icon: <BlockIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Blocked users', note: 'None' },
              { icon: <HelpIcon size={17} color="rgba(26,26,26,0.45)" />, label: 'Help & feedback', note: '' },
            ].map((row, i) => (
              <div key={row.label}
                className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-dark-text/5' : ''}`}>
                <span className="flex items-center">{row.icon}</span>
                <span className="flex-1 text-sm text-dark-text/75 font-medium">{row.label}</span>
                {row.note && <span className="text-muted text-[11px] text-right max-w-[140px]">{row.note}</span>}
                <span className="text-dark-text/20">›</span>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="space-y-2.5 mb-6">
            <button
              onClick={() => {
                ['crushky_user', 'crushky_premium', 'crushky_chat_done',
                  'crushky_companion_luna', 'crushky_companion_aria',
                  'crushky_companion_nova', 'crushky_companion_maya'].forEach(k => localStorage.removeItem(k))
                navigate('/')
              }}
              className="w-full py-3.5 rounded-full border border-dark-text/12 text-dark-text/50 text-sm font-medium cursor-pointer hover:bg-white transition-all">
              Log out
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete your account? This erases all your data — profile, matches, conversations. (Demo: clears everything.)')) {
                  localStorage.clear()
                  navigate('/')
                }
              }}
              className="w-full py-3.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:bg-rose/5"
              style={{ border: '1px solid rgba(201,75,75,0.25)', color: '#C94B4B' }}>
              Delete account
            </button>
          </div>

          <p className="text-center text-dark-text/20 text-[10px] mb-2">
            Crushky MVP · Made with ♡ in Bangalore
          </p>
        </div>
      )}
    </div>
  )
}
