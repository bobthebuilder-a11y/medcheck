import type { HistoryEntry } from '../types';

const VERDICT_ICONS: Record<string, string> = {
  true: '✅',
  false: '❌',
  misleading: '⚠️',
  unverifiable: '❓',
};

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Checks</h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {history.slice(0, 5).map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 text-left transition-colors group"
          >
            <span className="text-lg shrink-0">{VERDICT_ICONS[entry.analysis.verdict]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-700 truncate font-medium group-hover:text-blue-600">
                {entry.claim}
              </p>
              <p className="text-xs text-gray-400 capitalize">{entry.analysis.verdict} · {entry.analysis.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
