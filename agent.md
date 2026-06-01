# CRUSHKY — AGENT MASTER FILE

> Read this ENTIRE file before doing anything. This is the single source of truth for all agents working on this project. If something isn't documented here, ask Aditya before assuming.

---

## FOUNDER

- **Name:** Aditya (Vikram Aditya)
- **Age:** 22, IIT Bombay graduate
- **Email:** vikram.aditya.connect@gmail.com
- **Background:** Non-coder. Comfortable with GitHub, Vercel, VS Code. Ships products using AI agents.
- **Working Style:** Uses multiple AI agents in parallel (Claude Code, Codex, Claude Chat). Gives direction, agents execute. Needs clear handoff docs.

---

## PROJECT OVERVIEW

**App Name:** Crushky
**Tagline:** *Talk to AI. Meet your person.*
**Type:** AI-first dating app (web MVP, mobile later)
**Stage:** Building MVP for investor demo + Activate AI Fellows submission

### The Core Idea

Unlike Hinge/Bumble where you swipe and repeat yourself to every match, on Crushky you have ONE conversation with an AI matchmaker. The AI learns who you actually are, finds your best match, and explains exactly why you two would work. No swiping. No awkward openers. No repeating yourself.

### Competitors We're Learning From

| App | What They Do | What We Take |
|---|---|---|
| **Known** (US) | Dark premium aesthetic, AI learns about matches, books dates | Dark editorial design vibe, match explanation format |
| **Wavelength** (India) | Warm cream aesthetic, voice AI onboarding, Ghibli-style illustrations | Warm typography, tab-based dashboard, detailed AI-written match intros |
| **Ditto** (US) | No UI — AI chat via iMessage, sends one match + date plan per week | Simplicity, date poster concept, casual AI tone |
| **Hinge** | Step-by-step onboarding, one question per screen, clean forms | Signup flow pattern, progress bar, field-by-field approach |

---

## TECH STACK

| Layer | Tool | Reason |
|---|---|---|
| Frontend | React (Vite) | Fast, Vercel-friendly |
| Styling | Tailwind CSS v4 | Rapid UI, @tailwindcss/vite plugin |
| AI Chat | Claude API (claude-sonnet-4-20250514) | Powers onboarding + companion |
| Routing | React Router v6 | Multi-page flow |
| State | useState / localStorage | No backend needed for MVP |
| Deployment | Vercel | One-click deploy, free tier |
| Repo | GitHub (public) | Source of truth |
| Node | v22 (use `nvm use 22`) | Required for Vite 8+ |

**API Key:** Stored in `.env` as `VITE_ANTHROPIC_API_KEY`. Never commit `.env`. Add to Vercel env vars.

---

## DESIGN SYSTEM

### Aesthetic

Premium, warm, editorial. NOT a typical dating app. NOT generic dark-mode tech.

Think: luxury magazine meets your most thoughtful friend. Typography-driven, not icon-heavy. Organic shapes, not sharp corners everywhere.

### Reference Apps (study these for inspiration)

