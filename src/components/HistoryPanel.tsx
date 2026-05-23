import type { HistoryEntry } from '../types';

const VERDICT_ICONS: Record<string, string> = {
  true: '✅',
  false: '❌',
  misleading: '⚠️',
  unverifiable: '❓',
};

const VERDICT_COLORS: Record<string, string> = {
  true: 'text-emerald-600',
  false: 'text-red-600',
  misleading: 'text-amber-600',
  unverifiable: 'text-slate-500',
};

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Checks</h3>
        <button onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
          Clear all
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {history.slice(0, 5).map((entry) => (
          <button key={entry.id} onClick={() => onSelect(entry)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors group">
            <span className="text-xl shrink-0">{VERDICT_ICONS[entry.analysis.verdict]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700 truncate font-medium group-hover:text-blue-600 transition-colors">
                {entry.claim}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-semibold capitalize ${VERDICT_COLORS[entry.analysis.verdict]}`}>
                  {entry.analysis.verdict}
                </span>
                {entry.analysis.category && (
                  <span className="text-xs text-gray-400">· {entry.analysis.category}</span>
                )}
                <span className="text-xs text-gray-300">· {entry.analysis.confidenceScore}%</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
