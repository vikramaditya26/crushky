// Hinge / iMessage-style two-sided bubbles:
//   • AI / them  → soft neutral bubble that blends with the light background
//   • you        → purple bubble (like Hinge's outgoing messages)
const PURPLE = '#5B2E8F' // Hinge-style deep violet

export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2.5`}>
      <div
        className="max-w-[80%] px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-line"
        style={isUser
          ? { background: PURPLE, color: '#fff', borderRadius: '20px 20px 5px 20px',
              boxShadow: '0 2px 8px rgba(91,46,143,0.30)' }
          : { background: '#F1EFF5', color: '#1A1410', borderRadius: '20px 20px 20px 5px' }}
      >
        {message}
      </div>
    </div>
  )
}
