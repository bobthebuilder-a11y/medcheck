import type { HistoryEntry } from '../types';

const VERDICT_COLORS: Record<string, string> = {
  true: '#2e8540',
  false: '#cd2026',
  misleading: '#e5a000',
  unverifiable: '#5b616b',
};

const VERDICT_ICONS: Record<string, string> = {
  true: '✓', false: '✗', misleading: '⚠', unverifiable: '?',
};

function exportHistory(history: HistoryEntry[]) {
  const lines = [
    'MEDCHECK SESSION REPORT',
    '═'.repeat(50),
    `Generated: ${new Date().toLocaleString()}`,
    `Claims checked: ${history.length}`,
    '',
    ...history.flatMap((e, i) => [
      `${i + 1}. "${e.claim}"`,
      `   Verdict: ${e.analysis.verdict.toUpperCase()} (${e.analysis.confidenceScore}% confidence)`,
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
    <div className="bg-white border border-[#d6d7d9] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#d6d7d9]">
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#767676' }}>Recent Checks</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => exportHistory(history)}
            className="text-sm font-medium hover:underline" style={{ color: '#0071bc' }}>
            Export
          </button>
          <button onClick={onClear}
            className="text-sm font-medium hover:underline" style={{ color: '#767676' }}>
            Clear
          </button>
        </div>
      </div>
      <div>
        {history.slice(0, 5).map((entry) => (
          <button key={entry.id} onClick={() => onSelect(entry)}
            className="w-full flex items-center gap-3 px-4 py-2 border-b border-[#d6d7d9] last:border-0 hover:bg-[#f5f7fa] text-left transition-colors">
            <span className="text-sm font-bold shrink-0"
              style={{ color: VERDICT_COLORS[entry.analysis.verdict] ?? '#5b616b' }}>
              {VERDICT_ICONS[entry.analysis.verdict] ?? '?'}
            </span>
            <p className="text-sm flex-1 truncate" style={{ color: '#3d3d3d' }}>
              {entry.claim}
            </p>
            <span className="text-sm shrink-0" style={{ color: '#767676' }}>
              {entry.analysis.confidenceScore}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
