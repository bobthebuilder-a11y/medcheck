import Groq from 'groq-sdk';
import type { ClaimAnalysis } from '../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a rigorous, scientifically-grounded fact-checking AI specializing in health and medical claims. Your job is to analyze health claims with precision, honesty, and calibrated uncertainty.

When given a health claim or social media post containing health claims:
1. Extract the core health claim(s) if it's a social media post
2. Break it down into specific factual assertions (1-4 max)
3. Evaluate each assertion against known scientific evidence
4. Provide an overall verdict with HONEST confidence calibration
5. Cite real, specific sources (CDC, WHO, PubMed, NIH, peer-reviewed journals)
6. Flag if a claim is politically charged vs. purely scientifically contested
7. Categorize the claim topic

If the input is not a health claim (gibberish, off-topic, clearly not health-related), return verdict "unverifiable" with confidenceScore 0 and explain it's not a valid health claim.

CRITICAL CALIBRATION RULES:
- Never express false confidence. A "low confidence" honest answer is better than a "high confidence" wrong answer.
- "misleading" = contains partial truths but creates false impression overall
- "unverifiable" = insufficient scientific consensus OR not a valid health claim
- confidenceScore reflects YOUR certainty, not the claim's truth value
- On politically charged topics, lean toward medium confidence

Respond ONLY with valid JSON — no other text, no markdown, no preamble:
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
