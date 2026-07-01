import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Fake phone + OTP login for the MVP. No backend — the OTP auto-fills after a
// short delay so the flow feels real in demos. Any 4 digits verify.
export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [stage, setStage] = useState('phone') // phone | otp | verifying
  const [otp, setOtp] = useState(['', '', '', ''])
  const [sending, setSending] = useState(false)
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]
  const phoneRef = useRef()

  useEffect(() => { phoneRef.current?.focus() }, [])

  const sendOtp = () => {
    if (phone.replace(/\D/g, '').length !== 10) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setStage('otp')
      // Demo magic: OTP types itself in after a beat
      const code = ['4', '2', '0', '7']
      code.forEach((d, i) => {
        setTimeout(() => {
          setOtp(prev => { const next = [...prev]; next[i] = d; return next })
          if (i === 3) setTimeout(verify, 600)
        }, 1400 + i * 280)
      })
    }, 900)
  }

  const verify = () => {
    setStage('verifying')
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('crushky_user') || 'null')
      navigate(user ? '/dashboard' : '/signup')
    }, 1200)
  }

  const handleOtpInput = (i, val) => {
    if (!/^\d?$/.test(val)) return
    setOtp(prev => { const next = [...prev]; next[i] = val; return next })
    if (val && i < 3) otpRefs[i + 1].current?.focus()
    if (val && i === 3) setTimeout(verify, 300)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: '#1A1410' }}>
      {/* Same cinematic backdrop as /start — one continuous entry experience */}
      <video autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover">
        <source src="/vid/v1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(20,15,12,0.92) 0%, rgba(20,15,12,0.6) 60%, rgba(20,15,12,0.45) 100%)' }} />

      <button onClick={() => navigate('/start')}
        className="fixed top-5 left-5 z-50 text-white/50 text-sm hover:text-white transition-colors cursor-pointer">
        ← Back
      </button>

      <div className="relative z-10 w-full max-w-xs text-center bg-white rounded-3xl px-6 py-10"
        style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
        <p className="font-display text-2xl font-bold text-dark-text mb-1">Crushky</p>

        {stage === 'phone' && (
          <div className="au">
            <h1 className="font-display text-3xl italic text-dark-text leading-snug mt-8 mb-3">
              Welcome <span className="text-rose">back.</span>
            </h1>
            <p className="text-dark-text/40 text-sm mb-12">
              Your conversations are waiting.
            </p>

            <div className="flex items-end gap-2 mb-10">
              <span className="text-dark-text/50 text-xl pb-3 shrink-0">+91</span>
              <input
                ref={phoneRef}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                placeholder="98765 43210"
                className="w-full bg-transparent border-0 border-b border-dark-text/15 pb-3 outline-none focus:border-rose/50 transition-colors text-dark-text placeholder:text-dark-text/20 text-2xl tracking-wider text-center"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={phone.length !== 10 || sending}
              className="w-full py-4 rounded-full text-white font-semibold text-sm cursor-pointer transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(120deg, #5B2E8F, #A98FD6)' }}>
              {sending ? 'Sending…' : 'Send OTP'}
            </button>

            <p className="text-dark-text/25 text-[11px] mt-6">
              New here?{' '}
              <span className="text-rose/70 cursor-pointer hover:text-rose underline underline-offset-2"
                onClick={() => navigate('/signup')}>
                Create your profile
              </span>
            </p>
          </div>
        )}

        {stage === 'otp' && (
          <div className="au">
            <h1 className="font-display text-3xl italic text-dark-text leading-snug mt-8 mb-3">
              Check your <span className="text-rose">phone.</span>
            </h1>
            <p className="text-dark-text/40 text-sm mb-12">
              We sent a code to +91 {phone.slice(0, 5)} {phone.slice(5)}
            </p>

            <div className="flex justify-center gap-3 mb-10">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  className="w-14 h-16 text-center text-2xl font-bold bg-white rounded-2xl outline-none transition-all text-dark-text"
                  style={{
                    border: d ? '2px solid #5B2E8F' : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: d ? '0 0 12px rgba(91,46,143,0.15)' : 'none',
                  }}
                />
              ))}
            </div>

            <p className="text-dark-text/25 text-[11px]">
              Didn't get it?{' '}
              <span className="text-rose/70 cursor-pointer hover:text-rose">Resend</span>
            </p>
            <p className="text-dark-text/20 text-[10px] mt-3 italic">
              Demo mode — the code fills itself in ✦
            </p>
          </div>
        )}

        {stage === 'verifying' && (
          <div className="au mt-12">
            <div className="flex justify-center gap-1.5 mb-6">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2.5 h-2.5 bg-rose/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="font-display text-xl italic text-dark-text/70">Letting you in…</p>
          </div>
        )}
      </div>
    </div>
  )
}
