# 🧠 CRUSHKY — AGENT MASTER FILE
> Read this entire file before doing anything. This is the single source of truth for all agents (Claude Chat, Claude Code, Codex) working on this project.

---

## 👤 FOUNDER
- **Name:** Aditya (Vikram Aditya)
- **Age:** 22, IIT Bombay graduate
- **Email:** vikram.aditya.connect@gmail.com
- **Background:** Non-coder but comfortable with GitHub, Vercel, VS Code. Has shipped websites before using AI agents.
- **Working Style:** Uses multiple AI agents in parallel. Gives direction in voice/chat, agents execute. Needs clear handoff documentation.

---

## 🎯 PROJECT OVERVIEW

**App Name:** Crushky  
**Tagline:** *Talk to AI. Meet your person.*  
**Type:** AI-first dating app (web MVP → mobile later)  
**Stage:** Day 1. Building MVP for investor demo + Activate AI Fellows submission (deadline: today)

### The Core Idea
Unlike Hinge/Bumble where you swipe and then have to explain yourself to every match — on Crushky, you have **one 10-15 min conversation with an AI**. The AI learns everything about you. Then it finds your best match and explains *exactly why* you two would work. No swiping. No awkward openers. No repeating yourself.

### What Makes Crushky Different from Known / Wavelength
| Feature | Known (US) | Wavelength (India) | **Crushky** |
|---|---|---|---|
| AI conversation onboarding | ✅ | ✅ | ✅ |
| AI match explanation | ✅ | ✅ | ✅ |
| Offline date booking | ✅ | ❌ | ✅ (Phase 2) |
| AI companion / virtual friend | ❌ | ❌ | ✅ (Phase 2, Premium) |
| India-first | ❌ | ✅ | ✅ |

---

## 🏗️ MVP SCOPE (For Activate AI Fellows Submission)

**Goal:** Working demo a judge can click through in 5 minutes and understand the full value prop.

### MVP Screens (In Order)
1. **Landing Page** — Hero with tagline, CTA to sign up
2. **Sign Up** — Name, age, gender, looking for, upload photo (basic)
3. **AI Chat Onboarding** — Chat interface where Crushky AI asks ~10 warm questions
4. **Match Reveal** — Card showing your match with AI-generated "why you two" explanation
5. **Match Profile** — View match's details, shared interests, compatibility score
6. **(Teaser)** AI Companion screen — locked, "Coming Soon — Premium"

