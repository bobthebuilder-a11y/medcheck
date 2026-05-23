import type { ClaimAnalysis } from '../types';

export const VERDICT_CONFIG = {
  true: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    headerBg: 'bg-emerald-600',
    text: 'text-emerald-800',
    icon: '✓',
    label: 'SCIENTIFICALLY SUPPORTED',
    barColor: 'bg-emerald-400',
    dot: 'bg-emerald-500',
  },
  false: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    headerBg: 'bg-red-700',
    text: 'text-red-800',
    icon: '✗',
    label: 'FALSE',
    barColor: 'bg-red-400',
    dot: 'bg-red-500',
  },
  misleading: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    headerBg: 'bg-amber-600',
    text: 'text-amber-800',
    icon: '⚠',
    label: 'MISLEADING',
    barColor: 'bg-amber-400',
    dot: 'bg-amber-500',
  },
  unverifiable: {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    headerBg: 'bg-slate-700',
    text: 'text-slate-700',
    icon: '?',
    label: 'UNVERIFIABLE',
    barColor: 'bg-slate-400',
    dot: 'bg-slate-400',
  },
} as const;

const CONFIDENCE_CONFIG = {
  high: { label: 'High Confidence', color: 'text-emerald-600' },
  medium: { label: 'Medium Confidence', color: 'text-amber-500' },
  low: { label: 'Low Confidence', color: 'text-red-500' },
} as const;

interface Props {
  analysis: ClaimAnalysis;
  claim: string;
  onReset?: () => void;
}

