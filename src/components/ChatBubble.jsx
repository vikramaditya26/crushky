export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-5 py-3.5 text-[15px] leading-relaxed ${
          isUser
            ? 'bg-dark-green text-white rounded-2xl rounded-br-sm'
            : 'bg-dark-text/5 text-dark-text rounded-2xl rounded-bl-sm'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
