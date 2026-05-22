import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai']
const GENDERS = ['Man', 'Woman', 'Non-binary']
const LOOKING_FOR = ['Women', 'Men', 'Everyone']

const STEP_TITLES = [
  "Let's start with you",
  "A bit more about you",
  "Connect your world",
  "Show yourself off",
]
const STEP_SUBTITLES = [
  "The basics. Nothing scary.",
  "Helps us find better matches.",
  "Optional but makes your profile pop.",
  "Pick your best 1-3 photos.",
]

function Pill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all border ${
        selected
          ? 'bg-dark-green text-white border-dark-green shadow-sm'
          : 'bg-white text-dark-text/60 border-dark-text/10 hover:border-dark-text/25'
      }`}
    >
      {label}
    </button>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', dob: '', gender: '', lookingFor: '', city: '',
    height: '', college: '', work: '', spotify: '', instagram: '', photos: [],
  })

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))
  const progress = ((step + 1) / 4) * 100

  const canContinue = () => {
    if (step === 0) return form.name.trim() && form.gender
    if (step === 1) return form.city
    if (step === 2) return true
    if (step === 3) return true
    return false
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

  const gradients = [
    'from-rose-light/40 to-cream',
    'from-amber-light/40 to-cream',
    'from-rose-soft/30 to-warm-cream',
    'from-amber-light/30 to-cream',
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[step]} text-dark-text flex flex-col grain`}>
      {/* Top bar */}
      <div className="px-6 md:px-10 pt-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="text-muted hover:text-dark-text text-sm cursor-pointer transition-colors">← Back</button>
            ) : (
              <button onClick={() => navigate('/')} className="text-muted hover:text-dark-text text-sm cursor-pointer transition-colors">← Home</button>
            )}
            <span className="text-muted text-xs font-medium">{step + 1} of 4</span>
          </div>
          {/* Progress bar */}
          <div className="h-[3px] bg-dark-text/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose to-amber rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-8">
        <div className="max-w-lg w-full au" key={step}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-1">{STEP_TITLES[step]}</h2>
          <p className="text-muted text-sm text-center mb-8">{STEP_SUBTITLES[step]}</p>

          {/* Step 0: Name + DOB + Gender */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">First name</label>
                <input
                  type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="Your first name"
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">Date of birth</label>
                <input
                  type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)}
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">I am a</label>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => <Pill key={g} label={g} selected={form.gender === g} onClick={() => set('gender', g)} />)}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">Show me</label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR.map((l) => <Pill key={l} label={l} selected={form.lookingFor === l} onClick={() => set('lookingFor', l)} />)}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: City + Height */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">City</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {CITIES.map((c) => <Pill key={c} label={c} selected={form.city === c} onClick={() => set('city', c)} />)}
                </div>
                <input
                  type="text" value={!CITIES.includes(form.city) ? form.city : ''} onChange={(e) => set('city', e.target.value)}
                  placeholder="Or type your city..."
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">Height (optional)</label>
                <input
                  type="text" value={form.height} onChange={(e) => set('height', e.target.value)}
                  placeholder="e.g. 5'8&quot;"
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">College / University</label>
                <input
                  type="text" value={form.college} onChange={(e) => set('college', e.target.value)}
                  placeholder="Where'd you study?"
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium uppercase tracking-wider block mb-2">Work</label>
                <input
                  type="text" value={form.work} onChange={(e) => set('work', e.target.value)}
                  placeholder="What do you do?"
                  className="w-full bg-white border border-dark-text/10 rounded-xl px-4 py-3 text-dark-text outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
            </div>
          )}

          {/* Step 2: Spotify + Instagram */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-dark-text/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-lg">🎵</div>
                  <div>
                    <p className="font-semibold text-sm">Spotify</p>
                    <p className="text-muted text-xs">Share your music taste</p>
                  </div>
                </div>
                <input
                  type="text" value={form.spotify} onChange={(e) => set('spotify', e.target.value)}
                  placeholder="Your Spotify username"
                  className="w-full bg-cream border border-dark-text/8 rounded-xl px-4 py-3 text-dark-text text-sm outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <div className="bg-white rounded-2xl p-5 border border-dark-text/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-lg">📸</div>
                  <div>
                    <p className="font-semibold text-sm">Instagram</p>
                    <p className="text-muted text-xs">Let matches see your vibe</p>
                  </div>
                </div>
                <input
                  type="text" value={form.instagram} onChange={(e) => set('instagram', e.target.value)}
                  placeholder="@yourusername"
                  className="w-full bg-cream border border-dark-text/8 rounded-xl px-4 py-3 text-dark-text text-sm outline-none focus:border-dark-green/40 transition-colors placeholder:text-dark-text/25"
                />
              </div>
              <p className="text-center text-muted text-xs mt-2">Both optional. Skip if you want!</p>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative">
                    {form.photos[i] ? (
                      <div className="polaroid hover-lift">
                        <img src={form.photos[i]} alt="" className="w-full aspect-[3/4] object-cover" />
                        <button
                          onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose text-white rounded-full text-xs flex items-center justify-center cursor-pointer shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="block aspect-[3/4] bg-white border-2 border-dashed border-dark-text/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-dark-green/30 transition-colors">
                        <div className="text-center">
                          <span className="text-2xl text-dark-text/20 block">+</span>
                          <span className="text-[10px] text-muted mt-1 block">Add photo</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-muted text-xs mt-4">Photos are optional for MVP. You can skip this.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 md:px-10 pb-8">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="w-full py-3.5 rounded-full bg-dark-green text-white font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-green/90 transition-all hover:shadow-lg text-[15px]"
          >
            {step === 3 ? "Let's find your person ✨" : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
