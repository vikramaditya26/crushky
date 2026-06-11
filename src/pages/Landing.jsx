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
      <div className="sticky top-0 w-full overflow-hidden" style={{ background: INK, height: '100dvh' }}>
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

/* ─── Revolving carousel — 8 photos in a wavy arc ─────── */
/* Each photo: own size + tilt + vertical offset → arc/wave shape, not a flat line */
const REEL = [
  { src: '/img/elevator.jpg',      rotate: -6, floatKf: 'scatter-float-1', dur: 11,   w: 250, h: 330, y: -40 },
  { src: '/img/vintage-cafe.jpg',  rotate:  5, floatKf: 'scatter-float-2', dur: 13,   w: 220, h: 290, y:  50 },
  { src: '/img/wes-anderson.jpg',  rotate: -3, floatKf: 'scatter-float-3', dur: 9.5,  w: 270, h: 350, y: -10 },
  { src: '/img/diner.jpg',         rotate:  6, floatKf: 'scatter-float-4', dur: 12,   w: 215, h: 285, y:  60 },
  { src: '/img/picnic-modern.jpg', rotate: -5, floatKf: 'scatter-float-5', dur: 10.5, w: 260, h: 340, y: -30 },
  { src: '/img/italian.jpg',       rotate:  4, floatKf: 'scatter-float-1', dur: 12.5, w: 225, h: 295, y:  40 },
  { src: '/img/swing.jpg',         rotate: -2, floatKf: 'scatter-float-2', dur: 10,   w: 245, h: 320, y: -25 },
  { src: '/img/vintage-car.jpg',   rotate:  5, floatKf: 'scatter-float-3', dur: 11.5, w: 230, h: 305, y:  55 },
]

function ReelCard({ src, rotate, floatKf, dur, w, h, y, idx }) {
  return (
    /* Outer wrapper: holds the wave y-offset + generous horizontal padding (= space) */
    <div style={{ flexShrink: 0, padding: '0 36px',
      transform: `translateY(${y}px)` }}>
      {/* Inner card: rotate + continuous CSS float */}
      <div style={{
        width: w, height: h,
        transform: `rotate(${rotate}deg)`,
        animation: `${floatKf} ${dur}s ease-in-out infinite`,
        animationDelay: `${(idx % 5) * 0.7}s`,
      }}>
        <img src={src} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            boxShadow: '0 28px 60px -14px rgba(0,0,0,0.4)' }}
          className="rounded-xl" />
      </div>
    </div>
  )
}

