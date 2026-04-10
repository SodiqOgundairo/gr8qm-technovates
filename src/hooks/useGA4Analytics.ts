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

/** Fetch traffic data from Supabase page_views table as fallback */
async function fetchFromPageViews(days: number): Promise<GA4TrafficStats> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const prevStart = new Date();
  prevStart.setDate(prevStart.getDate() - days * 2);
  const prevEnd = sinceISO;

  // Parallel queries
  const [
    { data: views },
    { count: prevCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase.from("page_views").select("path, referrer, device, created_at").gte("created_at", sinceISO).order("created_at", { ascending: true }),
    supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", prevStart.toISOString()).lt("created_at", prevEnd),
    supabase.from("page_views").select("*", { count: "exact", head: true }),
  ]);

  const rows = (views || []) as { path: string; referrer: string | null; device: string; created_at: string }[];
  const currentCount = rows.length;
  const previousCount = prevCount || 0;

  // Daily views
  const dailyMap = new Map<string, number>();
  for (const r of rows) {
    const day = r.created_at.split("T")[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  }
  const dailyViews = [...dailyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // Top pages
  const pageMap = new Map<string, number>();
  for (const r of rows) {
    pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
  }
  const topPages = [...pageMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, title: path, views }));

  // Referrers
  const refMap = new Map<string, number>();
  let directCount = 0;
  for (const r of rows) {
    if (!r.referrer) {
      directCount++;
    } else {
      try {
        const host = new URL(r.referrer).hostname;
        refMap.set(host, (refMap.get(host) || 0) + 1);
      } catch {
        refMap.set(r.referrer, (refMap.get(r.referrer) || 0) + 1);
      }
    }
  }
  const topReferrers = [...refMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  // Devices
  const devices = { desktop: 0, tablet: 0, mobile: 0 };
  for (const r of rows) {
    if (r.device === "tablet") devices.tablet++;
    else if (r.device === "mobile") devices.mobile++;
    else devices.desktop++;
  }

  // Trend
  const viewsTrend = previousCount > 0
    ? Math.round(((currentCount - previousCount) / previousCount) * 100)
    : 0;

  return {
    totalViews: totalCount || currentCount,
    last30Views: currentCount,
    sessions30: currentCount, // approximate: 1 view ≈ 1 session for page_views
    bounceRate: 0,
    avgPagesPerSession: "1",
    topPages,
    dailyViews,
    topReferrers,
    directTraffic: directCount,
    devices,
    viewsTrend,
    sessionsTrend: viewsTrend,
  };
}

export function useGA4Analytics(days = 30) {
  const [stats, setStats] = useState<GA4TrafficStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"ga4" | "supabase" | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Try GA4 edge function first
    supabase.functions
      .invoke("ga4-analytics", { body: { days } })
      .then(({ data, error: fnError }) => {
        if (cancelled) return;
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        setStats(data);
        setSource("ga4");
        setLoading(false);
      })
      .catch(async () => {
        // Fallback to Supabase page_views
        if (cancelled) return;
        try {
          const fallback = await fetchFromPageViews(days);
          if (!cancelled) {
            setStats(fallback);
            setSource("supabase");
            setLoading(false);
          }
        } catch (fbErr) {
          if (!cancelled) {
            const msg = fbErr instanceof Error ? fbErr.message : String(fbErr);
            console.warn("Analytics fallback failed:", msg);
            setError(msg);
            setStats(EMPTY_STATS);
            setSource(null);
            setLoading(false);
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [days]);

  return { stats, loading, error, source };
}
