import { useNavigate } from 'react-router-dom'

export default function MatchCard({ match }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-dark-text/5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={match.photo}
          alt={match.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Match badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <span className="text-rose font-bold text-xs">{match.compatibility}% match</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white">
            {match.name}, {match.age}
          </h3>
          <p className="text-white/70 text-xs mt-1">
            {match.city} &middot; {match.college}
          </p>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <p className="text-dark-text/60 text-xs md:text-sm leading-relaxed line-clamp-2">
          {match.whyYouMatch}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {match.interests.slice(0, 3).map((i) => (
            <span key={i} className="bg-cream text-dark-text/50 text-[10px] px-2.5 py-1 rounded-full">{i}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
