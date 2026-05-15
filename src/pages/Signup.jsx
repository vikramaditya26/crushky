import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    lookingFor: '',
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('crushky_user', JSON.stringify(form))
    navigate('/chat')
  }

  const isValid = form.name && form.age && form.gender && form.lookingFor

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl font-bold text-light-text text-center mb-2">
            Let's get started
          </h1>
          <p className="text-light-text/60 text-center mb-10">
            Just the basics — our AI will learn the rest.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-light-text/80 mb-2">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="What should we call you?"
                className="w-full bg-card-dark border border-card-border rounded-xl px-4 py-3 text-light-text placeholder-light-text/30 focus:outline-none focus:border-rose transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-light-text/80 mb-2">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="How old are you?"
                min="18"
                max="99"
                className="w-full bg-card-dark border border-card-border rounded-xl px-4 py-3 text-light-text placeholder-light-text/30 focus:outline-none focus:border-rose transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-light-text/80 mb-2">I am</label>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update('gender', g)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                      form.gender === g
                        ? 'bg-rose border-rose text-white'
                        : 'bg-card-dark border-card-border text-light-text/60 hover:border-light-text/30'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-light-text/80 mb-2">Looking for</label>
              <div className="grid grid-cols-3 gap-3">
                {['Men', 'Women', 'Everyone'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => update('lookingFor', pref)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                      form.lookingFor === pref
                        ? 'bg-rose border-rose text-white'
                        : 'bg-card-dark border-card-border text-light-text/60 hover:border-light-text/30'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-full font-semibold text-lg transition-colors cursor-pointer ${
                isValid
                  ? 'bg-rose hover:bg-rose/90 text-white'
                  : 'bg-card-dark text-light-text/30 cursor-not-allowed'
              }`}
            >
              Start Talking to Crushky AI
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
