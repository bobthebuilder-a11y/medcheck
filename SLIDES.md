# MedCheck — ACP Presentation Slides
## Full Script + Speaker Notes
*ACP Student AI Championship 2026 | David Xiao | 4-6 minutes*

---

## SLIDE 1: Title

**Title:** 🔬 MedCheck
**Subtitle:** Fighting Health Misinformation with AI
**Bottom line:** David Xiao | ACP Student AI Championship 2026 | SDG 3 + SDG 16

**Speaker notes:**
"Hi everyone, my name is David Xiao and today I'm presenting MedCheck — an AI-powered health misinformation detector. This project addresses one of the most dangerous problems of the information age: false health claims that look real, sound real, and can kill people."

---

## SLIDE 2: The Problem

**Title:** The Problem Is Bigger Than You Think

**Bullets:**
- 🦠 False health claims spread **6x faster** than corrections on social media
- 💀 Vaccine hesitancy driven by misinformation costs **~$5.8B/year** in preventable disease (Johns Hopkins)
- 👴 1 in 3 Americans has acted on health advice from social media without verifying it
- ⏱️ Average time to read a false claim: **3 seconds**. Time to fact-check it manually: **15-20 minutes**

**Speaker notes:**
"Health misinformation isn't just annoying — it has real consequences. People delay cancer screenings because they read that treatments are 'just poison.' Parents skip vaccines because of debunked autism claims. And the math is brutal: it takes 3 seconds to read a false claim, and 15-20 minutes to fact-check it properly. Nobody does that. I wanted to close that gap."

---

## SLIDE 3: Why Existing Solutions Fail

**Title:** Why Existing Fact-Checkers Aren't Enough

**Bullets:**
- ❌ **Snopes / PolitiFact** — require you to already be skeptical, manually search
- ❌ **Google fact-check** — only covers widely-covered stories, not emerging claims
- ❌ **Social media labels** — reactive, applied after viral spread, no explanation of *why*
- ❌ **None of them explain their reasoning** — they tell you *what*, not *why*

**The gap:** A tool that meets people where they are, works on ANY claim, and builds real understanding

**Speaker notes:**
"Existing fact-checkers have a fundamental problem: they require you to already doubt the claim. But by the time someone thinks 'I should check this,' they've often already shared it. And none of them explain their reasoning — they just say true or false. That doesn't build media literacy. It builds AI dependency."

---

## SLIDE 4: Why AI Is the Right Tool

**Title:** Why This Problem Needs AI

**Bullets:**
- 🧠 **Scale:** Millions of new health claims per day — humans can't keep up
- 📚 **Knowledge synthesis:** AI can cross-reference CDC, WHO, PubMed simultaneously in seconds
- 🔍 **Decomposition:** AI can break a compound claim into individual assertions and check each one
- ⚖️ **Calibrated uncertainty:** AI can express *degrees* of confidence, not just binary verdicts
- 🌐 **Accessibility:** No expertise required — anyone can use it

**This is NOT just an API wrapper. The AI is doing the core intellectual work.**

**Speaker notes:**
"AI is the right tool here for a specific reason: the cognitive task of fact-checking — finding relevant evidence, weighing it, and synthesizing a verdict — is exactly what large language models are trained to do. The key insight is that AI can do in 3 seconds what takes a human 20 minutes. And it can explain *why*, not just *what*."

---

## SLIDE 5: How MedCheck Works

**Title:** 🏗️ Architecture

**Visual: Flow diagram**
[User inputs claim] → [AI decomposes into assertions] → [Cross-references knowledge base: CDC / WHO / PubMed] → [Confidence calibration] → [Structured output]

**Output includes:**
- Verdict (True / False / Misleading / Unverifiable)
- Confidence score (0-100%)
- Claim breakdown (each assertion evaluated separately)
- Plain-language explanation of *why*
- Real source citations
- Political charge flag

**Tech stack:** React + TypeScript | Groq (Llama 4 Maverick) | Vite | Deployed on Vercel

**Speaker notes:**
"The architecture is built around one core principle: explain the reasoning, not just the verdict. The AI receives a claim, breaks it into individual factual assertions, evaluates each one, and synthesizes a verdict with an honest confidence score. The political charge flag is something I added based on my research — claims touching politically sensitive topics should carry an extra signal to be careful."

---

## SLIDE 6: Live Demo

**Title:** 🖥️ Demo: MedCheck in Action

**Screenshot layout (3 examples side by side or stacked):**

Example 1: "Vaccines cause autism"
→ ❌ FALSE | High Confidence (95%) | Explanation + CDC citation

Example 2: "Natural immunity is always better than vaccine immunity"  
→ ⚠️ MISLEADING | Medium Confidence (72%) | 🔴 Politically Charged | Nuanced breakdown

Example 3: "Vitamin C megadoses cure cancer"
→ ❌ FALSE | High Confidence (88%) | PubMed citations

**Speaker notes:**
"Here's what the tool actually produces. Notice that for 'natural immunity is always better than vaccines' — it doesn't just say false. It says *misleading*, flags it as politically charged, gives a medium confidence score, and explains the nuance: natural immunity can be strong, but the evidence depends heavily on the disease. That's a much more honest answer than a binary verdict."

---

## SLIDE 7: Impact & SDG Alignment

**Title:** 🌍 Real-World Impact

**SDG 3 — Good Health & Well-Being:**
- Reduces health decisions based on false information
- Particularly impactful for communities with limited healthcare access
- Every prevented false belief = potential life saved

