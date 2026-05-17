import { useNavigate } from 'react-router-dom'

export default function MatchCard({ match }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className="bg-card-light rounded-2xl overflow-hidden shadow-sm border border-dark-text/5 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={match.photo} alt={match.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="font-display text-2xl font-bold text-white">
            {match.name}, {match.age}
          </h3>
          <p className="text-white/70 text-sm mt-1">
            {match.city} &middot; {match.college}
          </p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-dark-text/70 text-sm leading-relaxed line-clamp-3">
          {match.whyYouMatch}
        </p>
        <button className="mt-4 w-full py-3 rounded-full border border-dark-text/15 text-dark-text font-medium text-sm hover:bg-dark-text/5 transition-colors cursor-pointer">
          See Full Profile
        </button>
      </div>
    </div>
  )
}
