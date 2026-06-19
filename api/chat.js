// Vercel serverless function — proxies Claude so the API key stays on the
// server and is NEVER shipped to the browser. Set ANTHROPIC_API_KEY (NOT
// VITE_-prefixed) in Vercel project env vars.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server not configured' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { messages, system, max_tokens = 400 } = body || {}

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages required' })
      return
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens,
        system: system || undefined,
        messages,
      }),
    })

    const data = await r.json()
    if (data.error) {
      res.status(502).json({ error: data.error.message || 'Upstream error' })
      return
    }
    res.status(200).json({ text: data.content?.[0]?.text ?? '' })
  } catch (err) {
    res.status(500).json({ error: 'Request failed' })
  }
}
