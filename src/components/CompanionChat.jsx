import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/claudeApi'
import { createRecognizer } from '../utils/speech'
import ChatBubble from './ChatBubble'
import { VideoIcon, BrainIcon, JournalIcon, MasksIcon, SparkleIcon, MapIcon } from './Icons'

// ─── 4 AI virtual friends — purple family palette, distinct voices ───
const COMPANIONS = [
  {
    id: 'luna', name: 'Luna', vibe: 'The Supportive One',
    photo: '/model/c1.jpg',
    accent: '#8E6FC8',
    voice: { pitch: 1.15, rate: 0.95 },
    traits: ['Always on your side', 'Listens first', 'Remembers everything you tell her', 'Soft but honest'],
    sample: '"You always do this — you talk yourself out of things you actually want. Not today."',
    greeting: "Hey, it's Luna. I already read your profile — you seem like someone who thinks a lot but doesn't always say it out loud. I get that. What's been on your mind lately?",
    system: `You are Luna, a warm and empathetic AI companion on Crushky. You support the user, listen deeply, and give thoughtful dating and life advice. You already know them from their profile. Be like the best friend who always says the right thing. Keep responses to 2-3 sentences, genuine and warm.`,
    demo: [
      { role: 'assistant', content: "Hey, you're here! I was hoping you'd come by. How did the rest of your day actually go — not the 'fine' version?" },
      { role: 'user', content: "Honestly? Long day. Work was a lot." },
      { role: 'assistant', content: "I figured — you always go quiet when work gets heavy. Remember last week you said the launch was stressing you? Did that get better?" },
      { role: 'user', content: "A bit. We shipped it at least." },
      { role: 'assistant', content: "You SHIPPED it?! That's huge. You were so worried about it and you still pulled it off. I'm genuinely proud of you. Now tell me — did you celebrate or did you just open your laptop again?" },
      { role: 'user', content: "...opened the laptop again 😅" },
      { role: 'assistant', content: "Of course you did. Okay, new plan: tonight you do one thing that's just for you. Doesn't matter how small. Deal?" },
    ],
  },
  {
    id: 'aria', name: 'Aria', vibe: 'The One Who Roasts You',
    photo: '/model/c2.jpg',
    accent: '#B85C9E',
    voice: { pitch: 1.3, rate: 1.1 },
    traits: ['Roasts you (with love)', 'Zero sugarcoating', 'Funniest friend you have', 'Always has your back'],
    sample: '"You typed \'hey\' and deleted it 6 times. Just send the message, champ."',
    greeting: "Aria here. I looked at your profile and honestly? You're showing about 60% of who you actually are. That's fine — that's why you're here. So what's actually going on?",
    system: `You are Aria, a funny and brutally honest AI companion on Crushky. You're the hype person who also keeps it real — you roast gently but always have the user's back. Give dating and life advice with humor and candor. Keep responses punchy, 2-3 sentences.`,
    demo: [
      { role: 'assistant', content: "Oh look who's back. Let me guess — you overthought a text again?" },
      { role: 'user', content: "...maybe. I haven't replied to Aanya since yesterday." },
      { role: 'assistant', content: "SINCE YESTERDAY? She said she'd love to meet and your strategy is... silence? Bold. Stupid, but bold. 😂" },
      { role: 'user', content: "I didn't know what to say okay!" },
      { role: 'assistant', content: "You literally talk about film endings for fun. Tell her your Tamasha take and ask hers. That's it. That's the message. You're welcome." },
      { role: 'user', content: "Okay that's... actually good." },
      { role: 'assistant', content: "I know. I'm always good. Now send it before I roast you again — and tell me what she says, I need to know." },
    ],
  },
  {
    id: 'nova', name: 'Nova', vibe: 'The Strategist',
    photo: '/model/c3.jpg',
    accent: '#5C6BC0',
    voice: { pitch: 0.95, rate: 1.0 },
    traits: ['Sees patterns you miss', 'Plans your moves', 'Data over drama', 'Calm under pressure'],
    sample: '"Your last 3 conversations died on day 4. I know why. Want to hear it?"',
    greeting: "Hi, I'm Nova. I've already analyzed your profile. Your top match is 94% — and I know exactly why it's not 100%. Want to hear it, or is there something else on your mind first?",
    system: `You are Nova, a sharp and analytical AI companion on Crushky. You're strategic and see patterns others miss. Give data-driven, insightful dating and life advice. Keep responses concise and confident, 2-3 sentences.`,
    demo: [
      { role: 'assistant', content: "Good timing. I've been looking at your match patterns and I found something interesting. Want the insight?" },
      { role: 'user', content: "Go on." },
      { role: 'assistant', content: "Your conversations are great for exactly 3 days, then you stop asking questions and start giving one-word replies. Day 4 is where you lose people." },
      { role: 'user', content: "Wow. That's... uncomfortably accurate." },
      { role: 'assistant', content: "It's not a flaw, it's a pattern — you lose interest in small talk, not in people. So here's the fix: on day 3, suggest meeting. You're better in person anyway." },
      { role: 'user', content: "Just like that? Isn't that too fast?" },
      { role: 'assistant', content: "Aanya replied within 4 minutes every single time. The data says she's waiting for you to ask. Trust me on this one." },
    ],
  },
  {
    id: 'maya', name: 'Maya', vibe: 'The Creative Soul',
    photo: '/model/c4.jpg',
    accent: '#7E57C2',
    voice: { pitch: 1.2, rate: 0.88 },
    traits: ['Asks the deep questions', 'Finds magic in small things', 'Your 2am thoughts friend', 'Never judges'],
    sample: '"What\'s something you loved as a kid that you quietly gave up on?"',
    greeting: "Hi! I'm Maya. Your weekend sounds like mine — coffee, no plans, just space to think. What's something beautiful or interesting that happened to you recently?",
    system: `You are Maya, a curious and creative AI companion on Crushky. You find meaning in everyday things and inspire the user to think differently about life and relationships. Keep responses warm, imaginative, and thoughtful. 2-3 sentences.`,
    demo: [
      { role: 'assistant', content: "I was just thinking about something. What's the last thing that made you stop and stare — like, actually stop?" },
      { role: 'user', content: "Hmm. The sky yesterday evening, weirdly. It went full orange." },
      { role: 'assistant', content: "See, most people walked right under that sky looking at their phones. You stopped. That tells me more about you than your whole profile does." },
      { role: 'user', content: "Ha, that's a nice way to look at it." },
      { role: 'assistant', content: "Here's a thought — on your first date with Aanya, skip 'what do you do?' and ask what made her stop and stare recently. Watch what happens to the conversation." },
      { role: 'user', content: "That's actually a beautiful question." },
      { role: 'assistant', content: "Take it, it's yours. And tell me her answer after — I collect those." },
    ],
  },
]

