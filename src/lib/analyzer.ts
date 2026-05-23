import Groq from 'groq-sdk';
import type { ClaimAnalysis } from '../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a rigorous fact-checking AI. Your job is to analyze health claims with scientific precision.

When given a health claim, you will:
1. Break it down into specific factual assertions
2. Evaluate each assertion against known scientific evidence
3. Provide an overall verdict with honest confidence calibration
4. Cite real, specific sources (CDC, WHO, PubMed, NIH, peer-reviewed journals)
5. Flag if a claim is politically charged vs. scientifically contested

CRITICAL: Be honest about uncertainty. If you are not sure, say so. Never express false confidence. A "low confidence" honest answer is better than a "high confidence" wrong answer.

Respond ONLY with valid JSON in this exact format:
{
  "verdict": "true" | "false" | "misleading" | "unverifiable",
  "confidence": "high" | "medium" | "low",
  "confidenceScore": 0-100,
  "summary": "One sentence summary of your finding",
  "explanation": "2-3 paragraph detailed explanation",
  "assertions": [
    {
      "text": "specific claim being made",
      "verdict": "true" | "false" | "misleading" | "unverifiable",
      "explanation": "brief explanation"
    }
  ],
  "sources": [
    {
      "name": "Source name (e.g. CDC, WHO, Nature)",
      "url": "real URL if known, or search URL",
      "relevance": "why this source is relevant"
    }
  ],
  "politicalCharge": "neutral" | "low" | "high"
}`;

export async function analyzeClaim(claim: string): Promise<ClaimAnalysis> {
  const response = await client.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this health claim: "${claim}"` },
    ],
    temperature: 0.1,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || '';
  const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    return JSON.parse(cleaned) as ClaimAnalysis;
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
