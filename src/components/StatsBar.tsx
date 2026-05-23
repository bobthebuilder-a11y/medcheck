const STATS = [
  { value: '30M+', label: 'Uninsured Americans affected by health misinfo' },
  { value: '6×', label: 'Faster than corrections, false claims spread on social media' },
  { value: '1 in 3', label: 'Americans have acted on unverified social media health advice' },
  { value: '3s', label: 'To read a false claim vs. 20 min to manually fact-check it' },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {STATS.map((stat) => (
        <div key={stat.value} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-xl font-black text-blue-600">{stat.value}</div>
          <div className="text-xs text-gray-500 leading-tight mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
