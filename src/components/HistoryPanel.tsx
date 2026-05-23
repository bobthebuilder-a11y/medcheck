import type { HistoryEntry } from '../types';

const VERDICT_ICONS: Record<string, string> = {
  true: '✅', false: '❌', misleading: '⚠️', unverifiable: '❓',
};
const VERDICT_COLORS: Record<string, string> = {
  true: 'text-emerald-600', false: 'text-red-600',
  misleading: 'text-amber-600', unverifiable: 'text-slate-500',
};

function exportHistory(history: HistoryEntry[]) {
  const lines = [
    '🔬 MEDCHECK SESSION REPORT',
    '═'.repeat(50),
    `Generated: ${new Date().toLocaleString()}`,
    `Claims checked: ${history.length}`,
    '',
    ...history.flatMap((e, i) => [
      `${i + 1}. "${e.claim}"`,
      `   Verdict: ${VERDICT_ICONS[e.analysis.verdict]} ${e.analysis.verdict.toUpperCase()} (${e.analysis.confidenceScore}% confidence)`,
      `   Summary: ${e.analysis.summary}`,
      '',
    ]),
    '─'.repeat(50),
    'MedCheck AI · https://medcheck-murex.vercel.app',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'medcheck-report.txt'; a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => exportHistory(history)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors font-medium">
            Export ↓
          </button>
          <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
            Clear
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {history.slice(0, 5).map((entry) => (
          <button key={entry.id} onClick={() => onSelect(entry)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left transition-colors group">
            <span className="text-sm shrink-0 leading-none">{VERDICT_ICONS[entry.analysis.verdict]}</span>
            <p className="text-xs text-slate-700 truncate flex-1 group-hover:text-blue-600 transition-colors">
              {entry.claim}
            </p>
            <span className={`text-[10px] font-bold capitalize shrink-0 ${VERDICT_COLORS[entry.analysis.verdict]}`}>
              {entry.analysis.confidenceScore}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