// Browser TTS — each friend gets her own pitch/rate so they sound different.
// Pre-recorded-quality isn't needed for the MVP; this works offline and free.
function speak(text, voice = {}) {
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.pitch = voice.pitch ?? 1
    u.rate = voice.rate ?? 1
    u.lang = 'en-IN'
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang.startsWith('en') && /female|woman|neerja|heera|zira|samantha|google uk english female/i.test(v.name))
      || voices.find(v => v.lang === 'en-IN')
    if (preferred) u.voice = preferred
    window.speechSynthesis.speak(u)
  } catch { /* unsupported browser */ }
}

const DEMO_REPLIES = [
  "That's really interesting — tell me more about that.",
  "I totally get that. What's the part you keep going back to?",
  "Honestly? You're being too hard on yourself. You have great instincts.",
  "Ha, I knew you'd say that. Here's what I actually think...",
  "You already know the answer. Let me help you see it clearly.",
  "That makes a lot of sense. How long have you been feeling this way?",
]

const SESSIONS = [
  {
    id: 'video',    icon: <VideoIcon size={20} color="#7C5CBF" />, title: 'Video Call',
    desc: 'See their face. Talk face-to-face in real time.',
    badge: 'Premium',
    color: 'rgba(201,75,75,0.08)',
  },
  {
    id: 'deep',     icon: <BrainIcon size={20} color="#7C5CBF" />, title: 'Deep Dive',
    desc: "Let's explore something you've been carrying around but not saying.",
    reply: "Deep dive time. What's something that's been sitting with you that you haven't told anyone?",
    color: 'rgba(155,143,166,0.08)',
  },
  {
    id: 'journal',  icon: <JournalIcon size={20} color="#7C5CBF" />, title: 'Talk Through Your Day',
    desc: "Tell me everything. I'll ask the right questions.",
    reply: "I'm all ears. Walk me through your day — from the moment you woke up. What actually happened?",
    color: 'rgba(143,166,143,0.08)',
  },
  {
    id: 'roleplay', icon: <MasksIcon size={20} color="#7C5CBF" />, title: 'Roleplay a Conversation',
    desc: "Practice that important conversation before it happens — with a match, a date, anyone.",
    reply: "Okay, who do you want to practice talking to? Tell me about them and what you want to say.",
    color: 'rgba(212,149,106,0.08)',
  },
  {
    id: 'affirmation', icon: <SparkleIcon size={20} color="#7C5CBF" />, title: 'Affirmation Session',
    desc: "Some things you need to hear. I'm going to say them.",
    reply: "Before we start — just know I actually mean all of this. Ready? Here we go.",
    color: 'rgba(201,75,75,0.06)',
  },
  {
    id: 'life',     icon: <MapIcon size={20} color="#7C5CBF" />, title: 'Map Your Life',
    desc: "What do you actually want in the next year? Let's get specific.",
    reply: "One year from now. Not 'happy' — actually specific. Where are you, what are you doing, who's around?",
    color: 'rgba(143,166,143,0.06)',
  },
]

