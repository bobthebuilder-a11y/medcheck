const STATS = [
  { value: '6×', label: 'Faster than corrections', sub: 'False claims spread on social media', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { value: '30M+', label: 'Americans at risk', sub: 'Making health decisions from unverified social media', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { value: '1 in 3', label: 'Americans misled', sub: 'Have acted on unverified health advice online', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: '<3s', label: 'To read a false claim', sub: 'vs. 20 minutes to manually fact-check it', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export default function StatsBar() {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3 text-center">The Scale of the Problem</p>
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => (
          <div key={stat.value} className={`${stat.bg} border ${stat.border} rounded-xl p-4`}>
            <div className={`text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
            <div className="text-xs font-bold text-gray-700">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Sources: WHO · Pew Research · Johns Hopkins</p>
    </div>
  );
}
