import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { trackPageView } from "../lib/ga4";

/**
 * Logs every route change to:
 * 1. GA4 via gtag.js (client-side)
 * 2. Supabase page_views table (first-party fallback)
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Skip admin routes
    if (location.pathname.startsWith("/admin")) return;

    // Small delay to let document.title update (react-helmet-async, SEO component)
    const timeout = setTimeout(() => {
      // 1. Fire GA4 page_view event
      trackPageView(location.pathname, document.title);

      // 2. Record in Supabase page_views table
      const referrer = document.referrer || null;
      const userAgent = navigator.userAgent;
      const isMobile = /Mobi|Android/i.test(userAgent);
      const isTablet = /Tablet|iPad/i.test(userAgent);
      const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

      supabase
        .from("page_views")
        .insert({
          path: location.pathname,
          referrer,
          device,
          user_agent: userAgent.slice(0, 500),
        })
        .then(() => {});
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);
}
