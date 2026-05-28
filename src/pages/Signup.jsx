import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai']
const GENDERS = ['Man', 'Woman', 'Non-binary']
const LOOKING_FOR = ['Women', 'Men', 'Everyone']

const PROMPTS = [
  { id: 'weekend', question: "My perfect weekend looks like...", placeholder: "Coffee, bookstore, no plans honestly" },
  { id: 'geekout', question: "I geek out about...", placeholder: "Indie music, startups, street food hunting" },
  { id: 'controversial', question: "My controversial opinion is...", placeholder: "Maggi is better than any pasta" },
  { id: 'firstdate', question: "A perfect first date...", placeholder: "Hidden cafe, great conversation, zero awkwardness" },
  { id: 'dealbreaker', question: "My biggest dealbreaker...", placeholder: "Playing games. Just be real." },
  { id: 'secret', question: "Something people don't expect about me...", placeholder: "I can cook better than most restaurants" },
]

const STEPS = [
  { title: "Hey there", subtitle: "Let's get you set up in 60 seconds", emoji: "👋" },
  { title: "Your vibe", subtitle: "Where are you and what do you do?", emoji: "📍" },
  { title: "The real you", subtitle: "Pick 2-3 prompts. This is what makes you interesting.", emoji: "💬" },
  { title: "One last thing", subtitle: "A photo and your socials. Both optional.", emoji: "📸" },
]

