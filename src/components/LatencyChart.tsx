'use client';

import { useLatency } from '@/context/LatencyContext';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RANGES = [
  { label: "1h", points: 720 },      // 60 min * 60 sec / 5 sec interval ≈ 720 samples
  { label: "24h", points: 720 * 24 },
  { label: "7d", points: 720 * 24 * 7 },
  { label: "30d", points: 720 * 24 * 30 },
];

export default function LatencyChart({ exchange, onClose }: { exchange: string | null, onClose: () => void }) {
  const { history } = useLatency();
  const [range, setRange] = useState(RANGES[0]); // default = 1h

  if (!exchange) return null;

  // Flatten + filter to selected exchange
  let data = history
    .flatMap(snapshot => snapshot.filter(a => a.exchange === exchange))
    .slice(-range.points) // apply time range
    .map(a => ({
      time: new Date(a.timestamp).toLocaleTimeString(),
      latency: a.latency
    }));

  if (data.length === 0) return null;

  const minLatency = Math.min(...data.map(d => d.latency));
  const maxLatency = Math.max(...data.map(d => d.latency));
  const avgLatency = Math.round(data.reduce((acc, v) => acc + v.latency, 0) / data.length);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200]">
      <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 w-[90%] max-w-2xl shadow-xl text-white relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">{exchange} — Latency Trends</h2>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-sm border ${
                range.label === r.label
                  ? "bg-blue-600 border-blue-500"
                  : "bg-[#1f2937] border-gray-600 hover:border-gray-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm mb-4">
          <div>Min: <span className="text-green-400">{minLatency}ms</span></div>
          <div>Max: <span className="text-red-400">{maxLatency}ms</span></div>
          <div>Avg: <span className="text-yellow-400">{avgLatency}ms</span></div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
              <Line type="monotone" dataKey="latency" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
