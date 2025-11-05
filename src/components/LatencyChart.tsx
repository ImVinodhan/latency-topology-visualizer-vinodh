'use client';

import { useLatency } from '@/context/LatencyContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LatencyChart({ exchange, onClose }: { exchange: string | null, onClose: () => void }) {
    const { history } = useLatency();

    if (!exchange) return null;

    // Extract historical values for the selected exchange
    const data = history
        .flatMap(snapshot => snapshot.filter(a => a.exchange === exchange))
        .map(a => ({
            time: new Date(a.timestamp).toLocaleTimeString(),
            latency: a.latency
        }));

    const minLatency = Math.min(...data.map(d => d.latency));
    const maxLatency = Math.max(...data.map(d => d.latency));
    const avgLatency = Math.round(data.reduce((acc, v) => acc + v.latency, 0) / data.length);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200]">
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 w-[90%] max-w-2xl shadow-xl text-white relative">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg cursor-pointer"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">{exchange} — Latency Trends</h2>

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
