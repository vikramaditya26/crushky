import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

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

export default function Landing() {
  const navigate = useNavigate()
  const pageRef = useScrollReveal()

  return (
    <div ref={pageRef} className="min-h-screen bg-cream text-dark-text grain">
      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-rose-soft/20 top-[10%] left-[5%] ad" />
      <div className="orb w-80 h-80 bg-amber-light/25 top-[40%] right-[5%] ad d4" />
      <div className="orb w-64 h-64 bg-rose-light/20 bottom-[15%] left-[20%] ad d6" />

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/70 backdrop-blur-xl border-b border-dark-text/5">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">Crushky</span>
          <button onClick={() => navigate('/signup')} className="bg-dark-green text-white text-sm font-medium px-5 py-2 rounded-full cursor-pointer hover:bg-dark-green/90 transition-all hover:shadow-md">
            Get Started
          </button>
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
                How it works ↓
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="au d4 hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-[270px] rounded-[32px] bg-white shadow-xl shadow-dark-text/8 p-2.5 af">
                <div className="rounded-[24px] overflow-hidden bg-cream">
                  <div className="bg-dark-green text-white/60 px-5 pt-2.5 pb-1.5 flex justify-between text-[10px]">
                    <span>9:41</span>
                    <div className="w-3.5 h-2 bg-white/30 rounded-sm" />
                  </div>
                  <div className="px-3.5 pt-3 pb-5 space-y-2.5">
                    <div className="text-center mb-2">
                      <p className="font-display text-[13px] font-bold">Crushky AI</p>
                      <p className="text-[9px] text-muted">Getting to know you</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">What does your ideal weekend look like? ✨</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 ml-auto max-w-[80%]">
                      <p className="text-[11px] text-white leading-relaxed">Long walks, good coffee, maybe a bookstore...</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">You value calm over chaos. What kind of person makes you feel alive?</p>
                    </div>
                    <div className="bg-dark-green rounded-2xl rounded-br-sm px-3 py-2 ml-auto max-w-[75%]">
                      <p className="text-[11px] text-white leading-relaxed">Someone curious and kind</p>
                    </div>
                    <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[11px] text-dark-text/80 leading-relaxed">I know exactly who you should meet... 🌟</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating match card */}
              <div className="absolute -bottom-3 -left-16 glass rounded-xl px-3.5 py-2.5 shadow-lg au d6 w-52">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full object-cover" />
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
      <section id="how" className="py-24 md:py-32 px-6 md:px-10 bg-warm-cream relative">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="sr text-rose/60 font-semibold text-[11px] tracking-[0.25em] uppercase mb-3">The Process</p>
            <h2 className="sr font-display text-3xl md:text-[44px] font-bold leading-tight">How Crushky Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Have a Conversation", body: "Chat with our AI for a few minutes. It asks questions your best friend would. The real ones.", icon: "💬" },
              { num: "02", title: "We Find Your Match", body: "Our AI understands who you actually are, then finds someone who truly complements you.", icon: "✨" },
              { num: "03", title: "Know Why You Click", body: "No guessing. We explain exactly why you two work. Values, energy, humor, everything.", icon: "💖" },
            ].map((c, i) => (
              <div key={c.num} className={`sr bg-white rounded-2xl p-7 border border-dark-text/5 hover-lift cursor-default`} style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="text-2xl block mb-4">{c.icon}</span>
                <span className="font-display text-[36px] font-bold text-dark-text/6 leading-none">{c.num}</span>
                <h3 className="font-display text-lg font-bold mt-2 mb-2">{c.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bold Statement (warm, not dark) ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-cream relative">
        <div className="orb w-80 h-80 bg-rose-light/30 top-[10%] right-[10%] apg" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
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

      {/* ─── AI Companion Preview ─── */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-warm-cream relative">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
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
                  <p className="text-[12px] text-dark-text/70 leading-relaxed">How did the date go last night? You were nervous 😊</p>
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

      {/* ─── Footer (warm, not dark) ─── */}
      <footer className="py-14 px-6 md:px-10 bg-cream border-t border-dark-text/5">
        <div className="max-w-[1100px] mx-auto">
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
