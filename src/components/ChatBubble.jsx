// Editorial chat style (Ditto-inspired): the AI speaks as elegant ink text with
// a small ✦ mark — no bubble. Only "you" get a bubble. Distinctive on purpose.
export default function ChatBubble({ message, isUser, voiceMode = false }) {
  if (!isUser) {
    return (
      <div className="flex justify-start mb-5">
        <div className="max-w-[88%] md:max-w-[75%] flex gap-2.5">
          <span className="text-rose text-[13px] mt-[3px] shrink-0 select-none">✦</span>
          <p className="font-display text-[15.5px] leading-[1.65] text-dark-text/85 whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line bg-rose text-white rounded-2xl rounded-br-sm shadow-sm">
        {message}
        {voiceMode && (
          <div className="flex items-center gap-1 mt-1.5 opacity-50">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
            <span style={{ fontSize: '9px' }}>spoken</span>
          </div>
        )}
      </div>
    </div>
  )
}
