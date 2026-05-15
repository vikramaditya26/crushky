import { useParams, useNavigate } from 'react-router-dom'
import { seedMatches } from '../data/seedMatches'
import NavBar from '../components/NavBar'

export default function MatchProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = seedMatches.find((m) => m.id === Number(id))

  if (!match) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-light-text/60">Match not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-64 shrink-0">
            <img
              src={match.photo}
              alt={match.name}
              className="w-full aspect-[4/5] object-cover rounded-2xl"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-4xl font-bold text-light-text">
                {match.name}, {match.age}
              </h1>
              <span className="bg-rose/20 text-rose text-sm font-bold px-3 py-1 rounded-full">
                {match.compatibility}% Match
              </span>
            </div>
            <p className="text-light-text/60 mb-6">
              {match.job} &middot; {match.location} &middot; {match.college}
            </p>

            <p className="text-light-text/80 text-lg italic mb-8 leading-relaxed">
              "{match.bio}"
            </p>

            <div className="mb-8">
              <h2 className="text-sm text-light-text/40 uppercase tracking-widest mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-card-dark border border-card-border px-4 py-2 rounded-full text-sm text-light-text/80"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card-dark border border-card-border rounded-xl p-4">
                <p className="text-xs text-light-text/40 uppercase tracking-widest mb-1">Looking For</p>
                <p className="text-light-text font-medium">{match.lookingFor}</p>
              </div>
              <div className="bg-card-dark border border-card-border rounded-xl p-4">
                <p className="text-xs text-light-text/40 uppercase tracking-widest mb-1">Love Language</p>
                <p className="text-light-text font-medium">{match.loveLanguage}</p>
              </div>
            </div>

            <div className="bg-rose/10 border border-rose/20 rounded-2xl p-6 mb-8">
              <h2 className="text-sm text-rose uppercase tracking-widest mb-3">Why You Two Click</h2>
              <p className="text-light-text/80 leading-relaxed">{match.whyYouMatch}</p>
            </div>

            <button
              onClick={() => navigate('/match')}
              className="text-light-text/40 hover:text-light-text text-sm transition-colors cursor-pointer"
            >
              &larr; Back to match reveal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
