import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Film grain ────────────────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
function Grain({ opacity = 0.055 }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0"
      style={{ backgroundImage: GRAIN, backgroundSize: '128px', opacity }} />
  )
}

// ── Colours ───────────────────────────────────────────────
const CREAM  = '#EDE8E1'
const FOREST = '#1E2E1E'
const NAVY   = '#0D1520'
const ROSE   = '#C94B4B'
const INK    = '#1A1A1A'

// ── Hero photos (portraits from confirmed Unsplash IDs) ───
const HERO_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face,top',
    rotate: -6, top: '6%', right: '3%', w: 200, h: 265, delay: 0.3, speed: 0.55,
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=280&h=360&fit=crop&crop=face,top',
    rotate: 5, top: '30%', right: '21%', w: 178, h: 235, delay: 0.5, speed: 0.85,
  },
  {
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=400&fit=crop&crop=face,top',
    rotate: -2, top: '54%', right: '4%', w: 192, h: 255, delay: 0.7, speed: 0.70,
  },
]

// ── Scatter photos ────────────────────────────────────────
const SCATTER = [
  { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=380&fit=crop&crop=face,top', rotate: -5, style: { top: 0, left: '0%', width: 210, height: 275 }, delay: 0 },
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=280&h=360&fit=crop&crop=face,top', rotate: 4, style: { top: '8%', left: '19%', width: 185, height: 240 }, delay: 0.1 },
  { src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=280&h=360&fit=crop&crop=face,top', rotate: -2, style: { top: '3%', left: '38%', width: 200, height: 265 }, delay: 0.2 },
  { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=280&h=360&fit=crop&crop=face,top', rotate: 7, style: { top: 0, right: '16%', width: 180, height: 238 }, delay: 0.15 },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=220&fit=crop', rotate: -4, style: { bottom: '5%', left: '12%', width: 240, height: 170 }, delay: 0.25 },
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=280&h=360&fit=crop', rotate: 3, style: { top: '12%', right: '0%', width: 192, height: 256 }, delay: 0.3 },
]

// ── Marquee items ─────────────────────────────────────────
const TICKER = ['Talk to AI', '✦', 'No swiping', '✦', 'Know why you click', '✦', 'Meet your person', '✦', '3 minutes to match', '✦', 'Depth over photos', '✦']

// ── Stats (sticker style) ─────────────────────────────────
const STATS = [
  { num: '10K+', label: 'Conversations started', bg: '#FDE68A', rotate: -3 },
  { num: '94%',  label: 'Match satisfaction',    bg: '#FBCFE8', rotate: 2  },
  { num: '3 min',label: 'Avg. to first match',   bg: '#BAE6FD', rotate: -1 },
]

// ── Testimonials ──────────────────────────────────────────
const TESTS = [
  { name: 'Aarav S.', loc: 'Mumbai',    init: 'A', color: '#2563EB', msg: "First time an app actually understood what I was looking for. Matched in 3 minutes — been dating for 2 months now." },
  { name: 'Meera K.', loc: 'Bangalore', init: 'M', color: '#7C3AED', msg: "The AI asked things my friends never thought to ask. She was exactly who I didn't know I was looking for." },
  { name: 'Karan T.', loc: 'Delhi',     init: 'K', color: '#059669', msg: "One conversation. No cringe openers. Just a match that made total sense." },
]

// ── Comparison ────────────────────────────────────────────
const CMP = [
  { f: 'Find matches',    old: 'Swipe 200+ profiles',   new: 'One honest conversation'     },
  { f: 'Compatibility',  old: 'Guess from photos',      new: 'AI-analyzed personality'     },
  { f: 'First message',  old: '"Hey" and pray',         new: 'Know exactly why you click'  },
  { f: 'Time to match',  old: 'Hours of swiping',       new: '3 minutes of talking'        },
]

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function Marquee() {
  const items = [...TICKER, ...TICKER, ...TICKER]
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <motion.div
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {items.map((t, i) => (
          <span key={i} className="font-display text-sm font-medium"
            style={{ padding: '0 1.2rem', opacity: t === '✦' ? 0.45 : 0.9 }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function HeroPhoto({ src, rotate, top, right, w, h, delay, speed }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, -90 * speed])
  return (
    <motion.div
      style={{ position: 'absolute', top, right, rotate: `${rotate}deg`, y, zIndex: 2 }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <img src={src} alt="" loading="eager"
        style={{ width: w, height: h, objectFit: 'cover' }}
        className="rounded-2xl shadow-2xl" />
    </motion.div>
  )
}

function ScatterImg({ src, rotate, style, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', rotate: `${rotate}deg`, ...style }}
      initial={{ opacity: 0, y: 50, rotate: `${rotate * 0.4}deg`, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: `${rotate}deg`, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <img src={src} alt="" style={{ width: style.width, height: style.height, objectFit: 'cover' }}
        className="rounded-2xl shadow-xl" />
    </motion.div>
  )
}

function FadeIn({ children, delay = 0, y = 28, className = '', style = {} }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 32))
    return unsub
  }, [scrollY])

  return (
    <div style={{ background: CREAM, color: INK, overflowX: 'hidden' }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(237,232,225,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <motion.span className="font-display text-xl font-bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Crushky
          </motion.span>
          <motion.button onClick={() => navigate('/signup')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: FOREST, color: 'white', fontSize: 14, fontWeight: 600, padding: '10px 20px', borderRadius: 100 }}>
            Get started →
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: CREAM }}>
        <Grain opacity={0.065} />
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-16 w-full relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center"
            style={{ minHeight: 'calc(100vh - 80px)' }}>

            {/* Text */}
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: 11, letterSpacing: '0.22em', color: '#9E9A93', fontWeight: 700,
                  textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Bangalore · Delhi · Mumbai
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold"
                style={{ fontSize: 'clamp(38px, 6.5vw, 80px)', lineHeight: 1.04, color: INK }}>
                The app that{' '}
                <em style={{ color: ROSE, fontStyle: 'italic' }}>listens</em>
                <br />
                before it matches.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: '#666', fontSize: 17, lineHeight: 1.72, marginTop: '1.5rem', maxWidth: 480 }}>
                No photos. No swiping. One real conversation with our AI, and we find the person who actually gets you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65 }}
                style={{ marginTop: '2.5rem' }}>
                <button onClick={() => navigate('/signup')}
                  className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                  style={{ background: FOREST, color: 'white', fontSize: 15, fontWeight: 700,
                    padding: '14px 32px', borderRadius: 100, display: 'inline-block' }}>
                  Start talking →
                </button>
                <p style={{ color: '#aaa', fontSize: 12, marginTop: 10, marginLeft: 4 }}>
                  Free forever · Takes 2 minutes
                </p>
              </motion.div>
            </div>

            {/* Scattered photos */}
            <div className="hidden lg:block relative" style={{ height: '82vh' }}>
              {HERO_PHOTOS.map((p, i) => <HeroPhoto key={i} {...p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ticker ───────────────────────── */}
      <div style={{ background: FOREST, color: CREAM, padding: '13px 0', overflow: 'hidden' }}>
        <Marquee />
      </div>

      {/* ── Statement (scroll-reveal lines) ──────── */}
      <section className="relative" style={{ background: CREAM, padding: '110px 24px 100px' }}>
        <Grain opacity={0.055} />
        <div className="max-w-5xl mx-auto relative z-10">
          {[
            { text: 'While you\'re at work.', delay: 0, align: 'left', italic: false },
            { text: 'At the gym.', delay: 0.18, align: 'left', italic: false },
            { text: 'Living your actual life —', delay: 0.33, align: 'left', italic: false },
          ].map((l, i) => (
            <FadeIn key={i} delay={l.delay} y={45}>
              <p className="font-display font-bold"
                style={{ fontSize: 'clamp(30px, 5.5vw, 62px)', color: INK, lineHeight: 1.12,
                  textAlign: l.align, marginBottom: '0.18em' }}>
                {l.text}
              </p>
            </FadeIn>
          ))}
          <FadeIn delay={0.5} y={45}>
            <p className="font-display font-bold italic"
              style={{ fontSize: 'clamp(30px, 5.5vw, 62px)', color: ROSE, lineHeight: 1.12,
                textAlign: 'right', marginBottom: '2.5rem' }}>
              Crushky is finding your person.
            </p>
          </FadeIn>
          <FadeIn delay={0.65}>
            <p style={{ color: '#777', fontSize: 17, lineHeight: 1.75, maxWidth: 520, margin: '0 auto',
              textAlign: 'center' }}>
              Not matching keywords. Testing for resonance. Finding the people who think like you, laugh like you, protect their energy the same way you do.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats (sticker badges, dark navy) ────── */}
      <section className="relative overflow-hidden" style={{ background: NAVY, padding: '100px 24px' }}>
        <Grain opacity={0.04} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: 'white', marginBottom: '3.5rem' }}>
              Real matches.{' '}
              <em style={{ color: '#FDA4AF', fontStyle: 'italic' }}>Delivered.</em>
            </h2>
          </FadeIn>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
            justifyContent: 'center', alignItems: 'center' }}>
            {STATS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, rotate: s.rotate * 0.5, y: 40, scale: 0.82 }}
                whileInView={{ opacity: 1, rotate: s.rotate, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: s.bg, padding: '1.5rem 2rem', borderRadius: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)', textAlign: 'center', minWidth: 182 }}>
                <p className="font-display font-bold"
                  style={{ fontSize: '3rem', color: INK, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 13, color: INK, opacity: 0.65, marginTop: '0.4rem', fontWeight: 600 }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo scatter ────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: CREAM, padding: '100px 24px 180px' }}>
        <Grain opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: INK, marginBottom: '4rem' }}>
              Then you only meet{' '}
              <em style={{ color: ROSE }}>the ones worth meeting.</em>
            </h2>
          </FadeIn>

          {/* Desktop: scattered absolute */}
          <div className="hidden lg:block relative" style={{ height: 460 }}>
            {SCATTER.map((p, i) => <ScatterImg key={i} {...p} />)}
          </div>

          {/* Mobile: simple 2-col grid */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            {SCATTER.slice(0, 4).map((p, i) => (
              <motion.img key={i} src={p.src} alt=""
                className="rounded-2xl object-cover w-full"
                style={{ height: 200 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section className="relative" style={{ background: FOREST, padding: '100px 24px' }}>
        <Grain opacity={0.04} />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(237,232,225,0.38)',
              fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.75rem' }}>
              3 Steps
            </p>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: CREAM, marginBottom: '3.5rem' }}>
              How Crushky works
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Have a conversation', body: 'Talk with our AI for a few minutes. It asks the questions that actually matter — not surface-level stuff.', icon: '💬' },
              { n: '02', title: 'We find your match',  body: 'Our AI understands who you actually are, then finds someone who truly complements you.', icon: '✦' },
              { n: '03', title: 'Know why you click',  body: 'We tell you exactly why you two work. Values, energy, humor — everything.', icon: '💖' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.14}>
                <div style={{ border: '1px solid rgba(237,232,225,0.1)', borderRadius: '1.5rem',
                  padding: '2rem', background: 'rgba(237,232,225,0.04)' }}>
                  <p className="font-display font-bold"
                    style={{ fontSize: '3rem', color: 'rgba(237,232,225,0.1)', marginBottom: '0.5rem' }}>
                    {step.n}
                  </p>
                  <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.icon}</p>
                  <h3 className="font-display font-bold"
                    style={{ fontSize: '1.2rem', color: CREAM, marginBottom: '0.7rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'rgba(237,232,225,0.5)', fontSize: 15, lineHeight: 1.72 }}>
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (iMessage style) ────────── */}
      <section className="relative" style={{ background: NAVY, padding: '100px 24px' }}>
        <Grain opacity={0.04} />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'white', marginBottom: '3rem' }}>
              People who found their{' '}
              <em style={{ color: '#FDA4AF' }}>person</em>
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.13}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1.5rem', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                  {/* iMessage bubble */}
                  <div style={{ background: 'rgba(255,255,255,0.09)', borderRadius: '1rem 1rem 1rem 0.3rem',
                    padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.65 }}>
                      "{t.msg}"
                    </p>
                  </div>
                  {/* User row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {t.init}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{t.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{t.loc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────── */}
      <section className="relative" style={{ background: CREAM, padding: '100px 24px' }}>
        <Grain opacity={0.055} />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <p className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#aaa', marginBottom: '0.2rem' }}>
              tired of tinder &amp; hinge?
            </p>
            <p className="font-display font-bold italic text-center"
              style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: ROSE, marginBottom: '3rem' }}>
              Crushky is for you.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden',
              boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '12px 20px' }} />
                {['Other apps', 'Crushky'].map((h, i) => (
                  <div key={i} style={{ padding: '12px 20px', textAlign: 'center',
                    borderLeft: '1px solid rgba(0,0,0,0.06)',
                    background: i === 1 ? 'rgba(30,46,30,0.04)' : 'transparent' }}>
                    <span style={{ fontSize: 11, color: i === 1 ? FOREST : '#aaa', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
                  </div>
                ))}
              </div>
              {CMP.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  borderBottom: i < CMP.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <div style={{ padding: '15px 20px' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{row.f}</span>
                  </div>
                  <div style={{ padding: '15px 20px', textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 13, color: '#aaa' }}>{row.old}</span>
                  </div>
                  <div style={{ padding: '15px 20px', textAlign: 'center',
                    borderLeft: '1px solid rgba(0,0,0,0.06)', background: 'rgba(30,46,30,0.03)' }}>
                    <span style={{ fontSize: 13, color: FOREST, fontWeight: 600 }}>{row.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: FOREST, padding: '140px 24px' }}>
        <Grain opacity={0.04} />
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 80%, ${ROSE}15 0%, transparent 65%)` }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn y={40}>
            <h2 className="font-display font-bold"
              style={{ fontSize: 'clamp(34px, 6vw, 68px)', color: CREAM, lineHeight: 1.08, marginBottom: '1.5rem' }}>
              The app that{' '}
              <em style={{ color: '#FDA4AF' }}>listens</em>
              <br />
              before it matches.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ color: 'rgba(237,232,225,0.5)', fontSize: 17, lineHeight: 1.72, marginBottom: '2.5rem' }}>
              People spent time telling Crushky who they really are.
              <br />
              Your match gets to meet every single one of them.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: CREAM, color: FOREST, fontSize: 16, fontWeight: 700,
                padding: '16px 40px', borderRadius: 100 }}>
              Start your conversation →
            </button>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p style={{ color: 'rgba(237,232,225,0.28)', fontSize: 12, marginTop: '1rem' }}>
              Free forever · No credit card required
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{ background: CREAM, padding: '48px 24px',
        borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-display font-bold" style={{ fontSize: 18 }}>Crushky</p>
            <p style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
              The app that listens before it matches.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Instagram', 'Twitter', 'Contact'].map(l => (
              <a key={l} href="#" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none',
                transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = INK}
                onMouseLeave={e => e.target.style.color = '#aaa'}>
                {l}
              </a>
            ))}
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.5rem',
          borderTop: '1px solid rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.22)', fontSize: 12 }}>
          © 2026 Crushky. Built with love and AI.
        </p>
      </footer>
    </div>
  )
}