function PhotoReel() {
  /* Duplicate set so the marquee loop is seamless. ~58s for full cycle. */
  const set = [...REEL, ...REEL]
  return (
    /* Taller container so the wave + drift have room to breathe */
    <div style={{ overflow: 'hidden', position: 'relative', padding: '60px 0 80px',
      minHeight: 480 }}>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10"
        style={{ width: 140, background: 'linear-gradient(to right, #F0EBE3, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10"
        style={{ width: 140, background: 'linear-gradient(to left, #F0EBE3, transparent)' }} />
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
        {set.map((p, i) => (
          <ReelCard key={i} {...p} idx={i} />
        ))}
      </motion.div>
    </div>
  )
}


/* ─── Steps (full-bleed cinematic) ────────────────────── */
const STEPS = [
  { n: '01', bg: '/img/black-white.jpg', title: 'Have a conversation',
    body: 'Five minutes. The kind of questions your best friend would actually ask. Honest, warm, slightly nosy.' },
  { n: '02', bg: '/img/picnic-film.jpg', title: 'We find your person',
    body: 'Our AI reads between every line — your humour, your weird interests, your values. Then it finds the one human in your city you\'d actually click with.' },
  { n: '03', bg: '/img/vespa.jpg',       title: "Meet at a spot that's actually you.",
    body: 'A bookshop, a back-alley cafe, a museum after-hours — we pick the place based on what you both actually love. And we tell you exactly why you two click.' },
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

/* ─── Phone demo — the product, live on the landing ───── */
const DEMO_SCRIPT = [
  { type: 'ai',   text: "What does your ideal weekend look like? Be honest — not the Instagram version." },
  { type: 'user', text: "Slow mornings, hidden cafes, no plans honestly." },
  { type: 'ai',   text: "Someone who doesn't need noise to feel connected. Got it. Give me a second…" },
  { type: 'match' },
]

function PhoneDemo() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const delays = [1200, 1700, 1700, 2000, 4200]
    const t = setTimeout(() => {
      setStep(s => (s + 1) % (DEMO_SCRIPT.length + 1))
    }, delays[step] || 1700)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div style={{ width: 300, height: 600, borderRadius: 44, background: '#FBF8F4',
      border: '10px solid #1A1410', boxShadow: '0 40px 90px -20px rgba(0,0,0,0.45)',
      overflow: 'hidden', position: 'relative', margin: '0 auto' }}>
      {/* notch */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 90, height: 22, borderRadius: 20, background: '#1A1410', zIndex: 5 }} />
      {/* header */}
      <div style={{ padding: '46px 18px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: ROSE,
          animation: 'pulse 2s infinite' }} className="animate-pulse" />
        <span className="font-display font-bold" style={{ fontSize: 15, color: INK }}>Crushky AI</span>
        <span style={{ fontSize: 10, color: 'rgba(26,20,16,0.35)', marginLeft: 'auto' }}>listening…</span>
      </div>
      {/* chat */}
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DEMO_SCRIPT.slice(0, step).map((m, i) => {
          if (m.type === 'match') {
            return (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#fff', borderRadius: 18, overflow: 'hidden',
                  boxShadow: '0 12px 30px -8px rgba(201,75,75,0.25)', border: '1px solid rgba(201,75,75,0.15)' }}>
                <div style={{ display: 'flex', gap: 10, padding: 10 }}>
                  <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=200&fit=crop&crop=face,top"
                    alt="" style={{ width: 62, height: 78, borderRadius: 12, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <p className="font-display font-bold" style={{ fontSize: 14, color: INK }}>Aanya, 25</p>
                      <span style={{ color: ROSE, fontWeight: 700, fontSize: 13 }}>94%</span>
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(26,20,16,0.45)', marginBottom: 4 }}>Mumbai · Strategy at CRED</p>
                    <p style={{ fontSize: 10, lineHeight: 1.5, color: 'rgba(26,20,16,0.65)' }}>
                      "She used almost the exact words you did — someone who doesn't need noise to feel connected."
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          }
          const isUser = m.type === 'user'
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: isUser ? FOREST : '#fff',
                color: isUser ? '#F0EBE3' : INK,
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '9px 13px', fontSize: 12, lineHeight: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
              {m.text}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ProductPreviewSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: CREAM, padding: '14vh 24px' }}>
      <Grain opacity={0.06} />
      <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(26,20,16,0.4)',
              fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
              See it work
            </p>
            <h2 className="font-display font-bold"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: INK, lineHeight: 1.08,
                marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
              One conversation.
              <br /><em style={{ color: ROSE }}>Zero swiping.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ color: '#7A7060', fontSize: 17, lineHeight: 1.75, maxWidth: 440 }}>
              Crushky asks the questions your best friend would. Then it finds the one person
              in your city who answered the same way — and tells you exactly{' '}
              <em style={{ color: INK }}>why</em> you two click. Not a score. A reason.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <PhoneDemo />
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Statement section — text only on cream ──────────── */
function StatementSection() {
  return (
    <section className="relative overflow-hidden"
      style={{ background: CREAM, padding: '16vh 24px 14vh' }}>
      <Grain opacity={0.06} />
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
  )
}

/* ══════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  /* Returning user — skip signup, go straight to dashboard */
  const returningUser = (() => {
    try { return JSON.parse(localStorage.getItem('crushky_user') || 'null') }
    catch { return null }
  })()

  /* Hero background ken-burns */
  const heroBgScale = useTransform(scrollY, [0, 800], [1, 1.12])
  const heroBgY     = useTransform(scrollY, [0, 800], [0, 100])

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
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => navigate('/login')}
            className="cursor-pointer transition-all hover:opacity-80"
            style={{
              fontSize: 13, fontWeight: 600, padding: '9px 24px', borderRadius: 100,
              background: scrolled ? INK : 'rgba(240,235,227,0.12)',
              color: CREAM,
              border: scrolled ? 'none' : '1px solid rgba(240,235,227,0.25)',
              backdropFilter: 'blur(8px)',
            }}>
            Log in
          </motion.button>
        </div>
      </nav>

      {/* ════ HERO ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end md:items-center overflow-hidden"
        style={{ background: INK }}>
        <motion.div className="absolute inset-0"
          style={{ scale: heroBgScale, y: heroBgY }}>
          {/* Dark bg layer shows for <0.5s while video buffers — better than a flash-of-different-photo */}
          <div className="absolute inset-0" style={{ background: INK }} />
          <video
            autoPlay muted loop playsInline preload="auto"
            className="w-full h-full object-cover object-center relative"
            style={{ display: 'block' }}>
            <source src="/vid/v1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(20,15,12,0.88) 0%, rgba(20,15,12,0.72) 45%, rgba(20,15,12,0.25) 100%)' }} />
          <Grain opacity={0.05} />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-24 md:pt-28 md:pb-0 w-full">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold"
              style={{ fontSize: 'clamp(38px, 8vw, 110px)', lineHeight: 0.98,
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
              No photos. No swiping. Just one real talk with AI — and a first date worth showing up for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
              <button onClick={() => navigate(returningUser ? '/dashboard' : '/start')}
                className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-2xl group"
                style={{ background: CREAM, color: INK, fontSize: 16, fontWeight: 700,
                  padding: '17px 40px', borderRadius: 100, letterSpacing: '0.01em' }}>
                {returningUser ? 'Pick up where you left off' : 'Start talking'}{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p style={{ color: 'rgba(240,235,227,0.45)', fontSize: 12, marginLeft: 4, marginTop: 4 }}>
                Free forever · Two minutes
              </p>
              <p style={{ color: 'rgba(240,235,227,0.55)', fontSize: 12, marginLeft: 4, marginTop: 2,
                fontStyle: 'italic' }}>
                For people who'd rather meet than swipe.
              </p>
            </motion.div>
          </div>
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

      {/* ════ PRODUCT PREVIEW (phone demo) ═══════════════ */}
      <ProductPreviewSection />

      {/* ════ STATEMENT ══════════════════════════════════ */}
      <StatementSection />

      {/* ════ STICKY CROSS-FADE STORY ════════════════════ */}
      <StoryScroll />

      {/* ════ REVOLVING PHOTO REEL ═══════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: CREAM, padding: '12vh 0 14vh' }}>
        <Grain opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10 px-6">
          <FadeIn>
            <h2 className="font-display font-bold text-center"
              style={{ fontSize: 'clamp(30px, 5.5vw, 64px)', color: INK,
                marginBottom: '3rem', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
              Then you only meet{' '}
              <em style={{ color: ROSE }}>the ones worth meeting.</em>
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={0.18}>
          <PhotoReel />
        </FadeIn>
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
              Skip the small talk. Tell Crushky who you are — we'll send you to meet someone who already gets it.
            </p>
          </FadeIn>
          <FadeIn delay={0.42}>
            <button onClick={() => navigate('/start')}
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
            <a href="mailto:vikram.aditya.connect@gmail.com"
              style={{ color: 'rgba(240,235,227,0.4)', fontSize: 14, textDecoration: 'none',
                transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = CREAM}
              onMouseLeave={e => e.target.style.color = 'rgba(240,235,227,0.4)'}>
              Contact
            </a>
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
