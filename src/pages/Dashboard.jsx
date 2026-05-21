import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import CompanionChat from '../components/CompanionChat'
import { seedMatches } from '../data/seedMatches'

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('ai')
  const hasCompleted = localStorage.getItem('crushky_chat_done') === 'true'
  const user = JSON.parse(localStorage.getItem('crushky_user') || '{}')

  return (
    <div className="min-h-screen bg-cream text-dark-text">
      {/* Top Bar */}
      <div className="bg-cream/80 backdrop-blur-lg border-b border-dark-text/5 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 md:px-10 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-xl md:text-2xl font-bold">Crushky</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber overflow-hidden flex items-center justify-center text-sm font-semibold text-white">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-1 bg-dark-text/5 rounded-full p-1 max-w-xs">
            <button
              onClick={() => setTab('ai')}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                tab === 'ai' ? 'bg-dark-green text-white shadow-sm' : 'text-dark-text/40 hover:text-dark-text/60'
              }`}
            >
              &#10024; Crushky AI
            </button>
            <button
              onClick={() => setTab('companion')}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                tab === 'companion' ? 'bg-dark-green text-white shadow-sm' : 'text-dark-text/40 hover:text-dark-text/60'
              }`}
            >
              &#128172; My Companion
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {tab === 'ai' && !hasCompleted && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
            {/* Gradient blob */}
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose/20 via-amber/15 to-rose-soft/20 animate-pulse-soft" />
              <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-tr from-amber/10 to-rose/10 blur-xl" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Time to talk to <span className="italic text-rose">Crushky</span>
            </h2>
            <p className="text-muted max-w-sm mb-10 leading-relaxed">
              After this chat, your AI will know enough to start finding your person.
            </p>
            <div className="glass-card rounded-2xl p-6 mb-10 max-w-sm w-full text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-sm">&#127793;</div>
                <p className="text-dark-text/70 text-sm">Find a quiet, comfortable space</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-sm">&#9200;</div>
                <p className="text-dark-text/70 text-sm">This takes about 5 minutes</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-sm">&#128274;</div>
                <p className="text-dark-text/70 text-sm">Everything you share stays private</p>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-sm">
              <button className="flex-1 py-3.5 rounded-full border border-dark-text/10 text-dark-text/50 font-medium cursor-pointer hover:bg-white/50 transition-all">
                Later
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex-1 py-3.5 rounded-full bg-dark-green text-white font-semibold cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start talking &#10148;
              </button>
            </div>
          </div>
        )}

        {tab === 'ai' && hasCompleted && (
          <div className="py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold">People you should meet</h2>
                <p className="text-muted text-sm mt-1">Based on your conversation with Crushky AI</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {seedMatches.map((match, i) => (
                <div key={match.id} className="animate-scale-in opacity-0" style={{ animationDelay: `${i * 150}ms` }}>
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'companion' && (
          <div className="animate-fade-in">
            <CompanionChat />
          </div>
        )}
      </div>
    </div>
  )
}
