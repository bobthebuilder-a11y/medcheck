# 🔬 MedCheck — AI Health Misinformation Detector

**[Live App →](https://medcheck-murex.vercel.app)**

> Paste any health claim, headline, or social media post. Get a structured, sourced verdict in seconds.

Built for the **ACP Student AI Championship 2026** | SDG 3 (Good Health) + SDG 16 (Peace & Strong Institutions)

---

## What It Does

MedCheck analyzes health claims against scientific consensus using AI. For any claim you enter:

- **Verdict** — TRUE / FALSE / MISLEADING / UNVERIFIABLE  
- **Confidence Score** — 0-100% honest calibration  
- **Claim Breakdown** — each assertion evaluated separately  
- **Plain-language explanation** — *why* it's wrong, not just *that* it is  
- **Real citations** — CDC, WHO, NIH, PubMed links  
- **Political Charge Flag** — warns when AI reliability may be lower  

## The Problem It Solves

| | The Problem |
|---|---|
| 📊 **6×** | False health claims spread faster than corrections on social media |
| 🏥 **30M+** | Americans making health decisions from unverified social media |
| 😟 **1 in 3** | Americans have acted on unverified health advice online |
| ⏱️ **3s vs 20min** | Time to read a false claim vs. manually fact-check it |

Existing fact-checkers require you to already be skeptical. MedCheck meets people where they are.

## Why AI Is the Right Tool

AI is the only tool fast enough and scalable enough to make this work:

- **Scale** — Millions of health claims posted daily. Humans can't keep up.
- **Decomposition** — Automatically breaks compound claims into individual assertions
- **Calibrated uncertainty** — Can express degrees of confidence, not just binary verdicts  
- **Evidence synthesis** — Cross-references CDC, WHO, NIH, PubMed simultaneously in seconds

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| AI Engine | Llama 4 (Groq API) |
| Styling | Tailwind CSS |
| Build | Vite |
| Deploy | Vercel |

## The Four Verdicts

| Verdict | Meaning |
|---|---|
| ✅ TRUE | Scientific evidence supports this claim |
| ❌ FALSE | Scientific evidence clearly contradicts this claim |
| ⚠️ MISLEADING | Partial truth, creates false overall impression |
| ❓ UNVERIFIABLE | Insufficient scientific consensus |

**MISLEADING is the most important verdict.** Most dangerous health misinformation isn't false — it's selectively true.

## Running Locally

```bash
git clone https://github.com/bobthebuilder-a11y/medcheck
cd medcheck
npm install
```

Create `.env.local`:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

```bash
npm run dev
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

## SDG Alignment

**SDG 3 — Good Health & Well-Being:** Health misinformation causes measurable harm — vaccine hesitancy, delayed diagnoses, dangerous self-treatment. Every accurate claim checked is a potential harm prevented.

**SDG 16 — Peace, Justice & Strong Institutions:** An informed public is necessary for functional health institutions. MedCheck builds media literacy rather than AI dependency — by explaining *why* a claim is false, users develop critical thinking skills.

## Key Design Decisions

**Honest confidence calibration** — The system prompt explicitly tells the AI: *"A low-confidence honest answer is better than a high-confidence wrong answer."* Low confidence verdicts are a feature, not a bug.

**Structured output** — The AI returns JSON with defined fields, not freeform text. This is what makes MedCheck a tool rather than a chatbot.

**Political charge detection** — Flags claims where science intersects with political controversy, signaling when AI reliability may be lower.

---

*Built by David Xiao | ACP Student AI Championship 2026*
