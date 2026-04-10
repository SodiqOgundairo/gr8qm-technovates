import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export interface GA4TrafficStats {
  totalViews: number;
  last30Views: number;
  sessions30: number;
  bounceRate: number;
  avgPagesPerSession: string;
  topPages: { path: string; title: string; views: number }[];
  dailyViews: { date: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  directTraffic: number;
  devices: { desktop: number; tablet: number; mobile: number };
  viewsTrend: number;
  sessionsTrend: number;
}

const EMPTY_STATS: GA4TrafficStats = {
  totalViews: 0,
  last30Views: 0,
  sessions30: 0,
  bounceRate: 0,
  avgPagesPerSession: "0",
  topPages: [],
  dailyViews: [],
  topReferrers: [],
  directTraffic: 0,
  devices: { desktop: 0, tablet: 0, mobile: 0 },
  viewsTrend: 0,
  sessionsTrend: 0,
};

export function useGA4Analytics(days = 30) {
  const [stats, setStats] = useState<GA4TrafficStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke("ga4-analytics", { body: { days } })
      .then(({ data, error: fnError }) => {
        if (cancelled) return;
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err?.message || String(err);
          console.warn("GA4 analytics fetch failed:", msg);
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [days]);

  return { stats, loading, error };
}
