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
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <span className="font-display text-2xl font-bold">Crushky</span>
        <div className="w-9 h-9 rounded-full bg-dark-text/10 flex items-center justify-center text-sm font-medium">
          {user.name ? user.name[0].toUpperCase() : 'U'}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 bg-dark-text/5 rounded-full p-1 max-w-xs mx-auto">
          <button
            onClick={() => setTab('ai')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              tab === 'ai' ? 'bg-dark-green text-white' : 'text-dark-text/50'
            }`}
          >
            Crushky AI
          </button>
          <button
            onClick={() => setTab('companion')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              tab === 'companion' ? 'bg-dark-green text-white' : 'text-dark-text/50'
            }`}
          >
            My Companion
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'ai' && !hasCompleted && (
        <div className="px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose/30 via-amber/20 to-rose/10 mb-8" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Time to talk to Crushky
          </h2>
          <p className="text-muted max-w-sm mb-8">
            After this chat, your AI will know enough to start finding your person.
          </p>
          <div className="bg-white rounded-xl p-5 mb-8 max-w-sm w-full text-left shadow-sm">
            <p className="text-dark-text/80 text-sm mb-2">1. Find a quiet, comfortable space</p>
            <p className="text-dark-text/80 text-sm">2. This takes about 5 minutes</p>
          </div>
          <div className="flex gap-3 w-full max-w-sm">
            <button className="flex-1 py-3.5 rounded-full border border-dark-text/15 text-dark-text/60 font-medium cursor-pointer hover:bg-dark-text/5 transition-colors">
              Remind me later
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 py-3.5 rounded-full bg-dark-green text-white font-semibold cursor-pointer hover:bg-dark-green/90 transition-colors"
            >
              Start talking
            </button>
          </div>
          <p className="text-muted text-xs mt-6 flex items-center gap-1.5">
            &#128274; Everything you share stays private
          </p>
        </div>
      )}

      {tab === 'ai' && hasCompleted && (
        <div className="px-6 pb-8">
          <h2 className="font-display text-xl font-bold mb-5">People you should meet</h2>
          <div className="grid gap-6 max-w-lg mx-auto">
            {seedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {tab === 'companion' && <CompanionChat />}
    </div>
  )
}
