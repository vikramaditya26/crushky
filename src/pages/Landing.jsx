import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />

      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-amber/30 bg-amber/10 px-5 py-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber">
            Hello World - Vercel deployment check
          </p>
        </div>
        <p className="text-amber font-medium text-sm tracking-widest uppercase mb-6">
          AI-Powered Dating
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-light-text leading-tight max-w-4xl">
          Talk to AI.<br />
          <span className="text-rose">Meet your person.</span>
        </h1>
        <p className="text-light-text/60 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
          No swiping. No awkward openers. Just one honest conversation with our AI,
          and we'll find the person who actually gets you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => navigate('/signup')}
            className="bg-rose hover:bg-rose/90 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors cursor-pointer"
          >
            Find Your Match
          </button>
          <button
            onClick={() => navigate('/companion')}
            className="border border-card-border text-light-text/80 hover:text-light-text font-medium px-8 py-4 rounded-full text-lg transition-colors cursor-pointer"
          >
            AI Companion &rarr;
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-light-text mb-16">
          How Crushky Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Have a Conversation",
              desc: "Chat with our AI for 10 minutes. It asks the questions your best friend would — the real ones.",
            },
            {
              step: "02",
              title: "We Find Your Match",
              desc: "Our AI understands who you actually are, not just what you look like. It finds someone who complements you.",
            },
            {
              step: "03",
              title: "Know Why You Click",
              desc: "No guessing. We tell you exactly why you two would work — shared values, energy, humor, everything.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card-dark border border-card-border rounded-2xl p-8 text-left"
            >
              <span className="text-rose font-display text-4xl font-bold">{item.step}</span>
              <h3 className="text-light-text font-semibold text-xl mt-4 mb-3">{item.title}</h3>
              <p className="text-light-text/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-card-border py-8 text-center">
        <p className="text-light-text/40 text-sm">
          &copy; 2026 Crushky. Built with love and AI.
        </p>
      </footer>
    </div>
  )
}
