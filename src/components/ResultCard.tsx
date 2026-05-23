import type { ClaimAnalysis } from '../types';

export const VERDICT_CONFIG = {
  true: {
    border: 'border-emerald-500',
    leftBorder: 'border-l-emerald-500',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'SCIENTIFICALLY SUPPORTED',
    barColor: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    assertionBg: 'bg-emerald-50',
  },
  false: {
    border: 'border-red-500',
    leftBorder: 'border-l-red-500',
    text: 'text-red-700',
    icon: '✗',
    label: 'FALSE',
    barColor: 'bg-red-500',
    dot: 'bg-red-500',
    assertionBg: 'bg-red-50',
  },
  misleading: {
    border: 'border-amber-500',
    leftBorder: 'border-l-amber-500',
    text: 'text-amber-700',
    icon: '⚠',
    label: 'MISLEADING',
    barColor: 'bg-amber-500',
    dot: 'bg-amber-500',
    assertionBg: 'bg-amber-50',
  },
  unverifiable: {
    border: 'border-slate-400',
    leftBorder: 'border-l-slate-400',
    text: 'text-slate-600',
    icon: '?',
    label: 'UNVERIFIABLE',
    barColor: 'bg-slate-400',
    dot: 'bg-slate-400',
    assertionBg: 'bg-slate-50',
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
      'MEDCHECK FACT-CHECK REPORT',
      divider,
      `Claim: "${claim}"`,
      '',
      `Verdict: ${vc.icon} ${vc.label}`,
      `Confidence: ${analysis.confidenceScore}% (${analysis.confidence})`,
      analysis.politicalCharge === 'high' ? 'Politically contested topic' : '',
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
    <div className={`rounded-lg border border-slate-200 border-l-4 ${vc.leftBorder} overflow-hidden bg-white`}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`text-lg font-black tracking-wide leading-none ${vc.text}`}>{vc.icon} {vc.label}</span>
            {analysis.politicalCharge === 'high' && (
              <span className="text-[10px] font-bold text-slate-500 border border-slate-300 bg-slate-50 px-2 py-0.5 rounded shrink-0">
                Contested
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleTweet}
              className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-xs transition-colors hidden sm:block"
              title="Share on X">X</button>
            <button onClick={handleShare}
              className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-xs transition-colors"
              title="Share">Share</button>
            {onReset && (
              <button onClick={onReset}
                className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-xs transition-colors"
                title="New check">New</button>
            )}
          </div>
        </div>

        <p className={`text-xs ${cc.color} font-medium`}>
          {cc.label} · {analysis.confidenceScore}%
          {analysis.category ? <span className="ml-2 text-slate-400 capitalize">· {analysis.category}</span> : null}
        </p>

        {/* Confidence bar */}
        <div className="h-1 bg-slate-100 rounded-full mt-2">
          <div className={`h-1 ${vc.barColor} rounded-full transition-all duration-700`}
            style={{ width: `${analysis.confidenceScore}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">

        {/* Claim */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          {analysis.extractedClaim && analysis.extractedClaim !== claim ? (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Core claim extracted</p>
              <p className="text-sm text-slate-700 italic leading-snug">"{analysis.extractedClaim}"</p>
              <p className="text-[10px] text-slate-400 mt-2 italic truncate">From: "{claim.substring(0, 80)}{claim.length > 80 ? '…' : ''}"</p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Claim</p>
              <p className="text-sm text-slate-700 italic leading-snug">"{claim}"</p>
            </div>
          )}
        </div>

        {/* Warnings */}
        {analysis.confidence === 'low' && analysis.politicalCharge !== 'high' && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>ℹ</span> Low confidence — verify independently.
          </p>
        )}
        {analysis.politicalCharge === 'high' && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>⚡</span> Politically contested — apply extra scrutiny.
          </p>
        )}

        {/* Summary */}
        <div className={`text-sm font-bold ${vc.text} leading-relaxed border-l-4 ${vc.leftBorder} pl-3 py-0.5`}>{analysis.summary}</div>

        {/* Explanation */}
        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
          {analysis.explanation.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Assertions */}
        {analysis.assertions?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Claim Breakdown · {analysis.assertions.length} assertion{analysis.assertions.length !== 1 ? 's' : ''}
            </h3>
            <div className="space-y-1.5">
              {analysis.assertions.map((a, i) => {
                const ac = VERDICT_CONFIG[a.verdict];
                return (
                  <div key={i} className={`rounded border-l-4 ${ac.leftBorder} ${ac.assertionBg} border border-slate-100 px-3 py-2`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-slate-700 leading-relaxed flex-1">"{a.text}"</p>
                      <span className={`text-[10px] font-black uppercase shrink-0 ${ac.text}`}>
                        {ac.icon} {ac.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{a.explanation}</p>
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
            <ol className="space-y-0.5 list-none">
              {analysis.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">{i + 1}.</span>
                    <span className="truncate">{s.name}</span>
                    <span className="text-slate-300 shrink-0">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
          Educational use only · Not medical advice
        </p>

      </div>
    </div>
  );
}
