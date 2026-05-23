// Pre-verified trending health misinformation claims
// These were verified by MedCheck AI and cached for fast display

const TRENDING = [
  {
    claim: 'Vaccines cause autism',
    verdict: 'false' as const,
  },
  {
    claim: '5G towers spread coronavirus',
    verdict: 'false' as const,
  },
  {
    claim: 'Natural immunity is always better than vaccines',
    verdict: 'misleading' as const,
  },
];

const VERDICT_COLORS: Record<string, string> = {
  true: '#2e8540',
  false: '#cd2026',
  misleading: '#e5a000',
  unverifiable: '#5b616b',
};

const VERDICT_ICONS: Record<string, string> = {
  true: '✓', false: '✗', misleading: '⚠', unverifiable: '?',
};

interface Props {
  onSelect: (claim: string) => void;
}

export default function TrendingClaims({ onSelect }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#767676' }}>
        Try an Example
      </p>
      <div>
        {TRENDING.map((item) => (
          <button key={item.claim} onClick={() => onSelect(item.claim)}
            className="w-full text-left flex items-center justify-between py-2 border-b border-[#d6d7d9] last:border-0 group hover:bg-[#f5f7fa] px-1 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-bold shrink-0" style={{ color: VERDICT_COLORS[item.verdict] }}>
                {VERDICT_ICONS[item.verdict]}
              </span>
              <p className="text-sm truncate" style={{ color: '#3d3d3d' }}>{item.claim}</p>
            </div>
            <span className="text-sm font-medium ml-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#0071bc' }}>
              Check →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
