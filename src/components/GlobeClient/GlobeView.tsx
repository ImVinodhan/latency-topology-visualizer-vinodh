import Globe, { GlobeMethods } from 'react-globe.gl';
import { useEffect } from 'react';
import { LatencyArc, Exchange } from '@/types/globe';

interface Props {
  globeRef: React.RefObject<GlobeMethods | null>;
  markers: Exchange[];
  arcs: LatencyArc[];
  setHovered: (e: Exchange | null) => void;
  setSelectedExchange: (name: string | null) => void;
  autoRotate: boolean;
}

export default function GlobeView({ globeRef, markers, arcs, setHovered, setSelectedExchange, autoRotate }: Props) {
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.5;
    }
  }, [autoRotate]);

  return (
    <div className="absolute inset-0">
      <Globe
          ref={globeRef as unknown as React.MutableRefObject<GlobeMethods | undefined>}
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
          arcsData={arcs as any}
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
  );
}
