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

// ── Thin-line UI icons (consistent 1.8 stroke, currentColor-friendly) ──
function Line({ size = 18, color = 'currentColor', children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children}
    </svg>
  )
}

export const WaveIcon = (p) => (
  <Line {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></Line>
)
export const CakeIcon = (p) => (
  <Line {...p}><path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 2-1 2.5-.6"/><line x1="12" y1="8" x2="12" y2="12"/><path d="M12 8a1.8 1.8 0 0 0 1.8-1.8C13.8 4.6 12 3 12 3s-1.8 1.6-1.8 3.2A1.8 1.8 0 0 0 12 8z"/></Line>
)
export const BriefcaseIcon = (p) => (
  <Line {...p}><rect x="2.5" y="7.5" width="19" height="13" rx="2.5"/><path d="M8.5 7.5V6a2.5 2.5 0 0 1 2.5-2.5h2A2.5 2.5 0 0 1 15.5 6v1.5"/><path d="M2.5 13h19"/></Line>
)
export const SparkleIcon = (p) => (
  <Line {...p}><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></Line>
)
export const PenIcon = (p) => (
  <Line {...p}><path d="M17 3l4 4L8 20l-5 1 1-5z"/><line x1="14" y1="6" x2="18" y2="10"/></Line>
)
export const CameraIcon = (p) => (
  <Line {...p}><path d="M3 8.5a2 2 0 0 1 2-2h2l1.5-2.5h7L17 6.5h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></Line>
)
export const HeartIcon = (p) => (
  <Line {...p}><path d="M12 20.5s-7.5-4.6-9.3-9.3C1.4 7.9 3.6 4.5 7 4.5c2 0 3.7 1.1 5 3 1.3-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.7C19.5 15.9 12 20.5 12 20.5z"/></Line>
)
export const BellIcon = (p) => (
  <Line {...p}><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></Line>
)
export const ShieldIcon = (p) => (
  <Line {...p}><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="M9 11.5l2 2 4-4.5"/></Line>
)
export const DownloadIcon = (p) => (
  <Line {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Line>
)
export const BlockIcon = (p) => (
  <Line {...p}><circle cx="12" cy="12" r="9"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/></Line>
)
export const HelpIcon = (p) => (
  <Line {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.3-2.4 3.8"/><line x1="12" y1="17" x2="12.01" y2="17"/></Line>
)
export const EyeIcon = (p) => (
  <Line {...p}><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></Line>
)
export const PhoneIcon = (p) => (
  <Line {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><line x1="10.5" y1="18.5" x2="13.5" y2="18.5"/></Line>
)
export const VideoIcon = (p) => (
  <Line {...p}><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></Line>
)
export const BrainIcon = (p) => (
  <Line {...p}><path d="M9.5 3a3 3 0 0 0-3 3 3.3 3.3 0 0 0-2.4 4A3.2 3.2 0 0 0 3 13a3.3 3.3 0 0 0 2.5 3.2A3 3 0 0 0 9 21c1.5 0 2.5-.8 3-2V5a3 3 0 0 0-2.5-2z"/><path d="M14.5 3a3 3 0 0 1 3 3 3.3 3.3 0 0 1 2.4 4 3.2 3.2 0 0 1 1.1 3 3.3 3.3 0 0 1-2.5 3.2A3 3 0 0 1 15 21c-1.5 0-2.5-.8-3-2"/></Line>
)
export const JournalIcon = (p) => (
  <Line {...p}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M4 17h16"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></Line>
)
export const MasksIcon = (p) => (
  <Line {...p}><path d="M3 4h8v7a4 4 0 0 1-8 0z"/><path d="M13 9h8v7a4 4 0 0 1-8 0z"/><path d="M5.5 7.5h1M8.5 7.5h1M15.5 12.5h1M18.5 12.5h1"/><path d="M5.5 9.5c.5.5 1.5.5 2 0M15.7 14.7c.5-.5 1.5-.5 2 0"/></Line>
)
export const MapIcon = (p) => (
  <Line {...p}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><line x1="9" y1="4" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="20"/></Line>
)
export const ForkIcon = (p) => (
  <Line {...p}><path d="M7 2v8a2 2 0 0 0 2 2v10"/><path d="M4 2v5M10 2v5"/><path d="M17 2c-2 2-2.5 5-2.5 8H17v12"/></Line>
)
export const HandshakeIcon = (p) => (
  <Line {...p}><path d="M11 17l-2.2-2.2M14 14l-2.2-2.2M2.5 8.5L7 4l4.5 1.5L16 4l5.5 5.5-2 2L17 9l-4 4.5a1.6 1.6 0 0 1-2.3 0L8 10.8l-3.5 3z"/><path d="M4.5 13.8L8 17.3a1.6 1.6 0 0 0 2.3 0M8 17.3l1.5 1.5a1.6 1.6 0 0 0 2.3 0"/></Line>
)

export function PinIcon({ size = 18, color = '#C94B4B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
