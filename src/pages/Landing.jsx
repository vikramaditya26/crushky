import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

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

/* ─── Helpers ─────────────────────────────────────────── */
function FadeIn({ children, delay = 0, y = 30, className = '', style = {} }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

/* ─── Hero photo (parallax + entrance) ────────────────── */
function HeroPhoto({ src, style, rotate, delay }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80])
  return (
    <motion.div
      style={{ rotate: `${rotate}deg`, y, ...style }}
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      <img src={src} alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover',
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.45)' }}
        className="rounded-2xl" />
    </motion.div>
  )
}

/* ─── Sticky cross-fade story ─────────────────────────── */
const STORY = [
  { src: '/img/rainy-city.jpg',    line1: 'Dating apps show you',     emph: 'faces.'  },
  { src: '/img/wedding-run.jpg',   line1: 'Crushky finds you a',      emph: 'story.'  },
  { src: '/img/playing-card.jpg',  line1: 'Not a guess.',             emph: 'A reading.' },
  { src: '/img/purple-field.jpg',  line1: 'Not a profile.',           emph: 'A person.'  },
  { src: '/img/field-running.jpg', line1: 'Not a date.',              emph: 'A future.'  },
]

/* Build a 6-point opacity range covering full [0,1] so clamping isn't needed.
   Each slot has fade-in, hold, fade-out. First/last extend to the edges. */
function slotRange(idx, total, holdFrac = 0.6) {
  const span = 1 / total
  const start = idx * span
  const end = start + span
  const fade = (span * (1 - holdFrac)) / 2
  const holdIn  = start + fade
  const holdOut = end - fade
  if (idx === 0) {
    return { input: [0, holdOut, end, 1], output: [1, 1, 0, 0] }
  }
  if (idx === total - 1) {
    return { input: [0, start, holdIn, 1], output: [0, 0, 1, 1] }
  }
  return {
    input:  [0, start, holdIn, holdOut, end, 1],
    output: [0, 0, 1, 1, 0, 0],
  }
}

function StoryFrame({ idx, total, src, scrollYProgress }) {
  const { input, output } = slotRange(idx, total, 0.7)
  const opacity = useTransform(scrollYProgress, input, output)
  const span = 1 / total
  const scale = useTransform(scrollYProgress,
    [idx * span, (idx + 1) * span],
    [1.08, 1.0])
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.img src={src} alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale }} />
    </motion.div>
  )
}

function StoryText({ idx, total, line1, emph, scrollYProgress }) {
  const { input, output } = slotRange(idx, total, 0.55)
  const opacity = useTransform(scrollYProgress, input, output)
  const span = 1 / total
  const start = idx * span
  const peak  = start + span * 0.5
  const end   = start + span
  const y = useTransform(scrollYProgress,
    [Math.max(0, start - 0.001), start, peak, end, Math.min(1, end + 0.001)],
    [40, 40, 0, -30, -30])
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      style={{ opacity, y }}>
      <p className="font-display font-bold"
        style={{ fontSize: 'clamp(36px, 7vw, 92px)', color: '#F0EBE3', lineHeight: 1.04 }}>
        {line1}
      </p>
      <p className="font-display font-bold italic"
        style={{ fontSize: 'clamp(40px, 8.5vw, 110px)', color: '#FDA4AF',
          lineHeight: 1, marginTop: '0.15em' }}>
        {emph}
      </p>
    </motion.div>
  )
}

