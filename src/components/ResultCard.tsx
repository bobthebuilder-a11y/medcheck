import type { ClaimAnalysis } from '../types';

const VERDICT_CONFIG = {
  true: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    text: 'text-emerald-800',
    badgeBg: 'bg-emerald-500',
    icon: '✅',
    label: 'TRUE',
    barColor: 'bg-emerald-500',
  },
  false: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-800',
    badgeBg: 'bg-red-500',
    icon: '❌',
    label: 'FALSE',
    barColor: 'bg-red-500',
  },
  misleading: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-800',
    badgeBg: 'bg-amber-500',
    icon: '⚠️',
    label: 'MISLEADING',
    barColor: 'bg-amber-500',
  },
  unverifiable: {
    bg: 'bg-slate-50',
    border: 'border-slate-400',
    text: 'text-slate-700',
    badgeBg: 'bg-slate-500',
    icon: '❓',
    label: 'UNVERIFIABLE',
    barColor: 'bg-slate-400',
  },
};

const CONFIDENCE_CONFIG = {
  high: { label: 'High Confidence', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  medium: { label: 'Medium Confidence', color: 'text-amber-600', dot: 'bg-amber-500' },
  low: { label: 'Low Confidence', color: 'text-red-500', dot: 'bg-red-500' },
};

interface Props {
  analysis: ClaimAnalysis;
  claim: string;
}

export default function ResultCard({ analysis, claim }: Props) {
  const vc = VERDICT_CONFIG[analysis.verdict];
  const cc = CONFIDENCE_CONFIG[analysis.confidence];

  const handleShare = async () => {
    const text = `MedCheck verdict on: "${claim}"\n\n${vc.icon} ${vc.label}\n${analysis.summary}\n\nCheck claims at medcheck-murex.vercel.app`;
    if (navigator.share) {
      await navigator.share({ title: 'MedCheck Result', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${vc.border} ${vc.bg} overflow-hidden`}>
      {/* Verdict header */}
      <div className={`px-6 py-5 border-b ${vc.border} bg-white/50`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{vc.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xl font-black tracking-widest ${vc.text}`}>
                  {vc.label}
                </span>
                {analysis.politicalCharge === 'high' && (
                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 border border-purple-300 rounded-full font-semibold">
                    ⚡ Politically Charged
                  </span>
                )}
                {analysis.category && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full font-medium capitalize">
                    {analysis.category}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-1.5 mt-1`}>
                <span className={`w-2 h-2 rounded-full ${cc.dot}`}></span>
                <span className={`text-sm font-medium ${cc.color}`}>
                  {cc.label} · {analysis.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white/80 transition-colors shrink-0"
            title="Share result"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Confidence Level</span>
            <span>{analysis.confidenceScore}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div
              className={`h-1.5 rounded-full transition-all ${vc.barColor}`}
              style={{ width: `${analysis.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Claim */}
        <div className="bg-white/70 rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Claim analyzed</p>
          <p className="text-sm text-gray-800 italic">"{claim}"</p>
        </div>

        {/* Summary */}
        <p className={`text-sm font-semibold ${vc.text} leading-relaxed`}>
          {analysis.summary}
        </p>

        {/* Explanation */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Analysis</h3>
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
          {analysis.explanation.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        </div>

        {/* Assertions */}
        {analysis.assertions?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Claim Breakdown ({analysis.assertions.length} assertion{analysis.assertions.length !== 1 ? 's' : ''})
            </h3>
            <div className="space-y-2">
              {analysis.assertions.map((a, i) => {
                const ac = VERDICT_CONFIG[a.verdict];
                return (
                  <div key={i} className={`rounded-xl p-3 border ${ac.border} ${ac.bg}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{ac.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${ac.text}`}>{ac.label}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-800 mb-1">"{a.text}"</p>
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sources</h3>
            <div className="space-y-2">
              {analysis.sources.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 text-sm mt-0.5 shrink-0">↗</span>
                  <div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {s.name}
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">{s.relevance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            ⚕️ <strong>Medical Disclaimer:</strong> This analysis is AI-generated for educational purposes only. 
            Confidence scores reflect AI certainty, not absolute truth. Always consult qualified healthcare 
            professionals for medical decisions. Sources should be independently verified.
          </p>
        </div>
      </div>
    </div>
  );
}
