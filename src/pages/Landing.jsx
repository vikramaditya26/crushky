import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ─── Film grain overlay ──────────────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

function Grain({ opacity = 0.055 }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]"
      style={{ backgroundImage: GRAIN, backgroundSize: '128px', opacity, mixBlendMode: 'multiply' }} />
  )
}

/* ─── Colours ─────────────────────────────────────────── */
const CREAM  = '#F0EBE3'
const INK    = '#1A1410'
const ROSE   = '#C94B4B'
const FOREST = '#1E2D1C'
const WARM   = '#2A1F14'

/* ─── Film strip images (all of them) ────────────────── */
const STRIP = [
  '/img/vintage-cafe.jpg',
  '/img/diner.jpg',
  '/img/italian.jpg',
  '/img/black-white.jpg',
  '/img/london-snow.jpg',
  '/img/paris-dance.jpg',
  '/img/rainy-city.jpg',
  '/img/wes-anderson.jpg',
  '/img/bicycle.jpg',
  '/img/picnic-modern.jpg',
  '/img/swing.jpg',
  '/img/vespa.jpg',
  '/img/flower-field.jpg',
  '/img/drive-in.jpg',
  '/img/vintage-car.jpg',
  '/img/wedding-run.jpg',
  '/img/elevator.jpg',
  '/img/playing-card.jpg',
  '/img/field-running.jpg',
  '/img/purple-field.jpg',
  '/img/vintage-picnic.jpg',
  '/img/picnic-film.jpg',
]

/* ─── Scatter section images ──────────────────────────── */
const SCATTER = [
  { src: '/img/vintage-cafe.jpg',   rotate: -5,  top: '2%',  left: '0%',    w: 220, h: 290, delay: 0    },
  { src: '/img/italian.jpg',        rotate:  4,  top: '10%', left: '18%',   w: 195, h: 255, delay: 0.12 },
  { src: '/img/rainy-city.jpg',     rotate: -2,  top: '4%',  left: '37%',   w: 210, h: 270, delay: 0.22 },
  { src: '/img/london-snow.jpg',    rotate:  6,  top: '2%',  right: '18%',  w: 188, h: 248, delay: 0.18 },
  { src: '/img/picnic-modern.jpg',  rotate: -4,  bottom:'4%',left: '12%',   w: 240, h: 180, delay: 0.28 },
  { src: '/img/wes-anderson.jpg',   rotate:  3,  top: '15%', right: '0%',   w: 198, h: 260, delay: 0.35 },
]

/* ─── Testimonials ────────────────────────────────────── */
const TESTS = [
  { name:'Aarav S.',  loc:'Mumbai',    init:'A', color:'#2563EB', msg:'First time an app actually understood what I was looking for. Matched in 3 minutes — been dating 2 months now.' },
  { name:'Meera K.',  loc:'Bangalore', init:'M', color:'#7C3AED', msg:'The AI asked things my friends never thought to ask. She was exactly who I didn\'t know I was looking for.' },
  { name:'Karan T.',  loc:'Delhi',     init:'K', color:'#059669', msg:'One conversation. No cringe openers. Just a match that made total sense.' },
]

/* ─── Comparison ──────────────────────────────────────── */
const CMP = [
  { f:'Find matches',   old:'Swipe 200+ profiles',  n:'One honest conversation'    },
  { f:'Compatibility',  old:'Guess from photos',    n:'AI-analysed personality'    },
  { f:'First message',  old:'"Hey" and pray',       n:'Know exactly why you click' },
  { f:'Time to match',  old:'Hours of swiping',     n:'3 minutes of talking'       },
]

