const RELATED_BY_CATEGORY: Record<string, string[]> = {
  vaccines: [
    "Vaccines cause autism",
    "COVID-19 mRNA vaccines alter your DNA",
    "Natural immunity is always better than vaccines",
  ],
  medications: [
    "Ivermectin is proven to cure COVID-19",
    "Antibiotics can cure viral infections",
    "Hydroxychloroquine cures COVID-19",
  ],
  'COVID-19': [
    "5G towers spread coronavirus",
    "Wearing masks causes oxygen deprivation",
    "COVID-19 vaccines contain microchips",
  ],
  nutrition: [
    "Vitamin C megadoses cure cancer",
    "Eating sugar directly feeds cancer cells",
    "Sunscreen causes vitamin D deficiency",
  ],
  cancer: [
    "Eating sugar directly feeds cancer cells",
    "Vitamin C megadoses cure cancer",
    "Cell phones cause brain cancer",
  ],
  'general health': [
    "You can sweat out a fever",
    "Humans only use 10% of their brains",
    "We only use 10% of our brain capacity",
  ],
};

interface Props {
  category?: string;
  currentClaim: string;
  onSelect: (claim: string) => void;
}

export default function RelatedClaims({ category, currentClaim, onSelect }: Props) {
  if (!category) return null;
  
  const related = (RELATED_BY_CATEGORY[category] || [])
    .filter(c => c.toLowerCase() !== currentClaim.toLowerCase())
    .slice(0, 3);
    
  if (related.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Related claims to check
      </p>
      <div className="space-y-2">
        {related.map(claim => (
          <button
            key={claim}
            onClick={() => onSelect(claim)}
            className="w-full text-left text-xs text-gray-600 hover:text-blue-600 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-blue-400 shrink-0">→</span>
            <span>"{claim}"</span>
          </button>
        ))}
      </div>
    </div>
  );
}
