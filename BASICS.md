# MedCheck — Basics Guide for David
## Everything you need to know before your presentation

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

## One-Sentence Version

If you need to explain it in one sentence:

> "MedCheck is an AI tool that analyzes health claims in real time, breaking them into individual assertions, checking each against scientific evidence, and returning a calibrated verdict with honest confidence scores and real source citations — built as the foundation for a research paper on AI bias in politically charged health topics."

---

*Built for ACP Student AI Championship 2026 | SDG 3 + SDG 16*
