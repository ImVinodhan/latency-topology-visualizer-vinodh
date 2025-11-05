import { Exchange } from "@/types/globe";

export const exchanges: Exchange[] = [
  // Tokyo
  { name: "Binance Futures", lat: 35.6895, lng: 139.6917, provider: "AWS" },

  // Hong Kong
  { name: "OKX Hong Kong", lat: 22.3193, lng: 114.1694, provider: "GCP" },

  // ——— Singapore region cluster (spread across nearby cities) ———
  // Keep one in Singapore, move others to close-by cities to avoid overlap
  { name: "Bybit",            lat: 1.3521,  lng: 103.8198, provider: "Azure" },   // Singapore
  { name: "OKX Singapore",    lat: 1.4927,  lng: 103.7413, provider: "AWS" },     // Johor Bahru, MY (~30 km N)
  { name: "KuCoin",           lat: 1.0456,  lng: 104.0305, provider: "GCP" },     // Batam, ID (~20–50 km S)

  // Amsterdam
  { name: "Deribit",          lat: 52.3676, lng: 4.9041,   provider: "AWS" },

  // US East corridor
  { name: "Kraken US",        lat: 39.0438, lng: -77.4874, provider: "Azure" },   // Ashburn, VA
  { name: "Coinbase Exchange",lat: 40.7891, lng: -74.0565, provider: "AWS" },     // Secaucus, NJ

  // London
  { name: "Bitstamp",         lat: 51.5099, lng: -0.1181,  provider: "AWS" },

  // Switzerland
  { name: "Bitfinex",         lat: 47.1662, lng: 8.5160,   provider: "GCP" },
];

export const providers = [
  { name: 'AWS – Tokyo',     provider: 'AWS',  lat: 35.6895, lng: 139.6917 },
  { name: 'GCP – Hong Kong', provider: 'GCP',  lat: 22.3193, lng: 114.1694 },
  { name: 'Azure – Singapore', provider: 'Azure', lat: 1.3521, lng: 103.8198 },
];
