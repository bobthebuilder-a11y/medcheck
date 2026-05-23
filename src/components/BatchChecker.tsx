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
      if (i < claims.length - 1) await new Promise(r => setTimeout(r, 500));
    }
    setRunning(false);
  };

  const claims = input.split('\n').map(c => c.trim()).filter(c => c.length > 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-auto"
      style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white w-full max-w-2xl border border-[#d6d7d9] rounded-sm shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6d7d9]"
          style={{ background: '#003087' }}>
          <div>
            <h2 className="font-bold text-base text-white">Batch Fact-Checker</h2>
            <p className="text-sm mt-0.5" style={{ color: '#b3c7e6' }}>Check up to 5 claims at once · ⌘+B</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-xl leading-none rounded-sm hover:bg-white/20 text-white transition-colors">
            ×
          </button>
        </div>

        {results.length === 0 ? (
          <div className="p-6">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"Vaccines cause autism\nMasks cause oxygen deprivation\nVitamin C megadoses cure cancer"}
              rows={5}
              className="w-full text-base placeholder-[#767676] border border-[#d6d7d9] rounded-sm p-3 focus:outline-none resize-none leading-relaxed"
              style={{ color: '#1b1b1b' }}
            />
            <p className="text-sm mt-2 mb-5" style={{ color: '#767676' }}>One claim per line · Max 5 claims</p>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium border border-[#d6d7d9] rounded-sm hover:bg-[#f5f7fa]"
                style={{ color: '#3d3d3d' }}>
                Cancel
              </button>
              <button
                onClick={runBatch}
                disabled={claims.length === 0 || claims.length > 5}
                className="flex-1 py-2.5 text-white font-semibold rounded-sm text-sm disabled:opacity-40 hover:opacity-90"
                style={{ background: '#0071bc' }}>
                Check {claims.length > 0 ? `${claims.length} claim${claims.length !== 1 ? 's' : ''}` : 'Claims'} →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-3">
            {results.map((r, i) => {
              const vc = r.analysis ? VERDICT_CONFIG[r.analysis.verdict] : null;
              return (
                <div key={i} className="border border-[#d6d7d9] rounded-sm overflow-hidden"
                  style={vc && r.status === 'done' ? { borderLeft: `4px solid ${vc.color}` } : {}}>
                  {r.status === 'done' && vc && (
                    <div className="px-4 py-2 flex items-center justify-between border-b border-[#d6d7d9]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: vc.color }}>{vc.icon}</span>
                        <span className="text-sm font-semibold" style={{ color: vc.color }}>{vc.label}</span>
                      </div>
                      <span className="text-sm" style={{ color: '#767676' }}>{r.analysis?.confidenceScore}% confidence</span>
                    </div>
                  )}
                  {r.status === 'analyzing' && (
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-[#d6d7d9]"
                      style={{ background: '#003087' }}>
                      <span className="animate-spin text-white text-sm">⟳</span>
                      <span className="text-sm font-medium text-white">Analyzing...</span>
                    </div>
                  )}
                  <div className="p-4" style={{ background: r.status === 'done' && vc ? '#fafafa' : 'white' }}>
                    <p className="text-sm italic mb-1" style={{ color: '#1b1b1b' }}>
                      "{r.claim.length > 80 ? r.claim.substring(0, 80) + '…' : r.claim}"
                    </p>
                    {r.status === 'pending' && <p className="text-sm" style={{ color: '#767676' }}>Waiting...</p>}
                    {r.status === 'error' && <p className="text-sm" style={{ color: '#cd2026' }}>Analysis failed</p>}
                    {r.status === 'done' && r.analysis && (
                      <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{r.analysis.summary}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {!running && results.length > 0 && (
              <>
                <div className="border border-[#d6d7d9] rounded-sm p-4"
                  style={{ borderTop: '3px solid #003087' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#767676' }}>
                    Batch Summary
                  </p>
                  <div className="flex items-center gap-6">
                    {(['false', 'misleading', 'true', 'unverifiable'] as const).map(v => {
                      const count = results.filter(r => r.analysis?.verdict === v).length;
                      if (count === 0) return null;
                      const cfg = VERDICT_CONFIG[v];
                      return (
                        <div key={v} className="text-center">
                          <p className="text-xl font-bold" style={{ color: cfg.color }}>{count}</p>
                          <p className="text-xs capitalize mt-0.5" style={{ color: '#767676' }}>{v}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setResults([]); setInput(''); }}
                    className="flex-1 py-2.5 text-sm font-medium border border-[#d6d7d9] rounded-sm hover:bg-[#f5f7fa]"
                    style={{ color: '#3d3d3d' }}>
                    Check more
                  </button>
                  <button onClick={onClose}
                    className="flex-1 py-2.5 text-sm font-semibold text-white rounded-sm hover:opacity-90"
                    style={{ background: '#003087' }}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
