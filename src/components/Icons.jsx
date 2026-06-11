// Real brand icons (official glyph shapes, inline SVG)

export function SpotifyIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.05 8.5-.6 11.66 1.34.35.22.46.67.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.54-1.79c4.37-1.33 9.8-.69 13.5 1.6.44.27.58.85.3 1.28zm.13-3.41C15.24 8.32 8.84 8.11 5.14 9.23a1.12 1.12 0 1 1-.65-2.15c4.25-1.29 11.31-1.04 15.77 1.61a1.12 1.12 0 0 1-1.16 1.93z"/>
    </svg>
  )
}

export function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="30%" stopColor="#FF7A00" />
          <stop offset="60%" stopColor="#FF0069" />
          <stop offset="100%" stopColor="#D300C5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#igGrad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" stroke="url(#igGrad)" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="url(#igGrad)" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
      <path d="M12 0a12 12 0 0 0-10.4 18L0 24l6.2-1.6A12 12 0 1 0 12 0zm0 21.8a9.8 9.8 0 0 1-5-1.4l-.36-.21-3.67.96.98-3.58-.23-.37A9.82 9.82 0 1 1 12 21.8zm5.4-7.34c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07a8.03 8.03 0 0 1-2.36-1.46 8.85 8.85 0 0 1-1.63-2.03c-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35z"/>
    </svg>
  )
}

export function CalendarIcon({ size = 18, color = '#C94B4B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  )
}

export function PinIcon({ size = 18, color = '#C94B4B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
