import { useState, useEffect, useRef, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveProfile } from '../lib/profile'

function shuffleArr(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Movie posters (TMDB public CDN) ───
const MOVIE_PICKS = [
  { id: 'interstellar',  title: 'Interstellar',    img: 'https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 'inception',     title: 'Inception',        img: 'https://image.tmdb.org/t/p/w185/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: 'dark-knight',   title: 'The Dark Knight',  img: 'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 'parasite',      title: 'Parasite',         img: 'https://image.tmdb.org/t/p/w185/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
  { id: 'shawshank',     title: 'Shawshank',        img: 'https://image.tmdb.org/t/p/w185/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
  { id: 'forrest',       title: 'Forrest Gump',     img: 'https://image.tmdb.org/t/p/w185/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
  { id: 'lalaland',      title: 'La La Land',       img: 'https://image.tmdb.org/t/p/w185/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg' },
  { id: 'oppenheimer',   title: 'Oppenheimer',      img: 'https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
  { id: 'dune',          title: 'Dune',             img: 'https://image.tmdb.org/t/p/w185/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
  { id: '3idiots',       title: '3 Idiots',         img: 'https://image.tmdb.org/t/p/w185/k6Np6L3EG7K2Z9PoMW3pI5PzmjY.jpg' },
  { id: 'znmd',          title: 'ZNMD',             img: 'https://image.tmdb.org/t/p/w185/eXUFhqAjfNXsuFkT9oH0Jx3mBr2.jpg' },
  { id: 'tamasha',       title: 'Tamasha',          img: 'https://image.tmdb.org/t/p/w185/sCmhjTMz1gAA2mANBcVP22rjq5x.jpg' },
]

// ─── Book covers (Open Library ISBN) ───
const BOOK_PICKS = [
  { id: 'sapiens',    title: 'Sapiens',           img: 'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg' },
  { id: 'atomic',     title: 'Atomic Habits',     img: 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg' },
  { id: 'alchemist',  title: 'The Alchemist',     img: 'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg' },
  { id: '1984',       title: '1984',              img: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg' },
  { id: 'zero',       title: 'Zero to One',       img: 'https://covers.openlibrary.org/b/isbn/9780804139021-M.jpg' },
  { id: 'norwegian',  title: 'Norwegian Wood',    img: 'https://covers.openlibrary.org/b/isbn/9780375704024-M.jpg' },
  { id: 'thinking',   title: 'Think Fast & Slow', img: 'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg' },
  { id: 'deepwork',   title: 'Deep Work',         img: 'https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg' },
  { id: 'ikigai',     title: 'Ikigai',            img: 'https://covers.openlibrary.org/b/isbn/9780143130727-M.jpg' },
]

// ─── Music artists — verified working Wikipedia thumbnails (June 2026) ───
const MUSIC_PICKS = [
  { id: 'taylor',    title: 'Taylor Swift',    sub: 'Pop',        palette: ['#3D1B2A', '#B85577'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/500px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png' },
  { id: 'bts',       title: 'BTS',             sub: 'K-Pop',      palette: ['#1F1F3D', '#6366D6'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg/500px-BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg' },
  { id: 'arijit',    title: 'Arijit Singh',    sub: 'Bollywood',  palette: ['#2D1B3D', '#7C3A92'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Arijit_Singh_performance_at_Chandigarh_2025.jpg/500px-Arijit_Singh_performance_at_Chandigarh_2025.jpg' },
  { id: 'rahman',    title: 'A.R. Rahman',     sub: 'Maestro',    palette: ['#1A3B5C', '#3F7CB0'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/AR_Rahman_At_The_%E2%80%98Marvel_Anthem%E2%80%99_Launch_%283x4_cropped%29.jpg/500px-AR_Rahman_At_The_%E2%80%98Marvel_Anthem%E2%80%99_Launch_%283x4_cropped%29.jpg' },
  { id: 'diljit',    title: 'Diljit Dosanjh',  sub: 'Punjabi',    palette: ['#2B3A1F', '#7A9F4A'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Diljit_Dosanjh.jpg' },
  { id: 'prateek',   title: 'Prateek Kuhad',   sub: 'Indie',      palette: ['#3D2D1A', '#C28456'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Prateek_Kuhad_New.jpg/500px-Prateek_Kuhad_New.jpg' },
  { id: 'anuv',      title: 'Anuv Jain',       sub: 'Acoustic',   palette: ['#1B3A3D', '#3F8E94'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Anuv_Jain_at_Ludhiana_concert.jpg/500px-Anuv_Jain_at_Ludhiana_concert.jpg' },
  { id: 'billie',    title: 'Billie Eilish',   sub: 'Alt-Pop',    palette: ['#1F2D1F', '#6B9A6B'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/500px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg' },
  { id: 'weeknd',    title: 'The Weeknd',      sub: 'R&B',        palette: ['#2A1B1B', '#A04848'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg/500px-The_Weeknd_Portrait_by_Brian_Ziff.jpg' },
  { id: 'shreya',    title: 'Shreya Ghoshal',  sub: 'Playback',   palette: ['#3D1F2D', '#B5547A'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Shreya_Ghoshal_Behindwoods_Gold_Icons_Awards_2023_%28cropped%29.jpg/500px-Shreya_Ghoshal_Behindwoods_Gold_Icons_Awards_2023_%28cropped%29.jpg' },
  { id: 'olivia',    title: 'Olivia Rodrigo',  sub: 'Pop-Rock',   palette: ['#3D1A33', '#A8467C'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Glasto2025-546_%28cropped%29_%282%29.jpg/500px-Glasto2025-546_%28cropped%29_%282%29.jpg' },
  { id: 'karan',     title: 'Karan Aujla',     sub: 'Hip-Hop',    palette: ['#2D2D3D', '#5F6FAA'],
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Karan_Aujla_2020.jpg/500px-Karan_Aujla_2020.jpg' },
]

const CATEGORIES = [
  { id: 'music', label: 'Music',       picks: MUSIC_PICKS },
  { id: 'film',  label: 'Movies & TV', picks: MOVIE_PICKS },
  { id: 'books', label: 'Books',       picks: BOOK_PICKS  },
]

const PROMPTS = [
  { id: 'weekend',       q: 'My perfect weekend looks like…',   ph: 'Coffee, bookstore, no plans honestly' },
  { id: 'geekout',       q: 'I get way too excited about',      ph: 'How startups go from 0 to 1. And street food.' },
  { id: 'controversial', q: "A hill I'll die on:",              ph: 'Maggi > any pasta. Period.' },
  { id: 'firstdate',     q: 'My ideal first date',              ph: 'Hidden cafe, no plan, great conversation' },
]

const DEMO_PHOTOS = ['/model/10.jpg', '/model/11.jpg', '/model/12.jpg']

// MVP: pre-filled so a demo user just taps the arrow through every screen.
// Add ?blank to start empty.
const IS_DEMO = typeof window === 'undefined' ||
  !new URLSearchParams(window.location.search).has('blank')

const DEMO_FORM = {
  name: 'Aditya',
  birthDay: '15', birthMonth: '08', birthYear: '2003',
  gender: 'Man', lookingFor: 'Women',
  heightFt: '5', heightIn: '10',
  city: 'Bangalore',
  work: 'Founders office at Teachmint',
  bio: 'Building things by day, debating film endings by night.',
  spotify: 'aditya.vibes',
  instagram: 'aditya.kumar_',
}

const BLANK_FORM = {
  name: '', birthDay: '', birthMonth: '', birthYear: '',
  gender: '', lookingFor: '', heightFt: '', heightIn: '',
  city: '', work: '', bio: '', spotify: '', instagram: '',
}

const DEMO_PROMPTS = {
  weekend: 'Coffee, bookstore, no plans honestly',
  geekout: 'How startups go from 0 to 1. And street food.',
  controversial: 'Maggi > any pasta. I will die on this hill.',
}

const DEMO_INTERESTS = { music: ['prateek', 'arijit', 'weeknd'], film: ['interstellar', 'tamasha'], books: ['norwegian'] }

// ── Shared bits ──────────────────────────────────────────
const SignupInput = forwardRef(function SignupInput({ className = '', ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full bg-transparent border-0 border-b-2 border-dark-text/10 pb-3 outline-none focus:border-rose/60 transition-colors text-dark-text placeholder:text-dark-text/20 ${className}`}
      {...rest}
    />
  )
})

// Hinge-style option row: full-width, divider, radio circle on the right
function OptionRow({ label, selected, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between py-4 border-b border-dark-text/8 cursor-pointer group">
      <span className={`text-base transition-colors ${selected ? 'text-dark-text font-semibold' : 'text-dark-text/60'}`}>
        {label}
      </span>
      <span className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
        style={{
          border: selected ? 'none' : '2px solid rgba(26,20,16,0.18)',
          background: selected ? '#C94B4B' : 'transparent',
        }}>
        {selected && <span className="text-white text-[11px] font-bold">✓</span>}
      </span>
    </button>
  )
}

function ContinueFab({ onClick, disabled }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-7 pt-10 pointer-events-none"
      style={{ background: 'linear-gradient(to top, rgba(250,250,248,0.97) 40%, transparent)' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="pointer-events-auto block w-full max-w-md mx-auto py-4 rounded-full text-white font-bold text-[15px] cursor-pointer transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
        style={{ background: '#C94B4B', boxShadow: '0 10px 30px rgba(201,75,75,0.35)' }}>
        Continue
      </button>
    </div>
  )
}

// Editorial one-question scaffold — magazine-style: typographic step marker,
// oversized Playfair headline, generous whitespace.
function Screen({ n, total, kicker, title, subtitle, children }) {
  return (
    <div className="min-h-screen px-7 pt-28 pb-40 max-w-md mx-auto w-full au">
      {/* Step marker */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-display italic text-rose" style={{ fontSize: 19 }}>
          {String(n).padStart(2, '0')}
        </span>
        <span className="text-dark-text/20 text-xs">/ {String(total).padStart(2, '0')}</span>
        <span className="h-px flex-1 bg-dark-text/10" />
        <span className="text-dark-text/40 text-[10px] font-semibold tracking-[0.25em] uppercase">{kicker}</span>
      </div>

      {/* Oversized headline */}
      <h1 className="font-display font-bold text-dark-text mb-3"
        style={{ fontSize: 'clamp(32px, 9vw, 46px)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
        {title}
      </h1>
      {subtitle && <p className="text-dark-text/45 text-[15px] leading-relaxed mb-12 max-w-sm">{subtitle}</p>}
      {!subtitle && <div className="mb-12" />}
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back

  const [form, setForm] = useState(IS_DEMO ? DEMO_FORM : BLANK_FORM)
  const [interests, setInterests] = useState(IS_DEMO ? DEMO_INTERESTS : {})
  const [prompts, setPrompts] = useState(IS_DEMO ? DEMO_PROMPTS : {})
  const [selectedPhotos, setSelectedPhotos] = useState(IS_DEMO ? [0, 1, 2] : [])

  const STEPS = ['basics', 'identity', 'world', 'interests', 'prompts', 'photos']
  const current = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  const transition = (toStep) => {
    if (transitioning) return
    setDirection(toStep > step ? 1 : -1)
    setTransitioning(true)
    setVisible(false)
    setTimeout(() => {
      setStep(toStep)
      setVisible(true)
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 220)
  }

  const next = () => {
    if (step === STEPS.length - 1) return finish()
    transition(step + 1)
  }
  const back = () => step === 0 ? navigate('/start') : transition(step - 1)

  const finish = async () => {
    localStorage.setItem('crushky_user', JSON.stringify({
      ...form,
      dob: `${form.birthYear}-${String(form.birthMonth).padStart(2, '0')}-${String(form.birthDay).padStart(2, '0')}`,
      interests, prompts, photos: selectedPhotos,
    }))
    // Save to the real database too (never blocks navigation if it fails/slow)
    try {
      await Promise.race([
        saveProfile(form, { interests, prompts, photos: selectedPhotos }),
        new Promise(r => setTimeout(r, 1500)),
      ])
    } catch { /* ignore — demo still proceeds */ }
    navigate('/dashboard')
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  // per-screen validation
  const canContinue = {
    basics: form.name.trim().length > 1 && form.birthDay && form.birthMonth && String(form.birthYear).length === 4,
    identity: !!form.gender && !!form.lookingFor,
    world: form.city.trim().length > 1 && form.work.trim().length > 1,
    interests: Object.values(interests).flat().length >= 1,
    prompts: Object.values(prompts).some(v => v?.trim()),
    photos: true,
  }[current]

  // interests sub-state
  const [openCat, setOpenCat] = useState('music')
  const [slices, setSlices] = useState(() => {
    const init = {}
    CATEGORIES.forEach(c => { init[c.id] = shuffleArr(c.picks).slice(0, 6) })
    return init
  })
  const reshuffle = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId)
    setSlices(prev => ({ ...prev, [catId]: shuffleArr(cat.picks).slice(0, 6) }))
  }
  const toggleInterest = (catId, id) => {
    setInterests(prev => {
      const cur = prev[catId] || []
      return { ...prev, [catId]: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] }
    })
  }

  const totalPicked = Object.values(interests).flat().length

  return (
    <div className="min-h-screen relative"
      style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F6EFE6 100%)' }}>
      {/* Soft warm accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute" style={{
          top: 0, right: 0, width: '50vw', height: '40vh',
          background: 'radial-gradient(ellipse at top right, rgba(201,75,75,0.05), transparent 65%)' }} />
        <div className="absolute" style={{
          bottom: 0, left: 0, width: '60vw', height: '35vh',
          background: 'radial-gradient(ellipse at bottom left, rgba(212,149,106,0.06), transparent 65%)' }} />
      </div>
      {/* Visible rose progress bar with soft glow */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-text/6" style={{ height: 3 }}>
        <div className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: '#C94B4B',
            boxShadow: '0 0 8px rgba(201,75,75,0.5)', borderRadius: '0 3px 3px 0' }} />
      </div>

      {/* Back */}
      <button onClick={back}
        className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full bg-white border border-dark-text/8 flex items-center justify-center text-dark-text/50 hover:text-dark-text cursor-pointer transition-all shadow-sm">
        ←
      </button>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : `translateX(${direction * -36}px)`,
        transition: 'opacity 220ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* ── BASICS: name + birthday ── */}
        {current === 'basics' && (
          <Screen n={1} total={6} kicker="Basics" title="Let's start with the basics." subtitle="Your name and birthday — we only ever show your age.">
            <p className="text-dark-text/50 text-sm font-medium mb-3">First name</p>
            <SignupInput
              autoFocus
              value={form.name}
              onChange={set('name')}
              placeholder="First name"
              className="text-3xl mb-10"
            />
            <p className="text-dark-text/50 text-sm font-medium mb-3">Birthday</p>
            <div className="flex items-end gap-3">
              {[
                { field: 'birthDay',   ph: 'DD',   w: 'w-14' },
                { field: 'birthMonth', ph: 'MM',   w: 'w-14' },
                { field: 'birthYear',  ph: 'YYYY', w: 'w-24' },
              ].map((f, i) => (
                <div key={f.field} className="flex items-end gap-3">
                  {i > 0 && <span className="text-dark-text/15 text-2xl pb-2">/</span>}
                  <SignupInput
                    type="number" inputMode="numeric"
                    value={form[f.field]} onChange={set(f.field)}
                    placeholder={f.ph}
                    className={`text-2xl ${f.w}`}
                  />
                </div>
              ))}
            </div>
          </Screen>
        )}

        {/* ── IDENTITY: gender + seeking ── */}
        {current === 'identity' && (
          <Screen n={2} total={6} kicker="Identity" title="You, and who you're here for.">
            <p className="text-dark-text/50 text-sm font-medium mb-1">I am a</p>
            <div className="mb-10">
              {['Man', 'Woman', 'Non-binary'].map(g => (
                <OptionRow key={g} label={g} selected={form.gender === g}
                  onClick={() => setForm(f => ({ ...f, gender: g }))} />
              ))}
            </div>
            <p className="text-dark-text/50 text-sm font-medium mb-1">I want to meet</p>
            <div>
              {['Women', 'Men', 'Everyone'].map(l => (
                <OptionRow key={l} label={l} selected={form.lookingFor === l}
                  onClick={() => setForm(f => ({ ...f, lookingFor: l }))} />
              ))}
            </div>
          </Screen>
        )}

        {/* ── WORLD: city + work ── */}
        {current === 'world' && (
          <Screen n={3} total={6} kicker="Your world" title="Your world." subtitle="We match you in your city — no long-distance roulette.">
            <p className="text-dark-text/50 text-sm font-medium mb-3">City</p>
            <SignupInput
              value={form.city} onChange={set('city')}
              placeholder="Your city" className="text-2xl"
            />
            <div className="flex gap-2.5 flex-wrap mt-4 mb-10">
              {['Bangalore', 'Mumbai', 'Delhi'].map(c => (
                <button key={c}
                  onClick={() => setForm(f => ({ ...f, city: c }))}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                    form.city === c
                      ? 'bg-rose text-white border-rose shadow-sm'
                      : 'bg-white text-dark-text/55 border-dark-text/12 hover:border-rose/30'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <p className="text-dark-text/50 text-sm font-medium mb-3">What you do</p>
            <SignupInput
              value={form.work} onChange={set('work')}
              onKeyDown={e => e.key === 'Enter' && canContinue && next()}
              placeholder="Job, startup, studying…" className="text-2xl"
            />
          </Screen>
        )}

        {/* ── INTERESTS ── */}
        {current === 'interests' && (
          <Screen n={4} total={6} kicker="Taste" title="What are you into?" subtitle="Tap what you love. Crushky listens to taste, not just looks.">
            {/* Category pills */}
            <div className="flex gap-2 mb-5">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setOpenCat(c.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    openCat === c.id ? 'bg-dark-text text-white' : 'bg-white text-dark-text/50 border border-dark-text/10'
                  }`}>
                  {c.label}
                  {(interests[c.id]?.length || 0) > 0 && (
                    <span className="ml-1.5 text-rose">{`·${interests[c.id].length}`}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Poster grid 3×2 */}
            <div className="grid grid-cols-3 gap-2">
              {(slices[openCat] || []).map(item => {
                const isSel = (interests[openCat] || []).includes(item.id)
                const palette = item.palette || ['#2D3B2D', '#1a2820']
                return (
                  <button key={item.id} onClick={() => toggleInterest(openCat, item.id)}
                    className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{
                      aspectRatio: '2/3',
                      border: isSel ? '2.5px solid #C94B4B' : '2.5px solid transparent',
                      boxShadow: isSel ? '0 0 14px rgba(201,75,75,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                    }}>
                    <img src={item.img} alt={item.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        const fb = e.currentTarget.nextElementSibling
                        if (fb) fb.style.display = 'flex'
                      }} />
                    <div className="absolute inset-0 flex-col items-center justify-center text-center px-1.5 py-2 text-white"
                      style={{ display: 'none', background: `linear-gradient(155deg, ${palette[0]}, ${palette[1]})` }}>
                      <span className="font-display italic font-bold leading-tight" style={{ fontSize: 12 }}>
                        {item.title}
                      </span>
                      {item.sub && <span className="mt-1 tracking-[0.2em] uppercase opacity-70" style={{ fontSize: 8 }}>{item.sub}</span>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 pt-4 pb-1"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                      <p className="text-[9px] text-white font-medium leading-tight truncate">{item.title}</p>
                    </div>
                    {isSel && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose flex items-center justify-center shadow-sm">
                        <span className="text-white text-[9px] font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <button onClick={() => reshuffle(openCat)}
              className="mt-4 text-rose/70 text-xs font-semibold hover:text-rose transition-colors cursor-pointer">
              ↻ Show me different ones
            </button>

            {totalPicked >= 2 && (
              <div className="mt-6 flex items-start gap-2.5 bg-white border border-rose/15 rounded-2xl px-4 py-3.5">
                <span className="text-rose text-sm mt-0.5">✦</span>
                <p className="text-dark-text/60 text-xs leading-relaxed italic">
                  {(interests.music || []).includes('prateek')
                    ? "Prateek Kuhad fan? Say less. I already have someone in mind…"
                    : "Good taste. I'm starting to see who you'd click with."}
                </p>
              </div>
            )}
          </Screen>
        )}

        {/* ── PROMPTS ── */}
        {current === 'prompts' && (
          <Screen n={5} total={6} kicker="Your words" title="Say it in your words." subtitle="Answer one. This is what makes people stop scrolling.">
            <div className="space-y-3">
              {PROMPTS.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-dark-text/8 px-4 py-4">
                  <p className={`text-sm font-semibold mb-2 ${prompts[p.id]?.trim() ? 'text-rose' : 'text-dark-text/60'}`}>
                    {p.q}
                  </p>
                  <textarea
                    value={prompts[p.id] || ''}
                    onChange={e => setPrompts(prev => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder={p.ph}
                    rows={2}
                    className="w-full bg-transparent text-dark-text/80 text-sm outline-none placeholder:text-dark-text/20 resize-none"
                  />
                </div>
              ))}
            </div>
          </Screen>
        )}

        {/* ── PHOTOS + PREVIEW ── */}
        {current === 'photos' && (
          <Screen n={6} total={6} kicker="Photos" title="Last one — pick your photos." subtitle="Demo photos for now. Tap to select.">
            <div className="flex gap-3 mb-10">
              {DEMO_PHOTOS.map((photo, i) => {
                const rotations = [-3, 1.5, -1]
                const isSel = selectedPhotos.includes(i)
                return (
                  <button key={i}
                    onClick={() => setSelectedPhotos(prev =>
                      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    className="relative cursor-pointer transition-all duration-300"
                    style={{ transform: `rotate(${rotations[i]}deg) scale(${isSel ? 1.04 : 1})` }}>
                    <div className={`border-[1.5px] rounded-lg overflow-hidden transition-all ${
                      isSel ? 'border-rose shadow-[0_0_16px_rgba(201,75,75,0.25)]' : 'border-dark-text/10'
                    }`} style={{ background: '#fff', padding: '5px 5px 18px 5px' }}>
                      <img src={photo} alt="" className="w-24 h-32 object-cover rounded-sm" />
                    </div>
                    {isSel && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-white">✓</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Profile preview card */}
            <p className="text-dark-text/50 text-sm font-medium mb-3">Here's how you'll appear</p>
            <div className="bg-white border border-dark-text/8 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                {selectedPhotos.length > 0 ? (
                  <img src={DEMO_PHOTOS[selectedPhotos[0]]} className="w-14 h-14 rounded-xl object-cover" alt="" />
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
                    {form.name ? form.name[0].toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <p className="font-display font-bold text-lg text-dark-text">
                    {form.name || 'You'}, {form.birthYear ? new Date().getFullYear() - parseInt(form.birthYear) : '–'}
                  </p>
                  <p className="text-dark-text/45 text-xs">{form.city} · {form.work}</p>
                </div>
              </div>
              {Object.entries(prompts).filter(([, v]) => v?.trim()).slice(0, 2).map(([id, v]) => {
                const q = PROMPTS.find(p => p.id === id)?.q
                return (
                  <div key={id} className="mb-3 bg-cream rounded-xl px-3.5 py-3">
                    <p className="text-rose text-[10px] font-medium mb-0.5">{q}</p>
                    <p className="text-dark-text/70 text-xs">{v}</p>
                  </div>
                )
              })}
            </div>
          </Screen>
        )}
      </div>

      <ContinueFab onClick={next} disabled={!canContinue} />
    </div>
  )
}
