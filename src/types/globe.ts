export interface Exchange {
    name: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    lat: number;
    lng: number;
    color?: string;
}

export type LatencyArc = {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  latency: number;
  color: string;
  exchange: string;
  timestamp: number;
};
