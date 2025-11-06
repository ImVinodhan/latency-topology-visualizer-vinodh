"use client";

import { useState } from 'react';
import { Exchange } from "@/types/globe";

interface Props {
    providerFilter: "ALL" | "AWS" | "GCP" | "Azure";
    setProviderFilter: React.Dispatch<React.SetStateAction<"ALL" | "AWS" | "GCP" | "Azure">>;

    exchangeFilter: string;
    setExchangeFilter: React.Dispatch<React.SetStateAction<string>>;

    arcsEnabled: boolean;
    setArcsEnabled: React.Dispatch<React.SetStateAction<boolean>>;

    autoRotate: boolean;
    setAutoRotate: React.Dispatch<React.SetStateAction<boolean>>;

    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

    latencyLimit: number;
    setLatencyLimit: React.Dispatch<React.SetStateAction<number>>;


    exchanges: Exchange[];
}


export default function ControlPanel({
    providerFilter, setProviderFilter,
    exchangeFilter, setExchangeFilter,
    arcsEnabled, setArcsEnabled,
    autoRotate, setAutoRotate,
    searchTerm, setSearchTerm,
    latencyLimit, setLatencyLimit,
    exchanges
}: Props) {
    const [open, setOpen] = useState(false);

        return (
            <div className="fixed bottom-0 left-0 right-0 z-30 md:absolute md:top-5 md:right-5 md:left-auto md:bottom-auto">
                
                <div className={`w-full md:mx-0 md:w-72 bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/50 shadow-lg text-gray-200 md:rounded-xl md:px-5 rounded-t-xl transition-all duration-300 overflow-hidden ${open ? 'max-h-[80vh] py-4' : 'max-h-14 py-2'} md:max-h-none md:overflow-visible md:py-4`}>

                    
                    <div className="flex items-center justify-between px-3 md:px-0">
                        <h3 className="font-semibold text-lg md:text-lg">
                            Controls
                        </h3>
                        <button
                            aria-label={open ? 'Close controls' : 'Open controls'}
                            onClick={() => setOpen(prev => !prev)}
                            className="md:hidden text-sm text-gray-300 px-2 py-1"
                        >
                            {open ? '▼' : '▲'}
                        </button>
                    </div>

                                
                                <div className="md:hidden px-1 mt-2 mb-1">
                                    <div className="flex items-center gap-4 overflow-x-auto text-xs">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                                            <span>AWS</span>
                                        </div>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                                            <span>GCP</span>
                                        </div>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                                            <span>Azure</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-3 md:px-0 mt-2 md:mt-3 overflow-auto">

            
            <input
                type="text"
                placeholder="Search Exchange..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm mb-3"
            />

            
            <label className="text-sm">Cloud Provider</label>
            <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-1 mt-1 mb-3 text-sm"
            >
                <option value="ALL">All</option>
                <option value="AWS">AWS</option>
                <option value="GCP">GCP</option>
                <option value="Azure">Azure</option>
            </select>

            
            <label className="text-sm">Exchange</label>
            <select
                value={exchangeFilter}
                onChange={(e) => setExchangeFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-1 mt-1 mb-3 text-sm"
            >
                <option value="ALL">All</option>
                {exchanges.map(e => (
                    <option key={e.name} value={e.name}>{e.name}</option>
                ))}
            </select>

            
            <label className="text-sm mb-1 block">Max Latency: <span className="text-blue-400">{latencyLimit}ms</span></label>
            <input
                type="range"
                min={50}
                max={500}
                value={latencyLimit}
                onChange={(e) => setLatencyLimit(Number(e.target.value))}
                className="w-full mb-3"
            />

            
            <label className="flex items-center justify-between text-sm mb-3 cursor-pointer">
                <span>Auto Rotate</span>

                <div
                    onClick={() => setAutoRotate(prev => !prev)}
                    className={`relative w-11 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer
      ${autoRotate ? "bg-blue-500" : "bg-gray-600"}`}
                >
                    <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all
        ${autoRotate ? "translate-x-5" : "translate-x-0"}`}
                    />
                </div>
            </label>


            
            <button
                onClick={() => setArcsEnabled(prev => !prev)}
                className="w-full text-center mt-2 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition text-sm"
            >
                {arcsEnabled ? 'Hide Latency Arcs' : 'Show Latency Arcs'}
            </button>
          </div>
        </div>

            </div>
    );
}
