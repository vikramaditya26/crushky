import { useState, useEffect, useRef, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

// ─── Interest categories ───
const CATEGORIES = [
  {
    id: 'music', icon: '🎵', label: 'Music',
    options: ['Indie', 'Bollywood', 'Hip-Hop', 'Classical', 'Jazz', 'Rock', 'Pop', 'Electronic', 'Lo-fi'],
  },
  { id: 'film',  icon: '🎬', label: 'Movies & TV', type: 'images', picks: MOVIE_PICKS },
  { id: 'books', icon: '📚', label: 'Books',        type: 'images', picks: BOOK_PICKS  },
  {
    id: 'travel', icon: '✈️', label: 'Travel',
    options: ['Europe', 'Southeast Asia', 'Mountains', 'Beaches', 'Road trips', 'Solo travel', 'Backpacking', 'City breaks'],
  },
  {
    id: 'food', icon: '🍳', label: 'Food',
    options: ['Street food', 'Fine dining', 'Cooking', 'Cafes', 'Baking', 'Trying cuisines', 'Night food runs', 'Health food'],
  },
  {
    id: 'hobbies', icon: '🎯', label: 'Hobbies',
    options: ['Running', 'Gaming', 'Photography', 'Writing', 'Yoga', 'Gym', 'Rock climbing', 'Painting'],
  },
]

const PROMPTS = [
  { id: 'weekend',       q: 'My perfect weekend looks like...',      ph: 'Coffee, bookstore, no plans honestly' },
  { id: 'geekout',       q: 'I get genuinely excited about',         ph: 'How startups go from 0 to 1. And street food.' },
  { id: 'controversial', q: 'Unpopular opinion I will die on:',      ph: 'Maggi is better than any pasta. Period.' },
  { id: 'firstdate',     q: 'A perfect first date looks like',       ph: 'Hidden cafe, no plan, great conversation' },
  { id: 'dealbreaker',   q: 'My non-negotiable is',                  ph: 'Honesty. No games, ever.' },
  { id: 'secret',        q: 'People are surprised to learn I',       ph: "I can cook better than most restaurants" },
]

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=420&fit=crop&crop=face,top',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=420&fit=crop&crop=face,top',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=420&fit=crop&crop=faces,top',
]

// ── Shared input — clean underline on cream bg ──
const SignupInput = forwardRef(function SignupInput({ value, onChange, placeholder, type = 'text', className = '', ...rest }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-transparent border-0 border-b border-dark-text/15 pb-3 outline-none focus:border-rose/50 transition-colors text-dark-text placeholder:text-dark-text/25 ${className}`}
      {...rest}
    />
  )
})

// ── Option pill (gender / lookingFor) ──
function OptionPill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border cursor-pointer ${
        selected
          ? 'bg-rose text-white border-rose shadow-sm'
          : 'bg-white text-dark-text/55 border-dark-text/12 hover:border-rose/30 hover:text-dark-text/80'
      }`}
    >
      {label}
    </button>
  )
}

