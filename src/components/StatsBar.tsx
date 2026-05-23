const STATS = [
  { value: '6×', label: 'Faster spread', sub: 'False claims vs. corrections on social media', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { value: '30M+', label: 'Americans at risk', sub: 'Making health decisions from unverified social media', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { value: '1 in 3', label: 'People misled', sub: 'Have acted on unverified health advice online', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: '<3s', label: 'To read a false claim', sub: '20 minutes to manually fact-check it', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
];

export default function StatsBar() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-slate-200"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">The Scale of the Problem</p>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {STATS.map((stat) => (
          <div key={stat.value} className={`${stat.bg} border ${stat.border} rounded-lg p-3.5`}>
            <div className={`text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
            <div className="text-xs font-bold text-slate-700">{stat.label}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{stat.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">WHO · Pew Research · Johns Hopkins</p>
    </div>
  );
}
