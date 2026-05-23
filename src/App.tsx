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
      <nav className="sticky top-0 z-20 bg-white border-b border-slate-200" style={{ borderTop: '4px solid #003087' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <span className="font-black text-base tracking-tight block leading-tight" style={{ color: '#003087' }}>MedCheck</span>
              <span className="text-[9px] text-slate-400 leading-none hidden sm:block">AI Health Fact-Checker</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border" style={{ color: '#003087', borderColor: '#003087', background: '#f0f4ff' }}>Beta</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setShowBatch(true)}
              className="px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all hidden sm:block"
              title="Check multiple claims at once">
              Batch
            </button>
            {(['check', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
                style={activeTab === tab ? { background: '#003087' } : {}}>
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
                <h1 className="text-3xl font-black mb-1 leading-tight" style={{ color: '#003087' }}>Verify a health claim.</h1>
                <p className="text-sm text-slate-500">AI-powered · Cross-references CDC, WHO & peer-reviewed science</p>
              </div>
            )}

            {/* Input */}
            <div className={`bg-white rounded-lg border transition-all duration-150 p-4 mb-4 ${
              phase === 'streaming' ? 'border-blue-400 shadow-sm' :
              phase === 'done' ? 'border-slate-200' :
              'border-slate-300 focus-within:border-blue-400 focus-within:shadow-sm'
            }`}>
              <textarea
                ref={textareaRef}
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
                placeholder="Enter a health claim, headline, or paste a social media post..."
                rows={3}
                disabled={phase === 'streaming'}
                className="w-full border-0 text-base text-slate-800 placeholder-slate-400 focus:outline-none resize-none leading-relaxed disabled:opacity-60 bg-transparent"
              />
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  {phase === 'streaming' ? (
                    <><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>Analyzing...</>
                  ) : phase === 'done' ? (
                    <><span className="text-emerald-500">✓</span> Result ready</>
                  ) : claim.length > 200 ? (
                    <>Long post detected — AI will extract the claim</>
                  ) : claim.length > 0 ? (
                    `${claim.length} chars`
                  ) : (
                    <span className="hidden sm:inline">Cmd+Enter to analyze</span>
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
                    className="px-6 py-2 text-white rounded-lg disabled:opacity-40 font-bold text-sm flex items-center gap-1.5 hover:opacity-90 active:opacity-80"
                    style={{ background: '#003087' }}>
                    {phase === 'streaming' ? <>Analyzing...</> : <>Analyze</>}
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
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                <div className="h-1 bg-slate-100">
                  <div className="h-1 rounded-r-full transition-all duration-700"
                    style={{ width: `${Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%`, background: '#003087' }} />
                </div>
                <div className="px-5 py-4 text-center">
                  <p className="text-sm text-slate-500">{LOADING_STEPS[loadingStep]}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%</p>
                </div>
              </div>
            )}

            {/* Error */}
            {phase === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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
                <button onClick={handleReset}
                  className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center justify-center gap-2">
                  + Check another claim
                </button>
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
                  Check multiple claims at once
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="rounded-lg p-6 text-white" style={{ background: '#003087' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="font-black text-lg">MedCheck</span>
                <span className="text-xs text-blue-200 border border-blue-400/50 px-1.5 py-0.5 rounded-full font-semibold">Beta</span>
              </div>
              <h2 className="text-2xl font-black leading-tight mb-2">AI-powered health<br />misinformation detection</h2>
              <p className="text-sm text-blue-200 leading-relaxed mb-4">
                Built for the ACP Student AI Championship 2026. Addresses SDG 3 (Good Health) and SDG 16 (Strong Institutions).
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: '6×', l: 'faster spread', c: 'text-red-300' },
                  { v: '30M+', l: 'Americans at risk', c: 'text-orange-300' },
                  { v: '1 in 3', l: 'acted on bad info', c: 'text-amber-300' },
                ].map(s => (
                  <div key={s.v} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className={`text-xl font-black ${s.c}`}>{s.v}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1.5">What is MedCheck?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  MedCheck analyzes any health claim against scientific consensus using AI. It breaks claims into individual assertions, evaluates each, and returns a structured verdict with honest confidence scores and real citations.
                </p>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>MISLEADING</strong> is often more dangerous than FALSE — it contains real science weaponized to reach a false conclusion. "Natural immunity is always better than vaccines" has truth in it, but "always" makes it dangerous.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'TRUE', desc: 'Evidence supports this', color: 'border-emerald-300 text-emerald-700', left: 'border-l-4 border-l-emerald-500' },
                  { label: 'FALSE', desc: 'Evidence contradicts this', color: 'border-red-300 text-red-700', left: 'border-l-4 border-l-red-500' },
                  { label: 'MISLEADING', desc: 'Partial truth, false impression', color: 'border-amber-300 text-amber-700', left: 'border-l-4 border-l-amber-500' },
                  { label: 'UNVERIFIABLE', desc: 'Insufficient consensus', color: 'border-slate-200 text-slate-600', left: 'border-l-4 border-l-slate-400' },
                ].map(v => (
                  <div key={v.label} className={`border rounded-lg p-3 bg-white ${v.color} ${v.left}`}>
                    <p className="font-bold text-xs mb-1">{v.label}</p>
                    <p className="text-xs opacity-75">{v.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How It Works</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Claim Decomposition', desc: 'Breaks compound claims into individual testable assertions.' },
                    { title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed simultaneously.' },
                    { title: 'Calibrated Confidence', desc: 'Honest uncertainty — 0% confidence means the AI isn\'t sure, which is honest.' },
                    { title: 'Political Charge Detection', desc: 'Flags contested claims so you know when to verify extra carefully.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#003087' }}></div>
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
                    <p className="text-xs text-slate-600">Less reliable on politically charged claims — the Contested flag signals when this is the case</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <p className="text-xs text-slate-600">May not reflect very recent research published after the model's training cutoff</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Medical Disclaimer:</strong> For educational purposes only. Not medical advice. Always verify independently and consult qualified healthcare professionals.
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

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">MedCheck · David Xiao · ACP 2026</span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-600">GitHub ↗</a>
            <span>·</span>
            <span>Llama 4 · Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
