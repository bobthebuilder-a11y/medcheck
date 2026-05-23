import type { ClaimAnalysis } from '../types';

const VERDICT_COLORS = {
  true: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800', badge: 'bg-green-500', icon: '✅' },
  false: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800', badge: 'bg-red-500', icon: '❌' },
  misleading: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800', badge: 'bg-yellow-500', icon: '⚠️' },
  unverifiable: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', badge: 'bg-gray-500', icon: '❓' },
};

const CONFIDENCE_LABELS = {
  high: { label: 'High Confidence', color: 'text-green-600' },
  medium: { label: 'Medium Confidence', color: 'text-yellow-600' },
  low: { label: 'Low Confidence', color: 'text-red-600' },
};

interface Props {
  analysis: ClaimAnalysis;
  claim: string;
}

export default function ResultCard({ analysis, claim }: Props) {
  const colors = VERDICT_COLORS[analysis.verdict];
  const confidenceInfo = CONFIDENCE_LABELS[analysis.confidence];

  return (
    <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 space-y-5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{colors.icon}</span>
            <span className={`text-xl font-bold uppercase tracking-wide ${colors.text}`}>
              {analysis.verdict}
            </span>
            {analysis.politicalCharge === 'high' && (
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 border border-purple-300 rounded-full font-medium">
                Politically Charged
              </span>
            )}
          </div>
          <p className={`text-sm font-medium ${confidenceInfo.color}`}>
            {confidenceInfo.label} ({analysis.confidenceScore}%)
          </p>
        </div>
        {/* Confidence bar */}
        <div className="w-24 shrink-0">
          <div className="text-xs text-gray-500 mb-1 text-right">Confidence</div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${analysis.confidence === 'high' ? 'bg-green-500' : analysis.confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${analysis.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={`text-sm font-semibold ${colors.text} italic`}>
        "{analysis.summary}"
      </div>

      {/* Claim being checked */}
      <div className="bg-white/60 rounded-xl p-3 border border-gray-200">
        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Claim analyzed</p>
        <p className="text-sm text-gray-800">"{claim}"</p>
      </div>

      {/* Explanation */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">Analysis</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{analysis.explanation}</p>
      </div>

      {/* Assertions */}
      {analysis.assertions?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">Claim Breakdown</h3>
          <div className="space-y-2">
            {analysis.assertions.map((a, i) => {
              const ac = VERDICT_COLORS[a.verdict];
              return (
                <div key={i} className={`rounded-xl p-3 border ${ac.border} ${ac.bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{ac.icon}</span>
                    <span className={`text-xs font-bold uppercase ${ac.text}`}>{a.verdict}</span>
                  </div>
                  <p className="text-xs text-gray-800 font-medium mb-1">"{a.text}"</p>
                  <p className="text-xs text-gray-600">{a.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources */}
      {analysis.sources?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">Sources</h3>
          <div className="space-y-2">
            {analysis.sources.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-blue-500 mt-0.5">🔗</span>
                <div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {s.name}
                  </a>
                  <p className="text-gray-500">{s.relevance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 border-t border-gray-200 pt-3">
        ⚕️ This is AI-generated analysis for educational purposes. Always consult healthcare professionals for medical decisions.
      </p>
    </div>
  );
}
