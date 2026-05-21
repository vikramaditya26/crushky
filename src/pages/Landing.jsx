import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.classList.remove('opacity-0')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    const els = ref.current?.querySelectorAll('.reveal')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function Landing() {
  const navigate = useNavigate()
  const sectionRef = useScrollReveal()

  return (
    <div ref={sectionRef} className="min-h-screen bg-cream text-dark-text overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-dark-text/5">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-dark-text">
            Crushky
          </span>
          <button
            onClick={() => navigate('/signup')}
            className="bg-dark-green hover:bg-dark-green/90 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all cursor-pointer hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6 md:px-10 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 blob-gradient pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-rose/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl animate-pulse-soft delay-300" />

        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <p className="animate-fade-in-up text-amber font-semibold text-xs tracking-[0.2em] uppercase mb-6">
              AI-Powered Dating
            </p>
            <h1 className="animate-fade-in-up delay-100 opacity-0 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08]">
              Talk to AI.
              <br />
              <span className="text-rose italic">Meet your person.</span>
            </h1>
            <p className="animate-fade-in-up delay-200 opacity-0 text-dark-text/50 text-base sm:text-lg max-w-md mt-6 leading-relaxed mx-auto lg:mx-0">
              No swiping. No awkward openers. Just one honest conversation
              with our AI, and we'll find the person who actually gets you.
            </p>
            <div className="animate-fade-in-up delay-300 opacity-0 flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="bg-dark-green hover:bg-dark-green/90 text-white font-semibold px-8 py-4 rounded-full text-base transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
              >
                Find Your Match
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-dark-text/60 hover:text-dark-text font-medium px-8 py-4 rounded-full text-base transition-colors cursor-pointer border border-dark-text/10 hover:border-dark-text/25"
              >
                How it works &darr;
              </button>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="animate-fade-in-up delay-400 opacity-0 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[260px] sm:w-[280px] md:w-[300px] rounded-[36px] bg-dark shadow-2xl shadow-dark/20 p-3 animate-float">
                <div className="rounded-[28px] overflow-hidden bg-cream relative">
                  {/* Status bar */}
                  <div className="bg-dark text-white px-5 pt-3 pb-2 flex justify-between text-[10px] font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <span>&#9679;&#9679;&#9679;</span>
                    </div>
                  </div>
                  {/* Chat preview */}
                  <div className="bg-cream px-4 pt-4 pb-6 space-y-3">
                    <div className="text-center">
                      <p className="font-display text-sm font-bold text-dark-text">Crushky AI</p>
                      <p className="text-[9px] text-muted mt-0.5">Getting to know you</p>
                    </div>
                    <div className="bg-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-[11px] text-dark-text leading-relaxed">Hey! What does your ideal weekend look like? &#x2728;</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] ml-auto">
                      <p className="text-[11px] text-white leading-relaxed">Long walks, good coffee, maybe a bookstore...</p>
                    </div>
                    <div className="bg-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-[11px] text-dark-text leading-relaxed">I love that! You sound like someone who values calm over chaos. What kind of person makes you feel most alive?</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 max-w-[75%] ml-auto">
                      <p className="text-[11px] text-white leading-relaxed">Someone curious and kind</p>
                    </div>
                    <div className="bg-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                      <p className="text-[11px] text-dark-text leading-relaxed">I think I know exactly who you should meet... &#x1F31F;</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating match card */}
              <div className="absolute -bottom-6 -left-12 sm:-left-16 glass-card rounded-xl p-3 shadow-lg animate-fade-in delay-600 opacity-0 w-44 sm:w-48">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-soft to-amber overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-dark-text">Neha, 24</p>
                    <p className="text-[10px] text-rose font-medium">94% match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 md:px-10 bg-warm-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="reveal opacity-0 text-rose font-semibold text-xs tracking-[0.2em] uppercase mb-4">The Process</p>
            <h2 className="reveal opacity-0 font-display text-3xl sm:text-4xl md:text-5xl font-bold">
              How Crushky Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                num: "01",
                title: "Have a Conversation",
                body: "Chat with our AI for a few minutes. It asks the questions your best friend would. The real ones, not the generic ones.",
                icon: "&#128172;",
              },
              {
                num: "02",
                title: "We Find Your Match",
                body: "Our AI understands who you actually are. It finds someone who complements you, not just someone who looks good on paper.",
                icon: "&#10024;",
              },
              {
                num: "03",
                title: "Know Why You Click",
                body: "No guessing. We tell you exactly why you two would work. Shared values, energy, humor, everything that matters.",
                icon: "&#128150;",
              },
            ].map((c, i) => (
              <div
                key={c.num}
                className={`reveal opacity-0 bg-white rounded-2xl p-7 md:p-8 border border-dark-text/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${i === 1 ? 'sm:translate-y-4' : ''}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-2xl mb-5" dangerouslySetInnerHTML={{ __html: c.icon }} />
                <span className="font-display text-3xl font-bold text-rose/30">{c.num}</span>
                <h3 className="text-dark-text font-semibold text-lg mt-2 mb-3">{c.title}</h3>
                <p className="text-muted leading-relaxed text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bold Statement */}
      <section className="py-20 md:py-32 px-6 md:px-10 bg-dark text-light-text relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber/8 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="reveal opacity-0 font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-snug">
            Not a game.
            <br />
            Not a job.
            <br />
            Not a <span className="italic text-rose">gamble.</span>
          </h2>
          <p className="reveal opacity-0 text-light-text/40 text-base md:text-lg mt-8 max-w-lg mx-auto leading-relaxed">
            Crushky is different. Built on knowing you first,
            not rushing to a swipe.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="reveal opacity-0 mt-10 bg-rose hover:bg-rose/90 text-white font-semibold px-8 py-4 rounded-full text-base transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features preview */}
      <section className="py-20 md:py-32 px-6 md:px-10 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="reveal opacity-0 text-amber font-semibold text-xs tracking-[0.2em] uppercase mb-4">AI Companion</p>
              <h2 className="reveal opacity-0 font-display text-3xl sm:text-4xl font-bold mb-6">
                Your personal <span className="italic text-rose">wingperson</span>
              </h2>
              <p className="reveal opacity-0 text-muted leading-relaxed mb-6">
                A persistent AI friend that remembers your conversations, gives you dating advice,
                helps you prep for dates, and grows with you. Available 24/7, no judgment.
              </p>
              <div className="reveal opacity-0 space-y-3">
                {['Remembers everything about you', 'Personalized dating advice', 'Helps you prep before dates', 'Available 24/7'].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-dark-green/10 flex items-center justify-center">
                      <span className="text-dark-green text-xs">&#10003;</span>
                    </div>
                    <span className="text-dark-text/70 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal opacity-0 flex justify-center">
              <div className="w-full max-w-xs glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-green to-dark-green/70 flex items-center justify-center text-white text-sm">C</div>
                  <div>
                    <p className="font-display text-sm font-bold">Crushky Companion</p>
                    <p className="text-[10px] text-muted">Your AI friend</p>
                  </div>
                </div>
                <div className="bg-cream rounded-xl px-4 py-3">
                  <p className="text-xs text-dark-text/80 leading-relaxed">Hey! How did the date go last night? You were nervous about it earlier &#x1F60A;</p>
                </div>
                <div className="bg-dark-green rounded-xl px-4 py-3 ml-auto max-w-[85%]">
                  <p className="text-xs text-white leading-relaxed">It went amazing actually! We talked for 3 hours</p>
                </div>
                <div className="bg-cream rounded-xl px-4 py-3">
                  <p className="text-xs text-dark-text/80 leading-relaxed">That's incredible! I had a feeling you two would click. What was the best part?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light-text py-12 md:py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-display text-2xl font-bold">Crushky</span>
              <p className="text-light-text/30 text-sm mt-2">Talk to AI. Meet your person.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-light-text/40 hover:text-light-text text-sm transition-colors">Instagram</a>
              <a href="#" className="text-light-text/40 hover:text-light-text text-sm transition-colors">Twitter</a>
              <a href="#" className="text-light-text/40 hover:text-light-text text-sm transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-light-text/20 text-xs">
              &copy; 2026 Crushky. Built with love and AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
