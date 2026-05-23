import { useState } from 'react';
import type { ClaimAnalysis } from '../types';

export const VERDICT_CONFIG = {
  true: {
    color: '#2e8540',
    label: 'SCIENTIFICALLY SUPPORTED',
    icon: '✓',
    text: 'text-emerald-700',
    barColor: 'bg-emerald-500',
    border: 'border-emerald-500',
    leftBorder: 'border-l-emerald-500',
    assertionBg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  false: {
    color: '#cd2026',
    label: 'FALSE',
    icon: '✗',
    text: 'text-red-700',
    barColor: 'bg-red-500',
    border: 'border-red-500',
    leftBorder: 'border-l-red-500',
    assertionBg: 'bg-red-50',
    dot: 'bg-red-500',
  },
  misleading: {
    color: '#e5a000',
    label: 'MISLEADING',
    icon: '⚠',
    text: 'text-amber-700',
    barColor: 'bg-amber-500',
    border: 'border-amber-500',
    leftBorder: 'border-l-amber-500',
    assertionBg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  unverifiable: {
    color: '#5b616b',
    label: 'UNVERIFIABLE',
    icon: '?',
    text: 'text-slate-600',
    barColor: 'bg-slate-400',
    border: 'border-slate-400',
    leftBorder: 'border-l-slate-400',
    assertionBg: 'bg-slate-50',
    dot: 'bg-slate-400',
  },
} as const;

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'High Confidence',
  medium: 'Medium Confidence',
  low: 'Low Confidence',
};

interface Props {
  analysis: ClaimAnalysis;
  claim: string;
  onReset?: () => void;
}

export default function ResultCard({ analysis, claim, onReset }: Props) {
  const vc = VERDICT_CONFIG[analysis.verdict];
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  const getShareText = () => {
    const divider = '─'.repeat(40);
    const sourcesText = analysis.sources?.length
      ? '\n\nSources:\n' + analysis.sources.map((s, i) => `[${i + 1}] ${s.name}`).join('\n')
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

  const paras = analysis.explanation.split('\n').filter(p => p.trim());
  const hasMore = paras.length > 1;

  return (
    <div
      className="bg-white border border-[#d6d7d9] rounded-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${vc.color}` }}>

      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-bold leading-none" style={{ color: vc.color }}>
                {vc.icon} {vc.label}
              </span>
              {analysis.politicalCharge === 'high' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-sm border"
                  style={{ color: '#5b616b', borderColor: '#d6d7d9', background: '#f5f5f5' }}>
                  Contested
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: '#767676' }}>
              {CONFIDENCE_LABEL[analysis.confidence] ?? 'Confidence'} · {analysis.confidenceScore}%
              {analysis.category ? <span className="ml-2 capitalize">· {analysis.category}</span> : null}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={handleTweet}
              className="text-sm font-medium hover:underline hidden sm:block"
              style={{ color: '#0071bc' }}
              title="Share on X">X</button>
            <button onClick={handleShare}
              className="text-sm font-medium hover:underline"
              style={{ color: '#0071bc' }}
              title="Copy report">Share</button>
            {onReset && (
              <button onClick={onReset}
                className="text-sm font-medium hover:underline"
                style={{ color: '#0071bc' }}
                title="New check">New</button>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="h-1 rounded-full mt-3" style={{ background: '#e8f0fa' }}>
          <div className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${analysis.confidenceScore}%`, background: vc.color }} />
        </div>
      </div>

      {/* Claim */}
      <div className="px-8 py-5 border-t border-[#d6d7d9]">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#767676' }}>
          {analysis.extractedClaim && analysis.extractedClaim !== claim ? 'Core Claim Extracted' : 'Claim Analyzed'}
        </p>
        {analysis.extractedClaim && analysis.extractedClaim !== claim ? (
          <>
            <p className="text-base italic leading-relaxed" style={{ color: '#1b1b1b' }}>"{analysis.extractedClaim}"</p>
            <p className="text-sm mt-1 italic truncate" style={{ color: '#767676' }}>
              From: "{claim.substring(0, 80)}{claim.length > 80 ? '…' : ''}"
            </p>
          </>
        ) : (
          <p className="text-base italic leading-relaxed" style={{ color: '#1b1b1b' }}>"{claim}"</p>
        )}
      </div>

      {/* Warnings */}
      {(analysis.confidence === 'low' || analysis.politicalCharge === 'high') && (
        <div className="px-6 pb-2">
          {analysis.confidence === 'low' && analysis.politicalCharge !== 'high' && (
            <p className="text-sm" style={{ color: '#767676' }}>ℹ Low confidence — verify independently.</p>
          )}
          {analysis.politicalCharge === 'high' && (
            <p className="text-sm" style={{ color: '#767676' }}>⚡ Politically contested — apply extra scrutiny.</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="px-8 py-5 border-t border-[#d6d7d9]">
        <div className="pl-4 py-1 border-l-4" style={{ borderColor: vc.color }}>
          <p className="text-base font-semibold leading-relaxed" style={{ color: vc.color }}>
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Analysis */}
      <div className="px-8 py-6 border-t border-[#d6d7d9]">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#767676' }}>Analysis</p>
        <div className="space-y-4">
          <p className="text-base leading-loose" style={{ color: '#3d3d3d' }}>{paras[0]}</p>
          {hasMore && showFullExplanation && paras.slice(1).map((para, i) => (
            <p key={i} className="text-base leading-loose" style={{ color: '#3d3d3d' }}>{para}</p>
          ))}
          {hasMore && (
            <button
              onClick={() => setShowFullExplanation(v => !v)}
              className="text-sm font-medium hover:underline"
              style={{ color: '#0071bc' }}>
              {showFullExplanation ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>
      </div>

      {/* Sources */}
      {analysis.sources?.length > 0 && (
        <div className="px-8 py-5 border-t border-[#d6d7d9]">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#767676' }}>
            Sources · {analysis.sources.length} cited
          </p>
          <ol className="space-y-1 list-none">
            {analysis.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-1"
                  style={{ color: '#0071bc' }}>
                  {i + 1}. {s.name} <span style={{ color: '#767676' }}>↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-[#d6d7d9]" style={{ background: '#f5f7fa' }}>
        <p className="text-sm" style={{ color: '#767676' }}>
          Educational use only · Not medical advice
        </p>
      </div>

    </div>
  );
}
