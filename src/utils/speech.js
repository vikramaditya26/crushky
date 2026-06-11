// Browser speech-to-text via the Web Speech API (Chrome/Edge/Safari).
// Returns null when unsupported so callers can fall back to the scripted flow.
export function createRecognizer({ onResult, onEnd }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const rec = new SR()
  rec.lang = 'en-IN'
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 1
  rec.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
    const isFinal = e.results[e.results.length - 1].isFinal
    onResult?.(transcript, isFinal)
  }
  rec.onend = () => onEnd?.()
  rec.onerror = () => onEnd?.()
  return rec
}
