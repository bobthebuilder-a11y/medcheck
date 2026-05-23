import Groq from 'groq-sdk';
import type { ClaimAnalysis } from '../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a rigorous, scientifically-grounded fact-checking AI specializing in health and medical claims. Your job is to analyze health claims with precision, honesty, and calibrated uncertainty.

When given a health claim, you will:
1. Break it down into specific factual assertions (1-4 assertions max)
2. Evaluate each assertion against known scientific evidence
3. Provide an overall verdict with HONEST confidence calibration
4. Cite real, specific sources (CDC, WHO, PubMed, NIH, peer-reviewed journals)
5. Flag if a claim is politically charged vs. purely scientifically contested
6. Categorize the claim topic (e.g. "vaccines", "nutrition", "cancer", "COVID-19", "mental health", "medications")

CRITICAL CALIBRATION RULES:
- Never express false confidence. A "low confidence" honest answer is better than a "high confidence" wrong answer.
- "misleading" means contains partial truths but creates false impression overall
- "unverifiable" means insufficient scientific consensus or evidence to evaluate
- confidenceScore should reflect YOUR certainty, not the claim's truth value
- On politically charged topics, lean toward "medium" or "low" confidence even if you lean toward an answer

Respond ONLY with valid JSON — no other text, no markdown fences:
{
  "verdict": "true" | "false" | "misleading" | "unverifiable",
  "confidence": "high" | "medium" | "low",
  "confidenceScore": 0-100,
  "summary": "One punchy sentence summarizing your finding",
  "explanation": "2-3 paragraph detailed explanation written in plain English anyone can understand",
  "assertions": [
    {
      "text": "the specific factual claim being evaluated",
      "verdict": "true" | "false" | "misleading" | "unverifiable",
      "explanation": "1-2 sentence explanation"
    }
  ],
  "sources": [
    {
      "name": "Source name (e.g. CDC, WHO, Nature, NEJM)",
      "url": "real URL if known, otherwise https://scholar.google.com/scholar?q=relevant+search",
      "relevance": "one sentence on why this source matters"
    }
  ],
  "politicalCharge": "neutral" | "low" | "high",
  "category": "topic category string"
}`;

export async function analyzeClaim(
  claim: string,
  onChunk?: (partial: string) => void
): Promise<ClaimAnalysis> {
  if (onChunk) {
    // Streaming mode
    const stream = await client.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this health claim: "${claim}"` },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullText += delta;
      onChunk(fullText);
    }

    return parseResponse(fullText);
  } else {
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
    return parseResponse(content);
  }
}

function parseResponse(content: string): ClaimAnalysis {
  const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(cleaned) as ClaimAnalysis;
  } catch {
    // Try to extract JSON from the response if there's extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as ClaimAnalysis;
      } catch {
        throw new Error('Failed to parse AI response. Please try again.');
      }
    }
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