/* ─── Helpers ─────────────────────────────────────────── */
function FadeIn({ children, delay = 0, y = 30, className = '', style = {} }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

/* ─── Film strip marquee ──────────────────────────────── */
function FilmStrip() {
  const items = [...STRIP, ...STRIP]
  return (
    <div style={{ overflow: 'hidden', background: INK, padding: '20px 0', position: 'relative' }}>
      {/* sprocket holes top */}
      <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: 12,
        background: `repeating-linear-gradient(90deg, transparent 0, transparent 28px, ${INK} 28px, ${INK} 32px)`,
        backgroundSize: '32px 100%' }} />
      {/* sprocket holes bottom */}
      <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, height: 12,
        background: `repeating-linear-gradient(90deg, transparent 0, transparent 28px, ${INK} 28px, ${INK} 32px)`,
        backgroundSize: '32px 100%' }} />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '12px', paddingLeft: '12px', width: 'max-content' }}>
        {items.map((src, i) => (
          <div key={i} style={{
            width: 140, height: 180, flexShrink: 0, borderRadius: 6,
            overflow: 'hidden', border: '2px solid rgba(255,255,255,0.12)',
            transform: `rotate(${i % 3 === 0 ? '-1.5deg' : i % 3 === 1 ? '1deg' : '-0.5deg'})`,
          }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Scatter photo ───────────────────────────────────── */
function ScatterPhoto({ src, rotate, top, right, left, bottom, w, h, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', top, right, left, bottom,
        rotate: `${rotate}deg`, zIndex: 2 }}
      initial={{ opacity: 0, y: 50, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      <img src={src} alt=""
        style={{ width: w, height: h, objectFit: 'cover', display: 'block' }}
        className="rounded-xl shadow-2xl" />
    </motion.div>
  )
}

/* ─── Hero parallax photo ─────────────────────────────── */
function HeroPhoto({ src, style, rotate, delay }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])
  return (
    <motion.div
      style={{ rotate: `${rotate}deg`, y, ...style }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      <img src={src} alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="rounded-2xl shadow-2xl" />
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const videoRef = useRef(null)

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 40))
    return unsub
  }, [scrollY])

  return (
    <div style={{ background: CREAM, color: INK, overflowX: 'hidden' }}>

      {/* ════ NAV ════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(240,235,227,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <motion.span className="font-display text-xl font-bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            Crushky
          </motion.span>
          <motion.button onClick={() => navigate('/signup')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: INK, color: CREAM, fontSize: 14, fontWeight: 600,
              padding: '10px 22px', borderRadius: 100 }}>
            Get started →
          </motion.button>
        </div>
      </nav>

      {/* ════ HERO ═══════════════════════════════════════ */}
      {/* Full-bleed: Paris dancing sepia as BG, text over dark gradient */}
      <section className="relative min-h-screen flex items-end md:items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <img src="/img/paris-dance.jpg" alt=""
            className="w-full h-full object-cover object-center" />
          {/* gradient: dark on left for text, lighter on right */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(26,20,16,0.88) 0%, rgba(26,20,16,0.72) 45%, rgba(26,20,16,0.25) 100%)' }} />
          <Grain opacity={0.04} />
        </div>

        {/* Text */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-0 w-full">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 11, letterSpacing: '0.25em', color: 'rgba(240,235,227,0.55)',
                fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Bangalore · Delhi · Mumbai
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)', lineHeight: 1.02,
                color: CREAM, marginBottom: '1.5rem' }}>
              The app that{' '}
              <em style={{ color: '#FDA4AF', fontStyle: 'italic' }}>listens</em>
              <br />before it matches.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: 'rgba(240,235,227,0.68)', fontSize: 18, lineHeight: 1.7,
                maxWidth: 460, marginBottom: '2.5rem' }}>
              No photos. No swiping. One real conversation with our AI — and we find who you've actually been looking for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <button onClick={() => navigate('/signup')}
                className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: CREAM, color: INK, fontSize: 15, fontWeight: 700,
                  padding: '15px 36px', borderRadius: 100 }}>
                Start talking →
              </button>
              <p style={{ color: 'rgba(240,235,227,0.38)', fontSize: 12, marginLeft: 4 }}>
                Free forever · Takes 2 minutes
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating polaroids — desktop only */}
        <div className="hidden lg:block">
          <HeroPhoto src="/img/vintage-cafe.jpg"
            rotate={-4} delay={0.8}
            style={{ position: 'absolute', bottom: '8%', right: '6%',
              width: 220, height: 290, zIndex: 10 }} />
          <HeroPhoto src="/img/diner.jpg"
            rotate={5} delay={1.0}
            style={{ position: 'absolute', top: '15%', right: '18%',
              width: 180, height: 238, zIndex: 9 }} />
          <HeroPhoto src="/img/italian.jpg"
            rotate={-2} delay={1.2}
            style={{ position: 'absolute', top: '8%', right: '3%',
              width: 168, height: 222, zIndex: 8 }} />
        </div>
      </section>

      {/* ════ FILM STRIP ═════════════════════════════════ */}
      <FilmStrip />

      {/* ════ STATEMENT (Wavelength-style stagger) ═══════ */}
      <section className="relative" style={{ background: CREAM, padding: '120px 24px 100px' }}>
        <Grain opacity={0.06} />
        <div className="max-w-5xl mx-auto relative z-10">
          {[
            { t: 'While you\'re swiping left on strangers.', d: 0,    align: 'left'  },
            { t: 'While you\'re at work, at the gym.',       d: 0.18, align: 'left'  },
            { t: 'Living your actual life —',                d: 0.33, align: 'left'  },
          ].map((l, i) => (
            <FadeIn key={i} delay={l.d} y={50}>
              <p className="font-display font-bold"
                style={{ fontSize: 'clamp(28px, 5.5vw, 60px)', color: INK,
                  lineHeight: 1.12, marginBottom: '0.15em' }}>
                {l.t}
              </p>
            </FadeIn>
          ))}
          <FadeIn delay={0.5} y={50}>
            <p className="font-display font-bold italic"
              style={{ fontSize: 'clamp(28px, 5.5vw, 60px)', color: ROSE,
                lineHeight: 1.12, textAlign: 'right', marginBottom: '3rem' }}>
              Crushky is finding your person.
            </p>
          </FadeIn>
          <FadeIn delay={0.68}>
            <p style={{ color: '#7A7060', fontSize: 17, lineHeight: 1.78, maxWidth: 520,
              margin: '0 auto', textAlign: 'center' }}>
              Not matching photos. Testing for resonance. Finding the people who think like you, laugh like you, protect their energy the same way you do.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════ FULL-BLEED QUOTE (rainy city B&W) ══════════ */}
      <section className="relative overflow-hidden"
        style={{ height: '90vh', minHeight: 520 }}>
        <img src="/img/rainy-city.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0"
          style={{ background: 'rgba(12,10,8,0.62)' }} />
        <Grain opacity={0.05} />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
          <FadeIn y={40}>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(240,235,227,0.4)',
              fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.5rem' }}>
              Why Crushky
            </p>
          </FadeIn>
          <FadeIn delay={0.15} y={40}>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(32px, 6vw, 72px)', color: CREAM,
                lineHeight: 1.08, maxWidth: 780 }}>
              "Dating apps show you faces.
              <br />
              <em style={{ color: '#FDA4AF' }}>Crushky finds you a story.</em>"
            </h2>
          </FadeIn>
          <FadeIn delay={0.35}>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer hover:opacity-80 transition-all hover:-translate-y-0.5"
              style={{ marginTop: '3rem', background: 'transparent', color: CREAM,
                border: `1.5px solid rgba(240,235,227,0.45)`, fontSize: 14, fontWeight: 600,
                padding: '13px 32px', borderRadius: 100 }}>
              Find your match →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ════ PHOTO SCATTER ══════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: CREAM, padding: '100px 24px 200px' }}>
        <Grain opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', color: INK, marginBottom: '4rem' }}>
              Then you only meet{' '}
              <em style={{ color: ROSE }}>the ones worth meeting.</em>
            </h2>
          </FadeIn>

          {/* Desktop scattered */}
          <div className="hidden lg:block relative" style={{ height: 480 }}>
            {SCATTER.map((p, i) => <ScatterPhoto key={i} {...p} />)}
          </div>

          {/* Mobile grid */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            {SCATTER.slice(0, 4).map((p, i) => (
              <motion.img key={i} src={p.src} alt=""
                className="rounded-2xl object-cover w-full"
                style={{ height: 220 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════ VIDEO BG — HOW IT WORKS ════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
        {/* Video background */}
        <video
          ref={videoRef} autoPlay muted loop playsInline
          src="/vid/v2.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0"
          style={{ background: 'rgba(10,8,5,0.78)' }} />
        <Grain opacity={0.04} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-24">
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', color: 'rgba(240,235,227,0.4)',
              fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>
              3 steps
            </p>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: CREAM, marginBottom: '4rem' }}>
              How Crushky works
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '01', icon: '💬', title: 'Have a conversation',
                body: 'Talk to our AI for a few minutes. Real questions. No surface-level stuff.' },
              { n: '02', icon: '✦', title: 'We find your match',
                body: 'Our AI understands who you actually are, then finds someone who truly complements you.' },
              { n: '03', icon: '💖', title: 'Know why you click',
                body: 'We tell you exactly why you two work. Values, energy, humour — everything.' },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div style={{ border: '1px solid rgba(240,235,227,0.1)', borderRadius: '1.5rem',
                  padding: '2rem', background: 'rgba(240,235,227,0.06)',
                  backdropFilter: 'blur(8px)' }}>
                  <p className="font-display font-bold"
                    style={{ fontSize: '3rem', color: 'rgba(240,235,227,0.08)', marginBottom: '0.5rem' }}>
                    {s.n}
                  </p>
                  <p style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{s.icon}</p>
                  <h3 className="font-display font-bold"
                    style={{ fontSize: '1.2rem', color: CREAM, marginBottom: '0.7rem' }}>
                    {s.title}
                  </h3>
                  <p style={{ color: 'rgba(240,235,227,0.5)', fontSize: 15, lineHeight: 1.72 }}>
                    {s.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ═══════════════════════════════ */}
      <section className="relative" style={{ background: WARM, padding: '100px 24px' }}>
        <Grain opacity={0.04} />
        {/* Subtle image in bg */}
        <div className="absolute inset-0 overflow-hidden">
          <img src="/img/flower-field.jpg" alt=""
            className="w-full h-full object-cover opacity-10" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: CREAM, marginBottom: '3rem' }}>
              People who found their{' '}
              <em style={{ color: '#FDA4AF' }}>person</em>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.13}>
                <div style={{ background: 'rgba(240,235,227,0.07)',
                  border: '1px solid rgba(240,235,227,0.1)', borderRadius: '1.5rem',
                  padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                  <div style={{ background: 'rgba(240,235,227,0.1)',
                    borderRadius: '1rem 1rem 1rem 0.3rem', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(240,235,227,0.82)', fontSize: 14, lineHeight: 1.65 }}>
                      "{t.msg}"
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {t.init}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{t.name}</p>
                      <p style={{ color: 'rgba(240,235,227,0.38)', fontSize: 12 }}>{t.loc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ COMPARISON ═════════════════════════════════ */}
      <section className="relative" style={{ background: CREAM, padding: '100px 24px' }}>
        <Grain opacity={0.055} />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <p className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(18px, 2.8vw, 28px)', color: '#B8A898', marginBottom: '0.2rem' }}>
              tired of tinder &amp; hinge?
            </p>
            <p className="font-display font-bold italic text-center"
              style={{ fontSize: 'clamp(30px, 5vw, 54px)', color: ROSE, marginBottom: '3rem' }}>
              Crushky is for you.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden',
              boxShadow: '0 8px 48px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '12px 20px' }} />
                {['Other apps', 'Crushky'].map((h, i) => (
                  <div key={i} style={{ padding: '12px 20px', textAlign: 'center',
                    borderLeft: '1px solid rgba(0,0,0,0.06)',
                    background: i === 1 ? 'rgba(30,45,28,0.04)' : 'transparent' }}>
                    <span style={{ fontSize: 11, color: i === 1 ? FOREST : '#B8A898',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {h}
                    </span>
                  </div>
                ))}
              </div>
              {CMP.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  borderBottom: i < CMP.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <div style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{row.f}</span>
                  </div>
                  <div style={{ padding: '16px 20px', textAlign: 'center',
                    borderLeft: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 13, color: '#B8A898' }}>{row.old}</span>
                  </div>
                  <div style={{ padding: '16px 20px', textAlign: 'center',
                    borderLeft: '1px solid rgba(0,0,0,0.06)', background: 'rgba(30,45,28,0.03)' }}>
                    <span style={{ fontSize: 13, color: FOREST, fontWeight: 600 }}>{row.n}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ FINAL CTA (drive-in bg) ═════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <img src="/img/drive-in.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.95) 0%, rgba(26,20,16,0.70) 50%, rgba(26,20,16,0.35) 100%)' }} />
        <Grain opacity={0.05} />

        {/* Stats floating in upper portion */}
        <div className="absolute left-0 right-0 z-10 flex justify-center px-3 md:px-6"
          style={{ top: '10%' }}>
          <div className="flex flex-row flex-nowrap justify-center gap-2 md:gap-6">
            {[
              { n: '10K+', l: 'Conversations', bg: '#FDE68A', r: -3 },
              { n: '94%',  l: 'Match rate',    bg: '#FBCFE8', r: 2  },
              { n: '3 min',l: 'To first match', bg: '#BAE6FD', r: -1 },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, rotate: s.r * 0.5, y: 50, scale: 0.82 }}
                whileInView={{ opacity: 1, rotate: s.r, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
                style={{ background: s.bg, borderRadius: '1.25rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <div className="px-3 py-3 md:px-7 md:py-5">
                  <p className="font-display font-bold"
                    style={{ color: INK, lineHeight: 1, fontSize: 'clamp(20px, 5.5vw, 45px)' }}>{s.n}</p>
                  <p className="font-semibold"
                    style={{ color: INK, opacity: 0.65, marginTop: '0.25rem',
                      fontSize: 'clamp(9px, 2vw, 12px)' }}>
                    {s.l}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 px-6 text-center">
          <FadeIn y={30}>
            <h2 className="font-display font-bold"
              style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', color: CREAM, lineHeight: 1.08,
                marginBottom: '1.5rem' }}>
              The app that <em style={{ color: '#FDA4AF' }}>listens</em>
              <br />before it matches.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ color: 'rgba(240,235,227,0.52)', fontSize: 17, marginBottom: '2rem' }}>
              People spent time telling Crushky who they really are.
              <br />Your match gets to meet every single one of them.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: CREAM, color: INK, fontSize: 16, fontWeight: 700,
                padding: '16px 42px', borderRadius: 100 }}>
              Start your conversation →
            </button>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p style={{ color: 'rgba(240,235,227,0.25)', fontSize: 12, marginTop: '1rem' }}>
              Free forever · No credit card required
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════ */}
      <footer style={{ background: INK, padding: '48px 24px' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-display font-bold" style={{ fontSize: 20, color: CREAM }}>Crushky</p>
            <p style={{ color: 'rgba(240,235,227,0.35)', fontSize: 13, marginTop: 4 }}>
              The app that listens before it matches.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Instagram', 'Twitter', 'Contact'].map(l => (
              <a key={l} href="#"
                style={{ color: 'rgba(240,235,227,0.4)', fontSize: 14, textDecoration: 'none',
                  transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = CREAM}
                onMouseLeave={e => e.target.style.color = 'rgba(240,235,227,0.4)'}>
                {l}
              </a>
            ))}
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem',
          borderTop: '1px solid rgba(240,235,227,0.06)', color: 'rgba(240,235,227,0.18)', fontSize: 12 }}>
          © 2026 Crushky. Built with love and AI.
        </p>
      </footer>
    </div>
  )
}
