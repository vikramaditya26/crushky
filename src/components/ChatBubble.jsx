export default function ChatBubble({ message, isUser, voiceMode = false }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? 'bg-dark-green text-white rounded-2xl rounded-br-sm shadow-sm'
            : 'bg-white border border-dark-text/5 text-dark-text rounded-2xl rounded-bl-sm shadow-sm'
        }`}
      >
        {/* Voice indicator on AI messages */}
        {!isUser && voiceMode && (
          <div className="flex items-end gap-[2px] mb-2 h-3">
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                className="inline-block w-[2px] rounded-full bg-rose/40"
                style={{
                  height: `${6 + Math.sin(i * 1.4) * 4}px`,
                  animation: `waveBar 1.2s ease-in-out infinite ${i * 90}ms`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
        )}
        {message}
        {/* Mic icon on user messages */}
        {isUser && voiceMode && (
          <div className="flex items-center gap-1 mt-1.5 opacity-40">
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
