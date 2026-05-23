const EXAMPLES = [
  { text: "Vaccines cause autism", category: "vaccines" },
  { text: "COVID-19 mRNA vaccines alter your DNA", category: "vaccines" },
  { text: "Natural immunity is always better than vaccines", category: "vaccines" },
  { text: "Ivermectin is proven to cure COVID-19", category: "medications" },
  { text: "Drinking bleach cures COVID-19", category: "COVID-19" },
  { text: "5G towers spread coronavirus", category: "COVID-19" },
  { text: "Vitamin C megadoses cure cancer", category: "nutrition" },
  { text: "Wearing masks causes oxygen deprivation", category: "COVID-19" },
  { text: "Eating sugar directly feeds cancer cells", category: "cancer" },
  { text: "Humans only use 10% of their brains", category: "neuroscience" },
];

const CATEGORY_COLORS: Record<string, string> = {
  vaccines: 'bg-blue-100 text-blue-700 border-blue-200',
  medications: 'bg-purple-100 text-purple-700 border-purple-200',
  'COVID-19': 'bg-red-100 text-red-700 border-red-200',
  nutrition: 'bg-green-100 text-green-700 border-green-200',
  cancer: 'bg-orange-100 text-orange-700 border-orange-200',
  neuroscience: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

interface Props {
  onSelect: (claim: string) => void;
}

export default function ExampleClaims({ onSelect }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
        Try an example claim
      </p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.text}
            onClick={() => onSelect(ex.text)}
            className={`text-xs px-3 py-1.5 border rounded-full transition-all hover:scale-105 hover:shadow-sm font-medium ${CATEGORY_COLORS[ex.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
          >
            {ex.text}
          </button>
        ))}
      </div>
    </div>
  );
}