function Chip({ label, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all border-2 flex items-center gap-2 ${
        selected
          ? 'bg-dark-green text-white border-dark-green shadow-sm scale-[1.02]'
          : 'bg-white text-dark-text/60 border-dark-text/8 hover:border-dark-green/30 hover:bg-dark-green/3'
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  )
}

function ProfilePreview({ form, prompts }) {
  const age = form.dob ? Math.floor((Date.now() - new Date(form.dob).getTime()) / 31557600000) : '22'
  const filledPrompts = PROMPTS.filter(p => prompts[p.id]?.trim())

  return (
    <div className="bg-white rounded-2xl border border-dark-text/5 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-dark-green" />
        <span className="text-[10px] text-muted font-medium uppercase tracking-wider">Profile preview</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-soft/50 to-amber/30 flex items-center justify-center text-2xl font-bold text-dark-text/20 shrink-0 overflow-hidden">
          {form.photos?.[0] ? (
            <img src={form.photos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            form.name ? form.name[0].toUpperCase() : 'A'
          )}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">{form.name || 'Your Name'}, {age}</h3>
          <p className="text-muted text-xs">
            {form.city || 'City'} {form.work ? `· ${form.work}` : ''}
          </p>
        </div>
      </div>
      {filledPrompts.length > 0 && (
        <div className="space-y-2">
          {filledPrompts.slice(0, 2).map(p => (
            <div key={p.id} className="bg-cream rounded-xl px-4 py-3">
              <p className="text-[10px] text-rose font-semibold mb-1">{p.question}</p>
              <p className="text-dark-text/70 text-sm">{prompts[p.id]}</p>
            </div>
          ))}
        </div>
      )}
      {form.spotify && (
        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <span>🎵</span> <span>{form.spotify}</span>
        </div>
      )}
    </div>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [entering, setEntering] = useState(true)
  const [form, setForm] = useState({
    name: 'Aditya', dob: '2003-08-15', gender: 'Man', lookingFor: 'Women', city: 'Mumbai',
    height: "5'10\"", college: 'IIT Bombay', work: 'Product at Razorpay', spotify: 'aditya.vibes', instagram: 'aditya.kumar_',
    photos: [],
  })
  const [prompts, setPrompts] = useState({
    weekend: "Coffee, bookstore, no plans honestly",
    geekout: "How startups go from 0 to 1. And street food.",
    controversial: "Maggi is better than any pasta. I will die on this hill.",
    firstdate: "",
    dealbreaker: "",
    secret: "",
  })

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))
  const setPrompt = (key, val) => setPrompts((p) => ({ ...p, [key]: val }))
  const progress = ((step + 1) / 4) * 100
  const filledPromptCount = PROMPTS.filter(p => prompts[p.id]?.trim()).length

  useEffect(() => {
    setEntering(true)
    const t = setTimeout(() => setEntering(false), 500)
    return () => clearTimeout(t)
  }, [step])

  const canContinue = () => {
    if (step === 0) return form.name.trim() && form.gender
    if (step === 1) return form.city
    if (step === 2) return filledPromptCount >= 2
    return true
  }

  const handleContinue = () => {
    if (step < 3) return setStep(step + 1)
    localStorage.setItem('crushky_user', JSON.stringify({ ...form, prompts }))
    navigate('/dashboard')
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file || form.photos.length >= 3) return
    const reader = new FileReader()
    reader.onload = (ev) => set('photos', [...form.photos, ev.target.result])
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-cream text-dark-text flex flex-col grain">
      {/* Top bar */}
      <div className="px-6 md:px-10 pt-5 pb-4 bg-cream/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-dark-text/40 hover:text-dark-text text-sm cursor-pointer transition-colors font-medium">
                <span className="text-lg">&larr;</span> Back
              </button>
            ) : (
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-dark-text/40 hover:text-dark-text text-sm cursor-pointer transition-colors font-medium">
                <span className="text-lg">&larr;</span> Home
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-dark-text/30">Crushky</span>
              <span className="bg-rose/10 text-rose text-[8px] font-bold px-2 py-0.5 rounded-full">MVP</span>
            </div>
            <span className="text-dark-text/30 text-xs font-semibold tabular-nums">{step + 1}/4</span>
          </div>
          <div className="h-[4px] bg-dark-text/6 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-dark-green via-dark-green to-dark-green/70 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 md:px-10 py-6 overflow-y-auto">
        <div className={`max-w-lg w-full ${entering ? 'au' : ''}`} key={step}>
          {/* Step header */}
          <div className="text-center mb-7">
            <span className="text-3xl block mb-3">{STEPS[step].emoji}</span>
            <h2 className="font-display text-2xl md:text-[32px] font-bold">{STEPS[step].title}</h2>
            <p className="text-muted text-sm mt-1.5">{STEPS[step].subtitle}</p>
          </div>

          {/* ─── Step 0: Basics ─── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">First name</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="What should we call you?"
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-[15px]" />
              </div>
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">Birthday</label>
                <input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)}
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all text-[15px]" />
                <p className="text-muted text-[11px] mt-1.5 ml-1">We only show your age, never the date</p>
              </div>
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-3">I identify as</label>
                <div className="flex flex-wrap gap-2.5">
                  {GENDERS.map((g) => (
                    <Chip key={g} label={g} selected={form.gender === g} onClick={() => set('gender', g)}
                      icon={g === 'Man' ? '♂' : g === 'Woman' ? '♀' : '⚧'} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-3">I want to meet</label>
                <div className="flex flex-wrap gap-2.5">
                  {LOOKING_FOR.map((l) => <Chip key={l} label={l} selected={form.lookingFor === l} onClick={() => set('lookingFor', l)} />)}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 1: Location & Career ─── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-3">Your city</label>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {CITIES.map((c) => <Chip key={c} label={c} selected={form.city === c} onClick={() => set('city', c)} />)}
                </div>
                <input type="text" value={!CITIES.includes(form.city) ? form.city : ''} onChange={(e) => set('city', e.target.value)} placeholder="Or type your city..."
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">Height</label>
                  <input type="text" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="5'8&quot;"
                    className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-[15px]" />
                  <p className="text-muted text-[11px] mt-1 ml-1">Optional</p>
                </div>
                <div />
              </div>
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">College</label>
                <input type="text" value={form.college} onChange={(e) => set('college', e.target.value)} placeholder="Where did you study?"
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-[15px]" />
              </div>
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">Work</label>
                <input type="text" value={form.work} onChange={(e) => set('work', e.target.value)} placeholder="What do you do?"
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-[15px]" />
              </div>
            </div>
          )}

          {/* ─── Step 2: Personality Prompts (Hinge-style) ─── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted font-medium">{filledPromptCount} of 6 filled &middot; <span className={filledPromptCount >= 2 ? 'text-dark-green font-semibold' : 'text-rose'}>min 2 required</span></p>
              </div>
              {PROMPTS.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl border-2 transition-all ${
                  prompts[p.id]?.trim()
                    ? 'border-dark-green/20 shadow-sm'
                    : 'border-dark-text/5'
                }`}>
                  <div className="px-5 pt-4 pb-1">
                    <p className="text-rose font-semibold text-sm">{p.question}</p>
                  </div>
                  <div className="px-5 pb-4">
                    <input
                      type="text"
                      value={prompts[p.id]}
                      onChange={(e) => setPrompt(p.id, e.target.value)}
                      placeholder={p.placeholder}
                      className="w-full text-dark-text/80 text-[15px] outline-none placeholder:text-dark-text/20 py-2 bg-transparent"
                    />
                  </div>
                  {prompts[p.id]?.trim() && (
                    <div className="px-5 pb-3">
                      <span className="text-dark-green text-[10px] font-semibold">✓ Added to profile</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── Step 3: Photo + Socials + Preview ─── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-3">Your photos</label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative">
                      {form.photos[i] ? (
                        <div className="rounded-2xl overflow-hidden shadow-md hover-lift relative">
                          <img src={form.photos[i]} alt="" className="w-full aspect-[3/4] object-cover" />
                          <button onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                            className="absolute top-2 right-2 w-7 h-7 bg-dark-text/60 backdrop-blur-sm text-white rounded-full text-xs flex items-center justify-center cursor-pointer hover:bg-rose transition-colors">
                            ✕
                          </button>
                          {i === 0 && <div className="absolute bottom-2 left-2 bg-dark-green/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Main</div>}
                        </div>
                      ) : (
                        <label className="block aspect-[3/4] bg-white border-2 border-dashed border-dark-text/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-dark-green/30 hover:bg-dark-green/3 transition-all group">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-dark-text/5 group-hover:bg-dark-green/10 flex items-center justify-center mx-auto mb-2 transition-colors">
                              <span className="text-xl text-dark-text/20 group-hover:text-dark-green/40 transition-colors">+</span>
                            </div>
                            <span className="text-[11px] text-muted block">{i === 0 ? 'Main photo' : 'Add'}</span>
                          </div>
                          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-muted text-[11px] mt-2 ml-1">Optional for MVP demo</p>
              </div>

              {/* Social links */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 border-2 border-dark-text/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🎵</span>
                    <span className="text-xs font-semibold">Spotify</span>
                  </div>
                  <input type="text" value={form.spotify} onChange={(e) => set('spotify', e.target.value)} placeholder="username"
                    className="w-full bg-cream border border-dark-text/5 rounded-xl px-3 py-2 text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20" />
                </div>
                <div className="bg-white rounded-2xl p-4 border-2 border-dark-text/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">📸</span>
                    <span className="text-xs font-semibold">Instagram</span>
                  </div>
                  <input type="text" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="@username"
                    className="w-full bg-cream border border-dark-text/5 rounded-xl px-3 py-2 text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20" />
                </div>
              </div>

              {/* Live profile preview */}
              <ProfilePreview form={form} prompts={prompts} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom button area */}
      <div className="px-6 md:px-10 pb-8 pt-2 bg-gradient-to-t from-cream via-cream to-transparent">
        <div className="max-w-lg mx-auto space-y-3">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="w-full py-4 rounded-2xl bg-dark-green text-white font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-green/90 transition-all hover:shadow-lg text-[15px] active:scale-[0.98]"
          >
            {step === 3 ? "Let's find your person ✨" : 'Continue'}
          </button>
          {step === 2 && (
            <p className="text-center text-muted text-xs">
              The more you fill, the better your matches. But 2 is enough to start.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