export default function ResultCard({ analysis, claim, onReset }: Props) {
  const vc = VERDICT_CONFIG[analysis.verdict];
  const cc = CONFIDENCE_CONFIG[analysis.confidence];

  const getShareText = () => {
    const divider = '─'.repeat(40);
    const sourcesText = analysis.sources?.length
      ? '\n\nSources:\n' + analysis.sources.map((s, i) => `[${i+1}] ${s.name}`).join('\n')
      : '';
    return [
      '🔬 MEDCHECK FACT-CHECK REPORT',
      divider,
      `Claim: "${claim}"`,
      '',
      `Verdict: ${vc.icon} ${vc.label}`,
      `Confidence: ${analysis.confidenceScore}% (${analysis.confidence})`,
      analysis.politicalCharge === 'high' ? '⚡ Politically contested topic' : '',
      '',
      `Summary: ${analysis.summary}`,
      '',
      analysis.explanation,
      sourcesText,
      '',
      divider,
      'Verified by MedCheck AI · https://medcheck-murex.vercel.app',
    ].filter(Boolean).join('\n');
  };

  const handleShare = async () => {
    const text = getShareText();
    if (navigator.share) {
      try { await navigator.share({ title: 'MedCheck Fact-Check Report', text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleTweet = () => {
    const tweetText = `${vc.icon} ${vc.label}: "${claim.substring(0, 80)}${claim.length > 80 ? '...' : ''}"\n\n${analysis.summary.substring(0, 150)}\n\nVerified by MedCheck AI`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`rounded-xl border-2 ${vc.border} overflow-hidden shadow-sm`}>

      {/* Header */}
      <div className={`${vc.headerBg} px-4 py-4`}>
        {/* Row 1: verdict + actions */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-lg font-black text-white tracking-wide leading-none">{vc.icon} {vc.label}</span>
            {analysis.politicalCharge === 'high' && (
              <span className="text-[10px] font-bold text-white/80 bg-white/15 border border-white/25 pl-2 pr-3 py-0.5 rounded shrink-0">
                ⚡ Contested
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleTweet}
              className="px-2 py-1 rounded bg-black/20 hover:bg-black/30 text-white/70 text-xs transition-colors hidden sm:block"
              title="Share on X">X</button>
            <button onClick={handleShare}
              className="px-2 py-1 rounded bg-black/20 hover:bg-black/30 text-white/70 text-xs transition-colors"
              title="Share">Share</button>
            {onReset && (
              <button onClick={onReset}
                className="px-2 py-1 rounded bg-black/20 hover:bg-black/30 text-white/70 text-xs transition-colors"
                title="New check">New</button>
            )}
          </div>
        </div>

        {/* Row 2: confidence */}
        <p className="text-xs text-white/60 mb-3">
          {cc.label} · {analysis.confidenceScore}%
          {analysis.category ? <span className="ml-2 capitalize text-white/40">· {analysis.category}</span> : null}
        </p>

        {/* Confidence bar */}
        <div className="h-1.5 bg-black/20 rounded-full">
          <div className="h-1.5 bg-white/70 rounded-full transition-all duration-700"
            style={{ width: `${analysis.confidenceScore}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className={`${vc.bg} px-5 py-4 space-y-3`}>

        {/* Claim */}
        <div className="bg-white/60 rounded-lg p-3 border border-slate-100">
          {analysis.extractedClaim && analysis.extractedClaim !== claim ? (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Core claim extracted</p>
              <p className="text-sm text-slate-800 italic leading-snug">"{analysis.extractedClaim}"</p>
              <p className="text-[10px] text-slate-400 mt-2 italic truncate">From: "{claim.substring(0, 80)}{claim.length > 80 ? '…' : ''}"</p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Claim</p>
              <p className="text-sm text-slate-800 italic leading-snug">"{claim}"</p>
            </div>
          )}
        </div>

        {/* Low confidence warning */}
        {analysis.confidence === 'low' && analysis.politicalCharge !== 'high' && (
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex items-start gap-2">
            <span className="shrink-0 text-slate-400">ℹ</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-700">Low confidence:</strong> The AI is uncertain about this verdict. This may be due to limited scientific consensus, an ambiguous claim, or a very specific/technical topic. Verify independently.
            </p>
          </div>
        )}

        {/* Political charge warning */}
        {analysis.politicalCharge === 'high' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
            <span className="shrink-0 text-purple-500 text-sm leading-none">⚡</span>
            <p className="text-xs text-purple-700 leading-relaxed">
              <strong>Politically contested topic.</strong> AI reliability may be lower here — apply extra scrutiny and verify from multiple independent sources.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className={`text-sm font-bold ${vc.text} leading-relaxed border-l-4 ${vc.border} pl-3 py-0.5`}>{analysis.summary}</div>

        {/* Explanation */}
        <div className="bg-white/50 rounded-lg p-3.5 border border-slate-200/40">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Analysis</h3>
          <div className="text-sm text-slate-700 leading-relaxed space-y-2">
            {analysis.explanation.split('\n').filter(p => p.trim()).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Assertions */}
        {analysis.assertions?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Claim Breakdown · {analysis.assertions.length} assertion{analysis.assertions.length !== 1 ? 's' : ''}
            </h3>
            <div className="space-y-2">
              {analysis.assertions.map((a, i) => {
                const ac = VERDICT_CONFIG[a.verdict];
                return (
                  <div key={i} className={`rounded-lg border-l-4 border-r border-t border-b ${ac.border} ${ac.bg} p-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed flex-1">"{a.text}"</p>
                      <span className={`text-xs font-black uppercase shrink-0 ${ac.text} flex items-center gap-1`}>
                        <span>{ac.icon}</span>
                        <span>{ac.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{a.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sources */}
        {analysis.sources?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sources · {analysis.sources.length} cited
            </h3>
            <div className="space-y-1">
              {analysis.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">{i + 1}.</span>
                  <span className="truncate">{s.name}</span>
                  <span className="text-slate-300 shrink-0">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t border-slate-200/60 pt-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            ⚕️ AI-generated for educational use only · Not medical advice · Verify citations independently · Consult healthcare professionals for medical decisions
          </p>
        </div>

      </div>
    </div>
  );
}
