# MedCheck — ACP Presentation Slides
## Full Script + Speaker Notes
*ACP Student AI Championship 2026 | David Xiao | 4-6 minutes*
*Live app: https://medcheck-murex.vercel.app | Code: github.com/bobthebuilder-a11y/medcheck*

---

## SLIDE 1: Title

**Title:** 🔬 MedCheck
**Subtitle:** AI-Powered Health Misinformation Detection
**Bottom:** David Xiao · ACP Student AI Championship 2026 · SDG 3 + SDG 16

**Speaker notes:**
"Hi, I'm David Xiao. Today I'm presenting MedCheck — an AI-powered health misinformation detector that analyzes any health claim in real time, breaks it down to its individual assertions, checks each one against scientific evidence, and returns a calibrated verdict with honest confidence scores and real source citations. But it's also more than an app. Let me show you why."

---

## SLIDE 2: The Problem

**Title:** Health Misinformation Is Lethal

**Stats (2x2 grid):**
- 📊 **6×** faster — false claims spread vs. corrections on social media
- 🏥 **30M+** Americans — uninsured, making health decisions from social media
- 😟 **1 in 3** — Americans have acted on unverified health advice online
- ⏱️ **3 sec / 20 min** — time to read a false claim vs. manually fact-check it

**One line under stats:**
> "By the time a correction reaches someone, they've already shared it."

**Speaker notes:**
"Health misinformation isn't just annoying — it kills people. Parents skip vaccines. Patients try fake cures. People delay cancer screenings. The math is brutal: it takes 3 seconds to read a false claim, and 20 minutes to fact-check it manually. Nobody does that. That's the gap MedCheck closes."

---

## SLIDE 3: Why Existing Solutions Fail

**Title:** The Problem With Current Fact-Checkers

**Left column — Existing tools:**
- ❌ Snopes / PolitiFact → Require you to already be skeptical
- ❌ Google fact-check labels → Only cover widely-circulated stories
- ❌ Social media flags → Applied after viral spread, no explanation
- ❌ None explain *why* — just *what*

**Right column — The gap:**
- ✅ Works on ANY claim, not just famous ones
- ✅ Explains the reasoning, not just the verdict
- ✅ Calibrates confidence honestly
- ✅ Meets people where they are

**Speaker notes:**
"Existing fact-checkers have one fundamental flaw: they require you to already doubt the claim. But most misinformation spreads to people who aren't skeptical yet. And none of them explain their reasoning — they just say true or false. That doesn't build media literacy. It builds AI dependency. MedCheck does both."

---

## SLIDE 4: Why AI Is the Right Tool

**Title:** What Makes This an AI Problem

**Bullets:**
- 🌍 **Scale** — Millions of new health claims daily. Humans can't keep up.
- 🧩 **Decomposition** — AI breaks compound claims into individual assertions automatically
- ⚖️ **Calibrated uncertainty** — AI can express degrees of confidence, not just binary verdicts
- 📚 **Knowledge synthesis** — Cross-references CDC, WHO, PubMed simultaneously in seconds
- 🔓 **Accessibility** — No medical background required to use

**Bottom line:**
> "AI is not the point. Impact is. AI is just the only tool fast enough and scalable enough to make this work."

**Speaker notes:**
"Judges asked us to think about why AI specifically. Here's the answer: the cognitive task of fact-checking — finding relevant evidence, weighing it, synthesizing a verdict — is exactly what large language models are designed to do. And they can do it in 3 seconds, for any claim, for anyone. That's not something humans can match at scale."

---

## SLIDE 5: How MedCheck Works

**Title:** 🏗️ Architecture

**Flow diagram (left to right):**
[User inputs claim] → [AI decomposes into assertions] → [Evidence synthesis: CDC / WHO / PubMed / NIH] → [Confidence calibration] → [Structured JSON output] → [React frontend renders result]

**Output includes:**
- Verdict: TRUE / FALSE / MISLEADING / UNVERIFIABLE
- Confidence score: 0-100%
- Claim breakdown: each assertion evaluated
- Explanation: plain-language *why*
- Citations: real sources
- Political charge flag: ⚡ for contested topics
- Category tag: vaccines, nutrition, cancer, etc.

**Tech:** React + TypeScript · Llama 4 via Groq · Vite · Vercel

