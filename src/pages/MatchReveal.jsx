import { useState, useEffect } from 'react'
import MatchCard from '../components/MatchCard'
import { seedMatches } from '../data/seedMatches'

export default function MatchReveal() {
  const [revealed, setRevealed] = useState(false)
  const match = seedMatches[0]

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!revealed) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-6">
        <div className="animate-pulse text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-light-text mb-4">
            Analyzing your vibe...
          </h1>
          <p className="text-light-text/60">
            Finding someone who actually gets you
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <span className="w-3 h-3 bg-rose rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-3 h-3 bg-rose rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-3 h-3 bg-rose rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-6">
      <div className="text-center mb-10">
        <p className="text-amber font-medium text-sm tracking-widest uppercase mb-3">
          Your Top Match
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-light-text">
          We found someone special
        </h1>
      </div>
      <MatchCard match={match} />
    </div>
  )
}
