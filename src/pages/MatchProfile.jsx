import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { seedMatches } from '../data/seedMatches'

export default function MatchProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = seedMatches.find((m) => m.id === Number(id))
  const [showBooking, setShowBooking] = useState(false)

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
      <div className="bg-cream/80 backdrop-blur-lg border-b border-dark-text/5 sticky top-0 z-40 px-6 md:px-10 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white border border-dark-text/10 flex items-center justify-center text-dark-text/60 hover:text-dark-text cursor-pointer transition-colors hover:shadow-sm"
          >
            &larr;
          </button>
          <span className="font-display text-lg font-bold">{match.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        <div className="grid md:grid-cols-[360px_1fr] lg:grid-cols-[400px_1fr] gap-8 md:gap-12">
          {/* Left: Photo + quick info */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={match.photo} alt={match.name} className="w-full aspect-[3/4] object-cover" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Looking for</p>
                <p className="text-dark-text font-medium text-sm">{match.lookingFor}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-dark-text/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Love language</p>
                <p className="text-dark-text font-medium text-sm">{match.loveLanguage}</p>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold">{match.name}, {match.age}</h1>
              <p className="text-muted mt-2">
                {match.city} &middot; {match.college} &middot; {match.work}
              </p>
              <p className="text-muted text-sm mt-1">{match.height}</p>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-6 border border-dark-text/5 mb-6">
              <p className="font-display text-base md:text-lg italic text-dark-text/80 leading-relaxed">
                &ldquo;{match.bio}&rdquo;
              </p>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h2 className="text-[10px] text-muted uppercase tracking-[0.15em] mb-3 font-semibold">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span key={interest} className="bg-white border border-dark-text/8 px-4 py-2 rounded-full text-sm text-dark-text/70">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Why you click */}
            <div className="bg-gradient-to-br from-rose/8 to-amber/5 border border-rose/10 rounded-2xl p-6 mb-6">
              <h2 className="font-display text-base font-bold text-rose mb-3">&#10024; Why You Two Click</h2>
              <p className="text-dark-text/70 text-sm leading-relaxed">{match.whyYouMatch}</p>
            </div>

            {/* Date suggestion */}
            <div className="bg-white rounded-2xl border border-dark-text/5 overflow-hidden mb-6">
              <div className="bg-dark-green/5 px-6 py-4 border-b border-dark-text/5">
                <h2 className="font-display text-base font-bold flex items-center gap-2">
                  &#127869; Where to meet
                </h2>
              </div>
              <div className="p-6">
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
                  <div className="mt-4 anim-up space-y-4">
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
                          <span className="text-muted text-sm">&#128205;</span>
                          <p className="text-sm text-dark-text/70">{match.dateSuggestion.area}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-muted text-sm">&#128337;</span>
                          <p className="text-sm text-dark-text/70">Table for 2, window seating</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-muted text-sm">&#128176;</span>
                          <p className="text-sm text-dark-text/70">Avg. &#x20b9;1,200 for two</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-muted text-xs">We'll send you a reminder before your date &#x1F389;</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
