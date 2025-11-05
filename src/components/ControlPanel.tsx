'use client';
import { exchanges } from '@/data/exchanges';

export default function ControlPanel({
  onToggleArcs,
  arcsEnabled,
  providerFilter,
  setProviderFilter,
  exchangeFilter,
  setExchangeFilter
}: any) {

  const uniqueProviders = ["AWS", "GCP", "Azure"];
  const uniqueExchanges = exchanges.map(ex => ex.name);

  return (
    <div
      className="
        absolute top-5 right-5 z-30
        bg-[#0f172a]/90 backdrop-blur-md
        border border-gray-700/50 shadow-lg
        rounded-xl px-5 py-4
        text-gray-200 w-56
      "
    >
      <h3 className="font-semibold text-lg mb-3 border-b border-gray-600 pb-1">
        Controls
      </h3>

      {/* Provider Filter */}
      <label className="text-sm">Cloud Provider</label>
      <select
        value={providerFilter}
        onChange={(e) => setProviderFilter(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-1 mt-1 mb-3 text-sm"
      >
        <option value="ALL">All</option>
        {uniqueProviders.map(p => <option key={p}>{p}</option>)}
      </select>

      {/* Exchange Filter */}
      <label className="text-sm">Exchange</label>
      <select
        value={exchangeFilter}
        onChange={(e) => setExchangeFilter(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-1 mt-1 mb-3 text-sm"
      >
        <option value="ALL">All</option>
        {uniqueExchanges.map(e => <option key={e}>{e}</option>)}
      </select>

      {/* Toggle Arcs */}
      <button
        onClick={onToggleArcs}
        className="w-full text-center mt-2 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition text-sm"
      >
        {arcsEnabled ? "Hide Latency Arcs" : "Show Latency Arcs"}
      </button>

    </div>
  );
}
