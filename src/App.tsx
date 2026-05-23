import { useState, useEffect, useRef } from 'react';
import { analyzeClaimStream } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import ExampleClaims from './components/ExampleClaims';
import HistoryPanel from './components/HistoryPanel';
import StatsBar from './components/StatsBar';
import SessionStats from './components/SessionStats';
import RelatedClaims from './components/RelatedClaims';
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
  const [loadingStep, setLoadingStep] = useState(0);
  const [, setStreamText] = useState('');
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { saveHistory(history); }, [history]);

  const totalChecked = history.length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'done') {
        setPhase('idle'); setResult(null); setClaim(''); setLastClaim(''); setError('');
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
               msg + ' Please try again.');
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

      {/* Dark navbar */}
      <nav className="sticky top-0 z-20 border-b border-slate-800/80" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm text-white text-lg leading-none">
              🔬
            </div>
            <span className="font-black text-white text-base tracking-tight">MedCheck</span>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
          </div>
          <div className="flex items-center gap-0.5">
            {(['check', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                {tab === 'check' ? 'Analyze' : 'About'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16">

        {activeTab === 'check' && (
          <>
            {/* Hero — left-aligned, more impactful */}
            {phase === 'idle' && (
              <div className="mb-8">
                {/* Urgency banner */}
                <div className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg mb-5 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Health misinformation kills. Fake cancer cures, vaccine myths, and dangerous treatments spread faster than corrections.</span>
                </div>
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shrink-0"></span>
                    ACP 2026 · SDG 3 & 16
                  </span>
                  {totalChecked > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      ✓ {totalChecked} analyzed this session
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-[52px] font-black text-slate-900 tracking-tight leading-[1.05] mb-4">
                  Is that health claim<br />
                  <span className="text-blue-600">actually true?</span>
                </h1>

                <p className="text-slate-500 text-base leading-relaxed mb-5 max-w-lg">
                  Health misinformation kills. Paste any claim, headline, or viral post —
                  AI cross-references CDC, WHO & peer-reviewed science and returns a structured verdict in seconds.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { val: '6×', label: 'false claims spread vs. corrections', c: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                    { val: '30M+', label: 'uninsured Americans at risk', c: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
                    { val: '1 in 3', label: 'acted on unverified health info', c: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                  ].map(s => (
                    <div key={s.val} className={`flex items-center gap-2 ${s.bg} border ${s.border} rounded-lg px-3 py-2`}>
                      <span className={`text-lg font-black ${s.c} leading-none`}>{s.val}</span>
                      <span className="text-xs text-slate-600 leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Pipeline */}
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { label: 'Decompose claims', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'Synthesize evidence', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    { label: 'Calibrate confidence', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                    { label: 'Cite sources', color: 'bg-slate-50 text-slate-600 border-slate-200' },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1">
                      {i > 0 && <span className="text-slate-300 text-xs mx-0.5">→</span>}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${s.color}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input card */}
            <div className={`bg-white rounded-xl border-2 transition-all duration-150 p-4 mb-4 ${
              phase === 'streaming' ? 'border-blue-500 shadow-md shadow-blue-50' :
              phase === 'done' ? 'border-slate-200 shadow-sm' :
              'border-slate-200 shadow-sm focus-within:border-blue-500 focus-within:shadow-md focus-within:shadow-blue-50'
            }`}>
              <textarea
                ref={textareaRef}
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
                placeholder="Enter a health claim to fact-check..."
                rows={3}
                disabled={phase === 'streaming'}
                className="w-full border-0 text-base text-slate-800 placeholder-slate-300 focus:outline-none resize-none leading-relaxed disabled:opacity-60 bg-transparent"
              />
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                <div className="flex items-center gap-2">
                  {claim.length > 0 && phase !== 'streaming' && (
                    <span className="text-xs text-slate-400">
                      {claim.length > 200 ? '📄 Long post' : phase === 'done' ? '✓ Analyzed' : `${claim.length} chars`}
                    </span>
                  )}
                  {phase === 'streaming' && (
                    <span className="text-xs text-blue-500 font-medium">Analyzing...</span>
                  )}
                  {phase === 'idle' && !claim && (
                    <span className="text-xs text-slate-400 hidden sm:inline">⌘+Enter</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {(phase === 'done' || phase === 'error') && (
                    <button onClick={handleReset}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg transition-colors">
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => handleAnalyze()}
                    disabled={phase === 'streaming' || !claim.trim()}
                    className="px-5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 font-bold text-sm transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {phase === 'streaming'
                      ? <><span className="animate-spin inline-block">⟳</span> Analyzing</>
                      : <>Analyze <span className="opacity-60">→</span></>
                    }
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
                      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-base">🔬</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">Analyzing claim</p>
                        <p className="text-xs text-slate-500">Cross-referencing scientific literature</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-blue-400 font-mono">
                      {Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-700 rounded-full mb-5">
                    <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%` }} />
                  </div>

                  {/* Steps */}
                  <div className="space-y-2.5">
                    {LOADING_STEPS.map((step, i) => (
                      <div key={step} className={`flex items-center gap-3 transition-all duration-200 ${
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
                  <span className="text-red-500 shrink-0 mt-0.5">⚠</span>
                  <div>
                    <p className="text-red-700 text-sm font-semibold">Analysis failed</p>
                    <p className="text-red-600 text-xs mt-0.5">{error}</p>
                    <button onClick={() => handleAnalyze()} disabled={!claim.trim()}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 font-semibold underline">
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
                    className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2">
                    <span className="text-base">+</span>
                    Check another claim
                  </button>
                  <button onClick={() => { handleReset(); setActiveTab('about'); }}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-sm transition-colors shadow-sm"
                    title="About MedCheck">
                    ℹ️
                  </button>
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
              <div className="mt-6 space-y-3">
                <SessionStats history={history} />
                <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />
              </div>
            )}

            {/* Impact callout + trust signals */}
            {phase === 'idle' && history.length === 0 && (
              <div className="mt-6 space-y-3">
                <div className="bg-slate-900 rounded-xl p-4 text-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Why this matters</p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    False health claims cause real harm — vaccine hesitancy, delayed diagnoses, dangerous self-treatment.
                    MedCheck gives anyone the ability to verify a claim in the same time it takes to read it.
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
                    <div className="text-center">
                      <p className="text-xs font-black text-blue-400">Free</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Always</p>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-blue-400">No account</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Required</p>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-blue-400">No data</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Stored</p>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-blue-400">Any device</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Works everywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            {/* About hero */}
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg">🔬</div>
                <span className="font-black text-lg">MedCheck</span>
              </div>
              <h2 className="text-2xl font-black leading-tight mb-2">
                AI-powered health<br />misinformation detection
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Built for the ACP Student AI Championship 2026.
                Addresses SDG 3 (Good Health) and SDG 16 (Strong Institutions).
              </p>
            </div>
            <StatsBar />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">What is MedCheck?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  MedCheck is an AI-powered health misinformation detector. It analyzes any health claim,
                  breaks it into individual assertions, evaluates each against scientific consensus, and returns
                  a structured verdict with honest confidence scores and real source citations — in seconds.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed mt-2">
                  Most fact-checkers require you to already be skeptical. MedCheck meets people where they are —
                  works on any claim, any format, instantly.
                </p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                  💡 <strong className="text-slate-600">Note on MISLEADING:</strong> Most dangerous misinformation isn't false — it's selectively true. 
                  "Natural immunity is always better than vaccines" contains real science but weaponizes it to reach a dangerous conclusion. 
                  That's why MISLEADING often matters more than FALSE.
                </p>
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
                      <span className="text-sm">{v.icon}</span>
                      <span className="font-bold text-xs tracking-wide">{v.label}</span>
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
                    { icon: '⚖️', title: 'Calibrated Confidence', desc: 'Honest uncertainty quantification — 0% confidence is a feature, not a bug.' },
                    { icon: '⚡', title: 'Political Charge Detection', desc: 'Flags politically contested claims, signaling when AI reliability may be lower.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example output */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Example Output</h3>
                <div className="rounded-lg border-2 border-red-300 overflow-hidden text-sm">
                  <div className="bg-red-500 px-4 py-3 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span>❌</span>
                      <span className="font-black tracking-widest text-sm">FALSE</span>
                      <span className="ml-auto text-xs text-red-200">95% confidence</span>
                    </div>
                    <div className="h-1 bg-red-400 rounded-full">
                      <div className="h-1 bg-white/80 rounded-full w-[95%]" />
                    </div>
                  </div>
                  <div className="bg-red-50 px-4 py-3">
                    <p className="text-xs text-slate-500 italic mb-1">"Vaccines cause autism"</p>
                    <p className="text-xs font-semibold text-red-800">Definitively false — large-scale studies of millions of children find zero link between vaccines and autism.</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-white border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-medium">vaccines</span>
                      <span className="text-xs text-slate-400">2 assertions · 3 sources</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SDG cards */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">UN SDG Alignment</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-emerald-600">3</span>
                      <span className="text-xs font-bold text-emerald-800">Good Health</span>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">Reducing health decisions made on false information.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-blue-600">16</span>
                      <span className="text-xs font-bold text-blue-800">Strong Institutions</span>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">An informed public enables functional health policy.</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800 leading-relaxed">
                  ⚕️ <strong>Disclaimer:</strong> For educational purposes only. Not medical advice. Always consult qualified healthcare professionals.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Built by David Xiao</p>
                  <p className="text-xs text-slate-400">ACP Student AI Championship 2026</p>
                </div>
                <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-slate-900 mt-16 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-sm">🔬</div>
            <div>
              <p className="text-xs font-semibold text-slate-300">MedCheck · David Xiao</p>
              <p className="text-xs text-slate-500">ACP 2026 · SDG 3 & 16</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors font-medium">GitHub ↗</a>
            <span className="text-slate-700">·</span>
            <span>Llama 4 · Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