function StoryScroll() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })
  return (
    <section ref={ref} style={{ height: `${STORY.length * 100}vh`, position: 'relative' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: INK }}>
        {STORY.map((s, i) => (
          <StoryFrame key={i} idx={i} total={STORY.length}
            src={s.src} scrollYProgress={scrollYProgress} />
        ))}
        <div className="absolute inset-0" style={{ background: 'rgba(10,8,5,0.58)' }} />
        <Grain opacity={0.05} />
        {STORY.map((s, i) => (
          <StoryText key={i} idx={i} total={STORY.length}
            line1={s.line1} emph={s.emph} scrollYProgress={scrollYProgress} />
        ))}
        {/* progress dots */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {STORY.map((_, i) => (
            <div key={i} style={{ width: 4, height: 28, background: 'rgba(240,235,227,0.25)',
              borderRadius: 2 }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Scatter section ─────────────────────────────────── */
const SCATTER = [
  { src: '/img/london-snow.jpg',   rotate: -5,  top: '0%',  left: '0%',    w: 230, h: 305, delay: 0    },
  { src: '/img/wes-anderson.jpg',  rotate:  4,  top: '8%',  left: '20%',   w: 200, h: 265, delay: 0.12 },
  { src: '/img/picnic-modern.jpg', rotate: -2,  top: '2%',  left: '40%',   w: 215, h: 280, delay: 0.22 },
  { src: '/img/swing.jpg',         rotate:  6,  top: '0%',  right: '18%',  w: 192, h: 252, delay: 0.18 },
  { src: '/img/elevator.jpg',      rotate: -4,  bottom:'2%',left: '10%',   w: 240, h: 320, delay: 0.28 },
  { src: '/img/vintage-car.jpg',   rotate:  3,  top: '14%', right: '0%',   w: 205, h: 268, delay: 0.35 },
]

function ScatterPhoto({ src, rotate, top, right, left, bottom, w, h, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', top, right, left, bottom,
        rotate: `${rotate}deg`, zIndex: 2 }}
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      <img src={src} alt=""
        style={{ width: w, height: h, objectFit: 'cover', display: 'block',
          boxShadow: '0 24px 50px -12px rgba(0,0,0,0.35)' }}
        className="rounded-xl" />
    </motion.div>
  )
}

/* ─── Marquee text ────────────────────────────────────── */
function BigMarquee() {
  const items = ['Talk to AI', 'Meet your person', 'No swiping', 'One conversation', 'No cringe openers']
  const set = [...items, ...items, ...items]
  return (
    <section style={{ background: INK, padding: '5vh 0', overflow: 'hidden',
      borderTop: '1px solid rgba(240,235,227,0.05)' }}>
      <motion.div
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content', alignItems: 'center' }}>
        {set.map((t, i) => (
          <span key={i} className="font-display font-bold"
            style={{ fontSize: 'clamp(40px, 8vw, 110px)',
              padding: '0 0.35em', letterSpacing: '-0.02em', lineHeight: 1,
              fontStyle: i % 2 === 1 ? 'italic' : 'normal',
              color: i % 2 === 1 ? '#FDA4AF' : CREAM,
              flexShrink: 0 }}>
            {t}{' '}
            <span style={{ opacity: 0.35, fontSize: '0.7em' }}>✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Steps (full-bleed cinematic) ────────────────────── */
const STEPS = [
  { n: '01', bg: '/img/black-white.jpg', title: 'Have a conversation',
    body: 'Five minutes. The kind of questions your best friend would actually ask. Honest, warm, slightly nosy.' },
  { n: '02', bg: '/img/picnic-film.jpg', title: 'We find your person',
    body: 'Our AI reads between every line. It searches for the human who actually clicks with you, not the one who looks the part.' },
  { n: '03', bg: '/img/vespa.jpg',       title: 'Meet, and know why',
    body: 'We tell you exactly why you two work. The shared humour. The compatible chaos. The values you both protect.' },
]

function StepSection({ n, bg, title, body, reverse }) {
  return (
    <section className="relative overflow-hidden"
      style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: INK }}>
      <img src={bg} alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }} />
      <div className="absolute inset-0"
        style={{ background: reverse
          ? 'linear-gradient(80deg, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0.8) 65%, rgba(10,8,5,0.95) 100%)'
          : 'linear-gradient(280deg, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0.8) 65%, rgba(10,8,5,0.95) 100%)' }} />
      <Grain opacity={0.05} />
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 w-full">
        <div className={`flex ${reverse ? 'md:justify-end' : 'md:justify-start'}`}>
          <div style={{ maxWidth: 560 }}>
            <FadeIn>
              <p className="font-display"
                style={{ fontSize: 'clamp(60px, 10vw, 130px)', color: 'rgba(240,235,227,0.15)',
                  lineHeight: 1, marginBottom: '0.5rem', fontWeight: 700 }}>
                {n}
              </p>
            </FadeIn>
            <FadeIn delay={0.12}>
              <h3 className="font-display font-bold"
                style={{ fontSize: 'clamp(34px, 5.5vw, 64px)', color: CREAM,
                  lineHeight: 1.05, marginBottom: '1.25rem' }}>
                {title}
              </h3>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p style={{ color: 'rgba(240,235,227,0.72)', fontSize: 18,
                lineHeight: 1.7, maxWidth: 460 }}>
                {body}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Comparison rows ─────────────────────────────────── */
const CMP = [
  { f:'Find matches',   old:'Swipe 200+ profiles',  n:'One honest conversation'    },
  { f:'Compatibility',  old:'Guess from photos',    n:'AI-analysed personality'    },
  { f:'First message',  old:'"Hey" and pray',       n:'Know exactly why you click' },
  { f:'Time to match',  old:'Hours of swiping',     n:'Three minutes of talking'   },
]

/* ══════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  /* Hero background ken-burns */
  const heroBgScale = useTransform(scrollY, [0, 800], [1, 1.12])
  const heroBgY     = useTransform(scrollY, [0, 800], [0, 100])

  /* Statement section accent photos */
  const stmtScrollY = useScroll().scrollY
  const stmtY1 = useTransform(stmtScrollY, [600, 2000], [60, -60])
  const stmtY2 = useTransform(stmtScrollY, [600, 2000], [-40, 80])

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 40))
    return unsub
  }, [scrollY])

  return (
    <div style={{ background: CREAM, color: INK, overflowX: 'clip' }}>

      {/* ════ NAV ════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(240,235,227,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <motion.span className="font-display text-xl font-bold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ color: scrolled ? INK : CREAM, transition: 'color 0.5s' }}>
            Crushky
          </motion.span>
          <motion.button onClick={() => navigate('/signup')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: scrolled ? INK : CREAM, color: scrolled ? CREAM : INK,
              fontSize: 14, fontWeight: 600,
              padding: '10px 22px', borderRadius: 100, transition: 'all 0.5s' }}>
            Get started →
          </motion.button>
        </div>
      </nav>

      {/* ════ HERO ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end md:items-center overflow-hidden">
        <motion.div className="absolute inset-0"
          style={{ scale: heroBgScale, y: heroBgY }}>
          <img src="/img/paris-dance.jpg" alt=""
            className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(20,15,12,0.88) 0%, rgba(20,15,12,0.72) 45%, rgba(20,15,12,0.25) 100%)' }} />
          <Grain opacity={0.05} />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-0 w-full">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold"
              style={{ fontSize: 'clamp(48px, 8vw, 110px)', lineHeight: 0.98,
                color: CREAM, marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>
              The app that{' '}
              <em style={{ color: '#FDA4AF', fontStyle: 'italic' }}>listens</em>
              <br />before it matches.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: 'rgba(240,235,227,0.72)', fontSize: 19, lineHeight: 1.65,
                maxWidth: 480, marginBottom: '2.5rem' }}>
              No photos. No swiping. One honest conversation with our AI — and we find who you've actually been looking for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
              <button onClick={() => navigate('/signup')}
                className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-2xl group"
                style={{ background: CREAM, color: INK, fontSize: 16, fontWeight: 700,
                  padding: '17px 40px', borderRadius: 100, letterSpacing: '0.01em' }}>
                Start talking <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p style={{ color: 'rgba(240,235,227,0.45)', fontSize: 12, marginLeft: 4, marginTop: 4 }}>
                Free forever · Two minutes
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating polaroids — desktop only */}
        <div className="hidden lg:block">
          <HeroPhoto src="/img/vintage-cafe.jpg"
            rotate={-4} delay={0.9}
            style={{ position: 'absolute', bottom: '7%', right: '5%',
              width: 230, height: 305, zIndex: 10 }} />
          <HeroPhoto src="/img/diner.jpg"
            rotate={5} delay={1.15}
            style={{ position: 'absolute', top: '12%', right: '17%',
              width: 188, height: 248, zIndex: 9 }} />
          <HeroPhoto src="/img/italian.jpg"
            rotate={-2} delay={1.35}
            style={{ position: 'absolute', top: '6%', right: '2%',
              width: 175, height: 232, zIndex: 8 }} />
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 40, background: 'rgba(240,235,227,0.35)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(240,235,227,0.45)', fontWeight: 700 }}>
            scroll
          </span>
        </motion.div>
      </section>

      {/* ════ BIG MARQUEE ════════════════════════════════ */}
      <BigMarquee />

      {/* ════ STATEMENT ══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: CREAM, padding: '14vh 24px 12vh' }}>
        <Grain opacity={0.06} />

        {/* Accent photos — kept in outer margins so they never cross text */}
        <motion.div className="hidden xl:block absolute"
          style={{ top: '18%', left: '-2%', width: 165, height: 215,
            rotate: '-9deg', y: stmtY1, zIndex: 0 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.4 }}>
          <img src="/img/bicycle.jpg" alt=""
            className="w-full h-full object-cover rounded-xl shadow-2xl" />
        </motion.div>
        <motion.div className="hidden xl:block absolute"
          style={{ bottom: '14%', right: '-2%', width: 175, height: 225,
            rotate: '7deg', y: stmtY2, zIndex: 0 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 }}>
          <img src="/img/vintage-picnic.jpg" alt=""
            className="w-full h-full object-cover rounded-xl shadow-2xl" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {[
            { t: "While you're swiping left on strangers.", d: 0    },
            { t: "While you're at work, at the gym.",       d: 0.18 },
            { t: 'Living your actual life —',               d: 0.33 },
          ].map((l, i) => (
            <FadeIn key={i} delay={l.d} y={50}>
              <p className="font-display font-bold"
                style={{ fontSize: 'clamp(28px, 5.2vw, 58px)', color: INK,
                  lineHeight: 1.12, marginBottom: '0.15em', letterSpacing: '-0.01em' }}>
                {l.t}
              </p>
            </FadeIn>
          ))}
          <FadeIn delay={0.55} y={50}>
            <p className="font-display font-bold italic"
              style={{ fontSize: 'clamp(30px, 5.5vw, 64px)', color: ROSE,
                lineHeight: 1.1, marginTop: '0.3em', marginBottom: '2.5rem' }}>
              Crushky is finding your person.
            </p>
          </FadeIn>
          <FadeIn delay={0.75}>
            <p style={{ color: '#7A7060', fontSize: 17, lineHeight: 1.78, maxWidth: 520,
              margin: '0 auto' }}>
              Not matching photos. Testing for resonance. Finding the people who think like you, laugh like you, protect their energy the same way you do.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════ STICKY CROSS-FADE STORY ════════════════════ */}
      <StoryScroll />

      {/* ════ SCATTER (no-pic-twice) ═════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: CREAM, padding: '14vh 24px 22vh' }}>
        <Grain opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(30px, 5.5vw, 64px)', color: INK,
                marginBottom: '4.5rem', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
              Then you only meet{' '}
              <em style={{ color: ROSE }}>the ones worth meeting.</em>
            </h2>
          </FadeIn>

          {/* Desktop scattered */}
          <div className="hidden lg:block relative" style={{ height: 540 }}>
            {SCATTER.map((p, i) => <ScatterPhoto key={i} {...p} />)}
          </div>

          {/* Mobile grid */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            {SCATTER.map((p, i) => (
              <motion.img key={i} src={p.src} alt=""
                className="rounded-2xl object-cover w-full"
                style={{ height: 240, transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS — cinematic steps ═════════════ */}
      <div>
        <div className="relative" style={{ background: INK, padding: '12vh 24px 8vh', textAlign: 'center' }}>
          <Grain opacity={0.06} />
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(240,235,227,0.35)',
              fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
              How it works
            </p>
            <h2 className="font-display font-bold"
              style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: CREAM,
                lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Three steps.
              <br />
              <em style={{ color: '#FDA4AF' }}>One person.</em>
            </h2>
          </FadeIn>
        </div>
        {STEPS.map((s, i) => (
          <StepSection key={i} {...s} reverse={i % 2 === 1} />
        ))}
      </div>

      {/* ════ COMPARISON ═════════════════════════════════ */}
      <section className="relative" style={{ background: CREAM, padding: '14vh 24px' }}>
        <Grain opacity={0.055} />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <p className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(18px, 2.8vw, 28px)', color: '#B8A898',
                marginBottom: '0.2rem' }}>
              tired of tinder &amp; hinge?
            </p>
            <p className="font-display font-bold italic text-center"
              style={{ fontSize: 'clamp(30px, 5vw, 56px)', color: ROSE,
                marginBottom: '3rem', letterSpacing: '-0.01em' }}>
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

      {/* ════ FINAL CTA (drive-in bg, no stats) ══════════ */}
      <section className="relative overflow-hidden flex items-center justify-center"
        style={{ minHeight: '100vh' }}>
        <img src="/img/drive-in.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,15,12,0.95) 0%, rgba(20,15,12,0.55) 55%, rgba(20,15,12,0.30) 100%)' }} />
        <Grain opacity={0.05} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeIn y={40}>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(240,235,227,0.5)',
              fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              The last dating app you'll need
            </p>
          </FadeIn>
          <FadeIn delay={0.12} y={40}>
            <h2 className="font-display font-bold"
              style={{ fontSize: 'clamp(40px, 7.5vw, 96px)', color: CREAM,
                lineHeight: 1.02, marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>
              The app that <em style={{ color: '#FDA4AF' }}>listens</em>
              <br />before it matches.
            </h2>
          </FadeIn>
          <FadeIn delay={0.28}>
            <p style={{ color: 'rgba(240,235,227,0.6)', fontSize: 18, lineHeight: 1.6,
              marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem' }}>
              Tell Crushky who you actually are. Your person gets to meet every single bit of you.
            </p>
          </FadeIn>
          <FadeIn delay={0.42}>
            <button onClick={() => navigate('/signup')}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl group"
              style={{ background: CREAM, color: INK, fontSize: 17, fontWeight: 700,
                padding: '18px 46px', borderRadius: 100, letterSpacing: '0.01em' }}>
              Start your conversation <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </FadeIn>
          <FadeIn delay={0.56}>
            <p style={{ color: 'rgba(240,235,227,0.32)', fontSize: 12, marginTop: '1.25rem' }}>
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
