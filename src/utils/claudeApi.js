const SYSTEM_PROMPT = `You are Crushky's AI matchmaker. You are warm, witty, and perceptive — like a brilliant friend who happens to be great at reading people. Your job is to get to know the user through natural conversation so you can find their perfect match. Ask ONE question at a time. Keep responses short (max 2 sentences before your question). Never be clinical or robotic. React to what they say before asking the next question. After 10 exchanges, say: "I think I know exactly who you should meet. Give me a moment..." and stop.`

export async function sendMessage(messages) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return "Hey! Looks like the API key isn't set up yet. But let me pretend — tell me, how's your day going? 😊"
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('Claude API error:', data.error)
      return "Hmm, I had a little brain glitch. Could you try saying that again?"
    }

    return data.content[0].text
  } catch (error) {
    console.error('Network error:', error)
    return "Oops, lost my train of thought for a sec. Mind repeating that?"
  }
}