### What We Are NOT Building for MVP
- Real matchmaking backend (we'll use dummy/seeded matches)
- Voice interface (text chat only for now)
- Payments / subscriptions
- Offline date booking
- Mobile app (web only, mobile-responsive)
- User authentication backend (simple localStorage or mock auth is fine)

---

## 🛠️ TECH STACK

| Layer | Tool | Reason |
|---|---|---|
| Frontend | React (Vite) | Fast, Vercel-friendly |
| Styling | Tailwind CSS | Rapid UI |
| AI Chat | Claude API (claude-sonnet-4-20250514) | Powers the onboarding conversation |
| Routing | React Router v6 | Multi-page flow |
| State | useState / localStorage | Simple, no backend needed for MVP |
| Deployment | Vercel | One-click deploy, free tier |
| Repo | GitHub (public) | Source of truth |

**API Key Note:** Claude API key will be stored in `.env` as `VITE_ANTHROPIC_API_KEY`. Never commit `.env` to GitHub. Add to Vercel environment variables.

---

## 📁 FOLDER STRUCTURE

```
crushky/
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Hero page
│   │   ├── Signup.jsx           # Basic signup form
│   │   ├── Chat.jsx             # AI conversation screen
│   │   ├── MatchReveal.jsx      # Match card with AI explanation
│   │   ├── MatchProfile.jsx     # Detailed match profile
│   │   └── Companion.jsx        # AI companion teaser (locked)
│   ├── components/
│   │   ├── ChatBubble.jsx       # Message bubble component
│   │   ├── MatchCard.jsx        # Match reveal card
│   │   └── NavBar.jsx           # Simple nav
│   ├── data/
│   │   └── seedMatches.js       # Hardcoded dummy match profiles for demo
│   ├── utils/
│   │   └── claudeApi.js         # API call wrapper for Claude
│   ├── App.jsx                  # Router setup
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # API keys (NEVER commit)
├── .env.example                 # Template for env vars (DO commit)
├── .gitignore                   # Includes .env
├── agent.md                     # THIS FILE
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔗 LINKS

| Resource | URL |
|---|---|
| GitHub Repo | https://github.com/vikramaditya26/crushky |
| Vercel Deploy | TBD — will update after first deploy |
| Activate AI Fellows | https://www.activatevc.ai/fellows |
| Known (competitor) | https://www.known.app |
| Wavelength (competitor, India) | Antler-funded, India |

---

## 🤖 AI CONVERSATION DESIGN

The AI chat in `/pages/Chat.jsx` calls Claude API with a system prompt that makes it behave like a warm, curious matchmaker. It asks questions in this order:

1. "How's your day going?" (icebreaker)
2. "Tell me a bit about yourself — what do you do?" (career/vibe)
3. "What does your ideal weekend look like?" (lifestyle)
4. "What are you actually looking for — like, honestly?" (relationship intent)
5. "Do you drink, smoke, or have any strong preferences about that?" (lifestyle compatibility)
6. "What's something most people wouldn't guess about you?" (depth)
7. "Describe your last situationship or relationship in three words." (emotional history)
8. "What kind of person makes you feel most alive?" (attraction)
9. "One thing you'd never compromise on in a partner?" (dealbreakers)
10. "Last one — what's your love language?" (compatibility)

After Q10 → transition to MatchReveal page.

**System Prompt for Claude API (in claudeApi.js):**
```
You are Crushky's AI matchmaker. You are warm, witty, and perceptive — like a brilliant friend who happens to be great at reading people. Your job is to get to know the user through natural conversation so you can find their perfect match. Ask ONE question at a time. Keep responses short (max 2 sentences before your question). Never be clinical or robotic. React to what they say before asking the next question. After 10 exchanges, say: "I think I know exactly who you should meet. Give me a moment..." and stop.
```

---

## 🌱 SEED DATA (For Demo)

In `/data/seedMatches.js` — create 3-4 realistic Indian profiles:
- Neha, 24, IIT Bombay → Fintech analyst, loves dance + chess, wants long-term
- Priya, 23, Delhi → UX designer, runs half-marathons, loves indie films
- Riya, 25, Bangalore → ML engineer, bookworm, plays guitar, wants something real

Match reveal always shows the "best" match with a generated explanation paragraph.

---

## 🎨 DESIGN DIRECTION

**Aesthetic:** Premium, warm, editorial. NOT a typical dating app.  
**Reference:** Known app (dark, elegant) + Wavelength (warm cream/beige)  
**Color Palette:**
- Background: `#0D0D0D` (near black) or warm `#F5F0EB` (cream)
- Accent: Deep rose `#C94B4B` or warm amber `#D4956A`
- Text: `#FAFAFA` on dark, `#1A1A1A` on light
- Cards: Glassmorphism on dark, solid cream on light

**Typography:**
- Display: Playfair Display (editorial, romantic)
- Body: DM Sans (clean, readable)

**Vibe:** Feels like a luxury concierge, not a slot machine.

---

## 📋 CURRENT TASK STATUS

| Task | Status | Owner |
|---|---|---|
| GitHub repo created | ✅ Done | Aditya |
| Local git repo initialized in `/Desktop/Crushky` | ✅ Done | Codex |
| Initial repo safety files (`.gitignore`) added | ✅ Done | Codex |
| agent.md written | ✅ Done | Claude Chat |
| Vercel connected to GitHub | ⬜ TODO | Aditya |
| Project scaffolded (Vite + React) | ⬜ TODO | Claude Code / Codex |
| Landing page | ⬜ TODO | Claude Code / Codex |
| Signup page | ⬜ TODO | Claude Code / Codex |
| Chat page (Claude API) | ⬜ TODO | Claude Code / Codex |
| Match reveal page | ⬜ TODO | Claude Code / Codex |
| Seed match data | ⬜ TODO | Claude Code / Codex |
| Deploy to Vercel | ⬜ TODO | Aditya |
| Write-up (300 words) | ⬜ TODO | Claude Chat |
| Submit to Activate AI Fellows | ⬜ TODO | Aditya |

---

## 🔧 GITHUB SETUP INSTRUCTIONS (For Agents)

### For Claude Code:
Claude Code should have GitHub access already configured. To push:
```bash
cd ~/Desktop/Crushky
git init
git remote add origin https://github.com/vikramaditya26/crushky.git
git add .
git commit -m "initial commit"
git push -u origin main
```

### For Codex:
Codex needs a GitHub Personal Access Token. Aditya should:
1. Go to github.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token → check `repo` scope → copy token
3. Paste token into Codex when it asks for GitHub credentials
4. Codex can then clone: `git clone https://github.com/vikramaditya26/crushky.git`

### For Both Agents — Git Workflow:
- Always pull before working: `git pull origin main`
- Commit with clear messages: `git commit -m "feat: add chat page"`
- Never commit `.env` file
- Main branch = `main` (not master)

### Current Repo State (Updated by Codex on May 15, 2026)
- Local folder `/Users/aditya/Desktop/Crushky` originally only contained `AGENT.md`.
- Local git repository has now been initialized on branch `main`.
- Git user is configured on this machine as `vikramaditya26 <vikram.aditya.connect@gmail.com>`.
- `.gitignore` has been added with `.env`, `node_modules`, `dist`, `.vercel`, and `.DS_Store`.
- GitHub remote URL verified: `https://github.com/vikramaditya26/crushky.git`
- Remote appeared reachable but had no visible refs at the time of setup, so treat it as likely empty unless a later agent sees otherwise.
- Untracked folder `crushky-temp/` is present in the repo root and looks like a separate Vite scaffold. Codex did not commit it yet because it may be temporary or may need to be moved into the actual root structure intentionally.
- Local commit created by Codex: `7cee58c` with message: `chore: bootstrap repo and document agent handoff`
- Push attempt from this machine reached GitHub but failed with `403 Permission denied` because the active credential resolved to `adityakumar-teachmint`, which does not have write access to `vikramaditya26/crushky`.
- Before the next push attempt, switch Git credentials to the correct GitHub account or use a PAT that has repo access to `vikramaditya26/crushky`.
- Next agent should run `git status`, confirm `origin`, and then continue scaffolding the MVP before committing and pushing.
- Any major implementation change from here onward should be appended back into this file so parallel agents have a reliable handoff trail.

---

## 🚀 VERCEL SETUP INSTRUCTIONS (For Aditya)

1. Go to vercel.com → Log in with GitHub
2. Click "Add New Project" → Import `crushky` repo
3. Framework: Vite
4. Add environment variable: `VITE_ANTHROPIC_API_KEY` = your Claude API key
5. Deploy → copy the live URL → paste back here and update the Links table above

---

## 📝 SHORT WRITE-UP DRAFT (For Activate AI Fellows — 300 words)

> **To be finalized by Claude Chat once MVP is live**

**What I built:**
Crushky is an AI-first dating app that replaces endless swiping with a single honest conversation. Instead of building a profile and hoping someone swipes right, you talk to Crushky's AI for 10-15 minutes. It learns who you actually are — your vibe, your values, what you're really looking for — and then introduces you to your best match, with a specific explanation of why you two would click.

**Why this:**
I've watched smart, interesting people fail at dating apps not because they're undatable, but because they're bad at selling themselves in a profile or making small talk with strangers. The real problem isn't finding people — it's that the format forces everyone to be a worse version of themselves. Crushky fixes the format.

**What I'd do with another 10 hours:**
Add voice conversation (so it feels like talking to a friend, not filling a form), build real matching logic using vector embeddings of conversation transcripts, and add the AI companion feature — a persistent AI friend that remembers your past conversations for users who aren't getting matches yet.

**What I cut:**
Offline date booking (planned for Phase 2), real user authentication, voice interface, and the premium AI companion tier. The MVP proves one thing: the conversation-first onboarding experience is genuinely better than profile-based swiping.

---

## 🧭 FUTURE ROADMAP (Post-MVP)

- **Phase 2:** Voice onboarding (11labs), real matching backend, offline date booking (Zomato/Dineout API)
- **Phase 3:** AI companion (premium, persistent memory), Spotify/Instagram profile linking
- **Phase 4:** Native mobile app (React Native), city expansion beyond metro India
- **Monetization:** AI companion subscription (₹299/mo) + venue partnerships (café/bar commissions on booked dates)

---

*Last updated: May 15, 2026 | Maintained by: Claude Chat + Aditya*
*Next agent to work on this: Claude Code — scaffold the Vite project and build Landing + Signup pages first*
