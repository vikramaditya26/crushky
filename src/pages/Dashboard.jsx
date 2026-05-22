import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import CompanionChat from '../components/CompanionChat'
import { seedMatches } from '../data/seedMatches'

const PERSONALITY_CARDS = [
  { title: "Work & lifestyle", body: "You live to build, centering everything around your creative career. You value deep work, long walks, and tucked-away cafes over loud bars.", icon: "✦" },
  { title: "Dating energy", body: "You're looking for someone who matches your intensity intellectually but brings calm to the chaos. Deep conversations over surface-level small talk.", icon: "♡" },
  { title: "Communication style", body: "Direct but thoughtful. You'd rather have one honest conversation than ten surface-level ones. You remember what people tell you.", icon: "◎" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('you')
  const hasCompleted = localStorage.getItem('crushky_chat_done') === 'true'
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')

  const tabs = [
    { id: 'you', label: 'You', icon: '◉' },
    { id: 'matches', label: 'Matches', icon: '✨' },
    { id: 'companion', label: 'Companion', icon: '💬' },
  ]

  return (
    <div className="min-h-screen bg-cream text-dark-text grain">
      {/* Top Bar */}
      <div className="bg-cream/70 backdrop-blur-xl border-b border-dark-text/5 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-xl font-bold">Crushky</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber overflow-hidden flex items-center justify-center text-sm font-semibold text-white">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
          {/* 3 Tabs */}
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

      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* ─── YOU TAB ─── */}
        {tab === 'you' && (
          <div className="py-8 au">
            {/* Profile header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-soft to-amber mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white font-display">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h2 className="font-display text-2xl font-bold">{user.name || 'You'}</h2>
              <p className="text-muted text-sm mt-1">
                {[user.city, user.college, user.work].filter(Boolean).join(' · ') || 'Complete your profile'}
              </p>
              {(user.spotify || user.instagram) && (
                <div className="flex justify-center gap-4 mt-3">
                  {user.spotify && (
                    <span className="text-xs text-muted bg-white px-3 py-1 rounded-full border border-dark-text/5">🎵 {user.spotify}</span>
                  )}
                  {user.instagram && (
                    <span className="text-xs text-muted bg-white px-3 py-1 rounded-full border border-dark-text/5">📸 {user.instagram}</span>
                  )}
                </div>
              )}
            </div>

            {/* User photos */}
            {user.photos?.length > 0 && (
              <div className="flex justify-center gap-3 mb-8">
                {user.photos.map((p, i) => (
                  <div key={i} className="polaroid hover-tilt" style={{ transform: `rotate(${i === 0 ? -3 : i === 1 ? 2 : -1}deg)` }}>
                    <img src={p} alt="" className="w-28 h-36 object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* How AI sees you */}
            <div className="mb-6">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-[0.15em] mb-4">How AI sees you</h3>
              <div className="space-y-4">
                {PERSONALITY_CARDS.map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-dark-text/5 hover-lift">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-rose text-sm">{card.icon}</span>
                      <h4 className="font-display text-base font-bold italic">{card.title}</h4>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Start chat CTA if not done */}
            {!hasCompleted && (
              <div className="bg-gradient-to-br from-rose-light/40 to-amber-light/30 rounded-2xl p-6 text-center">
                <p className="font-display text-lg font-bold mb-2">Ready to find your match?</p>
                <p className="text-muted text-sm mb-4">Have a quick chat with our AI. It takes 3-4 minutes.</p>
                <button onClick={() => navigate('/chat')} className="bg-dark-green text-white font-semibold px-6 py-3 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg text-sm">
                  Start Talking ✨
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── MATCHES TAB ─── */}
        {tab === 'matches' && (
          <div className="py-8">
            {!hasCompleted ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center au">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-light/50 to-amber-light/50 apg" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Talk to <span className="italic text-rose">Crushky</span> first
                </h2>
                <p className="text-muted max-w-sm mb-8 leading-relaxed">
                  Have a quick conversation with our AI so we can find your perfect matches.
                </p>
                <button onClick={() => navigate('/chat')} className="bg-dark-green text-white font-semibold px-7 py-3.5 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg">
                  Start talking →
                </button>
              </div>
            ) : (
              <div className="au">
                <div className="mb-6">
                  <h2 className="font-display text-xl md:text-2xl font-bold">People you should meet</h2>
                  <p className="text-muted text-sm mt-1">Based on your conversation with Crushky AI</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {seedMatches.map((match, i) => (
                    <div key={match.id} className="as" style={{ animationDelay: `${i * 120}ms` }}>
                      <MatchCard match={match} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── COMPANION TAB ─── */}
        {tab === 'companion' && <CompanionChat />}
      </div>
    </div>
  )
}