// ── Interest text chip ──
function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
        selected
          ? 'bg-rose text-white border-rose'
          : 'bg-white text-dark-text/50 border-dark-text/10 hover:border-rose/25 hover:text-dark-text/70'
      }`}
    >
      {label}
    </button>
  )
}

// ── Movie / Book visual picker ──
function ImagePicker({ items, selected, onToggle }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2 pb-1">
      {items.map(item => {
        const isSel = selected.includes(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
            style={{
              aspectRatio: '2/3',
              border: isSel ? '2.5px solid #C94B4B' : '2.5px solid transparent',
              boxShadow: isSel ? '0 0 12px rgba(201,75,75,0.25)' : 'none',
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.nextElementSibling
                if (fb) fb.style.display = 'flex'
              }}
            />
            {/* Fallback when image 404s */}
            <div
              className="absolute inset-0 items-center justify-center text-xs text-center p-2 font-semibold text-white leading-tight"
              style={{ display: 'none', background: 'linear-gradient(135deg, #2D3B2D, #1a2820)' }}
            >
              {item.title}
            </div>
            {/* Title gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 px-1.5 pt-5 pb-1"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
            >
              <p className="text-[8px] text-white font-medium leading-tight truncate">{item.title}</p>
            </div>
            {/* Selected check badge */}
            {isSel && (
              <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose flex items-center justify-center shadow-sm">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Soft aurora tints (light-bg friendly) ──
function Aurora() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute rounded-full" style={{
        top: '-20%', right: '-20%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(201,75,75,0.07) 0%, transparent 70%)',
        filter: 'blur(100px)',
      }} />
      <div className="absolute rounded-full" style={{
        bottom: '-25%', left: '-20%', width: '65vw', height: '65vw',
        background: 'radial-gradient(circle, rgba(45,59,45,0.06) 0%, transparent 70%)',
        filter: 'blur(120px)',
      }} />
      <div className="absolute rounded-full" style={{
        top: '40%', left: '25%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(212,149,106,0.05) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }} />
    </div>
  )
}

// ══════════════════════════════════
//   STEP 1 — Identity
// ══════════════════════════════════
function Step1({ form, setForm, onNext }) {
  const nameRef = useRef()
  useEffect(() => { nameRef.current?.focus() }, [])

  const canContinue = form.name.trim() && form.gender && form.lookingFor

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 pb-16 px-6 text-center relative z-10">
      <p className="text-dark-text/30 text-[10px] tracking-[0.4em] uppercase mb-12">STEP 01 / 04</p>

      <h1 className="font-display text-3xl md:text-4xl italic text-dark-text leading-snug mb-10 ru" style={{ animationDelay: '0.1s' }}>
        First things first —<br />
        <span className="text-rose">what do we call you?</span>
      </h1>

      {/* Name */}
      <div className="w-full max-w-xs mb-6 ru" style={{ animationDelay: '0.2s' }}>
        <SignupInput
          ref={nameRef}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          onKeyDown={e => e.key === 'Enter' && form.name.trim().length > 1 && canContinue && onNext()}
          className="text-3xl text-center tracking-wide"
        />
      </div>

      {form.name.trim().length > 1 && (
        <div className="w-full max-w-sm space-y-10 ru" style={{ animationDelay: '0s' }}>

          {/* Birthday */}
          <div>
            <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-5">Birthday</p>
            <div className="flex items-end justify-center gap-2">
              {[
                { field: 'birthDay',   label: 'DAY',   ph: 'DD',   min: 1, max: 31,   w: 'w-16' },
                { field: 'birthMonth', label: 'MONTH', ph: 'MM',   min: 1, max: 12,   w: 'w-16' },
                { field: 'birthYear',  label: 'YEAR',  ph: 'YYYY', min: 1990, max: 2007, w: 'w-24' },
              ].map((f, i) => (
                <div key={f.field} className="flex items-end gap-2">
                  {i > 0 && <span className="text-dark-text/20 text-xl mb-5">/</span>}
                  <div className="text-center">
                    <SignupInput
                      type="number"
                      value={form[f.field]}
                      onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                      placeholder={f.ph}
                      min={f.min} max={f.max}
                      className={`text-2xl text-center ${f.w}`}
                    />
                    <p className="text-dark-text/25 text-[9px] mt-1.5 tracking-widest">{f.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-dark-text/25 text-[10px] mt-3">We only show your age, never the date</p>
          </div>

          {/* Height */}
          <div>
            <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-5">Height</p>
            <div className="flex items-end justify-center gap-3">
              <div className="text-center">
                <SignupInput
                  type="number" value={form.heightFt}
                  onChange={e => setForm(f => ({ ...f, heightFt: e.target.value }))}
                  min="4" max="7" className="text-4xl text-center w-16"
                />
                <p className="text-dark-text/25 text-[9px] mt-1.5 tracking-widest">FT</p>
              </div>
              <span className="text-dark-text/25 text-3xl mb-6 select-none">'</span>
              <div className="text-center">
                <SignupInput
                  type="number" value={form.heightIn}
                  onChange={e => setForm(f => ({ ...f, heightIn: e.target.value }))}
                  min="0" max="11" className="text-4xl text-center w-16"
                />
                <p className="text-dark-text/25 text-[9px] mt-1.5 tracking-widest">IN</p>
              </div>
              <span className="text-dark-text/25 text-2xl mb-6 select-none">"</span>
            </div>
          </div>

          {/* Gender */}
          <div>
            <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-5">I identify as</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Man', 'Woman', 'Non-binary'].map(g => (
                <OptionPill key={g} label={g} selected={form.gender === g} onClick={() => setForm(f => ({ ...f, gender: g }))} />
              ))}
            </div>
          </div>

          {/* Looking for */}
          <div>
            <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-5">I want to meet</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Women', 'Men', 'Everyone'].map(l => (
                <OptionPill key={l} label={l} selected={form.lookingFor === l} onClick={() => setForm(f => ({ ...f, lookingFor: l }))} />
              ))}
            </div>
          </div>
        </div>
      )}

      {canContinue && (
        <button
          onClick={onNext}
          className="mt-14 px-10 py-3.5 rounded-full text-white text-sm font-semibold cursor-pointer transition-all hover:scale-105 hover:shadow-lg ru"
          style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)', animationDelay: '0s' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════
//   STEP 2 — Your World
// ══════════════════════════════════
function Step2({ form, setForm, onNext }) {
  const cityRef = useRef()
  useEffect(() => { cityRef.current?.focus() }, [])
  const canContinue = form.city.trim() && form.work.trim()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative z-10">
      <p className="text-dark-text/30 text-[10px] tracking-[0.4em] uppercase mb-12">STEP 02 / 04</p>

      <h1 className="font-display text-3xl md:text-4xl italic text-dark-text leading-snug mb-16 ru" style={{ animationDelay: '0.1s' }}>
        Tell us about<br />
        <span style={{ color: '#D4956A' }}>your world.</span>
      </h1>

      <div className="w-full max-w-sm space-y-12 ru" style={{ animationDelay: '0.2s' }}>
        <div>
          <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-4">Where are you?</p>
          <SignupInput
            ref={cityRef}
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="Your city"
            className="text-2xl text-center"
          />
        </div>
        <div>
          <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-4">What do you do?</p>
          <SignupInput
            value={form.work}
            onChange={e => setForm(f => ({ ...f, work: e.target.value }))}
            placeholder="Your work"
            className="text-2xl text-center"
          />
        </div>
      </div>

      {canContinue && (
        <button
          onClick={onNext}
          className="mt-16 px-10 py-3.5 rounded-full text-white text-sm font-semibold cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════
//   STEP 3 — Interests & Prompts
// ══════════════════════════════════
function Step3({ interests, setInterests, prompts, setPrompts, onNext }) {
  const [expandedCat, setExpandedCat] = useState(null)
  const [activePrompt, setActivePrompt] = useState(null)

  const toggleInterest = (catId, option) => {
    setInterests(prev => {
      const cat = prev[catId] || []
      return { ...prev, [catId]: cat.includes(option) ? cat.filter(x => x !== option) : [...cat, option] }
    })
  }

  const totalSelected = Object.values(interests).flat().length
  const canContinue = totalSelected >= 3 || Object.values(prompts).some(v => v?.trim())

  return (
    <div className="flex flex-col items-start min-h-screen px-5 pt-16 pb-24 relative z-10 max-w-sm mx-auto w-full">
      <p className="text-dark-text/30 text-[10px] tracking-[0.4em] uppercase mb-8 w-full text-center">STEP 03 / 04</p>

      <h1 className="font-display text-3xl italic text-dark-text leading-snug mb-2 w-full text-center ru">
        What lights<br /><span style={{ color: '#8FA68F' }}>you up?</span>
      </h1>
      <p className="text-dark-text/35 text-xs text-center w-full mb-10">Pick a few. This is what people see first.</p>

      {/* Categories */}
      <div className="w-full space-y-2 mb-10">
        {CATEGORIES.map(cat => {
          const selected = interests[cat.id] || []
          const isOpen = expandedCat === cat.id

          return (
            <div key={cat.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-dark-text/10 bg-white shadow-sm'
                  : 'border-dark-text/6 bg-white/60 hover:border-dark-text/12 hover:bg-white/80'
              }`}
            >
              <button
                onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-dark-text/70 text-sm font-medium">{cat.label}</span>
                  {selected.length > 0 && (
                    <span className="bg-rose text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {selected.length}
                    </span>
                  )}
                </div>
                <span className={`text-dark-text/30 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {cat.type === 'images' ? (
                    <ImagePicker
                      items={cat.picks}
                      selected={selected}
                      onToggle={(id) => toggleInterest(cat.id, id)}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cat.options.map(opt => (
                        <Chip
                          key={opt} label={opt}
                          selected={selected.includes(opt)}
                          onClick={() => toggleInterest(cat.id, opt)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Prompts */}
      <p className="text-dark-text/30 text-[10px] tracking-[0.35em] uppercase mb-4 w-full">In your own words</p>
      <div className="w-full space-y-2 mb-10">
        {PROMPTS.slice(0, 4).map(prompt => (
          <div key={prompt.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              activePrompt === prompt.id ? 'border-dark-text/10 bg-white shadow-sm' : 'border-dark-text/6 bg-white/60'
            }`}
          >
            <button
              onClick={() => setActivePrompt(activePrompt === prompt.id ? null : prompt.id)}
              className="w-full text-left px-4 py-3.5 cursor-pointer"
            >
              <p className={`text-sm font-medium transition-colors ${prompts[prompt.id]?.trim() ? 'text-rose' : 'text-dark-text/45'}`}>
                {prompt.q}
              </p>
              {prompts[prompt.id]?.trim() && activePrompt !== prompt.id && (
                <p className="text-dark-text/50 text-xs mt-1 line-clamp-1">{prompts[prompt.id]}</p>
              )}
            </button>
            {activePrompt === prompt.id && (
              <div className="px-4 pb-4">
                <textarea
                  value={prompts[prompt.id] || ''}
                  onChange={e => setPrompts(p => ({ ...p, [prompt.id]: e.target.value }))}
                  placeholder={prompt.ph}
                  autoFocus
                  rows={2}
                  className="w-full bg-transparent text-dark-text/80 text-sm outline-none placeholder:text-dark-text/20 resize-none border-b border-dark-text/10 pb-2"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {canContinue && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full text-white text-sm font-semibold cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════
//   STEP 4 — Photos + Preview
// ══════════════════════════════════
function Step4({ form, setForm, selectedPhotos, setSelectedPhotos, prompts, interests, onFinish }) {
  const age = form.birthYear ? new Date().getFullYear() - parseInt(form.birthYear) : 22
  const filledPrompts = PROMPTS.filter(p => prompts[p.id]?.trim())
  const totalInterests = Object.values(interests).flat()

  return (
    <div className="flex flex-col items-center min-h-screen px-5 pt-16 pb-24 relative z-10 max-w-sm mx-auto w-full">
      <p className="text-dark-text/30 text-[10px] tracking-[0.4em] uppercase mb-8 text-center w-full">STEP 04 / 04</p>

      <h1 className="font-display text-3xl italic text-dark-text leading-snug mb-3 text-center w-full ru">
        Almost there —<br /><span style={{ color: '#D4956A' }}>show yourself.</span>
      </h1>
      <p className="text-dark-text/30 text-xs text-center mb-10">Photos are optional for the demo.</p>

      {/* Polaroid photos */}
      <div className="w-full mb-10">
        <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-5">Photos</p>
        <div className="flex gap-3 justify-center">
          {DEMO_PHOTOS.map((photo, i) => {
            const rotations = [-3, 1.5, -1]
            const isSel = selectedPhotos.includes(i)
            return (
              <button
                key={i}
                onClick={() => setSelectedPhotos(prev =>
                  prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                )}
                className="relative cursor-pointer transition-all duration-300"
                style={{ transform: `rotate(${rotations[i]}deg) scale(${isSel ? 1.04 : 1})` }}
              >
                <div
                  className={`border-[1.5px] rounded-lg overflow-hidden transition-all duration-300 ${
                    isSel ? 'border-rose shadow-[0_0_16px_rgba(201,75,75,0.25)]' : 'border-dark-text/10'
                  }`}
                  style={{ background: '#fff', padding: '5px 5px 18px 5px' }}
                >
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-24 h-32 object-cover rounded-sm" />
                </div>
                {isSel && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-white">
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-dark-text/25 text-[10px] text-center mt-4">Click to select · These are demo photos</p>
      </div>

      {/* Socials */}
      <div className="w-full space-y-6 mb-10">
        <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase">Socials</p>
        <div className="flex items-end gap-3">
          <span className="text-dark-text/40 text-sm mb-3 shrink-0">🎵</span>
          <div className="flex-1">
            <p className="text-dark-text/30 text-[9px] tracking-widest uppercase mb-2">Spotify</p>
            <SignupInput
              value={form.spotify}
              onChange={e => setForm(f => ({ ...f, spotify: e.target.value }))}
              placeholder="username"
            />
          </div>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-dark-text/40 text-sm mb-3 shrink-0">📸</span>
          <div className="flex-1">
            <p className="text-dark-text/30 text-[9px] tracking-widest uppercase mb-2">Instagram</p>
            <SignupInput
              value={form.instagram}
              onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
              placeholder="@handle"
            />
          </div>
        </div>
      </div>

      {/* Live profile preview */}
      <div className="w-full mb-10">
        <p className="text-dark-text/35 text-[10px] tracking-[0.35em] uppercase mb-4">Your profile preview</p>
        <div className="bg-white border border-dark-text/8 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            {selectedPhotos.length > 0 ? (
              <img src={DEMO_PHOTOS[selectedPhotos[0]]} className="w-14 h-14 rounded-xl object-cover" alt="profile" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}>
                {form.name ? form.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div>
              <p className="font-display font-bold text-lg text-dark-text">{form.name || 'You'}, {age}</p>
              <p className="text-dark-text/45 text-xs">{form.city || 'Your city'} · {form.work || 'What you do'}</p>
            </div>
          </div>
          {filledPrompts.slice(0, 2).map(p => (
            <div key={p.id} className="mb-3 bg-cream rounded-xl px-3.5 py-3">
              <p className="text-rose text-[10px] font-medium mb-0.5">{p.q}</p>
              <p className="text-dark-text/70 text-xs">{prompts[p.id]}</p>
            </div>
          ))}
          {totalInterests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {totalInterests.slice(0, 5).map(t => (
                <span key={t} className="bg-cream text-dark-text/50 text-[10px] px-2.5 py-1 rounded-full border border-dark-text/8">
                  {t}
                </span>
              ))}
              {totalInterests.length > 5 && (
                <span className="text-dark-text/30 text-[10px] py-1">+{totalInterests.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full py-4 rounded-full text-white text-base font-semibold cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #C94B4B, #D4956A)' }}
      >
        Let's find your person ✦
      </button>
    </div>
  )
}

// ══════════════════════════════════
//   MAIN SIGNUP COMPONENT
// ══════════════════════════════════
export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(true)
  const [transitioning, setTransitioning] = useState(false)

  const [form, setForm] = useState({
    name: 'Aditya',
    birthDay: '15', birthMonth: '08', birthYear: '2003',
    gender: 'Man', lookingFor: 'Women',
    heightFt: '5', heightIn: '10',
    city: '',
    work: 'Founders office at Teachmint',
    spotify: 'aditya.vibes',
    instagram: 'aditya.kumar_',
  })
  const [interests, setInterests] = useState({})
  const [prompts, setPrompts] = useState({
    weekend: 'Coffee, bookstore, no plans honestly',
    geekout: 'How startups go from 0 to 1. And street food.',
    controversial: 'Maggi is better than any pasta. I will die on this hill.',
  })
  const [selectedPhotos, setSelectedPhotos] = useState([0, 1, 2])

  const transition = (toStep) => {
    if (transitioning) return
    setTransitioning(true)
    setVisible(false)
    setTimeout(() => {
      setStep(toStep)
      setVisible(true)
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 320)
  }

  const handleNext = () => transition(step + 1)
  const handleBack = () => step === 1 ? navigate('/') : transition(step - 1)

  const handleFinish = () => {
    localStorage.setItem('crushky_user', JSON.stringify({
      ...form,
      dob: `${form.birthYear}-${form.birthMonth.padStart(2,'0')}-${form.birthDay.padStart(2,'0')}`,
      interests, prompts, photos: selectedPhotos,
    }))
    navigate('/dashboard')
  }

  const progress = (step / 4) * 100

  return (
    <div className="min-h-screen relative" style={{ background: '#F7F4EF' }}>
      <Aurora />

      {/* Rose progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-dark-text/5">
        <div className="h-full bg-rose transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Back */}
      <button
        onClick={handleBack}
        className="fixed top-5 left-5 z-50 text-dark-text/35 text-sm hover:text-dark-text/70 transition-colors cursor-pointer flex items-center gap-1.5"
      >
        ← {step === 1 ? 'Home' : 'Back'}
      </button>

      {/* Step content */}
      <div
        className="transition-all duration-320"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        {step === 1 && <Step1 form={form} setForm={setForm} onNext={handleNext} />}
        {step === 2 && <Step2 form={form} setForm={setForm} onNext={handleNext} />}
        {step === 3 && (
          <Step3
            interests={interests} setInterests={setInterests}
            prompts={prompts} setPrompts={setPrompts}
            onNext={handleNext}
          />
        )}
        {step === 4 && (
          <Step4
            form={form} setForm={setForm}
            selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos}
            prompts={prompts} interests={interests}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  )
}
