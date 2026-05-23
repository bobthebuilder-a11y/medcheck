import { useState, useEffect, useRef } from 'react';
import { analyzeClaimStream } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import HistoryPanel from './components/HistoryPanel';
import StatsBar from './components/StatsBar';
import SessionStats from './components/SessionStats';
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
  const [, setStreamText] = useState('');
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

    // Minimum length guard
    if (target.length < 5) {
      setError('Please enter a full health claim (at least a few words).');
      setPhase('error');
      return;
    }

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
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      // Make error messages more user-friendly
      if (msg.includes('parse') || msg.includes('JSON')) {
        setError('The AI returned an unexpected response. Please try again.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(msg + ' Please try again.');
      }
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #eef4ff 0%, #f9fafb 45%, #f3f0ff 100%)' }}>

      {/* Sticky navbar */}
      <nav className="border-b border-gray-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <span className="font-black text-gray-900 text-lg tracking-tight">MedCheck</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">BETA</span>
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
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  ACP Student AI Championship 2026 · SDG 3 & 16
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
                  Is that health claim<br className="hidden sm:block" /> actually true?
                </h1>
                <p className="text-gray-500 text-base mb-5 max-w-md mx-auto leading-relaxed">
                  Paste any health claim, headline, or social media post.<br className="hidden sm:block" />
                  Get a structured, sourced verdict in seconds.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { icon: '🔍', label: 'Claim decomposition' },
                    { icon: '📚', label: 'Evidence synthesis' },
                    { icon: '⚖️', label: 'Confidence calibration' },
                    { icon: '📎', label: 'Source citations' },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2">
                      {i > 0 && <span className="text-gray-300 text-xs hidden sm:inline">→</span>}
                      <span className="bg-white border border-gray-200 px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-600 shadow-sm flex items-center gap-1.5">
                        <span>{step.icon}</span>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input card */}
            <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 p-5 mb-5 ${
              phase === 'streaming' ? 'border-blue-400 shadow-blue-100 shadow-md' :
              phase === 'done' ? 'border-gray-200' :
              'border-gray-200 focus-within:border-blue-500 focus-within:shadow-md focus-within:shadow-blue-50'
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
                    <span className="text-xs text-gray-400">
                      {claim.length > 200 ? '📄 Long post detected' : `${claim.length} chars`}
                    </span>
                  )}
                  {phase === 'streaming' && (
                    <span className="text-xs text-blue-500 font-medium animate-pulse">Analyzing...</span>
                  )}
                  {phase === 'idle' && claim.length === 0 && (
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
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden mb-5">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl animate-bounce">🔬</span>
                    <div>
                      <p className="font-bold text-sm">Analyzing your claim</p>
                      <p className="text-xs text-blue-200">Cross-referencing scientific literature...</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full">
                    <div
                      className="h-1.5 bg-white rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-2.5">
                    {LOADING_STEPS.map((step, i) => (
                      <div key={step} className={`flex items-center gap-3 transition-all duration-300 ${
                        i < loadingStep ? 'opacity-50' :
                        i === loadingStep ? 'opacity-100' :
                        'opacity-30'
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          i < loadingStep ? 'bg-blue-500 text-white' :
                          i === loadingStep ? 'bg-blue-100 border-2 border-blue-500' :
                          'bg-gray-100 border border-gray-200'
                        }`}>
                          {i < loadingStep ? '✓' : i === loadingStep ? <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse block" /> : ''}
                        </div>
                        <span className={`text-sm ${i === loadingStep ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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
                <ResultCard analysis={result} claim={lastClaim} onReset={handleReset} />
                <div className="flex gap-3">
                  <button onClick={handleReset}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 text-sm font-semibold transition-all hover:bg-blue-50">
                    + Check another claim
                  </button>
                  <button onClick={() => { handleReset(); setActiveTab('about'); }}
                    className="px-4 py-3 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 text-sm transition-colors hover:bg-gray-50"
                    title="Learn about MedCheck">
                    ℹ️
                  </button>
                </div>
              </div>
            )}



            {/* Session stats + History */}
            {phase !== 'streaming' && history.length > 0 && (
              <div className="mt-6 space-y-4">
                <SessionStats history={history} />
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
                  a structured verdict with honest confidence scores and real source citations — in seconds.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mt-2">
                  Built to address a real problem: false health claims spread 6× faster than corrections,
                  and most fact-checkers require you to already be skeptical. MedCheck meets people where they are.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '✅', label: 'TRUE', desc: 'Supported by evidence', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                  { icon: '❌', label: 'FALSE', desc: 'Contradicted by evidence', color: 'border-red-200 bg-red-50 text-red-700' },
                  { icon: '⚠️', label: 'MISLEADING', desc: 'Partial truth, false impression', color: 'border-amber-200 bg-amber-50 text-amber-700' },
                  { icon: '❓', label: 'UNVERIFIABLE', desc: 'Insufficient consensus', color: 'border-gray-200 bg-gray-50 text-gray-600' },
                ].map(v => (
                  <div key={v.label} className={`border rounded-xl p-3 ${v.color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{v.icon}</span>
                      <span className="font-bold text-xs tracking-wide">{v.label}</span>
                    </div>
                    <p className="text-xs opacity-80">{v.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-widest text-gray-500">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: '🔍', title: 'Claim Decomposition', desc: 'Breaks compound claims into individual factual assertions — each evaluated separately.' },
                    { icon: '📚', title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed, and peer-reviewed literature simultaneously.' },
                    { icon: '⚖️', title: 'Calibrated Confidence', desc: 'Honest uncertainty quantification. The AI says "I\'m not sure" when it isn\'t — a 0% confidence is a feature, not a bug.' },
                    { icon: '⚡', title: 'Political Charge Detection', desc: 'Flags claims where science intersects with political controversy — a signal to apply extra scrutiny and verify independently.' },
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



              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-widest text-gray-500">Example Output</h3>
                <div className="rounded-xl border-2 border-red-300 overflow-hidden text-sm">
                  <div className="bg-red-500 px-4 py-3 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">❌</span>
                      <span className="font-black tracking-widest">FALSE</span>
                    </div>
                    <div className="text-xs text-white/80">High Confidence · 95%</div>
                    <div className="h-1 bg-white/20 rounded-full mt-2">
                      <div className="h-1 bg-white/80 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div className="bg-red-50 px-4 py-3 space-y-2">
                    <p className="text-xs text-gray-500 italic">"Vaccines cause autism"</p>
                    <p className="text-xs font-semibold text-red-800">This claim is definitively false — large-scale studies involving millions of children find no link between vaccines and autism.</p>
                    <div className="flex gap-2 pt-1">
                      <span className="text-xs bg-white border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-medium">vaccines</span>
                      <span className="text-xs text-gray-400">2 assertions checked · 3 sources cited</span>
                    </div>
                  </div>
                </div>
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
      <footer className="border-t border-gray-200 bg-white/70 mt-16">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-base">🔬</span>
            <div>
              <p className="text-xs font-bold text-gray-700">MedCheck · Built by David Xiao</p>
              <p className="text-xs text-gray-400 mt-0.5">ACP Student AI Championship 2026 · SDG 3 & SDG 16</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-blue-600 transition-colors font-semibold flex items-center gap-1">
              <span>⌥</span> GitHub
            </a>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">Llama 4 via Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
