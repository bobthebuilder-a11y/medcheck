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
  { text: "Drinking bleach cures infections", category: "COVID-19", hot: true },
  { text: "Cell phones cause brain cancer", category: "cancer" },
  { text: "Sunscreen causes vitamin D deficiency", category: "nutrition" },
  { text: "Antibiotics can cure viral infections", category: "medications" },
  { text: "You can sweat out a fever", category: "general health" },
];

const CATEGORY_STYLES: Record<string, string> = {
  vaccines: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
  medications: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  'COVID-19': 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  nutrition: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  cancer: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  neuroscience: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  'general health': 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
};

interface Props {
  onSelect: (claim: string) => void;
}

export default function ExampleClaims({ onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold shrink-0">Try an example</p>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.text}
            onClick={() => onSelect(ex.text)}
            className={`text-xs px-3 py-1.5 border rounded-full transition-all hover:shadow-sm font-medium flex items-center gap-1.5 ${
              CATEGORY_STYLES[ex.category] || 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {ex.hot && <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></span>}
            {ex.text}
          </button>
        ))}
      </div>
    </div>
  );
}
