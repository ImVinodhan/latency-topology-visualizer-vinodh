'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { exchanges, providers } from '@/data/exchanges';
import { LatencyArc } from '@/types/globe';

export type ProviderKind = 'AWS' | 'GCP' | 'Azure';

type LatencyContextValue = {
  arcs: LatencyArc[];
  history: LatencyArc[][];
  loading: boolean;
  error: string | null;
  refreshNow: () => Promise<void>;
  setUpdateIntervalMs: (ms: number) => void;
};

const LatencyContext = createContext<LatencyContextValue | undefined>(undefined);

const getLatencyColor = (latency: number) => {
  if (latency < 100) return '#22c55e'; // green
  if (latency < 200) return '#facc15'; // yellow
  return '#ef4444'; // red
};

const DEFAULT_INTERVAL = 5000;
const HISTORY_LIMIT = 300;

export function LatencyProvider({ children }: { children: React.ReactNode }) {
  const [arcs, setArcs] = useState<LatencyArc[]>([]);
  const historyRef = useRef<LatencyArc[][]>([]);
  const [history, setHistory] = useState<LatencyArc[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number>(DEFAULT_INTERVAL);
  const timerRef = useRef<number | null>(null);
  const isMounted = useRef(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchLatencySnapshot = useCallback(async (): Promise<LatencyArc[]> => {
    try {
      await new Promise((r) => setTimeout(r, 60));
      const snap: LatencyArc[] = exchanges.map((ex) => {
        const provider = providers.find((p) => p.provider === ex.provider)!;
        const latency = Math.floor(Math.random() * 300);
        return {
          id: `${ex.name}__${Date.now()}`,
          startLat: ex.lat,
          startLng: ex.lng,
          endLat: provider.lat,
          endLng: provider.lng,
          latency,
          color: getLatencyColor(latency),
          exchange: ex.name,
          timestamp: Date.now(),
        };
      });
      return snap;
    } catch (err: any) {
      throw new Error(err?.message || 'Unknown fetch error');
    }
  }, []);

  const pushSnapshot = useCallback((snapshot: LatencyArc[]) => {
    setArcs(snapshot);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    setHistory([...historyRef.current]);
  }, []);

  const refreshNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await fetchLatencySnapshot();
      pushSnapshot(snap);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch latency');
    } finally {
      setLoading(false);
    }
  }, [fetchLatencySnapshot, pushSnapshot]);

  useEffect(() => {
    if (!mounted) return;

    isMounted.current = true;

    const run = async () => {
      setLoading(true);
      try {
        const snap = await fetchLatencySnapshot();
        if (!isMounted.current) return;
        pushSnapshot(snap);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch latency');
      } finally {
        setLoading(false);
      }
    };

    run();

    timerRef.current = window.setInterval(run, intervalRef.current);

    return () => {
      isMounted.current = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [mounted, fetchLatencySnapshot, pushSnapshot]);

  const setUpdateIntervalMs = useCallback(
    (ms: number) => {
      intervalRef.current = ms;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = window.setInterval(async () => {
          try {
            const snap = await fetchLatencySnapshot();
            pushSnapshot(snap);
          } catch (err: any) {
            setError(err.message || 'Failed to fetch latency');
          }
        }, ms);
      }
    },
    [fetchLatencySnapshot, pushSnapshot]
  );

  if (!mounted) return null;

  const value: LatencyContextValue = {
    arcs,
    history,
    loading,
    error,
    refreshNow,
    setUpdateIntervalMs,
  };

  return (
    <LatencyContext.Provider value={value}>
      {children}
    </LatencyContext.Provider>
  );
}

export function useLatency() {
  const ctx = useContext(LatencyContext);
  if (!ctx) throw new Error('useLatency must be used within LatencyProvider');
  return ctx;
}
