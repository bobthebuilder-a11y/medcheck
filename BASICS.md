# MedCheck — Basics Guide for David
## Everything you need to know before your presentation

---

## 🆕 New Features Added This Morning

### Batch Mode
Click **"Batch"** in the navbar (or the "Check multiple claims at once" button). Enter up to 5 claims, one per line. The AI checks them all sequentially and shows live status as each one completes.

**Perfect for judges:** "Here, watch me check 5 viral misinformation claims at once."

### Trending Claims
On the home screen, you'll see a "Most Checked Claims" panel with pre-verified verdicts. Click any to re-analyze it fresh.

**Perfect for judges:** Shows the tool handles the most common misinformation circulating right now.

### Export Report
In the Recent history panel, click **"Export ↓"** to download a formatted text report of all claims you've checked this session.

---

## ⏰ 5-Minute Morning Prep Checklist

Before the competition, do this in order:

1. **Open the app** → https://medcheck-murex.vercel.app
2. **Run "Vaccines cause autism"** — confirm it returns ❌ FALSE with high confidence
3. **Run "Natural immunity is always better than vaccines"** — confirm it returns ⚠️ MISLEADING with ⚡ political charge flag
4. **Check the About tab** — make sure the 4 verdicts and how-it-works section looks right
5. **Open SLIDES.md** (or the PPTX) — skim the speaker notes, especially the Q&A section
6. **Check SUBMISSION.md** — it has drafted short answers for the submission form

That's it. If all 5 work, you're ready.

---

---

## What Does MedCheck Actually Do?

In plain English: you type a health claim (something like "vaccines cause autism"), and the AI analyzes it and tells you:

1. **Is it true, false, misleading, or impossible to verify?** → The verdict
2. **How confident is the AI?** → The confidence score (0-100%)
3. **What specifically is wrong?** → The claim breakdown (each individual assertion)
4. **Why is it wrong?** → The detailed explanation in plain language
5. **Who says so?** → Real sources (CDC, WHO, PubMed)
6. **Is it a political hot potato?** → The political charge flag

---

## The Four Verdicts — What They Mean

| Verdict | Means |
|---|---|
| ✅ TRUE | Scientific evidence supports this claim |
| ❌ FALSE | Scientific evidence clearly contradicts this claim |
| ⚠️ MISLEADING | Contains partial truths but creates a false overall impression |
| ❓ UNVERIFIABLE | Not enough scientific consensus to evaluate definitively |

**The most interesting one is MISLEADING.** This is where a lot of real misinformation lives — technically not a lie, but designed to make you believe something false. Example: "Natural immunity is always better than vaccines" — true in some specific cases, false as a general rule, therefore misleading.

---

## The Confidence Score — Why It Matters

The confidence score (0-100%) tells you how certain the AI is about its verdict.

- **90-100%:** Very strong scientific consensus. No serious debate.
- **60-89%:** Good evidence, but some uncertainty or ongoing research.
- **Below 60%:** Contested area. AI is unsure. Use extra caution.

**This is the most innovative part of the tool.** Most fact-checkers just say true/false. MedCheck says "I'm 73% confident this is misleading, here's why, and here's where to verify." That's honest in a way most tools aren't.

**For judges:** If they ask "what happens when the AI is wrong?" — point to the confidence score. Low confidence = the AI is signaling its own uncertainty. That's by design.

---

## The Political Charge Flag

When you see ⚡ **Politically Charged**, it means the claim touches an area where science and politics overlap. Examples: vaccine mandates, abortion-related health claims, COVID origins.

On these topics, the AI may be less reliable — not because the science is unclear, but because the training data for AI contains more conflicting political content on these topics.

**This is directly connected to your research paper.** You're investigating whether AI systems are *more confidently wrong* on politically charged topics. The flag is a user-facing signal of that underlying research question.

---

## The Architecture — How to Explain It to Judges

When a judge asks "how does it work technically?" here's what to say:

> "The user inputs a claim. It goes to our AI backend — Llama 4, running on Groq — with a carefully engineered system prompt that instructs the model to decompose the claim, evaluate each assertion, calibrate its confidence honestly, and return structured JSON. The frontend is React. The whole thing runs in the browser with no backend server — the AI call is made directly from the client using the Groq API."

**Key things to emphasize:**
- The system prompt is carefully designed — this isn't just asking ChatGPT a question. It's structured prompting for a specific analytical task.
- JSON output means the response is structured and parseable, not just freeform text.
- Confidence calibration is explicitly built into the prompt — we tell the AI to be honest about uncertainty.

---

## The Research Connection — Your Biggest Differentiator

When judges ask "what makes this more than just an app?" — this is your answer:

