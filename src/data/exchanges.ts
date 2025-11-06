import { Exchange } from "@/types/globe";

export const exchanges: Exchange[] = [
  // Tokyo (Equinix TY3, Binance Futures)
  { name: "Binance Futures", lat: 35.6895, lng: 139.6917, provider: "AWS" },

  // Hong Kong (Equinix HK2)
  { name: "OKX Hong Kong", lat: 22.3193, lng: 114.1694, provider: "GCP" },

  // SG Region Cluster
  { name: "Bybit", lat: 1.3521, lng: 103.8198, provider: "Azure" },
  { name: "OKX Singapore", lat: 1.4927, lng: 103.7413, provider: "AWS" },
  { name: "KuCoin", lat: 1.0456, lng: 104.0305, provider: "GCP" },

  // Amsterdam (AM4)
  { name: "Deribit", lat: 52.3676, lng: 4.9041, provider: "AWS" },

  // US East DC corridor
  { name: "Kraken US", lat: 39.0438, lng: -77.4874, provider: "Azure" },
  { name: "Coinbase Exchange", lat: 40.7891, lng: -74.0565, provider: "AWS" },

  // London LD4
  { name: "Bitstamp", lat: 51.5099, lng: -0.1181, provider: "AWS" },

  // Zug / Switzerland Crypto Valley
  { name: "Bitfinex", lat: 47.1662, lng: 8.5160, provider: "GCP" },
];

export const providers = [
  { name: "AWS – Tokyo", provider: "AWS", lat: 35.6895, lng: 139.6917 },
  { name: "GCP – Hong Kong", provider: "GCP", lat: 22.3193, lng: 114.1694 },
  { name: "Azure – Singapore", provider: "Azure", lat: 1.3521, lng: 103.8198 },
];
