export default function Legend({ providerColors }: { providerColors: Record<string,string> }) {
  return (
    <div className="hidden md:block absolute bottom-28 left-4 z-20 w-44 md:left-5 md:bottom-9">
      <div className="bg-gradient-to-br from-slate-900/75 to-slate-800/40 backdrop-blur-md border border-gray-700/60 rounded-2xl px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-sm font-semibold">Legend</h3>
        </div>

        <div className="h-px bg-white/6 my-2" />

        <ul className="space-y-2">
          {Object.entries(providerColors).map(([name, color]) => (
            <li key={name} className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-white/8"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-200">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
