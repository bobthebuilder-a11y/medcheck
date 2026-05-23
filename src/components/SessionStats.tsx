import type { HistoryEntry } from '../types';

interface Props {
  history: HistoryEntry[];
}

const VERDICT_ICONS: Record<string, string> = {
  true: '✅',
  false: '❌',
  misleading: '⚠️',
  unverifiable: '❓',
};

export default function SessionStats({ history }: Props) {
  if (history.length < 2) return null;

  const counts = history.reduce((acc, e) => {
    acc[e.analysis.verdict] = (acc[e.analysis.verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgConfidence = Math.round(
    history.reduce((sum, e) => sum + e.analysis.confidenceScore, 0) / history.length
  );

  const politicalCount = history.filter(e => e.analysis.politicalCharge === 'high').length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Session Summary · {history.length} claims checked
      </p>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(['false', 'misleading', 'true', 'unverifiable'] as const).map(verdict => (
          <div key={verdict} className="text-center">
            <div className="text-xl mb-0.5">{VERDICT_ICONS[verdict]}</div>
            <div className="text-lg font-black text-gray-800">{counts[verdict] || 0}</div>
            <div className="text-xs text-gray-400 capitalize">{verdict}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span>Avg confidence: <strong className="text-gray-700">{avgConfidence}%</strong></span>
        {politicalCount > 0 && (
          <span>⚡ <strong className="text-gray-700">{politicalCount}</strong> politically charged</span>
        )}
      </div>
    </div>
  );
}
