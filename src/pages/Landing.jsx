import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    ref.current?.querySelectorAll('.sr').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return ref
}

const CHAT_MESSAGES = [
  { role: 'ai', text: "What does your ideal weekend look like?", delay: 0 },
  { role: 'user', text: "Coffee, bookstore, no plans honestly", delay: 1200 },
  { role: 'ai', text: "You value calm over chaos. What kind of person draws you in?", delay: 2800 },
  { role: 'user', text: "Someone curious and kind", delay: 4200 },
  { role: 'ai', text: "I know exactly who you should meet...", delay: 5600 },
]

const STATS = [
  { num: '10K+', label: 'Meaningful chats' },
  { num: '94%', label: 'Match satisfaction' },
  { num: '3 min', label: 'Avg. to first match' },
]

const TESTIMONIALS = [
  { name: 'Aarav, 24', city: 'Mumbai', text: "First time an app actually understood what I was looking for. No swiping fatigue." },
  { name: 'Meera, 23', city: 'Delhi', text: "The AI asked me things my friends never thought to ask. Found someone incredible." },
  { name: 'Karan, 25', city: 'Bangalore', text: "One conversation. That's all it took. We've been dating for 3 months now." },
]

const COMPARISONS = [
  { feature: 'Find matches', old: 'Swipe 200+ profiles', crushky: 'One honest conversation' },
  { feature: 'Know compatibility', old: 'Guess from photos', crushky: 'AI-analyzed personality match' },
  { feature: 'First message', old: '"Hey" and pray', crushky: 'Know exactly why you click' },
  { feature: 'Time to match', old: 'Hours of swiping', crushky: '3 minutes of talking' },
]

