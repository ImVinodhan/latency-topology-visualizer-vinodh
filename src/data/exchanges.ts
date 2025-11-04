export interface Exchange {
  name: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  lat: number;
  lng: number;
  color?: string;
}

export const exchanges: Exchange[] = [
  { name: 'Binance – Tokyo', provider: 'AWS', lat: 35.6895, lng: 139.6917 },
  { name: 'Bybit – Singapore', provider: 'Azure', lat: 1.3521, lng: 103.8198 },
  { name: 'OKX – Hong Kong', provider: 'GCP', lat: 22.3193, lng: 114.1694 },
  { name: 'Deribit – Amsterdam', provider: 'AWS', lat: 52.3676, lng: 4.9041 },
  { name: 'Coinbase – New York', provider: 'Azure', lat: 40.7128, lng: -74.006 },
];

export const providers = [
  { name: 'AWS – Tokyo', provider: 'AWS', lat: 35.6895, lng: 139.6917 },
  { name: 'GCP – Hong Kong', provider: 'GCP', lat: 22.3193, lng: 114.1694 },
  { name: 'Azure – Singapore', provider: 'Azure', lat: 1.3521, lng: 103.8198 },
];