**Speaker notes:**
"The architecture is built around structured prompting. We don't just ask the AI 'is this true?' We give it a carefully engineered system prompt that instructs it to decompose the claim, evaluate each assertion separately, calibrate its confidence honestly, return structured JSON, and flag politically charged topics. The political charge flag tells users when AI reliability may be lower — a signal to verify extra carefully."

---

## SLIDE 6: Live Demo

**Title:** 🖥️ Demo

*[Open https://medcheck-murex.vercel.app on screen]*

**Demo sequence (3 minutes max):**
1. **Click** "Vaccines cause autism" from the example chips → wait ~8 seconds → show ❌ FALSE, 95% confidence, claim breakdown, CDC citations
2. **Type manually** "Natural immunity is always better than vaccines" → show ⚠️ MISLEADING, ⚡ Politically Charged, nuanced breakdown
3. **Click the social media post example** (the long BREAKING NEWS one) → show how AI extracts the core claim from a full post
4. **Click About tab** → briefly show problem stats and how it works

**Key lines during demo:**
- "It doesn't just say false — it says *why* with specific scientific reasoning"
- "MISLEADING is more honest than FALSE — this claim has partial truth"
- "The political charge flag signals when AI reliability may be lower — treat these results with extra scrutiny"
- "Watch this — I'll paste a full viral social media post and it extracts and checks the actual claim"
- "The confidence score is the most honest part — when it's low, the AI is telling you to be skeptical of its own answer""

---

## SLIDE 7: The Four Verdicts

**Title:** Honest Verdicts for a Complex World

**2x2 grid:**
- ✅ **TRUE** — Evidence clearly supports this claim
- ❌ **FALSE** — Evidence clearly contradicts this claim
- ⚠️ **MISLEADING** — Partial truth, false overall impression
- ❓ **UNVERIFIABLE** — Insufficient consensus to evaluate

**Highlighted box:**
> "MISLEADING is the most important verdict. Most dangerous misinformation isn't false — it's selectively true. 'Natural immunity is always better than vaccines' contains real science, weaponized to create a false belief."

**Speaker notes:**
"Most fact-checkers are binary. MedCheck has four verdicts because reality is more complex. Misleading is where most dangerous health misinformation lives — it's not a lie, it's a truth taken out of context. That nuance matters."

---

## SLIDE 8: What Makes This Different

**Title:** 🔑 What Makes MedCheck Different

**Three key differentiators:**

**1. Structured output, not conversation**
- Returns JSON with defined fields: verdict, confidence score, assertions, sources
- Not a chatbot answer — a machine-readable, displayable result
- This is the difference between an AI tool and an AI toy

**2. Honest calibration by design**
- The system prompt explicitly says: "A low-confidence honest answer beats a high-confidence wrong answer"
- The ⚡ Political Charge flag tells users when to be *more* skeptical of the AI
- Other fact-checkers give you confidence they haven't earned

**3. Explains WHY, not just WHAT**
- Most tools say "FALSE" and move on
- MedCheck explains the science, breaks down each assertion, cites real sources
- This builds media literacy — users learn, not just get an answer

**Speaker notes:**
"What makes MedCheck more than a wrapper around ChatGPT? Three things. First, we engineered a specific output structure — not a paragraph, but a structured verdict with defined fields. Second, we built honesty into the prompt itself — the AI is explicitly instructed to admit uncertainty, which most AI tools don't do. Third, we explain the reasoning. Most fact-checkers just say true or false. MedCheck teaches you why — and that builds media literacy, not AI dependency."

---

## SLIDE 9: Impact & SDG Alignment

**Title:** 🌍 Real-World Impact

**SDG 3 — Good Health & Well-Being:**
- Reduces health decisions made on false information
- Particularly impacts underserved communities with limited healthcare access
- Scalable: free, runs in any browser, no installation

**SDG 16 — Peace, Justice & Strong Institutions:**
- Informed public = functional health institutions
- Counters coordinated health misinformation campaigns
- Builds media literacy, not just AI dependency

**Scale path:**
V1 (now): Web app → V2: Browser extension (claims flagged automatically) → V3: Open-source API for newsrooms and public health orgs

**Speaker notes:**
"The connection to SDG 3 is direct — every false health belief that gets corrected is a potential harm prevented. For SDG 16, an informed public is the foundation of institutions that work. The scale path matters: the browser extension would check claims automatically as you browse, removing the need to seek out the tool."

---

## SLIDE 10: Ethical Considerations

**Title:** ⚠️ We Thought About the Risks

**Risk and mitigation table:**

| Risk | How We Addressed It |
|------|---------------------|
| AI overconfidence | Honest confidence scores — low confidence verdicts are a feature |
| User dependency | Tool explains *why*, building literacy not reliance |
| False authority | Medical disclaimer on every result |
| Bias on charged topics | Political charge flag warns users explicitly |
| Hallucination | Citations provided — users can verify independently |

**Honest limitation:**
> "This tool can be wrong. The goal is to help people think more carefully — not to replace thinking."

**Speaker notes:**
"The biggest ethical risk is making people *more* blindly trusting of AI. Every design decision fights against that: honest confidence scores, detailed explanations, real citations, and explicit disclaimers. The political charge flag is our most important ethical feature — it tells users when the AI might be most fallible."

---

## SLIDE 11: Future Directions

**Title:** 🚀 Where This Goes

**Near-term (next 3 months):**
- V2: Browser extension — flags claims automatically as you browse
- Multi-domain: climate, politics, historical facts beyond health
- Model comparison: run same claim through Claude + GPT-4 + Llama

**Research (this year):**
- Publish analysis of AI accuracy across health claim categories
- Build public dataset of verified health claims with ground truth

**Long-term:**
- MediaLens Foundation — open-source nonprofit for media literacy
- Deploy in public schools and libraries
- API for newsrooms and public health departments

**Speaker notes:**
"The browser extension is the next step that matters most for impact. It removes all friction — you don't have to seek out the tool, it finds the claims for you. And the nonprofit direction is where I want this to go eventually — free, open, accessible to everyone."

---

## SLIDE 12: Conclusion

**Title:** The Problem Won't Wait

**What MedCheck delivers:**
✅ Any health claim analyzed in seconds
✅ Honest confidence calibration — not false authority
✅ Explains *why*, building real media literacy
✅ Cites real sources — verifiable, not blind trust
✅ Flags politically charged topics for extra scrutiny
✅ Free. Open. Accessible to anyone.

**Links:**
- 🌐 medcheck-murex.vercel.app
- 💻 github.com/bobthebuilder-a11y/medcheck

**Speaker notes:**
"Health misinformation is not new. But AI gives us a new tool — one fast enough, accessible enough, and honest enough to help. MedCheck is V1. The browser extension is next. The problem won't wait. Thank you."

---

## Q&A PREP — Every Likely Question

**"Why AI specifically?"**
Scale + decomposition + calibrated uncertainty. Humans can't fact-check millions of claims. AI can, in seconds, and it can explain its reasoning — something search engines can't do.

**"What if the AI is wrong?"**
The confidence score signals uncertainty by design. Low confidence = treat with skepticism. We cite sources so you can verify independently. The disclaimer is explicit and visible on every result.

**"How is this different from ChatGPT?"**
Specifically engineered prompt for structured fact-checking. Outputs structured JSON with verdicts, confidence scores, assertions breakdown — not conversational text. Persists history. Flags political charge. Has an About page explaining how it works.

**"What's the sample size? Who has used it?"**
Working prototype. Next steps: test with more users, collect real feedback, and iterate.

**"Could this be misused?"**
Any tool can be misused. Our mitigations: confidence scores prevent false authority, explanations build literacy not dependency, medical disclaimer is explicit, political charge flag increases scrutiny on contested topics.

**"How does the confidence score work?"**
The AI model is instructed explicitly to be honest about uncertainty. The system prompt says: "A low confidence honest answer is better than a high confidence wrong answer." The score reflects the AI's certainty, not the claim's truth value.

**"What's the political charge flag for?"**
It signals that this topic has political dimensions, which can affect AI reliability. It's a prompt to verify from multiple sources rather than trusting any single verdict.

**"Who are your sources?"**
The AI references CDC, WHO, NIH, PubMed, and peer-reviewed journals. Citations are provided with every result so users can verify directly.

**"What SDGs does this address?"**
SDG 3 (Good Health) — reducing harm from health misinformation. SDG 16 (Peace, Justice, Strong Institutions) — supporting an informed public capable of participating in democratic health decisions.

**"Are you planning to publish?"**
Future research is something we're exploring. For now, focused on making the tool as useful as possible.
