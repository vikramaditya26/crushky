import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-dark/80 border-b border-card-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-light-text tracking-tight">
          Crushky
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/companion" className="text-sm text-light-text/60 hover:text-light-text transition-colors">
            AI Companion
          </Link>
          <Link
            to="/signup"
            className="bg-rose hover:bg-rose/90 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
