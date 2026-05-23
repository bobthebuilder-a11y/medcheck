# ACP Submission — Short Answer Drafts
## Preliminary Submission · Due May 23, 11:59 PM CST

---

## Required Materials

**GitHub repo:** https://github.com/bobthebuilder-a11y/medcheck
**Live app:** https://medcheck-murex.vercel.app

---

## Short Answer Questions

*(These are likely on the submission form — adapt as needed based on exact questions)*

### Q1: What problem does your project solve?

Health misinformation is a public health crisis. False health claims spread six times faster than corrections on social media, and most existing fact-checkers require you to already be skeptical enough to search for them. When someone reads "vaccines cause autism" in a viral post, they aren't going to pause and Google it — they move on.

MedCheck closes that gap. It's an AI tool that analyzes any health claim in real time — breaking it into individual assertions, evaluating each against scientific consensus from CDC, WHO, and peer-reviewed literature, and returning a structured verdict with honest confidence scores and real source citations. The goal is to give anyone the ability to fact-check a health claim in the same time it takes to read it.

---

### Q2: How does your project use AI?

AI is the core of MedCheck, not a decoration. The tool uses a large language model (Llama 4, via Groq) with a carefully engineered system prompt designed specifically for structured health claim analysis.

The key innovation is not just calling an AI API — it's the prompt engineering. The system prompt instructs the model to: (1) decompose compound claims into individual assertions, (2) evaluate each assertion separately, (3) calibrate confidence honestly ("a low-confidence honest answer is better than a high-confidence wrong answer"), (4) return structured JSON with verdicts, confidence scores, assertions, sources, and political charge classification.

This structured output is what makes MedCheck a tool rather than a chatbot. The AI does the core intellectual work: finding relevant evidence, weighing it, and synthesizing a verdict — tasks that require exactly the pattern matching and knowledge synthesis that LLMs are trained for.

---

### Q3: What is the impact and which SDG does it address?

MedCheck addresses SDG 3 (Good Health and Well-Being) and SDG 16 (Peace, Justice, and Strong Institutions).

For SDG 3: Health misinformation causes measurable harm — vaccine hesitancy, delayed diagnoses, dangerous self-treatment. Every person who fact-checks a claim before acting on it is a potential harm prevented. MedCheck is free, requires no installation, and works on any device — making it accessible to everyone regardless of income or technical background.

For SDG 16: Functioning public health institutions depend on an informed public. When people make health decisions based on false information, it undermines public health policy at scale. MedCheck builds media literacy rather than AI dependency — by explaining *why* a claim is false (not just *that* it is), users develop their own critical thinking skills.

The scale path: V1 (web app) → V2 (browser extension, flags claims automatically while browsing) → V3 (open-source API for newsrooms and public health organizations). The browser extension alone could help millions of people who would never think to seek out a fact-checker.

---

## AI Involvement Disclosure

*(Required by the submission form)*

Generative AI was used extensively in the development of this project:

- **Claude (Anthropic)** served as a coding assistant throughout the build process, helping write React components, debug TypeScript errors, and refine the system prompt
- **The project itself** uses Llama 4 (via Groq API) as its core AI engine
- The system prompt — the most critical part of the application — was iterated through many versions to optimize for structured output, honest confidence calibration, and political charge detection
- The development process itself (building an AI app with AI assistance) is part of the story: AI was used as a tool at every stage, which directly informed our understanding of AI's strengths and limitations

We believe in full transparency about AI involvement. MedCheck was built *using* AI and *about* AI — that recursive relationship is intentional and worth discussing.

---

## Presentation Time Slot Sign-Up

Link from submission doc: https://docs.google.com/spreadsheets/d/1Xuk5otRqGs4T8rEcG_KK7cLWU9E_TLpfso_Mj6OvdhM/edit

Sign up for a 4-6 minute slot (High School group).
