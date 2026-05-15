import NavBar from '../components/NavBar'

export default function Companion() {
  return (
    <div className="min-h-screen bg-dark">
      <NavBar />

      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-card-dark border border-card-border rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">&#x1f512;</span>
          </div>
          <p className="text-amber font-medium text-sm tracking-widest uppercase mb-4">
            Coming Soon &mdash; Premium
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-light-text mb-4">
            AI Companion
          </h1>
          <p className="text-light-text/60 text-lg leading-relaxed mb-8">
            A persistent AI friend that remembers your conversations,
            gives you dating advice, and helps you grow between matches.
            Think of it as your personal wingperson who never sleeps.
          </p>
          <div className="bg-card-dark border border-card-border rounded-2xl p-6 text-left space-y-4">
            {[
              "Remembers everything you've told it",
              "Gives personalized dating advice",
              "Helps you prep for dates",
              "Available 24/7 — no judgment, ever",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="text-rose">&#x2713;</span>
                <span className="text-light-text/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <p className="text-light-text/30 text-sm mt-6">
            Launching at &#x20b9;299/month
          </p>
        </div>
      </div>
    </div>
  )
}
