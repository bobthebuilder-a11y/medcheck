import { useState } from 'react';
import { analyzeClaim } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import type { ClaimAnalysis } from './types';

export default function App() {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimAnalysis | null>(null);
  const [error, setError] = useState('');
  const [lastClaim, setLastClaim] = useState('');

  const handleAnalyze = async () => {
    if (!claim.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setLastClaim(claim.trim());
    try {
      const analysis = await analyzeClaim(claim.trim());
      setResult(analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🔬</div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">MedCheck</h1>
          <p className="text-gray-500 mt-2 text-lg">AI-powered health misinformation detector</p>
          <p className="text-xs text-gray-400 mt-1">Powered by AI • Aligned with CDC, WHO & PubMed</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter a health claim to analyze
          </label>
          <textarea
            value={claim}
            onChange={e => setClaim(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.metaKey) handleAnalyze();
            }}
            placeholder="e.g. 'Vaccines cause autism' or paste a social media post..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">⌘ + Enter to analyze</span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !claim.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Claim →'}
            </button>
          </div>
        </div>

        {/* Examples */}
        {!result && !loading && (
          <div className="mb-6">
            <ExampleClaims onSelect={c => { setClaim(c); }} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="text-3xl mb-3 animate-pulse">🔬</div>
            <p className="text-gray-600 font-medium">Analyzing claim...</p>
            <p className="text-xs text-gray-400 mt-1">Cross-referencing CDC, WHO, and scientific literature</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-4">
            <ResultCard analysis={result} claim={lastClaim} />
            <button
              onClick={() => { setResult(null); setClaim(''); }}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Check another claim
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-gray-400 space-y-1">
          <p>Built for the ACP Student AI Championship 2026 • SDG 3 & SDG 16</p>
          <p>Not a substitute for medical advice. For educational purposes only.</p>
        </div>
      </div>
    </div>
  );
}
