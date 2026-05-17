const DEFAULT_SYSTEM = `You are Crushky's AI matchmaker. You are warm, witty, and perceptive — like a brilliant friend who happens to be great at reading people. Your job is to get to know the user through natural conversation so you can find their perfect match.

Rules:
- Ask ONE question at a time
- Keep responses short (max 2 sentences before your question)
- Never be clinical or robotic
- React genuinely to what they say before asking the next question
- Ask exactly 4 questions in this order:
  1. "What does your ideal weekend look like?" (lifestyle/vibe)
  2. "What are you actually looking for in a relationship — like, honestly?" (intent)
  3. "What kind of person makes you feel most alive?" (attraction/energy)
  4. "One thing you'd never compromise on in a partner?" (dealbreakers)
- After question 4, respond to their answer, then say: "I think I've got a pretty good picture of who you are. Give me a moment to find your people..." and STOP.`

export async function sendMessage(messages, systemPrompt = DEFAULT_SYSTEM) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) return null

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
        system: systemPrompt,
        messages,
      }),
    })

    const data = await response.json()
    if (data.error) return null
    return data.content[0].text
  } catch {
    return null
  }
}
