const EXAMPLES = [
  "Vaccines cause autism",
  "Drinking bleach cures COVID-19",
  "Vitamin C megadoses cure cancer",
  "5G towers spread coronavirus",
  "The COVID-19 mRNA vaccine alters your DNA",
  "Ivermectin is proven to cure COVID-19",
  "Wearing masks causes oxygen deprivation",
  "Natural immunity is always better than vaccine immunity",
];

interface Props {
  onSelect: (claim: string) => void;
}

export default function ExampleClaims({ onSelect }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Try an example claim</p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => onSelect(example)}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-full text-gray-600 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
