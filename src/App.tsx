import { useState, useEffect, useRef } from 'react';
import { analyzeClaimStream } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import HistoryPanel from './components/HistoryPanel';
import SessionStats from './components/SessionStats';
import RelatedClaims from './components/RelatedClaims';
import BatchChecker from './components/BatchChecker';
import TrendingClaims from './components/TrendingClaims';
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
  'Extracting core health claim...',
  'Decomposing into individual assertions...',
  'Cross-referencing CDC & WHO guidelines...',
  'Evaluating scientific evidence...',
  'Calibrating confidence scores...',
  'Compiling citations and verdict...',
];

export default function App() {
  const [claim, setClaim] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<ClaimAnalysis | null>(null);
  const [error, setError] = useState('');
  const [lastClaim, setLastClaim] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [activeTab, setActiveTab] = useState<'check' | 'about'>('check');
  const [showBatch, setShowBatch] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [, setStreamText] = useState('');
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { saveHistory(history); }, [history]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'done') {
        setPhase('idle'); setResult(null); setClaim(''); setLastClaim(''); setError('');
      }
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowBatch(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase]);

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
    if (target.length < 5) { setError('Please enter a full health claim.'); setPhase('error'); return; }
    if (/^https?:\/\//i.test(target)) { setError('Please paste the claim text, not a URL.'); setPhase('error'); return; }

    setPhase('streaming'); setError(''); setResult(null); setLastClaim(target); setStreamText('');

    try {
      const analysis = await analyzeClaimStream(target, (p) => setStreamText(p));
      setResult(analysis); setPhase('done');
      const entry: HistoryEntry = { id: `${Date.now()}`, claim: target, analysis, timestamp: Date.now() };
      setHistory(prev => [entry, ...prev.filter(e => e.claim !== target)]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      setError(msg.includes('parse') || msg.includes('JSON') ? 'Unexpected AI response. Please try again.' :
               msg.includes('network') || msg.includes('fetch') ? 'Network error. Check your connection.' :
               'Analysis failed. Please try again.');
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('idle'); setResult(null); setClaim(''); setLastClaim(''); setError(''); setStreamText('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setClaim(entry.claim); setLastClaim(entry.claim); setResult(entry.analysis);
    setPhase('done'); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen page-bg">
      {showBatch && <BatchChecker onClose={() => setShowBatch(false)} />}

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-slate-800" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm text-white text-lg">🔬</div>
            <div>
              <span className="font-black text-white text-base tracking-tight block leading-tight">MedCheck</span>
              <span className="text-[9px] text-slate-500 leading-none hidden sm:block">AI Health Fact-Checker</span>
            </div>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setShowBatch(true)}
              className="px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all hidden sm:block"
              title="Check multiple claims at once">
              Batch
            </button>
            {(['check', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                {tab === 'check' ? 'Analyze' : 'About'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">

        {activeTab === 'check' && (
          <>
            {/* Header (idle only) */}
            {phase === 'idle' && (
              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 mb-1 leading-tight">Verify a health claim.</h1>
                <p className="text-sm text-slate-400">AI-powered · Cross-references CDC, WHO & peer-reviewed science</p>
              </div>
            )}

            {/* Input */}
            <div className={`bg-white rounded-xl border-2 transition-all duration-150 p-4 mb-4 ${
              phase === 'streaming' ? 'border-blue-500 shadow-md shadow-blue-50/50' :
              phase === 'done' ? 'border-slate-200 shadow-sm' :
              'border-slate-200 shadow-sm focus-within:border-blue-500 focus-within:shadow-md focus-within:shadow-blue-50/50'
            }`}>
              <textarea
                ref={textareaRef}
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
                placeholder="Enter a health claim, headline, or paste a social media post..."
                rows={3}
                disabled={phase === 'streaming'}
                className="w-full border-0 text-base text-slate-800 placeholder-slate-300 focus:outline-none resize-none leading-relaxed disabled:opacity-60 bg-transparent"
              />
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-5">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  {phase === 'streaming' ? (
                    <><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>Analyzing...</>
                  ) : phase === 'done' ? (
                    <><span className="text-emerald-500">✓</span> Result ready</>
                  ) : claim.length > 200 ? (
                    <><span>📄</span>Long post detected — AI will extract the claim</>
                  ) : claim.length > 0 ? (
                    `${claim.length} chars`
                  ) : (
                    <span className="hidden sm:inline">⌘+Enter to analyze</span>
                  )}
                </span>
                <div className="flex gap-2">
                  {(phase === 'done' || phase === 'error') && (
                    <button onClick={handleReset}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg">
                      Clear
                    </button>
                  )}
                  <button onClick={() => handleAnalyze()} disabled={phase === 'streaming' || !claim.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 font-bold text-sm flex items-center gap-1.5 shadow-sm hover:shadow">
                    {phase === 'streaming' ? <><span className="animate-spin">⟳</span> Analyzing</> : <>Analyze →</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Examples */}
            {phase === 'idle' && (
              <div className="mb-6">
                <ExampleClaims
                  onSelect={(c) => { setClaim(c); handleAnalyze(c); }}
                  onRandom={(c) => { setClaim(c); handleAnalyze(c); }}
                />
              </div>
            )}

            {/* Loading */}
            {phase === 'streaming' && (
              <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 shadow-lg">
                <div className="px-5 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">🔬</div>
                      <div>
                        <p className="font-bold text-sm text-white">Analyzing claim</p>
                        <p className="text-xs text-slate-400">Cross-referencing scientific literature</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-blue-400 font-mono">
                      {Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full mb-5">
                    <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%` }} />
                  </div>
                  <div className="space-y-2.5">
                    {LOADING_STEPS.map((step, i) => (
                      <div key={step} className={`flex items-center gap-3 transition-all ${
                        i < loadingStep ? 'opacity-40' : i === loadingStep ? 'opacity-100' : 'opacity-20'
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          i < loadingStep ? 'bg-emerald-500 text-white' :
                          i === loadingStep ? 'border-2 border-blue-400 bg-slate-800' :
                          'border border-slate-700 bg-slate-800'
                        }`}>
                          {i < loadingStep ? '✓' : i === loadingStep
                            ? <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse block" />
                            : <span className="w-1 h-1 bg-slate-600 rounded-full block" />}
                        </div>
                        <span className={`text-sm ${i === loadingStep ? 'text-white font-medium' : 'text-slate-600'}`}>
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
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0">⚠</span>
                  <div>
                    <p className="text-red-700 text-sm font-semibold">{error}</p>
                    <button onClick={() => handleAnalyze()} disabled={!claim.trim()}
                      className="mt-1.5 text-xs text-red-600 hover:text-red-800 font-semibold underline">
                      Try again →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {phase === 'done' && result && (
              <div className="space-y-3 result-enter">
                <ResultCard analysis={result} claim={lastClaim} onReset={handleReset} />
                <div className="flex gap-2">
                  <button onClick={handleReset}
                    className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
                    + Check another claim
                  </button>
                  <button onClick={() => { handleReset(); setActiveTab('about'); }}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 text-sm shadow-sm"
                    title="About MedCheck">ℹ️</button>
                </div>
                <RelatedClaims
                  category={result.category}
                  currentClaim={lastClaim}
                  onSelect={(c) => { setClaim(c); handleAnalyze(c); }}
                />
              </div>
            )}

            {/* Session stats + History */}
            {phase !== 'streaming' && history.length > 0 && (
              <div className="mt-5 space-y-3">
                <SessionStats history={history} />
                <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />
              </div>
            )}

            {/* Trending + Batch (idle + no history) */}
            {phase === 'idle' && history.length === 0 && (
              <div className="mt-6 space-y-4">
                <TrendingClaims onSelect={(c) => { setClaim(c); handleAnalyze(c); }} />
                <button onClick={() => setShowBatch(true)}
                  className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                  <span>📋</span> Check multiple claims at once
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg">🔬</div>
                <span className="font-black text-lg">MedCheck</span>
                <span className="text-xs text-blue-300 bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-semibold">Beta</span>
              </div>
              <h2 className="text-2xl font-black leading-tight mb-2">AI-powered health<br />misinformation detection</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Built for the ACP Student AI Championship 2026. Addresses SDG 3 (Good Health) and SDG 16 (Strong Institutions).
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: '6×', l: 'faster spread', c: 'text-red-400' },
                  { v: '30M+', l: 'Americans at risk', c: 'text-orange-400' },
                  { v: '1 in 3', l: 'acted on bad info', c: 'text-amber-400' },
                ].map(s => (
                  <div key={s.v} className="bg-slate-800 rounded-lg p-3 text-center">
                    <p className={`text-xl font-black ${s.c}`}>{s.v}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1.5">What is MedCheck?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  MedCheck analyzes any health claim against scientific consensus using AI. It breaks claims into individual assertions, evaluates each, and returns a structured verdict with honest confidence scores and real citations.
                </p>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    💡 <strong>MISLEADING</strong> is often more dangerous than FALSE — it contains real science weaponized to reach a false conclusion. "Natural immunity is always better than vaccines" has truth in it, but "always" makes it dangerous.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '✅', label: 'TRUE', desc: 'Evidence supports this', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                  { icon: '❌', label: 'FALSE', desc: 'Evidence contradicts this', color: 'border-red-200 bg-red-50 text-red-700' },
                  { icon: '⚠️', label: 'MISLEADING', desc: 'Partial truth, false impression', color: 'border-amber-200 bg-amber-50 text-amber-700' },
                  { icon: '❓', label: 'UNVERIFIABLE', desc: 'Insufficient consensus', color: 'border-slate-200 bg-slate-50 text-slate-600' },
                ].map(v => (
                  <div key={v.label} className={`border rounded-lg p-3 ${v.color}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>{v.icon}</span>
                      <span className="font-bold text-xs">{v.label}</span>
                    </div>
                    <p className="text-xs opacity-75">{v.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How It Works</h3>
                <div className="space-y-3">
                  {[
                    { icon: '🔍', title: 'Claim Decomposition', desc: 'Breaks compound claims into individual testable assertions.' },
                    { icon: '📚', title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed simultaneously.' },
                    { icon: '⚖️', title: 'Calibrated Confidence', desc: 'Honest uncertainty — 0% confidence means the AI isn\'t sure, which is honest.' },
                    { icon: '⚡', title: 'Political Charge Detection', desc: 'Flags contested claims so you know when to verify extra carefully.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black text-emerald-600">3</span>
                    <span className="text-xs font-bold text-emerald-800">Good Health & Well-Being</span>
                  </div>
                  <p className="text-xs text-emerald-700">Every accurate claim checked = potential harm prevented.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black text-blue-600">16</span>
                    <span className="text-xs font-bold text-blue-800">Strong Institutions</span>
                  </div>
                  <p className="text-xs text-blue-700">An informed public enables functional health policy.</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Accuracy & Limitations</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <p className="text-xs text-slate-600">Strong on well-studied topics: vaccine safety, basic nutrition, COVID-19 claims</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <p className="text-xs text-slate-600">Confidence scores honestly reflect AI uncertainty — low confidence = verify extra carefully</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <p className="text-xs text-slate-600">Less reliable on politically charged claims — the ⚡ flag signals when this is the case</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <p className="text-xs text-slate-600">May not reflect very recent research published after the model's training cutoff</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800 leading-relaxed">
                  ⚕️ <strong>Medical Disclaimer:</strong> For educational purposes only. Not medical advice. Always verify independently and consult qualified healthcare professionals.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Built by David Xiao</p>
                  <p className="text-xs text-slate-400">ACP Student AI Championship 2026 · SDG 3 & SDG 16</p>
                </div>
                <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold">GitHub →</a>
              </div>
            </div>
          </div>
        )}

      </div>

      <footer className="border-t border-slate-800" style={{ background: '#0f172a' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">MedCheck · David Xiao · ACP 2026</span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-400">GitHub ↗</a>
            <span>·</span>
            <span>Llama 4 · Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
