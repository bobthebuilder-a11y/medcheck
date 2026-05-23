import type { ClaimAnalysis } from '../types';

export const VERDICT_CONFIG = {
  true: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    headerBg: 'bg-emerald-500',
    text: 'text-emerald-800',
    icon: '✅',
    label: 'TRUE',
    barColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  false: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    headerBg: 'bg-red-500',
    text: 'text-red-800',
    icon: '❌',
    label: 'FALSE',
    barColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    dot: 'bg-red-500',
  },
  misleading: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    headerBg: 'bg-amber-500',
    text: 'text-amber-800',
    icon: '⚠️',
    label: 'MISLEADING',
    barColor: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  unverifiable: {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    headerBg: 'bg-slate-500',
    text: 'text-slate-700',
    icon: '❓',
    label: 'UNVERIFIABLE',
    barColor: 'bg-slate-400',
    lightBg: 'bg-slate-50',
    dot: 'bg-slate-400',
  },
} as const;

export const CONFIDENCE_CONFIG = {
  high: { label: 'High Confidence', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
  medium: { label: 'Medium Confidence', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' },
  low: { label: 'Low Confidence', color: 'text-red-500', bg: 'bg-red-100', dot: 'bg-red-500' },
} as const;

interface Props {
  analysis: ClaimAnalysis;
  claim: string;
}

export default function ResultCard({ analysis, claim }: Props) {
  const vc = VERDICT_CONFIG[analysis.verdict];
  const cc = CONFIDENCE_CONFIG[analysis.confidence];

  const handleShare = async () => {
    const text = `MedCheck verdict on: "${claim}"\n\n${vc.icon} ${vc.label} (${analysis.confidenceScore}% confidence)\n${analysis.summary}\n\nVerify at: https://medcheck-murex.vercel.app`;
    if (navigator.share) {
      try { await navigator.share({ title: 'MedCheck Result', text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${vc.border} overflow-hidden shadow-sm`}>

      {/* Colored verdict header */}
      <div className={`${vc.headerBg} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{vc.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-black tracking-widest text-white">{vc.label}</span>
                {analysis.politicalCharge === 'high' && (
                  <span className="px-2 py-0.5 text-xs bg-white/20 text-white border border-white/30 rounded-full font-semibold" title="This topic intersects with political controversy. AI may be less reliable here — treat this verdict with extra scrutiny and verify from multiple sources.">
                    ⚡ Politically Charged
                  </span>
                )}
                {analysis.politicalCharge === 'low' && (
                  <span className="px-2 py-0.5 text-xs bg-white/15 text-white/80 border border-white/20 rounded-full font-medium" title="Some political context exists around this topic. Verify independently.">
                    ⚡ Some political context
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full bg-white/60`}></span>
                <span className="text-sm text-white/85 font-medium" title="Confidence reflects how certain the AI is in this verdict — not whether the claim is definitely true or false.">
                  {cc.label} · {analysis.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis.category && (
              <span className="px-2.5 py-1 text-xs bg-white/20 text-white border border-white/25 rounded-full font-medium capitalize hidden sm:inline-block">
                {analysis.category}
              </span>
            )}
            <button onClick={handleShare}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Share result">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">AI Certainty</span>
            <span className="text-xs text-white/60" title="How confident the AI is in this verdict. Lower = more uncertain. Always verify from sources.">What is this? ↑</span>
          </div>
          <div className="h-1.5 bg-white/25 rounded-full">
            <div className="h-1.5 bg-white/80 rounded-full transition-all duration-700"
              style={{ width: `${analysis.confidenceScore}%` }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`${vc.bg} px-5 py-5 space-y-5`}>

        {/* Claim */}
        <div className="bg-white/70 rounded-xl p-3 border border-gray-200/60">
          {analysis.extractedClaim && analysis.extractedClaim !== claim ? (
            <>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Core claim extracted</p>
              <p className="text-sm text-gray-800 italic leading-relaxed mb-2">"{analysis.extractedClaim}"</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">From your input</p>
              <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">"{claim}"</p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Claim analyzed</p>
              <p className="text-sm text-gray-800 italic leading-relaxed">"{claim}"</p>
            </>
          )}
        </div>

        {/* Political charge warning */}
        {analysis.politicalCharge === 'high' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2">
            <span className="shrink-0">⚡</span>
            <p className="text-xs text-purple-700 leading-relaxed">
              <strong>Politically charged topic:</strong> This claim intersects with active political controversy.
              AI reliability may be lower here — treat this verdict with extra scrutiny and verify from multiple independent sources.
            </p>
          </div>
        )}

        {/* Summary */}
        <p className={`text-sm font-semibold ${vc.text} leading-relaxed`}>{analysis.summary}</p>

        {/* Explanation */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Analysis</h3>
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
            {analysis.explanation.split('\n').filter(p => p.trim()).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Assertions */}
        {analysis.assertions?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Claim Breakdown · {analysis.assertions.length} Assertion{analysis.assertions.length !== 1 ? 's' : ''}
            </h3>
            <div className="space-y-2">
              {analysis.assertions.map((a, i) => {
                const ac = VERDICT_CONFIG[a.verdict];
                return (
                  <div key={i} className={`rounded-xl p-3.5 border ${ac.border} ${ac.bg}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">{ac.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${ac.text}`}>{ac.label}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mb-1.5 leading-relaxed">"{a.text}"</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{a.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sources */}
        {analysis.sources?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sources & References</h3>
            <div className="bg-white/60 rounded-xl border border-gray-200/60 divide-y divide-gray-100">
              {analysis.sources.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3">
                  <span className="text-blue-400 text-sm mt-0.5 shrink-0 font-bold">{i + 1}</span>
                  <div className="min-w-0">
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold line-clamp-1">
                      {s.name}
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.relevance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-white/50 rounded-xl p-3 border border-gray-200/60">
          <p className="text-xs text-gray-400 leading-relaxed">
            ⚕️ <strong className="text-gray-500">Medical Disclaimer:</strong> AI-generated for educational purposes only.
            Not a substitute for medical advice. Confidence scores reflect AI certainty.
            Always verify citations and consult qualified healthcare professionals.
          </p>
        </div>

      </div>
    </div>
  );
}
