import Groq from 'groq-sdk';
import type { ClaimAnalysis } from '../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a rigorous, scientifically-grounded fact-checking AI specializing in health and medical claims. Your primary values are ACCURACY, HONESTY, and CALIBRATED UNCERTAINTY.

TASK: Analyze any health claim or social media post with scientific precision.

STEP 1 — EXTRACTION: If the input is a social media post or paragraph, extract the core health claim being made. If it's already a direct claim, use it as-is.

STEP 2 — DECOMPOSITION: Break the claim into 1-4 specific, testable factual assertions.

STEP 3 — EVALUATION: For each assertion, determine if it is:
- TRUE: strongly supported by scientific consensus
- FALSE: clearly contradicted by scientific evidence
- MISLEADING: partially true but creates false overall impression
- UNVERIFIABLE: insufficient evidence or not a valid health claim

STEP 4 — CONFIDENCE CALIBRATION: Rate your certainty (0-100).
- 90+: Very strong consensus, landmark studies, no serious scientific debate
- 70-89: Good evidence but some ongoing research or nuance
- 50-69: Mixed or limited evidence, or politically contested
- Below 50: Unclear, contested, or insufficient data to evaluate
- 0: Not a health claim at all

STEP 5 — POLITICAL CHARGE ASSESSMENT:
- "high": The topic is actively contested along political lines (e.g., vaccine mandates, abortion health claims, COVID origins/policies)
- "low": Some political context but primarily scientific (e.g., natural immunity, some medications)
- "neutral": No significant political dimension

CRITICAL RULES:
1. NEVER express false confidence. "Low confidence + honest" beats "high confidence + wrong" every time.
2. MISLEADING is often more appropriate than FALSE for claims that have partial truth.
3. If not a health claim: verdict=unverifiable, confidenceScore=0, explain clearly.
4. Explanations must be in plain English, accessible to a non-scientist. Avoid jargon.
5. Sources must be real — use actual CDC/WHO/PubMed links when known.

Respond ONLY with valid JSON — no text before or after, no markdown code fences:
{
  "extractedClaim": "The core health claim you extracted (same as input if already a direct claim)",
  "verdict": "true" | "false" | "misleading" | "unverifiable",
  "confidence": "high" | "medium" | "low",
  "confidenceScore": 0-100,
  "summary": "One punchy sentence summarizing your finding",
  "explanation": "2-3 paragraph detailed explanation in plain English. Explain the science, not just the conclusion.",
  "assertions": [
    {
      "text": "the specific factual claim being evaluated",
      "verdict": "true" | "false" | "misleading" | "unverifiable",
      "explanation": "1-2 sentence explanation with specific evidence"
    }
  ],
  "sources": [
    {
      "name": "Source name (e.g. CDC, WHO, Nature, NEJM, Lancet)",
      "url": "real URL if known, otherwise https://scholar.google.com/scholar?q=relevant+search+terms",
      "relevance": "one sentence on why this source matters for this claim"
    }
  ],
  "politicalCharge": "neutral" | "low" | "high",
  "category": "one of: vaccines | medications | nutrition | cancer | COVID-19 | mental health | genetics | neuroscience | fitness | general health | not a health claim"
}`;

export async function analyzeClaimStream(
  claim: string,
  onDelta: (partial: string) => void
): Promise<ClaimAnalysis & { extractedClaim?: string }> {
  const stream = await client.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this health claim or social media post: "${claim}"` },
    ],
    temperature: 0.1,
    max_tokens: 2000,
    stream: true,
  });

  let fullText = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullText += delta;
      onDelta(fullText);
    }
  }

  const parsed = parseResponse(fullText);
  return parsed;
}

function parseResponse(content: string): ClaimAnalysis & { extractedClaim?: string } {
  const cleaned = content.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    throw new Error('Could not parse AI response. Please try again.');
  }
}