- **Known app** — dark backgrounds, bold serif headlines, editorial photography, glassmorphism cards
- **Wavelength app** — warm cream (#F5F0EB) backgrounds, serif display font with italics for emphasis, polaroid-style photo cards, soft gradient blobs (pink-purple-blue), cloud textures
- **Ditto.ai** — extreme simplicity, casual AI tone, date poster format
- **Hinge** — clean white signup screens, one field per screen, thin progress bar, pill/chip selectors

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--dark` | `#0D0D0D` | Landing page background, dark sections |
| `--cream` | `#F5F0EB` | Signup screens, dashboard background, light sections |
| `--rose` | `#C94B4B` | Primary accent, CTAs, highlights |
| `--amber` | `#D4956A` | Secondary accent, labels, tags |
| `--dark-green` | `#2D3B2D` | Buttons (like Wavelength's dark CTA buttons) |
| `--light-text` | `#FAFAFA` | Text on dark backgrounds |
| `--dark-text` | `#1A1A1A` | Text on light/cream backgrounds |
| `--muted` | `#6B7280` | Secondary text, placeholders |
| `--card-bg` | `rgba(255,255,255,0.06)` | Card backgrounds on dark |
| `--card-border` | `rgba(255,255,255,0.1)` | Card borders on dark |

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display/Headlines | Playfair Display | 400-700, use *italic* for emphasis words | Page titles, section headers, match names |
| Body | DM Sans | 400-600 | Everything else: buttons, labels, paragraphs |

Load via Google Fonts in index.html:
```
Playfair Display: 400, 400i, 500, 600, 700
DM Sans: 400, 500, 600, 700
```

### Design Patterns

- **Signup screens:** Cream background, one field centered, big Playfair heading, DM Sans label, pill/chip selectors for options, thin progress bar at top, single CTA button at bottom
- **Dashboard:** Cream background, tab bar at top (like Wavelength's "Wave / Matches"), cards with subtle shadows
- **Chat screens:** Clean white/cream background, chat bubbles with rounded corners, AI messages left-aligned in light gray, user messages right-aligned in rose/dark
- **Match cards:** Full-bleed or polaroid-style photos, Playfair name + age, AI explanation paragraph below, rounded corners (16-24px)
- **Buttons:** Rounded-full (pill shape), dark-green or rose fill, white text, 48px height minimum for touch targets
- **Spacing:** Generous whitespace everywhere. When in doubt, add more space.
- **Animations:** Subtle fade-ins on page transitions. Loading states with gentle pulse/bounce. Nothing flashy.

---

## MVP FLOW — COMPLETE SCREEN-BY-SCREEN SPEC

The MVP has 6 major parts, broken into individual screens below.

---

### PART 1: LANDING PAGE

**Route:** `/`
**Background:** Dark (`#0D0D0D`)
**Purpose:** Convince someone this isn't another Tinder clone. Make them click "Login."

#### Section 1.1: Navigation Bar
- Fixed at top, transparent/blur background
- Left: "Crushky" in Playfair Display, bold, white
- Right: "Login" button (pill shape, rose background, white text)
- On scroll: nav gets subtle dark background with blur

#### Section 1.2: Hero
- Center-aligned text block with generous vertical padding (min 100vh)
- Small label above headline: "AI-POWERED DATING" in amber, uppercase, letter-spaced, DM Sans 12px
- Main headline in Playfair Display, large (48-72px responsive):
  - Line 1: "Talk to AI."
  - Line 2: "Meet your person." (this line in rose color)
- Subtext below in DM Sans, light-text at 60% opacity, max-width 600px:
  - "No swiping. No awkward openers. Just one honest conversation with our AI, and we'll find the person who actually gets you."
- CTA button: "Find Your Match" — rose background, white text, pill shape, large (18px text, generous padding)

#### Section 1.3: How It Works
- Section heading: "How Crushky Works" in Playfair Display, white, centered
- 3 cards in a row (stack on mobile):

**Card 1:**
- Number: "01" in rose, Playfair Display, large
- Title: "Have a Conversation" in white, DM Sans semibold
- Body: "Chat with our AI for a few minutes. It asks the questions your best friend would — the real ones." in white at 60% opacity

**Card 2:**
- Number: "02"
- Title: "We Find Your Match"
- Body: "Our AI understands who you actually are, not just what you look like. It finds someone who complements you."

**Card 3:**
- Number: "03"
- Title: "Know Why You Click"
- Body: "No guessing. We tell you exactly why you two would work — shared values, energy, humor, everything."

- Cards: dark card background with subtle border, rounded-2xl, generous padding

#### Section 1.4: Value Proposition (optional, add if time permits)
- A section inspired by Known's bold statements:
  - "Not a game. Not a job. Not a gamble."
  - "Crushky is different. Built on knowing you first."
- Large Playfair Display text, centered, white, with italic emphasis on key words

#### Section 1.5: Footer
- Simple border-top, centered text
- "2026 Crushky. Built with love and AI." in muted white
- Optional: links to Instagram, X

---

### PART 2: SIGNUP FLOW (8 steps, Hinge-style)

**Route:** `/signup` (single route, step state managed internally)
**Background:** Cream (`#F5F0EB`) for ALL signup screens
**Text color:** Dark (`#1A1A1A`)

#### General Signup UI Pattern (applies to ALL steps):
- **Progress bar:** Thin (3px) bar at very top of screen, fills left-to-right, rose color, shows current step / total steps
- **Back arrow:** Top-left, simple `<` arrow, dark text
- **Heading:** Playfair Display, 28-32px, dark, centered or left-aligned
- **Subtext** (optional): DM Sans, muted color, below heading
- **Input area:** Centered in middle of screen
- **CTA button:** Fixed at bottom, full-width (with padding), pill shape, dark-green or rose fill, white text, "Continue"
- **CTA disabled state:** When field is empty, button is faded/gray, not clickable
- **Spacing:** Lots of vertical space between heading and input. This should feel calm, not cramped.

#### Step 2.1: First Name
- Heading: "What's your first name?"
- Input: Single text field, large font (20px+), minimal styling (just bottom border or clean rounded box on cream bg)
- Placeholder: "Your first name"
- Validation: Required, min 2 chars

#### Step 2.2: Date of Birth
- Heading: "When's your birthday?"
- Input: Date picker or three dropdowns (Day / Month / Year)
- Subtext: "You must be 18+ to use Crushky"
- Validation: Must be 18+

#### Step 2.3: Gender
- Heading: "How do you identify?"
- Options: Three pill/chip buttons arranged horizontally
  - "Man" | "Woman" | "Non-binary"
- Selected state: filled with rose or dark-green, white text
- Unselected: outlined, dark text on cream

#### Step 2.4: Looking For
- Heading: "Who are you looking for?"
- Options: Three pill/chip buttons
  - "Men" | "Women" | "Everyone"
- Same selected/unselected styling as gender

#### Step 2.5: City
- Heading: "Where are you based?"
- Input: Text field with autocomplete/suggestions for Indian cities
- Placeholder: "Search your city"
- For MVP: simple text input is fine, no need for real autocomplete
- Popular options as chips below: "Mumbai" "Delhi" "Bangalore" "Pune" "Hyderabad" "Chennai"

#### Step 2.6: Height
- Heading: "How tall are you?"
- Input: Slider or picker showing height in cm (140-210 range) or ft/in toggle
- For MVP: simple dropdown or number input with cm is fine
- Placeholder: "Height in cm"

#### Step 2.7: College / Work
- Heading: "What do you do?"
- Two fields stacked:
  - "College/University" — text input, placeholder: "e.g., IIT Bombay"
  - "Job title / Company" — text input, placeholder: "e.g., Product Manager at Google"
- Subtext: "Share one or both"
- Either field filled = can continue

#### Step 2.8: Photos (3 slots)
- Heading: "Add your best photos"
- Subtext: "Add at least 1 photo to continue"
- Layout: 3 photo slots in a row (or 2+1 grid)
  - Empty slot: dashed border, "+" icon, cream/light background
  - Filled slot: shows uploaded image with small "x" to remove
- For MVP: file input that accepts images, store as base64 in localStorage or just show preview
- Validation: At least 1 photo required

#### After Step 8: Save all data to localStorage as `crushky_user` object, navigate to `/dashboard`

---

### PART 3: DASHBOARD (Main Screen)

**Route:** `/dashboard`
**Background:** Cream (`#F5F0EB`)
**Purpose:** The home base. Two main sections accessed via tabs.

#### Dashboard Layout:

**Top Bar:**
- Left: "Crushky" logo in Playfair Display, dark text
- Right: User avatar (small circle, from uploaded photo) + settings gear icon

**Tab Bar (below top bar):**
- Two tabs, horizontally centered, pill-style toggle (like Wavelength's "Wave / Matches"):
  - Tab 1: "Crushky AI" (with small sparkle/AI icon)
  - Tab 2: "My Companion" (with small chat/heart icon)
- Active tab: filled background (dark-green or rose), white text
- Inactive tab: transparent, muted text

---

#### Tab 1: "Crushky AI" — States

**State A: First Time (hasn't talked to AI yet)**
- Center of screen, vertically centered content:
- Illustration or soft gradient blob (like Wavelength's pink-purple gradient)
- Heading: "Time to talk to Crushky" in Playfair Display, dark
- Subtext: "After this chat, your AI will know enough to start finding your person." in DM Sans, muted
- Instructions card (rounded, subtle shadow):
  - "1. Find a quiet, comfortable space"
  - "2. This takes about 5 minutes"
- Two buttons at bottom:
  - Secondary: "Remind me later" — outlined, dark text
  - Primary: "Start talking" — dark-green or rose fill, white text
- Small note: "Everything you share stays private" with lock icon

**State B: AI chat completed, matches found**
- Shows match cards (see PART 5)
- Header: "Your matches" or "People you should meet"
- Scrollable list of match cards

**State C: No matches yet (AI still processing — cosmetic delay for demo)**
- "Crushky is finding your people..."
- Animated loading (subtle pulse dots)
- Transition to State B after 2-3 seconds

---

#### Tab 2: "My Companion"

**Purpose:** AI virtual friend. Users can chat anytime about dating, life, anything.

**Layout:**
- Full chat interface (like WhatsApp/iMessage)
- AI avatar at top: "Crushky" with a small icon
- Chat area: scrollable messages
- Input bar at bottom: text input + send button + mic icon (mic can be non-functional for MVP, just show the icon)

**AI Companion Behavior:**
- System prompt makes it a warm, supportive friend
- Remembers context within the conversation (not across sessions for MVP)
- Can discuss dating advice, help prep for dates, general emotional support
- Casual tone, not clinical

**AI Companion System Prompt:**
```
You are Crushky's AI companion — a warm, witty, and genuinely caring friend. You're like that one friend who gives amazing dating advice, remembers everything, and never judges. You can talk about anything: dating, relationships, life decisions, or just how someone's day went. Keep your responses conversational and short (2-3 sentences usually). Use humor naturally. Never be preachy or give unsolicited advice — wait to be asked. You're a friend, not a therapist.
```

---

### PART 4: AI CHAT ONBOARDING

**Route:** `/chat`
**Background:** White or very light cream
**Purpose:** AI asks 3-4 warm questions to understand the user, then generates matches.

#### Chat UI Layout:
- **Top bar:** "Crushky AI" title centered, back arrow left, progress indicator right (e.g., "1/4" or a small progress bar)
- **Chat area:** Scrollable, messages appear one at a time
- **Input bar at bottom:**
  - Text input (rounded, placeholder: "Type your answer...")
  - Send button (rose circle with arrow icon)
  - Mic icon button (to the left of input — for MVP, can trigger browser speech-to-text API or be non-functional with a "Coming soon" toast)

#### Chat Bubble Styling:
- **AI messages:** Left-aligned, light gray/cream bubble, rounded corners with bottom-left square, DM Sans 15px, dark text
- **User messages:** Right-aligned, rose or dark-green bubble, rounded corners with bottom-right square, white text
- **AI typing indicator:** Three bouncing dots in a gray bubble

#### AI Conversation Flow (3-4 questions):

The AI should ask exactly 3-4 questions, reacting warmly to each answer before asking the next. Questions should feel natural, not like a form.

**System Prompt for Onboarding AI:**
```
You are Crushky's AI matchmaker. You are warm, witty, and perceptive — like a brilliant friend who happens to be great at reading people. Your job is to get to know the user through natural conversation so you can find their perfect match.

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
- After question 4, respond to their answer, then say: "I think I've got a pretty good picture of who you are. Give me a moment to find your people..." and STOP.
- Start the conversation with a warm greeting like "Hey [name]! I'm so glad you're here. Let's find your person. First up —" and then ask question 1.
```

**After AI says "Give me a moment...":**
- Disable input
- Show a loading/transition animation (2-3 seconds)
- Auto-navigate to match results (back on dashboard, Crushky AI tab, State B)

**Demo Fallback (when no API key):**
- Use hardcoded AI responses for each question
- Same flow, just scripted responses instead of live API calls

---

### PART 5: MATCH RESULTS (on Dashboard, Crushky AI tab)

**Displayed in:** Dashboard → Crushky AI tab (State B)
**Background:** Cream

#### Match Card Design:

Show 2-3 match cards, scrollable vertically. Each card:

**Card Layout (inspired by Wavelength's match intro style):**
- Rounded card (16-24px corners), white background, subtle shadow
- Top: Match photo (large, aspect 4:5, rounded top corners)
  - Gradient overlay at bottom of photo for text readability
- Below photo:
  - Name + Age in Playfair Display bold: "Neha, 24"
  - Location + College/Work in DM Sans muted: "Mumbai · IIT Bombay · Fintech Analyst"
  - AI-generated match explanation paragraph (2-3 sentences) in DM Sans, dark text, 14-15px
  - The explanation should read like a personal letter, similar to how Wavelength's "Wave" introduces matches
- CTA button at bottom of card: "See Full Profile" — outlined or filled, pill shape

#### AI Match Explanation Style:
Write match explanations like Wavelength does — personal, specific, like a friend introducing two people:

Example:
> "You both value depth over surface-level connections. Neha's analytical mind complements your creative energy — she'll challenge you intellectually while keeping things fun. You share the same dry humor and love for late-night conversations, and neither of you can resist a good debate."

---

### PART 6: MATCH PROFILE (Detailed View)

**Route:** `/match/:id`
**Background:** Cream
**Purpose:** Full profile of a match with everything the user needs to decide.

#### Profile Layout:

**Top Bar:**
- Back arrow (left)
- "Match Profile" or the person's name (center)

**Photo Section:**
- Large photo at top (or a 2-photo polaroid-style layout like Wavelength)
- If multiple photos available, horizontal scroll or grid

**Info Section:**
- Name, Age in Playfair Display: "Neha Sharma, 24"
- Location: "Mumbai"
- College: "IIT Bombay"
- Work: "Fintech Analyst at Razorpay"
- Height: "5'4""

**Bio Section:**
- Their bio/personality description written by AI, in quotes, italic Playfair:
  - e.g., "Can hold a conversation about literally anything for three hours. IIT Bombay grad who ended up in fintech somehow. Will make fun of you to your face and hype you up behind your back."

**Interests:**
- Horizontal scrollable chips/pills: "Dance" "Chess" "Stand-up Comedy" "Investing" etc.

**Compatibility Section:**
- Card with rose/warm background
- Heading: "Why You Two Click" in Playfair
- AI explanation paragraph (same as on match card but can be longer here)

**Relationship Preferences:**
- Two small info cards side by side:
  - "Looking for: Something real and long-term"
  - "Love language: Quality Time"

**Where to Meet (Phase 2 teaser or functional):**
- Section heading: "Where to meet" or "Date spot suggestion"
- For MVP: show a suggested venue with name, type, area
  - e.g., "The Bombay Canteen · Casual Dining · Lower Parel"
  - Small map placeholder or just address text
  - "Book this date" button (can be non-functional for MVP, just shows a toast "Coming soon!")

---

## SEED DATA (For Demo)

### User Profiles for Matching

In `src/data/seedMatches.js`, create 3 detailed profiles:

**Profile 1 — Neha Sharma:**
```
name: "Neha Sharma"
age: 24
city: "Mumbai"
college: "IIT Bombay"
work: "Fintech Analyst at Razorpay"
height: "5'4\""
photos: [use high-quality Unsplash portrait URLs]
interests: ["Contemporary Dance", "Chess", "Stand-up Comedy", "Investing"]
lookingFor: "Something real and long-term"
loveLanguage: "Quality Time"
bio: "Can hold a conversation about literally anything for three hours. IIT Bombay grad who ended up in fintech somehow. Will make fun of you to your face and hype you up behind your back. Dangerously good at eye contact."
compatibility: 94
whyYouMatch: "You both value depth over surface-level connections. Neha's analytical mind complements your creative energy — she'll challenge you intellectually while keeping things fun. You share the same dry humor, love for late-night conversations, and neither of you can resist a good debate. Plus, you both believe the best dates happen in tucked-away cafes, not fancy restaurants."
dateSuggestion: { venue: "The Bombay Canteen", type: "Casual Dining", area: "Lower Parel, Mumbai" }
```

**Profile 2 — Priya Malhotra:**
```
name: "Priya Malhotra"
age: 23
city: "Delhi"
college: "NID Ahmedabad"
work: "UX Designer at Swiggy"
height: "5'6\""
photos: [Unsplash URLs]
interests: ["Half-Marathons", "Indie Films", "Pottery", "Travel"]
lookingFor: "Someone who matches my energy"
loveLanguage: "Words of Affirmation"
bio: "I design experiences for a living and run half-marathons for fun. Currently planning my next solo trip and trying to learn pottery without destroying the studio. Looking for someone who can keep up — mentally and physically."
compatibility: 87
whyYouMatch: "You're both driven and creative, but in complementary ways. Priya brings visual thinking to your verbal world. She values experiences over things — just like you. Your shared love for travel and trying new things means you'd never run out of adventures together."
dateSuggestion: { venue: "Champa Gali", type: "Cafe Alley", area: "Saket, Delhi" }
```

**Profile 3 — Riya Iyer:**
```
name: "Riya Iyer"
age: 25
city: "Bangalore"
college: "BITS Pilani"
work: "ML Engineer at Google"
height: "5'3\""
photos: [Unsplash URLs]
interests: ["Books", "Acoustic Guitar", "Hiking", "Open Source"]
lookingFor: "Something genuine — no games"
loveLanguage: "Acts of Service"
bio: "I train models by day and play acoustic covers by night. Currently reading three books at once. Yes, I finish them all. Looking for someone who thinks 'let's stay in and cook' is a valid date plan."
compatibility: 91
whyYouMatch: "You're both unapologetically nerdy and proud of it. Riya's calm, grounded energy balances your intensity perfectly. She'll send you book recommendations at 2am and actually remember what you said three conversations ago. You both hate small talk and love going deep — that's rare, and that's everything."
dateSuggestion: { venue: "Third Wave Coffee", type: "Coffee Shop", area: "Koramangala, Bangalore" }
```

---

## FOLDER STRUCTURE

```
crushky/
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Landing.jsx           # Landing page (Part 1)
│   │   ├── Signup.jsx            # Multi-step signup (Part 2)
│   │   ├── Dashboard.jsx         # Main dashboard with tabs (Part 3)
│   │   ├── Chat.jsx              # AI onboarding chat (Part 4)
│   │   └── MatchProfile.jsx      # Detailed match view (Part 6)
│   ├── components/
│   │   ├── NavBar.jsx            # Landing page nav
│   │   ├── SignupProgress.jsx    # Progress bar for signup steps
│   │   ├── ChatBubble.jsx        # Chat message bubble
│   │   ├── MatchCard.jsx         # Match card for results list (Part 5)
│   │   ├── TabBar.jsx            # Dashboard tab switcher
│   │   └── CompanionChat.jsx     # AI companion chat interface
│   ├── data/
│   │   └── seedMatches.js        # Hardcoded match profiles
│   ├── utils/
│   │   └── claudeApi.js          # Claude API wrapper
│   ├── App.jsx                   # Router setup
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── .env                          # API keys (NEVER commit)
├── .env.example                  # Template for env vars
├── .gitignore
├── agent.md                      # THIS FILE
├── index.html
├── package.json
└── vite.config.js
```

---

## ROUTES

```
/              → Landing.jsx
/signup        → Signup.jsx (all 8 steps managed internally via state)
/dashboard     → Dashboard.jsx (tabs: Crushky AI + My Companion)
/chat          → Chat.jsx (AI onboarding, 3-4 questions)
/match/:id     → MatchProfile.jsx (detailed match view)
```

---

## IMPLEMENTATION ORDER (Build in this exact order)

### Phase A: Foundation
1. Scaffold project: Vite + React + Tailwind v4 + React Router v6
2. Set up index.css with design tokens (colors, fonts)
3. Set up index.html with Google Fonts
4. Set up App.jsx with all routes
5. Create .env.example

### Phase B: Landing Page
6. Build NavBar component
7. Build Landing.jsx with all 4-5 sections
8. Test: should look premium and editorial, NOT generic

### Phase C: Signup Flow
9. Build SignupProgress component
10. Build Signup.jsx with all 8 steps
11. Each step: one question, progress bar, back button, continue button
12. Save to localStorage on completion, navigate to /dashboard
13. Test: should feel calm and Hinge-like

### Phase D: Dashboard
14. Build TabBar component
15. Build Dashboard.jsx with two tabs
16. Crushky AI tab — State A (first time, "Start talking" button)
17. My Companion tab — basic chat interface
18. Test: should feel like Wavelength's tab layout

### Phase E: AI Chat Onboarding
19. Build ChatBubble component
20. Build Chat.jsx with AI conversation (4 questions)
21. Implement Claude API integration with fallback demo responses
22. After completion, navigate back to dashboard (State B)
23. Test: conversation should feel natural, not like a form

### Phase F: Match Results + Profile
24. Build MatchCard component
25. Dashboard Crushky AI tab — State B (show match cards)
26. Build seedMatches.js with 3 profiles
27. Build MatchProfile.jsx (full detail view)
28. Test: match explanations should feel personal, like a friend introducing you

### Phase G: Polish
29. Add page transition animations (subtle fades)
30. Add loading states
31. Mobile responsive check (all screens)
32. Final design polish pass

---

## WHAT WE ARE NOT BUILDING FOR MVP

- Real matchmaking backend (seeded/hardcoded matches only)
- Real authentication (localStorage mock auth)
- Payments or subscriptions
- Actual venue booking (show suggestion only)
- Native mobile app (web only, mobile-responsive)
- Voice AI (mic icon present but text-only for now)
- Cross-session memory for AI companion
- Photo upload to a server (local preview only)

---

## LINKS

| Resource | URL |
|---|---|
| GitHub Repo | https://github.com/vikramaditya26/crushky |
| Vercel Deploy | https://crushky.vercel.app |
| Known (competitor) | https://known.com |
| Wavelength (competitor) | https://www.heywavelength.com |
| Ditto (competitor) | https://ditto.ai |

---

## GIT WORKFLOW

- Branch: `main`
- Always pull before working: `git pull origin main`
- Commit with clear messages: `git commit -m "feat: add signup flow"`
- Never commit `.env` file
- Use Node 22: `nvm use 22` before any npm/npx commands

---

## CURRENT STATUS

| Task | Status | Owner |
|---|---|---|
| GitHub repo created | Done | Aditya |
| agent.md written (detailed) | Done | Claude Code |
| Project scaffolded (Vite + React + Tailwind + Router) | Done | Claude Code |
| Landing page (warm cream, phone mockup, gradient blobs, scroll animations) | Done | Claude Code |
| Signup flow (8 steps, Hinge-style, cream bg) | Done | Claude Code |
| Dashboard with tabs (Crushky AI + My Companion) | Done | Claude Code |
| AI Chat onboarding (4 questions, cream bg, mic icon) | Done | Claude Code |
| Match results on dashboard (3 cards with photos) | Done | Claude Code |
| Match profile page (2-col desktop, booking confirmation with restaurant details) | Done | Claude Code |
| AI Companion chat (3 avatars: Mira/Arjun/Zara, paywall after 4 msgs at ₹299/mo) | Done | Claude Code |
| Seed match data (3 profiles: Neha, Priya, Riya with date suggestions) | Done | Claude Code |
| Claude API util (supports custom system prompts, demo fallback) | Done | Claude Code |
| Design system (cream bg, gradient blobs, glass cards, animations, responsive) | Done | Claude Code |
| Deploy to Vercel | TODO | Aditya |

---

*Last updated: May 21, 2026*
*Status: Full UI redesign complete. Warm cream aesthetic (inspired by Known + Wavelength), NOT dark/black. All screens verified on both mobile (375px) and desktop (1280px+). Features: gradient blob backgrounds, glass-morphism cards, scroll-reveal animations (IntersectionObserver), fadeInUp/scaleIn/float keyframes, phone mockup on landing, "Book this date" with restaurant confirmation details (venue, time, seating, price), AI Companion with 3 avatar choices (Mira/Arjun/Zara) and premium paywall (₹299/month after 4 messages). Ready for deploy.*
*Tech notes: Node 22 via nvm. Tailwind v4 with @tailwindcss/vite plugin. Chat works with or without API key (has demo fallback). Photos from Unsplash. CSS animations defined in index.css with utility classes (.animate-fade-in-up, .animate-float, .blob-gradient, .glass-card, delay classes).*

---

## CODEX HANDOFF NOTE — MAY 22, 2026

- Committing and pushing the latest tracked local changes on `main`.
- Files included in this batch: `src/pages/Landing.jsx`, `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Chat.jsx`, `src/pages/MatchProfile.jsx`, `src/components/MatchCard.jsx`, `src/components/CompanionChat.jsx`, `src/data/seedMatches.js`, `src/index.css`, and this `agent.md`.
- `.claude/` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 26, 2026

- Committing and pushing the latest tracked local changes on `main`.
- Files included in this batch: `src/pages/Landing.jsx`, `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Chat.jsx`, `src/pages/MatchProfile.jsx`, `src/data/seedMatches.js`, and this `agent.md`.
- Diff summary for this batch: additional chat flow/content updates, dashboard adjustments, landing tweaks, richer match profile details, signup refinements, and expanded seeded match data.
- `.claude/` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 26, 2026 (SECOND BATCH)

- Committing and pushing the next tracked local changes on `main`.
- Files included in this batch: `src/pages/Landing.jsx`, `src/pages/Signup.jsx`, `src/pages/Chat.jsx`, `src/data/seedMatches.js`, and this `agent.md`.
- Diff summary for this batch: follow-up copy/content tuning across landing, signup, chat, and seeded match data.
- `.claude/` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 26, 2026 (THIRD BATCH)

- Committing and pushing the next tracked local changes on `main`.
- Files included in this batch: `src/pages/Landing.jsx`, `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Chat.jsx`, `src/components/CompanionChat.jsx`, `src/data/seedMatches.js`, and this `agent.md`.
- Diff summary for this batch: broader UX/layout refresh across landing, signup, dashboard, chat, and companion surfaces, plus updated seeded match content.
- `.claude/` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 28, 2026

- Committing and pushing the latest tracked local changes on `main`.
- Files included in this batch: `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/pages/MatchProfile.jsx`, `src/components/CompanionChat.jsx`, and this `agent.md`.
- Diff summary for this batch: substantial refinements to signup flow, dashboard presentation, match profile experience, and companion chat UI/content.
- `.claude/launch.json` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 29, 2026

- Committing and pushing the latest tracked local changes on `main`.
- Files included in this batch: `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/components/CompanionChat.jsx`, `src/components/ChatBubble.jsx`, `src/data/seedMatches.js`, `src/index.css`, and this `agent.md`.
- Diff summary for this batch: major signup flow changes, companion chat refinements, dashboard updates, chat bubble styling/content polish, expanded seed data, and global CSS additions.
- `.claude/launch.json` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 29, 2026 (SECOND BATCH)

- Pushing one existing local UI commit plus this follow-up `agent.md` note.
- Existing local commit in this batch: `3e92216` `redesign: light cream signup, movie/book image pickers, companion two-tab layout`.
- Files changed by that UI commit: `src/pages/Signup.jsx` and `src/components/CompanionChat.jsx`.
- Diff summary for that UI commit: signup moved back to a light cream presentation, film/books selection now uses visual poster-cover pickers, and companion chat gained a clearer avatar card layout plus Chat/Extras tabs.
- `.claude/launch.json` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — MAY 30, 2026

- Pushing two existing local UI commits plus this follow-up `agent.md` note.
- Existing local commits in this batch:
  - `1c504de` `feat: companion redesign, shuffle picks, bio field, AI match bios`
  - `445ddec` `feat: companion voice-entry screen matches Dashboard Tap to talk flow`
- Files changed across those UI commits: `src/components/CompanionChat.jsx`, `src/pages/Signup.jsx`, `src/pages/Dashboard.jsx`, `src/data/seedMatches.js`, and `src/index.css`.
- Diff summary for this batch: companion experience was redesigned around selection + session flows, signup gained shuffleable interest picks plus a bio field, dashboard wording was adjusted, and companion chat now starts from a voice-entry screen that transitions into conversation.
- `.claude/launch.json` remains intentionally untracked and is not part of the push.

## CODEX HANDOFF NOTE — JUNE 1, 2026

- Pushing two existing local UI commits plus this follow-up `agent.md` note.
- Existing local commits in this batch:
  - `86cb441` `fix: companion chat uses same ChatBubble UI as Talk tab`
  - `a9fbc14` `redesign: new landing page — Wavelength × Ditto aesthetic`
- Files changed across those UI commits: `src/components/CompanionChat.jsx`, `src/pages/Landing.jsx`, `package.json`, and `package-lock.json`.
- Diff summary for this batch: companion conversation UI was aligned with the main Talk tab bubble system, and the landing page was fully redesigned with a Wavelength × Ditto-inspired aesthetic plus Framer Motion-driven animations.
- Untracked files intentionally left out of the push: `.claude/launch.json`, `Crushky_Investor_Memo.docx`, `Crushky_Seed_Memo.docx`, and `Crushky_Seed_Memo.pdf`.

## CODEX HANDOFF NOTE — JUNE 2, 2026

- Committing and pushing the latest tracked local changes on `main`.
- Files included in this batch: `src/pages/Landing.jsx` and this `agent.md`.
- Diff summary for this batch: follow-up landing page refinements on top of the June 1 redesign.
- Untracked files intentionally left out of the push: `.claude/launch.json`, `Crushky_Investor_Memo.docx`, `Crushky_Seed_Memo.docx`, `Crushky_Seed_Memo.pdf`, the untracked `image/` files, the untracked `video/` files, and the new untracked assets under `public/img/` and `public/vid/`.

## CODEX HANDOFF NOTE — JUNE 2, 2026 (MEDIA BATCH)

- Committing and pushing the requested untracked media assets on `main`.
- Files included in this batch: all current files under `image/`, `video/`, `public/img/`, `public/vid/`, and this `agent.md`.
- Asset counts in this batch at commit time: `image/` 29 files, `video/` 6 files, `public/img/` 23 files, `public/vid/` 5 files.
- Untracked files still intentionally left out of the push: `.claude/launch.json`, `Crushky_Investor_Memo.docx`, `Crushky_Seed_Memo.docx`, and `Crushky_Seed_Memo.pdf`.
