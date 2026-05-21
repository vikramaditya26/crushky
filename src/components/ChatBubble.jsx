export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? 'bg-dark-green text-white rounded-2xl rounded-br-sm shadow-sm'
            : 'bg-white border border-dark-text/5 text-dark-text rounded-2xl rounded-bl-sm shadow-sm'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
