import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { seedMatches } from '../data/seedMatches'
import { SpotifyIcon, InstagramIcon, CalendarIcon, PinIcon, HandshakeIcon, SparkleIcon, ForkIcon } from '../components/Icons'

const QUICK_ACTIONS = [
  { icon: <InstagramIcon size={14} />, label: 'Share Instagram' },
  { icon: <SpotifyIcon size={14} />,   label: 'Share Spotify' },
  { icon: <CalendarIcon size={14} />,  label: 'Plan a date' },
  { icon: <PinIcon size={14} />,       label: 'Share location' },
]

export default function MatchProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = seedMatches.find((m) => m.id === Number(id))
  const [tab, setTab] = useState('chat')
  const [showBooking, setShowBooking] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const endRef = useRef(null)

  // Load sample chat as initial messages
  useEffect(() => {
    if (match?.sampleChat) {
      setMessages(match.sampleChat.map((msg) => ({
        from: msg.from,
        text: msg.text,
        type: 'text',
      })))
    }
  }, [match?.id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!match) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center grain">
        <p className="text-muted">Match not found.</p>
      </div>
    )
  }

  const firstName = match.name.split(' ')[0]

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { from: 'you', text: input.trim(), type: 'text' }])
    setInput('')
    // Simulate reply
    setTimeout(() => {
      const replies = [
        `Haha that's so true! Tell me more about that.`,
        `I was literally thinking the same thing today.`,
        `Okay wait, that's actually really interesting.`,
        `You're fun to talk to, you know that? 😄`,
      ]
      setMessages((prev) => [...prev, {
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        type: 'text',
      }])
    }, 1200)
  }

  const handleShareInstagram = () => {
    setMessages((prev) => [
      ...prev,
      { from: 'you', text: '', type: 'instagram', handle: 'aditya.kumar_' },
    ])
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        from: 'them',
        text: `Just followed you! Your travel photos are amazing btw.`,
        type: 'text',
      }])
    }, 1000)
  }

  const handleShareSpotify = () => {
    setMessages((prev) => [
      ...prev,
      { from: 'you', text: '', type: 'spotify', handle: 'aditya.vibes' },
    ])
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        from: 'them',
        text: `Omg we have such similar taste! Adding your playlist now.`,
        type: 'text',
      }])
    }, 1000)
  }

  const handlePlanDate = () => {
    setShowDatePicker(true)
  }

  const handleConfirmDate = (day) => {
    setSelectedDay(day)
    setShowDatePicker(false)
    setMessages((prev) => [
      ...prev,
      { from: 'you', text: '', type: 'date-plan', venue: match.dateSuggestion.venue, area: match.dateSuggestion.area, day },
    ])
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        from: 'them',
        text: `${day} works perfectly! Can't wait. See you at ${match.dateSuggestion.venue}! 🎉`,
        type: 'text',
      }])
    }, 1200)
  }

  const handleQuickAction = (label) => {
    if (label === 'Share Instagram') handleShareInstagram()
    else if (label === 'Share Spotify') handleShareSpotify()
    else if (label === 'Plan a date') handlePlanDate()
    else if (label === 'Share location') {
      setMessages((prev) => [
        ...prev,
        { from: 'you', text: `📍 Mumbai, Maharashtra`, type: 'text' },
      ])
    }
  }

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'profile', label: 'Profile' },
  ]

  const DAYS = ['This Saturday', 'This Sunday', 'Next Friday', 'Next Saturday']

  return (
    <div className="min-h-screen bg-cream text-dark-text flex flex-col">
      {/* ─── Top Bar ─── */}
      <div className="bg-cream/70 backdrop-blur-xl border-b border-dark-text/5 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          {/* Header row */}
          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-full bg-white border border-dark-text/10 flex items-center justify-center text-dark-text/60 hover:text-dark-text cursor-pointer transition-all hover:shadow-sm shrink-0"
            >
              &larr;
            </button>
            <img src={match.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-base font-bold truncate">{match.name}, {match.age}</p>
              <p className="text-[10px] text-rose font-medium">Active now</p>
            </div>
            <span className="bg-rose/10 text-rose font-bold text-xs px-2.5 py-1 rounded-full shrink-0">{match.compatibility}%</span>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-dark-text/5 rounded-full p-1 mb-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === t.id ? 'bg-rose text-white shadow-sm' : 'text-muted hover:text-dark-text/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CHAT TAB ─── */}
      {tab === 'chat' && (
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full" style={{ height: 'calc(100vh - 140px)' }}>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4">
            {/* Match intro card */}
            <div className="au bg-gradient-to-br from-rose-light/30 to-amber-light/20 rounded-2xl p-4 mb-5 text-center">
              <img src={match.photo} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-2 border-2 border-white shadow-sm" />
              <p className="font-display text-sm font-bold">{match.name}, {match.age}</p>
              <p className="text-muted text-xs">{match.city} &middot; {match.compatibility}% match</p>
              <p className="text-dark-text/50 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                You matched because: {match.whyYouMatch.split('.')[0]}.
              </p>
            </div>

            {/* Chat messages */}
            <div className="space-y-2.5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'} ai`}>
                  {msg.from !== 'you' && (
                    <img src={match.photo} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0" />
                  )}
                  <div className={`max-w-[75%] ${
                    msg.from === 'you' ? '' : ''
                  }`}>
                    {/* Regular text message */}
                    {msg.type === 'text' && (
                      <div className={`px-4 py-2.5 text-[13px] leading-relaxed ${
                        msg.from === 'you'
                          ? 'bg-rose text-white rounded-2xl rounded-br-sm'
                          : 'bg-white border border-dark-text/5 text-dark-text/80 rounded-2xl rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Instagram share card */}
                    {msg.type === 'instagram' && (
                      <div className="bg-gradient-to-br from-[#E1306C]/10 to-[#F77737]/10 border border-[#E1306C]/20 rounded-2xl rounded-br-sm px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E1306C]/10 flex items-center justify-center"><InstagramIcon size={16} /></div>
                          <div>
                            <p className="text-[11px] text-muted">Shared Instagram</p>
                            <p className="text-sm font-semibold text-dark-text">@{msg.handle}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Spotify share card */}
                    {msg.type === 'spotify' && (
                      <div className="bg-[#1DB954]/8 border border-[#1DB954]/20 rounded-2xl rounded-br-sm px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1DB954]/10 flex items-center justify-center"><SpotifyIcon size={16} /></div>
                          <div>
                            <p className="text-[11px] text-muted">Shared Spotify</p>
                            <p className="text-sm font-semibold text-dark-text">{msg.handle}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date plan card */}
                    {msg.type === 'date-plan' && (
                      <div className="bg-rose text-white rounded-2xl rounded-br-sm px-4 py-3">
                        <p className="text-[10px] text-white/60 mb-1">Date planned</p>
                        <p className="text-sm font-semibold">{msg.venue}</p>
                        <p className="text-[12px] text-white/70 mt-0.5">{msg.area}</p>
                        <div className="mt-2 pt-2 border-t border-white/15 flex items-center gap-2">
                          <span className="text-xs">📅</span>
                          <span className="text-[12px]">{msg.day}, 7:30 PM</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Date picker overlay in chat */}
            {showDatePicker && (
              <div className="as mt-4 bg-white rounded-2xl border border-dark-text/5 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-sm font-bold">Plan a date</h3>
                    <p className="text-muted text-xs">{match.dateSuggestion.venue} &middot; {match.dateSuggestion.area}</p>
                  </div>
                  <button onClick={() => setShowDatePicker(false)} className="text-muted hover:text-dark-text cursor-pointer text-lg">&times;</button>
                </div>
                {match.dateSuggestion.photo && (
                  <div className="rounded-xl overflow-hidden mb-4 h-28">
                    <img src={match.dateSuggestion.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-muted mb-3 font-medium">Pick a day</p>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleConfirmDate(day)}
                      className="py-2.5 rounded-xl border-2 border-dark-text/8 text-sm font-medium text-dark-text/70 cursor-pointer hover:border-rose/40 hover:bg-rose/5 transition-all"
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-muted text-[11px]">
                  <span>💰</span>
                  <span>Avg. &#x20b9;1,200 for two &middot; {match.dateSuggestion.type}</span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick actions bar */}
          <div className="px-5 md:px-10 py-2 border-t border-dark-text/5 bg-cream/80">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => handleQuickAction(a.label)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-dark-text/8 text-xs font-medium text-dark-text/60 cursor-pointer hover:border-rose/30 hover:text-dark-text transition-all shrink-0"
                >
                  <span>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message input */}
          <div className="px-5 md:px-10 py-3 border-t border-dark-text/5 bg-cream">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${firstName}...`}
                className="flex-1 bg-white border border-dark-text/10 rounded-full px-5 py-3 text-sm outline-none focus:border-rose/40 transition-all placeholder:text-dark-text/25"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-rose text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 hover:bg-rose/90 transition-all text-sm"
              >
                &#10148;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PROFILE TAB ─── */}
      {tab === 'profile' && (
        <div className="flex-1 max-w-3xl mx-auto w-full px-5 md:px-10 py-6 overflow-y-auto">
          <div className="au">
            {/* Main photo */}
            <div className="rounded-2xl overflow-hidden shadow-lg mb-3">
              <img src={match.photo} alt={match.name} className="w-full aspect-[4/5] object-cover max-h-[420px]" />
            </div>

            {/* More photos */}
            {match.photos?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {match.photos.map((p, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                    <img src={p} alt="" className="w-full aspect-[4/5] object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Name + basics */}
            <div className="mb-6">
              <h1 className="font-display text-3xl font-bold">{match.name}, {match.age}</h1>
              <p className="text-muted mt-1.5">{match.city} &middot; {match.height}</p>
            </div>

            {/* Bio quote */}
            <div className="bg-white rounded-2xl p-5 border border-dark-text/5 mb-5">
              <p className="font-display text-base italic text-dark-text/80 leading-relaxed">
                &ldquo;{match.bio}&rdquo;
              </p>
            </div>

            {/* Compatibility score */}
            <div className="bg-gradient-to-br from-rose-light/40 to-amber-light/30 rounded-2xl p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-sm font-bold">Compatibility</h2>
                <span className="font-display text-2xl font-bold text-rose">{match.compatibility}%</span>
              </div>
              <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                <div className="compat-bar h-full" style={{ width: `${match.compatibility}%` }} />
              </div>
            </div>

            {/* What you two share — human, specific, no percentages */}
            {match.inCommon?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-dark-text/5 mb-5">
                <h2 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
                  <HandshakeIcon size={16} color="#C94B4B" /> What you two share
                </h2>
                <div className="space-y-3">
                  {match.inCommon.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose/10 text-rose flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                      <p className="text-dark-text/70 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why you click */}
            <div className="bg-gradient-to-br from-rose/8 to-amber/5 border border-rose/10 rounded-2xl p-5 mb-5">
              <h2 className="font-display text-sm font-bold text-rose mb-2 flex items-center gap-2">
                <SparkleIcon size={15} color="#C94B4B" /> Why You Two Click
              </h2>
              <p className="text-dark-text/70 text-sm leading-relaxed">{match.whyYouMatch}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Career</p>
                <p className="text-dark-text font-medium text-sm">{match.work}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Education</p>
                <p className="text-dark-text font-medium text-sm">{match.college}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Looking for</p>
                <p className="text-dark-text font-medium text-sm">{match.lookingFor}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Love language</p>
                <p className="text-dark-text font-medium text-sm">{match.loveLanguage}</p>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-5">
              <h2 className="text-xs text-muted font-semibold uppercase tracking-[0.15em] mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span key={interest} className="bg-white border border-dark-text/8 px-4 py-2 rounded-full text-sm text-dark-text/70">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-2.5 mb-5">
              {match.spotify && (
                <div className="bg-white rounded-xl p-4 border border-dark-text/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center"><SpotifyIcon size={20} /></div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-dark-text">Spotify</p>
                    <p className="text-[11px] text-muted">{match.spotify}</p>
                  </div>
                </div>
              )}
              {match.instagram && (
                <div className="bg-white rounded-xl p-4 border border-dark-text/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center"><InstagramIcon size={20} /></div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-dark-text">Instagram</p>
                    <p className="text-[11px] text-muted">@{match.instagram}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Date suggestions — Crushky's top pick + more spots you'd both like */}
            <div className="mb-8">
              <h2 className="font-display text-sm font-bold flex items-center gap-2 mb-3">
                <ForkIcon size={15} color="#C94B4B" /> Where you two should go
              </h2>

              {/* Top pick */}
              <div className="bg-white rounded-2xl border border-dark-text/5 overflow-hidden mb-3">
                {match.dateSuggestion.photo && (
                  <div className="relative h-36 overflow-hidden">
                    <img src={match.dateSuggestion.photo} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ✦ Crushky's pick
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <p className="text-dark-text font-semibold">{match.dateSuggestion.venue}</p>
                  <p className="text-muted text-xs mt-0.5">{match.dateSuggestion.type} &middot; {match.dateSuggestion.area}</p>
                  <button
                    onClick={() => { setTab('chat'); setTimeout(() => handlePlanDate(), 300) }}
                    className="mt-4 w-full py-3 rounded-full bg-rose text-white font-semibold text-sm cursor-pointer hover:bg-rose/90 transition-all hover:shadow-lg"
                  >
                    Plan this date
                  </button>
                </div>
              </div>

              {/* More spots */}
              {match.dateSpots?.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {match.dateSpots.map((spot, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-dark-text/5 overflow-hidden">
                      {spot.photo && (
                        <div className="h-20 overflow-hidden">
                          <img src={spot.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-dark-text font-semibold text-xs leading-tight">{spot.venue}</p>
                        <p className="text-muted text-[10px] mt-1">{spot.type}</p>
                        <p className="text-muted text-[10px]">{spot.area}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
