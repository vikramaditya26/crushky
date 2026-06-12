import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Tinder-style auth gate: full-bleed visual, logo, legalese, stacked auth
// buttons. Everything is demo — Google "signs in" after a beat, phone goes
// to the OTP screen. No real auth.
export default function Welcome() {
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogle = () => {
    setGoogleLoading(true)
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('crushky_user') || 'null')
      navigate(user ? '/dashboard' : '/signup')
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#1A1410' }}>
      {/* Background video */}
      <video autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover">
        <source src="/vid/v1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(20,15,12,0.96) 0%, rgba(20,15,12,0.55) 45%, rgba(20,15,12,0.35) 100%)' }} />

      {/* Logo center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <h1 className="font-display font-bold text-white" style={{ fontSize: 52, letterSpacing: '-0.02em' }}>
          Crushky
        </h1>
        <p className="text-white/60 text-sm mt-2 text-center">
          The app that listens before it matches.
        </p>
        <p className="font-display italic text-white/80 text-base mt-8 text-center">
          "So… tell me who you are."
        </p>
        <p className="text-white/35 text-[10px] tracking-[0.25em] uppercase mt-2">— Crushky, in about a minute</p>
      </div>

      {/* Auth stack */}
      <div className="relative z-10 px-6 pb-10 w-full max-w-sm mx-auto">
        <p className="text-white/45 text-[11px] text-center leading-relaxed mb-5 px-4">
          By tapping Sign in, you agree to our{' '}
          <span className="underline underline-offset-2">Terms</span>. Learn how we process
          your data in our <span className="underline underline-offset-2">Privacy Policy</span>.
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full bg-white font-semibold text-sm cursor-pointer transition-all hover:bg-white/90 active:scale-[0.98] mb-3 disabled:opacity-70"
          style={{ color: '#1A1410' }}>
          {googleLoading ? (
            <span className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: '#C94B4B', animationDelay: `${i * 150}ms` }} />
              ))}
            </span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Phone */}
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full font-semibold text-sm text-white cursor-pointer transition-all active:scale-[0.98] mb-5"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 16 }}>📱</span> Continue with phone number
        </button>

        <p className="text-white/40 text-xs text-center cursor-pointer hover:text-white/60 transition-colors"
          onClick={() => navigate('/login')}>
          Trouble signing in?
        </p>
      </div>
    </div>
  )
}
