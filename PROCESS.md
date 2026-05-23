# MedCheck — Build Process & Research Journal
*Written from the perspective of David Xiao*

---

## Why I Built This

I've been thinking about misinformation for a while. You see it everywhere — on TikTok, in group chats, in the comments of news articles. But health misinformation is different from political misinformation or sports rumors. When someone believes a false health claim, they might delay a cancer screening. They might skip a vaccine. They might give their kid the wrong treatment. People die because of this.

What bothered me most wasn't that the information was wrong. It was that it *sounded* right. The fake claims are written confidently, they use scientific-sounding language, and they spread faster than the corrections. By the time the fact-check reaches someone, they've already shared the post a dozen times.

I wanted to build something that could meet people where they are — not a website you have to already be skeptical to visit, but a tool that could sit next to the claim and say: *wait, let's look at this.*

---

## The Research Phase

Before writing a single line of code, I spent time understanding the problem space.

I read through the ACP competition guidelines and two training sessions from Victor and Forest Young. A few things stuck with me from their slides:

> *"Small, real problems > huge, vague problems."*

That reframed everything. I wasn't trying to "fight misinformation" — that's too big, too vague. I was trying to help one person, in one moment, make a better decision about one claim they just saw online. If that scales, great. But the unit of impact is one person, one claim.

I also learned from the judges' rubric that impact matters more than technical sophistication. The question isn't "did you use AI?" It's "did your use of AI actually help someone?"

That led me to think about *why* AI is the right tool here specifically. Fact-checking a claim manually requires:
- Knowing which sources to trust
- Knowing how to evaluate evidence
- Having time to do it
- Already being skeptical enough to bother

Most people have none of those things in the moment they're reading a claim. An AI can do all four in seconds. That's the case for AI — not "AI is cool," but "AI removes friction from a thing people already want to do."

---

## Designing the Architecture

The core question was: what should the output look like?

A simple true/false answer felt wrong. I realized that an AI that just says "FALSE" teaches people to trust AI verdicts, not to think critically themselves. That's dependency, not literacy.

So the output became:
1. **A verdict** (true / false / misleading / unverifiable) — the quick answer
2. **A confidence score** — honest about uncertainty
3. **A claim breakdown** — the specific assertions, each evaluated separately
4. **An explanation** — *why* something is wrong, not just *that* it's wrong
5. **Real citations** — CDC, WHO, PubMed — so users can verify themselves

The political charge flag came from thinking carefully about where AI might be least reliable. On politically contested topics, the training data contains more conflicting viewpoints, which can cause AI to be inconsistent. Flagging it gives users a signal to apply extra scrutiny — it's honest design.

---

## Building It

I used React + TypeScript with Vite for the frontend. The AI backbone is Groq running Llama 4 Maverick — a fast, capable model that can handle structured JSON output reliably.

The hardest part wasn't the code. It was the system prompt.

I spent a long time thinking about how to instruct the AI. The key insight was: **calibration matters more than accuracy**. An AI that says "I'm not sure" when it's not sure is more trustworthy than one that's always confident. So I explicitly told the model:

> *"Never express false confidence. A 'low confidence' honest answer is better than a 'high confidence' wrong answer."*

I wanted MedCheck to model better behavior than typical AI tools — which often sound confident when they shouldn't.

The JSON output structure required careful design. I needed assertions (plural) because most health claims contain multiple factual statements bundled together. "Vaccines cause autism and damage the immune system" is two claims, not one. Breaking them apart forces precision.

---

## What I Learned

**On AI:** LLMs are not truth engines. They're pattern matchers trained on human text, which includes a lot of misinformation. The quality of the output depends enormously on how you ask the question. A poorly written prompt produces overconfident garbage. A carefully written prompt that asks the model to acknowledge uncertainty produces something much more useful.

**On design:** The hardest design decision was the disclaimer at the bottom: *"Not a substitute for medical advice."* I almost removed it because it felt like legal boilerplate. But I kept it because honesty about limitations is part of what makes a tool trustworthy. Users need to know what this can and can't do.

**On AI behavior:** Building this tool taught me a lot about how AI handles contested topics. Every time I tested a politically charged claim (vaccine mandates, COVID origins), I noticed the model would sometimes hedge more than on neutral claims — sometimes in the wrong direction. That's an interesting pattern worth understanding.

**On impact:** A tool like this is only useful if people use it. Right now it requires someone to already be skeptical enough to check a claim. The next version needs to go to where claims are — browsers, social media feeds, messaging apps. That's V2.

---

## The Bigger Picture

This project started as a competition entry. But it's grown into something I actually want to pursue further. The question of whether AI fact-checkers have systematic weaknesses on politically charged topics is something I want to explore more deeply — because if AI is being deployed at scale on social media platforms, understanding those weaknesses matters.

That's a question worth pursuing. And it started with a health claim checker I built in one night for a competition.

---

## The Build Iterations

After the first version was working, I didn't stop. I went through several feedback loops:

**Iteration 1** was about functionality — making the tool actually useful. I added history tracking (so you can review past checks), a share button (so results can spread), category tags (so you can see what domain a claim falls in), and the About page that explains how the tool works. The loading screen went from a simple spinner to an animated state that tells you what's happening.

**Iteration 2** was about context. The problem with a fact-checking tool is that people might not understand *why* this problem is worth solving. I added a stats bar with real numbers: 30M+ uninsured Americans affected, false claims spread 6x faster than corrections, 1 in 3 Americans have acted on unverified social media health advice. Now the scope of the problem is visible before you even check your first claim. I also added a pipeline flow diagram showing how the analysis works: claim decomposition → evidence synthesis → confidence calibration → source citations.

**Iteration 3** was about communicating the "why" more clearly. I added context to the About page explaining the political charge flag and the scale of the health misinformation problem. This matters for judges: it shows thoughtful design, not just technical execution.

**What I learned from iteration:**
Every version revealed something I hadn't thought of. The stats bar came from thinking "how do judges know why this problem matters?" The political charge explainer came from realizing judges might not understand what it means without context. The confidence score's design — showing low confidence on contested topics — came from realizing that false confidence is itself a form of misinformation. Good design is mostly iteration.

---

*David Xiao | ACP Student AI Championship 2026*
*Project: MedCheck — AI Health Misinformation Detector*
*SDG 3: Good Health & Well-Being | SDG 16: Peace, Justice & Strong Institutions*
*Live: https://medcheck-murex.vercel.app | Code: github.com/bobthebuilder-a11y/medcheck*
