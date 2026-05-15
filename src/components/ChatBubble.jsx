export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-rose text-white rounded-br-md'
            : 'bg-card-dark border border-card-border text-light-text rounded-bl-md'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
