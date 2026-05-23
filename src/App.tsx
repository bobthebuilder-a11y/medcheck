import { useState, useEffect, useRef } from 'react';
import { analyzeClaimStream } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import HistoryPanel from './components/HistoryPanel';
import StatsBar from './components/StatsBar';
import type { ClaimAnalysis, HistoryEntry } from './types';

const STORAGE_KEY = 'medcheck_history';

function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveHistory(h: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 20)));
}

type Phase = 'idle' | 'streaming' | 'done' | 'error';

const LOADING_STEPS = [
  'Decomposing claim into assertions...',
  'Cross-referencing scientific literature...',
  'Evaluating against CDC & WHO guidelines...',
  'Calibrating confidence scores...',
  'Generating citations...',
  'Finalizing analysis...',
];

export default function App() {
  const [claim, setClaim] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<ClaimAnalysis | null>(null);
  const [error, setError] = useState('');
  const [lastClaim, setLastClaim] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [activeTab, setActiveTab] = useState<'check' | 'about'>('check');
  const [loadingStep, setLoadingStep] = useState(0);
  const [streamText, setStreamText] = useState('');
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { saveHistory(history); }, [history]);

  // Cycle through loading steps during streaming
  useEffect(() => {
    if (phase === 'streaming') {
      setLoadingStep(0);
      stepTimerRef.current = setInterval(() => {
        setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1));
      }, 1400);
    } else {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }
    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current); };
  }, [phase]);

  const handleAnalyze = async (claimText?: string) => {
    const target = (claimText ?? claim).trim();
    if (!target || phase === 'streaming') return;

    setPhase('streaming');
    setError('');
    setResult(null);
    setLastClaim(target);
    setStreamText('');

    try {
      const analysis = await analyzeClaimStream(target, (partial) => {
        setStreamText(partial);
      });

      setResult(analysis);
      setPhase('done');

      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        claim: target,
        analysis,
        timestamp: Date.now(),
      };
      setHistory(prev => [entry, ...prev.filter(e => e.claim !== target)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setResult(null);
    setClaim('');
    setLastClaim('');
    setError('');
    setStreamText('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setClaim(entry.claim);
    setLastClaim(entry.claim);
    setResult(entry.analysis);
    setPhase('done');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      {/* Sticky navbar */}
      <nav className="border-b border-gray-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <span className="font-black text-gray-900 text-lg tracking-tight">MedCheck</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">BETA</span>
            <span className="hidden sm:inline text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Research Project</span>
          </div>
          <div className="flex items-center gap-1">
            {(['check', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-lg font-semibold capitalize transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}>
                {tab === 'check' ? '🔍 Check' : 'ℹ️ About'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {activeTab === 'check' && (
          <>
            {/* Hero */}
            {phase === 'idle' && (
              <div className="text-center mb-7">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                  Is that health claim true?
                </h1>
                <p className="text-gray-500 text-base mb-5">
                  AI-powered analysis aligned with CDC, WHO & peer-reviewed science
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
                  {['Claim decomposition', 'Evidence synthesis', 'Confidence calibration', 'Source citations'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      {i > 0 && <span className="text-gray-300 hidden sm:inline">→</span>}
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg font-medium text-gray-500 shadow-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input card */}
            <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 p-5 mb-5 ${
              phase === 'streaming' ? 'border-blue-400 shadow-md shadow-blue-100' :
              phase === 'done' ? 'border-gray-200' : 'border-gray-200 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-50'
            }`}>
              <textarea
                ref={textareaRef}
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze();
                }}
                placeholder="Paste a health claim, headline, or full social media post — AI will extract and check the claim..."
                rows={3}
                disabled={phase === 'streaming'}
                className="w-full border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
              />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-3">
                  {claim.length > 0 && phase !== 'streaming' && (
                    <span className="text-xs text-gray-400">{claim.length} chars</span>
                  )}
                  {phase === 'streaming' && (
                    <span className="text-xs text-blue-500 font-medium animate-pulse">Analyzing...</span>
                  )}
                  {phase !== 'streaming' && (
                    <span className="text-xs text-gray-400 hidden sm:inline">⌘+Enter to analyze</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {(phase === 'done' || phase === 'error') && (
                    <button onClick={handleReset}
                      className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-xl text-sm font-medium transition-colors">
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => handleAnalyze()}
                    disabled={phase === 'streaming' || !claim.trim()}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                  >
                    {phase === 'streaming' ? (
                      <><span className="inline-block animate-spin">⟳</span> Analyzing</>
                    ) : 'Analyze →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Examples (only when idle) */}
            {phase === 'idle' && (
              <div className="mb-6">
                <ExampleClaims onSelect={(c) => { setClaim(c); handleAnalyze(c); }} />
              </div>
            )}

            {/* Loading state */}
            {phase === 'streaming' && (
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-8 text-center mb-5">
                <div className="text-4xl mb-4">
                  <span className="inline-block animate-bounce">🔬</span>
                </div>
                <p className="text-gray-800 font-semibold text-base mb-1">Analyzing your claim</p>
                <p className="text-sm text-blue-500 font-medium mb-5 transition-all">
                  {LOADING_STEPS[loadingStep]}
                </p>
                <div className="flex justify-center gap-1.5 mb-5">
                  {LOADING_STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= loadingStep ? 'bg-blue-500 w-8' : 'bg-gray-200 w-4'
                    }`} />
                  ))}
                </div>
                {streamText.length > 20 && (
                  <div className="bg-gray-50 rounded-xl p-3 text-left text-xs text-gray-400 font-mono max-h-16 overflow-hidden">
                    {streamText.slice(-120)}
                    <span className="animate-pulse">▊</span>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {phase === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="text-red-700 text-sm font-semibold">Analysis failed</p>
                    <p className="text-red-600 text-sm mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {phase === 'done' && result && (
              <div className="space-y-4">
                <ResultCard analysis={result} claim={lastClaim} />
                <button onClick={handleReset}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 text-sm font-semibold transition-colors">
                  + Check another claim
                </button>
              </div>
            )}

            {/* Research callout (idle only) */}
            {phase === 'idle' && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🔭</span>
                  <div>
                    <p className="text-sm font-bold text-purple-900 mb-1">This is more than an app</p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      MedCheck is the foundation for a research paper investigating whether AI systems
                      exhibit measurable bias when evaluating politically charged health claims.
                      Built for <strong>ACP Student AI Championship 2026</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {phase !== 'streaming' && (
              <div className="mt-6">
                <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-5">
            <StatsBar />

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">What is MedCheck?</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  MedCheck is an AI-powered health misinformation detector. It analyzes any health claim,
                  breaks it into individual assertions, checks each against scientific consensus, and returns
                  a calibrated verdict with honest confidence scores and real source citations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-widest text-gray-500">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: '🔍', title: 'Claim Decomposition', desc: 'Breaks compound claims into individual factual assertions — each evaluated separately.' },
                    { icon: '📚', title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed, and peer-reviewed literature simultaneously.' },
                    { icon: '⚖️', title: 'Calibrated Confidence', desc: 'Honest uncertainty quantification. The AI says "I\'m not sure" when it isn\'t — a 0% confidence is a feature, not a bug.' },
                    { icon: '⚡', title: 'Political Charge Detection', desc: 'Flags claims where science intersects with political controversy. Connected to our ongoing research on AI bias.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-bold text-purple-900 mb-2 text-sm">🔭 The Research Layer</h3>
                <p className="text-sm text-purple-700 leading-relaxed">
                  <strong>Research question:</strong> Do LLMs exhibit higher rates of confident-but-wrong verdicts on politically charged health claims compared to neutral ones?
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  150 labeled claims · 3 AI models (Claude, GPT-4, Llama) · Professor mentorship · Target: Journal of Emerging Investigators
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  ⚕️ <strong>Medical Disclaimer:</strong> MedCheck is for educational purposes only and is not a substitute for professional medical advice. Confidence scores reflect AI certainty. Always verify citations independently and consult qualified healthcare professionals for medical decisions.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Built by David Xiao</p>
                  <p className="text-xs text-gray-400">ACP Student AI Championship 2026 · SDG 3 & SDG 16</p>
                </div>
                <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-semibold">
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-gray-600">🔬 MedCheck · Built by David Xiao</p>
            <p className="text-xs text-gray-400 mt-0.5">ACP Student AI Championship 2026 · SDG 3 & SDG 16</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium">GitHub</a>
            <span>·</span>
            <span>Powered by Llama 4 via Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