> "This app is also the instrument for a research paper I'm writing. I'm testing whether large language models exhibit measurable bias — specifically, whether they're more confidently wrong on politically charged health claims than on neutral ones. I'm working with a professor mentor, and we'll benchmark 150 health claims across 3 AI models. If we find that AI fact-checkers have systematic bias on politically charged topics, that has real implications for how platforms deploy them at scale."

That elevates you from "student who built an app" to "student doing original AI research."

---

## How to Demo It Live

**Best demo sequence (3 minutes):**

1. Open https://medcheck-murex.vercel.app
2. Click "Vaccines cause autism" from the examples → wait for result → explain the verdict + confidence score + breakdown
3. Type: "Natural immunity is always better than vaccines" manually → show the MISLEADING verdict + political charge flag → explain why misleading is different from false
4. Click About tab → briefly show the research angle and stats

**What to say during the demo:**
- "Notice it doesn't just say true or false — it gives a confidence score and explains *why*"
- "The claim breakdown shows each individual assertion separately"
- "The political charge flag is connected to my research — I'm studying whether AI is less reliable on these topics"
- "The sources let you verify independently — this tool builds literacy, not dependency"

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| ⌘+Enter | Analyze the current claim |
| Escape | Clear result, go back to idle |
| ⌘+B | Open Batch Mode |

---

## Likely Judge Questions — Quick Answers

**"Why is AI the right tool for this?"**
Scale + speed + decomposition. Humans can't fact-check millions of claims. AI can, in seconds, and it can explain its reasoning.

**"What happens when the AI is wrong?"**
The confidence score signals uncertainty. Low confidence = treat with extra skepticism. We also cite sources so you can verify. And there's a medical disclaimer on every result.

**"How is this different from asking ChatGPT?"**
MedCheck uses a specifically engineered prompt for structured fact-checking. It outputs JSON with verdicts, confidence scores, and sourced explanations — not conversational text. It also persists history and flags political charge, which ChatGPT doesn't do.

**"What's your sample size? Who has used it?"**
Right now it's a working prototype — the research paper will gather systematic data from 150 labeled claims across 3 AI models. That's the next phase.

**"Could this be misused?"**
Yes — any tool can. But we mitigate it: the confidence score prevents false authority, the explanation builds literacy instead of dependency, and the disclaimer is explicit. We also flag political charge so users know when to be extra careful.

**"What's your plan to scale it?"**
Browser extension → anyone browsing sees flags automatically. Then open-source it so other researchers can build on it. Long-term: API for newsrooms and health organizations.

---

## The SDG Connection

**SDG 3 — Good Health & Well-Being:** Health misinformation causes real harm — delayed diagnoses, vaccine hesitancy, dangerous self-treatment. Every accurate claim checked is a potential harm prevented.

**SDG 16 — Peace, Justice & Strong Institutions:** An informed public is necessary for functional institutions. Health policy only works when people trust verified science.

---

## Tech Stack (for judges who ask)

- **Frontend:** React + TypeScript (type-safe, modern)
- **Build tool:** Vite (fast)
- **AI model:** Llama 4 Scout via Groq API (free tier, fast inference)
- **Styling:** Tailwind CSS (utility-first, responsive)
- **Hosting:** Vercel (free, global CDN)
- **Repo:** github.com/bobthebuilder-a11y/medcheck

---

## What to Do If Something Goes Wrong During the Demo

**If the app is slow:**
- Groq's free tier sometimes has rate limits — if it spins for >20 seconds, try again
- Have 1-2 backup claims ready that you've already seen the results for (from history)
- The history panel shows your last 20 checks — you can reload any of them instantly

**If the app throws an error:**
- Click "Clear" and try a different claim
- If it keeps failing, the Groq API key might need rotation — contact me

**If you want to show a result without waiting:**
- Open the app ahead of time and run a few claims
- They'll all be in the history panel for instant recall during presentation

**Backup plan:** Screenshot the result card for "Vaccines cause autism" ❌ FALSE (95%) and have it ready as an image if the live demo fails.

---

## One-Sentence Version

If you need to explain it in one sentence:

> "MedCheck is an AI tool that analyzes health claims in real time, breaking them into individual assertions, checking each against scientific evidence, and returning a calibrated verdict with honest confidence scores and real source citations — built as the foundation for a research paper on AI bias in politically charged health topics."

---

## How the Code Works — Main Ideas (No Syntax)

### The Big Picture

MedCheck has two main parts that talk to each other:
1. **The Frontend** — what users see and interact with (React app in your browser)
2. **The AI Backend** — Groq's servers running Llama 4, which does the actual analysis

There's no "middle" server you run. Your browser talks directly to Groq's API. Vercel just hosts the static files.

---

### Concept 1: Components

