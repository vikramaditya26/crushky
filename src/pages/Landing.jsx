import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark text-light-text">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-dark/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-2xl font-bold tracking-tight">Crushky</span>
          <button
            onClick={() => navigate('/signup')}
            className="bg-rose hover:bg-rose/90 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <p className="text-amber font-medium text-xs tracking-[0.2em] uppercase mb-8">
          AI-Powered Dating
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] max-w-4xl">
          Talk to AI.
          <br />
          <span className="text-rose">Meet your person.</span>
        </h1>
        <p className="text-light-text/50 text-lg md:text-xl max-w-xl mt-8 leading-relaxed font-body">
          No swiping. No awkward openers. Just one honest conversation
          with our AI, and we'll find the person who actually gets you.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="mt-12 bg-rose hover:bg-rose/90 text-white font-semibold px-10 py-4 rounded-full text-lg transition-colors cursor-pointer"
        >
          Find Your Match
        </button>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-20">
          How Crushky Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Have a Conversation",
              body: "Chat with our AI for a few minutes. It asks the questions your best friend would — the real ones.",
            },
            {
              num: "02",
              title: "We Find Your Match",
              body: "Our AI understands who you actually are, not just what you look like. It finds someone who complements you.",
            },
            {
              num: "03",
              title: "Know Why You Click",
              body: "No guessing. We tell you exactly why you two would work — shared values, energy, humor, everything.",
            },
          ].map((c) => (
            <div
              key={c.num}
              className="bg-card-dark border border-card-border rounded-2xl p-8 hover:border-white/20 transition-colors"
            >
              <span className="font-display text-4xl font-bold text-rose">{c.num}</span>
              <h3 className="text-light-text font-semibold text-xl mt-5 mb-3">{c.title}</h3>
              <p className="text-light-text/50 leading-relaxed text-[15px]">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bold Statement */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-snug">
            Not a game.
            <br />
            Not a job.
            <br />
            Not a <span className="italic text-rose">gamble.</span>
          </h2>
          <p className="text-light-text/40 text-lg mt-8 max-w-lg mx-auto leading-relaxed">
            Crushky is different. Built on knowing you first,
            not rushing to a swipe.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-light-text/30 text-sm">
          &copy; 2026 Crushky. Built with love and AI.
        </p>
      </footer>
    </div>
  )
}
