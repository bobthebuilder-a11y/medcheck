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
      <div className={`${vc.headerBg} px-5 py-5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xl font-black text-white leading-none">{vc.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xl font-black tracking-wide text-white leading-tight"
                  title={`Verdict: ${vc.label} — ${
                    analysis.verdict === 'true' ? 'Scientific evidence supports this claim' :
                    analysis.verdict === 'false' ? 'Scientific evidence contradicts this claim' :
                    analysis.verdict === 'misleading' ? 'Partially true but creates a false overall impression' :
                    'Insufficient evidence to evaluate definitively'
                  }`}
                >
                  {vc.label}
                </span>
                {analysis.politicalCharge === 'high' && (
                  <span className="px-2 py-0.5 text-xs bg-white/20 text-white border border-white/30 rounded-full font-semibold"
                    title="Politically contested — AI may be less reliable. Verify independently.">
                    ⚡ Contested
                  </span>
                )}
                {analysis.category && (
                  <span className="px-2 py-0.5 text-xs bg-black/20 text-white/80 rounded-full font-medium capitalize hidden sm:inline">
                    {analysis.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold text-white/80`}>
                  {cc.label} · {analysis.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={handleTweet}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 transition-colors hidden sm:flex items-center"
              title="Share on Twitter/X">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            {onReset && (
              <button onClick={onReset}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 transition-colors"
                title="Check another claim">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button onClick={handleShare}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 transition-colors"
              title="Share result">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/70">
              AI Certainty &nbsp;<span className="font-black text-white/90">{analysis.confidenceScore}%</span>
              &nbsp;<span className="text-white/50">{analysis.confidence === 'high' ? '· strong' : analysis.confidence === 'medium' ? '· moderate' : '· uncertain'}</span>
            </span>
            <span className="text-[10px] text-white/40 cursor-help" title="How confident the AI is in this verdict. Lower scores mean you should verify more carefully.">ℹ</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full">
            <div className="h-2 bg-white/75 rounded-full transition-all duration-700"
              style={{ width: `${analysis.confidenceScore}%` }} />
          </div>
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
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-start gap-2">
            <span className="shrink-0 text-purple-500">⚡</span>
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
            <div className="flex flex-wrap gap-1.5">
              {analysis.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-md text-xs text-blue-600 hover:text-blue-800 font-medium transition-all">
                  <span className="text-[10px] text-slate-400 font-bold">{i + 1}</span>
                  {s.name}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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