React breaks the UI into **components** — reusable pieces that each do one job. Think of them like LEGO bricks.

MedCheck has these components:
- `App.tsx` — the main container, manages all the state (what's happening right now)
- `ResultCard.tsx` — displays the analysis result
- `ExampleClaims.tsx` — the colored claim chips
- `HistoryPanel.tsx` — the recent checks list
- `SessionStats.tsx` — the verdict breakdown after multiple checks
- `StatsBar.tsx` — the problem statistics on the About page

Each component receives **props** (inputs) from its parent and renders HTML. They don't know about each other — they just receive data and show it.

---

### Concept 2: State

**State** is the memory of what's currently happening. In MedCheck, the main state lives in `App.tsx`:

- `claim` — what's typed in the text box right now
- `phase` — is the app idle, streaming, done, or errored?
- `result` — the analysis the AI returned
- `history` — the list of past checks (also saved to browser localStorage)
- `loadingStep` — which step of the loading animation is showing

When state changes, React automatically re-renders the UI to match. You never manually update the DOM — you just update state and React handles the rest.

---

### Concept 3: The API Call

When you click "Analyze", this is what happens:

1. `App.tsx` calls `analyzeClaimStream()` from `analyzer.ts`
2. `analyzer.ts` sends your claim to Groq's servers with a carefully written **system prompt**
3. Groq streams the response back word-by-word (that's the "streaming" part)
4. As chunks arrive, the loading animation updates
5. When complete, the text is parsed as JSON → becomes a `ClaimAnalysis` object
6. `App.tsx` stores it in `result` state → `ResultCard` renders it

The key thing: **the AI returns structured JSON, not a paragraph**. That's what makes MedCheck different from just asking ChatGPT — we force the AI to return a specific format we can parse and display beautifully.

---

### Concept 4: The System Prompt

The system prompt is the most important part of the whole app. It's the set of instructions we send to the AI before your claim. It tells the AI:
- What its job is (rigorous fact-checker)
- What format to respond in (JSON with specific fields)
- How to calibrate confidence (be honest about uncertainty)
- What "misleading" vs "false" means
- How to detect political charge

A bad system prompt → a chatbot that gives vague answers.
A good system prompt → a structured tool that returns consistent, useful verdicts.

This is called **prompt engineering** and it's a real skill.

---

### Concept 5: TypeScript Types

The `types.ts` file defines the **shape** of data. For example, `ClaimAnalysis` says: every analysis result must have a verdict, a confidence score, assertions, sources, etc.

This isn't code that runs — it's a contract. TypeScript checks at build time that you never accidentally pass the wrong kind of data. It catches bugs before they happen.

---

### Concept 6: Async/Await

The AI call takes 5-10 seconds. If the app just waited and froze, that would be a terrible experience. Instead, JavaScript uses `async/await`:

- `async` means "this function does something that takes time"
- `await` means "wait for this to finish before moving on, but don't freeze the whole app"
- While waiting, React keeps the UI responsive — the loading animation keeps running, you can still scroll

The streaming is even fancier: instead of waiting for the whole response, we process it chunk by chunk as it arrives — that's why you see the loading steps advance in real time.

---

### Concept 7: localStorage

The history panel remembers your past checks even after you refresh the page. That's because we save it to `localStorage` — a small key-value store built into every browser. It's like a tiny database that lives on your computer.

Every time `history` state changes, we save it to localStorage. When the app loads, we read it back.

---

### What to Say When a Judge Asks "How Does It Work?"

> "The user's claim is sent to Groq's API running Llama 4, along with a system prompt that instructs the model to decompose the claim, evaluate assertions, calibrate confidence honestly, and return structured JSON. The React frontend parses that JSON and renders the result. There's no backend server — the browser talks directly to the AI API, and the whole app is hosted on Vercel."

---

## What Was Built Tonight (For Reference)

15 iterations, all pushed to GitHub and deployed:
1. Initial build — basic claim checker
2. Major UI overhaul — tabs, history, share button, category tags
3. Research badge, research callout banner
4. Polish — focus ring, example chips, paragraph spacing
5. Streaming responses with animated loading steps
6. ResultCard redesign — colored verdict header, confidence bar
7. StatsBar redesign + HistoryPanel improvements
8. Social media post support — AI extracts core claim from longer posts
9. Better example chips with divider + footer
10. Session stats panel
11. Better hero section with competition badge
12. Improved system prompt for better AI output quality
13. Political charge inline explanation box
14. Premium loading experience with step-by-step checklist
15. About page example result preview

**Live:** https://medcheck-murex.vercel.app
**GitHub:** github.com/bobthebuilder-a11y/medcheck

---

*Built for ACP Student AI Championship 2026 | SDG 3 + SDG 16*
