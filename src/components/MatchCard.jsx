import { useNavigate } from 'react-router-dom'

export default function MatchCard({ match }) {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-card-border bg-card-dark backdrop-blur-lg">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={match.photo}
            alt={match.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">
                {match.name}, {match.age}
              </h2>
              <p className="text-light-text/70 text-sm mt-1">
                {match.job} &middot; {match.location}
              </p>
            </div>
            <div className="bg-rose/90 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold text-lg">{match.compatibility}%</span>
            </div>
          </div>

          <p className="text-light-text/80 text-sm leading-relaxed mb-4">
            {match.whyYouMatch}
          </p>

          <button
            onClick={() => navigate(`/match/${match.id}`)}
            className="w-full bg-rose hover:bg-rose/90 text-white font-semibold py-3 rounded-full transition-colors cursor-pointer"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  )
}