**SDG 16 — Peace, Justice & Strong Institutions:**
- Supports an informed public that can participate in democratic health decisions
- Counters coordinated health misinformation campaigns

**Scale potential:**
- Free, open-source, accessible to anyone with internet
- Next step: browser extension (claims checked automatically as you browse)
- Target users: patients, caregivers, students, public health workers

**Speaker notes:**
"The impact aligns directly with two SDGs. For SDG 3, every health decision made on better information is a potential harm prevented. For SDG 16, an informed public is foundational to functional institutions — health policy only works when people trust verified science. The tool is free and deployable at scale."

---

## SLIDE 8: The Research Layer

**Title:** 🔬 This Is More Than an App

**Ongoing research question:**
*"Do LLMs exhibit higher rates of confident-but-wrong verdicts on politically charged health claims compared to neutral ones?"*

**Why this matters:**
- AI fact-checkers are being deployed at scale by social platforms
- If they're confidently wrong on contested topics, they could make things worse
- Nobody has systematically measured this in health misinformation contexts

**Research plan:**
- 150 labeled health claims (neutral + politically charged)
- 3 models: Claude, GPT-4, Llama
- Measure: miscalibration rate by political charge
- Target: publish in Journal of Emerging Investigators

**Speaker notes:**
"Building MedCheck raised a deeper question I want to answer: are AI fact-checkers more confidently wrong on politically charged topics? That's not just an academic question — it has real implications for platforms deploying AI at scale. This project is the foundation for a research paper I'm working on with a professor mentor."

---

## SLIDE 9: Ethical Considerations

**Title:** ⚠️ We Thought About This

**The risks we built around:**
- **AI overconfidence:** We show honest confidence scores — low confidence verdicts are a feature, not a bug
- **AI dependency:** The tool explains *why*, building literacy not reliance
- **False authority:** Every output includes a disclaimer: not a substitute for medical advice
- **Bias:** Political charge flag warns users when AI reliability may be lower
- **Hallucination:** Citations are provided so users can verify directly

**The honest limitation:**
> "This tool is as good as the model's training data. It can be wrong. The goal is to help people think more carefully, not to replace thinking."

**Speaker notes:**
"We thought hard about the ethical risks. The biggest one is that a tool like this could make people *more* blindly trusting of AI, not less. That's why every design decision pushes toward transparency: honest confidence scores, detailed explanations, real citations, and a clear disclaimer. The political charge flag is particularly important — it's a signal to be *more* skeptical, not less."

---

## SLIDE 10: Future Directions

**Title:** 🚀 Where This Goes Next

**V2 (Next 3 months):**
- Browser extension — automatically flags claims as you browse (no copy-paste)
- Multi-domain support (climate, politics, historical facts)
- Model comparison — run same claim through multiple AI systems

**Research (This year):**
- Publish paper on AI confidence miscalibration bias
- Build public dataset of 300+ labeled health claims

**Long-term:**
- Open-source nonprofit: MediaLens Foundation
- Deploy in public schools and libraries as media literacy tool
- API for newsrooms and public health departments

**Speaker notes:**
"The app is V1. The browser extension is where the real impact happens — meeting people in the moment they're reading a claim, not requiring them to seek out the tool. The research paper is the scientific foundation that makes everything more credible. And long-term, I want to make this a free public resource."

---

## SLIDE 11: Conclusion

**Title:** The Problem Won't Wait

**Key message:**
> Health misinformation kills. AI can help. We built it.

**What MedCheck does:**
✅ Analyzes any health claim in seconds
✅ Explains *why*, not just *what*
✅ Calibrates confidence honestly
✅ Cites real sources
✅ Flags politically charged topics
✅ Free and accessible to everyone

**GitHub:** github.com/bobthebuilder-a11y/medcheck

**Speaker notes:**
"Health misinformation is not a new problem. But AI gives us a new tool to fight it — one that's fast enough, accessible enough, and honest enough to actually help. MedCheck is the beginning of a longer project: a research paper, a browser extension, and eventually an open-source platform that anyone can use. The problem won't wait. We started building. Thank you."

---

## Q&A PREP — Likely Judge Questions

**Q: "Why is AI the right tool for this, specifically?"**
A: "Three reasons: scale (millions of claims, AI never sleeps), decomposition (AI can break compound claims into individual assertions), and calibrated uncertainty (AI can express degrees of confidence, not just binary verdicts)."

**Q: "What happens when your AI is wrong?"**
A: "It happens, and we designed for it. Every verdict shows a confidence score — if confidence is low, we want users to be skeptical. We show citations so they can verify. And the disclaimer is explicit: this is not medical advice. The goal is to help people think more carefully, not replace their judgment."

**Q: "How is this different from just asking ChatGPT?"**
A: "MedCheck is specifically prompted for structured fact-checking — it decomposes claims, calibrates confidence honestly, and formats output for clarity. A general chatbot will give you a conversational answer; MedCheck gives you a structured verdict with sourced reasoning you can act on."

**Q: "What's the political charge flag?"**
A: "It flags claims where the science intersects with political controversy. The research I'm doing shows AI systems may be less reliable on these topics — so the flag tells users to be extra careful and verify from multiple sources."

**Q: "How would you scale this?"**
A: "Browser extension first — that removes the friction of copy-pasting. Then open API for platforms and newsrooms. The goal is to make it infrastructure, not just an app."
