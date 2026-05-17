import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai']

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 8
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    lookingFor: '',
    city: '',
    height: '',
    college: '',
    work: '',
    photos: [],
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const canContinue = () => {
    switch (step) {
      case 1: return form.name.trim().length >= 2
      case 2: return form.dob !== ''
      case 3: return form.gender !== ''
      case 4: return form.lookingFor !== ''
      case 5: return form.city.trim() !== ''
      case 6: return form.height !== ''
      case 7: return form.college.trim() !== '' || form.work.trim() !== ''
      case 8: return form.photos.length >= 1
      default: return false
    }
  }

  const next = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      localStorage.setItem('crushky_user', JSON.stringify(form))
      navigate('/dashboard')
    }
  }

  const back = () => {
    if (step > 1) setStep(step - 1)
    else navigate('/')
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (form.photos.length + files.length > 3) return
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, ev.target.result].slice(0, 3),
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const PillOption = ({ options, value, onChange }) => (
    <div className="flex flex-wrap gap-3 justify-center">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-8 py-3.5 rounded-full text-base font-medium transition-all cursor-pointer ${
            value === opt
              ? 'bg-dark-green text-white'
              : 'bg-white border border-dark-text/15 text-dark-text hover:border-dark-text/40'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream text-dark-text flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-dark-text/10">
        <div
          className="h-full bg-rose transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={back}
        className="fixed top-6 left-6 z-50 text-dark-text/60 hover:text-dark-text text-2xl cursor-pointer transition-colors"
      >
        &larr;
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-32">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">What's your first name?</h1>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your first name"
                autoFocus
                className="mt-10 w-full text-center text-2xl font-medium bg-transparent border-b-2 border-dark-text/20 focus:border-rose pb-3 outline-none placeholder:text-dark-text/25 transition-colors"
              />
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">When's your birthday?</h1>
              <p className="text-muted text-sm mb-10">You must be 18+ to use Crushky</p>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => update('dob', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full text-center text-xl bg-white border border-dark-text/15 rounded-xl px-4 py-4 outline-none focus:border-rose transition-colors text-dark-text"
              />
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">How do you identify?</h1>
              <PillOption
                options={['Man', 'Woman', 'Non-binary']}
                value={form.gender}
                onChange={(v) => update('gender', v)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Who are you looking for?</h1>
              <PillOption
                options={['Men', 'Women', 'Everyone']}
                value={form.lookingFor}
                onChange={(v) => update('lookingFor', v)}
              />
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Where are you based?</h1>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Search your city"
                autoFocus
                className="mt-10 w-full text-center text-xl bg-white border border-dark-text/15 rounded-xl px-4 py-4 outline-none focus:border-rose transition-colors placeholder:text-dark-text/25"
              />
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => update('city', city)}
                    className={`px-5 py-2 rounded-full text-sm cursor-pointer transition-all ${
                      form.city === city
                        ? 'bg-dark-green text-white'
                        : 'bg-white border border-dark-text/15 text-dark-text/70 hover:border-dark-text/40'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">How tall are you?</h1>
              <input
                type="number"
                value={form.height}
                onChange={(e) => update('height', e.target.value)}
                placeholder="Height in cm"
                min="140"
                max="210"
                autoFocus
                className="mt-10 w-full text-center text-2xl font-medium bg-transparent border-b-2 border-dark-text/20 focus:border-rose pb-3 outline-none placeholder:text-dark-text/25 transition-colors"
              />
              <p className="text-muted text-sm mt-4">e.g., 170 cm = 5'7"</p>
            </div>
          )}

          {step === 7 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">What do you do?</h1>
              <p className="text-muted text-sm mb-10">Share one or both</p>
              <input
                type="text"
                value={form.college}
                onChange={(e) => update('college', e.target.value)}
                placeholder="College / University"
                className="w-full text-lg bg-white border border-dark-text/15 rounded-xl px-4 py-4 outline-none focus:border-rose transition-colors placeholder:text-dark-text/25 mb-4"
              />
              <input
                type="text"
                value={form.work}
                onChange={(e) => update('work', e.target.value)}
                placeholder="Job title / Company"
                className="w-full text-lg bg-white border border-dark-text/15 rounded-xl px-4 py-4 outline-none focus:border-rose transition-colors placeholder:text-dark-text/25"
              />
            </div>
          )}

          {step === 8 && (
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Add your best photos</h1>
              <p className="text-muted text-sm mb-10">Add at least 1 photo to continue</p>
              <div className="flex gap-4 justify-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative">
                    {form.photos[i] ? (
                      <div className="relative">
                        <img
                          src={form.photos[i]}
                          alt=""
                          className="w-24 h-32 md:w-28 md:h-36 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose text-white rounded-full text-xs flex items-center justify-center cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="w-24 h-32 md:w-28 md:h-36 border-2 border-dashed border-dark-text/20 rounded-xl flex items-center justify-center cursor-pointer hover:border-dark-text/40 transition-colors">
                        <span className="text-dark-text/30 text-3xl">+</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-cream">
        <div className="max-w-md mx-auto">
          <button
            onClick={next}
            disabled={!canContinue()}
            className={`w-full py-4 rounded-full text-lg font-semibold transition-all cursor-pointer ${
              canContinue()
                ? 'bg-dark-green text-white hover:bg-dark-green/90'
                : 'bg-dark-text/10 text-dark-text/30 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? 'Start Talking to Crushky' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
