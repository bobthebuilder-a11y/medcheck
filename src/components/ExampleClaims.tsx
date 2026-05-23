const EXAMPLES = [
  { text: "Vaccines cause autism", category: "vaccines", hot: true },
  { text: "COVID-19 mRNA vaccines alter your DNA", category: "vaccines", hot: true },
  { text: "Natural immunity is always better than vaccines", category: "vaccines", hot: true },
  { text: "Ivermectin is proven to cure COVID-19", category: "medications" },
  { text: "5G towers spread coronavirus", category: "COVID-19" },
  { text: "Vitamin C megadoses cure cancer", category: "nutrition" },
  { text: "Wearing masks causes oxygen deprivation", category: "COVID-19" },
  { text: "Eating sugar directly feeds cancer cells", category: "cancer" },
  { text: "Humans only use 10% of their brains", category: "neuroscience" },
  { text: "Cell phones cause brain cancer", category: "cancer" },
  { text: "Antibiotics can cure viral infections", category: "medications" },
  { text: "You can sweat out a fever", category: "general health" },
  { text: "🧵 BREAKING: New study shows ivermectin reduces COVID hospitalizations by 80%!! Big pharma doesn't want you to know this. Share before deleted! 👇", category: "COVID-19", hot: true },
];

const CATEGORY_STYLES: Record<string, string> = {
  vaccines: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  medications: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  'COVID-19': 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  nutrition: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  cancer: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  neuroscience: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  'general health': 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
};

interface Props {
  onSelect: (claim: string) => void;
  onRandom?: (claim: string) => void;
}

export default function ExampleClaims({ onSelect, onRandom }: Props) {
  const handleRandom = () => {
    const nonSocial = EXAMPLES.filter(e => !e.text.startsWith('🧵'));
    const random = nonSocial[Math.floor(Math.random() * nonSocial.length)];
    onRandom?.(random.text);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Check</p>
        {onRandom && (
          <button onClick={handleRandom}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1">
            ⟳ Random
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.text}
            onClick={() => onSelect(ex.text)}
            className={`text-xs px-2.5 py-1.5 border rounded-lg transition-all active:scale-95 font-medium flex items-center gap-1 max-w-full text-left ${
              CATEGORY_STYLES[ex.category] || 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            } ${ex.text.length > 50 ? 'text-[11px]' : ''}`}
          >
            {ex.hot && <span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0"></span>}
            <span className="truncate">{ex.text.length > 60 ? ex.text.substring(0, 60) + '…' : ex.text}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-3">Click any claim to analyze it instantly</p>
    </div>
  );
}
