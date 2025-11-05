'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { useLatency } from '@/context/LatencyContext';
import { exchanges } from '@/data/exchanges';
import LatencyChart from './LatencyChart';
import { Exchange, LatencyArc } from '@/types/globe';

const providerColors = {
  AWS: '#f59e0b',
  GCP: '#3b82f6',
  Azure: '#22c55e',
} as const;

export default function GlobeClient() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { arcs, loading, error } = useLatency();

  // UI state
  const [hovered, setHovered] = useState<any | null>(null);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [targetSpeed] = React.useState(0.5); // Normal rotation speed
  const mousePos = useRef({ x: 0, y: 0 });
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [providerFilter, setProviderFilter] = useState<'ALL' | 'AWS' | 'GCP' | 'Azure'>('ALL');
  const [exchangeFilter, setExchangeFilter] = useState<string>('ALL');
  const [arcsEnabled, setArcsEnabled] = useState<boolean>(true);

  // Fast lookup from exchange name -> provider (so arcs can be filtered by provider)
  const exchangeProviderMap = useMemo(() => {
    const map = new Map<string, 'AWS' | 'GCP' | 'Azure'>();
    exchanges.forEach(ex => map.set(ex.name, ex.provider));
    return map;
  }, []);

  // Filtered + colored markers
  const markers = useMemo(
    () =>
      exchanges
        .filter(ex => (providerFilter === 'ALL' ? true : ex.provider === providerFilter))
        .filter(ex => (exchangeFilter === 'ALL' ? true : ex.name === exchangeFilter))
        .map(ex => ({ ...ex, color: providerColors[ex.provider] })),
    [providerFilter, exchangeFilter]
  );

  // Filter arcs by provider/exchange; hide when arcsEnabled = false
  const globeArcs = useMemo(() => {
    if (!arcsEnabled) return [];
    return arcs
      .filter(a => (exchangeFilter === 'ALL' ? true : a.exchange === exchangeFilter))
      .filter(a => {
        if (providerFilter === 'ALL') return true;
        const exProv = exchangeProviderMap.get(a.exchange);
        return exProv === providerFilter;
      })
      .map(a => ({
        startLat: a.startLat,
        startLng: a.startLng,
        endLat: a.endLat,
        endLng: a.endLng,
        color: a.color,
        latency: a.latency,
        exchange: a.exchange
      }));
  }, [arcs, arcsEnabled, providerFilter, exchangeFilter, exchangeProviderMap]);

  // Globe init: camera, controls, lights
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    g.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

    const controls = g.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = targetSpeed;
      controls.enableDamping = true;
      controls.dampingFactor = 0.04;
    }

    const scene = g.scene();
    if (scene && !scene.getObjectByName('custom-light')) {
      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      const directional = new THREE.DirectionalLight(0xffffff, 0.8);
      directional.position.set(1, 1, 1);
      directional.name = 'custom-light';
      scene.add(ambient);
      scene.add(directional);
    }
  }, []);
  const smoothToggleAutoRotate = () => {
    const g = globeRef.current;
    if (!g) return;

    const controls = g.controls();
    if (!controls) return;

    const isTurningOn = !autoRotate;
    setAutoRotate(isTurningOn);

    const start = controls.autoRotateSpeed;
    const end = isTurningOn ? targetSpeed : 0;

    const duration = 700;
    const frames = 30;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const t = frame / frames;
      const eased = t * t * (3 - 2 * t); // smooth easing
      controls.autoRotateSpeed = start + (end - start) * eased;

      if (frame >= frames) clearInterval(interval);
    }, duration / frames);

    controls.autoRotate = true; // Keep feature active
  };


  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white dark:bg-[#0a0c1a] transition-colors duration-300"
      onMouseMove={(e) => {
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
      }}
    >

      {/* Loading / Error badges */}
      {error && (
        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-md bg-red-600/90 text-white text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Controls (filters + toggle) */}
      <div className="absolute top-5 right-5 z-30 bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/50 shadow-lg rounded-xl px-5 py-4 text-gray-200 w-64">
        <h3 className="font-semibold text-lg mb-3 border-b border-gray-600 pb-1">
          Controls
        </h3>

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
          {exchanges.map((e) => (
            <option key={e.name} value={e.name}>{e.name}</option>
          ))}
        </select>

        <button
          onClick={() => setArcsEnabled(prev => !prev)}
          className="w-full text-center mt-2 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition text-sm"
        >
          {arcsEnabled ? 'Hide Latency Arcs' : 'Show Latency Arcs'}
        </button>
      </div>

      {/* Globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe
          ref={globeRef}
          width={undefined}
          height={undefined}
          enablePointerInteraction={true}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          labelsData={markers as any}
          labelLat={(m: any) => m.lat}
          labelLng={(m: any) => m.lng}
          labelText={(m: any) => m.name}
          labelColor={(m: any) => m.color}
          labelSize={(m: any) => (window.innerWidth < 768 ? 0.8 : 1.2)}
          labelDotRadius={(m: any) => (window.innerWidth < 768 ? 0.25 : 0.35)}
          onLabelHover={(obj: any) => {
            setHovered(obj);
            document.body.style.cursor = obj ? 'pointer' : 'default';
          }}
          onLabelClick={(obj: any) => setSelectedExchange(obj?.name ?? null)}
          atmosphereColor="cyan"
          atmosphereAltitude={0.35}
          arcsData={globeArcs as any}
          arcStartLat={'startLat' as any}
          arcStartLng={'startLng' as any}
          arcEndLat={'endLat' as any}
          arcEndLng={'endLng' as any}
          arcColor={(d: any) => [d.color, d.color] as any}
          arcDashLength={0.45}
          arcDashGap={0.02}
          arcDashAnimateTime={4000}
        />
      </div>

      {/* Legend */}
      <div
        className="
          absolute bottom-9 left-5
          flex flex-col gap-3
          text-gray-200 text-[0.85rem] sm:text-sm
          bg-[#0f172a]/90 backdrop-blur-md
          px-4 py-3
          rounded-xl shadow-lg border border-gray-700/50
          z-20 w-[160px] sm:w-[190px]
        "
      >
        <h3 className="font-semibold text-white text-sm sm:text-base border-b border-gray-700/70 pb-1">
          Legend
        </h3>
        <div className="flex flex-col gap-2">
          {Object.entries(providerColors).map(([prov, color]) => (
            <div key={prov} className="flex items-center justify-start gap-2">
              <span
                className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md ring-1 ring-white/30"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap leading-none">
                {prov}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Tooltip (uses tracked mouse position) */}
      {hovered && (
        <div
          className="
            absolute z-30 px-3 py-2 text-xs sm:text-sm
            bg-gray-900/90 backdrop-blur-md
            border border-gray-700
            rounded-lg shadow-md text-white
            pointer-events-none
          "
          style={{
            left: mousePos.current.x + 12,
            top: mousePos.current.y - 20
          }}

        >
          <div className="font-semibold">{hovered.name}</div>
          <div className="text-[11px] text-gray-300">
            Cloud: <span className="font-medium">{hovered.provider}</span>
          </div>
        </div>
      )}

      {/* Historical chart modal */}
      <LatencyChart exchange={selectedExchange} onClose={() => setSelectedExchange(null)} />
      <div
        onClick={smoothToggleAutoRotate}
        className="absolute bottom-9 right-6 z-30 flex items-center gap-3 cursor-pointer select-none"
      >
        <span className="text-gray-300 text-sm">Auto Rotate</span>

        <div
          className={`
      relative w-11 h-6 flex items-center rounded-full transition
      ${autoRotate ? "bg-blue-500" : "bg-gray-600"}
    `}
        >
          <div
            className={`
        w-5 h-5 bg-white rounded-full shadow transform transition
        ${autoRotate ? "translate-x-5" : "translate-x-1"}
      `}
          />
        </div>
      </div>
    </div>
  );
}
