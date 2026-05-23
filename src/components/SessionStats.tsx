import type { HistoryEntry } from '../types';

interface Props { history: HistoryEntry[]; }

const VERDICT_CONFIG = {
  false: { icon: '❌', color: 'text-red-600', bar: 'bg-red-500', label: 'False' },
  misleading: { icon: '⚠️', color: 'text-amber-600', bar: 'bg-amber-500', label: 'Misleading' },
  true: { icon: '✅', color: 'text-emerald-600', bar: 'bg-emerald-500', label: 'True' },
  unverifiable: { icon: '❓', color: 'text-slate-500', bar: 'bg-slate-400', label: 'Unclear' },
};

export default function SessionStats({ history }: Props) {
  if (history.length < 2) return null;

  const total = history.length;
  const counts = history.reduce((acc, e) => {
    acc[e.analysis.verdict] = (acc[e.analysis.verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avg = Math.round(history.reduce((s, e) => s + e.analysis.confidenceScore, 0) / total);
  const charged = history.filter(e => e.analysis.politicalCharge === 'high').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Summary</p>
        <span className="text-xs text-slate-400 font-medium">{total} claims analyzed</span>
      </div>

      {/* Distribution bar */}
      <div className="h-2 rounded-full overflow-hidden flex gap-0.5 mb-3">
        {(['false', 'misleading', 'true', 'unverifiable'] as const).map(v => {
          const count = counts[v] || 0;
          if (count === 0) return null;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={v} className={`${VERDICT_CONFIG[v].bar} rounded-full`}
              style={{ width: `${pct}%` }} title={`${VERDICT_CONFIG[v].label}: ${count}`} />
          );
        })}
      </div>

      {/* Count grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(['false', 'misleading', 'true', 'unverifiable'] as const).map(v => (
          <div key={v} className="text-center">
            <div className="text-base mb-0.5">{VERDICT_CONFIG[v].icon}</div>
            <div className={`text-base font-black ${VERDICT_CONFIG[v].color}`}>{counts[v] || 0}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{VERDICT_CONFIG[v].label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
        <span>Avg confidence: <strong className="text-slate-700">{avg}%</strong></span>
        {charged > 0 && (
          <span className="text-purple-600">⚡ {charged} contested</span>
        )}
      </div>
    </div>
  );
}
