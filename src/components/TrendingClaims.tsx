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

const VERDICT_STYLES = {
  true: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  false: 'bg-red-50 border-red-200 text-red-700',
  misleading: 'bg-amber-50 border-amber-200 text-amber-700',
  unverifiable: 'bg-slate-50 border-slate-200 text-slate-600',
};

const VERDICT_ICONS = {
  true: '✅', false: '❌', misleading: '⚠️', unverifiable: '❓',
};

interface Props {
  onSelect: (claim: string) => void;
}

export default function TrendingClaims({ onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-sm">🔥</span>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Most Checked Claims</p>
      </div>
      <div className="divide-y divide-slate-50">
        {TRENDING.map((item) => (
          <button key={item.claim} onClick={() => onSelect(item.claim)}
            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 font-medium group-hover:text-blue-600 truncate">
                  {item.claim}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">{item.summary}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold border rounded-full px-2 py-0.5 shrink-0 mt-0.5 ${VERDICT_STYLES[item.verdict]}`}>
                <span>{VERDICT_ICONS[item.verdict]}</span>
                <span>{item.verdict.toUpperCase()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
        <p className="text-[10px] text-slate-400">Pre-verified by MedCheck AI · Click to analyze fresh</p>
      </div>
    </div>
  );
}
