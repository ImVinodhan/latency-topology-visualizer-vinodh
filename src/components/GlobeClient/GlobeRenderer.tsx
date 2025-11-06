'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useLatency } from '@/context/LatencyContext';
import { exchanges } from '@/data/exchanges';
import { Exchange, LatencyArc } from '@/types/globe';

import LatencyChart from '../LatencyChart';
import ControlPanel from './ControlPanel';
import GlobeView from './GlobeView';
import Legend from './Legend';
import Tooltip from './Tooltip';
import PerformancePanel from './PerformancePanel';

const providerColors = {
  AWS: '#f59e0b',
  GCP: '#3b82f6',
  Azure: '#22c55e',
} as const;

export default function GlobeClient() {
  const { arcs } = useLatency();
  const globeRef = useRef(null);

  const [hovered, setHovered] = useState<Exchange | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [providerFilter, setProviderFilter] = useState<'ALL' | 'AWS' | 'GCP' | 'Azure'>('ALL');
  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [arcsEnabled, setArcsEnabled] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [latencyLimit, setLatencyLimit] = useState(400);

  const exchangeProviderMap = useMemo(() => {
    const map = new Map();
    exchanges.forEach(e => map.set(e.name, e.provider));
    return map;
  }, []);

  const markers = useMemo(
    () =>
      exchanges
        .filter(ex => (providerFilter === 'ALL' ? true : ex.provider === providerFilter))
        .filter(ex => (exchangeFilter === 'ALL' ? true : ex.name === exchangeFilter))
        .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(ex => ({ ...ex, color: providerColors[ex.provider] })),
    [providerFilter, exchangeFilter, searchTerm]
  );

  const globeArcs = useMemo(() => {
    if (!arcsEnabled) return [];

    return arcs
      .filter(a => (exchangeFilter === 'ALL' ? true : a.exchange === exchangeFilter))
      .filter(a => {
        if (providerFilter === 'ALL') return true;
        return exchangeProviderMap.get(a.exchange) === providerFilter;
      })
      .filter(a => a.latency <= latencyLimit)
      .map(a => ({ ...a }));
  }, [arcs, arcsEnabled, providerFilter, exchangeFilter, latencyLimit, exchangeProviderMap]);


  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white dark:bg-[#0a0c1a] transition-colors duration-300"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <PerformancePanel />

      <ControlPanel
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        exchangeFilter={exchangeFilter}
        setExchangeFilter={setExchangeFilter}
        arcsEnabled={arcsEnabled}
        setArcsEnabled={setArcsEnabled}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        latencyLimit={latencyLimit}
        setLatencyLimit={setLatencyLimit}
        exchanges={exchanges}
      />


      <GlobeView
        globeRef={globeRef}
        markers={markers}
        arcs={globeArcs}
        setHovered={setHovered}
        setSelectedExchange={setSelectedExchange}
        autoRotate={autoRotate}
      />

      <Legend providerColors={providerColors} />

      {hovered && (
        <Tooltip hovered={hovered} mousePos={mousePos} />
      )}

      <LatencyChart
        exchange={selectedExchange}
        onClose={() => setSelectedExchange(null)}
      />
    </div>
  );
}
