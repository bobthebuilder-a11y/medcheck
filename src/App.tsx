import { useState, useEffect } from 'react';
import { analyzeClaim } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import HistoryPanel from './components/HistoryPanel';
import StatsBar from './components/StatsBar';
import type { ClaimAnalysis, HistoryEntry } from './types';

const STORAGE_KEY = 'medcheck_history';

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export default function App() {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimAnalysis | null>(null);
  const [error, setError] = useState('');
  const [lastClaim, setLastClaim] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [activeTab, setActiveTab] = useState<'check' | 'about'>('check');

  useEffect(() => { saveHistory(history); }, [history]);

  const handleAnalyze = async (claimText?: string) => {
    const target = (claimText || claim).trim();
    if (!target) return;
    setLoading(true);
    setError('');
    setResult(null);
    setLastClaim(target);
    setClaim(target);

    try {
      const analysis = await analyzeClaim(target);
      setResult(analysis);
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        claim: target,
        analysis,
        timestamp: Date.now(),
      };
      setHistory(prev => [entry, ...prev.filter(e => e.claim !== target)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setClaim(entry.claim);
    setLastClaim(entry.claim);
    setResult(entry.analysis);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Top nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <span className="font-black text-gray-900 text-lg tracking-tight">MedCheck</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">BETA</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold hidden sm:inline">Research Project</span>
          </div>
          <div className="flex items-center gap-1">
            {(['check', 'about'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab === 'check' ? '🔍 Check' : 'ℹ️ About'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {activeTab === 'check' && (
          <>
            {/* Hero text */}
            {!result && !loading && (
              <div className="text-center mb-6">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                  Is that health claim true?
                </h1>
                <p className="text-gray-500 mb-6">
                  AI-powered analysis aligned with CDC, WHO & peer-reviewed science
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-gray-400">
                  {['Claim decomposition', 'Evidence synthesis', 'Confidence calibration', 'Source citations'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      {i > 0 && <span className="text-gray-300 hidden sm:inline">→</span>}
                      <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg font-medium text-gray-500">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5 focus-within:border-blue-400 focus-within:shadow-md transition-all">
              <textarea
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze();
                }}
                placeholder="Paste any health claim, headline, or social media post..."
                rows={3}
                className="w-full px-0 py-0 border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <span className="text-xs text-gray-400">
                  {claim.length > 0 ? `${claim.length} characters` : '⌘+Enter to analyze'}
                </span>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !claim.trim()}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze →</>
                  )}
                </button>
              </div>
            </div>

            {/* Examples */}
            {!result && !loading && (
              <div className="mb-6">
                <ExampleClaims onSelect={(c) => { setClaim(c); }} />
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <div className="text-4xl mb-4 animate-pulse">🔬</div>
                <p className="text-gray-700 font-semibold text-lg mb-1">Analyzing claim...</p>
                <p className="text-sm text-gray-400">Cross-referencing CDC, WHO, and scientific literature</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className="space-y-4">
                <ResultCard analysis={result} claim={lastClaim} />
                <button
                  onClick={() => { setResult(null); setClaim(''); setLastClaim(''); }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 text-sm font-semibold transition-colors"
                >
                  + Check another claim
                </button>
              </div>
            )}

            {/* Research callout */}
            {!loading && !result && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🔭</span>
                  <div>
                    <p className="text-sm font-bold text-purple-900 mb-1">This is more than an app</p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      MedCheck is also the foundation for a research paper investigating whether AI systems
                      show measurable bias when evaluating politically charged health claims. Built for the
                      <strong> ACP Student AI Championship 2026</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {!loading && (
              <div className="mt-6">
                <HistoryPanel
                  history={history}
                  onSelect={handleHistorySelect}
                  onClear={() => setHistory([])}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <StatsBar />

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-2">What is MedCheck?</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                MedCheck is an AI-powered health misinformation detector built for the 2026 ACP Student AI Championship. 
                It analyzes health claims against scientific consensus, providing structured verdicts with honest confidence 
                calibration and real source citations.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-3">How It Works</h3>
              <div className="space-y-3">
                {[
                  { icon: '📝', title: 'Claim Decomposition', desc: 'The AI breaks compound claims into individual factual assertions, each evaluated separately.' },
                  { icon: '🔍', title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed, and peer-reviewed literature.' },
                  { icon: '⚖️', title: 'Calibrated Confidence', desc: 'Honest uncertainty quantification — the AI says "I\'m not sure" when it isn\'t.' },
                  { icon: '⚡', title: 'Political Charge Detection', desc: 'Flags claims where science intersects with political controversy for extra scrutiny.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">The Research Behind This</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This project is the foundation for a research paper investigating whether AI systems show 
                measurable bias in confidence calibration on politically charged health topics compared to 
                neutral ones. If AI fact-checkers are confidently wrong on contested topics, they may 
                amplify — not reduce — misinformation at scale.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-800 font-medium">
                ⚕️ <strong>Important:</strong> MedCheck is for educational purposes only. It is not a substitute 
                for medical advice. Always consult qualified healthcare professionals. Confidence scores reflect 
                AI certainty and should not be treated as definitive truth.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Built by David Xiao</p>
                <p className="text-xs text-gray-400">ACP Student AI Championship 2026 · SDG 3 & 16</p>
              </div>
              <a
                href="https://github.com/bobthebuilder-a11y/medcheck"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
