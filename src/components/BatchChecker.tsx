import { useState } from 'react';
import { analyzeClaimStream } from '../lib/analyzer';
import type { ClaimAnalysis } from '../types';
import { VERDICT_CONFIG } from './ResultCard';

interface BatchResult {
  claim: string;
  analysis: ClaimAnalysis | null;
  error?: string;
  status: 'pending' | 'analyzing' | 'done' | 'error';
}

interface Props {
  onClose: () => void;
}

export default function BatchChecker({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<BatchResult[]>([]);
  const [running, setRunning] = useState(false);

  const runBatch = async () => {
    const claims = input.split('\n').map(c => c.trim()).filter(c => c.length > 4);
    if (claims.length === 0 || claims.length > 5) return;

    const initial: BatchResult[] = claims.map(c => ({ claim: c, analysis: null, status: 'pending' }));
    setResults(initial);
    setRunning(true);

    for (let i = 0; i < claims.length; i++) {
      setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'analyzing' } : r));
      try {
        const analysis = await analyzeClaimStream(claims[i], () => {});
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, analysis, status: 'done' } : r));
      } catch {
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error', error: 'Failed' } : r));
      }
      // Small delay between requests
      if (i < claims.length - 1) await new Promise(r => setTimeout(r, 500));
    }
    setRunning(false);
  };

  const claims = input.split('\n').map(c => c.trim()).filter(c => c.length > 4);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">B</div>
            <div>
              <h2 className="font-black text-slate-900 text-base">Batch Fact-Checker</h2>
              <p className="text-xs text-slate-500">Check up to 5 claims at once · ⌘+B</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xl leading-none">×</button>
        </div>

        {results.length === 0 ? (
          <div className="p-5">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"Vaccines cause autism\nMasks cause oxygen deprivation\nVitamin C megadoses cure cancer"}
              rows={5}
              className="w-full text-sm text-slate-800 placeholder-slate-300 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-400 resize-none leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-2 mb-4">One claim per line · Max 5 claims</p>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg font-medium">
                Cancel
              </button>
              <button
                onClick={runBatch}
                disabled={claims.length === 0 || claims.length > 5}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-40"
              >
                Check {claims.length > 0 ? `${claims.length} claim${claims.length !== 1 ? 's' : ''}` : 'Claims'} →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {results.map((r, i) => {
              const vc = r.analysis ? VERDICT_CONFIG[r.analysis.verdict] : null;
              return (
                <div key={i} className={`rounded-xl border p-3.5 ${
                  r.status === 'done' && vc ? `${vc.bg} ${vc.border}` :
                  r.status === 'analyzing' ? 'bg-blue-50 border-blue-200' :
                  r.status === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-800 font-medium flex-1 italic">"{r.claim}"</p>
                    {r.status === 'pending' && <span className="text-xs text-slate-400 shrink-0">Pending...</span>}
                    {r.status === 'analyzing' && <span className="text-xs text-blue-500 font-medium animate-pulse shrink-0">Analyzing...</span>}
                    {r.status === 'error' && <span className="text-xs text-red-500 shrink-0">Failed</span>}
                    {r.status === 'done' && r.analysis && vc && (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm">{vc.icon}</span>
                        <span className={`text-xs font-black ${vc.text}`}>{vc.label}</span>
                        <span className="text-xs text-slate-400">{r.analysis.confidenceScore}%</span>
                      </div>
                    )}
                  </div>
                  {r.status === 'done' && r.analysis && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{r.analysis.summary}</p>
                  )}
                </div>
              );
            })}

            {!running && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setResults([]); setInput(''); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Check more
                </button>
                <button onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800">
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
