import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream text-dark-text">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-dark-text/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">Crushky</span>
          <button
            onClick={() => navigate('/signup')}
            className="bg-dark-green text-white text-sm font-medium px-5 py-2 rounded-full cursor-pointer hover:bg-dark-green/90 transition-colors"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="min-h-screen flex items-center relative overflow-hidden px-6 md:px-12 pt-16">
        {/* subtle blobs */}
        <div className="absolute inset-0 blob-gradient pointer-events-none" />
        <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-rose/5 rounded-full blur-3xl anim-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-amber/5 rounded-full blur-3xl anim-pulse d3" />

        <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Text */}
          <div className="text-center lg:text-left">
            <p className="anim-up text-amber/80 font-semibold text-[11px] tracking-[0.2em] uppercase mb-5">
              AI-Powered Dating
            </p>
            <h1 className="anim-up d1 font-display text-[42px] sm:text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.08]">
              Talk to AI.
              <br />
              <span className="text-rose italic">Meet your person.</span>
            </h1>
            <p className="anim-up d2 text-dark-text/50 text-base md:text-lg mt-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              No swiping. No awkward openers. Just one honest conversation
              with our AI, and we'll find the person who actually gets you.
            </p>
            <div className="anim-up d3 flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="bg-dark-green text-white font-semibold px-7 py-3.5 rounded-full text-[15px] cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg"
              >
                Find Your Match
              </button>
              <button
                onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-dark-text/50 hover:text-dark-text font-medium px-7 py-3.5 rounded-full text-[15px] cursor-pointer border border-dark-text/10 hover:border-dark-text/20 transition-colors"
              >
                How it works &darr;
              </button>
            </div>
          </div>

          {/* Phone mockup — desktop only */}
          <div className="anim-up d4 hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-[280px] rounded-[32px] bg-dark shadow-2xl shadow-dark/15 p-2.5 anim-float">
                <div className="rounded-[24px] overflow-hidden bg-cream">
                  {/* fake status bar */}
                  <div className="bg-dark text-white/60 px-5 pt-2.5 pb-1.5 flex justify-between text-[10px]">
                    <span>9:41</span>
                    <div className="flex gap-0.5">
                      <div className="w-3.5 h-2 bg-white/40 rounded-sm" />
                    </div>
                  </div>
                  {/* chat */}
                  <div className="px-3.5 pt-3 pb-5 space-y-2.5">
                    <div className="text-center mb-2">
                      <p className="font-display text-[13px] font-bold">Crushky AI</p>
                      <p className="text-[9px] text-muted">Getting to know you</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">Hey! What does your ideal weekend look like? ✨</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 ml-auto max-w-[80%]">
                      <p className="text-[11px] text-white leading-relaxed">Long walks, good coffee, maybe a bookstore...</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">I love that! You sound like someone who values calm over chaos. What kind of person makes you feel most alive?</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 ml-auto max-w-[75%]">
                      <p className="text-[11px] text-white leading-relaxed">Someone curious and kind</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">I think I know exactly who you should meet... 🌟</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* floating match card */}
              <div className="absolute -bottom-4 -left-14 glass-card rounded-xl px-3.5 py-2.5 shadow-lg anim-up d6 w-48">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold">Neha, 24</p>
                    <p className="text-[10px] text-rose font-semibold">94% match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how" className="py-24 md:py-32 px-6 md:px-12 bg-warm-cream">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose font-semibold text-[11px] tracking-[0.2em] uppercase mb-3">The Process</p>
            <h2 className="font-display text-3xl md:text-[42px] font-bold leading-tight">
              How Crushky Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Have a Conversation", body: "Chat with our AI for a few minutes. It asks the questions your best friend would. The real ones, not the generic ones.", icon: "💬" },
              { num: "02", title: "We Find Your Match", body: "Our AI understands who you actually are. It finds someone who complements you, not just someone who looks good on paper.", icon: "✨" },
              { num: "03", title: "Know Why You Click", body: "No guessing. We tell you exactly why you two would work. Shared values, energy, humor, everything that matters.", icon: "💖" },
            ].map((c) => (
              <div
                key={c.num}
                className="bg-white rounded-2xl p-8 border border-dark-text/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-3xl mb-5 block">{c.icon}</span>
                <span className="font-display text-[40px] font-bold text-dark-text/8 leading-none">{c.num}</span>
                <h3 className="font-display text-lg font-bold mt-3 mb-3">{c.title}</h3>
                <p className="text-muted text-[15px] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bold Statement ─── */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-dark text-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber/8 rounded-full blur-[80px]" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.15]">
            Not a game.
            <br />
            Not a job.
            <br />
            Not a <span className="italic text-rose">gamble.</span>
          </h2>
          <p className="text-white/35 text-base md:text-lg mt-8 max-w-md mx-auto leading-relaxed">
            Crushky is different. Built on knowing you first,
            not rushing to a swipe.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-10 bg-rose hover:bg-rose/90 text-white font-semibold px-8 py-3.5 rounded-full text-[15px] cursor-pointer transition-all hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* ─── AI Companion Preview ─── */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-cream">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-amber/80 font-semibold text-[11px] tracking-[0.2em] uppercase mb-3">AI Companion</p>
            <h2 className="font-display text-3xl md:text-[38px] font-bold leading-tight mb-5">
              Your personal <span className="italic text-rose">wingperson</span>
            </h2>
            <p className="text-muted leading-relaxed mb-6 text-[15px]">
              A persistent AI friend that remembers your conversations, gives you dating advice,
              helps you prep for dates, and grows with you. Available 24/7, no judgment.
            </p>
            <div className="space-y-3">
              {['Remembers everything about you', 'Personalized dating advice', 'Helps you prep before dates', 'Available 24/7'].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-dark-green/10 flex items-center justify-center shrink-0">
                    <span className="text-dark-green text-[11px]">✓</span>
                  </div>
                  <span className="text-dark-text/60 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-[320px] bg-white rounded-2xl p-5 shadow-sm border border-dark-text/5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-text/5">
                <div className="w-9 h-9 rounded-full bg-dark-green flex items-center justify-center text-white text-sm font-bold">C</div>
                <div>
                  <p className="font-display text-sm font-bold">Crushky Companion</p>
                  <p className="text-[10px] text-muted">Your AI friend</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-cream rounded-xl px-3.5 py-2.5">
                  <p className="text-[12px] text-dark-text/70 leading-relaxed">Hey! How did the date go last night? You were nervous about it earlier 😊</p>
                </div>
                <div className="bg-dark-green rounded-xl px-3.5 py-2.5 ml-auto max-w-[85%]">
                  <p className="text-[12px] text-white leading-relaxed">It went amazing actually! We talked for 3 hours</p>
                </div>
                <div className="bg-cream rounded-xl px-3.5 py-2.5">
                  <p className="text-[12px] text-dark-text/70 leading-relaxed">That's incredible! I had a feeling you two would click. What was the best part?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-dark text-white py-14 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="text-center md:text-left">
              <span className="font-display text-xl font-bold">Crushky</span>
              <p className="text-white/25 text-sm mt-1">Talk to AI. Meet your person.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white/30 hover:text-white text-sm transition-colors">Instagram</a>
              <a href="#" className="text-white/30 hover:text-white text-sm transition-colors">Twitter</a>
              <a href="#" className="text-white/30 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/8 mt-8 pt-6 text-center">
            <p className="text-white/15 text-xs">&copy; 2026 Crushky. Built with love and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
