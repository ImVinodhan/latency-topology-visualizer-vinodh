'use client';

import { useRef, useEffect, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { useLatency } from '@/context/LatencyContext';
import { exchanges } from '@/data/exchanges';

const providerColors = {
  AWS: '#f59e0b',
  GCP: '#3b82f6',
  Azure: '#22c55e',
} as const;

export default function GlobeClient() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { arcs, loading, error } = useLatency();

  const markers = useMemo(
    () =>
      exchanges.map((ex) => ({
        ...ex,
        color: providerColors[ex.provider],
      })),
    []
  );

  const globeArcs = useMemo(
    () =>
      arcs.map((a) => ({
        startLat: a.startLat,
        startLng: a.startLng,
        endLat: a.endLat,
        endLng: a.endLng,
        color: a.color,
        latency: a.latency,
        exchange: a.exchange,
      })),
    [arcs]
  );

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    g.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

    const controls = g.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0c1a]">
      {loading && (
        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-md bg-yellow-600/90 text-white text-xs sm:text-sm">
          Fetching latency...
        </div>
      )}
      {error && (
        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-md bg-red-600/90 text-white text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe
          ref={globeRef}
          width={undefined}
          height={undefined}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          backgroundColor="rgba(0,0,0,0)"
          labelsData={markers as any}
          labelLat={((m: any) => m.lat) as any}
          labelLng={((m: any) => m.lng) as any}
          labelText={((m: any) => m.name) as any}
          labelColor={((m: any) => m.color) as any}
          labelSize={(m: any) => (window.innerWidth < 768 ? 0.8 : 1.2)}
          labelDotRadius={(m: any) => (window.innerWidth < 768 ? 0.25 : 0.35)}
          atmosphereAltitude={0.3}
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

      <div
        className="
    absolute bottom-9 left-5
    flex flex-col gap-3
    text-gray-200 text-[0.85rem] sm:text-sm
    bg-[#0f172a]/90 backdrop-blur-md
    px-4 py-3
    rounded-xl shadow-lg border border-gray-700/50
    z-20 w-[150px] sm:w-[180px]
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
    </div>
  );
}
