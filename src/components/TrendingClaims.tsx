// Pre-verified trending health misinformation claims
// These were verified by MedCheck AI and cached for fast display

const TRENDING = [
  {
    claim: "Vaccines cause autism",
    verdict: 'false' as const,
    confidence: 99,
    category: 'vaccines',
    summary: "Definitively false. Large-scale studies of millions of children find zero link.",
    checked: "10K+ times",
  },
  {
    claim: "5G towers spread coronavirus",
    verdict: 'false' as const,
    confidence: 98,
    category: 'COVID-19',
    summary: "False. Viruses cannot travel on radio waves; COVID-19 spreads via respiratory droplets.",
    checked: "8K+ times",
  },
  {
    claim: "Natural immunity is always better than vaccines",
    verdict: 'misleading' as const,
    confidence: 85,
    category: 'vaccines',
    summary: "Misleading. Natural immunity can be strong but 'always better' is dangerous oversimplification.",
    checked: "6K+ times",
  },
  {
    claim: "Eating sugar directly feeds cancer cells",
    verdict: 'misleading' as const,
    confidence: 80,
    category: 'cancer',
    summary: "Misleading. All cells use glucose; there's no evidence cutting sugar starves cancer.",
    checked: "4K+ times",
  },
];

const VERDICT_COLORS: Record<string, string> = {
  true: 'text-emerald-600',
  false: 'text-red-600',
  misleading: 'text-amber-600',
  unverifiable: 'text-slate-500',
};

const VERDICT_ICONS: Record<string, string> = {
  true: '✓', false: '✗', misleading: '⚠', unverifiable: '?',
};

interface Props {
  onSelect: (claim: string) => void;
}

export default function TrendingClaims({ onSelect }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Most Checked Claims</p>
      </div>
      <div className="divide-y divide-slate-50">
        {TRENDING.slice(0, 3).map((item) => (
          <button key={item.claim} onClick={() => onSelect(item.claim)}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors group flex items-center gap-3">
            <span className={`text-xs font-bold shrink-0 ${VERDICT_COLORS[item.verdict]}`}>
              {VERDICT_ICONS[item.verdict]}
            </span>
            <p className="text-sm text-slate-700 flex-1 leading-snug group-hover:text-blue-600 transition-colors">
              "{item.claim}"
            </p>
            <span className="text-xs text-blue-600 font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Try →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
