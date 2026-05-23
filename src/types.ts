export interface ClaimAnalysis {
  verdict: 'true' | 'false' | 'misleading' | 'unverifiable';
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0-100
  summary: string;
  explanation: string;
  assertions: Assertion[];
  sources: Source[];
  politicalCharge: 'neutral' | 'low' | 'high';
  category?: string; // e.g. "vaccines", "nutrition", "cancer"
  extractedClaim?: string; // when input was a social media post
}

export interface Assertion {
  text: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverifiable';
  explanation: string;
}

export interface Source {
  name: string;
  url: string;
  relevance: string;
}

export interface HistoryEntry {
  id: string;
  claim: string;
  analysis: ClaimAnalysis;
  timestamp: number;
}
