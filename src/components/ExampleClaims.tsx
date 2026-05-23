const EXAMPLE_GROUPS = [
  {
    category: 'Vaccines',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    claims: [
      "Vaccines cause autism",
      "COVID-19 mRNA vaccines alter your DNA",
      "Natural immunity is always better than vaccines",
    ],
  },
  {
    category: 'COVID-19 & Treatments',
    color: 'text-red-700 bg-red-50 border-red-200',
    claims: [
      "Ivermectin is proven to cure COVID-19",
      "5G towers spread coronavirus",
      "Wearing masks causes oxygen deprivation",
    ],
  },
  {
    category: 'Cancer & Nutrition',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    claims: [
      "Eating sugar directly feeds cancer cells",
      "Vitamin C megadoses cure cancer",
      "Cell phones cause brain cancer",
    ],
  },
  {
    category: 'Try a viral post',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
    claims: [
      "🧵 BREAKING: New study shows ivermectin reduces COVID hospitalizations by 80%!! Big pharma doesn't want you to know this. Share before deleted! 👇",
    ],
  },
];

interface Props {
  onSelect: (claim: string) => void;
  onRandom?: (claim: string) => void;
}

export default function ExampleClaims({ onSelect, onRandom }: Props) {
  const allClaims = EXAMPLE_GROUPS.flatMap(g => g.claims).filter(c => !c.startsWith('🧵'));
  
  const handleRandom = () => {
    const random = allClaims[Math.floor(Math.random() * allClaims.length)];
    onRandom?.(random);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Check</p>
        {onRandom && (
          <button onClick={handleRandom}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
            ⟳ Random
          </button>
        )}
      </div>
      <div className="p-3 space-y-3">
        {EXAMPLE_GROUPS.map((group) => (
          <div key={group.category}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">{group.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.claims.map((claim) => (
                <button key={claim} onClick={() => onSelect(claim)}
                  className={`text-xs px-2.5 py-1.5 border rounded-md transition-all active:scale-95 font-medium text-left ${group.color} ${claim.length > 50 ? 'text-[11px] max-w-full' : ''}`}>
                  {claim.length > 65 ? claim.substring(0, 65) + '…' : claim}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
        <p className="text-[10px] text-slate-400">Click any claim to analyze it instantly</p>
      </div>
    </div>
  );
}
