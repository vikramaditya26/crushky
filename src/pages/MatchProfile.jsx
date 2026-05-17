import { useParams, useNavigate } from 'react-router-dom'
import { seedMatches } from '../data/seedMatches'

export default function MatchProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = seedMatches.find((m) => m.id === Number(id))

  if (!match) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted">Match not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream text-dark-text">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-dark-text/60 hover:text-dark-text text-xl cursor-pointer transition-colors"
        >
          &larr;
        </button>
        <span className="font-display text-lg font-bold">{match.name}</span>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-12">
        {/* Photo */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <img src={match.photo} alt={match.name} className="w-full aspect-[4/5] object-cover" />
        </div>

        {/* Name + basics */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">{match.name}, {match.age}</h1>
          <p className="text-muted mt-1">{match.city} &middot; {match.college} &middot; {match.work}</p>
          <p className="text-muted text-sm mt-1">{match.height}</p>
        </div>

        {/* Bio */}
        <p className="font-display text-lg italic text-dark-text/80 leading-relaxed mb-8">
          "{match.bio}"
        </p>

        {/* Interests */}
        <div className="mb-8">
          <h2 className="text-xs text-muted uppercase tracking-[0.15em] mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {match.interests.map((i) => (
              <span key={i} className="bg-white border border-dark-text/10 px-4 py-2 rounded-full text-sm text-dark-text/80">
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 border border-dark-text/5">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Looking for</p>
            <p className="text-dark-text font-medium text-sm">{match.lookingFor}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-dark-text/5">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Love language</p>
            <p className="text-dark-text font-medium text-sm">{match.loveLanguage}</p>
          </div>
        </div>

        {/* Why you click */}
        <div className="bg-rose/8 border border-rose/15 rounded-2xl p-6 mb-8">
          <h2 className="font-display text-base font-bold text-rose mb-3">Why You Two Click</h2>
          <p className="text-dark-text/80 text-sm leading-relaxed">{match.whyYouMatch}</p>
        </div>

        {/* Date suggestion */}
        <div className="bg-white rounded-2xl p-6 border border-dark-text/5 mb-8">
          <h2 className="font-display text-base font-bold mb-3">Where to meet</h2>
          <p className="text-dark-text font-medium">{match.dateSuggestion.venue}</p>
          <p className="text-muted text-sm">{match.dateSuggestion.type} &middot; {match.dateSuggestion.area}</p>
          <button className="mt-4 w-full py-3 rounded-full bg-dark-green text-white font-medium text-sm cursor-pointer hover:bg-dark-green/90 transition-colors">
            Book this date
          </button>
        </div>
      </div>
    </div>
  )
}
