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
"The architecture is built around structured prompting. We don't just ask the AI 'is this true?' We give it a carefully engineered system prompt that instructs it to decompose the claim, evaluate each assertion separately, calibrate its confidence honestly, return structured JSON, and flag politically charged topics. The political charge flag is directly connected to our research paper — I'll explain that in a moment."

---

## SLIDE 6: Live Demo

**Title:** 🖥️ Demo

*[Open https://medcheck-murex.vercel.app on screen]*

**Demo sequence:**
1. Click "Vaccines cause autism" → show ❌ FALSE, High Confidence, claim breakdown, CDC citations
2. Type manually: "Natural immunity is always better than vaccines" → show ⚠️ MISLEADING, ⚡ Politically Charged, nuanced breakdown
3. Click About tab → show research angle, stats bar

**Key lines during demo:**
- "Notice it doesn't just say false — it says *why* with specific scientific reasoning"
- "MISLEADING is more honest than FALSE here — this claim has partial truth in it"
- "The political charge flag means: treat this verdict with extra skepticism. That's connected to our research."
- "The About page shows this is also a research project, not just an app"

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

## SLIDE 8: This Is More Than an App

**Title:** 🔭 The Research Layer

**Research question:**
*"Do large language models exhibit higher rates of confident-but-wrong verdicts on politically charged health claims compared to politically neutral ones?"*

**Why it matters:**
- AI fact-checkers are being deployed at scale by social platforms right now
- If they're systematically biased on politically charged topics, they may make misinformation *worse*
- Nobody has measured this specifically for health claims

**Research plan:**
- 150 labeled health claims: neutral vs. politically charged
- 3 models: Claude, GPT-4, Llama
- Measure: miscalibration rate (wrong + confident) by political charge
- Working with professor mentor → target: Journal of Emerging Investigators

**Speaker notes:**
"Building MedCheck raised a deeper question: are AI fact-checkers more confidently wrong on politically charged topics? That's not just academic — it has real implications for platforms deploying AI at scale. This app is the instrument for that research, and the political charge flag is the user-facing expression of that research question."

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
- Publish paper on AI confidence miscalibration in politically charged health claims
- Build public dataset of 300+ labeled claims with ground truth

**Long-term:**
- MediaLens Foundation — open-source nonprofit for media literacy
- Deploy in public schools and libraries
- API for newsrooms and public health departments

**Speaker notes:**
"The browser extension is the next step that matters most for impact. It removes all friction — you don't have to seek out the tool, it finds the claims for you. The research paper is the scientific foundation that makes everything more credible. And the nonprofit direction is where I want this to go eventually — free, open, accessible to everyone."

---

## SLIDE 12: Conclusion

**Title:** The Problem Won't Wait

**What MedCheck delivers:**
✅ Any health claim analyzed in seconds
✅ Honest confidence calibration — not false authority
✅ Explains *why*, building real media literacy
✅ Cites real sources — verifiable, not blind trust
✅ Flags politically charged topics for extra scrutiny
✅ Foundation for original AI bias research
✅ Free. Open. Accessible to anyone.

**Links:**
- 🌐 medcheck-murex.vercel.app
- 💻 github.com/bobthebuilder-a11y/medcheck

**Speaker notes:**
"Health misinformation is not new. But AI gives us a new tool — one fast enough, accessible enough, and honest enough to help. MedCheck is V1. The research paper is underway. The browser extension is next. The problem won't wait. Thank you."

---

## Q&A PREP — Every Likely Question

**"Why AI specifically?"**
Scale + decomposition + calibrated uncertainty. Humans can't fact-check millions of claims. AI can, in seconds, and it can explain its reasoning — something search engines can't do.

**"What if the AI is wrong?"**
The confidence score signals uncertainty by design. Low confidence = treat with skepticism. We cite sources so you can verify independently. The disclaimer is explicit and visible on every result.

**"How is this different from ChatGPT?"**
Specifically engineered prompt for structured fact-checking. Outputs structured JSON with verdicts, confidence scores, assertions breakdown — not conversational text. Persists history. Flags political charge. Has an About page explaining the research.

**"What's the sample size? Who has used it?"**
Working prototype. The research paper will systematically test 150 labeled claims across 3 AI models. That's the scientific validation phase.

**"Could this be misused?"**
Any tool can be misused. Our mitigations: confidence scores prevent false authority, explanations build literacy not dependency, medical disclaimer is explicit, political charge flag increases scrutiny on contested topics.

**"How does the confidence score work?"**
The AI model is instructed explicitly to be honest about uncertainty. The system prompt says: "A low confidence honest answer is better than a high confidence wrong answer." The score reflects the AI's certainty, not the claim's truth value.

**"What's the political charge flag for?"**
It's both a user feature and a research signal. For users: it says "be extra careful here, check multiple sources." For the research: it marks the claims I'm studying for AI bias — whether AI is more confidently wrong on politically charged topics.

**"Who are your sources?"**
The AI references CDC, WHO, NIH, PubMed, and peer-reviewed journals. Citations are provided with every result so users can verify directly.

**"What SDGs does this address?"**
SDG 3 (Good Health) — reducing harm from health misinformation. SDG 16 (Peace, Justice, Strong Institutions) — supporting an informed public capable of participating in democratic health decisions.

**"Are you planning to publish?"**
Yes — targeting Journal of Emerging Investigators or similar. Working with a professor mentor. Timeline: paper submitted by January, in time for science fair season.
