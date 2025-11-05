export interface Exchange {
    name: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    lat: number;
    lng: number;
    color?: string;
}

export interface LatencyArc {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    latency: number;
    color: string;
    exchange: string;
}
