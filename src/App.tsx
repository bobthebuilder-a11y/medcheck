import { useState, useEffect, useRef } from 'react';
import { analyzeClaimStream } from './lib/analyzer';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import SessionStats from './components/SessionStats';
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

const EXAMPLE_CLAIMS = [
  'Vaccines cause autism',
  'Vitamin C megadoses cure the common cold',
  'Natural immunity is always better than vaccines',
  'Eating sugar directly feeds cancer cells',
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
      <nav className="sticky top-0 z-20 bg-white border-b border-[#d6d7d9]" style={{ borderTop: '4px solid #003087' }}>
        <div className="mx-auto px-16 py-3 flex items-center justify-between" style={{ maxWidth: "720px" }}>
          <div>
            <span className="font-bold text-base block leading-tight" style={{ color: '#003087' }}>MedCheck</span>
            <span className="text-xs leading-none hidden sm:block" style={{ color: '#767676' }}>AI Health Fact-Checker</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowBatch(true)}
              className="text-sm font-medium hidden sm:block hover:underline"
              style={{ color: '#0071bc' }}>
              Batch Check
            </button>
            {(['check', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="text-sm font-medium transition-colors pb-0.5"
                style={{
                  color: activeTab === tab ? '#0071bc' : '#3d3d3d',
                  borderBottom: activeTab === tab ? '2px solid #0071bc' : '2px solid transparent',
                }}>
                {tab === 'check' ? 'Analyze' : 'About'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto px-16 pt-10 pb-24" style={{ maxWidth: '720px' }}>

        {activeTab === 'check' && (
          <>
            {/* Hero (idle only) */}
            {phase === 'idle' && (
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 leading-tight" style={{ color: '#003087' }}>
                  Verify a Health Claim
                </h1>
                <p className="text-lg leading-relaxed" style={{ color: '#3d3d3d' }}>
                  Powered by AI. Cross-references CDC, WHO, and peer-reviewed science.
                </p>
              </div>
            )}

            {/* Textarea */}
            <div className="mb-3">
              <textarea
                ref={textareaRef}
                value={claim}
                onChange={e => setClaim(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
                placeholder="Enter a health claim, headline, or paste a social media post..."
                rows={4}
                disabled={phase === 'streaming'}
                className="w-full text-base placeholder-[#767676] focus:outline-none resize-none leading-relaxed disabled:opacity-60 p-4 rounded-sm"
                style={{
                  border: '1px solid #d6d7d9',
                  color: '#1b1b1b',
                  background: 'white',
                  boxShadow: phase === 'streaming' ? `0 0 0 2px #0071bc` : undefined,
                }}
              />
            </div>

            {/* Below textarea: hint + button */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm" style={{ color: '#767676' }}>
                {phase === 'streaming' ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: '#0071bc' }} />
                    Analyzing...
                  </span>
                ) : (
                  <span className="hidden sm:inline">⌘+Enter to analyze</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {(phase === 'done' || phase === 'error') && (
                  <button onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium border rounded-sm hover:bg-gray-50"
                    style={{ color: '#3d3d3d', borderColor: '#d6d7d9' }}>
                    Clear
                  </button>
                )}
                <button
                  onClick={() => handleAnalyze()}
                  disabled={phase === 'streaming' || !claim.trim()}
                  className="px-8 py-3 text-white font-bold rounded-sm text-base disabled:opacity-40 hover:opacity-90 active:opacity-80"
                  style={{ background: '#0071bc' }}>
                  {phase === 'streaming' ? 'Analyzing...' : 'Analyze Claim →'}
                </button>
              </div>
            </div>

            {/* Example claims (idle) */}
            {phase === 'idle' && (
              <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-sm shrink-0" style={{ color: '#767676' }}>Try an example:</span>
                {EXAMPLE_CLAIMS.map((c, i) => (
                  <button key={i} onClick={() => { setClaim(c); handleAnalyze(c); }}
                    className="text-sm hover:underline text-left"
                    style={{ color: '#0071bc' }}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {phase === 'streaming' && (
              <div className="bg-white border border-[#d6d7d9] rounded-sm overflow-hidden mb-4"
                style={{ borderTop: '3px solid #003087' }}>
                <div className="px-6 py-5">
                  <p className="text-base font-semibold mb-1" style={{ color: '#1b1b1b' }}>Analyzing...</p>
                  <p className="text-sm mb-4" style={{ color: '#767676' }}>{LOADING_STEPS[loadingStep]}</p>
                  <div className="h-1.5 rounded-full" style={{ background: '#e8f0fa' }}>
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%`,
                        background: '#0071bc',
                      }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {phase === 'error' && error && (
              <div className="border rounded-sm p-4 mb-4" style={{ background: '#fff5f5', borderColor: '#f5b8b8' }}>
                <div className="flex items-start gap-2.5">
                  <span style={{ color: '#cd2026' }}>⚠</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#cd2026' }}>{error}</p>
                    <button onClick={() => handleAnalyze()} disabled={!claim.trim()}
                      className="mt-1.5 text-sm font-medium underline" style={{ color: '#cd2026' }}>
                      Try again →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {phase === 'done' && result && (
              <div className="space-y-4 result-enter">
                <ResultCard analysis={result} claim={lastClaim} onReset={handleReset} />
                <div className="text-center pt-2">
                  <button onClick={handleReset}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#0071bc' }}>
                    + Check another claim
                  </button>
                </div>
              </div>
            )}

            {/* Session stats + History */}
            {phase !== 'streaming' && history.length > 0 && (
              <div className="mt-6 mb-16 space-y-3">
                <SessionStats history={history} />
                <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={() => setHistory([])} />
              </div>
            )}

            {/* Trending (idle + no history) */}
            {phase === 'idle' && history.length === 0 && (
              <div className="mt-6 mb-16">
                <TrendingClaims onSelect={(c) => { setClaim(c); handleAnalyze(c); }} />
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="rounded-sm p-8" style={{ background: '#003087' }}>
              <h2 className="text-3xl font-bold leading-tight mb-3 text-white">
                AI-powered health misinformation detection
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#b3c7e6' }}>
                Built for the ACP Student AI Championship 2026. Addresses SDG 3 (Good Health) and SDG 16 (Strong Institutions).
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { v: '6×', l: 'faster spread', c: '#f4b942' },
                  { v: '30M+', l: 'Americans at risk', c: '#e87722' },
                  { v: '1 in 3', l: 'acted on bad info', c: '#e5c84a' },
                ].map(s => (
                  <div key={s.v} className="rounded-sm p-4 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</p>
                    <p className="text-sm mt-1" style={{ color: '#b3c7e6' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#d6d7d9] rounded-sm p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#1b1b1b' }}>What is MedCheck?</h2>
                <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                  MedCheck analyzes any health claim against scientific consensus using AI. It breaks claims into individual assertions, evaluates each, and returns a structured verdict with honest confidence scores and real citations.
                </p>
                <div className="mt-4 pl-4 py-2 border-l-4" style={{ borderColor: '#e5a000', background: '#fffbf0' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#5c4a00' }}>
                    <strong>MISLEADING</strong> is often more dangerous than FALSE — it contains real science weaponized to reach a false conclusion. "Natural immunity is always better than vaccines" has truth in it, but "always" makes it dangerous.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'TRUE', desc: 'Evidence supports this', color: '#2e8540' },
                  { label: 'FALSE', desc: 'Evidence contradicts this', color: '#cd2026' },
                  { label: 'MISLEADING', desc: 'Partial truth, false impression', color: '#e5a000' },
                  { label: 'UNVERIFIABLE', desc: 'Insufficient consensus', color: '#5b616b' },
                ].map(v => (
                  <div key={v.label} className="rounded-sm p-4 border border-[#d6d7d9]"
                    style={{ borderLeft: `4px solid ${v.color}` }}>
                    <p className="font-bold text-sm mb-1" style={{ color: v.color }}>{v.label}</p>
                    <p className="text-sm" style={{ color: '#767676' }}>{v.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#767676' }}>How It Works</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Claim Decomposition', desc: 'Breaks compound claims into individual testable assertions.' },
                    { title: 'Evidence Synthesis', desc: 'Cross-references CDC, WHO, NIH, PubMed simultaneously.' },
                    { title: 'Calibrated Confidence', desc: "Honest uncertainty — 0% confidence means the AI isn't sure, which is honest." },
                    { title: 'Political Charge Detection', desc: 'Flags contested claims so you know when to verify extra carefully.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#003087' }} />
                      <div>
                        <p className="font-semibold text-base" style={{ color: '#1b1b1b' }}>{item.title}</p>
                        <p className="text-sm mt-0.5" style={{ color: '#3d3d3d' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#d6d7d9] pt-5">
                <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                  <strong>Medical Disclaimer:</strong> For educational purposes only. Not medical advice. Always verify independently and consult qualified healthcare professionals.
                </p>
              </div>

              <div className="border-t border-[#d6d7d9] pt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1b1b1b' }}>Built by David Xiao</p>
                  <p className="text-sm" style={{ color: '#767676' }}>ACP Student AI Championship 2026 · SDG 3 & SDG 16</p>
                </div>
                <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline" style={{ color: '#0071bc' }}>
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      <footer className="border-t border-[#d6d7d9] bg-white">
        <div className="mx-auto px-16 py-4 flex items-center justify-between" style={{ maxWidth: '720px' }}>
          <span className="text-sm" style={{ color: '#767676' }}>MedCheck · David Xiao · ACP 2026</span>
          <div className="flex items-center gap-3 text-sm" style={{ color: '#767676' }}>
            <a href="https://github.com/bobthebuilder-a11y/medcheck" target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: '#0071bc' }}>
              GitHub ↗
            </a>
            <span>·</span>
            <span>Llama 4 · Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
