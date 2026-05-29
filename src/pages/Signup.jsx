import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Interest categories ───
const CATEGORIES = [
  {
    id: 'music', icon: '🎵', label: 'Music',
    options: ['Indie', 'Bollywood', 'Hip-Hop', 'Classical', 'Jazz', 'Rock', 'Pop', 'Electronic', 'Lo-fi'],
  },
  {
    id: 'film', icon: '🎬', label: 'Film & TV',
    options: ['Indie Films', 'Bollywood', 'Hollywood', 'Documentaries', 'K-Drama', 'Anime', 'Thrillers', 'Sci-Fi'],
  },
  {
    id: 'books', icon: '📚', label: 'Books',
    options: ['Literary Fiction', 'Non-fiction', 'Sci-Fi', 'Philosophy', 'Business', 'Poetry', 'Biographies', 'Self-help'],
  },
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
  { id: 'weekend',      q: 'My perfect weekend looks like...',        ph: 'Coffee, bookstore, no plans honestly' },
  { id: 'geekout',      q: 'I get genuinely excited about',           ph: 'How startups go from 0 to 1. And street food.' },
  { id: 'controversial',q: 'Unpopular opinion I will die on:',        ph: 'Maggi is better than any pasta. Period.' },
  { id: 'firstdate',    q: 'A perfect first date looks like',         ph: 'Hidden cafe, no plan, great conversation' },
  { id: 'dealbreaker',  q: 'My non-negotiable is',                    ph: 'Honesty. No games, ever.' },
  { id: 'secret',       q: 'People are surprised to learn I',         ph: "I can cook better than most restaurants" },
]

// Demo photos (male lifestyle, aspirational but natural)
const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=420&fit=crop&crop=face,top',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=420&fit=crop&crop=face,top',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=420&fit=crop&crop=faces,top',
]

// ── Small shared components ──
function DarkInput({ value, onChange, placeholder, type = 'text', className = '', ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-transparent text-cream border-0 border-b border-cream/20 pb-3 outline-none focus:border-rose/60 transition-colors placeholder:text-cream/20 ${className}`}
      {...rest}
    />
  )
}

function DarkPill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border cursor-pointer ${
        selected
          ? 'bg-rose text-cream border-rose shadow-[0_0_20px_rgba(201,75,75,0.3)]'
          : 'bg-cream/5 text-cream/50 border-cream/10 hover:border-cream/25 hover:text-cream/70'
      }`}
    >
      {label}
    </button>
  )
}

function InterestChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
        selected
          ? 'bg-gradient-to-r from-rose to-amber text-cream border-transparent shadow-[0_0_12px_rgba(201,75,75,0.25)]'
          : 'bg-cream/4 text-cream/45 border-cream/8 hover:border-cream/20 hover:text-cream/65'
      }`}
    >
      {label}
    </button>
  )
}

// ── Aurora background orbs ──
function Aurora() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="absolute rounded-full"
        style={{
          top: '-15%', right: '-10%',
          width: '55vw', height: '55vw',
          background: 'radial-gradient(circle, rgba(201,75,75,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: '-20%', left: '-15%',
          width: '65vw', height: '65vw',
          background: 'radial-gradient(circle, rgba(45,59,45,0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: '40%', left: '30%',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(212,149,106,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  )
}

// ── Step 1: Identity ──
function Step1({ form, setForm, onNext }) {
  const [phase, setPhase] = useState(0) // 0: name, 1: details appear
  const nameRef = useRef()

  useEffect(() => { nameRef.current?.focus() }, [])

  const handleNameKey = (e) => {
    if (e.key === 'Enter' && form.name.trim().length > 1) setPhase(1)
  }

  const canContinue = form.name.trim() && form.gender && form.lookingFor

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 pb-16 px-6 text-center relative z-10">
      <p className="text-cream/25 text-[10px] tracking-[0.4em] uppercase mb-12">STEP 01 / 04</p>

      {/* Question */}
      <h1 className="font-display text-3xl md:text-4xl italic text-cream leading-snug mb-10 ru" style={{ animationDelay: '0.1s' }}>
        First things first —<br />
        <span className="text-rose/80">what do we call you?</span>
      </h1>

      {/* Name */}
      <div className="w-full max-w-xs mb-6 ru" style={{ animationDelay: '0.2s' }}>
        <DarkInput
          ref={nameRef}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          onKeyDown={handleNameKey}
          className="text-3xl text-center tracking-wide"
        />
      </div>

      {/* Rest of fields appear after name has content */}
      {form.name.trim().length > 1 && (
        <div className="w-full max-w-sm space-y-10 ru" style={{ animationDelay: '0s' }}>

          {/* Birthday */}
          <div>
            <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-5">Birthday</p>
            <div className="flex items-end justify-center gap-2">
              <div className="text-center">
                <DarkInput
                  type="number"
                  value={form.birthDay}
                  onChange={e => setForm(f => ({ ...f, birthDay: e.target.value }))}
                  placeholder="DD"
                  min="1" max="31"
                  className="text-2xl text-center w-16"
                />
                <p className="text-cream/20 text-[9px] mt-1.5 tracking-widest">DAY</p>
              </div>
              <span className="text-cream/15 text-xl mb-5">/</span>
              <div className="text-center">
                <DarkInput
                  type="number"
                  value={form.birthMonth}
                  onChange={e => setForm(f => ({ ...f, birthMonth: e.target.value }))}
                  placeholder="MM"
                  min="1" max="12"
                  className="text-2xl text-center w-16"
                />
                <p className="text-cream/20 text-[9px] mt-1.5 tracking-widest">MONTH</p>
              </div>
              <span className="text-cream/15 text-xl mb-5">/</span>
              <div className="text-center">
                <DarkInput
                  type="number"
                  value={form.birthYear}
                  onChange={e => setForm(f => ({ ...f, birthYear: e.target.value }))}
                  placeholder="YYYY"
                  min="1990" max="2007"
                  className="text-2xl text-center w-24"
                />
                <p className="text-cream/20 text-[9px] mt-1.5 tracking-widest">YEAR</p>
              </div>
            </div>
            <p className="text-cream/20 text-[10px] mt-3">We only show your age, never the date</p>
          </div>

          {/* Height */}
          <div>
            <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-5">Height</p>
            <div className="flex items-end justify-center gap-3">
              <div className="text-center">
                <DarkInput
                  type="number"
                  value={form.heightFt}
                  onChange={e => setForm(f => ({ ...f, heightFt: e.target.value }))}
                  min="4" max="7"
                  className="text-4xl text-center w-16"
                />
                <p className="text-cream/20 text-[9px] mt-1.5 tracking-widest">FT</p>
              </div>
              <span className="text-cream/20 text-3xl mb-6 select-none">'</span>
              <div className="text-center">
                <DarkInput
                  type="number"
                  value={form.heightIn}
                  onChange={e => setForm(f => ({ ...f, heightIn: e.target.value }))}
                  min="0" max="11"
                  className="text-4xl text-center w-16"
                />
                <p className="text-cream/20 text-[9px] mt-1.5 tracking-widest">IN</p>
              </div>
              <span className="text-cream/20 text-2xl mb-6 select-none">"</span>
            </div>
          </div>

          {/* Gender */}
          <div>
            <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-5">I identify as</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Man', 'Woman', 'Non-binary'].map(g => (
                <DarkPill key={g} label={g} selected={form.gender === g} onClick={() => setForm(f => ({ ...f, gender: g }))} />
              ))}
            </div>
          </div>

          {/* Looking for */}
          <div>
            <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-5">I want to meet</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {['Women', 'Men', 'Everyone'].map(l => (
                <DarkPill key={l} label={l} selected={form.lookingFor === l} onClick={() => setForm(f => ({ ...f, lookingFor: l }))} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Continue */}
      {canContinue && (
        <button
          onClick={onNext}
          className="mt-14 px-10 py-3.5 rounded-full bg-rose text-cream text-sm font-semibold cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(201,75,75,0.35)] hover:scale-105 ru"
          style={{ animationDelay: '0s' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ── Step 2: Your World ──
function Step2({ form, setForm, onNext }) {
  const cityRef = useRef()
  useEffect(() => { cityRef.current?.focus() }, [])

  const canContinue = form.city.trim() && form.work.trim()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative z-10">
      <p className="text-cream/25 text-[10px] tracking-[0.4em] uppercase mb-12">STEP 02 / 04</p>

      <h1 className="font-display text-3xl md:text-4xl italic text-cream leading-snug mb-16 ru" style={{ animationDelay: '0.1s' }}>
        Tell us about<br />
        <span className="text-amber/80">your world.</span>
      </h1>

      <div className="w-full max-w-sm space-y-12 ru" style={{ animationDelay: '0.2s' }}>

        <div>
          <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-4">Where are you?</p>
          <DarkInput
            ref={cityRef}
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="Your city"
            className="text-2xl text-center"
          />
        </div>

        <div>
          <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-4">What do you do?</p>
          <DarkInput
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
          className="mt-16 px-10 py-3.5 rounded-full bg-rose text-cream text-sm font-semibold cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(201,75,75,0.35)] hover:scale-105 ru"
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ── Step 3: Interests + Prompts ──
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
  const filledPrompts = PROMPTS.filter(p => prompts[p.id]?.trim()).length
  const canContinue = totalSelected >= 3 || filledPrompts >= 1

  return (
    <div className="flex flex-col items-start min-h-screen px-6 pt-16 pb-24 relative z-10 max-w-sm mx-auto w-full">
      <p className="text-cream/25 text-[10px] tracking-[0.4em] uppercase mb-8 w-full text-center">STEP 03 / 04</p>

      <h1 className="font-display text-3xl md:text-3xl italic text-cream leading-snug mb-3 w-full text-center ru">
        What lights<br /><span className="text-sage/80">you up?</span>
      </h1>
      <p className="text-cream/30 text-xs text-center w-full mb-10">Pick a few. This is what people see first.</p>

      {/* Interest categories */}
      <div className="w-full space-y-2 mb-10">
        {CATEGORIES.map(cat => {
          const selected = interests[cat.id] || []
          const isOpen = expandedCat === cat.id

          return (
            <div key={cat.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-cream/15 bg-cream/4' : 'border-cream/6 bg-cream/2 hover:border-cream/12'
              }`}
            >
              {/* Category header */}
              <button
                onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-cream/70 text-sm font-medium">{cat.label}</span>
                  {selected.length > 0 && (
                    <span className="bg-rose/80 text-cream text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {selected.length}
                    </span>
                  )}
                </div>
                <span className={`text-cream/25 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {/* Chips */}
              {isOpen && (
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {cat.options.map(opt => (
                    <InterestChip
                      key={opt}
                      label={opt}
                      selected={selected.includes(opt)}
                      onClick={() => toggleInterest(cat.id, opt)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Prompts */}
      <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-4 w-full">In your own words</p>
      <div className="w-full space-y-3 mb-10">
        {PROMPTS.slice(0, 4).map(prompt => (
          <div key={prompt.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              activePrompt === prompt.id ? 'border-cream/20 bg-cream/4' : 'border-cream/6 bg-cream/2'
            }`}
          >
            <button
              onClick={() => setActivePrompt(activePrompt === prompt.id ? null : prompt.id)}
              className="w-full text-left px-4 py-3.5 cursor-pointer"
            >
              <p className={`text-sm font-medium transition-colors ${prompts[prompt.id]?.trim() ? 'text-rose/80' : 'text-cream/45'}`}>
                {prompt.q}
              </p>
              {prompts[prompt.id]?.trim() && activePrompt !== prompt.id && (
                <p className="text-cream/50 text-xs mt-1 line-clamp-1">{prompts[prompt.id]}</p>
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
                  className="w-full bg-transparent text-cream/80 text-sm outline-none placeholder:text-cream/20 resize-none border-b border-cream/15 pb-2"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {canContinue && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-rose text-cream text-sm font-semibold cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(201,75,75,0.35)]"
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ── Step 4: Photos + Socials + Preview ──
function Step4({ form, setForm, selectedPhotos, setSelectedPhotos, prompts, interests, onFinish }) {
  const age = (() => {
    if (!form.birthYear) return 22
    return new Date().getFullYear() - parseInt(form.birthYear)
  })()

  const filledPrompts = PROMPTS.filter(p => prompts[p.id]?.trim())
  const totalInterests = Object.values(interests).flat()

  return (
    <div className="flex flex-col items-center min-h-screen px-5 pt-16 pb-24 relative z-10 max-w-sm mx-auto w-full">
      <p className="text-cream/25 text-[10px] tracking-[0.4em] uppercase mb-8 text-center w-full">STEP 04 / 04</p>

      <h1 className="font-display text-3xl italic text-cream leading-snug mb-3 text-center w-full ru">
        Almost there —<br /><span className="text-amber/80">show yourself.</span>
      </h1>
      <p className="text-cream/30 text-xs text-center mb-10">Photos are optional for the demo.</p>

      {/* Polaroid photo grid */}
      <div className="w-full mb-10">
        <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-5">Photos</p>
        <div className="flex gap-3 justify-center">
          {DEMO_PHOTOS.map((photo, i) => {
            const rotations = [-3, 1.5, -1]
            const isSelected = selectedPhotos.includes(i)
            return (
              <button
                key={i}
                onClick={() => setSelectedPhotos(prev =>
                  prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                )}
                className="relative cursor-pointer transition-all duration-300"
                style={{ transform: `rotate(${rotations[i]}deg) ${isSelected ? 'scale(1.04)' : 'scale(1)'}` }}
              >
                {/* Polaroid frame */}
                <div className={`bg-cream/10 border-[1.5px] rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 ${
                  isSelected ? 'border-rose/60 shadow-[0_0_20px_rgba(201,75,75,0.3)]' : 'border-cream/10'
                }`}
                  style={{ padding: '6px 6px 20px 6px' }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${i + 1}`}
                    className="w-24 h-32 object-cover rounded-sm"
                  />
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose rounded-full flex items-center justify-center text-[9px] text-cream font-bold border-2 border-[#060A0F]">
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-cream/20 text-[10px] text-center mt-4">Click to select. These are demo photos.</p>
      </div>

      {/* Socials */}
      <div className="w-full space-y-6 mb-10">
        <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase">Socials</p>
        <div className="flex items-end gap-3">
          <span className="text-cream/30 text-sm mb-3 shrink-0">🎵</span>
          <div className="flex-1">
            <p className="text-cream/25 text-[9px] tracking-widest uppercase mb-2">Spotify</p>
            <DarkInput
              value={form.spotify}
              onChange={e => setForm(f => ({ ...f, spotify: e.target.value }))}
              placeholder="username"
              className="text-base"
            />
          </div>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-cream/30 text-sm mb-3 shrink-0">📸</span>
          <div className="flex-1">
            <p className="text-cream/25 text-[9px] tracking-widest uppercase mb-2">Instagram</p>
            <DarkInput
              value={form.instagram}
              onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
              placeholder="@handle"
              className="text-base"
            />
          </div>
        </div>
      </div>

      {/* Live profile preview */}
      <div className="w-full mb-10">
        <p className="text-cream/30 text-[10px] tracking-[0.35em] uppercase mb-4">Your profile preview</p>
        <div className="bg-cream/5 border border-cream/8 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            {selectedPhotos.length > 0 ? (
              <img
                src={DEMO_PHOTOS[selectedPhotos[0]]}
                className="w-14 h-14 rounded-xl object-cover"
                alt="profile"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-rose/20 flex items-center justify-center text-xl font-bold text-rose">
                {form.name ? form.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div>
              <p className="text-cream font-display font-bold text-lg">{form.name || 'You'}, {age}</p>
              <p className="text-cream/45 text-xs">{form.city || 'Your city'} · {form.work || 'What you do'}</p>
            </div>
          </div>

          {/* Prompts */}
          {filledPrompts.slice(0, 2).map(p => (
            <div key={p.id} className="mb-3 bg-cream/4 rounded-xl px-3.5 py-3">
              <p className="text-rose/60 text-[10px] font-medium mb-0.5">{p.q}</p>
              <p className="text-cream/70 text-xs">{prompts[p.id]}</p>
            </div>
          ))}

          {/* Interests */}
          {totalInterests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {totalInterests.slice(0, 5).map(t => (
                <span key={t} className="bg-cream/6 text-cream/50 text-[10px] px-2.5 py-1 rounded-full border border-cream/8">
                  {t}
                </span>
              ))}
              {totalInterests.length > 5 && (
                <span className="text-cream/25 text-[10px] py-1">+{totalInterests.length - 5} more</span>
              )}
            </div>
          )}

          {form.spotify && (
            <div className="flex items-center gap-2 mt-3 text-cream/35 text-[10px]">
              <span>🎵</span> <span>{form.spotify}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full py-4 rounded-full text-cream text-base font-semibold cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,75,75,0.3)]"
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
  const [transitioning, setTransitioning] = useState(false)
  const [visible, setVisible] = useState(true)

  const [form, setForm] = useState({
    name: 'Aditya',
    birthDay: '15',
    birthMonth: '08',
    birthYear: '2003',
    gender: 'Man',
    lookingFor: 'Women',
    heightFt: '5',
    heightIn: '10',
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
    }, 350)
  }

  const handleNext = () => transition(step + 1)
  const handleBack = () => {
    if (step === 1) navigate('/')
    else transition(step - 1)
  }

  const handleFinish = () => {
    const userData = {
      ...form,
      dob: `${form.birthYear}-${form.birthMonth.padStart(2,'0')}-${form.birthDay.padStart(2,'0')}`,
      interests,
      prompts,
      photos: selectedPhotos,
    }
    localStorage.setItem('crushky_user', JSON.stringify(userData))
    navigate('/dashboard')
  }

  const progress = (step / 4) * 100

  return (
    <div className="min-h-screen relative" style={{ background: '#060A0F' }}>
      <Aurora />

      {/* Progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-cream/5">
        <div
          className="h-full bg-rose transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="fixed top-5 left-5 z-50 text-cream/30 text-sm hover:text-cream/70 transition-colors cursor-pointer flex items-center gap-1.5"
      >
        ← {step === 1 ? 'Home' : 'Back'}
      </button>

      {/* Step content */}
      <div
        className="transition-all duration-350"
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