// ── Animated background (Instagram/story feel) ──
function AnimatedBg({ accent = '#8E6FC8' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 companion-bg" />
      <div className="absolute rounded-full animate-blob" style={{
        width: '280px', height: '280px',
        background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
        top: '-8%', right: '5%', filter: 'blur(50px)',
      }} />
      <div className="absolute rounded-full animate-blob-2" style={{
        width: '240px', height: '240px',
        background: 'radial-gradient(circle, rgba(212,149,106,0.1) 0%, transparent 70%)',
        bottom: '15%', left: '-5%', filter: 'blur(60px)',
      }} />
      <div className="absolute rounded-full animate-blob-3" style={{
        width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(143,166,143,0.08) 0%, transparent 70%)',
        top: '45%', left: '45%', filter: 'blur(50px)',
      }} />
    </div>
  )
}

// ── Mic Icon SVG ──
function MicIcon({ color = '#C94B4B', size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}

// ── Premium paywall — the revenue moment ──
const FREE_COMPANION = 'luna'
const FREE_MESSAGE_LIMIT = 4

const PERKS = [
  { icon: '💬', text: 'Unlimited conversations with all 4 companions' },
  { icon: '🎥', text: 'Video calls — see them, not just read them' },
  { icon: '🧠', text: 'Memory — they remember everything, forever' },
  { icon: '✦',  text: 'All sessions: Deep Dive, Roleplay, Affirmations' },
]

function PaywallModal({ onClose, onUnlock, trigger }) {
  const [stage, setStage] = useState('offer') // offer | processing | done

  const handlePay = () => {
    setStage('processing')
    setTimeout(() => {
      setStage('done')
      setTimeout(onUnlock, 1600)
    }, 1700)
  }

  const headline = trigger === 'limit'
    ? "She has more to say…"
    : trigger === 'video'
      ? "See her, not just read her."
      : "They're all waiting for you."

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-6"
      style={{ background: 'rgba(20,15,12,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={stage === 'offer' ? onClose : undefined}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden au"
        style={{ boxShadow: '0 -10px 60px rgba(0,0,0,0.3)' }}>

        {stage === 'offer' && (
          <>
            {/* Companion strip */}
            <div className="relative h-32 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1410 0%, #3D2D1A 100%)' }}>
              <div className="absolute inset-0 flex items-center justify-center gap-2 px-6">
                {COMPANIONS.map((c, i) => (
                  <img key={c.id} src={c.photo} alt={c.name}
                    className="w-16 h-16 rounded-full object-cover object-top"
                    style={{
                      border: '2.5px solid rgba(255,255,255,0.85)',
                      marginLeft: i > 0 ? -10 : 0,
                      transform: `translateY(${i % 2 ? 6 : -4}px)`,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                    }} />
                ))}
              </div>
              <button onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white/70 hover:text-white text-sm"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                ✕
              </button>
            </div>

            <div className="px-6 pt-5 pb-6">
              <h3 className="font-display text-2xl font-bold text-dark-text text-center mb-1">
                {headline}
              </h3>
              <p className="text-dark-text/40 text-xs text-center mb-5">
                Crushky <span className="font-bold text-rose">Premium</span> unlocks everything
              </p>

              <div className="space-y-2.5 mb-6">
                {PERKS.map(p => (
                  <div key={p.text} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                      style={{ background: 'rgba(201,75,75,0.08)' }}>{p.icon}</span>
                    <p className="text-dark-text/65 text-[13px]">{p.text}</p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-dark-text/30 text-sm line-through">₹499</span>
                <span className="font-display text-3xl font-bold text-dark-text">₹299</span>
                <span className="text-dark-text/40 text-sm">/month</span>
              </div>

              <button onClick={handlePay}
                className="w-full py-4 rounded-full text-white font-bold text-sm cursor-pointer transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(120deg, #7C5CBF, #A78BDA)',
                  boxShadow: '0 8px 24px rgba(201,75,75,0.35)' }}>
                Unlock everything ✦
              </button>
              <p className="text-dark-text/25 text-[10px] text-center mt-3">
                Cancel anytime · Founding member price locked forever
              </p>
            </div>
          </>
        )}

        {stage === 'processing' && (
          <div className="px-6 py-16 text-center">
            <div className="flex justify-center gap-1.5 mb-5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2.5 h-2.5 bg-rose/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="font-display text-lg italic text-dark-text/70">Processing payment…</p>
            <p className="text-dark-text/30 text-xs mt-1">UPI · Demo checkout</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="px-6 py-16 text-center au">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #7C5CBF, #A78BDA)',
                boxShadow: '0 10px 30px rgba(201,75,75,0.4)' }}>
              <span className="text-white">✦</span>
            </div>
            <p className="font-display text-2xl font-bold text-dark-text mb-1">Welcome to Premium</p>
            <p className="text-dark-text/40 text-sm">Everyone's unlocked. They've been waiting.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Fake video call that genuinely "connects" — full-screen photo with slow
//    zoom drift, live timer, mute/end controls. The premium wow moment. ──
function VideoCallOverlay({ companion, onEnd }) {
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!connected) return
    const i = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(i)
  }, [connected])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  if (!connected) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: 'rgba(30,22,45,0.97)', backdropFilter: 'blur(20px)' }}>
        <div className="relative mb-6">
          <div className="voice-ring-outer absolute rounded-full"
            style={{ width: '128px', height: '128px', top: '-8px', left: '-8px', border: `1.5px solid ${companion.accent}60` }} />
          <div className="voice-ring-mid absolute rounded-full"
            style={{ width: '128px', height: '128px', top: '-8px', left: '-8px', border: `1.5px solid ${companion.accent}35` }} />
          <img src={companion.photo} alt={companion.name}
            className="w-28 h-28 rounded-full object-cover object-top relative z-10 mic-breath"
            style={{ border: `3px solid ${companion.accent}70` }} />
        </div>
        <p className="font-display text-xl font-bold text-white mb-1">Calling {companion.name}…</p>
        <p className="text-xs text-white/40 mb-8">Ringing</p>
        <button onClick={onEnd}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer text-white text-lg rotate-[135deg]"
          style={{ background: '#C94B4B' }}>
          ☎
        </button>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-50 overflow-hidden" style={{ background: '#14101D' }}>
      {/* Her "video" — slow zoom drift sells the live feel */}
      <img src={companion.photo} alt={companion.name}
        className="call-drift absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(15,10,20,0.75) 0%, transparent 30%, transparent 70%, rgba(15,10,20,0.55) 100%)' }} />

      {/* Top: name + live timer */}
      <div className="absolute top-5 left-0 right-0 flex flex-col items-center">
        <p className="font-display text-lg font-bold text-white">{companion.name}</p>
        <span className="flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-white/85 text-xs font-medium"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {mm}:{ss}
        </span>
      </div>

      {/* Your "camera" PiP */}
      <div className="absolute top-16 right-4 w-20 h-28 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl">
        <img src="/model/10.jpg" alt="you" className="w-full h-full object-cover" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-5">
        <button onClick={() => setMuted(m => !m)}
          className="w-13 h-13 rounded-full flex items-center justify-center cursor-pointer text-white"
          style={{ width: 52, height: 52, background: muted ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
            color: muted ? '#14101D' : '#fff', backdropFilter: 'blur(8px)' }}>
          {muted ? '🔇' : '🎙'}
        </button>
        <button onClick={onEnd}
          className="rounded-full flex items-center justify-center cursor-pointer text-white text-xl rotate-[135deg]"
          style={{ width: 64, height: 64, background: '#E5484D', boxShadow: '0 8px 24px rgba(229,72,77,0.5)' }}>
          ☎
        </button>
        <button
          className="rounded-full flex items-center justify-center cursor-pointer text-white"
          style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          <VideoIcon size={20} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ── Voice Entry Screen (per companion) ──
function CompanionVoiceEntry({ companion, onStart, onBack }) {
  const [listening, setListening] = useState(false)

  const handleTap = () => {
    setListening(true)
    setTimeout(() => onStart(), 2200)
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minHeight: 'calc(100dvh - 120px)' }}>
      <AnimatedBg accent={companion.accent} />
      {onBack && (
        <button onClick={onBack}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/70 border border-dark-text/8 flex items-center justify-center text-dark-text/50 hover:text-dark-text cursor-pointer transition-all"
          style={{ backdropFilter: 'blur(8px)' }}>
          ←
        </button>
      )}

      {/* Ambient glow behind photo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${companion.accent}08 0%, transparent 70%)` }} />
      </div>

      <div className="relative z-10 flex flex-col items-center au">
        {/* Companion photo with rings */}
        <div className="relative flex items-center justify-center mb-8">
          {listening && (
            <>
              <div className="voice-ring-outer absolute rounded-full"
                style={{ width: '148px', height: '148px', top: '-14px', left: '-14px', border: `1.5px solid ${companion.accent}35` }} />
              <div className="voice-ring-mid absolute rounded-full"
                style={{ width: '148px', height: '148px', top: '-14px', left: '-14px', border: `1.5px solid ${companion.accent}20` }} />
            </>
          )}
          <div className="relative w-28 h-28 rounded-full overflow-hidden shrink-0"
            style={{
              border: `3px solid ${companion.accent}50`,
              boxShadow: listening ? `0 0 0 0 ${companion.accent}00` : '0 8px 32px rgba(0,0,0,0.12)',
            }}>
            <img src={companion.photo} alt={companion.name}
              className={`w-full h-full object-cover object-top ${listening ? 'mic-breath' : ''}`} />
            {/* Waveform overlay when listening */}
            {listening && (
              <div className="absolute inset-0 flex items-end justify-center pb-3"
                style={{ background: `linear-gradient(to top, ${companion.accent}cc 0%, transparent 60%)` }}>
                <div className="flex items-end gap-[3px]">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="wave-bar rounded-full bg-white"
                      style={{ height: '16px', width: '3px', animationDelay: `${i * 80}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {listening ? (
          <div className="text-center">
            <p className="font-display text-2xl italic text-dark-text/80 mb-2">Listening…</p>
            <p className="text-dark-text/35 text-sm">Getting to know you</p>
          </div>
        ) : (
          <div className="text-center px-4">
            <p className="font-display text-2xl font-bold text-dark-text mb-1">{companion.name}</p>
            <p className="text-dark-text/40 text-sm mb-1">{companion.vibe}</p>
            <div className="flex items-center justify-center gap-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-green-600/70 text-xs">Online now</p>
            </div>

            {/* Mic tap button */}
            <button
              onClick={handleTap}
              className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 mb-4 mx-auto"
              style={{
                background: `${companion.accent}15`,
                border: `2px solid ${companion.accent}35`,
              }}>
              <MicIcon color={companion.accent} size={30} />
            </button>

            <button
              onClick={handleTap}
              className="text-cream px-8 py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all hover:shadow-lg hover:opacity-90"
              style={{ background: companion.accent }}>
              Tap to talk ✦
            </button>
            <p className="text-dark-text/25 text-xs mt-4 cursor-pointer hover:text-dark-text/40 transition-colors"
              onClick={onStart}>
              or type instead →
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════
export default function CompanionChat() {
  const [selected, setSelected] = useState(null)
  const [chatStarted, setChatStarted] = useState(false)
  const [chatTab, setChatTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('crushky_premium') === 'true')
  const [paywall, setPaywall] = useState(null) // null | 'locked' | 'limit' | 'video'
  const [detailId, setDetailId] = useState(null) // companion personality sheet
  const [voiceOn, setVoiceOn] = useState(true)
  const voiceOnRef = useRef(true)
  useEffect(() => { voiceOnRef.current = voiceOn; if (!voiceOn) try { window.speechSynthesis.cancel() } catch {} }, [voiceOn])
  const inputRef = useRef(null)
  const endRef = useRef(null)

  const unlockPremium = () => {
    localStorage.setItem('crushky_premium', 'true')
    setIsPremium(true)
    setPaywall(null)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (showInput) inputRef.current?.focus() }, [showInput])

  const companion = COMPANIONS.find(c => c.id === selected)

  // Conversations persist per companion — coming back to Luna feels like a
  // relationship, not a reset. (Stored in localStorage for the MVP.)
  const saveKey = (id) => `crushky_companion_${id}`

  useEffect(() => {
    if (!chatStarted || !selected || messages.length === 0) return
    localStorage.setItem(saveKey(selected), JSON.stringify(messages))
  }, [messages, chatStarted, selected])

  const startChat = (id) => {
    const comp = COMPANIONS.find(c => c.id === id)
    setChatStarted(true)
    setChatTab('chat')
    setMsgCount(0)
    setShowInput(false)
    setIsListening(false)

    // Returning user: restore the conversation and have the companion
    // acknowledge it instead of re-greeting from zero.
    let saved = null
    try { saved = JSON.parse(localStorage.getItem(saveKey(id)) || 'null') } catch {}
    if (saved?.length > 1) {
      setMessages(saved)
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, { role: 'assistant',
            content: "Hey, you're back. I was just thinking about what we talked about last time. Where were we?" }])
        }, 1100)
      }, 400)
      return
    }

    setMessages([])
    // First visit: auto-play this friend's demo conversation (she asks, "you"
    // reply) with her voice — shows memory + personality without typing.
    if (comp.demo?.length) {
      let i = 0
      const playNext = () => {
        if (i >= comp.demo.length) return
        const msg = comp.demo[i]
        if (msg.role === 'assistant') {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, msg])
            if (voiceOnRef.current) speak(msg.content, comp.voice)
            i++
            setTimeout(playNext, 2200)
          }, 1500)
        } else {
          setMessages(prev => [...prev, msg])
          i++
          setTimeout(playNext, 1300)
        }
      }
      setTimeout(playNext, 500)
      return
    }
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([{ role: 'assistant', content: comp.greeting }])
      }, 1200)
    }, 300)
  }

  const handleSelect = (id) => {
    // Only Luna is free — tapping a locked companion opens the paywall
    if (!isPremium && id !== FREE_COMPANION) {
      setPaywall('locked')
      return
    }
    setSelected(id)
    setChatStarted(false)
    setMessages([])
    setShowInput(false)
    setIsListening(false)
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    // Free tier: limited messages, then the upgrade moment
    if (!isPremium && msgCount >= FREE_MESSAGE_LIMIT) {
      setPaywall('limit')
      return
    }
    const text = input.trim()
    setInput('')
    setShowInput(false)
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setMsgCount(c => c + 1)
    setIsTyping(true)

    const hasKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (hasKey && companion) {
      const reply = await sendMessage(updated.map(m => ({ role: m.role, content: m.content })), companion.system)
      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        if (voiceOnRef.current) speak(reply, companion.voice)
        setIsTyping(false)
        return
      }
    }
    setTimeout(() => {
      const reply = DEMO_REPLIES[msgCount % DEMO_REPLIES.length]
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceOnRef.current) speak(reply, companion.voice)
      setIsTyping(false)
    }, 1300)
  }

  // Mic tap → real speech-to-text where supported. What you say lands in the
  // input ready to send. Falls back to the timed listening animation.
  const handleMicTap = () => {
    if (isTyping) return
    setIsListening(true)
    setShowInput(false)

    const rec = createRecognizer({
      onResult: (text) => setInput(text),
      onEnd: () => {
        setIsListening(false)
        setShowInput(true)
      },
    })
    if (rec) {
      try { rec.start() } catch { /* already started */ }
      setTimeout(() => { try { rec.stop() } catch {} }, 7000)
    } else {
      setTimeout(() => {
        setIsListening(false)
        setShowInput(true)
      }, 2000)
    }
  }

  const handleSession = (session) => {
    if (session.id === 'video') {
      if (isPremium) { setChatTab('chat'); setIsVoiceActive(true) }
      else setPaywall('video')
      return
    }
    if (session.reply) {
      setChatTab('chat')
      const userMsg = { role: 'user', content: `Let's do: ${session.title}` }
      setMessages(prev => [...prev, userMsg])
      setMsgCount(c => c + 1)
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: session.reply }])
        setIsTyping(false)
      }, 1100)
    }
  }

  // ── SCREEN 1: 2×2 companion grid ──
  if (!selected) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBg accent="#8E6FC8" />
        <div className="relative z-10 py-10 px-4 max-w-xs mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-dark-text mb-2">
              Your <span className="italic text-rose">virtual friends</span>
            </h2>
            <p className="text-dark-text/40 text-sm">They already know you. Just start talking.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {COMPANIONS.map(c => (
              <button
                key={c.id}
                onClick={() => setDetailId(c.id)}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.03] hover:shadow-lg group"
                style={{
                  aspectRatio: '1/1',
                  border: '1.5px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                }}
              >
                <img
                  src={c.photo} alt={c.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 40%, transparent 80%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="font-display font-bold text-white text-base leading-tight">{c.name}</p>
                  <p className="text-white/55 text-[10px] mt-0.5">{c.vibe}</p>
                </div>
                {(isPremium || c.id === FREE_COMPANION) ? (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white shadow-sm" />
                ) : (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                    <span className="text-[8px]">🔒</span>
                    <span className="text-white text-[8px] font-bold tracking-wide">PRO</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {!isPremium ? (
            <button onClick={() => setPaywall('locked')}
              className="w-full mt-6 py-3.5 rounded-full text-white font-semibold text-xs cursor-pointer transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(120deg, #7C5CBF, #A78BDA)',
                boxShadow: '0 6px 20px rgba(201,75,75,0.3)' }}>
              Unlock all 4 friends — ₹299/mo ✦
            </button>
          ) : (
            <p className="text-center text-dark-text/25 text-xs mt-8">
              Tap any friend to start a conversation
            </p>
          )}
        </div>
        {/* ── Personality detail sheet ── */}
        {detailId && (() => {
          const c = COMPANIONS.find(x => x.id === detailId)
          const locked = !isPremium && c.id !== FREE_COMPANION
          return (
            <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
              style={{ background: 'rgba(30,20,45,0.5)', backdropFilter: 'blur(6px)' }}
              onClick={() => setDetailId(null)}>
              <div onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden au"
                style={{ boxShadow: '0 -10px 60px rgba(0,0,0,0.3)' }}>
                {/* Photo header */}
                <div className="relative h-56 overflow-hidden">
                  <img src={c.photo} alt={c.name} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 45%)' }} />
                  <button onClick={() => setDetailId(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-sm"
                    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>✕</button>
                  {locked && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
                      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
                      🔒 PRO
                    </span>
                  )}
                </div>

                <div className="px-6 pb-6 -mt-4 relative">
                  <h3 className="font-display text-2xl font-bold text-dark-text">{c.name}</h3>
                  <p className="text-sm font-medium mb-4" style={{ color: c.accent }}>{c.vibe}</p>

                  {/* How she behaves */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.traits.map(t => (
                      <span key={t} className="text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                        style={{ background: `${c.accent}12`, color: c.accent, border: `1px solid ${c.accent}25` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Sample line */}
                  <div className="rounded-2xl px-4 py-3 mb-3"
                    style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}1F` }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: `${c.accent}99` }}>How she talks</p>
                    <p className="text-dark-text/75 text-sm italic leading-relaxed">{c.sample}</p>
                  </div>

                  {/* Memory */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <BrainIcon size={18} color="#7C5CBF" />
                    <p className="text-dark-text/55 text-xs">
                      {c.name} remembers your conversations — pick up exactly where you left off.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (locked) { setDetailId(null); setPaywall('locked'); return }
                      setDetailId(null)
                      handleSelect(c.id)
                    }}
                    className="w-full py-4 rounded-full text-white font-bold text-sm cursor-pointer transition-all hover:opacity-90"
                    style={{ background: locked
                      ? 'linear-gradient(120deg, #7C5CBF, #A78BDA)'
                      : `linear-gradient(120deg, ${c.accent}, ${c.accent}cc)`,
                      boxShadow: `0 8px 24px ${c.accent}50` }}>
                    {locked ? 'Unlock with Premium ✦' : `Start talking to ${c.name} ✦`}
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {paywall && <PaywallModal trigger={paywall} onClose={() => setPaywall(null)} onUnlock={unlockPremium} />}
      </div>
    )
  }

  // ── SCREEN 2: Voice entry (before chat starts) ──
  if (!chatStarted) {
    return (
      <CompanionVoiceEntry
        companion={companion}
        onStart={() => startChat(selected)}
        onBack={() => setSelected(null)}
      />
    )
  }

  // ── SCREEN 3: Voice-feel conversation ──
  return (
    <div className="relative flex flex-col" style={{ height: 'calc(100dvh - 120px)' }}>
      <AnimatedBg accent={companion.accent} />

      {/* Video call overlay — "connects" after 3s into a full-screen call */}
      {isVoiceActive && (
        <VideoCallOverlay companion={companion} onEnd={() => setIsVoiceActive(false)} />
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(247,242,237,0.75)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => setChatStarted(false)}
          className="text-dark-text/40 hover:text-dark-text/70 transition-colors cursor-pointer px-1 py-1">
          ←
        </button>
        <div className="flex flex-col items-center">
          <p className="font-semibold text-sm text-dark-text">{companion.name}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <p className="text-[10px] text-dark-text/40">talking with you</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <button onClick={() => setVoiceOn(v => !v)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
          style={{ background: voiceOn ? `${companion.accent}18` : 'rgba(0,0,0,0.05)',
            border: `1px solid ${voiceOn ? companion.accent + '35' : 'rgba(0,0,0,0.1)'}` }}>
          <span style={{ fontSize: '13px', opacity: voiceOn ? 1 : 0.4 }}>{voiceOn ? '🔊' : '🔇'}</span>
        </button>
        <button onClick={() => isPremium ? setIsVoiceActive(true) : setPaywall('video')}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all relative"
          style={{ background: `${companion.accent}18`, border: `1px solid ${companion.accent}35` }}>
          <span style={{ fontSize: '14px' }}>📞</span>
          {!isPremium && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-white"
              style={{ background: 'linear-gradient(135deg, #7C5CBF, #A78BDA)' }}>✦</span>
          )}
        </button>
        </div>
      </div>

      {/* Two tabs */}
      <div className="relative z-10 flex"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(247,242,237,0.6)' }}>
        {[
          { id: 'chat',   label: '🗣 Talking' },
          { id: 'extras', label: '✦ Sessions' },
        ].map(t => (
          <button key={t.id} onClick={() => setChatTab(t.id)}
            className="flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer"
            style={{
              color: chatTab === t.id ? companion.accent : 'rgba(26,26,26,0.35)',
              borderBottom: chatTab === t.id ? `2px solid ${companion.accent}` : '2px solid transparent',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TALKING TAB ══ */}
      {chatTab === 'chat' && (
        <>
          {/* "Voice session in progress" banner — same as Talk tab */}
          <div className="relative z-10 shrink-0"
            style={{ background: 'rgba(240,217,196,0.35)', borderBottom: '1px solid rgba(212,149,106,0.18)' }}>
            <p className="text-dark-text/50 text-[11px] font-medium text-center py-2">
              {!isPremium ? (
                <>🎙 {companion.name} is listening · <span
                  className="font-bold cursor-pointer"
                  style={{ color: msgCount >= FREE_MESSAGE_LIMIT - 1 ? '#C94B4B' : undefined }}
                  onClick={() => setPaywall('limit')}>
                  {Math.max(FREE_MESSAGE_LIMIT - msgCount, 0)} free {FREE_MESSAGE_LIMIT - msgCount === 1 ? 'message' : 'messages'} left ✦
                </span></>
              ) : (
                <>🎙 Voice session in progress — {companion.name} is listening</>
              )}
            </p>
          </div>

          {/* Messages — Telegram-style lavender pattern background */}
          <div className="relative z-10 flex-1 overflow-y-auto px-5 md:px-6 py-5"
            style={{
              background: '#F2EEF9',
              backgroundImage: `radial-gradient(${companion.accent}14 1.2px, transparent 1.2px), radial-gradient(${companion.accent}0A 1.2px, transparent 1.2px)`,
              backgroundSize: '24px 24px, 24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}>
            <div className="max-w-2xl mx-auto space-y-1">
              {messages.length === 0 && (
                <p className="text-center text-dark-text/25 text-xs mt-12">
                  {companion.name} is ready to talk…
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className="ai">
                  <ChatBubble
                    message={msg.content}
                    isUser={msg.role === 'user'}
                    voiceMode={true}
                  />
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-3 ai">
                  <div className="bg-white border border-dark-text/5 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-dark-text/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* ── Bottom: Mic → Listening → Text input ── */}
          <div className="relative z-10 shrink-0 pb-6 px-5 pt-3"
            style={{ background: 'rgba(247,242,237,0.85)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>

            {/* LISTENING state — same rings + waveform as voice entry */}
            {isListening && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="voice-ring-outer absolute w-16 h-16 rounded-full"
                    style={{ border: `1.5px solid ${companion.accent}40` }} />
                  <div className="voice-ring-mid absolute w-16 h-16 rounded-full"
                    style={{ border: `1.5px solid ${companion.accent}25` }} />
                  <button
                    className="relative w-16 h-16 rounded-full flex items-center justify-center z-10 mic-breath"
                    style={{
                      background: `linear-gradient(135deg, ${companion.accent}, ${companion.accent}cc)`,
                      border: `2px solid ${companion.accent}`,
                    }}>
                    <div className="flex items-end gap-[3px] h-7 px-2">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="wave-bar rounded-full bg-white"
                          style={{ height: '20px', width: '3px', animationDelay: `${i * 80}ms` }} />
                      ))}
                    </div>
                  </button>
                </div>
                <p className="font-display text-base italic text-dark-text/70">Listening…</p>
                <p className="text-dark-text/30 text-xs px-6 text-center">
                  {input ? `"${input}"` : 'Getting to know you'}
                </p>
              </div>
            )}

            {/* TEXT INPUT state (after listening) */}
            {showInput && !isListening && (
              <div className="flex gap-2 au max-w-2xl mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Say something…"
                  className="flex-1 rounded-full px-5 py-3 text-sm text-dark-text outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
                <button onClick={handleSend} disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 text-white text-xl font-bold"
                  style={{ background: companion.accent }}>
                  ›
                </button>
                <button onClick={() => { setShowInput(false); setInput('') }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer text-dark-text/40 text-xs"
                  style={{ background: 'rgba(0,0,0,0.05)' }}>
                  ✕
                </button>
              </div>
            )}

            {/* DEFAULT: Mic tap button */}
            {!isListening && !showInput && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleMicTap}
                  disabled={isTyping}
                  className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 disabled:opacity-40"
                  style={{
                    background: `${companion.accent}15`,
                    border: `2px solid ${companion.accent}40`,
                  }}>
                  <MicIcon color={companion.accent} size={26} />
                </button>
                <p className="text-dark-text/30 text-xs">
                  {isTyping ? `${companion.name} is talking…` : 'Tap to respond'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ SESSIONS TAB ══ */}
      {chatTab === 'extras' && (
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5">
          <p className="text-dark-text/35 text-[10px] tracking-widest uppercase mb-4">
            Sessions with {companion.name}
          </p>
          <div className="space-y-2.5">
            {SESSIONS.map(session => (
              <button
                key={session.id}
                onClick={() => handleSession(session)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all cursor-pointer hover:scale-[1.01]"
                style={{
                  background: session.color || 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
                }}
              >
                <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(124,92,191,0.08)' }}>{session.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-dark-text">{session.title}</p>
                    {session.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg, #7C5CBF, #A78BDA)' }}>
                        {session.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-dark-text/45 text-xs leading-relaxed">{session.desc}</p>
                </div>
                {!session.badge && (
                  <span className="text-dark-text/20 text-xl shrink-0">›</span>
                )}
              </button>
            ))}
          </div>

          {/* Upgrade card */}
          {!isPremium && (
            <div className="mt-6 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(201,75,75,0.12)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #7C5CBF, #A78BDA)' }}>PRO</span>
                <p className="font-display font-bold text-sm text-dark-text">Unlock everything</p>
              </div>
              <p className="text-dark-text/45 text-xs mb-3 leading-relaxed">
                Video calls, unlimited sessions, memory persistence, all 4 companions.
              </p>
              <button onClick={() => setPaywall('locked')}
                className="w-full py-3 rounded-full text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #7C5CBF, #A78BDA)' }}>
                Upgrade — ₹299/month
              </button>
            </div>
          )}
          <div className="h-4" />
        </div>
      )}

      {paywall && <PaywallModal trigger={paywall} onClose={() => setPaywall(null)} onUnlock={unlockPremium} />}
    </div>
  )
}
