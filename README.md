# 🔬 MedCheck — AI Health Misinformation Detector

**[Live App →](https://medcheck-murex.vercel.app)**

> Paste any health claim, headline, or social media post. Get a structured, sourced verdict in seconds.

Built for the **ACP Student AI Championship 2026** | SDG 3 (Good Health) + SDG 16 (Peace & Strong Institutions)

---

## What It Does

MedCheck analyzes health claims against scientific consensus using AI:

| Feature | Description |
|---|---|
| 🔍 **Single Claim Analysis** | Paste any claim → structured verdict with confidence, assertions, citations |
| 📋 **Batch Mode** | Check up to 5 claims simultaneously (⌘+B) |
| 📱 **Social Media Posts** | Paste a full viral post → AI extracts and checks the core health claim |
| 🔥 **Trending Claims** | Pre-verified common misinformation with instant re-analysis |
| 📊 **Session Stats** | Verdict distribution and confidence averages across your session |
| 📥 **Export Reports** | Download your session as a formatted fact-check report |
| 🐦 **Twitter Share** | Share fact-checks directly to Twitter/X |

## The Four Verdicts

| Verdict | Meaning |
|---|---|
| ✓ **SCIENTIFICALLY SUPPORTED** | Scientific evidence supports this claim |
| ✗ **FALSE** | Scientific evidence clearly contradicts this claim |
| ⚠ **MISLEADING** | Partial truth, creates false overall impression |
| ? **UNVERIFIABLE** | Insufficient scientific consensus |

**MISLEADING is the most important verdict.** Most dangerous misinformation isn't false — it's selectively true.

## The Problem

| Stat | Detail |
|---|---|
| **6×** | False health claims spread 6× faster than corrections |
| **30M+** | Americans making health decisions from unverified social media |
| **1 in 3** | Americans have acted on unverified health advice |

## Tech Stack

| | |
|---|---|
| Frontend | React + TypeScript + Vite |
| AI Engine | Llama 4 via Groq API |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## Key Design Decisions

**Honest confidence calibration** — The AI is explicitly instructed: *"A low-confidence honest answer is better than a high-confidence wrong answer."*

**Structured output** — Returns JSON with defined fields, not freeform text. This is what makes MedCheck a tool rather than a chatbot.

**Political charge detection** — Flags claims where science intersects with political controversy, signaling when extra scrutiny is needed.

## Running Locally

```bash
git clone https://github.com/bobthebuilder-a11y/medcheck
cd medcheck
npm install
echo "VITE_GROQ_API_KEY=your_key" > .env.local
npm run dev
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

## Keyboard Shortcuts

| Key | Action |
|---|---|
| ⌘+Enter | Analyze current claim |
| Escape | Clear result |
| ⌘+B | Open Batch Mode |

---

*Built by David Xiao | ACP Student AI Championship 2026*
