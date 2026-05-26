import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai']
const GENDERS = ['Man', 'Woman', 'Non-binary']
const LOOKING_FOR = ['Women', 'Men', 'Everyone']

const STEPS = [
  { title: "The basics", subtitle: "Takes 30 seconds. We promise.", emoji: "👋" },
  { title: "A little more", subtitle: "Helps us find better matches for you.", emoji: "✨" },
  { title: "Your world", subtitle: "Optional. But makes your profile way cooler.", emoji: "🌍" },
  { title: "Your best shots", subtitle: "Pick 1-3 photos. Or skip for now.", emoji: "📸" },
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

function InputField({ label, type = 'text', value, onChange, placeholder, hint }) {
  return (
    <div>
      <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-2">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3.5 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-[15px]"
      />
      {hint && <p className="text-muted text-[11px] mt-1.5 ml-1">{hint}</p>}
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

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))
  const progress = ((step + 1) / 4) * 100

  // Re-trigger enter animation on step change
  useEffect(() => {
    setEntering(true)
    const t = setTimeout(() => setEntering(false), 500)
    return () => clearTimeout(t)
  }, [step])

  const canContinue = () => {
    if (step === 0) return form.name.trim() && form.gender
    if (step === 1) return form.city
    return true
  }

  const handleContinue = () => {
    if (step < 3) return setStep(step + 1)
    localStorage.setItem('crushky_user', JSON.stringify(form))
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
          {/* Progress bar */}
          <div className="h-[4px] bg-dark-text/6 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-dark-green via-dark-green to-dark-green/70 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 md:px-10 py-8">
        <div className={`max-w-lg w-full ${entering ? 'au' : ''}`} key={step}>
          {/* Step header */}
          <div className="text-center mb-8">
            <span className="text-3xl block mb-3">{STEPS[step].emoji}</span>
            <h2 className="font-display text-2xl md:text-[32px] font-bold">{STEPS[step].title}</h2>
            <p className="text-muted text-sm mt-1.5">{STEPS[step].subtitle}</p>
          </div>

          {/* Step 0: Name + DOB + Gender + Looking For */}
          {step === 0 && (
            <div className="space-y-6">
              <InputField label="First name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="What should we call you?" />
              <InputField label="Birthday" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} hint="We'll only show your age, never the date" />

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

          {/* Step 1: City + Height + College + Work */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-dark-text/50 font-semibold uppercase tracking-[0.15em] block mb-3">Your city</label>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {CITIES.map((c) => (
                    <Chip key={c} label={c} selected={form.city === c} onClick={() => set('city', c)} />
                  ))}
                </div>
                <input
                  type="text" value={!CITIES.includes(form.city) ? form.city : ''} onChange={(e) => set('city', e.target.value)}
                  placeholder="Or type your city..."
                  className="w-full bg-white border-2 border-dark-text/8 rounded-2xl px-5 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Height" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="5'8&quot;" hint="Optional" />
                <div /> {/* Spacer for layout */}
              </div>

              <InputField label="College" value={form.college} onChange={(e) => set('college', e.target.value)} placeholder="Where did you study?" />
              <InputField label="Work" value={form.work} onChange={(e) => set('work', e.target.value)} placeholder="What do you do?" />
            </div>
          )}

          {/* Step 2: Social Links */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Spotify card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-dark-text/5 hover-lift transition-all">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center text-xl">🎵</div>
                  <div>
                    <p className="font-semibold text-[15px]">Spotify</p>
                    <p className="text-muted text-xs">Your music says a lot about you</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm">spotify.com/</span>
                  <input
                    type="text" value={form.spotify} onChange={(e) => set('spotify', e.target.value)}
                    placeholder="username"
                    className="flex-1 bg-cream border-2 border-dark-text/5 rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20"
                  />
                </div>
              </div>

              {/* Instagram card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-dark-text/5 hover-lift transition-all">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E1306C]/10 flex items-center justify-center text-xl">📸</div>
                  <div>
                    <p className="font-semibold text-[15px]">Instagram</p>
                    <p className="text-muted text-xs">Let matches see your vibe</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm">@</span>
                  <input
                    type="text" value={form.instagram} onChange={(e) => set('instagram', e.target.value)}
                    placeholder="yourusername"
                    className="flex-1 bg-cream border-2 border-dark-text/5 rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-dark-green/40 transition-all placeholder:text-dark-text/20"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-muted text-xs">Both are optional. Skip anytime.</p>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative">
                    {form.photos[i] ? (
                      <div className="rounded-2xl overflow-hidden shadow-md hover-lift relative">
                        <img src={form.photos[i]} alt="" className="w-full aspect-[3/4] object-cover" />
                        <button
                          onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                          className="absolute top-2 right-2 w-7 h-7 bg-dark-text/60 backdrop-blur-sm text-white rounded-full text-xs flex items-center justify-center cursor-pointer hover:bg-rose transition-colors"
                        >
                          ✕
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-2 left-2 bg-dark-green/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                            Main
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="block aspect-[3/4] bg-white border-2 border-dashed border-dark-text/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-dark-green/30 hover:bg-dark-green/3 transition-all group">
                        <div className="text-center">
                          <div className="w-10 h-10 rounded-full bg-dark-text/5 group-hover:bg-dark-green/10 flex items-center justify-center mx-auto mb-2 transition-colors">
                            <span className="text-xl text-dark-text/20 group-hover:text-dark-green/40 transition-colors">+</span>
                          </div>
                          <span className="text-[11px] text-muted block">{i === 0 ? 'Main photo' : 'Add photo'}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {/* Photo tips */}
              <div className="mt-6 bg-white rounded-2xl p-5 border border-dark-text/5">
                <p className="text-xs font-semibold text-dark-text/50 uppercase tracking-wider mb-3">Photo tips</p>
                <div className="space-y-2">
                  {['Show your face clearly', 'Natural lighting works best', 'Skip the group photos'].map((tip) => (
                    <div key={tip} className="flex items-center gap-2.5">
                      <span className="text-dark-green text-xs">✓</span>
                      <span className="text-muted text-xs">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-muted text-xs mt-4">Photos are optional for the MVP demo.</p>
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
            <button
              onClick={handleContinue}
              className="w-full py-3 text-muted text-sm font-medium cursor-pointer hover:text-dark-text transition-colors"
            >
              Skip for now
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleContinue}
              className="w-full py-3 text-muted text-sm font-medium cursor-pointer hover:text-dark-text transition-colors"
            >
              Skip photos
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
