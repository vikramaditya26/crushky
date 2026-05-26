import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { seedMatches } from '../data/seedMatches'

function CompatBar({ label, value, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300 + delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-dark-text/70">{label}</span>
        <span className="text-sm font-semibold text-dark-text">{value}%</span>
      </div>
      <div className="h-[6px] bg-dark-text/6 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-soft to-amber transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default function MatchProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = seedMatches.find((m) => m.id === Number(id))
  const [showBooking, setShowBooking] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const pageRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    pageRef.current?.querySelectorAll('.sr').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  if (!match) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center grain">
        <p className="text-muted">Match not found.</p>
      </div>
    )
  }

  const allPhotos = match.photos || [match.photo]

  return (
    <div ref={pageRef} className="min-h-screen bg-cream text-dark-text grain">
      {/* Floating orbs */}
      <div className="orb w-72 h-72 bg-rose-light/20 top-[20%] right-[5%] apg" />
      <div className="orb w-56 h-56 bg-amber-light/25 bottom-[30%] left-[5%] ad" />

      {/* Top bar */}
      <div className="bg-cream/70 backdrop-blur-xl border-b border-dark-text/5 sticky top-0 z-40 px-6 md:px-10 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white border border-dark-text/10 flex items-center justify-center text-dark-text/60 hover:text-dark-text cursor-pointer transition-all hover:shadow-sm"
          >
            &larr;
          </button>
          <span className="font-display text-lg font-bold">{match.name}</span>
          <div className="ml-auto flex items-center gap-2">
            {match.spotify && (
              <span className="text-xs text-muted bg-white px-3 py-1 rounded-full border border-dark-text/5">🎵 {match.spotify}</span>
            )}
            {match.instagram && (
              <span className="text-xs text-muted bg-white px-3 py-1 rounded-full border border-dark-text/5">📸 @{match.instagram}</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 relative z-10">
        <div className="grid md:grid-cols-[360px_1fr] lg:grid-cols-[400px_1fr] gap-8 md:gap-12">

          {/* Left: Photos + quick info */}
          <div className="au">
            {/* Main photo */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover-lift">
              <img src={allPhotos[activePhoto]} alt={match.name} className="w-full aspect-[3/4] object-cover" />
            </div>

            {/* Photo thumbnails */}
            {allPhotos.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center">
                {allPhotos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`polaroid cursor-pointer transition-all hover-tilt ${activePhoto === i ? 'ring-2 ring-rose/40 scale-105' : 'opacity-60 hover:opacity-100'}`}
                    style={{ transform: `rotate(${i === 0 ? -3 : i === 1 ? 2 : -1}deg)` }}
                  >
                    <img src={p} alt="" className="w-16 h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick info cards */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-dark-text/5 hover-lift">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Looking for</p>
                <p className="text-dark-text font-medium text-sm">{match.lookingFor}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-dark-text/5 hover-lift">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Love language</p>
                <p className="text-dark-text font-medium text-sm">{match.loveLanguage}</p>
              </div>
            </div>

            {/* Social links */}
            {(match.spotify || match.instagram) && (
              <div className="mt-4 space-y-2">
                {match.spotify && (
                  <div className="bg-white rounded-xl p-3.5 border border-dark-text/5 flex items-center gap-3 hover-lift cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-base">🎵</div>
                    <div>
                      <p className="text-xs font-semibold text-dark-text">Spotify</p>
                      <p className="text-[11px] text-muted">{match.spotify}</p>
                    </div>
                  </div>
                )}
                {match.instagram && (
                  <div className="bg-white rounded-xl p-3.5 border border-dark-text/5 flex items-center gap-3 hover-lift cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-base">📸</div>
                    <div>
                      <p className="text-xs font-semibold text-dark-text">Instagram</p>
                      <p className="text-[11px] text-muted">@{match.instagram}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            {/* Name + info */}
            <div className="au mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold">{match.name}, {match.age}</h1>
              <p className="text-muted mt-2">
                {match.city} &middot; {match.college} &middot; {match.work}
              </p>
              <p className="text-muted text-sm mt-1">{match.height}</p>
            </div>

            {/* Overall compatibility */}
            <div className="sr bg-gradient-to-br from-rose-light/40 to-amber-light/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-base font-bold">Compatibility Score</h2>
                <span className="font-display text-3xl font-bold text-rose">{match.compatibility}%</span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div className="compat-bar h-full" style={{ width: `${match.compatibility}%` }} />
              </div>
            </div>

            {/* Compatibility breakdown */}
            {match.compatBreakdown && (
              <div className="sr bg-white rounded-2xl p-6 border border-dark-text/5 mb-6">
                <h2 className="text-xs text-muted font-semibold uppercase tracking-[0.15em] mb-5">Compatibility Breakdown</h2>
                <div className="space-y-4">
                  <CompatBar label="Shared Values" value={match.compatBreakdown.values} delay={0} />
                  <CompatBar label="Humor Match" value={match.compatBreakdown.humor} delay={100} />
                  <CompatBar label="Energy Level" value={match.compatBreakdown.energy} delay={200} />
                  <CompatBar label="Emotional Depth" value={match.compatBreakdown.depth} delay={300} />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="sr bg-white rounded-2xl p-6 border border-dark-text/5 mb-6">
              <p className="font-display text-base md:text-lg italic text-dark-text/80 leading-relaxed">
                &ldquo;{match.bio}&rdquo;
              </p>
            </div>

            {/* Interests */}
            <div className="sr mb-6">
              <h2 className="text-xs text-muted font-semibold uppercase tracking-[0.15em] mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span key={interest} className="bg-white border border-dark-text/8 px-4 py-2 rounded-full text-sm text-dark-text/70 hover-lift cursor-default">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Why you click */}
            <div className="sr bg-gradient-to-br from-rose/8 to-amber/5 border border-rose/10 rounded-2xl p-6 mb-6">
              <h2 className="font-display text-base font-bold text-rose mb-3 flex items-center gap-2">
                <span>✨</span> Why You Two Click
              </h2>
              <p className="text-dark-text/70 text-sm leading-relaxed">{match.whyYouMatch}</p>
            </div>

            {/* Date suggestion */}
            <div className="sr bg-white rounded-2xl border border-dark-text/5 overflow-hidden mb-6">
              {/* Restaurant photo */}
              {match.dateSuggestion.photo && (
                <div className="relative h-40 overflow-hidden">
                  <img src={match.dateSuggestion.photo} alt={match.dateSuggestion.venue} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-display text-base font-bold flex items-center gap-2 mb-3">
                  🍽 Where to meet
                </h2>
                <p className="text-dark-text font-semibold text-lg">{match.dateSuggestion.venue}</p>
                <p className="text-muted text-sm mt-1">{match.dateSuggestion.type} &middot; {match.dateSuggestion.area}</p>

                {!showBooking ? (
                  <button
                    onClick={() => setShowBooking(true)}
                    className="mt-4 w-full py-3.5 rounded-full bg-dark-green text-white font-semibold text-sm cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg"
                  >
                    Book this date
                  </button>
                ) : (
                  <div className="mt-4 au space-y-4">
                    <div className="bg-cream rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-dark-text">Date with {match.name.split(' ')[0]}</p>
                          <p className="text-muted text-sm mt-1">Saturday, 7:30 PM</p>
                        </div>
                        <span className="bg-dark-green/10 text-dark-green text-xs font-semibold px-3 py-1 rounded-full">Confirmed</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-dark-text/5 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-muted text-sm">📍</span>
                          <p className="text-sm text-dark-text/70">{match.dateSuggestion.area}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-muted text-sm">🕗</span>
                          <p className="text-sm text-dark-text/70">Table for 2, window seating</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-muted text-sm">💰</span>
                          <p className="text-sm text-dark-text/70">Avg. &#x20b9;1,200 for two</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-muted text-xs">We'll send you a reminder before your date 🎉</p>
                  </div>
                )}
              </div>
            </div>
            {/* Chat with match */}
            {match.sampleChat && (
              <div className="sr bg-white rounded-2xl border border-dark-text/5 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-dark-text/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={match.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h2 className="font-display text-sm font-bold">Chat with {match.name.split(' ')[0]}</h2>
                      <p className="text-[10px] text-muted">Preview conversation</p>
                    </div>
                  </div>
                  <span className="bg-dark-green/10 text-dark-green text-[10px] font-semibold px-2.5 py-1 rounded-full">Active now</span>
                </div>
                <div className="p-4 space-y-2.5 max-h-[360px] overflow-y-auto">
                  {match.sampleChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.from === 'you'
                          ? 'bg-dark-green text-white rounded-2xl rounded-br-sm'
                          : 'bg-cream text-dark-text/80 rounded-2xl rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-dark-text/5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Message ${match.name.split(' ')[0]}...`}
                      className="flex-1 bg-cream border border-dark-text/8 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-dark-text/25"
                    />
                    <button className="w-9 h-9 rounded-full bg-dark-green text-white flex items-center justify-center shrink-0 cursor-pointer hover:bg-dark-green/90 transition-all text-sm">
                      &#10148;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
