import type { HistoryEntry } from '../types';

interface Props { history: HistoryEntry[]; }

const VERDICT_ICONS: Record<string, string> = {
  true: '✅', false: '❌', misleading: '⚠️', unverifiable: '❓',
};

export default function SessionStats({ history }: Props) {
  if (history.length < 2) return null;

  const counts = history.reduce((acc, e) => {
    acc[e.analysis.verdict] = (acc[e.analysis.verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avg = Math.round(history.reduce((s, e) => s + e.analysis.confidenceScore, 0) / history.length);
  const charged = history.filter(e => e.analysis.politicalCharge === 'high').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        Session · {history.length} claims checked
      </p>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(['false', 'misleading', 'true', 'unverifiable'] as const).map(v => (
          <div key={v} className="text-center">
            <div className="text-lg mb-0.5">{VERDICT_ICONS[v]}</div>
            <div className="text-base font-black text-slate-800">{counts[v] || 0}</div>
            <div className="text-[10px] text-slate-400 capitalize leading-tight mt-0.5">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span>Avg confidence: <strong className="text-slate-700">{avg}%</strong></span>
        {charged > 0 && (
          <span>⚡ <strong className="text-slate-700">{charged}</strong> politically contested</span>
        )}
      </div>
    </div>
  );
}