export default function Landing() {
  const navigate = useNavigate()
  const pageRef = useScrollReveal()
  const [visibleMsgs, setVisibleMsgs] = useState(0)
  const [showMatch, setShowMatch] = useState(false)

  // Auto-animate the phone chat
  useEffect(() => {
    const timers = CHAT_MESSAGES.map((msg, i) =>
      setTimeout(() => setVisibleMsgs(i + 1), msg.delay + 1000)
    )
    const matchTimer = setTimeout(() => setShowMatch(true), 7200)
    return () => { timers.forEach(clearTimeout); clearTimeout(matchTimer) }
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-cream text-dark-text grain">
      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-rose-soft/20 top-[10%] left-[5%] ad" />
      <div className="orb w-80 h-80 bg-amber-light/25 top-[40%] right-[5%] ad d4" />
      <div className="orb w-64 h-64 bg-rose-light/20 bottom-[15%] left-[20%] ad d6" />

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/70 backdrop-blur-xl border-b border-dark-text/5">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight">Crushky</span>
            <span className="bg-rose/10 text-rose text-[10px] font-semibold px-2.5 py-1 rounded-full border border-rose/20">MVP Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:block text-muted hover:text-dark-text text-sm font-medium transition-colors cursor-pointer">
              How it works
            </button>
            <button onClick={() => navigate('/signup')} className="bg-dark-green text-white text-sm font-medium px-5 py-2 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="min-h-screen flex items-center relative px-6 md:px-10 pt-16">
        <div className="max-w-[1100px] mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <p className="au text-rose/70 font-semibold text-[11px] tracking-[0.25em] uppercase mb-5">AI-Powered Dating</p>
            <h1 className="au d1 font-display text-[38px] sm:text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.08]">
              Talk to AI.
              <br />
              <span className="text-rose italic">Meet your person.</span>
            </h1>
            <p className="au d2 text-muted text-base md:text-lg mt-5 leading-relaxed max-w-md mx-auto lg:mx-0">
              No swiping. No awkward openers. Just one honest conversation, and we find the person who actually gets you.
            </p>
            <div className="au d3 flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
              <button onClick={() => navigate('/signup')} className="bg-dark-green text-white font-semibold px-7 py-3.5 rounded-full text-[15px] cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
                Find Your Match
              </button>
              <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="text-muted hover:text-dark-text font-medium px-7 py-3.5 rounded-full text-[15px] cursor-pointer border border-dark-text/8 hover:border-dark-text/20 transition-all">
                See how it works
              </button>
            </div>

            {/* Stats row */}
            <div className="au d5 flex gap-8 mt-10 justify-center lg:justify-start">
              {STATS.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="font-display text-2xl font-bold text-dark-text">{s.num}</p>
                  <p className="text-muted text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Phone Mockup */}
          <div className="au d4 hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-[280px] rounded-[32px] bg-white shadow-xl shadow-dark-text/8 p-2.5 af">
                <div className="rounded-[24px] overflow-hidden bg-cream">
                  {/* Status bar */}
                  <div className="bg-dark-green text-white/60 px-5 pt-2.5 pb-1.5 flex justify-between text-[10px]">
                    <span>9:41</span>
                    <div className="w-3.5 h-2 bg-white/30 rounded-sm" />
                  </div>
                  {/* Chat header */}
                  <div className="bg-dark-green/95 px-4 pb-3 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] text-white font-bold">C</div>
                    <div>
                      <p className="text-white text-[12px] font-semibold">Crushky AI</p>
                      <p className="text-white/50 text-[9px]">Getting to know you</p>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="px-3.5 pt-3 pb-5 space-y-2.5 min-h-[260px]">
                    {CHAT_MESSAGES.slice(0, visibleMsgs).map((msg, i) => (
                      <div key={i} className={`ai ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                        <div className={msg.role === 'ai'
                          ? 'bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]'
                          : 'bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%]'
                        }>
                          <p className={`text-[11px] leading-relaxed ${msg.role === 'ai' ? 'text-dark-text/80' : 'text-white'}`}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    {visibleMsgs > 0 && visibleMsgs < CHAT_MESSAGES.length && (
                      <div className="ai">
                        <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2 inline-block">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating match card - appears after conversation */}
              {showMatch && (
                <div className="absolute -bottom-3 -left-16 glass rounded-xl px-3.5 py-2.5 shadow-lg as w-52">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1622782045716-a05bcc4f5ae8?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-display text-sm font-bold">Neha, 24</p>
                      <p className="text-[10px] text-rose font-semibold">94% match</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating compatibility badge */}
              {showMatch && (
                <div className="absolute -top-2 -right-12 glass rounded-lg px-3 py-2 shadow-md as d2">
                  <p className="text-[10px] text-muted mb-1">Match found</p>
                  <p className="font-display text-lg font-bold text-rose leading-none">94%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how" className="py-24 md:py-32 px-6 md:px-10 bg-warm-cream relative">
        <div className="max-w-[960px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="sr text-rose/60 font-semibold text-[11px] tracking-[0.25em] uppercase mb-3">3 Simple Steps</p>
            <h2 className="sr font-display text-3xl md:text-[44px] font-bold leading-tight">How Crushky Works</h2>
            <p className="sr text-muted mt-3 max-w-md mx-auto">No profile building, no swiping. Just be yourself.</p>
          </div>

          {/* Steps as a visual flow */}
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-rose/20 via-amber/30 to-dark-green/20" />

            {[
              { num: "01", title: "Have a Conversation", body: "Chat with our AI for a few minutes. It asks the questions that actually matter. No surface-level stuff.", icon: "💬", color: "from-rose-light/50 to-rose-soft/30" },
              { num: "02", title: "We Find Your Match", body: "Our AI understands who you actually are, then finds someone who truly complements you.", icon: "✨", color: "from-amber-light/50 to-amber/20" },
              { num: "03", title: "Know Why You Click", body: "No guessing. We explain exactly why you two work. Values, energy, humor, everything.", icon: "💖", color: "from-rose-soft/40 to-amber-light/30" },
            ].map((c, i) => (
              <div key={c.num} className={`sr bg-white rounded-2xl p-7 border border-dark-text/5 hover-lift cursor-default relative`} style={{ transitionDelay: `${i * 150}ms` }}>
                {/* Step number circle */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center mb-5 mx-auto md:mx-0 relative z-10`}>
                  <span className="text-2xl">{c.icon}</span>
                </div>
                <h3 className="font-display text-lg font-bold mt-2 mb-2 text-center md:text-left">{c.title}</h3>
                <p className="text-muted text-sm leading-relaxed text-center md:text-left">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-cream relative">
        <div className="orb w-72 h-72 bg-rose-light/20 top-[10%] left-[5%] apg" />
        <div className="max-w-[800px] mx-auto relative z-20">
          <div className="text-center mb-12">
            <p className="sr text-amber/70 font-semibold text-[11px] tracking-[0.25em] uppercase mb-3">Why Crushky</p>
            <h2 className="sr font-display text-3xl md:text-[40px] font-bold leading-tight">
              Dating apps are <span className="italic text-rose">broken.</span>
              <br />We fixed them.
            </h2>
          </div>

          <div className="sr bg-white rounded-2xl border border-dark-text/5 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-cream/50 border-b border-dark-text/5">
              <div className="px-5 py-3">
                <span className="text-xs text-muted font-medium uppercase tracking-wider"></span>
              </div>
              <div className="px-5 py-3 text-center border-l border-dark-text/5">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Other Apps</span>
              </div>
              <div className="px-5 py-3 text-center border-l border-dark-text/5 bg-dark-green/5">
                <span className="text-xs text-dark-green font-bold uppercase tracking-wider">Crushky</span>
              </div>
            </div>
            {/* Rows */}
            {COMPARISONS.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < COMPARISONS.length - 1 ? 'border-b border-dark-text/5' : ''}`}>
                <div className="px-5 py-4">
                  <span className="text-sm font-medium text-dark-text">{row.feature}</span>
                </div>
                <div className="px-5 py-4 text-center border-l border-dark-text/5">
                  <span className="text-sm text-muted">{row.old}</span>
                </div>
                <div className="px-5 py-4 text-center border-l border-dark-text/5 bg-dark-green/3">
                  <span className="text-sm text-dark-green font-medium">{row.crushky}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bold Statement ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-warm-cream relative overflow-hidden">
        <div className="orb w-80 h-80 bg-rose-light/30 top-[10%] right-[10%] apg" />
        <div className="max-w-2xl mx-auto text-center relative z-20">
          <h2 className="sr font-display text-4xl sm:text-5xl md:text-[52px] font-bold leading-[1.12] text-dark-text">
            Not a game.
            <br />
            Not a job.
            <br />
            Not a <span className="italic text-rose">gamble.</span>
          </h2>
          <p className="sr text-muted text-base md:text-lg mt-7 max-w-md mx-auto leading-relaxed">
            Crushky is different. Built on knowing you first, not rushing to a swipe.
          </p>
          <button onClick={() => navigate('/signup')} className="sr mt-9 bg-rose hover:bg-rose/90 text-white font-semibold px-8 py-3.5 rounded-full text-[15px] cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5">
            Get Started Free
          </button>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-cream relative">
        <div className="max-w-[960px] mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="sr text-rose/60 font-semibold text-[11px] tracking-[0.25em] uppercase mb-3">Real Stories</p>
            <h2 className="sr font-display text-3xl md:text-[40px] font-bold leading-tight">People who found <span className="italic text-rose">their person</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="sr bg-white rounded-2xl p-6 border border-dark-text/5 hover-lift" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber text-sm">★</span>
                  ))}
                </div>
                <p className="text-dark-text/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-dark-text/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-soft to-amber flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Companion Preview ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-warm-cream relative">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <div>
            <p className="sr text-amber/70 font-semibold text-[11px] tracking-[0.25em] uppercase mb-3">AI Companion</p>
            <h2 className="sr font-display text-3xl md:text-[36px] font-bold leading-tight mb-5">
              Your personal <span className="italic text-rose">wingperson</span>
            </h2>
            <p className="sr text-muted leading-relaxed mb-6 text-[15px]">
              A persistent AI friend that remembers your conversations, gives you dating advice,
              helps you prep for dates, and grows with you.
            </p>
            <div className="sr space-y-3">
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
          <div className="sr flex justify-center">
            <div className="w-full max-w-[300px] bg-white rounded-2xl p-5 shadow-sm border border-dark-text/5 hover-lift">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-dark-text/5">
                <div className="w-9 h-9 rounded-full bg-dark-green flex items-center justify-center text-white text-sm font-bold">C</div>
                <div>
                  <p className="font-display text-sm font-bold">Crushky Companion</p>
                  <p className="text-[10px] text-muted">Your AI friend</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="bg-cream rounded-xl px-3.5 py-2.5">
                  <p className="text-[12px] text-dark-text/70 leading-relaxed">How did the date go last night? You were nervous</p>
                </div>
                <div className="bg-dark-green rounded-xl px-3.5 py-2.5 ml-auto max-w-[85%]">
                  <p className="text-[12px] text-white leading-relaxed">It went amazing! We talked for 3 hours</p>
                </div>
                <div className="bg-cream rounded-xl px-3.5 py-2.5">
                  <p className="text-[12px] text-dark-text/70 leading-relaxed">I had a feeling you two would click! What was the best part?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-gradient-to-br from-dark-green to-dark-green/90 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-rose/10 top-[-20%] left-[10%]" />
        <div className="orb w-72 h-72 bg-amber/10 bottom-[-20%] right-[10%]" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="sr font-display text-3xl md:text-[44px] font-bold leading-tight text-white">
            Ready to meet someone
            <br />who actually <span className="italic text-rose-soft">gets you</span>?
          </h2>
          <p className="sr text-white/60 mt-5 max-w-md mx-auto leading-relaxed">
            One conversation with our AI. That's all it takes to find your match. No swiping required.
          </p>
          <button onClick={() => navigate('/signup')} className="sr mt-8 bg-white text-dark-green font-semibold px-8 py-4 rounded-full text-[15px] cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Start Your Journey
          </button>
          <p className="sr text-white/30 text-xs mt-4">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-14 px-6 md:px-10 bg-cream border-t border-dark-text/5">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="text-center md:text-left">
              <span className="font-display text-xl font-bold">Crushky</span>
              <p className="text-muted text-sm mt-1">Talk to AI. Meet your person.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted hover:text-dark-text text-sm transition-colors">Instagram</a>
              <a href="#" className="text-muted hover:text-dark-text text-sm transition-colors">Twitter</a>
              <a href="#" className="text-muted hover:text-dark-text text-sm transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-dark-text/5 mt-8 pt-6 text-center">
            <p className="text-muted/50 text-xs">&copy; 2026 Crushky. Built with love and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
