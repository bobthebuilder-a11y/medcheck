import type { HistoryEntry } from '../types';

interface Props { history: HistoryEntry[]; }


export default function SessionStats({ history }: Props) {
  if (history.length < 2) return null;

  const total = history.length;
  const counts = history.reduce((acc, e) => {
    acc[e.analysis.verdict] = (acc[e.analysis.verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avg = Math.round(history.reduce((s, e) => s + e.analysis.confidenceScore, 0) / total);
  const charged = history.filter(e => e.analysis.politicalCharge === 'high').length;

  const parts = [
    `${total} checked`,
    counts['false'] ? `${counts['false']} false` : null,
    counts['misleading'] ? `${counts['misleading']} misleading` : null,
    counts['true'] ? `${counts['true']} true` : null,
    counts['unverifiable'] ? `${counts['unverifiable']} unverifiable` : null,
    `${avg}% avg confidence`,
    charged > 0 ? `${charged} contested` : null,
  ].filter(Boolean);

  return (
    <p className="text-xs text-slate-400 px-1">{parts.join(' · ')}</p>
  );
}
